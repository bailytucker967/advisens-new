"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "../components/Header";
import Footer from "../components/Footer";

/**
 * ⚠️ PAGE LOCKED – FINAL APPROVED VERSION
 * Routing updated only.
 * Canonical CTA path: /submit
 */

export default function BeforeYouBeginPage() {
  const router = useRouter();

  const handleSubmitCase = () => {
    router.push("/submit");
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    router.push("/");
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="min-h-screen text-slate-900 flex flex-col relative">
      {/* Global background (same as home screen) */}
      <div
        className="fixed inset-0 -z-30 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/web%20background.jpeg')" }}
      />
      {/* Darken/soften overlay for readability */}
      <div className="fixed inset-0 -z-20 bg-linear-to-b from-black/35 via-black/20 to-black/10" />

      {/* Header */}
      <Header onNavClick={handleNavClick} onSubmitCase={handleSubmitCase} />

      <div className="relative z-10 flex-1">
        {/* HERO */}
        <section className="relative border-t border-white/10 overflow-hidden">
          <div className="relative mx-auto max-w-6xl px-4 py-14 md:px-6 md:py-18">
            <div className="text-center mb-10 md:mb-14">
              <div className="inline-block">
                <h1 className="inline-block rounded-full bg-white px-6 py-2 text-xl font-semibold tracking-tight text-slate-900 shadow-lg shadow-slate-200/50 md:text-2xl border border-slate-100 relative overflow-hidden group">
                  <span className="relative z-10">Before you begin</span>
                  <div className="absolute inset-0 bg-linear-to-r from-emerald-500/5 via-teal-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </h1>
              </div>
              <p className="mt-4 text-sm text-slate-200 md:text-base max-w-3xl mx-auto">
                A safer way to compare financial advice before you reveal who you are. Advisens lets you submit a scenario anonymously and compare how different advisors would approach it, so you can choose a methodology you trust before any identity is revealed.
              </p>
              <p className="mt-3 text-sm text-slate-300 md:text-base">
                No pressure. No chasing. You stay in control.
              </p>
            </div>
          </div>
        </section>

        {/* TRUST BY DESIGN */}
        <section className="relative border-t border-white/10 overflow-hidden">
          <div className="relative mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-12">
            {/* Trust by Design Card */}
            <div className="group relative rounded-3xl border border-white/20 bg-white/10 backdrop-blur-md p-7 shadow-lg shadow-black/20 md:p-9 overflow-hidden transition-all duration-500 hover:shadow-xl hover:shadow-black/30 hover:border-white/30 mb-12">
              <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                <div className="absolute inset-0 rounded-3xl bg-linear-to-br from-emerald-500/10 via-teal-500/10 to-blue-500/10 blur-2xl"></div>
              </div>

              <div className="absolute inset-0 opacity-[0.015]" style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, rgb(255 255 255) 1px, transparent 0)`,
                backgroundSize: '40px 40px'
              }}></div>

              <div className="relative z-10">
                <div className="flex items-center gap-3">
                  <div className="h-px w-8 bg-linear-to-r from-emerald-500 to-teal-500"></div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-300 transition-colors duration-300 group-hover:text-slate-200">
                    Design
                  </p>
                </div>
                
                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white md:text-3xl transition-colors duration-300 group-hover:text-white">
                  Trust, by design
                </h2>

                <p className="mt-4 text-sm leading-relaxed text-slate-200 md:text-base">
                  The system is built to reduce the two biggest risks people feel when exploring advice: being sold to, and being exposed.
                </p>
              </div>

              <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-emerald-500/5 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            </div>

            {/* Three Feature Cards */}
            <div className="grid gap-8 md:grid-cols-3 mb-12">
              {[
                {
                  title: "Anonymity first",
                  description: "Advisors never see your identity unless you explicitly choose to reveal it.",
                  gradient: "from-blue-500 to-cyan-500"
                },
                {
                  title: "Compare approaches",
                  description: "See how different advisors think, structure, and justify their recommendations.",
                  gradient: "from-purple-500 to-pink-500"
                },
                {
                  title: "You stay in control",
                  description: "No follow-ups, no sales pressure, no obligation to proceed.",
                  gradient: "from-emerald-500 to-teal-500"
                }
              ].map((feature, index) => (
                <div
                  key={feature.title}
                  className="group relative rounded-3xl border border-white/20 bg-white/10 backdrop-blur-md p-6 shadow-lg shadow-black/20 overflow-hidden transition-all duration-500 hover:shadow-xl hover:shadow-black/30 hover:border-white/30 hover:-translate-y-1"
                >
                  <div className={`absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700`}>
                    <div className={`absolute inset-0 rounded-3xl bg-linear-to-br ${feature.gradient}/10 blur-2xl`}></div>
                  </div>

                  <div className="absolute inset-0 opacity-[0.015]" style={{
                    backgroundImage: `radial-gradient(circle at 1px 1px, rgb(255 255 255) 1px, transparent 0)`,
                    backgroundSize: '40px 40px'
                  }}></div>

                  <div className="relative z-10">
                    <h3 className="text-xl font-semibold text-white mb-3 transition-colors duration-300 group-hover:text-white">
                      {feature.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-slate-200 md:text-base transition-colors duration-300 group-hover:text-slate-100">
                      {feature.description}
                    </p>
                  </div>

                  <div className={`absolute top-0 right-0 w-24 h-24 bg-linear-to-br ${feature.gradient}/5 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-700`}></div>
                </div>
              ))}
            </div>

            {/* Closing CTA */}
            <div className="group relative rounded-3xl border-2 border-white/20 bg-white/10 backdrop-blur-md px-6 py-12 text-center shadow-xl shadow-black/20 transition-all duration-700 hover:shadow-2xl hover:shadow-black/30 hover:border-white/30 md:px-12 md:py-16">
              <div className="absolute inset-0 bg-linear-to-br from-emerald-500/5 via-teal-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              
              <div className="absolute inset-0 bg-radial-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-700" style={{
                background: 'radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.08) 0%, transparent 70%)'
              }}></div>

              <div className="absolute inset-0 opacity-[0.02] group-hover:opacity-[0.03] transition-opacity duration-500" style={{
                backgroundImage: `radial-gradient(circle at 2px 2px, rgb(16 185 129) 1px, transparent 0)`,
                backgroundSize: '48px 48px'
              }}></div>

              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-1 bg-linear-to-r from-transparent via-emerald-500 to-transparent rounded-full transition-all duration-700 group-hover:w-48"></div>

              <div className="relative space-y-6">
                <div className="space-y-3">
                  <p className="text-2xl font-bold text-white md:text-3xl transition-all duration-300 group-hover:text-white">
                    Compare approaches first. Reveal later, if you choose.
                  </p>
                  <p className="text-base text-slate-200 leading-relaxed md:text-lg transition-colors duration-300 group-hover:text-white">
                    Start with a scenario. See how different advisors think. Keep control of what happens next.
                  </p>
                </div>

                <div className="pt-2">
                  <button
                    onClick={handleSubmitCase}
                    className="group/btn relative inline-flex items-center justify-center gap-2 rounded-full bg-linear-to-r from-emerald-600 to-teal-600 px-10 py-4 text-base font-semibold text-white shadow-lg shadow-emerald-500/40 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/50 hover:-translate-y-1 hover:scale-105 active:scale-100 cursor-pointer"
                  >
                    <div className="absolute inset-0 rounded-full bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"></div>
                    
                    <span className="relative">Submit a Case</span>
                    
                    <svg className="relative h-5 w-5 transition-transform duration-300 group-hover/btn:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-1 bg-linear-to-r from-transparent via-emerald-500 to-transparent rounded-full transition-all duration-700 group-hover:w-48"></div>

              <div className="absolute top-4 right-4 w-20 h-20 border-t-2 border-r-2 border-emerald-300/40 rounded-tr-3xl transition-all duration-500 group-hover:border-emerald-300/60 group-hover:w-24 group-hover:h-24"></div>
              <div className="absolute bottom-4 left-4 w-20 h-20 border-b-2 border-l-2 border-emerald-300/40 rounded-bl-3xl transition-all duration-500 group-hover:border-emerald-300/60 group-hover:w-24 group-hover:h-24"></div>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}

