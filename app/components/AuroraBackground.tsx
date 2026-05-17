"use client";

// PERFORMANCE NOTE:
// CSS filter: blur() on large elements forces a software raster pass every frame.
// We use radial-gradient backgrounds instead — identical visually, 100% GPU-native,
// zero blur overhead. This is the correct approach for animated ambient glows.
export default function AuroraBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-25 overflow-hidden">
      {/* Blob 1 — emerald, top right */}
      <div
        className="absolute -top-20 -right-20"
        style={{
          width: "550px",
          height: "550px",
          background: "radial-gradient(circle at center, rgba(16,185,129,0.18) 0%, rgba(16,185,129,0.06) 40%, transparent 70%)",
          animation: "aurora-1 30s ease-in-out infinite",
        }}
      />
      {/* Blob 2 — teal, center left */}
      <div
        className="absolute top-1/3 -left-40"
        style={{
          width: "480px",
          height: "480px",
          background: "radial-gradient(circle at center, rgba(45,212,191,0.14) 0%, rgba(45,212,191,0.04) 40%, transparent 70%)",
          animation: "aurora-2 24s ease-in-out infinite",
          animationDelay: "-7s",
        }}
      />
      {/* Blob 3 — indigo, bottom left */}
      <div
        className="absolute -bottom-32 -left-16"
        style={{
          width: "520px",
          height: "520px",
          background: "radial-gradient(circle at center, rgba(99,102,241,0.12) 0%, rgba(99,102,241,0.03) 40%, transparent 70%)",
          animation: "aurora-3 38s ease-in-out infinite",
          animationDelay: "-14s",
        }}
      />
      {/* Blob 4 — lime, top center */}
      <div
        className="absolute -top-12 left-1/3"
        style={{
          width: "300px",
          height: "300px",
          background: "radial-gradient(circle at center, rgba(163,230,53,0.09) 0%, rgba(163,230,53,0.02) 45%, transparent 70%)",
          animation: "aurora-4 20s ease-in-out infinite",
          animationDelay: "-4s",
        }}
      />
      {/* Blob 5 — cyan, bottom right */}
      <div
        className="absolute -bottom-16 -right-16"
        style={{
          width: "420px",
          height: "420px",
          background: "radial-gradient(circle at center, rgba(6,182,212,0.11) 0%, rgba(6,182,212,0.03) 40%, transparent 70%)",
          animation: "aurora-5 28s ease-in-out infinite",
          animationDelay: "-10s",
        }}
      />
    </div>
  );
}
