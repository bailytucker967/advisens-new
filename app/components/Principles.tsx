"use client";

import ScrollReveal from "./ScrollReveal";

// Each principle is a bold line of text — the typography IS the design.
// No card, no bullets, no container. Just weight and conviction.
const LINES = [
  { text: "No commissions.", sub: "Ever.", depth: 18 },
  { text: "No unsolicited contact.", sub: "Ever.", depth: 12 },
  { text: "No rankings or endorsements.", sub: "Ever.", depth: 8 },
  { text: "No financial advice.", sub: "Ever.", depth: 14 },
];

export default function Principles() {
  return (
    <section id="principles" className="relative overflow-hidden py-20 md:py-28">

      {/* Ambient left glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at 15% 50%, rgba(239,68,68,0.05) 0%, transparent 55%)",
          transform: "translate(calc(var(--px, 0) * -18px), calc(var(--py, 0) * -10px))",
        }}
      />

      <div className="relative mx-auto max-w-5xl px-4 md:px-6">

        <ScrollReveal className="mb-12 md:mb-16">
          <div style={{ transform: "translate(calc(var(--px, 0) * 6px), calc(var(--py, 0) * 4px))" }}>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-red-400/70">
              Our guardrails
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white md:text-4xl">
              What we don&apos;t do.
            </h2>
          </div>
        </ScrollReveal>

        <div>
          {LINES.map((line, i) => (
            <ScrollReveal key={i} delay={((i % 5) + 1) as 1 | 2 | 3 | 4 | 5}>
              <div
                className="group flex items-baseline justify-between border-t border-white/8 py-7 md:py-9 transition-colors duration-300 hover:border-white/16 first:border-0"
                style={{
                  transform: `translate(calc(var(--px, 0) * ${-line.depth}px), calc(var(--py, 0) * ${-line.depth * 0.55}px))`,
                }}
              >
                {/* Line number */}
                <span
                  className="text-xs font-semibold text-white/15 tabular-nums mr-8 shrink-0 group-hover:text-white/30 transition-colors"
                  style={{ transform: `translate(calc(var(--px, 0) * ${line.depth * 0.3}px), 0)` }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>

                {/* Main text */}
                <p className="flex-1 text-2xl font-semibold tracking-tight text-white sm:text-3xl md:text-4xl group-hover:text-white transition-colors">
                  {line.text}{" "}
                  <span className="text-red-400/60 group-hover:text-red-400/90 transition-colors">
                    {line.sub}
                  </span>
                </p>
              </div>
            </ScrollReveal>
          ))}

          {/* Final note */}
          <ScrollReveal delay={5}>
            <div
              className="border-t border-white/8 pt-7 md:pt-9"
              style={{ transform: "translate(calc(var(--px, 0) * -5px), calc(var(--py, 0) * -3px))" }}
            >
              <p className="text-sm text-slate-500 max-w-lg">
                Advisors participate under defined eligibility and behavioural standards.
                The platform exists to give you clarity — not to sell you anything.
              </p>
            </div>
          </ScrollReveal>
        </div>

      </div>
    </section>
  );
}
