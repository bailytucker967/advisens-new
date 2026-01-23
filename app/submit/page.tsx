
"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "../components/Header";
import Footer from "../components/Footer";

type Step = 1 | 2 | 3 | 4;

type Option = { value: string; label: string };

type SubmitCaseForm = {
  basedIn: string;
  timeHorizon: string;
  hadAdviceBefore: string;
  perspectives: string[];
  situation: string;
  unclear: string;
  lookingFor: string;
  areas: string[];
  email: string;
  password: string;
  consentNotAdvice: boolean;
  consentShareAnonymously: boolean;
};

const DEFAULT_FORM: SubmitCaseForm = {
  basedIn: "prefer_not_to_say",
  timeHorizon: "prefer_not_to_say",
  hadAdviceBefore: "prefer_not_to_say",
  perspectives: [],
  situation: "",
  unclear: "",
  lookingFor: "",
  areas: [],
  email: "",
  password: "",
  consentNotAdvice: false,
  consentShareAnonymously: false,
};

const BASED_IN_OPTIONS: Option[] = [
  { value: "prefer_not_to_say", label: "Prefer not to say" },
  { value: "uae", label: "UAE" },
  { value: "ksa", label: "Saudi Arabia" },
  { value: "qatar", label: "Qatar" },
  { value: "bahrain", label: "Bahrain" },
  { value: "oman", label: "Oman" },
  { value: "kuwait", label: "Kuwait" },
  { value: "other", label: "Other / Outside GCC" },
];

const TIME_HORIZON_OPTIONS: Option[] = [
  { value: "prefer_not_to_say", label: "Prefer not to say" },
  { value: "under_12m", label: "Under 12 months" },
  { value: "1_3y", label: "1–3 years" },
  { value: "3_5y", label: "3–5 years" },
  { value: "5_plus", label: "5+ years" },
  { value: "unsure", label: "Not sure yet" },
];

const ADVICE_BEFORE_OPTIONS: Option[] = [
  { value: "prefer_not_to_say", label: "Prefer not to say" },
  { value: "yes_recent", label: "Yes (recently)" },
  { value: "yes_past", label: "Yes (in the past)" },
  { value: "no", label: "No" },
];

const LOOKING_FOR_OPTIONS: Option[] = [
  { value: "", label: "Please select" },
  { value: "compare_approaches", label: "Compare how different advisors would approach this" },
  { value: "second_opinion", label: "A second opinion on advice I've already received" },
  { value: "understand_fees", label: "Help understanding fees, conflicts, or incentives" },
  { value: "structure_options", label: "Clarify possible structures or routes forward" },
  { value: "define_priorities", label: "Help defining priorities and trade-offs" },
  { value: "other", label: "Other" },
];

const PERSPECTIVE_CHECKBOXES: Option[] = [
  { value: "cross_border", label: "Cross-border / expatriate considerations" },
  { value: "long_vs_near", label: "Long-term planning vs near-term decisions" },
  { value: "return_home", label: "A likely return to my home country" },
  { value: "multi_jurisdiction", label: "Multiple jurisdictions involved" },
  { value: "prefer_not_to_say", label: "Prefer not to say" },
];

const AREAS_CHECKBOXES: Option[] = [
  { value: "investments_savings", label: "Investments / savings" },
  { value: "pensions_planning", label: "Pensions / long-term planning" },
  { value: "cross_border", label: "Cross-border considerations" },
  { value: "protection", label: "Protection / insurance" },
  { value: "fees_structures", label: "Fees / structures / wrappers" },
];

function clampStep(n: number): Step {
  if (n <= 1) return 1;
  if (n >= 4) return 4;
  return n as Step;
}

