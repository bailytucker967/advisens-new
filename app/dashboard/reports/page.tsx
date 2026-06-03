import Link from "next/link";
import { FileText } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { reportTypeLabel } from "@/lib/report-types";
import { PageHeader, Card, EmptyState } from "../_components/PageHeader";
import { Button } from "@/components/ui/Button";

export default async function ReportsListPage() {
  const supabase = await createClient();
  const { data: reports } = await supabase
    .from("reports")
    .select("id, title, report_type, status, updated_at, client_id, clients(full_name)")
    .order("updated_at", { ascending: false });

  return (
    <>
      <PageHeader
        eyebrow="Reports"
        title="All reports"
        description="Drafts in progress, reports under review, and locked-in reports ready to send."
        actions={
          <Button asChild>
            <Link href="/dashboard/reports/new">+ New report</Link>
          </Button>
        }
      />

      {reports && reports.length > 0 ? (
        <Card className="p-0 overflow-hidden">
          <ul className="divide-y divide-mahogany/10">
            {reports.map((r) => (
              <li key={r.id}>
                <Link
                  href={`/dashboard/reports/${r.id}`}
                  className="flex items-center justify-between px-5 py-4 hover:bg-mahogany/[0.03]"
                >
                  <div className="min-w-0 flex items-center gap-3">
                    <FileText className="h-4 w-4 text-mahogany-400 flex-shrink-0" />
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-mahogany truncate">
                        {r.title}
                      </div>
                      <div className="text-[11px] text-mahogany-400 mt-0.5">
                        {reportTypeLabel(r.report_type)}
                        {/* @ts-expect-error joined */}
                        {r.clients?.full_name && ` · ${r.clients.full_name}`}
                      </div>
                    </div>
                  </div>
                  <StatusPill status={r.status} />
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      ) : (
        <EmptyState
          title="No reports yet"
          description="Create your first bespoke client report — TWI Report Generator will draft it from your template and meeting notes."
          action={
            <Button asChild>
              <Link href="/dashboard/reports/new">Create report</Link>
            </Button>
          }
        />
      )}
    </>
  );
}

function StatusPill({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    draft: { label: "Draft", cls: "bg-mahogany/[0.04] text-mahogany-500 border-mahogany/10" },
    generating: {
      label: "Generating",
      cls: "bg-gold-soft/30 text-gold border-gold/30",
    },
    review: {
      label: "In review",
      cls: "bg-gold-soft/30 text-gold border-gold/30",
    },
    locked: {
      label: "Locked",
      cls: "bg-mahogany/[0.08] text-mahogany-500 border-mahogany/20",
    },
    archived: {
      label: "Archived",
      cls: "bg-cream-50 text-mahogany-400 border-white/[0.04]",
    },
  };
  const v = map[status] ?? map.draft;
  return (
    <span
      className={`text-[10px] font-medium px-2 py-1 rounded-full border ${v.cls}`}
    >
      {v.label}
    </span>
  );
}
