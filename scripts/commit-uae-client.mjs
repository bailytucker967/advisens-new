// Create the new UAE showcase client (Michael Aldridge): a clients row, a
// reports row, and the first report_version from the polished deck.
//
// Reads /tmp/uae_final.md if present (polished), else /tmp/uae_draft.md.
// DRY-RUN by default; pass --commit to write.
//
// Usage: node scripts/commit-uae-client.mjs [--commit]
import { createClient } from "@supabase/supabase-js";
import { readFile, access } from "node:fs/promises";

const COMMIT = process.argv.includes("--commit");
const ADVISOR_ID = "aef06571-558e-40ab-9ce3-559fddc045c1"; // Ben Thompson (test profile)

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

async function exists(p) { try { await access(p); return true; } catch { return false; } }
const path = (await exists("/tmp/uae_final.md")) ? "/tmp/uae_final.md" : "/tmp/uae_draft.md";
const markdown = await readFile(path, "utf8");
const headings = markdown.split("\n").filter((l) => /^##\s+/.test(l));
console.log(`Source: ${path}`);
console.log(`Markdown: ${markdown.length} chars, ${headings.length} ## slides`);

const MEETING_NOTES = `Met Michael and Claire Aldridge. Michael, 48, British, Regional Managing Director (Middle East) at an energy & engineering group (DMCC, Dubai); 9 years in the UAE. Claire, 45, part-time interior-design consultant (~£15k/yr). Three children at British-curriculum schools in Dubai: Emily (17, UK university from 2027), Jack (14), Olivia (10). Residency intention undecided — remain in the Gulf to retirement, or return to the UK in 5-7 years; the plan must work under both.

Household income ~£340k/yr tax-free (Michael base ~AED 1.5m + bonus, plus benefits); outgoings ~£260k/yr (villa, 3x school fees, lifestyle); net surplus ~£6,700/mo, partly idle in cash.

Assets: £180k cash (~£120k idle); two frozen UK DC pensions (£145k + £78k); a deferred UK DB pension (£14,500/yr from 65, CETV ~£330k); a legacy non-Titan offshore bond £125k (~2%+ charges, underperforming); UK let property £750k with £300k interest-only BTL mortgage (~£450k equity, ~£32k/yr rent); legacy ISAs £90k; GIA/shares £45k. Gross ~£1,413k, net of mortgage ~£1,113k, plus the DB.

Protection: employer death-in-service (~£640k, lapses on leaving) plus modest personal term (~£250k); no critical illness or income protection. Estate: UK domicile, full IHT exposure on a growing ~£1.1m+ estate; outdated will, no LPAs.

Risk: Growth; high capacity for loss; ATR to be completed.`;

const ADDITIONAL_NOTES = `Objectives (priority): (1) consolidate the two frozen DC pensions; obtain a DB transfer analysis but likely retain the valuable DB; (2) review/replace the expensive legacy offshore bond; (3) deploy idle cash + ~£80k/yr surplus efficiently; (4) decide stay-in-Gulf vs return-to-UK and structure for both; (5) fund three children's UK university (Emily 2027, Jack ~2031, Olivia ~2035); (6) financial independence by ~58, full retirement by 60 on ~£95,000/yr NET (today's money); (7) mitigate UK IHT, put protection and a valid will/LPAs in place. Planning assumptions: 5.5% net growth, 3% inflation, 4% withdrawal, model to age 60 (12-yr horizon).`;

const TITLE = "Financial Assessment — Michael Aldridge";

if (!COMMIT) {
  console.log("\n--- DRY RUN (no write). Re-run with --commit to apply. ---");
  console.log(`Would create: client "Michael Aldridge", report "${TITLE}", version 1, and set current_version_id.`);
  console.log("\nSlide headings:");
  headings.forEach((h, i) => console.log(`  ${i + 1}. ${h.replace(/^##\s+/, "")}`));
  process.exit(0);
}

// 1. client
const { data: client, error: cErr } = await supabase
  .from("clients")
  .insert({ full_name: "Michael Aldridge", advisor_id: ADVISOR_ID, status: "prospect" })
  .select("id")
  .single();
if (cErr) { console.error("client insert failed:", cErr); process.exit(1); }

// 2. report
const { data: report, error: rErr } = await supabase
  .from("reports")
  .insert({
    advisor_id: ADVISOR_ID,
    client_id: client.id,
    title: TITLE,
    report_type: "new_client_assessment",
    status: "review",
    meeting_notes: MEETING_NOTES,
    additional_notes: ADDITIONAL_NOTES,
  })
  .select("id")
  .single();
if (rErr) { console.error("report insert failed:", rErr); process.exit(1); }

// 3. version
const { data: version, error: vErr } = await supabase
  .from("report_versions")
  .insert({
    report_id: report.id,
    version_number: 1,
    content_markdown: markdown,
    generated_by: "ai",
    ai_model: "claude-sonnet-4-6",
    created_by: ADVISOR_ID,
  })
  .select("id")
  .single();
if (vErr) { console.error("version insert failed:", vErr); process.exit(1); }

// 4. point report at the version
const { error: uErr } = await supabase
  .from("reports")
  .update({ current_version_id: version.id })
  .eq("id", report.id);
if (uErr) { console.error("report update failed:", uErr); process.exit(1); }

console.log(`\nCreated client ${client.id}`);
console.log(`Created report ${report.id} (v1 ${version.id})`);
console.log(`URL: /dashboard/reports/${report.id}`);
