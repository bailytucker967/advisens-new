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
        const advisorData = await authAPI.getCurrentUser();
        if (!mounted) return;
        
        setAdvisor(advisorData.advisor || advisorData.user);

        const casesData = await apiRequest<{ cases: Case[] }>('/api/cases/advisor');
        if (!mounted) return;
        
        setCases(casesData.cases);
      } catch (error) {
        if (!mounted) return;
        // Temporarily disabled redirect to test
        // router.push('/advisor-login');
        console.error('Dashboard load error:', error);
        setLoading(false);
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
            <div className="mb-6 flex items-center justify-between">
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
                href="#"
                className="text-slate-300 hover:text-white transition-colors"
              >
                View example response structure →
              </Link>
              <Link
                href="#"
                className="text-slate-300 hover:text-white transition-colors"
              >
                Preview your profile →
              </Link>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="mb-6 flex gap-2 border-b border-white/20">
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
              <div className="rounded-3xl border border-white/10 bg-white/90 p-8 text-center text-slate-900 shadow-xl backdrop-blur-xl">
                <p className="text-slate-600">No cases available.</p>
              </div>
            ) : (
              filteredCases.map((caseItem) => {
                const responded = hasResponded(caseItem);
                const myResponse = caseItem.responses?.find((r) => r.advisorId === advisor?.id);
                const profileRevealed = myResponse?.profileRevealed;

                return (
                  <div
                    key={caseItem._id}
                    className="rounded-3xl border border-white/10 bg-white/90 p-6 text-slate-900 shadow-xl backdrop-blur-xl md:p-8"
                  >
                    {profileRevealed && (
                      <div className="mb-4">
                        <span className="px-3 py-1 text-xs font-medium rounded-full border border-slate-300 bg-slate-100 text-slate-700">
                          Profile revealed
                        </span>
                        <p className="mt-2 text-xs text-slate-500">
                          Status update (no action required)
                        </p>
                        <p className="mt-1 text-sm text-slate-700">
                          Your contact details have been provided to the user. No further platform actions will occur. Do not initiate contact. If the user wishes to proceed, they will contact you directly.
                        </p>
                      </div>
                    )}

                    <div className="mb-4 flex flex-wrap items-center gap-3">
                      <span className="text-xs text-slate-500">
                        Submitted {formatDate(caseItem.submittedAt)}
                      </span>
                      {responded && (
                        <span className="px-3 py-1 text-xs font-medium rounded-full border border-slate-300 bg-slate-100 text-slate-700">
                          Response submitted
                        </span>
                      )}
                      {profileRevealed && (
                        <span className="px-3 py-1 text-xs font-medium rounded-full border border-slate-300 bg-slate-100 text-slate-700">
                          Profile revealed
                        </span>
                      )}
                      {caseItem.areas?.map((area) => (
                        <span
                          key={area}
                          className="px-3 py-1 text-xs font-medium rounded-full border border-slate-300 bg-slate-100 text-slate-700"
                        >
                          {area.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                        </span>
                      ))}
                    </div>

                    <h3 className="mb-2 text-lg font-semibold text-slate-900">
                      {caseItem.caseId}
                    </h3>

                    <p className="mb-4 text-sm text-slate-600 line-clamp-3">
                      {caseItem.situation}
                    </p>

                    <div className="flex gap-3">
                      <Link
                        href={`/advisor-dashboard/case/${caseItem._id}`}
                        className="rounded-full border border-slate-300 bg-slate-100 px-4 py-2 text-xs font-medium text-slate-900 transition hover:bg-slate-200"
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

