// Commit a regenerated Jane Doe deck to the DB as a new version, and persist
// her enriched fact-find so future app-driven regenerations stay long-form.
//
// Reads /tmp/jane_v2_final.md if present (the polished deck), else
// /tmp/jane_v2_draft.md. DRY-RUN by default; pass --commit to write.
//
// Usage: node scripts/commit-jane.mjs [--commit]
import { createClient } from "@supabase/supabase-js";
import { readFile, access } from "node:fs/promises";

const COMMIT = process.argv.includes("--commit");
const REPORT_ID = "b077c0e8-5b28-487c-af77-b065e41be46b";
const ADVISOR_ID = "aef06571-558e-40ab-9ce3-559fddc045c1";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

async function exists(p) {
  try { await access(p); return true; } catch { return false; }
}
const path = (await exists("/tmp/jane_v3_final.md"))
  ? "/tmp/jane_v3_final.md"
  : "/tmp/jane_v3_draft.md";
const markdown = await readFile(path, "utf8");
const headings = markdown.split("\n").filter((l) => /^##\s+/.test(l));
console.log(`Source: ${path}`);
console.log(`Markdown: ${markdown.length} chars, ${headings.length} ## slides`);

// Enriched fact-find persisted to the report so the engine stays long-form.
const MEETING_NOTES = `Met Jane and her husband Mark. Jane is 42, British, a Regional Marketing Director at an FMCG multinational (DMCC, Dubai); 6 years in the UAE, intending a further 3-5 years then a permanent return to the UK. Mark, 44, is a self-employed IT consultant. Two children, Sophie (10) and Tom (8), at a British-curriculum school in Dubai, UK university intended.

Household income ~£168k/yr (Jane ~AED 75k/mo tax-free plus Mark ~£3.5k/mo); outgoings ~£126k/yr (villa rent, school fees, living); net surplus ~£3,500/mo sitting in cash.

Assets: £250,000 GBP cash, 100% un-invested (the central issue); frozen UK workplace DC pension ~£90,000 (deferred since 2020, no contributions since, limited funds/~0.75% AMC); legacy ISAs ~£40,000 (can't contribute as non-resident); GIA/legacy shares ~£15,000; UK buy-to-let property £520,000 with a £290,000 interest-only BTL mortgage (~£230k equity, rent ~£24k/yr broadly covering interest).

Protection: employer death-in-service only (~4x salary, lapses on leaving); no personal life or critical-illness cover. Estate: outdated pre-children UK will, no LPAs, no trusts; UK domicile, full IHT exposure on return.

Risk: Balanced; ATR to be completed; capacity for loss good.`;

const ADDITIONAL_NOTES = `Objectives (priority): (1) put the £250k cash to work tax-efficiently before inflation erodes it; (2) retire in the UK at 60 on £75,000/yr NET in today's money (18-yr horizon); (3) fund the children's UK university (~2032 and ~2034); (4) consolidate the frozen £90k UK pension; (5) mitigate UK IHT on return; (6) put personal protection and a valid UK will in place. Structure must work across the UAE->UK move. Planning assumptions: 5% net growth, 3% inflation, 4% withdrawal, retire 60.`;

if (!COMMIT) {
  console.log("\n--- DRY RUN (no write). Re-run with --commit to apply. ---");
  console.log("Would: insert new report_version, set current_version_id, unlock report, update meeting_notes/additional_notes.");
  console.log("\nSlide headings:");
  headings.forEach((h, i) => console.log(`  ${i + 1}. ${h.replace(/^##\s+/, "")}`));
  process.exit(0);
}

// Next version number
const { data: vrows } = await supabase
  .from("report_versions")
  .select("version_number")
  .eq("report_id", REPORT_ID)
  .order("version_number", { ascending: false })
  .limit(1);
const nextVersion = (vrows?.[0]?.version_number ?? 0) + 1;

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
    meeting_notes: MEETING_NOTES,
    additional_notes: ADDITIONAL_NOTES,
  })
  .eq("id", REPORT_ID);
if (rErr) { console.error("report update failed:", rErr); process.exit(1); }

console.log(`\nCommitted v${nextVersion} (${version.id}). Report unlocked, status=review, fact-find persisted.`);
