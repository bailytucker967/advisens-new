"use client";

import React from "react";

interface HeroProps {
  onSubmitCase: () => void;
}

export default function Hero({ onSubmitCase }: HeroProps) {
  return (
    <section className="relative isolate overflow-hidden min-h-screen">
      <div className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-6xl flex-col gap-12 px-4 pt-8 pb-20 md:flex-row md:items-center md:gap-16 md:px-6 md:pt-12 lg:pb-24">
        {/* Left: Text */}
        <div className="flex-1 space-y-6 text-white drop-shadow-[0_8px_24px_rgba(0,0,0,0.35)]">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-200">
            Decision prep for GCC investors
          </p>
          <h1 className="max-w-xl text-left text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
            Compare approaches
            <br />
            before identities are
            <br />
            revealed
          </h1>

          <p className="max-w-xl text-left text-base leading-relaxed text-slate-100 sm:text-lg">
            A decision-preparation platform for people in the GCC considering
            financial advice. Submit your case anonymously, review how
            different advisors would approach it, and choose what aligns.
          </p>

          <p className="max-w-xl text-left text-sm text-slate-200">
            Cases are submitted anonymously. Advisors respond without knowing
            who you are.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button 
              onClick={onSubmitCase}
              className="rounded-full bg-white/95 px-6 py-3 text-sm font-semibold text-slate-900 shadow-lg shadow-slate-900/40 transition hover:-translate-y-0.5 hover:bg-white cursor-pointer"
            >
              Submit a Case
            </button>
            <button className="text-sm font-medium text-white/90 underline-offset-4 hover:text-white cursor-pointer">
              See sample cases
            </button>
          </div>
        </div>

        {/* Right: Visual element */}
        <div className="relative flex-1">
          {/* Ambient blobs */}
          <div className="pointer-events-none absolute -inset-12 -z-20 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.22),transparent_55%),radial-gradient(circle_at_bottom,rgba(148,163,184,0.22),transparent_55%)]" />
          <div className="pointer-events-none absolute -right-10 top-6 -z-20 h-40 w-40 rounded-full bg-emerald-400/20 blur-3xl" />
          <div className="pointer-events-none absolute -left-12 bottom-6 -z-20 h-48 w-48 rounded-full bg-lime-300/20 blur-3xl" />

          <div className="relative mx-auto max-w-md">
            {/* Card stack behind */}
            <div className="pointer-events-none absolute left-6 top-6 -z-10 h-[92%] w-[92%] -rotate-6 rounded-3xl border border-white/25 bg-white/10 backdrop-blur-sm" />
            <div className="pointer-events-none absolute right-4 top-10 -z-10 h-[90%] w-[90%] rotate-[5deg] rounded-3xl border border-white/20 bg-white/10 backdrop-blur-sm" />

            {/* Main "product preview" */}
            <div className="group relative overflow-hidden rounded-3xl border border-white/40 bg-white/80 p-5 shadow-2xl shadow-black/30 backdrop-blur-md animate-[floaty_7s_ease-in-out_infinite]">
              {/* Animated gradient edge */}
              <div className="pointer-events-none absolute -inset-[2px] -z-10 rounded-[26px] bg-linear-to-br from-emerald-400/60 via-white/30 to-lime-300/60 opacity-0 blur-sm transition-opacity duration-500 group-hover:opacity-100" />
              {/* Shimmer sweep */}
              <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100">
                <div className="absolute -left-1/2 top-0 h-full w-1/2 rotate-12 bg-linear-to-r from-transparent via-white/35 to-transparent animate-[shimmer_6s_ease-in-out_infinite]" />
              </div>

              <div className="mb-4 flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-[0.18em] text-slate-600">
                  Anonymous Case
                </span>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                  You
                </span>
              </div>

              {/* Mini top nav */}
              <div className="mb-4 flex items-center gap-2">
                <span className="rounded-full bg-slate-900 px-3 py-1 text-[10px] font-semibold text-white">
                  Compare
                </span>
                <span className="rounded-full bg-white/70 px-3 py-1 text-[10px] font-semibold text-slate-700">
                  Approach
                </span>
                <span className="rounded-full bg-white/70 px-3 py-1 text-[10px] font-semibold text-slate-700">
                  Fees
                </span>
                <span className="ml-auto text-[10px] font-medium text-slate-500">
                  Updated just now
                </span>
              </div>

              <p className="mb-4 text-sm text-slate-800">
                &quot;I&apos;m considering working with a financial advisor for long-term
                planning. How would you approach a case like this for someone
                based in the GCC?&quot;
              </p>

              {/* Side-by-side comparison cards */}
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-100 bg-white/85 p-3">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-700">
                      Advisor A
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-emerald-400" />
                      <span className="text-[10px] font-semibold text-slate-600">
                        Match 92
                      </span>
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">
                    Starts with goals + constraints, then builds a plan with
                    transparent fees.
                  </p>
                  <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full w-[92%] rounded-full bg-linear-to-r from-emerald-400 to-lime-300" />
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-100 bg-white/85 p-3">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-700">
                      Advisor B
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-amber-400" />
                      <span className="text-[10px] font-semibold text-slate-600">
                        Match 78
                      </span>
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">
                    Scenario-first analysis, then a phased roadmap based on
                    risk comfort.
                  </p>
                  <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full w-[78%] rounded-full bg-linear-to-r from-amber-400 to-emerald-300" />
                  </div>
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-dashed border-slate-300/70 bg-linear-to-r from-white via-emerald-50/60 to-lime-50/60 p-3">
                <p className="text-xs font-semibold text-slate-700">
                  Compare approaches side‑by‑side — identities stay hidden
                  until you choose.
                </p>
              </div>

              <div className="mt-5 flex items-center justify-between text-[11px] text-slate-600">
                <span>3+ advisors invited</span>
                <span className="inline-flex items-center gap-1 rounded-full bg-slate-900 px-2.5 py-1 text-[10px] font-medium text-white">
                  Live preview
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


