import Link from "next/link";
import { Wordmark } from "./ui";

const COLS = [
  {
    title: "Product",
    links: [
      { href: "/demo", label: "Live demo" },
      { href: "/how-it-works", label: "How it works" },
      { href: "/use-cases", label: "Use cases" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/why", label: "Why TWI Report Generator" },
      { href: "/login", label: "Log in" },
    ],
  },
  {
    title: "Trust",
    links: [
      { href: "/why", label: "Security & data" },
      { href: "/why", label: "Built in-house" },
    ],
  },
];

export function MarketingFooter() {
  return (
    <footer className="bg-espresso text-cream">
      <div className="mx-auto max-w-6xl px-4 py-16 md:px-8">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <Wordmark tone="dark" />
            <p className="mt-4 max-w-xs text-[13px] leading-relaxed text-cream/55">
              The in-house report engine for Titan Wealth advisers. It turns a
              client meeting into a finished, on-brand report in minutes.
            </p>
          </div>
          {COLS.map((col) => (
            <div key={col.title}>
              <h4 className="text-[11px] font-medium uppercase tracking-[0.18em] text-gold-soft/70">
                {col.title}
              </h4>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-[13px] text-cream/60 transition-colors hover:text-cream"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-cream/[0.08] pt-6 text-[12px] text-cream/40 sm:flex-row sm:items-center">
          <span>© {new Date().getFullYear()} Titan Wealth International. All rights reserved.</span>
          <div className="flex items-center gap-5">
            <span>Your data stays inside Titan</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
