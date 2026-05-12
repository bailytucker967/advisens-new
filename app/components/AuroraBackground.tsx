"use client";

export default function AuroraBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-25 overflow-hidden">
      {/* Blob 1 — large emerald, top right */}
      <div
        className="absolute -top-32 -right-32 h-[600px] w-[600px] rounded-full bg-emerald-500/18 blur-[120px]"
        style={{ animation: "aurora-1 28s ease-in-out infinite" }}
      />
      {/* Blob 2 — teal, center left */}
      <div
        className="absolute top-1/3 -left-48 h-[500px] w-[500px] rounded-full bg-teal-400/14 blur-[100px]"
        style={{ animation: "aurora-2 22s ease-in-out infinite", animationDelay: "-7s" }}
      />
      {/* Blob 3 — indigo/blue, bottom left */}
      <div
        className="absolute -bottom-48 -left-24 h-[700px] w-[700px] rounded-full bg-indigo-600/12 blur-[130px]"
        style={{ animation: "aurora-3 35s ease-in-out infinite", animationDelay: "-14s" }}
      />
      {/* Blob 4 — lime, top center */}
      <div
        className="absolute -top-16 left-1/3 h-[300px] w-[300px] rounded-full bg-lime-400/10 blur-[80px]"
        style={{ animation: "aurora-4 18s ease-in-out infinite", animationDelay: "-4s" }}
      />
      {/* Blob 5 — cyan, bottom right */}
      <div
        className="absolute -bottom-24 -right-24 h-[450px] w-[450px] rounded-full bg-cyan-500/12 blur-[110px]"
        style={{ animation: "aurora-5 25s ease-in-out infinite", animationDelay: "-10s" }}
      />
    </div>
  );
}
