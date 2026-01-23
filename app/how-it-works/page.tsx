"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "../components/Header";
import Footer from "../components/Footer";

/**
 * ⚠️ PAGE LOCKED – FINAL APPROVED VERSION
 * This page is complete and approved. Do not make content or layout changes
 * unless explicitly unlocked by the user.
 * Last approved: 2025-01-XX
 */

export default function HowItWorksPage() {
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

  const steps = [
    {
      number: "01",
      title: "Submit your case",
      description:
        "Complete an anonymous intake form describing your situation, goals, and questions. Share only what you're comfortable with.",
      icon: "📄",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      number: "02",
      title: "Your context is shared with eligible advisors",
      description:
        "Your anonymised submission is made available to verified advisors whose stated approach aligns with your situation. Advisors independently decide whether to respond.",
      icon: "🔍",
      gradient: "from-violet-500 to-purple-500",
    },
    {
      number: "03",
      title: "Review advisor responses",
      description:
        "Advisors submit their proposed approach, methodology, and fee structure — all without revealing their identity. You compare responses and see how different advisors would handle your case.",
      clarification:
        "Advisor identities remain hidden unless and until you choose to reveal a profile.",
      icon: "👁️",
      gradient: "from-indigo-500 to-blue-500",
    },
    {
      number: "04",
      title: "Choose and connect",
      description:
        "Select the response that aligns with your goals. Only then is the advisor's profile revealed, and you decide whether to proceed with direct contact.",
      icon: "🛡️",
      gradient: "from-emerald-500 to-teal-500",
    },
  ];

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
        {/* Header Section */}
        <section className="relative border-t border-white/10 overflow-hidden">
          <div className="relative mx-auto max-w-6xl px-4 py-14 md:px-6 md:py-18">
            <div className="text-center mb-10 md:mb-14">
              <div className="inline-block">
                <h1 className="inline-block rounded-full bg-white px-6 py-2 text-xl font-semibold tracking-tight text-slate-900 shadow-lg shadow-slate-200/50 md:text-2xl border border-slate-100 relative overflow-hidden group">
                  <span className="relative z-10">How it works</span>
                  <div className="absolute inset-0 bg-linear-to-r from-blue-500/5 via-purple-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </h1>
              </div>
              <p className="mt-4 text-sm text-slate-200 md:text-base">
                A simple, structured process designed to help you prepare for your decision.
              </p>
            </div>
          </div>
        </section>

        {/* Steps */}
        <section className="px-4 md:px-6 pb-20 md:py-24">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {steps.map((step, index) => (
                <div
                  key={step.number}
                  className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/60 transition-all duration-500 hover:shadow-xl hover:shadow-slate-300/40 hover:-translate-y-1 hover:border-slate-300 relative overflow-hidden group"
                >
                  <div className={`absolute inset-0 bg-linear-to-br ${step.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                  <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className={`absolute inset-0 rounded-2xl bg-linear-to-br ${step.gradient} opacity-20 blur-xl`}></div>
                  </div>

                  <div className="relative z-10">
                    <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-linear-to-br ${step.gradient} text-white shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                      <span className="text-lg">{step.icon}</span>
                    </div>
                    <div className="absolute -top-2 -left-2 flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white shadow-md">
                      {index + 1}
                    </div>
                  </div>

                  <div className="relative z-10">
                    <h3 className="text-base font-semibold text-slate-900 transition-colors duration-300 group-hover:text-slate-950">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600 transition-colors duration-300 group-hover:text-slate-700">
                      {step.description}
                    </p>
                    {step.clarification && (
                      <div className="mt-3 rounded-lg bg-slate-50/80 border border-slate-200/50 p-2.5 transition-all duration-300 group-hover:bg-slate-100/50 group-hover:border-slate-300/50">
                        <p className="text-xs leading-relaxed text-slate-500">
                          {step.clarification}
                        </p>
                      </div>
                    )}
                  </div>

                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute -right-4 top-1/2 w-8 h-0.5 bg-linear-to-r from-slate-300 to-transparent opacity-40"></div>
                  )}
                </div>
              ))}
            </div>

            {/* Process flow indicator */}
            <div className="mt-8 flex justify-center items-center gap-2 opacity-60">
              {steps.map((_, index) => (
                <React.Fragment key={index}>
                  <div className="w-2 h-2 rounded-full bg-slate-400"></div>
                  {index < steps.length - 1 && (
                    <div className="w-12 h-0.5 bg-slate-300"></div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </section>

        {/* What You Can Expect */}
        <section className="relative border-t border-white/10 overflow-hidden">
          <div className="relative mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-12">
            <div className="group relative rounded-3xl border border-white/20 bg-white/10 backdrop-blur-md p-7 shadow-lg shadow-black/20 md:p-9 overflow-hidden transition-all duration-500 hover:shadow-xl hover:shadow-black/30 hover:border-white/30">
              <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                <div className="absolute inset-0 rounded-3xl bg-linear-to-br from-blue-500/10 via-cyan-500/10 to-teal-500/10 blur-2xl"></div>
              </div>

              <div className="absolute inset-0 opacity-[0.015]" style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, rgb(255 255 255) 1px, transparent 0)`,
                backgroundSize: '40px 40px'
              }}></div>

              <div className="relative z-10">
                <div className="flex items-center gap-3">
                  <div className="h-px w-8 bg-linear-to-r from-blue-500 to-cyan-500"></div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-300 transition-colors duration-300 group-hover:text-slate-200">
                    Expectations
                  </p>
                </div>
                
                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white md:text-3xl transition-colors duration-300 group-hover:text-white">
                  What you can expect
                </h2>

                <ul className="mt-6 space-y-3 text-sm leading-relaxed text-slate-200 md:text-base">
                  <li className="flex gap-3 group/item transition-all duration-300 hover:translate-x-1">
                    <div className="relative mt-1.5">
                      <div className="absolute inset-0 bg-linear-to-br from-blue-500 to-cyan-500 rounded-full blur-sm opacity-0 group-hover/item:opacity-60 transition-opacity duration-300"></div>
                      <div className="relative h-1.5 w-1.5 rounded-full bg-linear-to-br from-blue-500 to-cyan-500 shadow-sm transition-all duration-300 group-hover/item:scale-150"></div>
                    </div>
                    <div>
                      <span className="font-semibold text-white transition-colors duration-300 group-hover/item:text-white">Neutral information</span>
                      <span className="text-slate-300"> — We provide context about different types of financial advice, regulatory structures, and questions to consider — without steering you toward any particular option.</span>
                    </div>
                  </li>
                  
                  <li className="flex gap-3 group/item transition-all duration-300 hover:translate-x-1">
                    <div className="relative mt-1.5">
                      <div className="absolute inset-0 bg-linear-to-br from-blue-500 to-cyan-500 rounded-full blur-sm opacity-0 group-hover/item:opacity-60 transition-opacity duration-300"></div>
                      <div className="relative h-1.5 w-1.5 rounded-full bg-linear-to-br from-blue-500 to-cyan-500 shadow-sm transition-all duration-300 group-hover/item:scale-150"></div>
                    </div>
                    <div>
                      <span className="font-semibold text-white transition-colors duration-300 group-hover/item:text-white">No pressure</span>
                      <span className="text-slate-300"> — There are no deadlines, no follow-up calls, and no sales process. You decide when and how to act on the information.</span>
                    </div>
                  </li>
                  
                  <li className="flex gap-3 group/item transition-all duration-300 hover:translate-x-1">
                    <div className="relative mt-1.5">
                      <div className="absolute inset-0 bg-linear-to-br from-blue-500 to-cyan-500 rounded-full blur-sm opacity-0 group-hover/item:opacity-60 transition-opacity duration-300"></div>
                      <div className="relative h-1.5 w-1.5 rounded-full bg-linear-to-br from-blue-500 to-cyan-500 shadow-sm transition-all duration-300 group-hover/item:scale-150"></div>
                    </div>
                    <div>
                      <span className="font-semibold text-white transition-colors duration-300 group-hover/item:text-white">Your control</span>
                      <span className="text-slate-300"> — You choose how much information to share and how you use the guidance. The process is designed around your autonomy.</span>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-blue-500/5 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="relative border-t border-white/10 overflow-hidden">
          <div className="relative mx-auto max-w-5xl px-4 py-14 md:px-6 md:py-18">
            <div className="group relative overflow-hidden rounded-3xl border-2 border-white/20 bg-white/10 backdrop-blur-md px-6 py-12 text-center shadow-xl shadow-black/20 transition-all duration-700 hover:shadow-2xl hover:shadow-black/30 hover:border-white/30 md:px-12 md:py-16">
              
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
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300/30 bg-white/10 backdrop-blur-sm px-4 py-1.5 shadow-sm transition-all duration-300 group-hover:scale-105 group-hover:shadow-md group-hover:border-emerald-300/50">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-300">
                    Ready when you are
                  </p>
                </div>

                <div className="space-y-3">
                  <h4 className="text-3xl font-bold tracking-tight text-white md:text-4xl transition-all duration-300 group-hover:text-white">
                    Ready to submit your case?
                  </h4>
                  <p className="mx-auto max-w-2xl text-base text-slate-200 leading-relaxed md:text-lg transition-colors duration-300 group-hover:text-white">
                    The intake form takes about 10 minutes to complete.
                  </p>
                </div>

                <div className="flex flex-col items-center gap-4 pt-2">
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

                  <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-300">
                    <div className="flex items-center gap-1.5 transition-colors duration-300 hover:text-white">
                      <svg className="h-4 w-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                      </svg>
                      <span>100% Anonymous</span>
                    </div>
                    <div className="h-1 w-1 rounded-full bg-slate-400"></div>
                    <div className="flex items-center gap-1.5 transition-colors duration-300 hover:text-white">
                      <svg className="h-4 w-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>10 Minutes</span>
                    </div>
                    <div className="h-1 w-1 rounded-full bg-slate-400"></div>
                    <div className="flex items-center gap-1.5 transition-colors duration-300 hover:text-white">
                      <svg className="h-4 w-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                      </svg>
                      <span>No Obligation</span>
                    </div>
                  </div>
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

