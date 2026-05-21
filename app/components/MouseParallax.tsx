"use client";

import { useEffect } from "react";

// Single global rAF loop — sets --px and --py on :root (-1 to 1)
// Every element on the page can use calc(var(--px, 0) * Npx) in its transform.
// Different multipliers = different perceived depths. No React re-renders.
export default function MouseParallax() {
  useEffect(() => {
    let tx = 0, ty = 0;
    let cx = 0, cy = 0;
    let raf: number;

    const lerp = (a: number, b: number, n: number) => a + (b - a) * n;

    const onMove = (e: MouseEvent) => {
      tx = (e.clientX / window.innerWidth - 0.5) * 2;
      ty = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    const tick = () => {
      cx = lerp(cx, tx, 0.055);
      cy = lerp(cy, ty, 0.055);
      document.documentElement.style.setProperty("--px", cx.toFixed(4));
      document.documentElement.style.setProperty("--py", cy.toFixed(4));
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return null;
}
