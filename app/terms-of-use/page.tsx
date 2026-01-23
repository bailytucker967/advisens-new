"use client";

import Link from "next/link";

export default function TermsOfUsePage() {
  return (
    <div className="min-h-screen text-slate-900 flex flex-col relative">
      {/* Global background (same as home screen) */}
      <div
        className="fixed inset-0 -z-30 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/web%20background.jpeg')" }}
      />
      {/* Darken/soften overlay for readability */}
      <div className="fixed inset-0 -z-20 bg-linear-to-b from-black/35 via-black/20 to-black/10" />

      <div className="relative z-10">
        {/* Header */}
        <section className="container mx-auto px-6 py-20 max-w-[1100px]">
          <div className="space-y-6">
            <Link href="/" className="text-slate-200 hover:text-white text-sm transition-colors inline-block mb-4">
              ← Back to home
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              Terms of Use
            </h1>
            <p className="text-lg leading-relaxed max-w-2xl font-medium text-slate-200">
              These terms explain what Advisens does, what it doesn&apos;t do, and your responsibilities as a user. They&apos;re written in plain language to ensure clarity.
            </p>
            <p className="text-sm font-medium text-slate-400">
              Last updated: December 2025
            </p>
          </div>
        </section>

        {/* Content Sections */}
        <section className="container mx-auto px-6 pb-20 max-w-[1100px] space-y-12">
          
          {/* What Advisens is */}
          <div className="space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              What Advisens is
            </h2>
            
            <div className="space-y-4 leading-relaxed font-medium text-slate-200">
              <p>
                Advisens is a decision-preparation platform. It helps people in the GCC who are considering financial advice to clarify their situation, compare advisor approaches, and prepare for a decision.
              </p>
              <p>
                We facilitate a blind audition process where users submit anonymised cases and advisors respond with their approach and methodology. This allows users to evaluate advisors based on how they think, not on marketing materials or sales conversations.
              </p>
            </div>

            <div className="mt-6 pt-6 border-t border-white/20">
              <p className="leading-relaxed font-medium text-slate-200">
                <strong className="text-white">Advisens is not a financial advisory service.</strong> We do not provide financial advice, recommend specific actions, or manage assets. We provide structure for comparison and preparation.
              </p>
            </div>
          </div>

          {/* What we don't do */}
          <div className="space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              What we don&apos;t do
            </h2>
            
            <div className="space-y-4 leading-relaxed font-medium text-slate-200">
              <p>
                To be clear about our role and boundaries:
              </p>
            </div>

            <div className="space-y-3 pt-4 border-t border-white/20">
              <div className="flex items-start gap-3 py-2">
                <span className="text-emerald-400 mt-1 font-bold text-lg">—</span>
                <span className="font-medium leading-relaxed text-slate-200">
                  We do not recommend specific advisors, products, or financial strategies
                </span>
              </div>
              <div className="flex items-start gap-3 py-2">
                <span className="text-emerald-400 mt-1 font-bold text-lg">—</span>
                <span className="leading-relaxed text-slate-200">We do not rank, rate, or endorse advisors</span>
              </div>
              <div className="flex items-start gap-3 py-2">
                <span className="text-emerald-400 mt-1 font-bold text-lg">—</span>
                <span className="leading-relaxed text-slate-200">We do not evaluate the quality or suitability of advisor responses</span>
              </div>
              <div className="flex items-start gap-3 py-2">
                <span className="text-emerald-400 mt-1 font-bold text-lg">—</span>
                <span className="leading-relaxed text-slate-200">We do not provide financial advice or personalized recommendations</span>
              </div>
              <div className="flex items-start gap-3 py-2">
                <span className="text-emerald-400 mt-1 font-bold text-lg">—</span>
                <span className="leading-relaxed text-slate-200">We do not manage relationships between users and advisors after initial connection</span>
              </div>
              <div className="flex items-start gap-3 py-2">
                <span className="text-emerald-400 mt-1 font-bold text-lg">—</span>
                <span className="leading-relaxed text-slate-200">We do not receive commissions, referral fees, or payments from advisors</span>
              </div>
            </div>
          </div>

          {/* Your responsibility */}
          <div className="space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              Your responsibility as a user
            </h2>
            
            <div className="space-y-4 leading-relaxed font-medium text-slate-200">
              <p>
                You are responsible for the decisions you make. Advisens provides a comparison structure, but you remain in control of your choices at every step.
              </p>
              <p>
                This includes:
              </p>
            </div>

            <div className="space-y-3 pt-4 border-t border-white/20">
              <div className="flex items-start gap-3 py-2">
                <span className="text-emerald-400 mt-1 font-bold text-lg">—</span>
                <span className="font-medium leading-relaxed text-slate-200">
                  Deciding whether financial advice is appropriate for your situation
                </span>
              </div>
              <div className="flex items-start gap-3 py-2">
                <span className="text-emerald-400 mt-1 font-bold text-lg">—</span>
                <span className="leading-relaxed text-slate-200">Evaluating advisor responses and determining which approach, if any, suits your needs</span>
              </div>
              <div className="flex items-start gap-3 py-2">
                <span className="text-emerald-400 mt-1 font-bold text-lg">—</span>
                <span className="leading-relaxed text-slate-200">Choosing whether to reveal your identity and connect with an advisor</span>
              </div>
              <div className="flex items-start gap-3 py-2">
                <span className="text-emerald-400 mt-1 font-bold text-lg">—</span>
                <span className="leading-relaxed text-slate-200">Conducting your own due diligence on any advisor before engaging their services</span>
              </div>
              <div className="flex items-start gap-3 py-2">
                <span className="text-emerald-400 mt-1 font-bold text-lg">—</span>
                <span className="leading-relaxed text-slate-200">Understanding the terms, fees, and regulatory status of any advisor you choose to work with</span>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-white/20">
              <p className="leading-relaxed font-medium text-slate-200">
                Advisens does not verify advisor credentials, regulatory compliance, or professional qualifications. While advisors who participate are expected to operate according to relevant regulations, you are responsible for confirming their status and suitability for your needs.
              </p>
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              Questions about these terms
            </h2>
            
            <div className="space-y-4 leading-relaxed font-medium text-slate-200">
              <p>
                If you have questions or concerns about these terms, please contact us at <span className="text-white">legal@advisens.com</span>
              </p>
              <p>
                We aim to respond as quickly as possible.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}


