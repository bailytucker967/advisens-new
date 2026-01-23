"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "../components/Header";
import Footer from "../components/Footer";

/**
 * ⚠️ PAGE LOCKED - FINAL APPROVED VERSION
 * This page is complete and approved. Do not make content or layout changes 
 * unless explicitly unlocked by the user.
 * Last approved: 2025-01-XX
 */

export default function PrinciplesPage() {
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

  const principles = [
    {
      title: "Neutrality",
      description: "We do not recommend, endorse, or refer you to any specific advisor, product, or service. Our role is to provide structure for comparison — not to steer your decision.",
      details: [
        "No referral fees, commissions, or commercial relationships with advisors",
        "No rankings or endorsements",
        "No product recommendations"
      ]
    },
    {
      title: "Transparency",
      description: "We are clear about what we do and don't do. We explain our process, our limitations, and the boundaries of our role.",
      details: [
        "Clear explanation of our service and limitations",
        "No hidden commercial relationships",
        "Open about what we cannot provide"
      ]
    },
    {
      title: "User control",
      description: "You decide what to share, when to share it, and how to use the information. You are in control of your decision-making process at every step.",
      details: [
        "Anonymous by default",
        "No obligation to proceed",
        "No pressure or follow-up"
      ]
    },
    {
      title: "Education, not advice",
      description: "We provide educational information about the advisory landscape and facilitate comparisons between advisor approaches. We help you prepare — we don't tell you what to do.",
      details: [
        "Context about types of advice and approaches available",
        "Questions to ask when evaluating advisors",
        "Factors to consider in your decision"
      ],
      boundary: "Advisors are solely responsible for the regulatory compliance and suitability of any advice they provide."
    }
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
                  <span className="relative z-10">Our principles</span>
                  <div className="absolute inset-0 bg-linear-to-r from-red-500/5 via-amber-500/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </h1>
              </div>
              <p className="mt-4 text-sm text-slate-200 md:text-base">
                These principles guide everything we do. They define our role and ensure you remain in control of your decision.
              </p>
            </div>
          </div>
        </section>

        {/* Principles */}
        <section className="relative border-t border-white/10 overflow-hidden">
          <div className="relative mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-12">
            <div className="grid gap-8 md:grid-cols-2">
              {principles.map((principle, index) => {
                const gradients = [
                  "from-red-500/10 via-amber-500/10 to-orange-500/10",
                  "from-blue-500/10 via-cyan-500/10 to-teal-500/10",
                  "from-purple-500/10 via-pink-500/10 to-rose-500/10",
                  "from-emerald-500/10 via-teal-500/10 to-cyan-500/10"
                ];
                const dotGradients = [
                  "from-red-500 to-amber-500",
                  "from-blue-500 to-cyan-500",
                  "from-purple-500 to-pink-500",
                  "from-emerald-500 to-teal-500"
                ];
                
                return (
                  <div
                    key={principle.title}
                    className="group relative rounded-3xl border border-white/20 bg-white/10 backdrop-blur-md p-7 shadow-lg shadow-black/20 md:p-9 overflow-hidden transition-all duration-500 hover:shadow-xl hover:shadow-black/30 hover:border-white/30"
                  >
                    <div className={`absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700`}>
                      <div className={`absolute inset-0 rounded-3xl bg-linear-to-br ${gradients[index]} blur-2xl`}></div>
                    </div>

                    <div className="absolute inset-0 opacity-[0.015]" style={{
                      backgroundImage: `radial-gradient(circle at 1px 1px, rgb(255 255 255) 1px, transparent 0)`,
                      backgroundSize: '40px 40px'
                    }}></div>

                    <div className="relative z-10">
                      <h2 className="text-2xl font-semibold tracking-tight text-white md:text-3xl transition-colors duration-300 group-hover:text-white mb-4">
                        {principle.title}
                      </h2>
                      
                      <p className="text-sm leading-relaxed text-slate-200 md:text-base mb-6">
                        {principle.description}
                      </p>

                      <ul className="space-y-3 text-sm leading-relaxed text-slate-200 md:text-base">
                        {principle.details.map((detail, detailIndex) => (
                          <li key={detail} className="flex gap-3 group/item transition-all duration-300 hover:translate-x-1">
                            <div className="relative mt-1.5">
                              <div className={`absolute inset-0 bg-linear-to-br ${dotGradients[index]} rounded-full blur-sm opacity-0 group-hover/item:opacity-60 transition-opacity duration-300`}></div>
                              <div className={`relative h-1.5 w-1.5 rounded-full bg-linear-to-br ${dotGradients[index]} shadow-sm transition-all duration-300 group-hover/item:scale-150`}></div>
                            </div>
                            <span className="transition-colors duration-300 group-hover/item:text-white">
                              {detail}
                            </span>
                          </li>
                        ))}
                      </ul>

                      {principle.boundary && (
                        <div className="relative mt-6 border-t border-white/20 pt-4 transition-all duration-300 group-hover:border-white/30">
                          <div className="flex items-start gap-3">
                            <div className="mt-1 flex h-5 w-5 items-center justify-center rounded-md bg-linear-to-br from-slate-700 to-slate-900 shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:shadow-md">
                              <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                              </svg>
                            </div>
                            <p className="text-xs text-slate-300 md:text-sm transition-colors duration-300 group-hover:text-slate-200">
                              {principle.boundary}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className={`absolute top-0 right-0 w-32 h-32 bg-linear-to-br ${gradients[index].split(' ')[0]}/5 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-700`}></div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Why This Matters */}
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
                    Context
                  </p>
                </div>
                
                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white md:text-3xl transition-colors duration-300 group-hover:text-white">
                  Why this matters
                </h2>

                <div className="mt-6 space-y-4 text-sm leading-relaxed text-slate-200 md:text-base">
                  <p>
                    The financial advisory landscape can be complex and difficult to navigate. Many platforms claim to help but have conflicts of interest — they earn commissions from referrals, rank advisors based on commercial relationships, or use subtle pressure tactics.
                  </p>
                  <p>
                    Advisens exists as an alternative. We believe that preparing for a financial advice decision should be calm, clear, and entirely on your terms. No sales process, no urgency, no hidden incentives.
                  </p>
                  <p>
                    Our only goal is to help you think through your situation so you can make a decision that feels right for you.
                  </p>
                </div>
              </div>

              <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-blue-500/5 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            </div>
          </div>
        </section>

        {/* About the Team */}
        <section className="relative border-t border-white/10 overflow-hidden">
          <div className="relative mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-12">
            <div className="group relative rounded-3xl border border-white/20 bg-white/10 backdrop-blur-md p-7 shadow-lg shadow-black/20 md:p-9 overflow-hidden transition-all duration-500 hover:shadow-xl hover:shadow-black/30 hover:border-white/30">
              <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                <div className="absolute inset-0 rounded-3xl bg-linear-to-br from-emerald-500/10 via-teal-500/10 to-cyan-500/10 blur-2xl"></div>
              </div>

              <div className="absolute inset-0 opacity-[0.015]" style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, rgb(255 255 255) 1px, transparent 0)`,
                backgroundSize: '40px 40px'
              }}></div>

              <div className="relative z-10">
                <div className="flex items-center gap-3">
                  <div className="h-px w-8 bg-linear-to-r from-emerald-500 to-teal-500"></div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-300 transition-colors duration-300 group-hover:text-slate-200">
                    About
                  </p>
                </div>
                
                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white md:text-3xl transition-colors duration-300 group-hover:text-white">
                  Who we are
                </h2>

                <div className="mt-6 space-y-4 text-sm leading-relaxed text-slate-200 md:text-base">
                  <p>
                    Advisens was created by a small team based in the GCC with experience in financial services, technology, and education. We understand how challenging it can be to navigate the advice landscape, and we wanted to create a resource that puts the user first.
                  </p>
                  <p>
                    We are not advisors ourselves. We do not manage money, sell products, or operate on behalf of any financial institution. Our work is funded independently to ensure we can remain neutral.
                  </p>
                </div>
              </div>

              <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-emerald-500/5 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}

