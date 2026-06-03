// Insert a NEW report_version on an EXISTING report and make it current.
// Use this to push a regenerated deck onto a report that already exists
// (e.g. Michael, Catherine) WITHOUT creating a duplicate client/report.
//
// DRY-RUN by default; pass --commit to write.
// Usage: node scripts/add-version.mjs <report_id> <markdown_path> [--commit]
import { createClient } from "@supabase/supabase-js";
import { readFile } from "node:fs/promises";

const COMMIT = process.argv.includes("--commit");
const positional = process.argv.slice(2).filter((a) => a !== "--commit");
const REPORT_ID = positional[0];
const MD_PATH = positional[1];
const ADVISOR_ID = "aef06571-558e-40ab-9ce3-559fddc045c1";

if (!REPORT_ID || !MD_PATH) {
  console.error("usage: node scripts/add-version.mjs <report_id> <markdown_path> [--commit]");
  process.exit(1);
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

const markdown = await readFile(MD_PATH, "utf8");
const headings = markdown.split("\n").filter((l) => /^##\s+/.test(l));

// Confirm the report actually exists before touching anything.
const { data: report, error: rGetErr } = await supabase
  .from("reports")
  .select("id, title, report_type, current_version_id")
  .eq("id", REPORT_ID)
  .single();
if (rGetErr || !report) {
  console.error("Report not found:", REPORT_ID, rGetErr?.message ?? "");
  process.exit(1);
}

const { data: vrows } = await supabase
  .from("report_versions")
  .select("version_number")
  .eq("report_id", REPORT_ID)
  .order("version_number", { ascending: false })
  .limit(1);
const nextVersion = (vrows?.[0]?.version_number ?? 0) + 1;

console.log(`Report:   ${report.title} (${report.report_type})`);
console.log(`Source:   ${MD_PATH}`);
console.log(`Markdown: ${markdown.length} chars, ${headings.length} ## slides`);
console.log(`Next ver: v${nextVersion}`);

if (!COMMIT) {
  console.log("\n--- DRY RUN (no write). Re-run with --commit to apply. ---");
  headings.forEach((h, i) => console.log(`  ${i + 1}. ${h.replace(/^##\s+/, "")}`));
  process.exit(0);
}

const { data: version, error: vErr } = await supabase
  .from("report_versions")
  .insert({
    report_id: REPORT_ID,
    version_number: nextVersion,
    content_markdown: markdown,
    generated_by: "ai",
    ai_model: "claude-sonnet-4-6",
    created_by: ADVISOR_ID,
  })
  .select("id")
  .single();
if (vErr) { console.error("version insert failed:", vErr); process.exit(1); }

const { error: rErr } = await supabase
  .from("reports")
  .update({
    current_version_id: version.id,
    status: "review",
    locked_at: null,
    locked_by: null,
  })
  .eq("id", REPORT_ID);
if (rErr) { console.error("report update failed:", rErr); process.exit(1); }

console.log(`\nCommitted v${nextVersion} (${version.id}) to "${report.title}". Now current.`);
