"use client";

// Subtle film-grain texture over the entire page.
// This is how premium sites (Linear, Vercel, wearebrand.io) get that
// tactile depth without any actual images — just an SVG noise filter.
export default function GrainOverlay() {
  return (
    <div
      className="pointer-events-none fixed inset-0"
      style={{
        zIndex: 9990,
        opacity: 0.038,
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='280' height='280'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.72' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='280' height='280' filter='url(%23g)'/%3E%3C/svg%3E")`,
      }}
    />
  );
}
