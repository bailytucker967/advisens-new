"use client";

import ScrollReveal from "./ScrollReveal";

const STEPS = [
  {
    num: "01",
    title: "Submit your case",
    body: "Describe your situation, goals, and concerns — no name, no contact details. Just the context advisors need to respond meaningfully.",
    fromColor: "#3b82f6",
    toColor: "#06b6d4",
    offsetY: "-18px",
    pxDepth: 16,
    delay: 1 as const,
  },
  {
    num: "02",
    title: "Review advisor thinking",
    body: "Multiple advisors respond with their approach — methodology, fee structure, and priorities. All before a single meeting or introduction.",
    fromColor: "#8b5cf6",
    toColor: "#a855f7",
    offsetY: "0px",
    pxDepth: 7,
    delay: 2 as const,
  },
  {
    num: "03",
    title: "Choose what aligns",
    body: "Select the approach that fits your situation and values. Only then is the advisor's identity revealed. You reach out — not the other way around.",
    fromColor: "#10b981",
    toColor: "#14b8a6",
    offsetY: "-10px",
    pxDepth: 20,
    delay: 3 as const,
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="relative overflow-hidden py-24 md:py-36">

      {/* Perspective grid floor — shifts with cursor for 3D floor feel */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[55%] overflow-hidden">
        <div
          style={{
            position: "absolute",
            inset: 0,
            transformOrigin: "bottom center",
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)",
            backgroundSize: "68px 68px",
            transform: `rotateX(70deg) translateX(calc(var(--px, 0) * -60px))`,
            maskImage: "linear-gradient(to top, rgba(0,0,0,0.35) 0%, transparent 85%)",
            WebkitMaskImage: "linear-gradient(to top, rgba(0,0,0,0.35) 0%, transparent 85%)",
          }}
        />
      </div>

      {/* Floating ambient light — tracks cursor */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/3"
        style={{
          width: "700px",
          height: "500px",
          marginLeft: "-350px",
          marginTop: "-250px",
          background: "radial-gradient(ellipse at center, rgba(16,185,129,0.06) 0%, transparent 70%)",
          transform: "translate(calc(var(--px, 0) * -35px), calc(var(--py, 0) * -22px))",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-4 md:px-6">

        {/* Section header — subtle parallax */}
        <ScrollReveal className="mb-20 md:mb-28">
          <div style={{ transform: "translate(calc(var(--px, 0) * 8px), calc(var(--py, 0) * 5px))" }}>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-400/70">
              The Process
            </p>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight text-white md:text-5xl lg:text-6xl leading-tight">
              Three steps.
              <br />
              <span className="text-white/25">One clear decision.</span>
            </h2>
          </div>
        </ScrollReveal>

        {/* Cards — each floats at a different depth */}
        <div className="grid gap-5 md:grid-cols-3 md:gap-7">
          {STEPS.map((step) => (
            <ScrollReveal key={step.num} delay={step.delay}>
              {/* Depth wrapper — different parallax per card */}
              <div
                style={{
                  transform: `translateY(${step.offsetY}) translate(calc(var(--px, 0) * ${-step.pxDepth}px), calc(var(--py, 0) * ${-(step.pxDepth * 0.6)}px))`,
                }}
              >
                {/* Large ghost number — counter-parallax (moves opposite direction) */}
                <div
                  className="pointer-events-none select-none absolute -top-8 -left-2 text-[130px] font-black leading-none"
                  style={{
                    background: `linear-gradient(135deg, ${step.fromColor}28, transparent 60%)`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    transform: `translate(calc(var(--px, 0) * ${step.pxDepth * 0.7}px), calc(var(--py, 0) * ${step.pxDepth * 0.4}px))`,
                  }}
                >
                  {step.num}
                </div>

                {/* Card */}
                <div
                  className="group relative mt-12 overflow-hidden rounded-2xl border border-white/8 p-7 md:p-8 transition-colors duration-500 hover:border-white/18"
                  style={{
                    background: `linear-gradient(145deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.015) 100%)`,
                  }}
                >
                  {/* Top accent line */}
                  <div
                    className="absolute top-0 left-8 right-8 h-px"
                    style={{
                      background: `linear-gradient(90deg, transparent, ${step.fromColor}50, ${step.toColor}50, transparent)`,
                    }}
                  />

                  {/* Hover glow */}
                  <div
                    className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                    style={{
                      background: `radial-gradient(ellipse at 50% 0%, ${step.fromColor}12 0%, transparent 65%)`,
                    }}
                  />

                  <div className="relative">
                    {/* Badge */}
                    <div
                      className="mb-6 inline-flex items-center rounded-full px-3 py-1 text-[11px] font-bold tracking-wider"
                      style={{
                        background: `linear-gradient(135deg, ${step.fromColor}18, ${step.toColor}18)`,
                        border: `1px solid ${step.fromColor}28`,
                        color: step.fromColor,
                      }}
                    >
                      {step.num}
                    </div>

                    <h3 className="text-lg font-semibold text-white mb-3 group-hover:text-white transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-slate-400 group-hover:text-slate-300 transition-colors">
                      {step.body}
                    </p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
