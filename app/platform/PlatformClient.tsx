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
 * - Injects head <link>, <style>, <script src> tags into document.head so
 *   fonts, custom CSS, and the Tailwind CDN are available.
 * - Renders body content via dangerouslySetInnerHTML inside the React tree.
 * - Runs all inline scripts after the body markup is in the DOM AND after
 *   the Tailwind CDN script has loaded (otherwise utility classes do not
 *   resolve and the agent panel button handlers are attached before the
 *   target elements exist).
 *
 * On unmount, every injected head node and the inline script element is
 * removed and any cycling timers stored on `window.__advisensPlatform` are
 * cleared so the prototype tears down cleanly when navigating away.
 */
export default function PlatformClient({
  headContent,
  bodyContent,
  scriptSource,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // ---- 1. inject head fragments ----
    const headHost = document.createElement("div");
    headHost.innerHTML = headContent;
    const injected: Node[] = [];

    // Track Tailwind CDN load so we run inline scripts only afterwards.
    let tailwindLoaded = false;
    const tailwindLoadPromise = new Promise<void>((resolve) => {
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
            scriptEl.async = false;
            scriptEl.onload = () => {
              tailwindLoaded = true;
              resolve();
            };
            scriptEl.onerror = () => resolve(); // fail open
          } else if (inline) {
            scriptEl.textContent = inline;
            // inline = ready immediately
            queueMicrotask(() => resolve());
          }
          document.head.appendChild(scriptEl);
          injected.push(scriptEl);
        }
      });
      // No script tag found → resolve right away
      if (!Array.from(headHost.children).some((el) => el.tagName === "SCRIPT")) {
        resolve();
      }
    });

    // ---- 2. wait for Tailwind, then mount inline scripts ----
    let inlineScriptEl: HTMLScriptElement | null = null;
    tailwindLoadPromise.then(() => {
      // Tailwind CDN replaces class attributes by reading the DOM. Give it a
      // microtask to process the freshly-injected body content before we run
      // the demo orchestration scripts.
      requestAnimationFrame(() => {
        inlineScriptEl = document.createElement("script");
        inlineScriptEl.textContent = `(function() {
          ${scriptSource}
        })();`;
        document.body.appendChild(inlineScriptEl);
        setReady(true);
        // Tag the run on window so a hot reload can clean it up.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).__advisensPlatformMounted = true;
      });
    });

    return () => {
      // Cleanup on unmount
      injected.forEach((node) => {
        if (node.parentNode) node.parentNode.removeChild(node);
      });
      if (inlineScriptEl && inlineScriptEl.parentNode) {
        inlineScriptEl.parentNode.removeChild(inlineScriptEl);
      }
      // Clear any cycling timers the prototype set up
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const w = window as any;
      if (w.__advisensPlatformHeroTimer) {
        clearInterval(w.__advisensPlatformHeroTimer);
        w.__advisensPlatformHeroTimer = null;
      }
      w.__advisensPlatformMounted = false;
      // Also strip the body classes the prototype expects
      void tailwindLoaded;
    };
  }, [headContent, bodyContent, scriptSource]);

  return (
    <>
      {/* Loading state while head + Tailwind resolve */}
      {!ready && (
        <div className="fixed inset-0 grid place-items-center bg-[#0a0e16] z-[60]">
          <div className="text-center">
            <div className="inline-block h-6 w-6 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin mb-3" />
            <div className="text-[11px] uppercase tracking-[0.18em] text-white/45">
              Loading prototype
            </div>
          </div>
        </div>
      )}

      {/* The prototype body markup is injected here. */}
      <div
        ref={containerRef}
        id="platform-prototype-host"
        className="text-slate-100 bg-[#0a0e16]"
        dangerouslySetInnerHTML={{ __html: bodyContent }}
      />
    </>
  );
}
