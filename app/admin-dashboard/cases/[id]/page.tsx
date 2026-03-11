"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { authAPI, apiRequest } from "@/lib/api-client";

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

interface AdvisorProfile {
  email?: string;
  name?: string;
  firm?: string;
  bio?: string;
  mobile?: string;
  linkedInUrl?: string;
  location?: { country?: string; city?: string };
  firmWebsite?: string;
  firmOverview?: string;
  roleTitle?: string;
  primaryClientBase?: string;
  yearsOfExperience?: string;
  areasOfAdvice?: string[];
  typicalClientProfile?: string;
  qualifications?: string;
  jurisdictions?: string[];
  regulatorName?: string;
  licenseNumber?: string;
}

interface ResponseItem {
  _id: string;
  advisorId: string;
  advisorName?: string;
  advisorFirm?: string;
  advisorEmail?: string;
  advisorProfile?: AdvisorProfile;
  response: string;
  responseSections?: ResponseSections;
  submittedAt: string;
  profileRevealed: boolean;
}

const RESPONSE_QUESTION_LABELS: Record<keyof ResponseSections, string> = {
  approach: "How I would approach this situation",
  clarifyBeforeAdvice: "What I would want to clarify before giving advice",
  howDecisionsMade: "How decisions are typically made in cases like this",
  feePhilosophy: "Fee philosophy",
  whoThisSuits: "Who this approach tends to suit",
};

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
}

export default function AdminCasePage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const [caseData, setCaseData] = useState<CaseData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    let mounted = true;
    async function load() {
      try {
        const me = await authAPI.getCurrentUser() as { admin?: any };
        if (!me.admin) {
          if (mounted) router.push("/admin-login");
          return;
        }
        const res = await apiRequest<{ case: CaseData }>(`/api/cases/${id}`);
        if (mounted) setCaseData(res.case);
      } catch (e) {
        if (mounted) router.push("/admin-dashboard");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, [id, router]);

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

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
          <Link href="/admin-dashboard" className="inline-flex items-center gap-2 text-sm text-slate-300 hover:text-white mb-6">
            ← Back to dashboard
          </Link>

          <div className="rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl p-6 md:p-8">
            {caseData.userEmail && (
              <div className="mb-6 p-4 rounded-xl border border-white/10 bg-white/5">
                <h3 className="text-sm font-semibold text-white mb-1">User</h3>
                <a href={`mailto:${caseData.userEmail}`} className="text-emerald-400 hover:underline">{caseData.userEmail}</a>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-3 mb-6">
              {caseData.areas?.length ? (
                <span className="px-3 py-1 text-xs font-medium rounded-full border border-white/20 bg-white/10 text-slate-200">
                  {label(LABELS.areas, caseData.areas[0])}
                </span>
              ) : null}
              <h1 className="text-2xl font-semibold text-white">{caseData.caseId}</h1>
              <span className="text-sm text-slate-400">Submitted {formatDate(caseData.submittedAt)}</span>
              <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                caseData.status === "profile_revealed"
                  ? "border border-amber-400/50 bg-amber-500/20 text-amber-200"
                  : caseData.responses?.length
                    ? "border border-emerald-400/50 bg-emerald-500/20 text-emerald-200"
                    : "border border-white/20 bg-white/10 text-slate-200"
              }`}>
                {caseData.status === "profile_revealed" ? "Profile revealed" : caseData.responses?.length ? "Response received" : "Pending"}
              </span>
            </div>

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

            <section>
              <h2 className="text-base font-semibold text-white mb-4">Advisor responses</h2>
              {!caseData.responses?.length ? (
                <p className="text-sm text-slate-300">No responses yet.</p>
              ) : (
                <div className="space-y-6">
                  {caseData.responses.map((r) => (
                    <div key={r._id} className="p-5 rounded-xl border border-white/10 bg-white/5">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
                        <div className="min-w-0">
                          <p className="font-medium text-white">
                            {r.advisorName || "Advisor"}{r.advisorFirm ? " · " + r.advisorFirm : ""}
                          </p>
                          <p className="text-xs text-slate-400">Responded {formatDate(r.submittedAt)}</p>
                        </div>
                        {r.advisorEmail && (
                          <div className="text-sm text-slate-200 shrink-0">
                            <span className="font-medium">Contact: </span>
                            <a href={`mailto:${r.advisorEmail}`} className="text-emerald-400 hover:underline break-all">{r.advisorEmail}</a>
                          </div>
                        )}
                      </div>
                      {r.responseSections ? (
                        <div className="space-y-4">
                          {(Object.keys(RESPONSE_QUESTION_LABELS) as Array<keyof ResponseSections>).map((key) => {
                            const value = r.responseSections![key];
                            if (!value) return null;
                            return (
                              <div key={key}>
                                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">{RESPONSE_QUESTION_LABELS[key]}</h3>
                                <p className="text-sm text-slate-300 whitespace-pre-wrap">{value}</p>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="text-sm text-slate-300 whitespace-pre-wrap">{r.response}</p>
                      )}
                      {r.advisorProfile && (
                        <div className="mt-6 p-5 rounded-xl border border-emerald-400/30 bg-emerald-500/10">
                          <h3 className="text-base font-semibold text-white mb-4">Advisor profile</h3>
                          <div className="grid gap-4 sm:grid-cols-2">
                            {r.advisorProfile.email && (
                              <div>
                                <dt className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Email</dt>
                                <dd><a href={`mailto:${r.advisorProfile.email}`} className="text-emerald-400 font-medium hover:underline">{r.advisorProfile.email}</a></dd>
                              </div>
                            )}
                            {r.advisorProfile.mobile && (
                              <div>
                                <dt className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Mobile</dt>
                                <dd><a href={`tel:${r.advisorProfile.mobile}`} className="text-slate-200">{r.advisorProfile.mobile}</a></dd>
                              </div>
                            )}
                            {r.advisorProfile.firm && (
                              <div>
                                <dt className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Firm</dt>
                                <dd className="text-slate-200">{r.advisorProfile.firm}</dd>
                              </div>
                            )}
                            {r.advisorProfile.qualifications && (
                              <div className="sm:col-span-2">
                                <dt className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Qualifications</dt>
                                <dd className="text-slate-300 whitespace-pre-wrap text-sm">{r.advisorProfile.qualifications}</dd>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
