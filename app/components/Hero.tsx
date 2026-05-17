"use client";

import React, { useRef } from "react";
import CaseStats from "./CaseStats";

interface HeroProps {
  onSubmitCase: () => void;
}

// Magnetic button — pulls toward cursor on hover, springs back on leave
function useMagnetic() {
  const ref = useRef<HTMLButtonElement>(null);
  const onMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const dx = (e.clientX - (rect.left + rect.width / 2)) * 0.28;
    const dy = (e.clientY - (rect.top + rect.height / 2)) * 0.28;
    el.style.transform = `translate(${dx}px, ${dy}px)`;
    el.style.transition = "transform 0.1s ease";
  };
  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "translate(0px, 0px)";
    el.style.transition = "transform 0.65s cubic-bezier(0.16,1,0.3,1)";
  };
  return { ref, onMove, onLeave };
}

export default function Hero({ onSubmitCase }: HeroProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const cta = useMagnetic();

  const handleTiltMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rotX = ((y - cy) / cy) * -7;
    const rotY = ((x - cx) / cx) * 7;
    card.style.willChange = "transform";
    card.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(10px)`;
    card.style.transition = "transform 0.1s linear";
  };

  const handleTiltLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)";
    card.style.transition = "transform 0.6s cubic-bezier(0.16,1,0.3,1)";
    // Release the compositor layer once animation settles
    setTimeout(() => { if (cardRef.current) cardRef.current.style.willChange = "auto"; }, 700);
  };

  return (
    <section className="relative isolate overflow-hidden min-h-screen overflow-x-clip">
      <div className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-6xl flex-col gap-12 px-4 pt-8 pb-20 md:flex-row md:items-center md:gap-16 md:px-6 md:pt-12 lg:pb-24">

        {/* Left: Text */}
        <div className="flex-1 space-y-6 text-white drop-shadow-[0_8px_24px_rgba(0,0,0,0.35)]">
          <p className="text-reveal text-reveal-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-200">
            Senior professionals in the GCC managing cross-border finances and long-term planning.
          </p>

          {/* Headline — larger, tighter, more presence */}
          <h1 className="max-w-xl text-left text-5xl font-semibold tracking-tight sm:text-6xl lg:text-7xl">
            <span className="block overflow-hidden">
              <span className="text-reveal text-reveal-2 block">
                Compare approaches
              </span>
            </span>
            <span className="block overflow-hidden">
              <span className="text-reveal text-reveal-3 block">
                before identities
              </span>
            </span>
            <span className="block overflow-hidden">
              <span className="text-reveal text-reveal-4 block bg-gradient-to-r from-emerald-300 to-teal-300 bg-clip-text text-transparent">
                are revealed.
              </span>
            </span>
          </h1>

          <p className="text-reveal text-reveal-4 max-w-xl text-left text-base leading-relaxed text-slate-200 sm:text-lg">
            A decision-preparation platform for people in the GCC considering
            financial advice. Submit your case anonymously, review how
            different advisors would approach it, and choose what aligns.
          </p>

          <p className="text-reveal text-reveal-5 max-w-xl text-left text-sm text-slate-300/80">
            Cases are submitted anonymously. Advisors respond without knowing
            who you are.
          </p>

          <div className="text-reveal text-reveal-5 flex flex-wrap items-center gap-5 pt-2">
            {/* Magnetic CTA */}
            <button
              ref={cta.ref}
              onMouseMove={cta.onMove}
              onMouseLeave={cta.onLeave}
              onClick={onSubmitCase}
              className="magnetic rounded-full bg-white/95 px-7 py-3 text-sm font-semibold text-slate-900 shadow-lg shadow-slate-900/40 hover:bg-white"
            >
              Submit a Case
            </button>
            <button className="text-sm font-medium text-white/75 hover:text-white transition-colors duration-200">
              See sample cases
            </button>
          </div>

          <div className="text-reveal text-reveal-5 pt-1">
            <CaseStats />
          </div>
        </div>

        {/* Right: 3D tilt card */}
        <div className="relative flex-1 min-h-[280px] sm:min-h-0">
          {/* Ambient glow — radial-gradient only, no blur filter */}
          <div
            className="pointer-events-none absolute -inset-4 sm:-inset-12 -z-20"
            style={{
              background: "radial-gradient(circle at 60% 30%, rgba(16,185,129,0.15) 0%, transparent 55%), radial-gradient(circle at 40% 80%, rgba(148,163,184,0.12) 0%, transparent 55%)",
            }}
          />

          <div className="relative mx-auto max-w-md w-full px-2 sm:px-0">
            {/* Card stack behind — solid bg, no backdrop-blur (decorative only) */}
            <div className="pointer-events-none absolute left-3 top-4 sm:left-6 sm:top-6 -z-10 h-[92%] w-[92%] -rotate-6 rounded-3xl border border-white/20 bg-white/10" />
            <div className="pointer-events-none absolute right-2 top-6 sm:right-4 sm:top-10 -z-10 h-[90%] w-[90%] rotate-[5deg] rounded-3xl border border-white/15 bg-white/10" />

            {/* Main card — 3D tilt target */}
            <div
              onMouseMove={handleTiltMove}
              onMouseLeave={handleTiltLeave}
              style={{ transformStyle: "preserve-3d" }}
            >
              <div
                ref={cardRef}
                className="group relative overflow-hidden rounded-3xl border border-white/40 bg-white/88 p-4 sm:p-5 shadow-2xl shadow-black/30 backdrop-blur-sm"
                style={{ transformStyle: "preserve-3d" }}
              >
                {/* Animated gradient edge */}
                <div className="pointer-events-none absolute -inset-[2px] -z-10 rounded-[26px] bg-linear-to-br from-emerald-400/60 via-white/30 to-lime-300/60 opacity-0 blur-sm transition-opacity duration-500 group-hover:opacity-100" />
                {/* Shimmer sweep */}
                <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100">
                  <div className="absolute -left-1/2 top-0 h-full w-1/2 rotate-12 bg-linear-to-r from-transparent via-white/35 to-transparent animate-[shimmer_6s_ease-in-out_infinite]" />
                </div>

                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <div className="min-w-0 flex flex-1 flex-col gap-1">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-600 truncate">
                      Case 009 · Investments / savings
                    </span>
                    <div className="flex flex-wrap items-center gap-1.5 text-[10px] text-slate-500">
                      <span className="rounded-full bg-slate-100 px-2 py-1 font-medium text-slate-700">Dubai · UAE</span>
                      <span className="rounded-full bg-slate-100 px-2 py-1 font-medium text-slate-700">3–5 year horizon</span>
                      <span className="rounded-full bg-slate-100 px-2 py-1 font-medium text-slate-700">First time taking advice</span>
                    </div>
                  </div>
                  <span className="shrink-0 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">Anonymous</span>
                </div>

                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-slate-900 px-3 py-1 text-[10px] font-semibold text-white">Situation</span>
                  <span className="rounded-full bg-white/70 px-3 py-1 text-[10px] font-semibold text-slate-700">Advisor approach</span>
                  <span className="rounded-full bg-white/70 px-3 py-1 text-[10px] font-semibold text-slate-700">Fees</span>
                  <span className="text-[10px] font-medium text-slate-500 sm:ml-auto">Preview of a real case</span>
                </div>

                <p className="mb-3 text-xs leading-relaxed text-slate-700">
                  &quot;I&apos;m a 38-year-old expat in Dubai with savings in cash and a couple of offshore policies from a previous advisor. I want a clearer long‑term plan for retirement and school fees without locking everything away or paying hidden commissions.&quot;
                </p>

                <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="min-w-0 rounded-2xl border border-slate-100 bg-white/90 p-3">
                    <div className="mb-2 flex flex-wrap items-center justify-between gap-1">
                      <span className="text-xs font-semibold text-slate-800">Advisor A</span>
                      <span className="inline-flex shrink-0 items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-emerald-400" />
                        <span className="text-[10px] font-semibold text-slate-600">Match 92</span>
                      </span>
                    </div>
                    <p className="text-[11px] leading-relaxed text-slate-700">
                      Starts with a full cash‑flow picture, then builds a plan around school fees and retirement in your home country. Uses low‑cost funds and a flat planning fee — no product commissions.
                    </p>
                    <p className="mt-2 text-[10px] text-slate-500">Fee philosophy: Flat‑fee, no commissions</p>
                  </div>

                  <div className="min-w-0 rounded-2xl border border-slate-100 bg-white/90 p-3">
                    <div className="mb-2 flex flex-wrap items-center justify-between gap-1">
                      <span className="text-xs font-semibold text-slate-800">Advisor B</span>
                      <span className="inline-flex shrink-0 items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-amber-400" />
                        <span className="text-[10px] font-semibold text-slate-600">Match 78</span>
                      </span>
                    </div>
                    <p className="text-[11px] leading-relaxed text-slate-700">
                      Recommends keeping existing policies but restructuring contributions, then adding a separate investment account for medium‑term goals. Mix of advice fee and product commission.
                    </p>
                    <p className="mt-2 text-[10px] text-slate-500">Fee philosophy: Mixed fee / commission</p>
                  </div>
                </div>

                <div className="mt-4 rounded-2xl border border-dashed border-slate-300/70 bg-linear-to-r from-white via-emerald-50/60 to-lime-50/60 p-3">
                  <p className="text-[11px] font-semibold text-slate-700">
                    This is how a real case is shown inside Advisens: your context, situation, and how different advisors would approach it — before anyone sees who you are.
                  </p>
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-600">
                  <span className="min-w-0">3 advisors invited · 2 responses so far</span>
                  <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-slate-900 px-2.5 py-1 text-[10px] font-medium text-white">
                    Live preview
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
