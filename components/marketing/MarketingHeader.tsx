"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Wordmark } from "./ui";

const NAV = [
  { href: "/demo", label: "Live demo" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/use-cases", label: "Use cases" },
  { href: "/why", label: "Why TWI Report Generator" },
];

export function MarketingHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [pathname]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-espresso/90 backdrop-blur-md border-b border-cream/[0.08] py-3"
          : "bg-transparent py-5",
      )}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 md:px-8">
        <Wordmark tone="dark" />

        <div className="hidden items-center gap-7 lg:flex">
          {NAV.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative text-[13px] transition-colors duration-150",
                  active ? "text-gold-soft" : "text-cream/70 hover:text-cream",
                )}
              >
                {item.label}
                {active && (
                  <span className="absolute -bottom-1.5 left-0 h-px w-full bg-gold" />
                )}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="hidden rounded-full bg-gold px-4 py-2 text-xs font-semibold text-espresso transition-all hover:bg-gold-bright hover:shadow-[var(--shadow-gold)] sm:inline-block"
          >
            Log in
          </Link>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="text-cream lg:hidden"
            aria-label="Menu"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="mt-3 border-t border-cream/[0.08] bg-espresso/95 px-4 py-4 backdrop-blur-md lg:hidden">
          <div className="mx-auto flex max-w-6xl flex-col gap-1">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-md px-2 py-2.5 text-sm text-cream/80 hover:bg-cream/[0.05] hover:text-cream"
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-2 flex gap-3 border-t border-cream/[0.08] pt-3">
              <Link
                href="/login"
                className="ml-auto rounded-full bg-gold px-4 py-2 text-xs font-semibold text-espresso"
              >
                Log in
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
