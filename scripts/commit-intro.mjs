// Create the new prospect (Andrew Coulson) + an Introduction document
// (report_type introductory_pitch). Reads /tmp/intro_final.md if present else
// /tmp/intro_draft.md. DRY-RUN by default; pass --commit to write.
import { createClient } from "@supabase/supabase-js";
import { readFile, access } from "node:fs/promises";

const COMMIT = process.argv.includes("--commit");
const ADVISOR_ID = "aef06571-558e-40ab-9ce3-559fddc045c1";
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function exists(p) { try { await access(p); return true; } catch { return false; } }
const path = (await exists("/tmp/intro_final.md")) ? "/tmp/intro_final.md" : "/tmp/intro_draft.md";
const markdown = await readFile(path, "utf8");
const headings = markdown.split("\n").filter((l) => /^##\s+/.test(l));
console.log(`Source: ${path}\nMarkdown: ${markdown.length} chars, ${headings.length} ## slides`);

const MEETING_NOTES = `Pre-meeting introduction — first meeting in the diary, NOT yet held. Andrew Coulson, ~51, British, referred by an existing Titan client. Senior Operations / Projects Director at an energy company in Abu Dhabi; ~11 years in the UAE. Married; two older children (one at a UK university, one finishing school).

Outline picture from the referral and a brief intro call: several UK pensions accrued over a long career (a defined benefit scheme may be among them); a UK home with the mortgage nearly repaid; meaningful cash and some older offshore savings; no structured plan in place. Starting to think about winding down over the next 3-5 years and a possible permanent return to the UK. Wants to understand his options.

This introduction sets up the first meeting; no specific figures or recommendations yet.`;

const ADDITIONAL_NOTES = `Likely areas to explore at the first meeting: review and possible consolidation of his UK pensions (with a specialist transfer analysis if a DB scheme is involved); UAE->UK tax transition planning; deploying surplus cash tax-efficiently; UK IHT as a returning UK domiciliary; protection and an up-to-date will; State Pension / NI record check. Tailor to a UAE-resident British expat (AED now, GBP on return).`;

const TITLE = "Introduction — Andrew Coulson";

if (!COMMIT) {
  console.log("\n--- DRY RUN (no write). Re-run with --commit to apply. ---");
  console.log(`Would create: prospect "Andrew Coulson", report "${TITLE}" (introductory_pitch), version 1.`);
  headings.forEach((h, i) => console.log(`  ${i + 1}. ${h.replace(/^##\s+/, "")}`));
  process.exit(0);
}

const { data: client, error: cErr } = await supabase
  .from("clients")
  .insert({ full_name: "Andrew Coulson", advisor_id: ADVISOR_ID, status: "prospect" })
  .select("id").single();
if (cErr) { console.error("client insert failed:", cErr); process.exit(1); }

const { data: report, error: rErr } = await supabase
  .from("reports")
  .insert({
    advisor_id: ADVISOR_ID,
    client_id: client.id,
    title: TITLE,
    report_type: "introductory_pitch",
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

console.log(`\nCreated prospect ${client.id}`);
console.log(`Created report ${report.id} (v1 ${version.id})`);
console.log(`URL: /dashboard/reports/${report.id}`);
