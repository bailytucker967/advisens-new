"use client";

import { useRef } from "react";
import ScrollReveal from "./ScrollReveal";

function useTilt() {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = ref.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rotX = ((y - cy) / cy) * -6;
    const rotY = ((x - cx) / cx) * 6;
    card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(8px)`;
    card.style.transition = "transform 0.08s linear";
  };

  const onLeave = () => {
    const card = ref.current;
    if (!card) return;
    card.style.transform =
      "perspective(800px) rotateX(0deg) rotateY(0deg) translateZ(0px)";
    card.style.transition = "transform 0.6s cubic-bezier(0.16,1,0.3,1)";
  };

  return { ref, onMove, onLeave };
}

export default function HowItWorks() {
  const tilt1 = useTilt();
  const tilt2 = useTilt();
  const tilt3 = useTilt();

  return (
    <section id="how-it-works" className="relative border-t border-white/10 overflow-hidden">
      <div className="relative mx-auto max-w-6xl px-4 py-14 md:px-6 md:py-18">

        <ScrollReveal className="text-center mb-10 md:mb-14">
          <div className="inline-block">
            <h2 className="inline-block rounded-full bg-white px-6 py-2 text-xl font-semibold tracking-tight text-slate-900 shadow-lg shadow-slate-200/50 md:text-2xl border border-slate-100 relative overflow-hidden group">
              <span className="relative z-10">What we do</span>
              <div className="absolute inset-0 bg-linear-to-r from-blue-500/5 via-purple-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </h2>
          </div>
          <p className="mt-4 text-sm text-slate-200 md:text-base">
            We provide structure and clarity for your decision-making process.
          </p>
        </ScrollReveal>

        <div className="grid gap-8 md:grid-cols-3">
          {/* Card 1 */}
          <ScrollReveal delay={1}>
            <div
              onMouseMove={tilt1.onMove}
              onMouseLeave={tilt1.onLeave}
              style={{ transformStyle: "preserve-3d" }}
            >
              <div
                ref={tilt1.ref}
                style={{ transformStyle: "preserve-3d", willChange: "transform" }}
                className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/60 transition-shadow duration-500 hover:shadow-xl hover:shadow-slate-300/40 hover:border-slate-300 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-linear-to-br from-blue-500 to-cyan-500 opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-blue-500 to-cyan-500 opacity-20 blur-xl"></div>
                </div>

                <div className="relative z-10">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-linear-to-br from-blue-500 to-cyan-500 text-white shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                    <span className="text-lg">📄</span>
                  </div>
                  <div className="absolute -top-2 -left-2 flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white shadow-md">
                    1
                  </div>
                </div>

                <div className="relative z-10">
                  <h3 className="text-base font-semibold text-slate-900 transition-colors duration-300 group-hover:text-slate-950">
                    Submit your case
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600 transition-colors duration-300 group-hover:text-slate-700">
                    Complete a structured form describing your situation, goals, and concerns — anonymously.
                  </p>
                </div>

                <div className="hidden md:block absolute -right-4 top-1/2 w-8 h-0.5 bg-linear-to-r from-slate-300 to-transparent opacity-40"></div>
              </div>
            </div>
          </ScrollReveal>

          {/* Card 2 */}
          <ScrollReveal delay={2}>
            <div
              onMouseMove={tilt2.onMove}
              onMouseLeave={tilt2.onLeave}
              style={{ transformStyle: "preserve-3d" }}
            >
              <div
                ref={tilt2.ref}
                style={{ transformStyle: "preserve-3d", willChange: "transform" }}
                className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/60 transition-shadow duration-500 hover:shadow-xl hover:shadow-slate-300/40 hover:border-slate-300 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-linear-to-br from-violet-500 to-purple-500 opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-violet-500 to-purple-500 opacity-20 blur-xl"></div>
                </div>

                <div className="relative z-10">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-linear-to-br from-violet-500 to-purple-500 text-white shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                    <span className="text-lg">👁️</span>
                  </div>
                  <div className="absolute -top-2 -left-2 flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white shadow-md">
                    2
                  </div>
                </div>

                <div className="relative z-10">
                  <h3 className="text-base font-semibold text-slate-900 transition-colors duration-300 group-hover:text-slate-950">
                    Review advisor responses
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600 transition-colors duration-300 group-hover:text-slate-700">
                    Advisors share their proposed approach, methodology, and fee structure — without revealing their identity.
                  </p>
                </div>

                <div className="hidden md:block absolute -right-4 top-1/2 w-8 h-0.5 bg-linear-to-r from-slate-300 to-transparent opacity-40"></div>
              </div>
            </div>
          </ScrollReveal>

          {/* Card 3 */}
          <ScrollReveal delay={3}>
            <div
              onMouseMove={tilt3.onMove}
              onMouseLeave={tilt3.onLeave}
              style={{ transformStyle: "preserve-3d" }}
            >
              <div
                ref={tilt3.ref}
                style={{ transformStyle: "preserve-3d", willChange: "transform" }}
                className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/60 transition-shadow duration-500 hover:shadow-xl hover:shadow-slate-300/40 hover:border-slate-300 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-linear-to-br from-emerald-500 to-teal-500 opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-emerald-500 to-teal-500 opacity-20 blur-xl"></div>
                </div>

                <div className="relative z-10">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-linear-to-br from-emerald-500 to-teal-500 text-white shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                    <span className="text-lg">🛡️</span>
                  </div>
                  <div className="absolute -top-2 -left-2 flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white shadow-md">
                    3
                  </div>
                </div>

                <div className="relative z-10">
                  <h3 className="text-base font-semibold text-slate-900 transition-colors duration-300 group-hover:text-slate-950">
                    Select what aligns
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600 transition-colors duration-300 group-hover:text-slate-700">
                    Choose the approach that best fits your goals and personality. Only then is the advisor&apos;s identity revealed — and you decide whether to proceed.
                  </p>
                  <div className="mt-3 rounded-lg bg-slate-50/80 border border-slate-200/50 p-2.5 transition-all duration-300 group-hover:bg-slate-100/50 group-hover:border-slate-300/50">
                    <p className="text-xs leading-relaxed text-slate-500">
                      Alignment is based on approach, priorities, and fee philosophy — not results or performance.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Process flow indicator */}
        <ScrollReveal delay={4} className="mt-8 flex justify-center items-center gap-2 opacity-60">
          <div className="w-2 h-2 rounded-full bg-slate-400"></div>
          <div className="w-12 h-0.5 bg-slate-300"></div>
          <div className="w-2 h-2 rounded-full bg-slate-400"></div>
          <div className="w-12 h-0.5 bg-slate-300"></div>
          <div className="w-2 h-2 rounded-full bg-slate-400"></div>
        </ScrollReveal>

      </div>
    </section>
  );
}