export default function SubmitCasePage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState<SubmitCaseForm>(DEFAULT_FORM);

  const handleSubmitCase = () => {
    // Already on submit page, do nothing or scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    router.push("/");
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  const stepTitle = useMemo(() => {
    switch (step) {
      case 1:
        return "Before you begin";
      case 2:
        return "Context";
      case 3:
        return "Your situation";
      case 4:
        return "Permission & submit";
    }
  }, [step]);

  const canSubmit =
    form.email.trim().length > 0 &&
    form.password.trim().length >= 6 &&
    form.consentNotAdvice &&
    form.consentShareAnonymously;

  const setField = <K extends keyof SubmitCaseForm>(key: K, value: SubmitCaseForm[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const toggleArray = (key: "perspectives" | "areas", value: string) => {
    setForm((prev) => {
      const arr = prev[key];
      const next = arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
      if (key === "perspectives") {
        if (value === "prefer_not_to_say" && next.includes("prefer_not_to_say")) {
          return { ...prev, perspectives: ["prefer_not_to_say"] };
        }
        return {
          ...prev,
          perspectives: next.filter((v) => v !== "prefer_not_to_say"),
        };
      }
      return { ...prev, [key]: next } as SubmitCaseForm;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    alert("Case submitted (demo). Wire this to your backend when ready.");
  };

  return (
    <div className="min-h-screen flex flex-col text-slate-50">
      {/* Shared background */}
      <div
        className="fixed inset-0 -z-30 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/web%20background.jpeg')" }}
      />
      <div className="fixed inset-0 -z-20 bg-gradient-to-b from-black/40 via-black/30 to-black/20" />

      {/* Header */}
      <Header onNavClick={handleNavClick} onSubmitCase={handleSubmitCase} />

      <main className="relative z-10 flex-1 px-4 pb-16 pt-4 md:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="mb-6 md:mb-8">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">
              Submit a case
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white md:text-4xl">
              {stepTitle}
            </h1>
          </div>

          {/* Step 1 */}
          {step === 1 && (
            <div className="space-y-8 text-slate-100">
              <p className="max-w-3xl text-sm md:text-base text-slate-200">
                This is a decision-preparation platform. We do not provide financial advice, recommend products,
                or endorse specific advisors.
              </p>

              <section className="space-y-3">
                <h2 className="text-base font-semibold text-white">How this works</h2>
                <ul className="space-y-2 text-sm text-slate-200">
                  <li>You'll be asked a few short questions to help structure your situation.</li>
                  <li>Qualified advisors respond anonymously with how they would approach it.</li>
                  <li>You review their thinking before deciding whether to continue.</li>
                </ul>
              </section>

              <section className="space-y-3">
                <h2 className="text-base font-semibold text-white">Your control</h2>
                <ul className="space-y-2 text-sm text-slate-200">
                  <li>No obligation to proceed with any advisor.</li>
                  <li>Advisors cannot contact you without your explicit consent.</li>
                  <li>You can stop at any point in the process.</li>
                  <li>Your case remains anonymous throughout.</li>
                </ul>
              </section>

              <div className="mt-8 flex justify-end">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="rounded-full border border-white/80 px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-white hover:text-slate-900"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div className="space-y-6">
              <p className="max-w-3xl text-sm md:text-base text-slate-200">
                A few light questions to help frame your situation. All fields are optional.
              </p>

              <div className="rounded-3xl border border-white/10 bg-white/90 p-6 text-slate-900 shadow-xl backdrop-blur-xl md:p-8">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-900">
                      Where are you currently based?
                    </label>
                    <p className="text-xs text-slate-500">
                      Optional — helps frame the regulatory environment.
                    </p>
                    <select
                      className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900"
                      value={form.basedIn}
                      onChange={(e) => setField("basedIn", e.target.value)}
                    >
                      {BASED_IN_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-900">
                      How long do you expect to remain in the region?
                    </label>
                    <p className="text-xs text-slate-500">
                      Optional — helps frame time horizons, not outcomes.
                    </p>
                    <select
                      className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900"
                      value={form.timeHorizon}
                      onChange={(e) => setField("timeHorizon", e.target.value)}
                    >
                      {TIME_HORIZON_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-semibold text-slate-900">
                      Have you received financial advice before?
                    </label>
                    <select
                      className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900"
                      value={form.hadAdviceBefore}
                      onChange={(e) => setField("hadAdviceBefore", e.target.value)}
                    >
                      {ADVICE_BEFORE_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mt-6 space-y-2">
                  <div className="text-sm font-semibold text-slate-900">
                    Which perspective would you want an advisor to consider?
                  </div>
                  <p className="text-xs text-slate-500">
                    Optional — helps frame the decision context, not personal profiling.
                  </p>
                  <div className="mt-2 grid gap-2 md:grid-cols-2">
                    {PERSPECTIVE_CHECKBOXES.map((opt) => (
                      <label key={opt.value} className="flex items-start gap-2 text-sm text-slate-700">
                        <input
                          type="checkbox"
                          className="mt-1 rounded border-slate-300 text-emerald-600"
                          checked={form.perspectives.includes(opt.value)}
                          onChange={() => toggleArray("perspectives", opt.value)}
                        />
                        <span>{opt.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="rounded-full border border-white/40 px-4 py-2 text-xs font-medium text-slate-100 hover:bg-white/10"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="rounded-full border border-white/80 px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-white hover:text-slate-900"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <div className="space-y-6">
              <p className="max-w-3xl text-sm md:text-base text-slate-200">
                Describe your situation in your own words. You don't need to share specific numbers or personal
                identifiers.
              </p>

              <div className="rounded-3xl border border-white/10 bg-white/90 p-6 text-slate-900 shadow-xl backdrop-blur-xl md:p-8">
                <div className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-900">
                      Describe your situation in your own words.
                    </label>
                    <textarea
                      className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900"
                      rows={4}
                      value={form.situation}
                      onChange={(e) => setField("situation", e.target.value)}
                      placeholder="A few sentences is enough."
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-900">
                      What feels unclear or unresolved right now?
                    </label>
                    <p className="text-xs text-slate-500">
                      There's no right or wrong level of detail.
                    </p>
                    <textarea
                      className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900"
                      rows={4}
                      value={form.unclear}
                      onChange={(e) => setField("unclear", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-900">
                      Which best describes what you're looking for right now?
                    </label>
                    <select
                      className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900"
                      value={form.lookingFor}
                      onChange={(e) => setField("lookingFor", e.target.value)}
                    >
                      {LOOKING_FOR_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm font-semibold text-slate-900">
                      Which areas does your situation touch on? (Select all that apply)
                    </div>
                    <div className="mt-2 grid gap-2 md:grid-cols-2">
                      {AREAS_CHECKBOXES.map((opt) => (
                        <label key={opt.value} className="flex items-start gap-2 text-sm text-slate-700">
                          <input
                            type="checkbox"
                            className="mt-1 rounded border-slate-300 text-emerald-600"
                            checked={form.areas.includes(opt.value)}
                            onChange={() => toggleArray("areas", opt.value)}
                          />
                          <span>{opt.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="rounded-full border border-white/40 px-4 py-2 text-xs font-medium text-slate-100 hover:bg-white/10"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="rounded-full border border-white/80 px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-white hover:text-slate-900"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* Step 4 */}
          {step === 4 && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <p className="max-w-3xl text-sm md:text-base text-slate-200">
                Create an account so you can review responses securely, when you choose.
              </p>

              <div className="max-w-3xl rounded-2xl border border-emerald-400/40 bg-emerald-500/10 p-4 text-sm text-emerald-50">
                <div className="font-semibold text-emerald-200">Your case remains anonymous</div>
                <p className="mt-1 text-emerald-50/90">
                  Advisors only see your case details, not your identity. Your identity can only be revealed by you,
                  if and when you choose to connect with an advisor after reviewing their response.
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/90 p-6 text-slate-900 shadow-xl backdrop-blur-xl md:p-8">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="text-sm font-semibold text-slate-900">Create your account</div>
                    <p className="text-xs text-slate-500">
                      Used only to notify you when responses are ready. No outreach, no sharing.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-900">Email address</label>
                    <input
                      className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900"
                      type="email"
                      value={form.email}
                      onChange={(e) => setField("email", e.target.value)}
                      placeholder="you@email.com"
                      autoComplete="email"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-900">Set a password</label>
                    <p className="text-xs text-slate-500">For secure access to your case. (6+ characters)</p>
                    <input
                      className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900"
                      type="password"
                      value={form.password}
                      onChange={(e) => setField("password", e.target.value)}
                      placeholder="••••••••"
                      autoComplete="new-password"
                    />
                  </div>

                  <div className="space-y-3 pt-2 text-sm text-slate-800">
                    <label className="flex items-start gap-2">
                      <input
                        type="checkbox"
                        className="mt-1 rounded border-slate-300 text-emerald-600"
                        checked={form.consentNotAdvice}
                        onChange={(e) => setField("consentNotAdvice", e.target.checked)}
                      />
                      <span>
                        I understand that Advisens does not provide financial advice. Advisor responses are for
                        decision-preparation purposes only.
                      </span>
                    </label>

                    <label className="flex items-start gap-2">
                      <input
                        type="checkbox"
                        className="mt-1 rounded border-slate-300 text-emerald-600"
                        checked={form.consentShareAnonymously}
                        onChange={(e) => setField("consentShareAnonymously", e.target.checked)}
                      />
                      <span>
                        I consent to my case being shared anonymously with participating advisors for review and
                        response.
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="rounded-full border border-white/40 px-4 py-2 text-xs font-medium text-slate-100 hover:bg-white/10"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={!canSubmit}
                  className="rounded-full border border-white/90 px-7 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-white hover:text-slate-900 disabled:cursor-not-allowed disabled:border-white/40 disabled:text-white/60 disabled:hover:bg-transparent disabled:hover:text-white"
                >
                  Submit case
                </button>
              </div>
            </form>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
