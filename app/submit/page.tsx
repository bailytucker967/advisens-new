
"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { apiRequest } from "@/lib/api-client";

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
  basedIn: "",
  timeHorizon: "",
  hadAdviceBefore: "",
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

const SITUATION_MIN = 100;
const UNCLEAR_MIN = 50;

const BASED_IN_OPTIONS: Option[] = [
  { value: "", label: "Please select" },
  { value: "uae", label: "UAE" },
  { value: "ksa", label: "Saudi Arabia" },
  { value: "qatar", label: "Qatar" },
  { value: "bahrain", label: "Bahrain" },
  { value: "oman", label: "Oman" },
  { value: "kuwait", label: "Kuwait" },
  { value: "other", label: "Other / Outside GCC" },
  { value: "prefer_not_to_say", label: "Prefer not to say" },
];

const TIME_HORIZON_OPTIONS: Option[] = [
  { value: "", label: "Please select" },
  { value: "under_12m", label: "Under 12 months" },
  { value: "1_3y", label: "1–3 years" },
  { value: "3_5y", label: "3–5 years" },
  { value: "5_plus", label: "5+ years" },
  { value: "unsure", label: "Not sure yet" },
  { value: "prefer_not_to_say", label: "Prefer not to say" },
];

const ADVICE_BEFORE_OPTIONS: Option[] = [
  { value: "", label: "Please select" },
  { value: "yes_recent", label: "Yes (recently)" },
  { value: "yes_past", label: "Yes (in the past)" },
  { value: "no", label: "No" },
  { value: "prefer_not_to_say", label: "Prefer not to say" },
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

function FieldError({ message }: { message: string }) {
  return (
    <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-red-300">
      <span className="inline-block h-1.5 w-1.5 rounded-full bg-red-400" />
      {message}
    </p>
  );
}

function CharCount({ current, min }: { current: number; min: number }) {
  const remaining = min - current;
  const done = current >= min;
  return (
    <span className={`text-[11px] tabular-nums transition-colors ${done ? "text-emerald-400" : "text-slate-500"}`}>
      {done ? `✓ ${current} characters` : `${current} / ${min} minimum`}
    </span>
  );
}

export default function SubmitCasePage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState<SubmitCaseForm>(DEFAULT_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step2Attempted, setStep2Attempted] = useState(false);
  const [step3Attempted, setStep3Attempted] = useState(false);

  const handleSubmitCase = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, _targetId: string) => {
    e.preventDefault();
    router.push("/");
    setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 100);
  };

  const stepTitle = useMemo(() => {
    switch (step) {
      case 1: return "Before you begin";
      case 2: return "Context";
      case 3: return "Your situation";
      case 4: return "Permission & submit";
    }
  }, [step]);

  // ── Step 2 validation ────────────────────────────────────────────
  const step2Errors = useMemo(() => {
    const errs: Record<string, string> = {};
    if (!form.basedIn) errs.basedIn = "Please select where you are currently based.";
    if (!form.timeHorizon) errs.timeHorizon = "Please select your expected time horizon.";
    if (!form.hadAdviceBefore) errs.hadAdviceBefore = "Please indicate whether you've received advice before.";
    if (form.perspectives.length === 0) errs.perspectives = "Please select at least one perspective, or choose 'Prefer not to say'.";
    return errs;
  }, [form.basedIn, form.timeHorizon, form.hadAdviceBefore, form.perspectives]);

  const step2Valid = Object.keys(step2Errors).length === 0;

  const handleStep2Continue = () => {
    setStep2Attempted(true);
    if (step2Valid) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      setStep(3);
    }
  };

  // ── Step 3 validation ────────────────────────────────────────────
  const step3Errors = useMemo(() => {
    const errs: Record<string, string> = {};
    if (form.situation.trim().length < SITUATION_MIN)
      errs.situation = `Please describe your situation in more detail — at least ${SITUATION_MIN} characters required (currently ${form.situation.trim().length}).`;
    if (form.unclear.trim().length < UNCLEAR_MIN)
      errs.unclear = `Please add more detail — at least ${UNCLEAR_MIN} characters required (currently ${form.unclear.trim().length}).`;
    if (!form.lookingFor)
      errs.lookingFor = "Please select what you're looking for.";
    if (form.areas.length === 0)
      errs.areas = "Please select at least one area your situation touches on.";
    return errs;
  }, [form.situation, form.unclear, form.lookingFor, form.areas]);

  const step3Valid = Object.keys(step3Errors).length === 0;

  const handleStep3Continue = () => {
    setStep3Attempted(true);
    if (step3Valid) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      setStep(4);
    }
  };

  // ── Shared helpers ────────────────────────────────────────────────
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
        return { ...prev, perspectives: next.filter((v) => v !== "prefer_not_to_say") };
      }
      return { ...prev, [key]: next } as SubmitCaseForm;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setLoading(true);
    setError("");

    try {
      await apiRequest("/api/cases/submit", {
        method: "POST",
        body: JSON.stringify({
          email: form.email,
          password: form.password,
          basedIn: form.basedIn,
          timeHorizon: form.timeHorizon,
          hadAdviceBefore: form.hadAdviceBefore,
          perspectives: form.perspectives,
          situation: form.situation,
          unclear: form.unclear,
          lookingFor: form.lookingFor,
          areas: form.areas,
          consentNotAdvice: form.consentNotAdvice,
          consentShareAnonymously: form.consentShareAnonymously,
        }),
      });
      router.push("/user-dashboard");
    } catch (err: unknown) {
      setError((err as Error).message || "Failed to submit case. Please try again.");
      setLoading(false);
    }
  };

  const inputBase =
    "mt-1 w-full rounded-lg border px-3 py-2.5 text-sm text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 bg-white/5";
  const inputNormal = `${inputBase} border-white/20 focus:border-emerald-400/50 focus:ring-emerald-400/30`;
  const inputError = `${inputBase} border-red-400/60 focus:border-red-400/80 focus:ring-red-400/30`;

  return (
    <div className="min-h-screen flex flex-col text-slate-50">
      <div
        className="fixed inset-0 -z-30 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/web%20background.jpeg')" }}
      />
      <div className="fixed inset-0 -z-20 bg-gradient-to-b from-black/40 via-black/30 to-black/20" />

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

          {/* Step progress */}
          <div className="mb-8 flex items-center gap-2">
            {([1, 2, 3, 4] as const).map((s) => (
              <div key={s} className="flex items-center">
                <span className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition ${
                  step >= s
                    ? "bg-emerald-500/30 text-emerald-200 border border-emerald-400/50"
                    : "bg-white/5 text-slate-400 border border-white/10"
                }`}>
                  {s}
                </span>
                {s < 4 && <span className="mx-1 h-px w-4 bg-white/20" />}
              </div>
            ))}
          </div>

          {/* ── Step 1 ─────────────────────────────────────────────── */}
          {step === 1 && (
            <div className="space-y-8">
              <div className="rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl p-6 md:p-8">
                <p className="max-w-3xl text-sm md:text-base text-slate-200">
                  This is a decision-preparation platform. We do not provide financial advice, recommend products,
                  or endorse specific advisors.
                </p>
                <section className="mt-6 space-y-3">
                  <h2 className="text-base font-semibold text-white">How this works</h2>
                  <ul className="space-y-2 text-sm text-slate-200">
                    <li>You'll be asked a few short questions to help structure your situation.</li>
                    <li>Qualified advisors respond anonymously with how they would approach it.</li>
                    <li>You review their thinking before deciding whether to continue.</li>
                  </ul>
                </section>
                <section className="mt-6 space-y-3">
                  <h2 className="text-base font-semibold text-white">Your control</h2>
                  <ul className="space-y-2 text-sm text-slate-200">
                    <li>No obligation to proceed with any advisor.</li>
                    <li>Advisors cannot contact you without your explicit consent.</li>
                    <li>You can stop at any point in the process.</li>
                    <li>Your case remains anonymous throughout.</li>
                  </ul>
                </section>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => { window.scrollTo({ top: 0, behavior: "smooth" }); setStep(2); }}
                  className="rounded-full bg-white/95 px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-slate-900 shadow-lg transition hover:bg-white hover:-translate-y-0.5"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* ── Step 2 ─────────────────────────────────────────────── */}
          {step === 2 && (
            <div className="space-y-6">
              <p className="max-w-3xl text-sm md:text-base text-slate-200">
                A few questions to frame your situation. All fields must be completed to proceed.
              </p>

              {/* Summary error banner */}
              {step2Attempted && !step2Valid && (
                <div className="rounded-xl border border-red-400/40 bg-red-500/15 px-4 py-3 text-sm text-red-200">
                  Please complete all fields before continuing.
                </div>
              )}

              <div className="rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl p-6 md:p-8">
                <div className="grid gap-6 md:grid-cols-2">

                  {/* Based in */}
                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-white">
                      Where are you currently based? <span className="text-red-400">*</span>
                    </label>
                    <p className="text-xs text-slate-400">Helps frame the regulatory environment.</p>
                    <select
                      className={`${step2Attempted && step2Errors.basedIn ? inputError : inputNormal} bg-slate-800`}
                      value={form.basedIn}
                      onChange={(e) => setField("basedIn", e.target.value)}
                    >
                      {BASED_IN_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value} className="bg-slate-800 text-white">
                          {o.label}
                        </option>
                      ))}
                    </select>
                    {step2Attempted && step2Errors.basedIn && (
                      <FieldError message={step2Errors.basedIn} />
                    )}
                  </div>

                  {/* Time horizon */}
                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-white">
                      How long do you expect to remain in the region? <span className="text-red-400">*</span>
                    </label>
                    <p className="text-xs text-slate-400">Helps frame time horizons, not outcomes.</p>
                    <select
                      className={`${step2Attempted && step2Errors.timeHorizon ? inputError : inputNormal} bg-slate-800`}
                      value={form.timeHorizon}
                      onChange={(e) => setField("timeHorizon", e.target.value)}
                    >
                      {TIME_HORIZON_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value} className="bg-slate-800 text-white">
                          {o.label}
                        </option>
                      ))}
                    </select>
                    {step2Attempted && step2Errors.timeHorizon && (
                      <FieldError message={step2Errors.timeHorizon} />
                    )}
                  </div>

                  {/* Advice before */}
                  <div className="space-y-1 md:col-span-2">
                    <label className="text-sm font-semibold text-white">
                      Have you received financial advice before? <span className="text-red-400">*</span>
                    </label>
                    <select
                      className={`${step2Attempted && step2Errors.hadAdviceBefore ? inputError : inputNormal} bg-slate-800`}
                      value={form.hadAdviceBefore}
                      onChange={(e) => setField("hadAdviceBefore", e.target.value)}
                    >
                      {ADVICE_BEFORE_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value} className="bg-slate-800 text-white">
                          {o.label}
                        </option>
                      ))}
                    </select>
                    {step2Attempted && step2Errors.hadAdviceBefore && (
                      <FieldError message={step2Errors.hadAdviceBefore} />
                    )}
                  </div>
                </div>

                {/* Perspectives */}
                <div className="mt-6 space-y-1">
                  <div className="text-sm font-semibold text-white">
                    Which perspective would you want an advisor to consider? <span className="text-red-400">*</span>
                  </div>
                  <p className="text-xs text-slate-400">Select at least one — helps frame the decision context.</p>
                  <div className={`mt-2 grid gap-2 md:grid-cols-2 rounded-xl p-3 transition ${
                    step2Attempted && step2Errors.perspectives ? "border border-red-400/50 bg-red-500/5" : "border border-transparent"
                  }`}>
                    {PERSPECTIVE_CHECKBOXES.map((opt) => (
                      <label key={opt.value} className="flex items-start gap-2 text-sm text-slate-200 cursor-pointer hover:text-white transition">
                        <input
                          type="checkbox"
                          className="mt-1 rounded border-white/30 bg-white/5 text-emerald-500 focus:ring-emerald-400/50"
                          checked={form.perspectives.includes(opt.value)}
                          onChange={() => toggleArray("perspectives", opt.value)}
                        />
                        <span>{opt.label}</span>
                      </label>
                    ))}
                  </div>
                  {step2Attempted && step2Errors.perspectives && (
                    <FieldError message={step2Errors.perspectives} />
                  )}
                </div>
              </div>

              <div className="flex justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="rounded-full border border-white/30 px-4 py-2 text-xs font-medium text-slate-200 hover:bg-white/10 transition"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleStep2Continue}
                  className={`rounded-full px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] shadow-lg transition ${
                    step2Valid
                      ? "bg-white/95 text-slate-900 hover:bg-white hover:-translate-y-0.5"
                      : "bg-white/40 text-slate-600 cursor-not-allowed"
                  }`}
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* ── Step 3 ─────────────────────────────────────────────── */}
          {step === 3 && (
            <div className="space-y-6">
              <p className="max-w-3xl text-sm md:text-base text-slate-200">
                Describe your situation in your own words. The more context you provide, the more useful the advisor responses will be.
              </p>

              {/* Summary error banner */}
              {step3Attempted && !step3Valid && (
                <div className="rounded-xl border border-red-400/40 bg-red-500/15 px-4 py-3 text-sm text-red-200">
                  Please complete all fields with enough detail before continuing.
                </div>
              )}

              <div className="rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl p-6 md:p-8">
                <div className="space-y-6">

                  {/* Situation */}
                  <div className="space-y-1">
                    <div className="flex items-baseline justify-between">
                      <label className="text-sm font-semibold text-white">
                        Describe your situation in your own words. <span className="text-red-400">*</span>
                      </label>
                      <CharCount current={form.situation.trim().length} min={SITUATION_MIN} />
                    </div>
                    <p className="text-xs text-slate-400">
                      Include your background, what you currently have in place, and what's prompting you to seek advice now. Minimum {SITUATION_MIN} characters.
                    </p>
                    <textarea
                      className={step3Attempted && step3Errors.situation ? inputError : inputNormal}
                      rows={5}
                      value={form.situation}
                      onChange={(e) => setField("situation", e.target.value)}
                      placeholder="e.g. I'm a 38-year-old expat in Dubai with savings in cash and a couple of offshore policies from a previous advisor. I want a clearer long-term plan for retirement and school fees without locking everything away or paying hidden commissions..."
                    />
                    {step3Attempted && step3Errors.situation && (
                      <FieldError message={step3Errors.situation} />
                    )}
                  </div>

                  {/* Unclear */}
                  <div className="space-y-1">
                    <div className="flex items-baseline justify-between">
                      <label className="text-sm font-semibold text-white">
                        What feels unclear or unresolved right now? <span className="text-red-400">*</span>
                      </label>
                      <CharCount current={form.unclear.trim().length} min={UNCLEAR_MIN} />
                    </div>
                    <p className="text-xs text-slate-400">
                      What's the specific question or tension you're trying to resolve? Minimum {UNCLEAR_MIN} characters.
                    </p>
                    <textarea
                      className={step3Attempted && step3Errors.unclear ? inputError : inputNormal}
                      rows={4}
                      value={form.unclear}
                      onChange={(e) => setField("unclear", e.target.value)}
                      placeholder="e.g. I'm unsure whether to continue with existing policies or start fresh, and I don't know how to evaluate fee structures..."
                    />
                    {step3Attempted && step3Errors.unclear && (
                      <FieldError message={step3Errors.unclear} />
                    )}
                  </div>

                  {/* Looking for */}
                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-white">
                      Which best describes what you're looking for right now? <span className="text-red-400">*</span>
                    </label>
                    <select
                      className={`${step3Attempted && step3Errors.lookingFor ? inputError : inputNormal} bg-slate-800`}
                      value={form.lookingFor}
                      onChange={(e) => setField("lookingFor", e.target.value)}
                    >
                      {LOOKING_FOR_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value} className="bg-slate-800 text-white">
                          {o.label}
                        </option>
                      ))}
                    </select>
                    {step3Attempted && step3Errors.lookingFor && (
                      <FieldError message={step3Errors.lookingFor} />
                    )}
                  </div>

                  {/* Areas */}
                  <div className="space-y-1">
                    <div className="text-sm font-semibold text-white">
                      Which areas does your situation touch on? <span className="text-red-400">*</span>
                    </div>
                    <p className="text-xs text-slate-400">Select all that apply — at least one required.</p>
                    <div className={`mt-2 grid gap-2 md:grid-cols-2 rounded-xl p-3 transition ${
                      step3Attempted && step3Errors.areas ? "border border-red-400/50 bg-red-500/5" : "border border-transparent"
                    }`}>
                      {AREAS_CHECKBOXES.map((opt) => (
                        <label key={opt.value} className="flex items-start gap-2 text-sm text-slate-200 cursor-pointer hover:text-white transition">
                          <input
                            type="checkbox"
                            className="mt-1 rounded border-white/30 bg-white/5 text-emerald-500 focus:ring-emerald-400/50"
                            checked={form.areas.includes(opt.value)}
                            onChange={() => toggleArray("areas", opt.value)}
                          />
                          <span>{opt.label}</span>
                        </label>
                      ))}
                    </div>
                    {step3Attempted && step3Errors.areas && (
                      <FieldError message={step3Errors.areas} />
                    )}
                  </div>

                </div>
              </div>

              <div className="flex justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="rounded-full border border-white/30 px-4 py-2 text-xs font-medium text-slate-200 hover:bg-white/10 transition"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleStep3Continue}
                  className={`rounded-full px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] shadow-lg transition ${
                    step3Valid
                      ? "bg-white/95 text-slate-900 hover:bg-white hover:-translate-y-0.5"
                      : "bg-white/40 text-slate-600 cursor-not-allowed"
                  }`}
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* ── Step 4 ─────────────────────────────────────────────── */}
          {step === 4 && (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="max-w-3xl rounded-2xl border border-red-400/40 bg-red-500/20 p-4 text-sm text-red-100">
                  {error}
                </div>
              )}
              <p className="max-w-3xl text-sm md:text-base text-slate-200">
                Enter your email and password below. When you submit, a user account will be created automatically
                so you can view responses. If you already have an account, use the same credentials to log in.
              </p>

              <div className="max-w-3xl rounded-2xl border border-emerald-400/30 bg-emerald-500/20 backdrop-blur-sm p-4 text-sm">
                <div className="font-semibold text-emerald-200">Your case remains anonymous</div>
                <p className="mt-1 text-emerald-50/90">
                  Advisors only see your case details, not your identity. Your identity can only be revealed by you,
                  if and when you choose to connect with an advisor after reviewing their response.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl p-6 md:p-8">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="text-sm font-semibold text-white">Email & password</div>
                    <p className="text-xs text-slate-400">Used only to access your case and view responses.</p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-white">Email address</label>
                    <input
                      className={inputNormal}
                      type="email"
                      value={form.email}
                      onChange={(e) => setField("email", e.target.value)}
                      placeholder="you@email.com"
                      autoComplete="email"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-white">Set a password</label>
                    <p className="text-xs text-slate-400">For secure access to your case. (6+ characters)</p>
                    <input
                      className={inputNormal}
                      type="password"
                      value={form.password}
                      onChange={(e) => setField("password", e.target.value)}
                      placeholder="••••••••"
                      autoComplete="new-password"
                    />
                  </div>

                  <div className="space-y-3 pt-2 text-sm text-slate-200">
                    <label className="flex items-start gap-2 cursor-pointer hover:text-white transition">
                      <input
                        type="checkbox"
                        className="mt-1 rounded border-white/30 bg-white/5 text-emerald-500 focus:ring-emerald-400/50"
                        checked={form.consentNotAdvice}
                        onChange={(e) => setField("consentNotAdvice", e.target.checked)}
                      />
                      <span>
                        I understand that Advisens does not provide financial advice. Advisor responses are for
                        decision-preparation purposes only.
                      </span>
                    </label>

                    <label className="flex items-start gap-2 cursor-pointer hover:text-white transition">
                      <input
                        type="checkbox"
                        className="mt-1 rounded border-white/30 bg-white/5 text-emerald-500 focus:ring-emerald-400/50"
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
                  className="rounded-full border border-white/30 px-4 py-2 text-xs font-medium text-slate-200 hover:bg-white/10 transition"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={!canSubmit || loading}
                  className="rounded-full bg-white/95 px-7 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-slate-900 shadow-lg transition hover:bg-white hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
                >
                  {loading ? "Submitting..." : "Submit case"}
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
