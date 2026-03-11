"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authAPI, apiRequest } from "@/lib/api-client";

const REGION_OPTIONS = [
  { value: "", label: "Select region" },
  { value: "gcc", label: "GCC" },
  { value: "uk", label: "UK" },
  { value: "eu", label: "EU" },
  { value: "other", label: "Other" },
];

const RESIDENCY_OPTIONS = [
  { value: "", label: "Select" },
  { value: "short_term", label: "Short-term" },
  { value: "medium_term", label: "Medium-term" },
  { value: "long_term", label: "Long-term" },
  { value: "unsure", label: "Unsure" },
];

const AREA_OPTIONS = [
  { value: "investments_savings", label: "Investments / savings" },
  { value: "pensions_planning", label: "Pensions / long-term planning" },
  { value: "cross_border", label: "Cross-border considerations" },
  { value: "protection", label: "Protection / insurance" },
  { value: "fees_structures", label: "Fee transparency" },
];

const ADVISOR_PREFERENCE_OPTIONS = [
  "Clear communication in plain language",
  "Transparency about fees and conflicts of interest",
  "Respect for my timeline and decision-making process",
  "Independence from product providers",
];

interface UserProfile {
  basedIn?: string;
  timeHorizon?: string;
  hadAdviceBefore?: string;
  perspectives?: string[];
  situation?: string;
  unclear?: string;
  lookingFor?: string;
  areas?: string[];
  region?: string;
  residencyOutlook?: string;
  advisorPreferences?: string[];
}

interface CaseSummary {
  _id: string;
  caseId: string;
  submittedAt: string;
  status: string;
  situation?: string;
  areas?: string[];
  responses?: Array<{ advisorId: string }>;
}

