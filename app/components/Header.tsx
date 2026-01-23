"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface HeaderProps {
  onNavClick: (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => void;
  onSubmitCase: () => void;
}

export default function Header({ onNavClick, onSubmitCase }: HeaderProps) {
  return (
    <header className="relative z-50 pt-6 pb-4 px-4 md:px-6">
      <nav className="relative mx-auto flex max-w-6xl items-center justify-between rounded-2xl border border-white/10 bg-linear-to-r from-black/20 via-black/30 to-black/20 px-6 py-3.5 shadow-xl shadow-black/20 backdrop-blur-lg md:px-8">
        {/* Subtle dot pattern overlay */}
        <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '12px 12px' }} />
        
        {/* Logo */}
        <Link href="/" className="relative z-10 flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-linear-to-br from-emerald-500 via-emerald-400 to-lime-400 shadow-md shadow-emerald-200" />
          <span className="text-lg font-semibold tracking-tight text-white">
            Advisens
          </span>
        </Link>

        {/* Centered Navigation Links */}
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

        {/* CTA Button */}
        <button 
          onClick={onSubmitCase}
          className="relative z-10 rounded-lg bg-white/95 px-5 py-2 text-sm font-semibold text-slate-900 shadow-md shadow-black/30 transition-all hover:-translate-y-0.5 hover:bg-white hover:shadow-lg cursor-pointer"
        >
          Submit a Case
        </button>
      </nav>
    </header>
  );
}


