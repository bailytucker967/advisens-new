"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { authAPI, apiRequest } from "@/lib/api-client";

interface CaseSummary {
  id: string;
  caseId: string;
  submittedAt: string;
  status: string;
  situation: string;
  areas: string[];
  responseCount: number;
}

export default function AdminUserCasesPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
  const [cases, setCases] = useState<CaseSummary[]>([]);
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
        const res = await apiRequest<{ user: { id: string; email: string }; cases: CaseSummary[] }>(
          `/api/admin/users/${id}/cases`
        );
        if (mounted) {
          setUser(res.user);
          setCases(res.cases);
        }
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

  if (loading) {
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
            <h1 className="text-xl font-semibold text-white mb-1">User cases</h1>
            <p className="text-sm text-slate-300 mb-6">{user?.email}</p>

            {cases.length === 0 ? (
              <p className="text-sm text-slate-300">No cases submitted by this user.</p>
            ) : (
              <div className="space-y-4">
                {cases.map((c) => (
                  <Link
                    key={c.id}
                    href={`/admin-dashboard/cases/${c.id}`}
                    className="block p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition"
                  >
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="font-medium text-white">{c.caseId}</span>
                      <span className={`px-2 py-0.5 text-xs font-medium rounded ${
                        c.status === "profile_revealed" ? "border border-amber-400/50 bg-amber-500/20 text-amber-200" :
                        c.responseCount > 0 ? "border border-emerald-400/50 bg-emerald-500/20 text-emerald-200" :
                        "border border-white/20 bg-white/10 text-slate-200"
                      }`}>
                        {c.status === "profile_revealed" ? "Profile revealed" : c.responseCount > 0 ? `${c.responseCount} response(s)` : "Pending"}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mb-2">Submitted {formatDate(c.submittedAt)}</p>
                    <p className="text-sm text-slate-300 line-clamp-2">{c.situation}</p>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
