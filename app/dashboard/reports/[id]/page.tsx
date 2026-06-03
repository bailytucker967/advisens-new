import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { reportTypeLabel } from "@/lib/report-types";
import { PageHeader, Card, EmptyState } from "../../_components/PageHeader";
import { ReportWorkspace } from "./ReportWorkspace";

export default async function ReportPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: report, error } = await supabase
    .from("reports")
    .select(
      "id, title, report_type, status, meeting_notes, transcript, notetaker_url, additional_notes, attachments_paths, current_version_id, locked_at, created_at, client_id, advisor_id, clients(full_name)",
    )
    .eq("id", id)
    .maybeSingle();

  if (error || !report) notFound();

  const { data: versions } = await supabase
    .from("report_versions")
    .select("id, version_number, generated_by, prompt, content_markdown, created_at")
    .eq("report_id", id)
    .order("version_number", { ascending: false });

  const { data: comments } = await supabase
    .from("report_comments")
    .select("id, kind, body, created_at, version_id")
    .eq("report_id", id)
    .order("created_at", { ascending: false });

  const { data: profile } = await supabase
    .from("advisor_profiles")
    .select("firm_name")
    .eq("user_id", report.advisor_id)
    .maybeSingle();

  return (
    <>
      <PageHeader
        eyebrow={`Reports · ${reportTypeLabel(report.report_type)}`}
        title={report.title}
        description={
          // @ts-expect-error joined
          report.clients?.full_name
            ? // @ts-expect-error joined
              `For ${report.clients.full_name}`
            : undefined
        }
      />

      {!versions || versions.length === 0 ? (
        <Card>
          <EmptyState
            title="Ready to draft"
            description="Inputs are saved. When you're ready, generate the first draft — TWI Report Generator will use your template, meeting notes, and profile to draft the report."
            action={<GenerateButton reportId={report.id} />}
          />
        </Card>
      ) : (
        <ReportWorkspace
          report={report}
          versions={versions}
          comments={comments ?? []}
          firmName={profile?.firm_name ?? null}
          // @ts-expect-error clients is a joined relation
          clientName={report.clients?.full_name ?? null}
        />
      )}
    </>
  );
}

function GenerateButton({ reportId }: { reportId: string }) {
  return (
    <form action={`/api/reports/${reportId}/generate/`} method="post">
      <button
        type="submit"
        className="inline-flex items-center justify-center gap-2 rounded-md bg-gold text-espresso px-5 h-10 text-sm font-semibold hover:bg-gold-bright"
      >
        Generate first draft →
      </button>
    </form>
  );
}
