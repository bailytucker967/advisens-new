"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { authAPI, apiRequest } from "@/lib/api-client";

interface Application {
  id: string;
  firstName: string;
  lastName: string;
  professionalEmail: string;
  mobile: string;
  linkedInUrl?: string;
  location: { country: string; city: string };
  primaryClientBase: string;
  firmName: string;
  firmWebsite?: string;
  roleTitle: string;
  employmentType: string;
  firmType: string;
  firmLocation: string;
  firmOverview?: string;
  isRegulated: boolean;
  regulatorName?: string;
  licenseNumber?: string;
  jurisdictions?: string[];
  hasDisciplinaryActions: boolean;
  disciplinaryDetails?: string;
  yearsOfExperience: string;
  areasOfAdvice?: string[];
  typicalClientProfile?: string;
  qualifications: string;
  supportingDocuments?: string[];
  whyJoinAdvisens: string;
  ethicalAdviceMeaning: string;
  status: string;
  createdAt: string;
}

export default function AdminApplicationDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [actioning, setActioning] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const me = await authAPI.getCurrentUser() as { admin?: any };
        if (!mounted) return;
        if (!me.admin) {
          router.push("/admin-login");
          return;
        }
        const res = await apiRequest<{ application: Application }>(`/api/admin/applications/${id}`);
        if (mounted) setApplication(res.application);
      } catch (e) {
        if (mounted) router.push("/admin-dashboard");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    if (id) load();
    return () => { mounted = false; };
  }, [id, router]);

  const handleApprove = async () => {
    if (!confirm("Approve this application? Advisor login will be created with the applicant's email and password.")) return;
    setActioning(true);
    try {
      await apiRequest(`/api/admin/applications/${id}/approve`, { method: "POST" });
      router.push("/admin-dashboard");
    } catch (e: any) {
      alert(e.message || "Failed to approve");
    } finally {
      setActioning(false);
    }
  };

  const handleReject = async () => {
    if (!confirm("Reject this application?")) return;
    setActioning(true);
    try {
      await apiRequest(`/api/admin/applications/${id}/reject`, { method: "POST" });
      router.push("/admin-dashboard");
    } catch (e: any) {
      alert(e.message || "Failed to reject");
    } finally {
      setActioning(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Permanently delete this application? This cannot be undone.")) return;
    setActioning(true);
    try {
      await apiRequest(`/api/admin/applications/${id}`, { method: "DELETE" });
      router.push("/admin-dashboard");
    } catch (e: any) {
      alert(e.message || "Failed to delete");
    } finally {
      setActioning(false);
    }
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  if (loading || !application) {
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
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
              <div>
                <h1 className="text-2xl font-semibold text-white">
                  {application.firstName} {application.lastName}
                </h1>
                <p className="text-sm text-slate-300">{application.professionalEmail}</p>
                <p className="text-xs text-slate-400 mt-1">{application.firmName} · {application.roleTitle}</p>
                <span className={`inline-block mt-2 px-3 py-1 text-xs font-medium rounded-full ${
                  application.status === "pending" ? "border border-amber-400/50 bg-amber-500/20 text-amber-200" :
                  application.status === "approved" ? "border border-emerald-400/50 bg-emerald-500/20 text-emerald-200" :
                  "border border-white/20 bg-white/10 text-slate-200"
                }`}>
                  {application.status}
                </span>
              </div>
              <div className="flex gap-2 flex-wrap shrink-0">
                {application.status === "pending" && (
                  <>
                    <button
                      onClick={handleApprove}
                      disabled={actioning}
                      className="rounded-full border border-emerald-400/50 bg-emerald-500/20 px-4 py-2 text-xs font-medium text-emerald-200 hover:bg-emerald-500/30 disabled:opacity-50"
                    >
                      {actioning ? "Processing..." : "Approve"}
                    </button>
                    <button
                      onClick={handleReject}
                      disabled={actioning}
                      className="rounded-full border border-white/30 bg-white/10 px-4 py-2 text-xs font-medium text-slate-200 hover:bg-white/20 disabled:opacity-50"
                    >
                      Reject
                    </button>
                  </>
                )}
                <button
                  onClick={handleDelete}
                  disabled={actioning}
                  className="rounded-full border border-red-400/40 bg-red-500/20 px-4 py-2 text-xs font-medium text-red-200 hover:bg-red-500/30 disabled:opacity-50"
                >
                  Delete
                </button>
              </div>
            </div>

            <div className="space-y-6 text-sm">
              <section className="p-4 rounded-xl border border-white/10 bg-white/5">
                <h2 className="font-semibold text-white mb-4">Advisor details</h2>
                <dl className="grid gap-3 sm:grid-cols-2">
                  <div><dt className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Mobile</dt><dd className="text-slate-200">{application.mobile}</dd></div>
                  <div><dt className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">LinkedIn</dt><dd className="text-slate-200 break-all">{application.linkedInUrl ? <a href={application.linkedInUrl} target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline">{application.linkedInUrl}</a> : "—"}</dd></div>
                  <div><dt className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Location</dt><dd className="text-slate-200">{application.location?.city}, {application.location?.country}</dd></div>
                  <div><dt className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Primary client base</dt><dd className="text-slate-200">{application.primaryClientBase}</dd></div>
                </dl>
              </section>

              <section className="p-4 rounded-xl border border-white/10 bg-white/5">
                <h2 className="font-semibold text-white mb-4">Firm details</h2>
                <dl className="grid gap-3 sm:grid-cols-2">
                  <div><dt className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Firm name</dt><dd className="text-slate-200">{application.firmName}</dd></div>
                  <div><dt className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Website</dt><dd className="text-slate-200 break-all">{application.firmWebsite ? <a href={application.firmWebsite} target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline">{application.firmWebsite}</a> : "—"}</dd></div>
                  <div><dt className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Role</dt><dd className="text-slate-200">{application.roleTitle}</dd></div>
                  <div><dt className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Employment type</dt><dd className="text-slate-200">{application.employmentType}</dd></div>
                  <div><dt className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Firm type</dt><dd className="text-slate-200">{application.firmType}</dd></div>
                  <div><dt className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Firm location</dt><dd className="text-slate-200">{application.firmLocation}</dd></div>
                </dl>
                {application.firmOverview && <p className="mt-3 text-slate-300 whitespace-pre-wrap text-sm">{application.firmOverview}</p>}
              </section>

              <section className="p-4 rounded-xl border border-white/10 bg-white/5">
                <h2 className="font-semibold text-white mb-4">Regulation & standing</h2>
                <dl className="grid gap-3 sm:grid-cols-2">
                  <div><dt className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Regulated</dt><dd className="text-slate-200">{application.isRegulated ? "Yes" : "No"}</dd></div>
                  {application.isRegulated && (
                    <>
                      <div><dt className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Regulator</dt><dd className="text-slate-200">{application.regulatorName}</dd></div>
                      <div><dt className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">License</dt><dd className="text-slate-200">{application.licenseNumber}</dd></div>
                      <div><dt className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Jurisdictions</dt><dd className="text-slate-200">{application.jurisdictions?.join(", ") || "—"}</dd></div>
                    </>
                  )}
                  <div><dt className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Disciplinary actions</dt><dd className="text-slate-200">{application.hasDisciplinaryActions ? "Yes" : "No"}</dd></div>
                  {application.hasDisciplinaryActions && application.disciplinaryDetails && (
                    <div className="sm:col-span-2"><dt className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Details</dt><dd className="text-slate-300 whitespace-pre-wrap">{application.disciplinaryDetails}</dd></div>
                  )}
                </dl>
              </section>

              <section className="p-4 rounded-xl border border-white/10 bg-white/5">
                <h2 className="font-semibold text-white mb-4">Experience & focus</h2>
                <dl className="grid gap-3 sm:grid-cols-2">
                  <div><dt className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Years of experience</dt><dd className="text-slate-200">{application.yearsOfExperience}</dd></div>
                  <div><dt className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Areas of advice</dt><dd className="text-slate-200">{application.areasOfAdvice?.join(", ") || "—"}</dd></div>
                </dl>
                {application.typicalClientProfile && <p className="mt-3 text-slate-300 whitespace-pre-wrap text-sm">{application.typicalClientProfile}</p>}
              </section>

              <section className="p-4 rounded-xl border border-white/10 bg-white/5">
                <h2 className="font-semibold text-white mb-3">Qualifications</h2>
                <p className="text-slate-300 whitespace-pre-wrap">{application.qualifications}</p>
              </section>

              {application.supportingDocuments && application.supportingDocuments.length > 0 && (
                <section className="p-4 rounded-xl border border-white/10 bg-white/5">
                  <h2 className="font-semibold text-white mb-3">Supporting documents</h2>
                  <ul className="space-y-2">
                    {application.supportingDocuments.map((url, i) => (
                      <li key={i}>
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-400 hover:underline text-sm"
                        >
                          View document {i + 1} →
                        </a>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              <section className="p-4 rounded-xl border border-white/10 bg-white/5">
                <h2 className="font-semibold text-white mb-3">Why join Advisens</h2>
                <p className="text-slate-300 whitespace-pre-wrap">{application.whyJoinAdvisens}</p>
              </section>

              <section className="p-4 rounded-xl border border-white/10 bg-white/5">
                <h2 className="font-semibold text-white mb-3">Ethical advice meaning</h2>
                <p className="text-slate-300 whitespace-pre-wrap">{application.ethicalAdviceMeaning}</p>
              </section>

              <p className="text-xs text-slate-400 pt-4 border-t border-white/10">Applied {formatDate(application.createdAt)}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
