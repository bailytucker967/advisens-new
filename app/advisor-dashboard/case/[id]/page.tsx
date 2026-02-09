"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { apiRequest, authAPI } from "@/lib/api-client";

const LABELS = {
  basedIn: { uae: "UAE", ksa: "Saudi Arabia", qatar: "Qatar", bahrain: "Bahrain", oman: "Oman", kuwait: "Kuwait", other: "Other / Outside GCC", prefer_not_to_say: "Prefer not to say" },
  timeHorizon: { under_12m: "Under 12 months", "1_3y": "1–3 years", "3_5y": "2–5 years", "5_plus": "5+ years", unsure: "Not sure yet", prefer_not_to_say: "Prefer not to say" },
  hadAdviceBefore: { yes_recent: "Yes (recently)", yes_past: "Yes (in the past)", no: "No", prefer_not_to_say: "Prefer not to say" },
  lookingFor: {
    compare_approaches: "Compare how different advisors would approach this",
    second_opinion: "Sense-checking advice I've already received",
    understand_fees: "Help understanding fees, conflicts, or incentives",
    structure_options: "Clarify possible structures or routes forward",
    define_priorities: "Help defining priorities and trade-offs",
    other: "Other",
  },
  perspectives: { cross_border: "Cross-border / expatriate considerations", long_vs_near: "Long-term planning vs near-term decisions", return_home: "A likely return to my home country", multi_jurisdiction: "Multiple jurisdictions involved" },
  areas: { investments_savings: "Investments / savings", pensions_planning: "Pensions / long-term planning", cross_border: "Cross-border considerations", protection: "Protection / insurance", fees_structures: "Fees / structures / wrappers" },
};

function label(map: Record<string, string>, val: string) {
  return (map as Record<string, string>)[val] || val?.replace(/_/g, " ") || val;
}

interface ResponseSections {
  approach?: string;
  clarifyBeforeAdvice?: string;
  howDecisionsMade?: string;
  feePhilosophy?: string;
  whoThisSuits?: string;
}

interface ResponseItem {
  _id: string;
  advisorId: string;
  advisorName?: string;
  advisorFirm?: string;
  response: string;
  responseSections?: ResponseSections;
  submittedAt: string;
  profileRevealed: boolean;
}

const RESPONSE_QUESTIONS = [
  { key: "approach" as const, label: "How I would approach this situation", placeholder: "Describe your overall approach, methodology, and how you would structure the engagement.", required: true },
  { key: "clarifyBeforeAdvice" as const, label: "What I would want to clarify before giving advice", placeholder: "Questions you would ask, information you would need, or assumptions you would want to validate." },
  { key: "howDecisionsMade" as const, label: "How decisions are typically made in cases like this", placeholder: "How you would typically work through decisions, trade-offs, or key milestones with a client." },
  { key: "feePhilosophy" as const, label: "Fee philosophy", placeholder: "How you charge, what your fee structure looks like, and how fees are typically structured for similar cases." },
  { key: "whoThisSuits" as const, label: "Who this approach tends to suit", placeholder: "Client profiles, situations, or preferences that typically align well with your approach." },
];

interface CaseData {
  _id: string;
  caseId: string;
  submittedAt: string;
  status: string;
  basedIn?: string;
  timeHorizon?: string;
  hadAdviceBefore?: string;
  perspectives?: string[];
  situation: string;
  unclear?: string;
  lookingFor?: string;
  areas?: string[];
  responses?: ResponseItem[];
  userEmail?: string;
  userRevealed?: boolean;
}

