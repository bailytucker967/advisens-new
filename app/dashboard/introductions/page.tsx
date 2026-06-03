import Link from "next/link";
import { Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "../_components/PageHeader";
import { Button } from "@/components/ui/Button";
import { INTRO_PIECES } from "@/lib/titan-library";

export const metadata = { title: "Introductions · TWI Report Generator" };

// A joined relation comes back as object or array depending on FK detection.
function clientName(c: unknown): string {
  const o = Array.isArray(c) ? c[0] : c;
  return (o as { full_name?: string } | null)?.full_name ?? "Unassigned";
}

export default async function IntroductionsPage() {
  const supabase = await createClient();
  const { data: intros } = await supabase
    .from("reports")
    .select("id, title, status, updated_at, clients(full_name)")
    .eq("report_type", "introductory_pitch")
    .order("updated_at", { ascending: false });

  const recent = intros ?? [];

  return (
    <>
      <Link
        href="/dashboard/templates"
        className="mb-4 inline-block text-[12px] text-mahogany-400 transition-colors hover:text-mahogany"
      >
        Back to templates
      </Link>
      <PageHeader
        eyebrow="Templates · Introductions"
        title="Introduction templates"
        description="The pieces used in a first meeting. A new report assembles the right ones and tailors each to the client before you walk in."
        actions={
          <Button asChild>
            <Link href="/dashboard/reports/new">+ New report</Link>
          </Button>
        }
      />

      {/* The intro-template library (building blocks) */}
      <div className="grid gap-4 sm:grid-cols-2">
        {INTRO_PIECES.map((p) => (
          <div
            key={p.id}
            className="rounded-xl border border-mahogany/10 bg-cream-50 p-5"
          >
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-display text-[16px] text-mahogany">{p.title}</h3>
              {p.alwaysOn && (
                <span className="rounded-full bg-gold/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-gold-600">
                  Always
                </span>
              )}
            </div>
            <p className="mt-2 text-[13px] leading-relaxed text-mahogany-500">
              {p.summary}
            </p>
            <div className="mt-3 flex items-center justify-between text-[11px] text-mahogany-400">
              <span>{p.relevance}</span>
              <span className="font-mono">deck p{p.deckPages}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Generated introductions */}
      <h2 className="mt-10 mb-3 text-[13px] font-semibold uppercase tracking-[0.14em] text-mahogany-400">
        Recent introductions
      </h2>
      {recent.length > 0 ? (
        <div className="space-y-2">
          {recent.map((r) => (
            <Link
              key={r.id}
              href={`/dashboard/reports/${r.id}`}
              className="flex items-center gap-3 rounded-xl border border-mahogany/10 bg-cream-50 p-4 transition-colors hover:border-gold/40"
            >
              <Sparkles className="h-4 w-4 flex-shrink-0 text-gold-600" />
              <div className="min-w-0 flex-1">
                <div className="truncate text-[14px] font-medium text-mahogany">
                  {r.title}
                </div>
                <div className="text-[12px] text-mahogany-400">
                  {clientName(r.clients)} · {r.status}
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-mahogany/10 bg-cream-50 p-8 text-center text-[13px] text-mahogany-500">
          No introductions generated yet. Start a new engagement to draft one.
        </div>
      )}
    </>
  );
}
