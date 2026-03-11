 "use client";

import React from "react";
import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function ForAdvisorsPage() {
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const noopSubmit = () => {};

  return (
    <div className="min-h-screen flex flex-col text-slate-50">
      <div
        className="fixed inset-0 -z-30 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/web%20background.jpeg')" }}
      />
      <div className="fixed inset-0 -z-20 bg-gradient-to-b from-black/40 via-black/30 to-black/20" />

      <Header onNavClick={handleNavClick} onSubmitCase={noopSubmit} />

      <main className="relative z-10 flex-1 px-4 pb-16 pt-6 md:px-8">
        <div className="mx-auto max-w-5xl space-y-10 md:space-y-12">
          {/* Intro */}
          <section className="space-y-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-slate-300 hover:text-white transition"
            >
              ← Back to home
            </Link>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">
              For advisors
            </p>
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-white">
              Advisens for financial advisors
            </h1>
            <p className="max-w-3xl text-sm md:text-base text-slate-200 leading-relaxed">
              Advisens is a decision-preparation platform for expats in the GCC who are considering
              financial advice but want to compare approaches before revealing who they are. This
              page explains who uses the platform, what a typical case looks like, and what we ask
              from advisors.
            </p>
            <div className="flex flex-wrap gap-3 text-xs text-slate-300">
              <span className="rounded-full border border-emerald-400/40 bg-emerald-500/10 px-3 py-1">
                No lead auctions
              </span>
              <span className="rounded-full border border-emerald-400/40 bg-emerald-500/10 px-3 py-1">
                Anonymous cases
              </span>
              <span className="rounded-full border border-emerald-400/40 bg-emerald-500/10 px-3 py-1">
                Approach, not product-pushing
              </span>
            </div>
          </section>

          {/* Who the users are */}
          <section className="rounded-3xl border border-white/10 bg-slate-900/40 backdrop-blur-xl p-6 md:p-8 space-y-4">
            <h2 className="text-base md:text-lg font-semibold text-white">
              Who uses Advisens?
            </h2>
            <p className="text-sm md:text-base text-slate-200 leading-relaxed">
              Our users are primarily expatriates living in the GCC who are unsure how to navigate
              advice, products, and incentives. They are typically thoughtful, skeptical of
              commission-heavy sales, and want clarity before committing to a relationship.
            </p>
            <div className="grid gap-4 md:grid-cols-3 text-sm text-slate-200">
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Common profiles
                </p>
                <ul className="space-y-1.5">
                  <li>Mid-career professionals in Dubai, Abu Dhabi, Riyadh, Doha</li>
                  <li>Couples planning school fees &amp; retirement</li>
                  <li>Long-term expats with existing offshore policies</li>
                </ul>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  What they&apos;re worried about
                </p>
                <ul className="space-y-1.5">
                  <li>Hidden fees, exit penalties, and conflicts of interest</li>
                  <li>Locking money away in the wrong structure</li>
                  <li>Being sold a product instead of receiving advice</li>
                </ul>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  What they&apos;re looking for
                </p>
                <ul className="space-y-1.5">
                  <li>Clear explanation of options and trade‑offs</li>
                  <li>A sense of how you think and work</li>
                  <li>Fee philosophy and how you are paid</li>
                </ul>
              </div>
            </div>
          </section>

          {/* What a typical case looks like */}
          <section className="rounded-3xl border border-white/10 bg-slate-900/40 backdrop-blur-xl p-6 md:p-8 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-base md:text-lg font-semibold text-white">
                  What a typical case looks like
                </h2>
                <p className="mt-1 text-sm text-slate-300">
                  Every case follows a consistent structure so you can focus on judgement rather
                  than chasing missing information.
                </p>
              </div>
              <Link
                href="/advisor-application"
                className="rounded-full border border-emerald-400/50 bg-emerald-500/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-100 hover:bg-emerald-500/30"
              >
                Apply as an advisor
              </Link>
            </div>

            <div className="grid gap-4 md:grid-cols-[minmax(0,1.1fr),minmax(0,1fr)]">
              <div className="space-y-3 text-sm text-slate-200">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Context
                  </p>
                  <ul className="mt-1 space-y-1.5">
                    <li>• Where they&apos;re based (e.g. Dubai, Riyadh, Doha)</li>
                    <li>• Time horizon (under 12 months, 1–3 years, 3–5 years, 5+)</li>
                    <li>• Whether they&apos;ve had advice before</li>
                    <li>• High‑level decision context (e.g. cross‑border, likely return home)</li>
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Situation
                  </p>
                  <ul className="mt-1 space-y-1.5">
                    <li>• Free‑text description of their situation</li>
                    <li>• What feels unclear or unresolved</li>
                    <li>• What they are specifically looking for from advisors</li>
                    <li>• Areas involved (investments, pensions, protection, fees/structures, etc.)</li>
                  </ul>
                </div>
              </div>

              <div className="rounded-2xl border border-white/15 bg-white/5 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-200">
                    Case 009 · Investments / savings
                  </span>
                  <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-[11px] font-medium text-emerald-100">
                    Anonymous user
                  </span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed">
                  &quot;I&apos;m a 38‑year‑old expat in Dubai with savings in cash and a couple of
                  offshore policies from a previous advisor. I want a clearer long‑term plan for
                  retirement and school fees without locking everything away or paying hidden
                  commissions.&quot;
                </p>
                <div className="rounded-2xl border border-slate-200/15 bg-slate-900/40 p-3 space-y-2">
                  <p className="text-[11px] font-semibold text-slate-100">
                    What they&apos;re looking for
                  </p>
                  <p className="text-[11px] text-slate-300">
                    Compare how different advisors would approach this, understand fees and
                    incentives, and see who feels like the right long‑term fit.
                  </p>
                </div>
                <p className="text-[11px] text-slate-400">
                  You never see the user&apos;s name or contact details inside the case itself. Those
                  are only revealed if the user chooses to reveal your profile.
                </p>
              </div>
            </div>
          </section>

          {/* What advisors are expected to do */}
          <section className="rounded-3xl border border-white/10 bg-slate-900/40 backdrop-blur-xl p-6 md:p-8 space-y-5">
            <h2 className="text-base md:text-lg font-semibold text-white">
              What we expect from advisors
            </h2>
            <p className="text-sm md:text-base text-slate-200 leading-relaxed">
              When you respond to a case, you&apos;re not giving formal advice. You are showing how
              you think and how you would approach the situation if the user were to become a
              client.
            </p>

            <div className="grid gap-4 md:grid-cols-3 text-sm text-slate-200">
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Your response covers
                </p>
                <ul className="space-y-1.5">
                  <li>• How you would approach this situation overall</li>
                  <li>• What you would want to clarify before giving advice</li>
                  <li>• How decisions are typically made in similar cases</li>
                  <li>• Your fee philosophy and how you are paid</li>
                  <li>• Who this approach tends to suit (and who it doesn&apos;t)</li>
                </ul>
              </div>
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  What good responses look like
                </p>
                <ul className="space-y-1.5">
                  <li>• Plain language, no jargon where it isn&apos;t needed</li>
                  <li>• Transparent about conflicts, trade‑offs, and uncertainty</li>
                  <li>• Product‑agnostic, focused on structure and process</li>
                  <li>• Specific enough to be useful, without being personalised advice</li>
                </ul>
              </div>
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Platform rules
                </p>
                <ul className="space-y-1.5">
                  <li>• No direct outreach unless the user explicitly reveals your profile</li>
                  <li>• No pressure tactics or time‑limited offers</li>
                  <li>• Respect confidentiality and platform guidelines</li>
                </ul>
              </div>
            </div>

            <div className="mt-3 rounded-2xl border border-emerald-400/40 bg-emerald-500/10 p-4 text-sm text-emerald-50">
              <p className="font-semibold mb-1">Important</p>
              <p className="text-xs md:text-[13px] leading-relaxed">
                Advisens is not a lead marketplace. Users do not pay to be introduced, and advisors
                are not bidding for contact details. The goal is to help users compare approaches,
                then let them choose whether to reveal their identity and contact you.
              </p>
            </div>
          </section>

          {/* Next steps */}
          <section className="rounded-3xl border border-emerald-400/40 bg-gradient-to-br from-emerald-500/20 via-emerald-500/10 to-teal-500/20 p-6 md:p-8 space-y-4">
            <h2 className="text-base md:text-lg font-semibold text-white">
              Next steps if you&apos;d like to join
            </h2>
            <ol className="space-y-2 text-sm text-emerald-50 list-decimal list-inside">
              <li>Review our eligibility and platform rules on the application page.</li>
              <li>Submit your profile, regulatory details, and supporting documents.</li>
              <li>
                If there&apos;s a fit, we&apos;ll contact you to discuss onboarding, expectations, and
                cost.
              </li>
            </ol>
            <div className="pt-3">
              <Link
                href="/advisor-application"
                className="inline-flex items-center gap-2 rounded-full bg-white/95 px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-900 shadow-lg hover:bg-white"
              >
                Go to advisor application
                <span className="text-emerald-600">→</span>
              </Link>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