export default function AdvisorCasePage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const [caseData, setCaseData] = useState<CaseData | null>(null);
  const [advisor, setAdvisor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [responseSections, setResponseSections] = useState<ResponseSections>({
    approach: "",
    clarifyBeforeAdvice: "",
    howDecisionsMade: "",
    feePhilosophy: "",
    whoThisSuits: "",
  });
  const [guidelinesConfirmed, setGuidelinesConfirmed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [revealingUser, setRevealingUser] = useState(false);
  const [confirmRevealUser, setConfirmRevealUser] = useState(false);

  useEffect(() => {
    if (!id) return;
    let mounted = true;
    async function load() {
      try {
        const [caseRes, me] = await Promise.all([
          apiRequest<{ case: CaseData }>(`/api/cases/${id}`),
          authAPI.getCurrentUser() as Promise<{ advisor?: { id: string } }>,
        ]);
        if (mounted) {
          setCaseData(caseRes.case);
          setAdvisor(me.advisor);
        }
      } catch (e) {
        if (mounted) router.push("/advisor-dashboard");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, [id, router]);

  const myResponse = caseData?.responses?.find((r) => r.advisorId === advisor?.id);
  const alreadyResponded = !!myResponse;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const approach = (responseSections.approach || "").trim();
    if (!approach || !guidelinesConfirmed) {
      setError("At minimum, complete 'How I would approach this situation' and confirm the guidelines.");
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      await apiRequest(`/api/cases/${id}/response`, {
        method: "POST",
        body: JSON.stringify({
          responseSections: {
            approach: approach,
            clarifyBeforeAdvice: (responseSections.clarifyBeforeAdvice || "").trim() || undefined,
            howDecisionsMade: (responseSections.howDecisionsMade || "").trim() || undefined,
            feePhilosophy: (responseSections.feePhilosophy || "").trim() || undefined,
            whoThisSuits: (responseSections.whoThisSuits || "").trim() || undefined,
          },
        }),
      });
      const res = await apiRequest<{ case: CaseData }>(`/api/cases/${id}`);
      setCaseData(res.case);
      setResponseSections({
        approach: "",
        clarifyBeforeAdvice: "",
        howDecisionsMade: "",
        feePhilosophy: "",
        whoThisSuits: "",
      });
      setGuidelinesConfirmed(false);
    } catch (err: any) {
      setError(err.message || "Failed to submit response.");
    } finally {
      setSubmitting(false);
    }
  };

  const setSection = (key: keyof ResponseSections, value: string) => {
    setResponseSections((prev) => ({ ...prev, [key]: value }));
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  const handleRevealUser = async () => {
    if (!confirmRevealUser) {
      setConfirmRevealUser(true);
      return;
    }
    setRevealingUser(true);
    try {
      const res = await apiRequest<{ user: { email: string } }>(`/api/cases/${id}/reveal-user`, {
        method: "POST",
      });
      if (res.user && caseData) {
        setCaseData({ ...caseData, userEmail: res.user.email, userRevealed: true });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setRevealingUser(false);
      setConfirmRevealUser(false);
    }
  };

  if (loading || !caseData) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col text-slate-50">
      <div className="fixed inset-0 -z-30 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/web%20background.jpeg')" }} />
      <div className="fixed inset-0 -z-20 bg-gradient-to-b from-black/40 via-black/30 to-black/20" />

      <main className="relative z-10 flex-1 px-4 pb-16 pt-8 md:px-8">
        <div className="mx-auto max-w-4xl">
          <Link href="/advisor-dashboard" className="inline-flex items-center gap-2 text-sm text-slate-300 hover:text-white mb-6">
            ← Back to case list
          </Link>

          <div className="rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl p-6 md:p-8">
            <div className="flex flex-wrap items-center gap-3 mb-6">
              {caseData.areas?.length ? (
                <span className="px-3 py-1 text-xs font-medium rounded-full border border-white/20 bg-white/10 text-slate-200">
                  {label(LABELS.areas, caseData.areas[0])}
                </span>
              ) : null}
              <h1 className="text-2xl font-semibold text-white">{caseData.caseId}</h1>
              <span className="text-sm text-slate-400">Submitted {formatDate(caseData.submittedAt)}</span>
              <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                caseData.status === "profile_revealed" ? "border border-amber-400/50 bg-amber-500/20 text-amber-200" : "border border-white/20 bg-white/10 text-slate-200"
              }`}>
                {caseData.status === "profile_revealed" ? "Profile revealed" : alreadyResponded ? "Response submitted" : "Pending"}
              </span>
            </div>

            {/* Profile revealed notice */}
            {myResponse?.profileRevealed && (
              <div className="mb-6 p-4 rounded-xl border border-amber-400/30 bg-amber-500/10">
                <h3 className="text-sm font-semibold text-amber-200 mb-2">What this means</h3>
                <ul className="text-sm text-slate-200 space-y-1">
                  <li>— Profile has been revealed</li>
                  <li>— User has access to contact details</li>
                  <li>— No action required unless contacted by the user</li>
                </ul>
              </div>
            )}

            {/* User info (initially hidden) */}
            <section className="mb-8 p-4 rounded-xl border border-white/10 bg-white/5">
              <h3 className="text-base font-semibold text-white mb-2">Case submitter</h3>
              {caseData.userRevealed && caseData.userEmail ? (
                <div>
                  <p className="text-sm text-slate-200">
                    <span className="font-medium">Contact: </span>
                    <a href={`mailto:${caseData.userEmail}`} className="text-emerald-400 hover:underline">{caseData.userEmail}</a>
                  </p>
                  <p className="text-xs text-slate-400 mt-1">The user will be notified that you have revealed their profile.</p>
                </div>
              ) : (
                <div>
                  <p className="text-sm text-slate-300 mb-2">Anonymous User</p>
                  {!confirmRevealUser ? (
                    <button
                      onClick={handleRevealUser}
                      disabled={revealingUser}
                      className="rounded-full border border-white/30 bg-white/10 px-4 py-2 text-xs font-medium text-white hover:bg-white/20 disabled:opacity-50"
                    >
                      {revealingUser ? "Revealing..." : "Reveal user profile & contact"}
                    </button>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-sm text-slate-300">
                        Would you like to reveal this user&apos;s profile? The user will be notified and you will see their contact details.
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={handleRevealUser}
                          disabled={revealingUser}
                          className="rounded-full border border-emerald-400/50 bg-emerald-500/20 px-4 py-2 text-xs font-medium text-emerald-200 hover:bg-emerald-500/30 disabled:opacity-50"
                        >
                          {revealingUser ? "Revealing..." : "Yes, reveal profile"}
                        </button>
                        <button
                          onClick={() => setConfirmRevealUser(false)}
                          disabled={revealingUser}
                          className="rounded-full border border-white/30 bg-white/10 px-4 py-2 text-xs font-medium text-slate-200 hover:bg-white/20 disabled:opacity-50"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </section>

            {/* Context */}
            <section className="mb-8">
              <h2 className="text-base font-semibold text-white mb-4">Context</h2>
              <dl className="grid gap-3 sm:grid-cols-2">
                {caseData.basedIn && caseData.basedIn !== "prefer_not_to_say" && (
                  <div>
                    <dt className="text-xs font-medium text-slate-400 uppercase tracking-wider">Location</dt>
                    <dd className="text-sm font-medium text-slate-200">{label(LABELS.basedIn, caseData.basedIn)}</dd>
                  </div>
                )}
                {caseData.timeHorizon && caseData.timeHorizon !== "prefer_not_to_say" && (
                  <div>
                    <dt className="text-xs font-medium text-slate-400 uppercase tracking-wider">Time horizon</dt>
                    <dd className="text-sm font-medium text-slate-200">{label(LABELS.timeHorizon, caseData.timeHorizon)}</dd>
                  </div>
                )}
                {caseData.hadAdviceBefore && caseData.hadAdviceBefore !== "prefer_not_to_say" && (
                  <div>
                    <dt className="text-xs font-medium text-slate-400 uppercase tracking-wider">Previous advice</dt>
                    <dd className="text-sm font-medium text-slate-200">{label(LABELS.hadAdviceBefore, caseData.hadAdviceBefore)}</dd>
                  </div>
                )}
                {caseData.perspectives?.length ? (
                  <div className="sm:col-span-2">
                    <dt className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Decision context</dt>
                    <dd className="text-sm text-slate-300">
                      {caseData.perspectives.map((p) => label(LABELS.perspectives, p)).join(", ")}
                    </dd>
                  </div>
                ) : null}
              </dl>
            </section>

            {/* Situation */}
            <section className="mb-8">
              <h2 className="text-base font-semibold text-white mb-2">Situation</h2>
              <p className="text-sm text-slate-300 whitespace-pre-wrap">{caseData.situation}</p>
              {caseData.unclear && (
                <>
                  <h3 className="text-sm font-medium text-slate-200 mt-4 mb-2">What feels unclear or unresolved</h3>
                  <p className="text-sm text-slate-300 whitespace-pre-wrap">{caseData.unclear}</p>
                </>
              )}
            </section>

            {caseData.lookingFor && (
              <section className="mb-8">
                <h2 className="text-sm font-semibold text-white mb-2">Looking for</h2>
                <p className="text-sm text-slate-300">{label(LABELS.lookingFor, caseData.lookingFor)}</p>
              </section>
            )}

            {caseData.areas?.length ? (
              <section className="mb-8">
                <h2 className="text-sm font-semibold text-white mb-2">Areas involved</h2>
                <div className="flex flex-wrap gap-2">
                  {caseData.areas.map((a) => (
                    <span key={a} className="px-3 py-1 text-xs font-medium rounded-full border border-white/20 bg-white/10 text-slate-200">
                      {label(LABELS.areas, a)}
                    </span>
                  ))}
                </div>
              </section>
            ) : null}

            {/* Response guidelines */}
            <section className="mb-8 p-4 rounded-xl border border-white/10 bg-white/5">
              <h2 className="text-base font-semibold text-white mb-3">Respond to the question presented. Do not introduce products, platforms, or calls to action.</h2>
              <h3 className="text-sm font-medium text-slate-200 mb-2">Before you respond</h3>
              <p className="text-sm text-slate-300 mb-2">Your response must follow these guidelines:</p>
              <ul className="text-sm text-slate-300 space-y-1 list-disc list-inside">
                <li>Responses are informational and educational, not financial advice</li>
                <li>No product recommendations or performance claims</li>
                <li>No solicitation or urgency language</li>
                <li>Use a neutral, explanatory tone focused on methodology</li>
              </ul>
            </section>

            {/* Response form or existing response */}
            {alreadyResponded ? (
              <section>
                <h2 className="text-base font-semibold text-white mb-3">Your response</h2>
                {myResponse.responseSections ? (
                  <div className="space-y-6">
                    {RESPONSE_QUESTIONS.map(({ key, label }) => {
                      const value = myResponse.responseSections![key];
                      if (!value) return null;
                      return (
                        <div key={key} className="p-4 rounded-xl border border-white/10 bg-white/5">
                          <h3 className="text-sm font-semibold text-slate-200 mb-2">{label}</h3>
                          <p className="text-sm text-slate-300 whitespace-pre-wrap">{value}</p>
                        </div>
                      );
                    })}
                    <p className="text-xs text-slate-400">Submitted {formatDate(myResponse.submittedAt)}</p>
                  </div>
                ) : (
                  <div className="p-4 rounded-xl border border-white/10 bg-white/5">
                    <p className="text-sm text-slate-300 whitespace-pre-wrap">{myResponse.response}</p>
                    <p className="text-xs text-slate-400 mt-3">Submitted {formatDate(myResponse.submittedAt)}</p>
                  </div>
                )}
              </section>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="p-4 rounded-xl border border-red-400/40 bg-red-500/20 text-sm text-red-100">{error}</div>
                )}
                <div className="space-y-6">
                  {RESPONSE_QUESTIONS.map(({ key, label, placeholder, required }) => (
                    <div key={key} className="space-y-2">
                      <label htmlFor={key} className="block text-sm font-semibold text-white">
                        {label}
                        {required && <span className="text-red-400 ml-0.5">*</span>}
                      </label>
                      <textarea
                        id={key}
                        rows={4}
                        value={responseSections[key] || ""}
                        onChange={(e) => setSection(key, e.target.value)}
                        placeholder={placeholder}
                        className="w-full rounded-lg border border-white/20 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-slate-400 focus:border-emerald-400/50 focus:outline-none focus:ring-1 focus:ring-emerald-400/30"
                      />
                    </div>
                  ))}
                </div>
                <label className="flex items-start gap-2 text-sm text-slate-300 cursor-pointer hover:text-white transition">
                  <input
                    type="checkbox"
                    checked={guidelinesConfirmed}
                    onChange={(e) => setGuidelinesConfirmed(e.target.checked)}
                    className="mt-1 rounded border-white/30 bg-white/5 text-emerald-500 focus:ring-emerald-400/50"
                  />
                  <span>I confirm that my response will follow these guidelines.</span>
                </label>
                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={!responseSections.approach?.trim() || !guidelinesConfirmed || submitting}
                    className="rounded-full bg-white/95 px-6 py-2.5 text-xs font-semibold text-slate-900 shadow-lg transition hover:bg-white hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                  >
                    {submitting ? "Submitting..." : "Submit response"}
                  </button>
                  <Link
                    href="/advisor-dashboard"
                    className="rounded-full border border-white/30 px-4 py-2 text-xs font-medium text-slate-200 hover:bg-white/10 transition"
                  >
                    Back to case list
                  </Link>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
