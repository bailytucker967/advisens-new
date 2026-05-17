"use client";

import { useEffect, useRef } from "react";

export default function CursorGlow() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    // Only activate on pointer devices (not touch screens)
    if (!window.matchMedia("(pointer: fine)").matches) return;

    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;
    let visible = false;
    let animFrame: number;

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const tick = () => {
      // Lerp ring toward cursor — creates that fluid trailing feel
      ringX = lerp(ringX, mouseX, 0.11);
      ringY = lerp(ringY, mouseY, 0.11);

      dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
      ring.style.transform = `translate(${ringX}px, ${ringY}px)`;

      animFrame = requestAnimationFrame(tick);
    };

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!visible) {
        visible = true;
        dot.style.opacity = "1";
        ring.style.opacity = "1";
      }

      // Expand + tint ring on interactive elements
      const target = e.target as HTMLElement;
      const isInteractive =
        target.closest("a, button, [role='button'], label, select, input, textarea") !== null;
      const ringInner = ring.firstElementChild as HTMLElement | null;
      if (ringInner) {
        ringInner.style.transform = isInteractive ? "scale(1.8)" : "scale(1)";
        ringInner.style.borderColor = isInteractive
          ? "rgba(52,211,153,0.5)"
          : "rgba(255,255,255,0.22)";
      }
    };

    const onLeave = () => {
      visible = false;
      dot.style.opacity = "0";
      ring.style.opacity = "0";
    };

    animFrame = requestAnimationFrame(tick);
    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);

    return () => {
      cancelAnimationFrame(animFrame);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <>
      {/* Dot — exact cursor position, no delay */}
      <div ref={dotRef} className="cursor-dot">
        <div className="cursor-dot-inner" />
      </div>
      {/* Ring — lags behind cursor with lerp for that premium feel */}
      <div ref={ringRef} className="cursor-ring">
        <div className="cursor-ring-inner" />
      </div>
    </>
  );
}
