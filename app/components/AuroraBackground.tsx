"use client";

export default function AuroraBackground() {
  // Blobs are intentionally smaller and use lower blur values than before.
  // Large blur + scale animations were the primary render-lag culprit.
  // All motion is now pure translate3d — GPU compositor handles it in a
  // separate layer without triggering expensive filter recalculation.
  return (
    <div className="pointer-events-none fixed inset-0 -z-25 overflow-hidden">
      {/* Blob 1 — emerald, top right */}
      <div
        className="absolute -top-20 -right-20 h-[320px] w-[320px] rounded-full bg-emerald-500/15 blur-[72px]"
        style={{ animation: "aurora-1 30s ease-in-out infinite", willChange: "transform" }}
      />
      {/* Blob 2 — teal, center left */}
      <div
        className="absolute top-1/3 -left-32 h-[280px] w-[280px] rounded-full bg-teal-400/12 blur-[60px]"
        style={{ animation: "aurora-2 24s ease-in-out infinite", animationDelay: "-7s", willChange: "transform" }}
      />
      {/* Blob 3 — indigo, bottom left */}
      <div
        className="absolute -bottom-32 -left-16 h-[360px] w-[360px] rounded-full bg-indigo-600/10 blur-[75px]"
        style={{ animation: "aurora-3 38s ease-in-out infinite", animationDelay: "-14s", willChange: "transform" }}
      />
      {/* Blob 4 — lime, top center */}
      <div
        className="absolute -top-12 left-1/3 h-[200px] w-[200px] rounded-full bg-lime-400/8 blur-[55px]"
        style={{ animation: "aurora-4 20s ease-in-out infinite", animationDelay: "-4s", willChange: "transform" }}
      />
      {/* Blob 5 — cyan, bottom right */}
      <div
        className="absolute -bottom-16 -right-16 h-[260px] w-[260px] rounded-full bg-cyan-500/10 blur-[65px]"
        style={{ animation: "aurora-5 28s ease-in-out infinite", animationDelay: "-10s", willChange: "transform" }}
      />
    </div>
  );
}
