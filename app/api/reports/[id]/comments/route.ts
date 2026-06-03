import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await request.json();
  const kind = body?.kind === "prompt_edit" ? "prompt_edit" : "note";
  const text = (body?.body ?? "").toString().trim();
  const versionId = body?.version_id ?? null;
  if (!text) return NextResponse.json({ error: "body required" }, { status: 400 });

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  // Authorization check: confirm the report belongs to this user.
  const { data: report } = await supabase
    .from("reports")
    .select("advisor_id")
    .eq("id", id)
    .maybeSingle();
  if (!report || report.advisor_id !== user.id)
    return NextResponse.json({ error: "forbidden" }, { status: 403 });

  const { error } = await supabase.from("report_comments").insert({
    report_id: id,
    version_id: versionId,
    kind,
    body: text,
    author_id: user.id,
  });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
