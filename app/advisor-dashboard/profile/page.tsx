"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiRequest } from "@/lib/api-client";

interface AdvisorProfileData {
  id: string;
  email: string;
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
  hasDisciplinaryActions?: boolean;
  disciplinaryDetails?: string;
  advisoryApproach?: string;
  feePhilosophy?: string;
  tendsToSuit?: string[];
  mayNotSuit?: string[];
  professionalBackground?: string;
  planningFocusAreas?: string[];
}

function arrFromText(s: string): string[] {
  return s
    .split("\n")
    .map((x) => x.trim())
    .filter(Boolean);
}

function textFromArr(a?: string[]): string {
  return (a || []).join("\n");
}

export default function AdvisorProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<AdvisorProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [advisoryApproach, setAdvisoryApproach] = useState("");
  const [feePhilosophy, setFeePhilosophy] = useState("");
  const [tendsToSuit, setTendsToSuit] = useState("");
  const [mayNotSuit, setMayNotSuit] = useState("");
  const [professionalBackground, setProfessionalBackground] = useState("");
  const [jurisdictions, setJurisdictions] = useState("");
  const [planningFocusAreas, setPlanningFocusAreas] = useState("");

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const res = await apiRequest<{ advisor: AdvisorProfileData }>("/api/advisor/profile");
        if (mounted) {
          setProfile(res.advisor);
          setAdvisoryApproach(res.advisor.advisoryApproach || "");
          setFeePhilosophy(res.advisor.feePhilosophy || "");
          setTendsToSuit(textFromArr(res.advisor.tendsToSuit));
          setMayNotSuit(textFromArr(res.advisor.mayNotSuit));
          setProfessionalBackground(res.advisor.professionalBackground || "");
          setJurisdictions(textFromArr(res.advisor.jurisdictions));
          setPlanningFocusAreas(textFromArr(res.advisor.planningFocusAreas));
        }
      } catch {
        if (mounted) router.push("/advisor-login");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, [router]);

  const handleSave = async () => {
    if (!profile) return;
    setSaving(true);
    setSaved(false);
    try {
      const res = await apiRequest<{ advisor: AdvisorProfileData }>("/api/advisor/profile", {
        method: "PATCH",
        body: JSON.stringify({
          advisoryApproach: advisoryApproach || undefined,
          feePhilosophy: feePhilosophy || undefined,
          tendsToSuit: arrFromText(tendsToSuit),
          mayNotSuit: arrFromText(mayNotSuit),
          professionalBackground: professionalBackground || undefined,
          jurisdictions: arrFromText(jurisdictions),
          planningFocusAreas: arrFromText(planningFocusAreas),
        }),
      });
      setProfile(res.advisor);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  if (loading || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <div>Loading...</div>
      </div>
    );
  }

  const inputClass =
    "w-full rounded-lg border border-white/20 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-slate-400 focus:border-emerald-400/50 focus:outline-none focus:ring-1 focus:ring-emerald-400/30";
  const textareaClass = inputClass + " min-h-[120px] resize-y";

  return (
    <div className="min-h-screen flex flex-col text-slate-50">
      <div className="fixed inset-0 -z-30 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/web%20background.jpeg')" }} />
      <div className="fixed inset-0 -z-20 bg-gradient-to-b from-black/40 via-black/30 to-black/20" />

      <main className="relative z-10 flex-1 px-4 pb-16 pt-4 md:px-8">
        <div className="mx-auto max-w-5xl">
          <Link href="/advisor-dashboard" className="inline-flex items-center gap-2 text-sm text-slate-300 hover:text-white mb-6">
            ← Back to dashboard
          </Link>

          <div className="mb-6 md:mb-8">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">Advisor profile</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white md:text-4xl">Your profile</h1>
            <p className="mt-2 max-w-3xl text-sm text-slate-200">
              This profile is revealed to users when they choose to reveal your identity after reviewing your response. Keep it up to date for trust and due diligence.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl p-6 md:p-8">
            <div className="space-y-8">
              {/* Contact - read-only display */}
              <section>
                <h2 className="text-base font-semibold text-white mb-3">Contact</h2>
                <dl className="grid gap-4 sm:grid-cols-2">
                  <div className="flex flex-col text-left">
                    <dt className="text-xs text-slate-400 mb-1">Email</dt>
                    <dd className="text-sm text-slate-200">{profile.email}</dd>
                  </div>
                  {profile.name && (
                    <div className="flex flex-col text-left">
                      <dt className="text-xs text-slate-400 mb-1">Name</dt>
                      <dd className="text-sm text-slate-200">{profile.name}</dd>
                    </div>
                  )}
                  {profile.mobile && (
                    <div className="flex flex-col text-left">
                      <dt className="text-xs text-slate-400 mb-1">Mobile</dt>
                      <dd className="text-sm text-slate-200">{profile.mobile}</dd>
                    </div>
                  )}
                  {profile.linkedInUrl && (
                    <div className="flex flex-col text-left sm:col-span-2">
                      <dt className="text-xs text-slate-400 mb-1">LinkedIn</dt>
                      <dd>
                        <a href={profile.linkedInUrl} target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:text-emerald-300 hover:underline">
                          {profile.linkedInUrl}
                        </a>
                      </dd>
                    </div>
                  )}
                  {profile.location?.country && (
                    <div className="flex flex-col text-left">
                      <dt className="text-xs text-slate-400 mb-1">Location</dt>
                      <dd className="text-sm text-slate-200">{[profile.location.city, profile.location.country].filter(Boolean).join(", ")}</dd>
                    </div>
                  )}
                </dl>
              </section>

              {/* Firm - read-only display */}
              <section>
                <h2 className="text-base font-semibold text-white mb-3">Firm</h2>
                <dl className="grid gap-4 sm:grid-cols-2">
                  {profile.firm && (
                    <div className="flex flex-col text-left">
                      <dt className="text-xs text-slate-400 mb-1">Firm name</dt>
                      <dd className="text-sm text-slate-200">{profile.firm}</dd>
                    </div>
                  )}
                  {profile.roleTitle && (
                    <div className="flex flex-col text-left">
                      <dt className="text-xs text-slate-400 mb-1">Role</dt>
                      <dd className="text-sm text-slate-200">{profile.roleTitle}</dd>
                    </div>
                  )}
                  {profile.firmWebsite && (
                    <div className="flex flex-col text-left sm:col-span-2">
                      <dt className="text-xs text-slate-400 mb-1">Website</dt>
                      <dd>
                        <a href={profile.firmWebsite} target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:text-emerald-300 hover:underline">
                          {profile.firmWebsite}
                        </a>
                      </dd>
                    </div>
                  )}
                  {profile.firmOverview && (
                    <div className="flex flex-col text-left sm:col-span-2">
                      <dt className="text-xs text-slate-400 mb-1">Overview</dt>
                      <dd className="text-sm whitespace-pre-wrap text-slate-200">{profile.firmOverview}</dd>
                    </div>
                  )}
                </dl>
              </section>

              {/* Advisory approach - editable */}
              <section>
                <h2 className="text-base font-semibold text-white mb-2">Advisory approach</h2>
                <p className="text-xs text-slate-400 mb-2">
                  Describe your approach to working with clients and how you help them understand decision frameworks.
                </p>
                <textarea
                  className={textareaClass}
                  value={advisoryApproach}
                  onChange={(e) => setAdvisoryApproach(e.target.value)}
                  placeholder="I work with individuals navigating cross-border financial decisions..."
                  rows={5}
                />
              </section>

              {/* Fee philosophy - editable */}
              <section>
                <h2 className="text-base font-semibold text-white mb-2">Fee philosophy</h2>
                <p className="text-xs text-slate-400 mb-2">Explain how you charge and how fees are structured.</p>
                <textarea
                  className={textareaClass}
                  value={feePhilosophy}
                  onChange={(e) => setFeePhilosophy(e.target.value)}
                  placeholder="Fees are charged on a transparent fixed-fee basis..."
                  rows={5}
                />
              </section>

              {/* Who this approach tends to suit - editable */}
              <section>
                <h2 className="text-base font-semibold text-white mb-2">Who this approach tends to suit</h2>
                <p className="text-xs text-slate-400 mb-2">One item per line. Leave blank for items that don&apos;t apply.</p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-white">Tends to suit</label>
                    <textarea
                      className={textareaClass}
                      value={tendsToSuit}
                      onChange={(e) => setTendsToSuit(e.target.value)}
                      placeholder={'Individuals who value understanding the reasoning behind financial decisions\nThose comfortable with a methodical, evidence-based process...'}
                      rows={4}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-white">May not suit</label>
                    <textarea
                      className={textareaClass}
                      value={mayNotSuit}
                      onChange={(e) => setMayNotSuit(e.target.value)}
                      placeholder={'Those seeking quick answers or a more directive relationship\nIndividuals who prefer ongoing portfolio management...'}
                      rows={4}
                    />
                  </div>
                </div>
              </section>

              {/* Professional background - editable */}
              <section>
                <h2 className="text-base font-semibold text-white mb-2">Professional background</h2>
                <p className="text-xs text-slate-400 mb-2">Qualifications, regulator, memberships, insurance.</p>
                <textarea
                  className={textareaClass}
                  value={professionalBackground}
                  onChange={(e) => setProfessionalBackground(e.target.value)}
                  placeholder={'Chartered Financial Planner (UK)\nRegulated by the Financial Conduct Authority (FCA)...'}
                  rows={5}
                />
              </section>

              {/* Jurisdictions and focus areas - editable */}
              <section>
                <h2 className="text-base font-semibold text-white mb-2">Jurisdictions and focus areas</h2>
                <p className="text-xs text-slate-400 mb-2">One item per line.</p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-white">Jurisdictions served</label>
                    <textarea
                      className={textareaClass}
                      value={jurisdictions}
                      onChange={(e) => setJurisdictions(e.target.value)}
                      placeholder={'United Arab Emirates\nUnited Kingdom\nSingapore'}
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-white">Planning focus areas</label>
                    <textarea
                      className={textareaClass}
                      value={planningFocusAreas}
                      onChange={(e) => setPlanningFocusAreas(e.target.value)}
                      placeholder={'Cross-border pension planning\nExpatriate tax residency considerations...'}
                      rows={3}
                    />
                  </div>
                </div>
              </section>

              {/* Professional details - read-only */}
              <section>
                <h2 className="text-base font-semibold text-white mb-3">Professional details</h2>
                <dl className="grid gap-4 sm:grid-cols-2">
                  {profile.yearsOfExperience && (
                    <div className="flex flex-col text-left">
                      <dt className="text-xs text-slate-400 mb-1">Experience</dt>
                      <dd className="text-sm text-slate-200">{profile.yearsOfExperience}</dd>
                    </div>
                  )}
                  {profile.primaryClientBase && (
                    <div className="flex flex-col text-left">
                      <dt className="text-xs text-slate-400 mb-1">Primary client base</dt>
                      <dd className="text-sm text-slate-200">{profile.primaryClientBase}</dd>
                    </div>
                  )}
                  {profile.qualifications && (
                    <div className="flex flex-col text-left sm:col-span-2">
                      <dt className="text-xs text-slate-400 mb-1">Qualifications</dt>
                      <dd className="text-sm whitespace-pre-wrap text-slate-200">{profile.qualifications}</dd>
                    </div>
                  )}
                  {profile.areasOfAdvice && profile.areasOfAdvice.length > 0 && (
                    <div className="flex flex-col text-left sm:col-span-2">
                      <dt className="text-xs text-slate-400 mb-1">Areas of advice</dt>
                      <dd className="flex flex-wrap gap-2 mt-0">
                        {profile.areasOfAdvice.map((a) => (
                          <span key={a} className="px-2 py-0.5 text-xs font-medium rounded-full border border-white/20 bg-white/5 text-slate-200">
                            {a}
                          </span>
                        ))}
                      </dd>
                    </div>
                  )}
                  {profile.regulatorName && (
                    <div className="flex flex-col text-left">
                      <dt className="text-xs text-slate-400 mb-1">Regulator</dt>
                      <dd className="text-sm text-slate-200">
                        {profile.regulatorName}
                        {profile.licenseNumber ? ` (${profile.licenseNumber})` : ""}
                      </dd>
                    </div>
                  )}
                </dl>
              </section>

              {profile.bio && (
                <section>
                  <h2 className="text-base font-semibold text-white mb-3">About</h2>
                  <p className="text-sm whitespace-pre-wrap text-slate-200">{profile.bio}</p>
                </section>
              )}

              {profile.typicalClientProfile && (
                <section>
                  <h2 className="text-base font-semibold text-white mb-3">Typical client profile</h2>
                  <p className="text-sm whitespace-pre-wrap text-slate-200">{profile.typicalClientProfile}</p>
                </section>
              )}

              {/* Save button */}
              <div className="flex items-center gap-3 pt-6 border-t border-white/10">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="rounded-full bg-white/95 px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-slate-900 shadow-lg transition hover:bg-white hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0"
                >
                  {saving ? "Saving..." : saved ? "Saved ✓" : "Save profile"}
                </button>
                {saved && <span className="text-sm text-emerald-400">Profile updated</span>}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
