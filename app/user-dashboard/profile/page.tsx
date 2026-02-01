"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authAPI } from "@/lib/api-client";

export default function UserProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<{ id: string; email: string; role: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const data = await authAPI.getCurrentUser() as { user?: { id: string; email: string; role: string } };
        if (!mounted) return;
        if (!data.user) {
          router.push("/user-login");
          return;
        }
        setUser(data.user);
      } catch {
        if (mounted) router.push("/user-login");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, [router]);

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

          <div className="rounded-3xl border border-white/10 bg-white/90 p-6 text-slate-900 shadow-xl backdrop-blur-xl md:p-8">
            <h1 className="text-2xl font-semibold text-slate-900 mb-6">Your profile</h1>

            <div className="space-y-6">
              <div>
                <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Email</label>
                <p className="text-sm font-medium text-slate-800">{user.email}</p>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Account type</label>
                <p className="text-sm font-medium text-slate-800 capitalize">{user.role}</p>
              </div>

              <p className="text-xs text-slate-500 mt-6">
                Your case submissions remain anonymous. Advisors only see your case details unless you choose to reveal your profile.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
