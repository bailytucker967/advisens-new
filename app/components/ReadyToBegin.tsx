"use client";

import { useRef } from "react";
import ScrollReveal from "./ScrollReveal";

interface ReadyToBeginProps {
  onSubmitCase: () => void;
}

function useMagnetic() {
  const ref = useRef<HTMLButtonElement>(null);
  const onMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const dx = (e.clientX - (rect.left + rect.width / 2)) * 0.3;
    const dy = (e.clientY - (rect.top + rect.height / 2)) * 0.3;
    el.style.transform = `translate(${dx}px, ${dy}px)`;
    el.style.transition = "transform 0.1s ease";
  };
  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "translate(0px, 0px)";
    el.style.transition = "transform 0.7s cubic-bezier(0.16,1,0.3,1)";
  };
  return { ref, onMove, onLeave };
}

export default function ReadyToBegin({ onSubmitCase }: ReadyToBeginProps) {
  const cta = useMagnetic();

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden py-24">

      {/* Large ambient glow — follows cursor */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at 50% 55%, rgba(16,185,129,0.13) 0%, rgba(16,185,129,0.04) 35%, transparent 65%)",
          transform: "translate(calc(var(--px, 0) * -40px), calc(var(--py, 0) * -28px))",
        }}
      />

      {/* Secondary deep glow — moves opposite direction for parallax depth */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at 50% 40%, rgba(99,102,241,0.07) 0%, transparent 55%)",
          transform: "translate(calc(var(--px, 0) * 25px), calc(var(--py, 0) * 18px))",
        }}
      />

      {/* Subtle grid */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
          maskImage: "radial-gradient(ellipse at center, black 20%, transparent 75%)",
          WebkitMaskImage: "radial-gradient(ellipse at center, black 20%, transparent 75%)",
          transform: "translate(calc(var(--px, 0) * -10px), calc(var(--py, 0) * -6px))",
        }}
      />

      <div className="relative mx-auto max-w-5xl px-4 text-center md:px-6">

        {/* Eyebrow */}
        <ScrollReveal>
          <div
            className="mb-8 inline-flex items-center gap-2"
            style={{ transform: "translate(calc(var(--px, 0) * -8px), calc(var(--py, 0) * -5px))" }}
          >
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-400/80">
              Ready when you are
            </span>
          </div>
        </ScrollReveal>

        {/* Headline — the winning ad copy */}
        <ScrollReveal delay={1}>
          <h2
            className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl leading-tight"
            style={{ transform: "translate(calc(var(--px, 0) * -14px), calc(var(--py, 0) * -9px))" }}
          >
            See how advisors think.
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={2}>
          <h2
            className="mt-1 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl leading-tight"
            style={{
              background: "linear-gradient(135deg, #34d399, #14b8a6)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              transform: "translate(calc(var(--px, 0) * -20px), calc(var(--py, 0) * -13px))",
            }}
          >
            Before they know it&apos;s you.
          </h2>
        </ScrollReveal>

        {/* Sub text */}
        <ScrollReveal delay={3}>
          <p
            className="mx-auto mt-8 max-w-xl text-base leading-relaxed text-slate-400 md:text-lg"
            style={{ transform: "translate(calc(var(--px, 0) * -6px), calc(var(--py, 0) * -4px))" }}
          >
            Submit your case anonymously. Review how different advisors would approach your
            situation. Choose what aligns before any identity is revealed.
          </p>
        </ScrollReveal>

        {/* CTA */}
        <ScrollReveal delay={4}>
          <div
            className="mt-12 flex flex-col items-center gap-6"
            style={{ transform: "translate(calc(var(--px, 0) * -5px), calc(var(--py, 0) * -3px))" }}
          >
            <button
              ref={cta.ref}
              onMouseMove={cta.onMove}
              onMouseLeave={cta.onLeave}
              onClick={onSubmitCase}
              className="group relative overflow-hidden rounded-full px-10 py-4 text-sm font-semibold text-slate-900 shadow-2xl shadow-emerald-500/20 transition-shadow duration-300 hover:shadow-emerald-500/40"
              style={{ background: "linear-gradient(135deg, #d1fae5, #ffffff)" }}
            >
              {/* Shimmer */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/40 to-transparent" />
              <span className="relative">Submit a Case</span>
            </button>

            {/* Trust line */}
            <div className="flex items-center gap-6 text-xs text-slate-500">
              <span>100% Anonymous</span>
              <span className="h-px w-4 bg-white/15" />
              <span>No obligation</span>
              <span className="h-px w-4 bg-white/15" />
              <span>Stop anytime</span>
            </div>
          </div>
        </ScrollReveal>

      </div>
    </section>
  );
}
