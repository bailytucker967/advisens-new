"use client";

import ScrollReveal from "./ScrollReveal";

// Three massive statement lines at different parallax depths.
// Closer text moves more, far text moves less — creates genuine 3D depth.
const LINES = [
  { text: "Submit anonymously.", depth: 22, opacity: "1" },
  { text: "See how they think.", depth: 14, opacity: "0.55" },
  { text: "Choose who you trust.", depth: 7, opacity: "0.25" },
];

export default function BeforeYouBegin() {
  return (
    <section id="before-you-begin" className="relative overflow-hidden py-24 md:py-36">

      {/* Background glow tracks cursor */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at 35% 50%, rgba(16,185,129,0.06) 0%, transparent 60%)",
          transform: "translate(calc(var(--px, 0) * -25px), calc(var(--py, 0) * -15px))",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-4 md:px-6">
        <div className="grid gap-16 md:grid-cols-2 md:gap-24 md:items-center">

          {/* Left — typographic depth stack */}
          <div>
            <ScrollReveal>
              <p className="mb-8 text-xs font-semibold uppercase tracking-[0.25em] text-emerald-400/70">
                Your terms. Always.
              </p>
            </ScrollReveal>

            <div className="space-y-2">
              {LINES.map((line, i) => (
                <ScrollReveal key={i} delay={(i + 1) as 1 | 2 | 3}>
                  <p
                    className="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl"
                    style={{
                      opacity: line.opacity,
                      transform: `translate(calc(var(--px, 0) * ${-line.depth}px), calc(var(--py, 0) * ${-line.depth * 0.5}px))`,
                    }}
                  >
                    {line.text}
                  </p>
                </ScrollReveal>
              ))}
            </div>

            <ScrollReveal delay={4}>
              <p
                className="mt-10 max-w-sm text-sm leading-relaxed text-slate-400"
                style={{ transform: "translate(calc(var(--px, 0) * -4px), calc(var(--py, 0) * -3px))" }}
              >
                No advisor can contact you. No obligation to proceed. You can stop at any stage.
                Your identity stays hidden until you choose otherwise.
              </p>
            </ScrollReveal>
          </div>

          {/* Right — floating control cards */}
          <ScrollReveal delay={2}>
            <div
              className="relative"
              style={{ transform: "translate(calc(var(--px, 0) * 18px), calc(var(--py, 0) * 12px))" }}
            >
              {/* Stack effect */}
              <div className="absolute inset-x-4 top-4 bottom-0 rounded-2xl border border-white/5 bg-white/[0.02]" />
              <div className="absolute inset-x-2 top-2 bottom-0 rounded-2xl border border-white/5 bg-white/[0.02]" />

              {/* Main panel */}
              <div className="relative rounded-2xl border border-white/10 bg-white/[0.04] p-7 md:p-8">

                {/* Top label */}
                <div className="mb-6 flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400/80">
                    You control this
                  </span>
                </div>

                {/* Control items */}
                {[
                  { label: "Identity revealed", value: "Never — unless you say so" },
                  { label: "Advisors can contact you", value: "Only with your consent" },
                  { label: "Obligation to proceed", value: "Zero" },
                  { label: "Stop anytime", value: "Always" },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between border-t border-white/6 py-4 first:border-0 first:pt-0 last:pb-0"
                    style={{
                      transform: `translate(calc(var(--px, 0) * ${-(3 + i)}px), calc(var(--py, 0) * ${-(2 + i)}px))`,
                    }}
                  >
                    <span className="text-xs text-slate-500">{item.label}</span>
                    <span className="text-xs font-semibold text-white">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>

        </div>
      </div>
    </section>
  );
}
