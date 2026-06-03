import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

/** Small uppercase tracked label with a gold tick. */
export function Eyebrow({
  children,
  tone = "dark",
  className,
}: {
  children: React.ReactNode;
  tone?: "dark" | "light";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em]",
        tone === "dark" ? "text-gold-soft/80" : "text-gold-600",
        className,
      )}
    >
      <span className="h-1 w-1 rounded-full bg-gold" />
      {children}
    </div>
  );
}

/** Section number label, e.g. "01 — WORKFLOW". */
export function SectionLabel({
  index,
  children,
  tone = "light",
}: {
  index: string;
  children: React.ReactNode;
  tone?: "dark" | "light";
}) {
  return (
    <div
      className={cn(
        "text-[11px] font-mono uppercase tracking-[0.2em]",
        tone === "dark" ? "text-gold-soft/70" : "text-mahogany-500",
      )}
    >
      <span className="text-gold">{index}</span> — {children}
    </div>
  );
}

type CTAProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
  external?: boolean;
};

/** Primary gold CTA. */
export function PrimaryCTA({ href, children, className }: CTAProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex items-center justify-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-semibold text-espresso transition-all duration-200 hover:bg-gold-bright hover:shadow-[var(--shadow-gold)] hover:-translate-y-0.5",
        className,
      )}
    >
      {children}
    </Link>
  );
}

/** Secondary outline CTA — adapts to dark/light context. */
export function SecondaryCTA({
  href,
  children,
  className,
  tone = "light",
}: CTAProps & { tone?: "dark" | "light" }) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-all duration-200 border",
        tone === "dark"
          ? "border-cream/20 bg-cream/[0.04] text-cream hover:bg-cream/10"
          : "border-mahogany/20 bg-transparent text-mahogany hover:bg-mahogany/[0.05]",
        className,
      )}
    >
      {children}
    </Link>
  );
}

export function ArrowRight({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={cn("h-4 w-4", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14M13 5l7 7-7 7" />
    </svg>
  );
}

/** Brand wordmark — the official Titan Wealth International logo plus the
 *  "Report Generator" product descriptor. */
export function Wordmark({ tone = "dark" }: { tone?: "dark" | "light" }) {
  return (
    <Link href="/" className="flex items-center gap-3">
      <Image
        src={tone === "dark" ? "/brand/twi-logo-white.png" : "/brand/twi-logo.png"}
        alt="Titan Wealth International"
        width={170}
        height={50}
        priority
        className="h-7 w-auto"
      />
      <span
        className={cn(
          "hidden border-l pl-3 font-mono text-[9px] uppercase tracking-[0.18em] sm:inline-block",
          tone === "dark" ? "border-white/20 text-white/55" : "border-mahogany/20 text-mahogany-400",
        )}
      >
        Report Generator
      </span>
    </Link>
  );
}
