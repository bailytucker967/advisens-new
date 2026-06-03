// Scan every report's CURRENT version markdown for emoji/decorative glyphs.
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);
const EMOJI =
  /[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE0F}✅❌✔✓✗⚠⭐]/gu;

const { data: reports, error } = await supabase
  .from("reports")
  .select("id, title, report_type, current_version_id");
if (error) { console.error(error); process.exit(1); }

for (const r of reports) {
  if (!r.current_version_id) { console.log(`— ${r.title}: no current version`); continue; }
  const { data: v } = await supabase
    .from("report_versions")
    .select("content_markdown")
    .eq("id", r.current_version_id)
    .single();
  const md = v?.content_markdown ?? "";
  const hits = [...md.matchAll(EMOJI)].map((m) => m[0]);
  const kinds = [...new Set(hits)];
  const flag = hits.length ? `⚠ ${hits.length} emoji -> ${kinds.join(" ")}` : "clean";
  console.log(`${hits.length ? "HAS EMOJI" : "ok       "}  ${r.title}  [${r.report_type}]  ${flag}`);
}
