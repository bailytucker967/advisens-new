"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";

interface HeaderProps {
  onNavClick: (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => void;
  onSubmitCase: () => void;
}

export default function Header({ onNavClick, onSubmitCase }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNavClose = () => setMobileOpen(false);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <header className="relative z-50 pt-6 pb-4 px-4 md:px-6">
      <nav className="relative mx-auto flex max-w-6xl items-center justify-between gap-2 rounded-2xl border border-white/10 bg-linear-to-r from-black/20 via-black/30 to-black/20 px-3 py-3 sm:px-4 md:px-8 shadow-xl shadow-black/20 backdrop-blur-lg min-w-0">
        {/* Subtle dot pattern overlay */}
        <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '12px 12px' }} />
        
        {/* Logo */}
        <Link href="/" className="relative z-10 flex items-center gap-2.5 shrink-0 min-w-0">
          <div className="h-8 w-8 shrink-0 rounded-lg bg-linear-to-br from-emerald-500 via-emerald-400 to-lime-400 shadow-md shadow-emerald-200" />
          <span className="text-base sm:text-lg font-semibold tracking-tight text-white truncate">
            Advisens
          </span>
        </Link>

        {/* Desktop: Centered Navigation Links */}
        <div className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-1 text-sm text-white/90 md:flex">
          <a 
            href="#home" 
            onClick={(e) => onNavClick(e, 'home')}
            className="rounded-lg px-3 py-1.5 font-medium transition-colors hover:bg-white/20 hover:text-white"
          >
            Home
          </a>
          <span className="h-1 w-1 rounded-full bg-white/40" />
          <Link 
            href="/how-it-works"
            className="rounded-lg px-3 py-1.5 font-medium transition-colors hover:bg-white/20 hover:text-white"
          >
            How it works
          </Link>
          <span className="h-1 w-1 rounded-full bg-white/40" />
          <Link 
            href="/principles"
            className="rounded-lg px-3 py-1.5 font-medium transition-colors hover:bg-white/20 hover:text-white"
          >
            Principles
          </Link>
          <span className="h-1 w-1 rounded-full bg-white/40" />
          <Link 
            href="/before-you-begin"
            className="rounded-lg px-3 py-1.5 font-medium transition-colors hover:bg-white/20 hover:text-white"
          >
            Before you begin
          </Link>
        </div>

        {/* Desktop CTA + Mobile: Hamburger and CTA */}
        <div className="relative z-10 flex items-center gap-2">
          <button 
            onClick={onSubmitCase}
            className="rounded-lg bg-white/95 px-3 py-2 sm:px-4 md:px-5 text-xs sm:text-sm font-semibold text-slate-900 shadow-md shadow-black/30 transition-all hover:-translate-y-0.5 hover:bg-white hover:shadow-lg cursor-pointer shrink-0"
          >
            Submit a Case
          </button>

          {/* Mobile menu toggle - professional hamburger / close */}
          <button
            onClick={() => setMobileOpen((o) => !o)}
            className="md:hidden flex flex-col justify-center items-center w-10 h-10 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 transition-colors"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            <span className={`block w-5 h-0.5 bg-white rounded-full transition-all duration-200 ${mobileOpen ? "rotate-45 translate-y-1.5" : ""}`} />
            <span className={`block w-5 h-0.5 bg-white rounded-full my-1 transition-all duration-200 ${mobileOpen ? "opacity-0 scale-0" : ""}`} />
            <span className={`block w-5 h-0.5 bg-white rounded-full transition-all duration-200 ${mobileOpen ? "-rotate-45 -translate-y-1.5" : ""}`} />
          </button>
        </div>

        {/* Mobile menu - full-screen overlay, rendered via portal so it sits above all content */}
        {mobileOpen && typeof document !== "undefined" && createPortal(
          <div
            className="fixed inset-0 z-[9999] md:hidden flex flex-col animate-[mobile-menu-backdrop_0.2s_ease-out_forwards]"
            role="dialog"
            aria-label="Navigation menu"
            style={{ 
              backgroundColor: "rgba(15, 23, 42, 0.98)", 
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)"
            }}
          >
            {/* Header: Logo left, Close (X) right */}
            <div className="flex items-center justify-between px-4 py-5 border-b border-white/10">
              <Link href="/" onClick={handleNavClose} className="flex items-center gap-2.5">
                <div className="h-8 w-8 shrink-0 rounded-lg bg-linear-to-br from-emerald-500 via-emerald-400 to-lime-400 shadow-md shadow-emerald-200/30" />
                <span className="text-lg font-semibold tracking-tight text-white">Advisens</span>
              </Link>
              <button
                onClick={handleNavClose}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 bg-white/5 text-white/90 hover:bg-white/10 transition-colors"
                aria-label="Close menu"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            {/* Main nav: prominent stacked links */}
            <nav className="flex-1 flex flex-col justify-center px-6 py-8">
              <div className="flex flex-col gap-1">
                <a 
                  href="#home" 
                  onClick={(e) => { onNavClick(e, 'home'); handleNavClose(); }}
                  className="block py-4 text-xl font-semibold text-white hover:text-emerald-400 transition-colors border-b border-white/5"
                >
                  Home
                </a>
                <Link 
                  href="/how-it-works"
                  onClick={handleNavClose}
                  className="block py-4 text-xl font-semibold text-white hover:text-emerald-400 transition-colors border-b border-white/5"
                >
                  How it works
                </Link>
                <Link 
                  href="/principles"
                  onClick={handleNavClose}
                  className="block py-4 text-xl font-semibold text-white hover:text-emerald-400 transition-colors border-b border-white/5"
                >
                  Principles
                </Link>
                <Link 
                  href="/before-you-begin"
                  onClick={handleNavClose}
                  className="block py-4 text-xl font-semibold text-white hover:text-emerald-400 transition-colors border-b border-white/5"
                >
                  Before you begin
                </Link>
              </div>
            </nav>

            {/* Separator */}
            <div className="h-px bg-linear-to-r from-transparent via-white/20 to-transparent mx-4" />

            {/* Bottom: CTA */}
            <div className="px-6 py-6">
              <button 
                onClick={() => { onSubmitCase(); handleNavClose(); }}
                className="w-full rounded-full bg-white/95 px-6 py-4 text-base font-semibold text-slate-900 shadow-lg hover:bg-white transition-colors flex items-center justify-center gap-2"
              >
                <span>Submit a Case</span>
                <span className="text-emerald-600">→</span>
              </button>
            </div>
          </div>,
          document.body
        )}
      </nav>
    </header>
  );
}


