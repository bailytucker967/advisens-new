import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { data: report } = await supabase
    .from("reports")
    .select("advisor_id, status, current_version_id")
    .eq("id", id)
    .maybeSingle();
  if (!report || report.advisor_id !== user.id)
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  if (!report.current_version_id)
    return NextResponse.json({ error: "no version to lock" }, { status: 400 });
  if (report.status === "locked")
    return NextResponse.json({ error: "already locked" }, { status: 400 });

  const { error } = await supabase
    .from("reports")
    .update({
      status: "locked",
      locked_at: new Date().toISOString(),
      locked_by: user.id,
    })
    .eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await supabase.from("activity_log").insert({
    advisor_id: user.id,
    kind: "report_locked",
    subject_type: "report",
    subject_id: id,
  });

  return NextResponse.json({ ok: true });
}
