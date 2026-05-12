"use client";

import { useEffect, useRef } from "react";

export default function CursorGlow() {
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const glow = glowRef.current;
    if (!glow) return;

    let animFrame: number;

    const onMove = (e: MouseEvent) => {
      cancelAnimationFrame(animFrame);
      animFrame = requestAnimationFrame(() => {
        if (!glow) return;
        glow.style.left = `${e.clientX}px`;
        glow.style.top = `${e.clientY}px`;
        glow.style.opacity = "1";
      });
    };

    const onLeave = () => {
      if (glow) glow.style.opacity = "0";
    };

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(animFrame);
    };
  }, []);

  return (
    <div
      ref={glowRef}
      className="pointer-events-none fixed -z-10 -translate-x-1/2 -translate-y-1/2 rounded-full"
      style={{
        width: "600px",
        height: "600px",
        opacity: 0,
        background:
          "radial-gradient(circle, rgba(16,185,129,0.07) 0%, rgba(20,184,166,0.04) 40%, transparent 70%)",
        transition: "opacity 0.4s ease",
      }}
    />
  );
}
