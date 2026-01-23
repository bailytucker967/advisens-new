"use client";

import Link from "next/link";

export default function DataAnonymityPage() {
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
              Data & Anonymity
            </h1>
            <p className="text-lg leading-relaxed max-w-2xl font-medium text-slate-200">
              Anonymity is central to how Advisens works. This page explains in detail how your information is protected, what advisors can see, and how identity reveal works.
            </p>
            <p className="text-sm font-medium text-slate-400">
              Last updated: December 2025
            </p>
          </div>
        </section>

        {/* Content Sections */}
        <section className="container mx-auto px-6 pb-20 max-w-[1100px] space-y-12">
          
          {/* Why anonymity matters */}
          <div className="space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              Why anonymity matters
            </h2>
            
            <div className="space-y-4 leading-relaxed font-medium text-slate-200">
              <p>
                Anonymity is not just a privacy feature — it&apos;s fundamental to how Advisens reduces pressure and bias in the financial advice decision process.
              </p>
              <p>
                When you&apos;re anonymous:
              </p>
            </div>

            <div className="space-y-3 pt-4 border-t border-white/20">
              <div className="flex items-start gap-3 py-2">
                <span className="text-emerald-400 mt-1 font-bold text-lg">—</span>
                <span className="font-medium leading-relaxed text-slate-200">
                  You can share your situation honestly without concern about being contacted or followed up with
                </span>
              </div>
              <div className="flex items-start gap-3 py-2">
                <span className="text-emerald-400 mt-1 font-bold text-lg">—</span>
                <span className="leading-relaxed text-slate-200">Advisors respond based on your case, not on assumptions about who you are</span>
              </div>
              <div className="flex items-start gap-3 py-2">
                <span className="text-emerald-400 mt-1 font-bold text-lg">—</span>
                <span className="leading-relaxed text-slate-200">You maintain full control over when and whether to reveal your identity</span>
              </div>
              <div className="flex items-start gap-3 py-2">
                <span className="text-emerald-400 mt-1 font-bold text-lg">—</span>
                <span className="leading-relaxed text-slate-200">There&apos;s no obligation to proceed, no pressure to respond, and no sales follow-up</span>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-white/20">
              <p className="leading-relaxed font-medium text-slate-200">
                Anonymity creates space for thoughtful preparation. You can evaluate advisor responses calmly, on your own timeline, without external pressure.
              </p>
            </div>
          </div>

          {/* How cases are anonymised */}
          <div className="space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              How cases are anonymised by default
            </h2>
            
            <div className="space-y-4 leading-relaxed font-medium text-slate-200">
              <p>
                When you submit a case through Advisens, it is anonymised automatically. Here&apos;s what that means in practice:
              </p>
            </div>

            <div className="space-y-4 pt-4 border-t border-white/20">
              <h3 className="text-lg font-bold text-white">
                Your case includes:
              </h3>
              <ul className="space-y-2 mt-3">
                <li className="flex items-start gap-3 py-1">
                  <span className="text-emerald-400 mt-1 font-bold text-lg">—</span>
                  <span className="text-slate-200">The financial situation, goals, and questions you describe</span>
                </li>
                <li className="flex items-start gap-3 py-1">
                  <span className="text-emerald-400 mt-1 font-bold text-lg">—</span>
                  <span className="text-slate-200">Demographic context you choose to provide (age range, family status, general location)</span>
                </li>
                <li className="flex items-start gap-3 py-1">
                  <span className="text-emerald-400 mt-1 font-bold text-lg">—</span>
                  <span className="text-slate-200">Any other details you explicitly include in your submission</span>
                </li>
              </ul>
            </div>

            <div className="space-y-4 pt-4 border-t border-white/20">
              <h3 className="text-lg font-bold text-white">
                Your case does not include:
              </h3>
              <ul className="space-y-2 mt-3">
                <li className="flex items-start gap-3 py-1">
                  <span className="text-emerald-400 mt-1 font-bold text-lg">—</span>
                  <span className="text-slate-200">Your name</span>
                </li>
                <li className="flex items-start gap-3 py-1">
                  <span className="text-emerald-400 mt-1 font-bold text-lg">—</span>
                  <span className="text-slate-200">Your email address or contact information</span>
                </li>
                <li className="flex items-start gap-3 py-1">
                  <span className="text-emerald-400 mt-1 font-bold text-lg">—</span>
                  <span className="text-slate-200">Your account details (if you created an account to track submissions)</span>
                </li>
                <li className="flex items-start gap-3 py-1">
                  <span className="text-emerald-400 mt-1 font-bold text-lg">—</span>
                  <span className="text-slate-200">Any identifying information beyond what you explicitly write in your case description</span>
                </li>
              </ul>
            </div>

            <div className="mt-6 pt-6 border-t border-white/20">
              <p className="leading-relaxed font-medium text-slate-200">
                Be mindful when writing your case. If you include identifying details (like your company name, specific property addresses, or unique circumstances that could identify you), advisors may be able to infer who you are. We recommend keeping descriptions general unless specificity is necessary for context.
              </p>
            </div>
          </div>

          {/* What advisors can see */}
          <div className="space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              What advisors can and cannot see
            </h2>
            
            <div className="space-y-4 leading-relaxed font-medium text-slate-200">
              <p>
                Advisors only see what is necessary to understand your case and provide a meaningful response.
              </p>
            </div>

            <div className="space-y-4 pt-4 border-t border-white/20">
              <h3 className="text-lg font-bold text-white">
                Advisors can see:
              </h3>
              <ul className="space-y-2 mt-3">
                <li className="flex items-start gap-3 py-1">
                  <span className="text-emerald-400 mt-1 font-bold text-lg">—</span>
                  <span className="text-slate-200">Your anonymised case submission (situation, goals, questions)</span>
                </li>
                <li className="flex items-start gap-3 py-1">
                  <span className="text-emerald-400 mt-1 font-bold text-lg">—</span>
                  <span className="text-slate-200">The demographic context you chose to share</span>
                </li>
                <li className="flex items-start gap-3 py-1">
                  <span className="text-emerald-400 mt-1 font-bold text-lg">—</span>
                  <span className="text-slate-200">A case reference number (for tracking purposes)</span>
                </li>
                <li className="flex items-start gap-3 py-1">
                  <span className="text-emerald-400 mt-1 font-bold text-lg">—</span>
                  <span className="text-slate-200">The date your case was submitted</span>
                </li>
              </ul>
            </div>

            <div className="space-y-4 pt-4 border-t border-white/20">
              <h3 className="text-lg font-bold text-white">
                Advisors cannot see:
              </h3>
              <ul className="space-y-2 mt-3">
                <li className="flex items-start gap-3 py-1">
                  <span className="text-emerald-400 mt-1 font-bold text-lg">—</span>
                  <span className="text-slate-200">Your name, email, or any contact information</span>
                </li>
                <li className="flex items-start gap-3 py-1">
                  <span className="text-emerald-400 mt-1 font-bold text-lg">—</span>
                  <span className="text-slate-200">Whether you created an account or are browsing anonymously</span>
                </li>
                <li className="flex items-start gap-3 py-1">
                  <span className="text-emerald-400 mt-1 font-bold text-lg">—</span>
                  <span className="text-slate-200">Which other advisors received your case</span>
                </li>
                <li className="flex items-start gap-3 py-1">
                  <span className="text-emerald-400 mt-1 font-bold text-lg">—</span>
                  <span className="text-slate-200">Which other advisors have responded to your case</span>
                </li>
                <li className="flex items-start gap-3 py-1">
                  <span className="text-emerald-400 mt-1 font-bold text-lg">—</span>
                  <span className="text-slate-200">Whether you&apos;ve reviewed their response</span>
                </li>
                <li className="flex items-start gap-3 py-1">
                  <span className="text-emerald-400 mt-1 font-bold text-lg">—</span>
                  <span className="text-slate-200">Whether you&apos;ve chosen to reveal your identity to other advisors</span>
                </li>
              </ul>
            </div>

            <div className="mt-6 pt-6 border-t border-white/20">
              <p className="leading-relaxed font-medium text-slate-200">
                Each advisor operates independently. They do not know who else is being considered, and they cannot see whether you&apos;ve accepted or declined their response. This ensures responses are based on your case alone, not on competitive dynamics.
              </p>
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              Questions about anonymity
            </h2>
            
            <div className="space-y-4 leading-relaxed font-medium text-slate-200">
              <p>
                If you have questions about how anonymity works, or if you believe your anonymity has been compromised, please contact us at <span className="text-white">privacy@advisens.com</span>
              </p>
              <p>
                We take anonymity seriously and will respond promptly to any concerns.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}


