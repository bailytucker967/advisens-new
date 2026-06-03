import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateReport } from "@/lib/claude";

export const maxDuration = 120;

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  // Load report + template + profile + client name
  const { data: report, error: reportErr } = await supabase
    .from("reports")
    .select(
      "id, title, report_type, status, template_id, meeting_notes, transcript, notetaker_url, additional_notes, advisor_id, client_id, clients(full_name)",
    )
    .eq("id", id)
    .maybeSingle();
  if (reportErr || !report)
    return NextResponse.json({ error: "report not found" }, { status: 404 });
  if (report.advisor_id !== user.id)
    return NextResponse.json({ error: "forbidden" }, { status: 403 });

  const { data: profile } = await supabase
    .from("advisor_profiles")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  let template: {
    name: string;
    report_type: string;
    description: string | null;
    extracted_text: string | null;
  } | null = null;
  if (report.template_id) {
    const { data } = await supabase
      .from("report_templates")
      .select("name, report_type, description, extracted_text")
      .eq("id", report.template_id)
      .maybeSingle();
    template = data;
  }

  // Extracted text from uploaded attachments. Queried separately so that a
  // missing column (before the attachment_text migration is applied) degrades
  // gracefully to "no attachments" instead of breaking generation.
  let attachmentText: string | null = null;
  {
    const { data: at } = await supabase
      .from("reports")
      .select("attachment_text")
      .eq("id", id)
      .maybeSingle();
    attachmentText =
      (at as { attachment_text?: string | null } | null)?.attachment_text ?? null;
  }

  // Mark generating
  await supabase
    .from("reports")
    .update({ status: "generating" })
    .eq("id", id);

  try {
    const result = await generateReport({
      profile,
      template,
      inputs: {
        title: report.title,
        report_type: report.report_type,
        // @ts-expect-error joined
        client_name: report.clients?.full_name ?? null,
        meeting_notes: report.meeting_notes,
        transcript: report.transcript,
        notetaker_url: report.notetaker_url,
        additional_notes: report.additional_notes,
        attachment_text: attachmentText,
      },
    });

    const { data: version, error: vErr } = await supabase
      .from("report_versions")
      .insert({
        report_id: id,
        version_number: 1,
        content_markdown: result.content,
        generated_by: "ai",
        ai_model: result.model,
        ai_tokens_input: result.tokensIn,
        ai_tokens_output: result.tokensOut,
        created_by: user.id,
      })
      .select("id")
      .single();
    if (vErr) throw vErr;

    await supabase
      .from("reports")
      .update({ status: "review", current_version_id: version.id })
      .eq("id", id);

    await supabase.from("activity_log").insert({
      advisor_id: user.id,
      kind: "report_generated",
      subject_type: "report",
      subject_id: id,
    });

    return NextResponse.redirect(new URL(`/dashboard/reports/${id}`, request.url), {
      status: 303,
    });
  } catch (e) {
    await supabase
      .from("reports")
      .update({ status: "draft" })
      .eq("id", id);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "generation failed" },
      { status: 500 },
    );
  }
}
