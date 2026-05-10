"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function HowToVetAdvisorPage() {
  const router = useRouter();

  const handleSubmitCase = () => router.push("/submit");
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    router.push("/");
  };

  return (
    <div className="min-h-screen text-slate-900 flex flex-col relative">
      <div
        className="fixed inset-0 -z-30 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/web%20background.jpeg')" }}
      />
      <div className="fixed inset-0 -z-20 bg-linear-to-b from-black/35 via-black/20 to-black/10" />

      <Header onNavClick={handleNavClick} onSubmitCase={handleSubmitCase} />

      <div className="relative z-10 flex-1">
        <article className="mx-auto max-w-3xl px-4 py-14 md:px-6 md:py-20">

          {/* Back link */}
          <Link
            href="/insights"
            className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors mb-8 group"
          >
            <span className="transition-transform duration-200 group-hover:-translate-x-0.5">←</span>
            Back to Insights
          </Link>

          {/* Article header */}
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold bg-blue-500/10 text-blue-300 border border-blue-500/20">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                Article
              </span>
              <span className="text-xs text-slate-400">10 May 2026</span>
              <span className="h-1 w-1 rounded-full bg-slate-600" />
              <span className="text-xs text-slate-400">8 min read</span>
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-white md:text-4xl leading-tight mb-4">
              How to Vet a Financial Advisor Before Signing Anything
            </h1>

            <p className="text-base text-slate-300 leading-relaxed border-l-2 border-blue-500/40 pl-4">
              Most people spend more time researching a new phone than they do figuring out how to vet a financial advisor. In the GCC especially, the cost of choosing the wrong advisor is high.
            </p>
          </div>

          {/* Article body */}
          <div className="prose prose-invert prose-sm md:prose-base max-w-none space-y-6 text-slate-200 leading-relaxed">

            <p>
              Most people spend more time researching a new phone than they do figuring out how to vet a financial advisor. They compare specs, read reviews, and check return policies before spending $1,000. But when it comes to someone who could influence hundreds of thousands of dollars in savings, retirement funds, or investment decisions, they shake hands after a 30-minute meeting and sign on the dotted line.
            </p>

            <p>
              In the GCC especially, the cost of choosing the wrong advisor is high. Commission-driven advisory culture is the norm, not the exception. Offshore investment products with hidden lock-in periods and steep surrender charges get sold to expats every day. Getting out of these products takes years and costs real money. Getting into them takes one poorly evaluated meeting.
            </p>

            <p>
              This guide gives you a structured, no-pressure process to evaluate any financial advisor thoroughly before you commit to anything or reveal anything personal. You'll learn which credentials to verify, which public databases to check, how to decode compensation structures, and which interview answers should send you straight to the door.
            </p>

            {/* Section */}
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 my-8">
              <h2 className="text-xl font-semibold text-white mb-3">
                Step Zero — See How Advisors Think Before You Meet Them
              </h2>
              <p>
                Most people start their advisor search by Googling names, asking colleagues, or attending a free seminar. All of these routes put you in reactive mode from the start. You're responding to someone else's sales process before you've formed any independent view of what good advice for your situation actually looks like.
              </p>
              <p className="mt-3">
                The smarter move is to evaluate methodology before you introduce yourself. Advisens is built exactly for this. You submit your financial situation through a structured anonymous case form, describing your goals, income structure, existing products, and any cross-border complexities. Multiple advisors then respond with how they would approach your situation, their priorities, planning sequence, and fee philosophy. No meeting scheduled, no identity revealed, no sales pitch delivered. You see how advisors think before they know who you are.
              </p>
            </div>

            <h2 className="text-xl font-semibold text-white mt-8 mb-3">
              What a Methodology Comparison Actually Reveals
            </h2>
            <p>
              Side-by-side advisor responses answer questions a first meeting never will. You can see whether an advisor leads with products or planning, how they sequence priorities for someone managing an end-of-service gratuity alongside a UK pension, and how clearly they articulate what they charge. This pre-vetting lens filters out misaligned advisors before you invest a single hour. Those whose approach fits your goals move forward. Those who lead with product pitches or vague language have already answered the question.
            </p>

            <h2 className="text-xl font-semibold text-white mt-8 mb-3">
              The Credentials That Actually Matter
            </h2>
            <p>
              Not every financial advisor designation carries the same weight. Some require years of education, supervised experience, rigorous exams, and ongoing ethics obligations. Others are earned over a weekend. Knowing which is which is non-negotiable before you trust anyone with your financial future.
            </p>

            <h2 className="text-xl font-semibold text-white mt-8 mb-3">
              Decoding the Compensation Model
            </h2>
            <p>
              Fee structure is where most advisor vetting breaks down. People ask "how much do you charge?" and accept a percentage or a dollar figure without understanding what drives the number or whose interests it serves. The structure of compensation is more revealing than the amount.
            </p>

            <div className="grid gap-4 md:grid-cols-2 my-6">
              {[
                { model: "AUM fees", detail: "0.5%–1.5% annually in the GCC. On a $500,000 portfolio, that's $5,000 per year. The advisor earns more as your portfolio grows." },
                { model: "Hourly rates", detail: "$100–$500 per hour. Suited for targeted engagements. You pay for time, not outcomes." },
                { model: "Flat annual fee", detail: "$1,500–$15,000 for comprehensive planning. Predictable cost regardless of portfolio size." },
                { model: "Commission", detail: "1%–8% of a product's value upfront, paid by the product provider. The least transparent model — deserves the most scrutiny." },
              ].map(({ model, detail }) => (
                <div key={model} className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <h4 className="text-sm font-semibold text-white mb-1">{model}</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">{detail}</p>
                </div>
              ))}
            </div>

            <p>
              A commission-based advisor earns more when they place you in a specific product. An AUM-based advisor earns more as your portfolio grows. A flat-fee or hourly advisor earns the same regardless of what they recommend. This isn't a character judgment — it's structural reality. The question to ask isn't just "what do you charge?" but <strong className="text-white">"what happens to your income based on what you recommend to me?"</strong> If that question makes an advisor uncomfortable, pay attention to that reaction.
            </p>

            <h2 className="text-xl font-semibold text-white mt-8 mb-3">
              Interview Answers That Reveal Misaligned Incentives
            </h2>
            <p>
              Pay close attention to how an advisor responds when you ask direct questions. The behavioural red flags are consistent:
            </p>
            <ul className="space-y-2 mt-3">
              {[
                "Evasiveness when asked exactly how they're compensated",
                "Refusal to confirm fiduciary status in writing",
                "Guaranteed return language or urgency framing",
                "Recommendations for complex products before they've asked a single question about your situation",
                "An inability to explain their process in plain language",
              ].map((flag) => (
                <li key={flag} className="flex gap-3 group/item">
                  <div className="relative mt-1.5 shrink-0">
                    <div className="h-1.5 w-1.5 rounded-full bg-red-400" />
                  </div>
                  <span>{flag}</span>
                </li>
              ))}
            </ul>

            <p className="mt-4">
              Confident, transparent advisors welcome direct questions. Advisors who deflect, spend more time promoting their credentials than answering, or respond with "I always act in your best interest" without offering written confirmation are telling you something important. Don't overlook it.
            </p>

            <h2 className="text-xl font-semibold text-white mt-8 mb-3">
              Questions to Ask Before Any Commitment
            </h2>
            <div className="space-y-3">
              {[
                { q: "Walk me through how you would approach someone in my situation.", why: "Reveals methodology and whether they listen before recommending." },
                { q: "What types of clients do you typically work with, and do you have experience with cross-border financial planning for expats in the GCC?", why: "Specialisation matters. An advisor who has never worked with a dual-country expat is not the right fit, regardless of credentials." },
                { q: "What happens to my account if you leave the firm?", why: "Reveals operational continuity and whether the relationship is with the advisor or the firm." },
              ].map(({ q, why }) => (
                <div key={q} className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <p className="text-sm font-medium text-white mb-1">"{q}"</p>
                  <p className="text-xs text-slate-400">{why}</p>
                </div>
              ))}
            </div>

            {/* FAQ */}
            <h2 className="text-xl font-semibold text-white mt-8 mb-3">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {[
                {
                  q: "What is the single most important step when vetting a financial advisor?",
                  a: "Start by evaluating how an advisor thinks before you reveal your identity. Use Advisens to submit an anonymous case and compare how different advisors would approach your specific situation. This gives you an informed baseline before any formal meeting begins.",
                },
                {
                  q: "How do I vet a financial advisor in the GCC specifically?",
                  a: "The same credential verification and public records steps apply, but the GCC regulatory environment differs from the US or UK. Fiduciary obligations are not uniformly mandated, so getting written confirmation of fiduciary status and compensation structure carries more weight here than in jurisdictions with stricter baseline requirements.",
                },
              ].map(({ q, a }) => (
                <div key={q} className="rounded-xl border border-white/10 bg-white/5 p-5">
                  <h4 className="text-sm font-semibold text-white mb-2">{q}</h4>
                  <p className="text-sm text-slate-300 leading-relaxed">{a}</p>
                </div>
              ))}
            </div>

            {/* Closing */}
            <div className="rounded-2xl border border-white/15 bg-white/8 backdrop-blur-sm p-6 mt-8">
              <p className="text-slate-200 leading-relaxed">
                Knowing how to vet a financial advisor is not about distrust — it's about applying the same rigour to a high-stakes professional relationship that you'd apply to anything else of comparable consequence. Start by seeing how advisors approach a situation like yours before revealing your identity. The advisors worth hiring will welcome every question. The ones who don't are telling you something important before you've signed a single document.
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-14 text-center">
            <button
              onClick={handleSubmitCase}
              className="group/btn relative inline-flex items-center justify-center gap-2 rounded-full bg-linear-to-r from-emerald-600 to-teal-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/40 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/50 hover:-translate-y-0.5"
            >
              <div className="absolute inset-0 rounded-full bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
              <span className="relative">Start anonymously on Advisens</span>
              <svg className="relative h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
            <p className="mt-3 text-xs text-slate-400">Anonymous · No obligation · 10 minutes</p>
          </div>
        </article>
      </div>

      <Footer />
    </div>
  );
}
