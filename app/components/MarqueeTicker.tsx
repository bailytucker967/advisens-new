"use client";

// Horizontal scrolling ticker — a staple of premium agency sites.
// Pauses on hover. Items repeat twice so the loop is seamless.
const ITEMS = [
  "Anonymous",
  "Multi-advisor",
  "GCC-focused",
  "Decision-first",
  "No obligation",
  "Fee transparency",
  "Expat-aware",
  "Your terms",
  "No pressure",
  "Full clarity",
];

export default function MarqueeTicker() {
  const repeated = [...ITEMS, ...ITEMS];

  return (
    <div className="relative overflow-hidden border-y border-white/8 py-3.5 bg-white/[0.02]">
      {/* Fade edges */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 z-10 bg-gradient-to-r from-transparent to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 z-10 bg-gradient-to-l from-transparent to-transparent" />

      <div className="marquee-track">
        {repeated.map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-3 px-5 whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400/70"
          >
            {item}
            <span className="h-[3px] w-[3px] rounded-full bg-emerald-500/50 flex-shrink-0" />
          </span>
        ))}
      </div>
    </div>
  );
}
