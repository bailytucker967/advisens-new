"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Platform page — Advisens prototype.
 *
 * The prototype is served as a static HTML file at /prototype.html so it
 * deploys instantly to Vercel without porting all 2800 lines to React.
 *
 * Next iteration: progressively replace iframe sections with native JSX
 * components so external editors (21st.dev Magic MCP, v0.dev, Vercel toolbar)
 * can edit them directly.
 */
export default function PlatformPage() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Trigger fade-in when iframe content loads
    const iframe = iframeRef.current;
    if (!iframe) return;
    const onLoad = () => setLoaded(true);
    iframe.addEventListener("load", onLoad);
    return () => iframe.removeEventListener("load", onLoad);
  }, []);

  return (
    <main className="min-h-screen bg-[#0a0e16]">
      {/* Skip link for accessibility */}
      <a
        href="#prototype-frame"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:bg-white focus:text-slate-900 focus:px-3 focus:py-2 focus:rounded"
      >
        Skip to prototype
      </a>

      {/* Loading state */}
      {!loaded && (
        <div className="fixed inset-0 grid place-items-center bg-[#0a0e16] z-10">
          <div className="text-center">
            <div className="inline-block h-6 w-6 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin mb-3" />
            <div className="text-[11px] uppercase tracking-[0.18em] text-white/45">
              Loading prototype
            </div>
          </div>
        </div>
      )}

      <iframe
        ref={iframeRef}
        id="prototype-frame"
        src="/prototype.html"
        title="Advisens prototype"
        className="w-full h-screen border-0 block"
        style={{ minHeight: "100vh" }}
      />
    </main>
  );
}
