"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authAPI } from "@/lib/api-client";

export default function UserLoginPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    
    if (loading) {
      e.preventDefault();
      return false;
    }
    
    setError("");
    
    if (!formData.email || !formData.password) {
      setError("Please enters both email and password");
      return false;
    }
    
    setLoading(true);

    try {
      await authAPI.userLogin(formData.email, formData.password);
      
      // Success - redirect immediately (cookie is set in response)
      window.location.href = "/user-dashboard";
      return false; // Prevent any form submission
    } catch (err: any) {
      setError(err.message || "Invalid email or password");
      setLoading(false);
      return false;
    }
  };

  return (
    <div className="min-h-screen text-slate-900 flex flex-col relative">
      {/* Global background (same as home screen) */}
      <div
        className="fixed inset-0 -z-30 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/web%20background.jpeg')" }}
      />
      {/* Darken/soften overlay for readability */}
      <div className="fixed inset-0 -z-20 bg-linear-to-b from-black/35 via-black/20 to-black/10" />

      <div className="relative z-10">
        <section className="container mx-auto px-4 sm:px-6 py-12 sm:py-24 max-w-[1100px]">
          <div className="max-w-md mx-auto space-y-8">
            {/* Header */}
            <div className="text-center space-y-4">
              <Link href="/" className="text-slate-200 hover:text-white text-sm transition-colors inline-block mb-4">
                ← Back to home
              </Link>
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                User Login
              </h1>
              <p className="leading-relaxed font-medium text-slate-200">
                Access submitted cases and review advisor responses.
              </p>
            </div>

            {/* Notice */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6">
              <p className="text-sm leading-relaxed font-medium text-slate-200">
                Your privacy is protected. Your email and password are not shared with
                advisors. Case submissions remain anonymous unless you choose to reveal
                your identity.
              </p>
            </div>

            {/* Error message */}
            {error && (
              <div className="bg-red-500/20 backdrop-blur-md rounded-2xl border border-red-400/40 p-4">
                <p className="text-sm text-red-200">{error}</p>
              </div>
            )}

            {/* Form */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6 sm:p-8">
              <form 
                onSubmit={handleSubmit} 
                className="space-y-6" 
                noValidate
              >
                <div className="space-y-3">
                  <label htmlFor="email" className="text-sm font-medium block text-white">
                    Email address
                  </label>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@email.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, email: e.target.value }))
                    }
                    className="w-full rounded-lg border border-white/20 bg-white/95 backdrop-blur-sm px-4 py-3 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400"
                    required
                    suppressHydrationWarning
                  />
                </div>

                <div className="space-y-3">
                  <label htmlFor="password" className="text-sm font-medium block text-white">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, password: e.target.value }))
                    }
                    className="w-full rounded-lg border border-white/20 bg-white/95 backdrop-blur-sm px-4 py-3 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400"
                    required
                    suppressHydrationWarning
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || !formData.email || !formData.password}
                  className="w-full rounded-full bg-white/95 px-6 py-3 text-sm font-semibold text-slate-900 shadow-lg shadow-black/30 transition-all hover:-translate-y-0.5 hover:bg-white hover:shadow-xl cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  suppressHydrationWarning
                >
                  {loading ? "Logging in..." : "Log In"}
                </button>

                {/* Links */}
                <div className="text-center space-y-3 pt-4">
                  <button
                    type="button"
                    className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
                    onClick={(e) => {
                      e.preventDefault();
                      alert("Forgot password flow coming soon.");
                    }}
                    suppressHydrationWarning
                  >
                    Forgot password?
                  </button>

                  <div>
                    <Link
                      href="/submit"
                      className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
                    >
                      New here? Submit a case anonymously
                    </Link>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}


