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

export default function UserDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    
    async function loadData() {
      try {
        const userData = await authAPI.getCurrentUser() as { user?: any; advisor?: any };
        if (!mounted) return;
        
        setUser(userData.user || userData.advisor);

        const casesData = await apiRequest<{ cases: Case[] }>('/api/cases/user');
        if (!mounted) return;
        
        setCases(casesData.cases);
      } catch (error) {
        if (!mounted) return;
        // Temporarily disabled redirect to test
        // router.push('/user-login');
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

  const getStatusTag = (status: string, responseCount: number) => {
    if (status === 'profile_revealed') {
      return <span className="px-3 py-1 text-xs font-medium rounded-full border border-amber-400/50 bg-amber-500/20 text-amber-200">Profile revealed</span>;
    }
    if (responseCount > 0) {
      return <span className="px-3 py-1 text-xs font-medium rounded-full border border-white/20 bg-white/10 text-slate-200">Response received</span>;
    }
    return <span className="px-3 py-1 text-xs font-medium rounded-full border border-white/20 bg-white/10 text-slate-200">Pending</span>;
  };

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
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-300 truncate max-w-[min(100%,20rem)]" title={user?.email}>
                {user?.email || "User account"}
              </p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white md:text-4xl">
                Your cases
              </h1>
              <p className="mt-2 text-sm text-slate-200">
                Track your submitted cases and review advisor responses.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              <Link
                href="/user-dashboard/profile"
                className="rounded-full border border-white/40 px-4 py-2 text-xs font-medium text-slate-200 hover:bg-white/10"
              >
                Profile
              </Link>
              <Link
                href="/submit"
                className="rounded-full border border-white/80 bg-white/10 px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-white hover:text-slate-900"
              >
                Submit a new case
              </Link>
              <button
                onClick={handleLogout}
                className="rounded-full border border-white/40 px-4 py-2 text-xs font-medium text-slate-200 hover:bg-white/10"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Cases List */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-white">Submitted cases</h2>

            {cases.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl p-8 text-center">
                <p className="text-slate-300">No cases submitted yet.</p>
                <Link
                  href="/submit"
                  className="mt-4 inline-block rounded-full bg-white/95 px-6 py-2.5 text-xs font-semibold text-slate-900 shadow-lg transition hover:bg-white hover:-translate-y-0.5"
                >
                  Submit your first case
                </Link>
              </div>
            ) : (
              cases.map((caseItem) => (
                <div
                  key={caseItem._id}
                  className="rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl p-6 md:p-8"
                >
                  <div className="mb-4 flex flex-wrap items-center gap-3">
                    <span className="text-xs text-slate-400">
                      Submitted {formatDate(caseItem.submittedAt)}
                    </span>
                    {getStatusTag(caseItem.status, caseItem.responses?.length || 0)}
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

                  <p className="mb-4 text-sm text-slate-300 line-clamp-2">
                    {caseItem.situation}
                  </p>

                  <div className="flex flex-wrap gap-3">
                    <Link
                      href={`/user-dashboard/case/${caseItem._id}`}
                      className="rounded-full border border-white/30 bg-white/10 px-4 py-2 text-xs font-medium text-white transition hover:bg-white/20"
                    >
                      View case
                    </Link>
                    {caseItem.responses && caseItem.responses.length > 0 && (
                      <Link
                        href={`/user-dashboard/case/${caseItem._id}`}
                        className="rounded-full bg-white/95 px-4 py-2 text-xs font-medium text-slate-900 shadow transition hover:bg-white hover:-translate-y-0.5"
                      >
                        View response ({caseItem.responses.length})
                      </Link>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

