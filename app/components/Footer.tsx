"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative border-t border-white/10 text-slate-200 overflow-hidden">
      {/* Base gradient background - bluish black */}
      <div className="absolute inset-0 bg-linear-to-br from-slate-900/60 via-blue-950/50 to-slate-900/60"></div>
      
      {/* Mesh gradient overlay - blue tones */}
      <div className="absolute inset-0 opacity-20" style={{
        background: `
          radial-gradient(at 0% 0%, rgba(59, 130, 246, 0.12) 0px, transparent 50%),
          radial-gradient(at 100% 0%, rgba(96, 165, 250, 0.1) 0px, transparent 50%),
          radial-gradient(at 100% 100%, rgba(37, 99, 235, 0.1) 0px, transparent 50%),
          radial-gradient(at 0% 100%, rgba(30, 64, 175, 0.08) 0px, transparent 50%)
        `
      }}></div>

      {/* Animated gradient orbs - blue tones */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-[10%] w-72 h-72 bg-blue-500/6 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }}></div>
        <div className="absolute bottom-0 right-[15%] w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '5s', animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/4 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s', animationDelay: '2s' }}></div>
        <div className="absolute bottom-1/4 left-[20%] w-64 h-64 bg-sky-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4.5s', animationDelay: '0.5s' }}></div>
      </div>

      {/* Geometric pattern overlay - more transparent */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `
          linear-gradient(30deg, transparent 40%, rgba(147, 197, 253, 0.08) 50%, transparent 60%),
          linear-gradient(-30deg, transparent 40%, rgba(147, 197, 253, 0.08) 50%, transparent 60%)
        `,
        backgroundSize: '60px 60px'
      }}></div>

      {/* Subtle dot grid pattern - more transparent */}
      <div className="absolute inset-0 opacity-[0.015]" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, rgb(147 197 253) 1px, transparent 0)`,
        backgroundSize: '32px 32px'
      }}></div>

      {/* Top gradient fade - bluish */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-linear-to-b from-transparent via-blue-950/10 to-transparent pointer-events-none"></div>
      
      {/* Bottom gradient fade - bluish black */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-linear-to-t from-slate-900/15 via-transparent to-transparent pointer-events-none"></div>

      <div className="relative mx-auto max-w-6xl px-4 py-6 md:px-6 md:py-8">
        <div className="grid gap-4 md:grid-cols-[2fr,1fr,1fr] md:gap-6 mb-6">
          {/* Brand Section */}
          <div className="space-y-2">
            <div className="group inline-flex items-center gap-2.5 transition-transform duration-300 hover:scale-105">
              <div className="relative flex h-8 w-8 items-center justify-center rounded-xl border border-white/20 bg-linear-to-br from-emerald-500/20 via-emerald-400/20 to-lime-400/20 shadow-lg transition-all duration-300 group-hover:border-emerald-500/50 group-hover:shadow-emerald-500/20">
                <div className="absolute inset-0 rounded-xl bg-linear-to-br from-emerald-500/10 to-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center gap-1">
                  <div className="h-2 w-2 rounded-full bg-linear-to-br from-emerald-400 to-teal-400 shadow-lg shadow-emerald-500/50"></div>
                  <div className="h-2.5 w-2.5 rounded-full bg-linear-to-br from-lime-400 to-emerald-300 shadow-lg shadow-lime-400/50"></div>
                </div>
              </div>
              <h4 className="text-base font-bold tracking-tight bg-linear-to-r from-white via-emerald-100 to-slate-300 bg-clip-text text-transparent">
                Advisens
              </h4>
            </div>
            
            <div className="space-y-1.5">
              <p className="max-w-md text-xs leading-relaxed text-slate-200 transition-colors duration-300">
                A decision-preparation platform for people considering financial advice in the GCC.
              </p>
              <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <div className="h-1 w-1 rounded-full bg-emerald-400/60"></div>
                  No commissions or referral fees
                </span>
                <span className="flex items-center gap-1.5">
                  <div className="h-1 w-1 rounded-full bg-emerald-400/60"></div>
                  Not a financial advisory service
                </span>
              </div>
            </div>
          </div>

          {/* Legal Links Card */}
          <div className="group relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-4 transition-all duration-300 hover:border-white/20 hover:bg-white/10">
            <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-red-500/5 via-amber-500/5 to-orange-500/5 blur-xl"></div>
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-px w-6 bg-linear-to-r from-red-500 to-amber-500"></div>
                <h5 className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-300">
                  Legal
                </h5>
              </div>
              <nav className="space-y-1.5">
                <Link href="/privacy-policy" className="group/item flex items-center gap-2.5 text-sm text-slate-300 transition-all duration-200 hover:text-white hover:translate-x-1">
                  <div className="relative">
                    <div className="absolute inset-0 bg-linear-to-br from-red-500 to-amber-500 rounded-full blur-sm opacity-0 group-hover/item:opacity-60 transition-opacity duration-300"></div>
                    <div className="relative h-1.5 w-1.5 rounded-full bg-linear-to-br from-red-500 to-amber-500 shadow-sm transition-all duration-300 group-hover/item:scale-150"></div>
                  </div>
                  Privacy Policy
                </Link>
                <Link href="/terms-of-use" className="group/item flex items-center gap-2.5 text-sm text-slate-300 transition-all duration-200 hover:text-white hover:translate-x-1">
                  <div className="relative">
                    <div className="absolute inset-0 bg-linear-to-br from-red-500 to-amber-500 rounded-full blur-sm opacity-0 group-hover/item:opacity-60 transition-opacity duration-300"></div>
                    <div className="relative h-1.5 w-1.5 rounded-full bg-linear-to-br from-red-500 to-amber-500 shadow-sm transition-all duration-300 group-hover/item:scale-150"></div>
                  </div>
                  Terms of Use
                </Link>
                <Link href="/data-anonymity" className="group/item flex items-center gap-2.5 text-sm text-slate-300 transition-all duration-200 hover:text-white hover:translate-x-1">
                  <div className="relative">
                    <div className="absolute inset-0 bg-linear-to-br from-red-500 to-amber-500 rounded-full blur-sm opacity-0 group-hover/item:opacity-60 transition-opacity duration-300"></div>
                    <div className="relative h-1.5 w-1.5 rounded-full bg-linear-to-br from-red-500 to-amber-500 shadow-sm transition-all duration-300 group-hover/item:scale-150"></div>
                  </div>
                  Data & Anonymity
                </Link>
              </nav>
            </div>
          </div>

          {/* Access Links Card */}
          <div className="group relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-4 transition-all duration-300 hover:border-white/20 hover:bg-white/10">
            <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-blue-500/5 via-cyan-500/5 to-teal-500/5 blur-xl"></div>
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-px w-6 bg-linear-to-r from-blue-500 to-cyan-500"></div>
                <h5 className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-300">
                  Access
                </h5>
              </div>
              <div className="space-y-1.5">
                <p className="text-xs text-slate-300 mb-1.5 leading-relaxed">
                  Users can submit cases anonymously.
                </p>
                <Link href="/user-login" className="group/item flex items-center gap-2.5 text-sm text-slate-300 transition-all duration-200 hover:text-white hover:translate-x-1">
                  <div className="relative">
                    <div className="absolute inset-0 bg-linear-to-br from-blue-500 to-cyan-500 rounded-full blur-sm opacity-0 group-hover/item:opacity-60 transition-opacity duration-300"></div>
                    <div className="relative h-1.5 w-1.5 rounded-full bg-linear-to-br from-blue-500 to-cyan-500 shadow-sm transition-all duration-300 group-hover/item:scale-150"></div>
                  </div>
                  User login (optional)
                </Link>
                <Link href="/advisor-login" className="group/item flex items-center gap-2.5 text-sm text-slate-300 transition-all duration-200 hover:text-white hover:translate-x-1">
                  <div className="relative">
                    <div className="absolute inset-0 bg-linear-to-br from-blue-500 to-cyan-500 rounded-full blur-sm opacity-0 group-hover/item:opacity-60 transition-opacity duration-300"></div>
                    <div className="relative h-1.5 w-1.5 rounded-full bg-linear-to-br from-blue-500 to-cyan-500 shadow-sm transition-all duration-300 group-hover/item:scale-150"></div>
                  </div>
                  Advisor login (approved advisors only)
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="relative flex flex-col gap-2 border-t border-white/10 pt-4 text-xs md:flex-row md:items-center md:justify-between">
          {/* Gradient line on top */}
          <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-emerald-500/40 via-teal-500/40 to-transparent"></div>

          <div className="flex items-center gap-2 text-slate-300">
            <span>© {new Date().getFullYear()} Advisens</span>
            <div className="h-1 w-1 rounded-full bg-slate-500"></div>
            <span className="text-slate-400">All rights reserved</span>
          </div>

          <div className="flex items-center gap-2 text-slate-300">
            <span className="hidden md:inline font-medium">Built for clarity, not hype</span>
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-500/50 animate-pulse"></div>
          </div>
        </div>
      </div>
    </footer>
  );
}


