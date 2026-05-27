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
 * Injection order is deliberate:
 *   1. Inject head <link>, <style>, <script src> tags into document.head
 *      so fonts, custom CSS, and the Tailwind CDN start fetching.
 *   2. Render the body markup via dangerouslySetInnerHTML inside React.
 *   3. After two animation frames (enough for React to flush the DOM and
 *      Tailwind to do an initial pass), append the inline script so the
 *      demo orchestration, hero cycling, scroll reveal, etc. can attach
 *      to the elements that now exist.
 *
 * We do NOT wait on the Tailwind CDN script onload event because it has
 * proven unreliable in production (the promise sometimes never resolves
 * and the inline scripts never run, leaving the page interactive-dead).
 * Tailwind still styles the page as soon as the CDN finishes loading
 * regardless of script timing.
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

    // Append the inline script after the body markup is in the DOM.
    // Two RAFs give React time to flush dangerouslySetInnerHTML AND let the
    // Tailwind CDN do its first DOM pass on the freshly-injected content.
    let inlineScriptEl: HTMLScriptElement | null = null;
    const mountScript = () => {
      try {
        inlineScriptEl = document.createElement("script");
        inlineScriptEl.textContent =
          "try { (function() {\n" +
          scriptSource +
          "\n})(); } catch (e) { console.error('[advisens platform] script failed', e); }";
        document.body.appendChild(inlineScriptEl);
      } catch (e) {
        console.error("[advisens platform] failed to mount inline script", e);
      }
      setReady(true);
    };

    requestAnimationFrame(() => {
      requestAnimationFrame(mountScript);
    });

    return () => {
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
      {/*
        The host div MUST stay at the same fragment position across renders
        AND have a stable key. If we conditionally render the overlay before
        it, React reconciles by index and may reuse the overlay div as the
        host (or vice versa) when `ready` flips, destroying the original
        host DOM node and detaching the event listeners attached by the
        injected script. Keeping the host first and always rendering the
        overlay (toggling visibility via opacity + pointer-events) avoids
        the reconciliation swap entirely.
      */}
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
