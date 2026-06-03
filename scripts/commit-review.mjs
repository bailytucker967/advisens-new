// Create the new existing client (Catherine Wells) + an annual Review Pack
// (report_type review_pack). Reads /tmp/review_final.md if present else
// /tmp/review_draft.md. DRY-RUN by default; pass --commit to write.
import { createClient } from "@supabase/supabase-js";
import { readFile, access } from "node:fs/promises";

const COMMIT = process.argv.includes("--commit");
const ADVISOR_ID = "aef06571-558e-40ab-9ce3-559fddc045c1";
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function exists(p) { try { await access(p); return true; } catch { return false; } }
const path = (await exists("/tmp/review_final.md")) ? "/tmp/review_final.md" : "/tmp/review_draft.md";
const markdown = await readFile(path, "utf8");
const headings = markdown.split("\n").filter((l) => /^##\s+/.test(l));
console.log(`Source: ${path}\nMarkdown: ${markdown.length} chars, ${headings.length} ## slides`);

const MEETING_NOTES = `Existing client annual review. Catherine Wells, 54, British, single. Senior Legal Counsel at a multinational (DIFC, Dubai); ~9 years in the UAE, tax-free income ~£210k/yr. Titan client since February 2024 (second annual review, to mid-2026).

Titan arrangements: offshore bond (RL360) ~£420k in the Titan Balanced MPS; consolidated SIPP ~£310k (two former UK pensions consolidated at onboarding) in the Titan Balanced MPS; retained legacy ISAs ~£95k. UK buy-to-let property ~£540k with a ~£180k interest-only mortgage (~£360k equity). Total managed with Titan ~£730k.

Since last review: positive market year, Balanced model in line with its ARC benchmark; Catherine increased her monthly bond contribution from £2,000 to £3,500 after a pay rise; now exploring whether she could retire at 58 instead of 60. Risk profile remains Balanced (ATR re-confirmed).`;

const ADDITIONAL_NOTES = `Objective (set at onboarding): retire in the UK at 60 on ~£70,000/yr NET (today's money); on track. New question this review: feasibility of retiring at 58. Planning assumptions: 5% net growth, 3% inflation, 4% withdrawal. Review against Titan's current house view (Investment Committee), confirm Balanced remains suitable, and set actions (maintain higher contributions, decide 58 vs 60 at next review, review protection/will, verify NI record).`;

const TITLE = "Annual Review — Catherine Wells";

if (!COMMIT) {
  console.log("\n--- DRY RUN (no write). Re-run with --commit to apply. ---");
  console.log(`Would create: active client "Catherine Wells", report "${TITLE}" (review_pack), version 1.`);
  headings.forEach((h, i) => console.log(`  ${i + 1}. ${h.replace(/^##\s+/, "")}`));
  process.exit(0);
}

const { data: client, error: cErr } = await supabase
  .from("clients")
  .insert({ full_name: "Catherine Wells", advisor_id: ADVISOR_ID, status: "active" })
  .select("id").single();
if (cErr) { console.error("client insert failed:", cErr); process.exit(1); }

const { data: report, error: rErr } = await supabase
  .from("reports")
  .insert({
    advisor_id: ADVISOR_ID,
    client_id: client.id,
    title: TITLE,
    report_type: "review_pack",
    status: "review",
    meeting_notes: MEETING_NOTES,
    additional_notes: ADDITIONAL_NOTES,
  })
  .select("id").single();
if (rErr) { console.error("report insert failed:", rErr); process.exit(1); }

const { data: version, error: vErr } = await supabase
  .from("report_versions")
  .insert({ report_id: report.id, version_number: 1, content_markdown: markdown, generated_by: "ai", ai_model: "claude-sonnet-4-6", created_by: ADVISOR_ID })
  .select("id").single();
if (vErr) { console.error("version insert failed:", vErr); process.exit(1); }

const { error: uErr } = await supabase.from("reports").update({ current_version_id: version.id }).eq("id", report.id);
if (uErr) { console.error("report update failed:", uErr); process.exit(1); }

console.log(`\nCreated active client ${client.id}`);
console.log(`Created report ${report.id} (v1 ${version.id})`);
console.log(`URL: /dashboard/reports/${report.id}`);