export default function UserProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<{ id: string; email: string; role: string; profile?: UserProfile } | null>(null);
  const [cases, setCases] = useState<CaseSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [region, setRegion] = useState("");
  const [residencyOutlook, setResidencyOutlook] = useState("");
  const [areas, setAreas] = useState<string[]>([]);
  const [advisorPreferences, setAdvisorPreferences] = useState<string[]>([]);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const [userRes, casesRes] = await Promise.all([
          authAPI.getCurrentUser() as Promise<{ user?: { id: string; email: string; role: string; profile?: UserProfile } }>,
          apiRequest<{ cases: CaseSummary[] }>("/api/cases/user"),
        ]);
        if (!mounted) return;
        if (!userRes.user) {
          router.push("/user-login");
          return;
        }
        setUser(userRes.user);
        setCases(casesRes.cases || []);

        const p = userRes.user.profile;
        setRegion(p?.region || "gcc");
        setResidencyOutlook(p?.residencyOutlook || "medium_term");
        setAreas(p?.areas || []);
        setAdvisorPreferences(p?.advisorPreferences || []);
      } catch {
        if (mounted) router.push("/user-login");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, [router]);

  const toggleArea = (val: string) => {
    setAreas((prev) => (prev.includes(val) ? prev.filter((a) => a !== val) : [...prev, val]));
  };

  const toggleAdvisorPreference = (val: string) => {
    setAdvisorPreferences((prev) =>
      prev.includes(val) ? prev.filter((a) => a !== val) : [...prev, val]
    );
  };

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      const res = await apiRequest<{ user: { profile?: UserProfile } }>("/api/user/profile", {
        method: "PATCH",
        body: JSON.stringify({
          region,
          residencyOutlook,
          areas,
          advisorPreferences,
        }),
      });
      setUser((u) => (u && res.user ? { ...u, profile: res.user.profile } : u));
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  const areaLabel = (val: string) => AREA_OPTIONS.find((o) => o.value === val)?.label || val;

  if (loading || !user) {
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
        <div className="mx-auto max-w-2xl">
          <Link href="/user-dashboard" className="inline-flex items-center gap-2 text-sm text-slate-300 hover:text-white mb-6">
            ← Back to dashboard
          </Link>

          <div className="rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl p-6 md:p-8">
            <h1 className="text-2xl font-semibold text-white mb-2">User profile</h1>
            <p className="text-sm text-slate-400 mb-6">
              This is an example user profile for demonstration purposes. Profile information helps advisors understand your context without revealing your identity.
            </p>

            {/* Location & planning context - editable */}
            <section className="mb-8">
              <h2 className="text-base font-semibold text-white mb-4">Location & planning context</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">Region</label>
                  <select
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    className="w-full rounded-lg border border-white/20 bg-white/5 px-3 py-2.5 text-sm text-white focus:border-emerald-400/50 focus:outline-none focus:ring-1 focus:ring-emerald-400/30"
                  >
                    {REGION_OPTIONS.map((o) => (
                      <option key={o.value || "blank"} value={o.value} className="bg-slate-800 text-white">{o.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">Residency outlook</label>
                  <select
                    value={residencyOutlook}
                    onChange={(e) => setResidencyOutlook(e.target.value)}
                    className="w-full rounded-lg border border-white/20 bg-white/5 px-3 py-2.5 text-sm text-white focus:border-emerald-400/50 focus:outline-none focus:ring-1 focus:ring-emerald-400/30"
                  >
                    {RESIDENCY_OPTIONS.map((o) => (
                      <option key={o.value || "blank"} value={o.value} className="bg-slate-800 text-white">{o.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </section>

            {/* Typical decision contexts - editable */}
            <section className="mb-8">
              <h2 className="text-base font-semibold text-white mb-2">Typical decision contexts</h2>
              <p className="text-xs text-slate-400 mb-4">Areas where you&apos;ve sought or are likely to seek clarity.</p>
              <div className="flex flex-wrap gap-2">
                {AREA_OPTIONS.map((o) => (
                  <label
                    key={o.value}
                    className="flex items-center gap-2 rounded-lg border border-white/20 bg-white/5 px-4 py-2 cursor-pointer hover:bg-white/10 transition has-[:checked]:border-emerald-400/50 has-[:checked]:bg-emerald-500/20"
                  >
                    <input
                      type="checkbox"
                      checked={areas.includes(o.value)}
                      onChange={() => toggleArea(o.value)}
                      className="rounded border-white/30 bg-white/5 text-emerald-500 focus:ring-emerald-400/50"
                    />
                    <span className="text-sm text-slate-200">{o.label}</span>
                  </label>
                ))}
              </div>
            </section>

            {/* What matters in advisor relationship - editable */}
            <section className="mb-8">
              <h2 className="text-base font-semibold text-white mb-2">What matters in an advisor relationship</h2>
              <p className="text-xs text-slate-400 mb-4">Your preferences help advisors understand whether their approach is likely to resonate.</p>
              <ul className="space-y-2">
                {ADVISOR_PREFERENCE_OPTIONS.map((opt) => (
                  <li key={opt}>
                    <label className="flex items-start gap-3 rounded-lg border border-white/10 bg-white/5 px-4 py-3 cursor-pointer hover:bg-white/10 transition has-[:checked]:border-emerald-400/30 has-[:checked]:bg-emerald-500/10">
                      <input
                        type="checkbox"
                        checked={advisorPreferences.includes(opt)}
                        onChange={() => toggleAdvisorPreference(opt)}
                        className="mt-1 rounded border-white/30 bg-white/5 text-emerald-500 focus:ring-emerald-400/50"
                      />
                      <span className="text-sm text-slate-200">— {opt}</span>
                    </label>
                  </li>
                ))}
              </ul>
            </section>

            <div className="flex items-center gap-3 mb-8">
              <button
                onClick={handleSave}
                disabled={saving}
                className="rounded-full bg-white/95 px-6 py-2.5 text-sm font-semibold text-slate-900 shadow-lg transition hover:bg-white hover:-translate-y-0.5 disabled:opacity-50"
              >
                {saving ? "Saving..." : saved ? "Saved ✓" : "Save profile"}
              </button>
              {saved && <span className="text-sm text-emerald-400">Profile updated</span>}
            </div>

            {/* Case history - dynamic */}
            <section>
              <h2 className="text-base font-semibold text-white mb-4">Case history</h2>
              {cases.length === 0 ? (
                <p className="text-sm text-slate-400">No cases yet. Submit a case to see it here.</p>
              ) : (
                <div className="space-y-4">
                  {cases.map((c) => (
                    <Link
                      key={c._id}
                      href={`/user-dashboard/case/${c._id}`}
                      className="block p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition"
                    >
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="font-medium text-white">{c.caseId}</span>
                        <span className={`px-2 py-0.5 text-xs font-medium rounded ${
                          c.status === "profile_revealed" ? "border border-amber-400/50 bg-amber-500/20 text-amber-200" :
                          c.responses && c.responses.length > 0 ? "border border-emerald-400/50 bg-emerald-500/20 text-emerald-200" :
                          "border border-white/20 bg-white/10 text-slate-200"
                        }`}>
                          {c.status === "profile_revealed" ? "Profile revealed" : c.responses && c.responses.length > 0 ? "Response received" : "Pending"}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mb-2">Submitted {formatDate(c.submittedAt)}</p>
                      {c.areas && c.areas.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {c.areas.map((a) => (
                            <span key={a} className="px-2 py-0.5 text-xs rounded-full border border-white/20 bg-white/5 text-slate-300">{areaLabel(a)}</span>
                          ))}
                        </div>
                      )}
                    </Link>
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
