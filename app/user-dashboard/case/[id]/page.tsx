"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { apiRequest } from "@/lib/api-client";

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

interface ResponseItem {
  _id: string;
  advisorId: string;
  advisorName?: string;
  advisorFirm?: string;
  advisorEmail?: string;
  response: string;
  submittedAt: string;
  profileRevealed: boolean;
}

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
  userRevealedTo?: Array<{ advisorId: string; revealedAt: string }>;
}

export default function UserCasePage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const [caseData, setCaseData] = useState<CaseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [revealing, setRevealing] = useState<string | null>(null);
  const [confirmReveal, setConfirmReveal] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let mounted = true;
    async function load() {
      try {
        const res = await apiRequest<{ case: CaseData }>(`/api/cases/${id}`);
        if (mounted) setCaseData(res.case);
      } catch (e) {
        if (mounted) router.push("/user-dashboard");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, [id, router]);

  const handleRevealProfile = async (advisorId: string) => {
    if (!confirmReveal || confirmReveal !== advisorId) {
      setConfirmReveal(advisorId);
      return;
    }
    setRevealing(advisorId);
    setConfirmReveal(null);
    try {
      const res = await apiRequest<{ advisor: { email: string; name?: string; firm?: string } }>(`/api/cases/${id}/reveal`, {
        method: "POST",
        body: JSON.stringify({ advisorId }),
      });
      if (res.advisor && caseData?.responses) {
        const updated = caseData.responses.map((r) =>
          r.advisorId === advisorId
            ? { ...r, profileRevealed: true, advisorEmail: res.advisor.email }
            : r
        );
        setCaseData({ ...caseData, responses: updated });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setRevealing(null);
    }
  };

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
          <Link href="/user-dashboard" className="inline-flex items-center gap-2 text-sm text-slate-300 hover:text-white mb-6">
            ← Back to case list
          </Link>

          <div className="rounded-3xl border border-white/10 bg-white/90 p-6 text-slate-900 shadow-xl backdrop-blur-xl md:p-8">
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <h1 className="text-2xl font-semibold text-slate-900">{caseData.caseId}</h1>
              <span className="text-sm text-slate-500">Submitted {formatDate(caseData.submittedAt)}</span>
              <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                caseData.status === "profile_revealed"
                  ? "border border-amber-300 bg-amber-100 text-amber-800"
                  : caseData.responses?.length
                    ? "border border-emerald-300 bg-emerald-100 text-emerald-800"
                    : "border border-slate-300 bg-slate-100 text-slate-700"
              }`}>
                {caseData.status === "profile_revealed" ? "Profile revealed" : caseData.responses?.length ? "Response received" : "Pending"}
              </span>
            </div>

            {/* User profile revealed to advisor notice */}
            {caseData.userRevealedTo && caseData.userRevealedTo.length > 0 && (
              <div className="mb-6 p-4 rounded-xl bg-slate-100 border border-slate-200">
                <h3 className="text-sm font-semibold text-slate-900 mb-2">Your profile was revealed</h3>
                <p className="text-sm text-slate-700">
                  An advisor has revealed your profile and can see your contact details.
                </p>
              </div>
            )}

            {/* What this means - for profile revealed */}
            {caseData.status === "profile_revealed" && (
              <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200">
                <h3 className="text-sm font-semibold text-amber-900 mb-2">What this means</h3>
                <ul className="text-sm text-amber-800 space-y-1">
                  <li>— Profile has been revealed</li>
                  <li>— User has access to contact details</li>
                  <li>— No action required unless contacted by the user</li>
                </ul>
              </div>
            )}

            {/* Context */}
            <section className="mb-8">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Context</h2>
              <dl className="grid gap-3 sm:grid-cols-2">
                {caseData.basedIn && caseData.basedIn !== "prefer_not_to_say" && (
                  <div>
                    <dt className="text-xs font-medium text-slate-500 uppercase tracking-wider">Location</dt>
                    <dd className="text-sm font-medium text-slate-800">{label(LABELS.basedIn, caseData.basedIn)}</dd>
                  </div>
                )}
                {caseData.timeHorizon && caseData.timeHorizon !== "prefer_not_to_say" && (
                  <div>
                    <dt className="text-xs font-medium text-slate-500 uppercase tracking-wider">Time horizon</dt>
                    <dd className="text-sm font-medium text-slate-800">{label(LABELS.timeHorizon, caseData.timeHorizon)}</dd>
                  </div>
                )}
                {caseData.hadAdviceBefore && caseData.hadAdviceBefore !== "prefer_not_to_say" && (
                  <div>
                    <dt className="text-xs font-medium text-slate-500 uppercase tracking-wider">Previous advice</dt>
                    <dd className="text-sm font-medium text-slate-800">{label(LABELS.hadAdviceBefore, caseData.hadAdviceBefore)}</dd>
                  </div>
                )}
                {caseData.perspectives?.length ? (
                  <div className="sm:col-span-2">
                    <dt className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Decision context</dt>
                    <dd className="text-sm text-slate-700">
                      {caseData.perspectives.map((p) => label(LABELS.perspectives, p)).join("\n")}
                    </dd>
                  </div>
                ) : null}
              </dl>
            </section>

            {/* Situation */}
            <section className="mb-8">
              <h2 className="text-lg font-semibold text-slate-900 mb-2">Situation</h2>
              <p className="text-sm text-slate-700 whitespace-pre-wrap">{caseData.situation}</p>
              {caseData.unclear && (
                <>
                  <h3 className="text-base font-medium text-slate-800 mt-4 mb-2">What feels unclear or unresolved</h3>
                  <p className="text-sm text-slate-700 whitespace-pre-wrap">{caseData.unclear}</p>
                </>
              )}
            </section>

            {caseData.lookingFor && (
              <section className="mb-8">
                <h2 className="text-base font-semibold text-slate-900 mb-2">Looking for</h2>
                <p className="text-sm text-slate-700">{label(LABELS.lookingFor, caseData.lookingFor)}</p>
              </section>
            )}

            {caseData.areas?.length ? (
              <section className="mb-8">
                <h2 className="text-base font-semibold text-slate-900 mb-2">Areas involved</h2>
                <div className="flex flex-wrap gap-2">
                  {caseData.areas.map((a) => (
                    <span key={a} className="px-3 py-1 text-xs font-medium rounded-full border border-slate-300 bg-slate-100 text-slate-700">
                      {label(LABELS.areas, a)}
                    </span>
                  ))}
                </div>
              </section>
            ) : null}

            {/* Responses */}
            <section>
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Advisor responses</h2>
              {!caseData.responses?.length ? (
                <p className="text-sm text-slate-600">No responses yet. Advisors will respond to your case.</p>
              ) : (
                <div className="space-y-6">
                  {caseData.responses.map((r) => (
                    <div key={r._id} className="p-5 rounded-xl border border-slate-200 bg-slate-50">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="font-medium text-slate-800">
                            {r.profileRevealed
                              ? `${r.advisorName || "Advisor"}${r.advisorFirm ? " · " + r.advisorFirm : ""}`
                              : "Anonymous Advisor"}
                          </p>
                          <p className="text-xs text-slate-500">Responded {formatDate(r.submittedAt)}</p>
                        </div>
                        {r.profileRevealed && r.advisorEmail && (
                          <div className="text-sm text-slate-700">
                            <span className="font-medium">Contact: </span>
                            <a href={`mailto:${r.advisorEmail}`} className="text-emerald-600 hover:underline">{r.advisorEmail}</a>
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-slate-700 whitespace-pre-wrap mb-4">{r.response}</p>
                      {!r.profileRevealed && (
                        <div className="space-y-2">
                          {confirmReveal === r.advisorId ? (
                            <>
                              <p className="text-sm text-slate-700">
                                Would you like to reveal this advisor&apos;s profile? The advisor will be notified and you will see their contact details.
                              </p>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleRevealProfile(r.advisorId)}
                                  disabled={!!revealing}
                                  className="rounded-full border border-slate-300 bg-emerald-100 px-4 py-2 text-xs font-medium text-emerald-800 hover:bg-emerald-200 disabled:opacity-50"
                                >
                                  {revealing === r.advisorId ? "Revealing..." : "Yes, reveal profile"}
                                </button>
                                <button
                                  onClick={() => setConfirmReveal(null)}
                                  disabled={!!revealing}
                                  className="rounded-full border border-slate-300 bg-slate-100 px-4 py-2 text-xs font-medium text-slate-900 hover:bg-slate-200 disabled:opacity-50"
                                >
                                  Cancel
                                </button>
                              </div>
                            </>
                          ) : (
                            <button
                              onClick={() => handleRevealProfile(r.advisorId)}
                              disabled={!!revealing}
                              className="rounded-full border border-slate-300 bg-slate-100 px-4 py-2 text-xs font-medium text-slate-900 hover:bg-slate-200 disabled:opacity-50"
                            >
                              {revealing === r.advisorId ? "Revealing..." : "Reveal advisor profile & contact"}
                            </button>
                          )}
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
