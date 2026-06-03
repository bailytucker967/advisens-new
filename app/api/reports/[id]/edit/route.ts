import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { revisedReport } from "@/lib/claude";

export const maxDuration = 120;

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await request.json();
  const prompt: string = (body?.prompt ?? "").toString().trim();
  if (!prompt) return NextResponse.json({ error: "prompt required" }, { status: 400 });

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { data: report } = await supabase
    .from("reports")
    .select(
      "id, advisor_id, status, current_version_id, template_id, report_type, title",
    )
    .eq("id", id)
    .maybeSingle();
  if (!report) return NextResponse.json({ error: "not found" }, { status: 404 });
  if (report.advisor_id !== user.id)
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  if (report.status === "locked")
    return NextResponse.json({ error: "report is locked" }, { status: 400 });
  if (!report.current_version_id)
    return NextResponse.json({ error: "no draft to edit" }, { status: 400 });

  const { data: prev } = await supabase
    .from("report_versions")
    .select("content_markdown, version_number")
    .eq("id", report.current_version_id)
    .maybeSingle();
  if (!prev) return NextResponse.json({ error: "previous version missing" }, { status: 400 });

  const { data: profile } = await supabase
    .from("advisor_profiles")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  let template = null;
  if (report.template_id) {
    const { data } = await supabase
      .from("report_templates")
      .select("name, report_type, description, extracted_text")
      .eq("id", report.template_id)
      .maybeSingle();
    template = data;
  }

  try {
    const result = await revisedReport({
      profile,
      template,
      previousMarkdown: prev.content_markdown,
      prompt,
    });

    const { data: newVersion, error: vErr } = await supabase
      .from("report_versions")
      .insert({
        report_id: id,
        version_number: prev.version_number + 1,
        content_markdown: result.content,
        generated_by: "prompt_edit",
        prompt,
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
      .update({ current_version_id: newVersion.id })
      .eq("id", id);

    // Log the prompt-edit as a comment too, for the audit trail
    await supabase.from("report_comments").insert({
      report_id: id,
      version_id: report.current_version_id,
      kind: "prompt_edit",
      body: prompt,
      resulted_in_version_id: newVersion.id,
      author_id: user.id,
    });

    await supabase.from("activity_log").insert({
      advisor_id: user.id,
      kind: "report_edited",
      subject_type: "report",
      subject_id: id,
      metadata: { prompt },
    });

    return NextResponse.json({ ok: true, version_id: newVersion.id });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "edit failed" },
      { status: 500 },
    );
  }
}
