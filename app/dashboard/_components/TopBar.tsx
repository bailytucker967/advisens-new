"use client";

import { useState, useRef, useEffect } from "react";
import { LogOut, ChevronDown } from "lucide-react";

export function TopBar({
  email,
  displayName,
  firmName,
}: {
  email: string;
  displayName: string;
  firmName: string | null;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const initial = (displayName || email || "?").trim().charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-30 border-b border-mahogany/10 bg-cream/85 backdrop-blur-md">
      <div className="flex h-14 items-center justify-between px-6 md:px-10">
        <div className="lg:hidden">
          <span className="font-display text-[16px] font-medium tracking-tight text-mahogany">
            TWI Report Generator
          </span>
        </div>
        <div className="flex-1 lg:flex-none" />

        <div ref={ref} className="relative">
          <button
            onClick={() => setOpen((v) => !v)}
            className="flex items-center gap-2.5 rounded-md px-2 py-1 transition-colors hover:bg-mahogany/[0.05]"
          >
            <div className="grid h-7 w-7 place-items-center rounded-full border border-gold/40 bg-gold-soft/40 text-[11px] font-semibold text-gold-600">
              {initial}
            </div>
            <div className="hidden text-left leading-tight sm:block">
              <div className="text-[12px] text-mahogany">{displayName}</div>
              {firmName && (
                <div className="text-[10px] text-mahogany-400">{firmName}</div>
              )}
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-mahogany-400" />
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-60 overflow-hidden rounded-md border border-mahogany/10 bg-cream-50 shadow-[var(--shadow-warm-lg)]">
              <div className="border-b border-mahogany/10 px-3 py-2.5">
                <div className="truncate text-[12px] text-mahogany">
                  {displayName}
                </div>
                <div className="truncate text-[11px] text-mahogany-400">
                  {email}
                </div>
              </div>
              <form action="/auth/signout" method="post">
                <button
                  type="submit"
                  className="flex w-full items-center gap-2 px-3 py-2.5 text-[13px] text-mahogany-500 transition-colors hover:bg-mahogany/[0.04] hover:text-mahogany"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Sign out
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
