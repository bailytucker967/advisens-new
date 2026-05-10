"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Image from "next/image";

interface HeaderProps {
  onNavClick: (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => void;
  onSubmitCase: () => void;
}

export default function Header({ onNavClick, onSubmitCase }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { label: "Home", href: "#home", isAnchor: true, targetId: "home" },
    { label: "How it works", href: "/how-it-works" },
    { label: "Principles", href: "/principles" },
    { label: "Before you begin", href: "/before-you-begin" },
    { label: "For advisors", href: "/for-advisors" },
    { label: "Insights", href: "/insights" },
  ];

  return (
    <header className="relative z-50 pt-5 pb-4 px-4 md:px-6">
      <nav
        className={`relative mx-auto flex max-w-6xl items-center justify-between gap-2 rounded-2xl border px-3 py-2.5 sm:px-4 md:px-6 shadow-2xl shadow-black/30 backdrop-blur-xl transition-all duration-300 min-w-0 ${
          scrolled
            ? "border-white/15 bg-black/50"
            : "border-white/8 bg-gradient-to-r from-black/10 via-black/25 to-black/10"
        }`}
      >
        {/* Subtle inner glow top */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px rounded-t-2xl bg-gradient-to-r from-transparent via-white/20 to-transparent" />

        {/* Logo */}
        <Link href="/" className="relative z-10 flex items-center gap-2.5 shrink-0 min-w-0 group">
          <div className="relative h-9 w-9 shrink-0 rounded-xl overflow-hidden shadow-lg shadow-emerald-900/40 ring-1 ring-white/10 transition-all duration-200 group-hover:ring-emerald-400/40 group-hover:shadow-emerald-600/30">
            <Image
              src="/advisenslogo.jpeg"
              alt="Advisens logo"
              fill
              className="object-cover"
              priority
            />
          </div>
          <span className="text-base sm:text-lg font-semibold tracking-tight text-white truncate transition-colors group-hover:text-emerald-300">
            Advisens
          </span>
        </Link>

        {/* Desktop: Centered Navigation Links */}
        <div className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-0.5 text-sm text-white/80 md:flex">
          {navLinks.map((link, i) => (
            <React.Fragment key={link.label}>
              {i > 0 && (
                <span className="h-1 w-1 rounded-full bg-white/25 mx-1" />
              )}
              {link.isAnchor ? (
                <a
                  href={link.href}
                  onClick={(e) => onNavClick(e, link.targetId!)}
                  className="relative rounded-lg px-3 py-1.5 font-medium transition-all duration-150 hover:text-white hover:bg-white/10 active:bg-white/15"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  href={link.href}
                  className="relative rounded-lg px-3 py-1.5 font-medium transition-all duration-150 hover:text-white hover:bg-white/10 active:bg-white/15"
                >
                  {link.label}
                </Link>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Desktop CTA + Mobile hamburger */}
        <div className="relative z-10 flex items-center gap-2.5">
          <button
            onClick={onSubmitCase}
            className="group relative rounded-xl overflow-hidden px-4 py-2 sm:px-5 text-xs sm:text-sm font-semibold text-slate-900 shadow-md shadow-black/30 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-emerald-900/20 cursor-pointer shrink-0"
            style={{
              background: "linear-gradient(135deg, #ffffff 0%, #f0fdf4 50%, #d1fae5 100%)",
            }}
          >
            <span className="relative z-10">Submit a Case</span>
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              style={{ background: "linear-gradient(135deg, #ffffff 0%, #ecfdf5 50%, #a7f3d0 100%)" }}
            />
          </button>

          {/* Mobile hamburger */}
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

        {/* Mobile full-screen overlay */}
        {mobileOpen && typeof document !== "undefined" && createPortal(
          <div
            className="fixed inset-0 z-[9999] md:hidden flex flex-col"
            role="dialog"
            aria-label="Navigation menu"
            style={{
              backgroundColor: "rgba(10, 18, 35, 0.98)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
            }}
          >
            {/* Top gradient accent */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-5 border-b border-white/8">
              <Link href="/" onClick={handleNavClose} className="flex items-center gap-2.5">
                <div className="relative h-9 w-9 shrink-0 rounded-xl overflow-hidden ring-1 ring-white/10">
                  <Image
                    src="/advisenslogo.jpeg"
                    alt="Advisens logo"
                    fill
                    className="object-cover"
                  />
                </div>
                <span className="text-lg font-semibold tracking-tight text-white">Advisens</span>
              </Link>
              <button
                onClick={handleNavClose}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-white/5 text-white/80 hover:bg-white/10 hover:text-white transition-colors"
                aria-label="Close menu"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Nav links */}
            <nav className="flex-1 flex flex-col justify-center px-6 py-8">
              <div className="flex flex-col">
                {navLinks.map((link) => (
                  link.isAnchor ? (
                    <a
                      key={link.label}
                      href={link.href}
                      onClick={(e) => { onNavClick(e, link.targetId!); handleNavClose(); }}
                      className="flex items-center justify-between py-4 text-xl font-semibold text-white/80 hover:text-white transition-colors border-b border-white/6 group"
                    >
                      <span>{link.label}</span>
                      <span className="text-white/20 group-hover:text-emerald-400 transition-colors text-lg">→</span>
                    </a>
                  ) : (
                    <Link
                      key={link.label}
                      href={link.href}
                      onClick={handleNavClose}
                      className="flex items-center justify-between py-4 text-xl font-semibold text-white/80 hover:text-white transition-colors border-b border-white/6 group"
                    >
                      <span>{link.label}</span>
                      <span className="text-white/20 group-hover:text-emerald-400 transition-colors text-lg">→</span>
                    </Link>
                  )
                ))}
              </div>
            </nav>

            {/* Bottom CTA */}
            <div className="px-6 pb-8 pt-4">
              <div className="h-px bg-gradient-to-r from-transparent via-white/15 to-transparent mb-6" />
              <button
                onClick={() => { onSubmitCase(); handleNavClose(); }}
                className="w-full rounded-2xl py-4 text-base font-semibold text-slate-900 shadow-lg transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2"
                style={{ background: "linear-gradient(135deg, #ffffff 0%, #d1fae5 100%)" }}
              >
                <span>Submit a Case</span>
                <span className="text-emerald-600 text-lg">→</span>
              </button>
            </div>
          </div>,
          document.body
        )}
      </nav>
    </header>
  );
}
