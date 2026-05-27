"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  headContent: string;
  bodyContent: string;
  scriptSource: string;
}

/**
 * Client Component that mounts the prototype HTML inside the React tree.
 *
 * Why this is more involved than it looks:
 *
 *   - The prototype lives as a single static HTML file under public/.
 *     We inline its body via dangerouslySetInnerHTML and inject its inline
 *     script after the body has flushed to the DOM.
 *
 *   - The prototype's inline script attaches click listeners by direct
 *     reference: `document.getElementById('runDemo').addEventListener(...)`.
 *     If that node is later replaced for ANY reason (React hydration
 *     re-running, an HMR cycle, dangerouslySetInnerHTML being re-applied
 *     after a re-render, even momentarily), the listener is on a now-orphan
 *     node and clicks on the live node do nothing.
 *
 *   - To make the demo bulletproof against that whole class of failure, we
 *     ALSO install document-level event delegation here. Any click on a
 *     descendant of #runDemo or #pauseDemo triggers a CustomEvent that the
 *     prototype's inline script listens for. Even if the prototype's own
 *     direct-reference listener ends up orphaned, the delegation path still
 *     works. The prototype script was updated to listen for these custom
 *     events as a fallback.
 *
 *   - We mount the inline script in useEffect (after hydration). We do NOT
 *     defer with requestAnimationFrame: RAFs are throttled to ~0 Hz in
 *     hidden tabs, which would mean the demo button never wires up if a
 *     user opens the page in a background tab. dangerouslySetInnerHTML is
 *     synchronous so the body is in the DOM by the time useEffect runs.
 */
export default function PlatformClient({
  headContent,
  bodyContent,
  scriptSource,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const headHost = document.createElement("div");
    headHost.innerHTML = headContent;
    const injected: Node[] = [];

    Array.from(headHost.children).forEach((el) => {
      const tag = el.tagName;
      if (tag === "LINK") {
        const clone = el.cloneNode(true) as HTMLLinkElement;
        document.head.appendChild(clone);
        injected.push(clone);
      } else if (tag === "STYLE") {
        const clone = el.cloneNode(true) as HTMLStyleElement;
        document.head.appendChild(clone);
        injected.push(clone);
      } else if (tag === "SCRIPT") {
        const src = (el as HTMLScriptElement).src;
        const inline = el.textContent || "";
        const scriptEl = document.createElement("script");
        if (src) {
          scriptEl.src = src;
          scriptEl.async = true;
        } else if (inline) {
          scriptEl.textContent = inline;
        }
        document.head.appendChild(scriptEl);
        injected.push(scriptEl);
      }
    });

    // ----------------------------------------------------------------------
    // Document-level event delegation for the prototype's interactive buttons.
    //
    // This is the load-bearing fix for "Run demo does nothing in production".
    // The prototype script attaches its own listeners by direct node reference,
    // which is brittle: if the node it captured ever stops being the live one
    // (hydration replay, React reconciliation, an HMR cycle, Tailwind CDN
    // touching the DOM, anything), clicks on the visible button fall on the
    // floor.
    //
    // The delegated listener below is attached to `document` once and never
    // moves. It re-resolves `#runDemo` / `#pauseDemo` from the live DOM on
    // every click, then dispatches a CustomEvent (`advisens:run-demo` etc.)
    // that the prototype script listens for. This survives any DOM churn.
    // ----------------------------------------------------------------------
    const onDocClick = (e: MouseEvent) => {
      const target = e.target as Element | null;
      if (!target || !target.closest) return;
      const runEl = target.closest("#runDemo");
      if (runEl) {
        document.dispatchEvent(new CustomEvent("advisens:run-demo"));
        return;
      }
      const pauseEl = target.closest("#pauseDemo");
      if (pauseEl) {
        document.dispatchEvent(new CustomEvent("advisens:pause-demo"));
        return;
      }
    };
    document.addEventListener("click", onDocClick);

    // Mount the prototype's inline script. dangerouslySetInnerHTML has
    // already flushed to the DOM by the time useEffect runs, so no RAF gating
    // is needed. We append a small bootstrap before the prototype source that
    // wires the CustomEvents back into the runDemo() / togglePause() calls
    // inside the prototype's IIFE.
    //
    // The bootstrap uses an event listener that resolves the functions
    // dynamically by name from the IIFE's scope -- since the prototype script
    // ends with `})()` after the listener attachments, we instead wrap the
    // ENTIRE prototype in an outer IIFE that also installs the CustomEvent
    // listeners on document. This way runDemo and togglePause are in scope.
    let inlineScriptEl: HTMLScriptElement | null = null;
    try {
      inlineScriptEl = document.createElement("script");
      inlineScriptEl.textContent =
        "try { (function() {\n" +
        scriptSource +
        "\n" +
        // Robust fallback wiring: re-bind on every CustomEvent dispatch using
        // the functions defined above in the same IIFE scope.
        "document.addEventListener('advisens:run-demo', function() {" +
        "  try { runDemo(); } catch (e) { console.error('[advisens] runDemo() failed', e); }" +
        "});" +
        "document.addEventListener('advisens:pause-demo', function() {" +
        "  try { togglePause(); } catch (e) { console.error('[advisens] togglePause() failed', e); }" +
        "});" +
        "\n})(); } catch (e) { console.error('[advisens platform] script failed', e); }";
      document.body.appendChild(inlineScriptEl);
    } catch (e) {
      console.error("[advisens platform] failed to mount inline script", e);
    }
    setReady(true);

    return () => {
      document.removeEventListener("click", onDocClick);
      injected.forEach((node) => {
        if (node.parentNode) node.parentNode.removeChild(node);
      });
      if (inlineScriptEl && inlineScriptEl.parentNode) {
        inlineScriptEl.parentNode.removeChild(inlineScriptEl);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const w = window as any;
      if (w.__advisensPlatformHeroTimer) {
        clearInterval(w.__advisensPlatformHeroTimer);
        w.__advisensPlatformHeroTimer = null;
      }
    };
  }, [headContent, bodyContent, scriptSource]);

  return (
    <>
      <div
        key="host"
        ref={containerRef}
        id="platform-prototype-host"
        className="text-slate-100 bg-[#0a0e16]"
        dangerouslySetInnerHTML={{ __html: bodyContent }}
      />
      <div
        key="overlay"
        aria-hidden={ready}
        className={
          "fixed inset-0 grid place-items-center bg-[#0a0e16] z-[60] transition-opacity duration-200 " +
          (ready ? "opacity-0 pointer-events-none" : "opacity-100")
        }
      >
        <div className="text-center">
          <div className="inline-block h-6 w-6 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin mb-3" />
          <div className="text-[11px] uppercase tracking-[0.18em] text-white/45">
            Loading prototype
          </div>
        </div>
      </div>
    </>
  );
}
