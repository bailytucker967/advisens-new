"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authAPI, apiRequest } from "@/lib/api-client";

interface Case {
  _id: string;
  caseId: string;
  submittedAt: string;
  status: string;
  situation: string;
  areas: string[];
  responses: Array<{
    advisorId: string;
    advisorName?: string;
    advisorFirm?: string;
    response: string;
    submittedAt: string;
    profileRevealed: boolean;
  }>;
}

export default function AdvisorDashboardPage() {
  const router = useRouter();
  const [advisor, setAdvisor] = useState<any>(null);
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unresponded'>('all');

  useEffect(() => {
    let mounted = true;
    
    async function loadData() {
      try {
        const advisorData = await authAPI.getCurrentUser() as { advisor?: any };
        if (!mounted) return;
        
        if (!advisorData.advisor) {
          router.push("/advisor-login");
          return;
        }

        setAdvisor(advisorData.advisor);

        const casesData = await apiRequest<{ cases: Case[] }>('/api/cases/advisor');
        if (!mounted) return;
        
        setCases(casesData.cases);
      } catch (error) {
        if (!mounted) return;
        console.error('Dashboard load error:', error);
        router.push("/advisor-login");
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }
    
    loadData();
    
    return () => {
      mounted = false;
    };
  }, [router]);

  const handleLogout = async () => {
    try {
      await authAPI.logout();
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const hasResponded = (caseItem: Case) => {
    if (!caseItem.responses) return false;
    return caseItem.responses.some((r) => r.advisorId === advisor?.id);
  };

  const filteredCases = filter === 'unresponded' 
    ? cases.filter((c) => !hasResponded(c))
    : cases;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col text-slate-50">
      {/* Shared background */}
      <div
        className="fixed inset-0 -z-30 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/web%20background.jpeg')" }}
      />
      <div className="fixed inset-0 -z-20 bg-gradient-to-b from-black/40 via-black/30 to-black/20" />

      <main className="relative z-10 flex-1 px-4 pb-16 pt-8 md:px-8">
        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <div className="mb-8">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">
                  Available cases
                </h1>
                <p className="mt-2 text-sm text-slate-200">
                  Review anonymised cases and provide structured, educational responses.
                </p>
                <p className="mt-1 text-sm text-slate-300">
                  Respond only to cases where your approach genuinely applies.
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="rounded-full border border-white/40 px-4 py-2 text-xs font-medium text-slate-200 hover:bg-white/10"
              >
                Logout
              </button>
            </div>

            <div className="flex gap-4 text-sm">
              <Link
                href="/advisor-dashboard/profile"
                className="text-slate-300 hover:text-white transition-colors"
              >
                View & edit your profile →
              </Link>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="mb-6 flex gap-2 border-b border-white/20 overflow-x-auto scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 text-sm font-medium transition ${
                filter === 'all'
                  ? 'border-b-2 border-white text-white'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              All cases
            </button>
            <button
              onClick={() => setFilter('unresponded')}
              className={`px-4 py-2 text-sm font-medium transition ${
                filter === 'unresponded'
                  ? 'border-b-2 border-white text-white'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Unresponded only
            </button>
          </div>

          {/* Cases List */}
          <div className="space-y-6">
            {filteredCases.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl p-8 text-center">
                <p className="text-slate-300">No cases available.</p>
              </div>
            ) : (
              filteredCases.map((caseItem) => {
                const responded = hasResponded(caseItem);
                const myResponse = caseItem.responses?.find((r) => r.advisorId === advisor?.id);
                const profileRevealed = myResponse?.profileRevealed;

                return (
                  <div
                    key={caseItem._id}
                    className="rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl p-6 md:p-8"
                  >
                    {profileRevealed && (
                      <div className="mb-4 p-4 rounded-xl border border-amber-400/30 bg-amber-500/10">
                        <span className="px-3 py-1 text-xs font-medium rounded-full border border-amber-400/50 bg-amber-500/20 text-amber-200">
                          Profile revealed
                        </span>
                        <p className="mt-2 text-xs text-slate-300">
                          Status update (no action required)
                        </p>
                        <p className="mt-1 text-sm text-slate-200">
                          Your contact details have been provided to the user. No further platform actions will occur. Do not initiate contact. If the user wishes to proceed, they will contact you directly.
                        </p>
                      </div>
                    )}

                    <div className="mb-4 flex flex-wrap items-center gap-3">
                      <span className="text-xs text-slate-400">
                        Submitted {formatDate(caseItem.submittedAt)}
                      </span>
                      {responded && (
                        <span className="px-3 py-1 text-xs font-medium rounded-full border border-white/20 bg-white/10 text-slate-200">
                          Response submitted
                        </span>
                      )}
                      {profileRevealed && (
                        <span className="px-3 py-1 text-xs font-medium rounded-full border border-amber-400/30 bg-amber-500/20 text-amber-200">
                          Profile revealed
                        </span>
                      )}
                      {caseItem.areas?.map((area) => (
                        <span
                          key={area}
                          className="px-3 py-1 text-xs font-medium rounded-full border border-white/20 bg-white/10 text-slate-200"
                        >
                          {area.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                        </span>
                      ))}
                    </div>

                    <h3 className="mb-2 text-lg font-semibold text-white">
                      {caseItem.caseId}
                    </h3>

                    <p className="mb-4 text-sm text-slate-300 line-clamp-3">
                      {caseItem.situation}
                    </p>

                    <div className="flex flex-wrap gap-3">
                      <Link
                        href={`/advisor-dashboard/case/${caseItem._id}`}
                        className="rounded-full border border-white/30 bg-white/10 px-4 py-2 text-xs font-medium text-white transition hover:bg-white/20"
                      >
                        {responded ? 'Review case' : 'Respond to case'}
                      </Link>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

