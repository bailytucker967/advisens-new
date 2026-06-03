import Link from "next/link";
import { PageHeader } from "../_components/PageHeader";
import { REPORT_TYPES, REPORT_START, REPORT_END } from "@/lib/titan-library";

export const metadata = { title: "Templates · TWI Report Generator" };

export default function TemplatesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Templates"
        title="Report templates"
        description="Open a report type to see exactly how it's built — the fixed pages, the Titan products that slot in, and how the agent assembles it from your notes. Then build one straight from here."
      />

      <div className="grid gap-4 sm:grid-cols-2">
        {REPORT_TYPES.map((t) => (
          <Link
            key={t.id}
            href={
              t.id === "introductory_pitch"
                ? "/dashboard/introductions"
                : `/dashboard/templates/${t.id}`
            }
            className="rounded-xl border border-mahogany/10 bg-cream-50 p-6 transition-colors hover:border-gold/40"
          >
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-display text-[17px] text-mahogany">{t.label}</h3>
              <span className="text-mahogany-400">→</span>
            </div>
            <p className="mt-2 text-[13px] leading-relaxed text-mahogany-500">
              {t.description}
            </p>
            <div className="mt-4 text-[11px] text-mahogany-400">
              {REPORT_START.length} fixed opening pages · product slides ·{" "}
              {REPORT_END.length} fixed closing pages
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
