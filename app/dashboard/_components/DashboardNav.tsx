"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Users,
  LayoutTemplate,
  Boxes,
  UserCircle,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

type NavItem = {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  exact?: boolean;
};

const NAV: NavItem[] = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/reports", label: "Reports", icon: FileText },
  { href: "/dashboard/clients", label: "Clients", icon: Users },
  { href: "/dashboard/templates", label: "Templates", icon: LayoutTemplate },
  { href: "/dashboard/solutions", label: "Solutions", icon: Boxes },
  { href: "/dashboard/profile", label: "Profile", icon: UserCircle },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r border-cream/[0.08] bg-espresso lg:flex">
      {/* faded warm wash + grain */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, #1f1340 0%, #1b1233 50%, #150a30 100%)",
        }}
      />
      <div className="paper-grain pointer-events-none absolute inset-0 opacity-40" />

      <div className="relative px-6 pb-8 pt-6">
        <Link href="/" className="flex flex-col items-start gap-1.5">
          <Image
            src="/brand/twi-logo-white.png"
            alt="Titan Wealth International"
            width={170}
            height={50}
            priority
            className="h-7 w-auto"
          />
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-cream/50">
            Report Generator
          </span>
        </Link>
      </div>

      <nav className="relative flex-1 space-y-0.5 px-3">
        {NAV.map(({ href, label, icon: Icon, exact }) => {
          const active = exact
            ? pathname === href || pathname === `${href}/`
            : pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2.5 text-[13px] transition-colors",
                active
                  ? "bg-cream/[0.06] text-gold-soft"
                  : "text-cream/55 hover:bg-cream/[0.03] hover:text-cream",
              )}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              <span>{label}</span>
              {active && (
                <span className="ml-auto h-1 w-1 rounded-full bg-gold" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="relative mt-2 border-t border-cream/[0.08] px-3 pb-6 pt-4">
        <Link
          href="/dashboard/reports/new"
          className="flex items-center justify-center gap-2 rounded-full bg-gold px-3 py-2.5 text-[13px] font-semibold text-espresso shadow-[var(--shadow-gold)] transition-all hover:-translate-y-0.5 hover:bg-gold-bright"
        >
          + New report
        </Link>
      </div>
    </aside>
  );
}
