"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authAPI, apiRequest } from "@/lib/api-client";

interface UserItem {
  id: string;
  email: string;
  role: string;
  createdAt: string;
}

interface AdvisorItem {
  id: string;
  email: string;
  name?: string;
  firm?: string;
  role: string;
  createdAt: string;
}

interface ApplicationItem {
  id: string;
  firstName: string;
  lastName: string;
  professionalEmail: string;
  firmName: string;
  roleTitle: string;
  status: string;
  createdAt: string;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [admin, setAdmin] = useState<any>(null);
  const [users, setUsers] = useState<UserItem[]>([]);
  const [advisors, setAdvisors] = useState<AdvisorItem[]>([]);
  const [applications, setApplications] = useState<ApplicationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"users" | "advisors" | "applications">("applications");

  // Filters
  const [applicationsSearch, setApplicationsSearch] = useState("");
  const [applicationsStatus, setApplicationsStatus] = useState<"all" | "pending" | "approved" | "rejected">("all");
  const [usersSearch, setUsersSearch] = useState("");
  const [advisorsSearch, setAdvisorsSearch] = useState("");

  // Add user form
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserPassword, setNewUserPassword] = useState("");
  const [addingUser, setAddingUser] = useState(false);
  const [userError, setUserError] = useState("");

  // Add advisor form
  const [newAdvisorEmail, setNewAdvisorEmail] = useState("");
  const [newAdvisorPassword, setNewAdvisorPassword] = useState("");
  const [newAdvisorName, setNewAdvisorName] = useState("");
  const [newAdvisorFirm, setNewAdvisorFirm] = useState("");
  const [addingAdvisor, setAddingAdvisor] = useState(false);
  const [advisorError, setAdvisorError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const me = await authAPI.getCurrentUser() as { admin?: any };
        if (!me.admin) {
          if (mounted) router.push("/admin-login");
          return;
        }

        if (!mounted) return;
        setAdmin(me.admin);

        const [usersRes, advisorsRes, appsRes] = await Promise.all([
          apiRequest<{ users: UserItem[] }>("/api/admin/users"),
          apiRequest<{ advisors: AdvisorItem[] }>("/api/admin/advisors"),
          apiRequest<{ applications: ApplicationItem[] }>("/api/admin/applications"),
        ]);
        if (mounted) {
          setUsers(usersRes.users);
          setAdvisors(advisorsRes.advisors);
          setApplications(appsRes.applications);
        }
      } catch (e) {
        if (mounted) router.push("/admin-login");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => { mounted = false; };
  }, [router]);

  const handleLogout = async () => {
    try {
      await authAPI.logout();
      router.push("/");
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setUserError("");
    setAddingUser(true);
    try {
      const res = await apiRequest<{ user: UserItem }>("/api/admin/users", {
        method: "POST",
        body: JSON.stringify({ email: newUserEmail, password: newUserPassword }),
      });
      setUsers((prev) => [res.user, ...prev]);
      setNewUserEmail("");
      setNewUserPassword("");
    } catch (err: any) {
      setUserError(err.message || "Failed to add user");
    } finally {
      setAddingUser(false);
    }
  };

  const handleRemoveUser = async (id: string) => {
    if (!confirm("Remove this user? Cases linked to them will remain but orphaned.")) return;
    try {
      await apiRequest(`/api/admin/users/${id}`, { method: "DELETE" });
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddAdvisor = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdvisorError("");
    setAddingAdvisor(true);
    try {
      const res = await apiRequest<{ advisor: AdvisorItem }>("/api/admin/advisors", {
        method: "POST",
        body: JSON.stringify({
          email: newAdvisorEmail,
          password: newAdvisorPassword,
          name: newAdvisorName || undefined,
          firm: newAdvisorFirm || undefined,
        }),
      });
      setAdvisors((prev) => [res.advisor, ...prev]);
      setNewAdvisorEmail("");
      setNewAdvisorPassword("");
      setNewAdvisorName("");
      setNewAdvisorFirm("");
    } catch (err: any) {
      setAdvisorError(err.message || "Failed to add advisor");
    } finally {
      setAddingAdvisor(false);
    }
  };

  const handleApproveApplication = async (id: string) => {
    if (!confirm("Approve this application? An advisor account will be created with the applicant's email and password.")) return;
    try {
      await apiRequest(`/api/admin/applications/${id}/approve`, { method: "POST" });
      const [advisorsRes, appsRes] = await Promise.all([
        apiRequest<{ advisors: AdvisorItem[] }>("/api/admin/advisors"),
        apiRequest<{ applications: ApplicationItem[] }>("/api/admin/applications"),
      ]);
      setAdvisors(advisorsRes.advisors);
      setApplications(appsRes.applications);
    } catch (e: any) {
      alert(e.message || "Failed to approve");
    }
  };

  const handleRejectApplication = async (id: string) => {
    if (!confirm("Reject this application?")) return;
    try {
      await apiRequest(`/api/admin/applications/${id}/reject`, { method: "POST" });
      const appsRes = await apiRequest<{ applications: ApplicationItem[] }>("/api/admin/applications");
      setApplications(appsRes.applications);
    } catch (e: any) {
      alert(e.message || "Failed to reject");
    }
  };

  const handleDeleteApplication = async (id: string) => {
    if (!confirm("Permanently delete this application? This cannot be undone.")) return;
    try {
      await apiRequest(`/api/admin/applications/${id}`, { method: "DELETE" });
      setApplications((prev) => prev.filter((a) => a.id !== id));
    } catch (e: any) {
      alert(e.message || "Failed to delete");
    }
  };

  const handleRemoveAdvisor = async (id: string) => {
    if (!confirm("Remove this advisor? Their responses will remain on cases.")) return;
    try {
      await apiRequest(`/api/admin/advisors/${id}`, { method: "DELETE" });
      setAdvisors((prev) => prev.filter((a) => a.id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

  const q = (s: string) => (s || "").toLowerCase().trim();

  const filteredApplications = applications.filter((a) => {
    const matchSearch =
      !applicationsSearch ||
      q(a.firstName).includes(q(applicationsSearch)) ||
      q(a.lastName).includes(q(applicationsSearch)) ||
      q(a.professionalEmail).includes(q(applicationsSearch)) ||
      q(a.firmName).includes(q(applicationsSearch)) ||
      q(a.roleTitle).includes(q(applicationsSearch));
    const matchStatus =
      applicationsStatus === "all" || a.status === applicationsStatus;
    return matchSearch && matchStatus;
  });

  const filteredUsers = users.filter(
    (u) => !usersSearch || q(u.email).includes(q(usersSearch))
  );

  const filteredAdvisors = advisors.filter(
    (a) =>
      !advisorsSearch ||
      q(a.email).includes(q(advisorsSearch)) ||
      q(a.name || "").includes(q(advisorsSearch)) ||
      q(a.firm || "").includes(q(advisorsSearch))
  );

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
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">
                Admin
              </p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white md:text-4xl">
                Admin dashboard
              </h1>
              <p className="mt-2 text-sm text-slate-200">
                Manage users and advisors
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="rounded-full border border-white/40 px-4 py-2 text-xs font-medium text-slate-200 hover:bg-white/10"
            >
              Logout
            </button>
          </div>

          <div className="flex gap-2 border-b border-white/20 mb-6">
            <button
              onClick={() => setTab("applications")}
              className={`px-4 py-2 text-sm font-medium transition ${
                tab === "applications" ? "border-b-2 border-white text-white" : "text-slate-300 hover:text-white"
              }`}
            >
              Applications
            </button>
            <button
              onClick={() => setTab("users")}
              className={`px-4 py-2 text-sm font-medium transition ${
                tab === "users" ? "border-b-2 border-white text-white" : "text-slate-300 hover:text-white"
              }`}
            >
              Users
            </button>
            <button
              onClick={() => setTab("advisors")}
              className={`px-4 py-2 text-sm font-medium transition ${
                tab === "advisors" ? "border-b-2 border-white text-white" : "text-slate-300 hover:text-white"
              }`}
            >
              Advisors
            </button>
          </div>

          {tab === "applications" && (
            <div className="space-y-6">
              <div className="rounded-3xl border border-white/10 bg-white/90 p-6 text-slate-900 shadow-xl backdrop-blur-xl">
                <h2 className="text-lg font-semibold text-slate-900 mb-2">Advisor applications ({applications.length})</h2>
                <p className="text-sm text-slate-600 mb-4">Approve to create advisor login with applicant's email and password.</p>
                <div className="flex flex-wrap gap-4 mb-6">
                  <input
                    type="search"
                    value={applicationsSearch}
                    onChange={(e) => setApplicationsSearch(e.target.value)}
                    placeholder="Search by name, email, firm, role..."
                    className="flex-1 min-w-[200px] rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 bg-white"
                  />
                  <select
                    value={applicationsStatus}
                    onChange={(e) => setApplicationsStatus(e.target.value as typeof applicationsStatus)}
                    className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 bg-white"
                  >
                    <option value="all">All statuses</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
                {(applicationsSearch || applicationsStatus !== "all") && (
                  <p className="text-xs text-slate-500 mb-2">
                    Showing {filteredApplications.length} of {applications.length}
                  </p>
                )}
                <div className="space-y-4">
                  {filteredApplications.length === 0 ? (
                    <p className="text-sm text-slate-600">
                      {applications.length === 0 ? "No applications yet." : "No applications match your filters."}
                    </p>
                  ) : (
                    filteredApplications.map((a) => (
                      <div key={a.id} className="flex items-center justify-between py-4 border-b border-slate-200 last:border-0">
                        <div>
                          <Link href={`/admin-dashboard/applications/${a.id}`} className="font-medium text-slate-800 hover:text-emerald-600 hover:underline">
                            {a.firstName} {a.lastName}
                          </Link>
                          <p className="text-sm text-slate-600">{a.professionalEmail}</p>
                          <p className="text-xs text-slate-500">{a.firmName} · {a.roleTitle} · {formatDate(a.createdAt)}</p>
                          <span className={`inline-block mt-2 px-2 py-0.5 text-xs font-medium rounded ${
                            a.status === "pending" ? "bg-amber-100 text-amber-800" :
                            a.status === "approved" ? "bg-emerald-100 text-emerald-800" :
                            "bg-slate-100 text-slate-700"
                          }`}>
                            {a.status}
                          </span>
                        </div>
                        <div className="flex gap-2 items-center flex-wrap">
                          <Link
                            href={`/admin-dashboard/applications/${a.id}`}
                            className="rounded-full border border-slate-300 bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-200"
                          >
                            View
                          </Link>
                          {a.status === "pending" && (
                            <>
                              <button
                                onClick={() => handleApproveApplication(a.id)}
                                className="rounded-full border border-emerald-300 bg-emerald-100 px-3 py-1.5 text-xs font-medium text-emerald-800 hover:bg-emerald-200"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleRejectApplication(a.id)}
                                className="rounded-full border border-slate-300 bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-200"
                              >
                                Reject
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => handleDeleteApplication(a.id)}
                            className="rounded-full border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {tab === "users" && (
            <div className="space-y-6">
              <div className="rounded-3xl border border-white/10 bg-white/90 p-6 text-slate-900 shadow-xl backdrop-blur-xl">
                <h2 className="text-lg font-semibold text-slate-900 mb-4">Add user</h2>
                <form onSubmit={handleAddUser} className="space-y-4 max-w-md">
                  {userError && <p className="text-sm text-red-600">{userError}</p>}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={newUserEmail}
                      onChange={(e) => setNewUserEmail(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900"
                      placeholder="user@email.com"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                    <input
                      type="password"
                      value={newUserPassword}
                      onChange={(e) => setNewUserPassword(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900"
                      placeholder="••••••••"
                      minLength={6}
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={addingUser}
                    className="rounded-full border border-slate-300 bg-slate-900 px-4 py-2 text-xs font-medium text-white hover:bg-slate-800 disabled:opacity-50"
                  >
                    {addingUser ? "Adding..." : "Add user"}
                  </button>
                </form>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/90 p-6 text-slate-900 shadow-xl backdrop-blur-xl">
                <h2 className="text-lg font-semibold text-slate-900 mb-4">Users ({users.length})</h2>
                <div className="mb-6">
                  <input
                    type="search"
                    value={usersSearch}
                    onChange={(e) => setUsersSearch(e.target.value)}
                    placeholder="Search by email..."
                    className="w-full max-w-md rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 bg-white"
                  />
                  {usersSearch && (
                    <p className="text-xs text-slate-500 mt-2">
                      Showing {filteredUsers.length} of {users.length}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  {filteredUsers.length === 0 ? (
                    <p className="text-sm text-slate-600">
                      {users.length === 0 ? "No users yet." : "No users match your search."}
                    </p>
                  ) : (
                    filteredUsers.map((u) => (
                      <div key={u.id} className="flex items-center justify-between py-2 border-b border-slate-200 last:border-0">
                        <div>
                          <p className="font-medium text-slate-800">{u.email}</p>
                          <p className="text-xs text-slate-500">{formatDate(u.createdAt)}</p>
                        </div>
                        <button
                          onClick={() => handleRemoveUser(u.id)}
                          className="text-xs text-red-600 hover:text-red-700 font-medium"
                        >
                          Remove
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {tab === "advisors" && (
            <div className="space-y-6">
              <div className="rounded-3xl border border-white/10 bg-white/90 p-6 text-slate-900 shadow-xl backdrop-blur-xl">
                <h2 className="text-lg font-semibold text-slate-900 mb-4">Add advisor</h2>
                <form onSubmit={handleAddAdvisor} className="space-y-4 max-w-md">
                  {advisorError && <p className="text-sm text-red-600">{advisorError}</p>}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={newAdvisorEmail}
                      onChange={(e) => setNewAdvisorEmail(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900"
                      placeholder="advisor@firm.com"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                    <input
                      type="password"
                      value={newAdvisorPassword}
                      onChange={(e) => setNewAdvisorPassword(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900"
                      placeholder="••••••••"
                      minLength={6}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Name (optional)</label>
                    <input
                      type="text"
                      value={newAdvisorName}
                      onChange={(e) => setNewAdvisorName(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900"
                      placeholder="John Smith"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Firm (optional)</label>
                    <input
                      type="text"
                      value={newAdvisorFirm}
                      onChange={(e) => setNewAdvisorFirm(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900"
                      placeholder="Firm name"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={addingAdvisor}
                    className="rounded-full border border-slate-300 bg-slate-900 px-4 py-2 text-xs font-medium text-white hover:bg-slate-800 disabled:opacity-50"
                  >
                    {addingAdvisor ? "Adding..." : "Add advisor"}
                  </button>
                </form>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/90 p-6 text-slate-900 shadow-xl backdrop-blur-xl">
                <h2 className="text-lg font-semibold text-slate-900 mb-4">Advisors ({advisors.length})</h2>
                <div className="mb-6">
                  <input
                    type="search"
                    value={advisorsSearch}
                    onChange={(e) => setAdvisorsSearch(e.target.value)}
                    placeholder="Search by email, name, or firm..."
                    className="w-full max-w-md rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 bg-white"
                  />
                  {advisorsSearch && (
                    <p className="text-xs text-slate-500 mt-2">
                      Showing {filteredAdvisors.length} of {advisors.length}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  {filteredAdvisors.length === 0 ? (
                    <p className="text-sm text-slate-600">
                      {advisors.length === 0 ? "No advisors yet." : "No advisors match your search."}
                    </p>
                  ) : (
                    filteredAdvisors.map((a) => (
                      <div key={a.id} className="flex items-center justify-between py-2 border-b border-slate-200 last:border-0">
                        <div>
                          <p className="font-medium text-slate-800">{a.email}</p>
                          {(a.name || a.firm) && (
                            <p className="text-xs text-slate-600">{[a.name, a.firm].filter(Boolean).join(" · ")}</p>
                          )}
                          <p className="text-xs text-slate-500">{formatDate(a.createdAt)}</p>
                        </div>
                        <button
                          onClick={() => handleRemoveAdvisor(a.id)}
                          className="text-xs text-red-600 hover:text-red-700 font-medium"
                        >
                          Remove
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
