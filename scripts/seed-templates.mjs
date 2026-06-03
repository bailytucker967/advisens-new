// Seed realistic template samples for the preview-test demo account.
// preview-test@advisens.dev is modelled as an adviser at the (fictional)
// firm "Titan Wealth International". The structures mirror a real GCC
// expat-advisory practice's report library so it looks authentic to advisers.
//
// Usage: set -a && source .env.local && set +a && node scripts/seed-templates.mjs

import { createClient } from "@supabase/supabase-js";

const SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY;
const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
if (!SERVICE || !URL) {
  console.error("Missing env vars");
  process.exit(1);
}

const admin = createClient(URL, SERVICE, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const ADVISOR_EMAIL = "preview-test@advisens.dev";

// Find the advisor's user_id
const { data: list, error: listErr } = await admin.auth.admin.listUsers();
if (listErr) {
  console.error(listErr);
  process.exit(1);
}
const user = list.users.find((u) => u.email === ADVISOR_EMAIL);
if (!user) {
  console.error(`No user ${ADVISOR_EMAIL}`);
  process.exit(1);
}
const advisorId = user.id;
console.log(`Seeding templates for ${ADVISOR_EMAIL} (${advisorId})`);

const TEMPLATES = [
  {
    name: "Full Assessment Report — Long Form",
    report_type: "new_client_assessment",
    description:
      "The complete client assessment used for new prospects with complex multi-jurisdictional positions. Covers personal & financial position, retirement gap, recommended structure, platform options, model portfolio service, market outlook and underlying holdings. ~50–60 pages.",
    file_name: "MWP-Assessment-FullLongForm.pdf",
    file_size_bytes: 4_820_000,
    mime_type: "application/pdf",
    is_default: true,
    extracted_text: `# Full Assessment Report — Structure

1. Cover (firm + client name)
2. Your Advice Team — adviser bios + contact
3. Why Titan Wealth — group AUA, staff, regulators, awards
4. Services Offered — Financial Advice / Insurance / Investment Management
5. Scope of Services
6. Group Regulation Overview — entity table
7. Client Objectives + UK Income Tax framing
8. Retirement Breakdown — today vs inflation-proofed, gross/net, savings required
9. Defined Contribution Schemes — existing pensions
10. Platform Provider — RL360 / Ardan / Morningstar
11. Platform Illustration — projected wealth path
12. Model Portfolio Service — 5 risk profiles (Defensive→Adventurous)
13. Investment Approach — quantitative analysis
14. Investment Committee
15. Market Outlook Update — quarterly macro
16. Asset Allocation Committee
17. Risk Weighted Mandates — allocations by profile
18. Model Portfolio Returns
19. Underlying Holdings — top 30 per profile
20. Portfolio Changes Summary — buys & sells with commentary
21. Disclaimers & sign-off`,
  },
  {
    name: "Assessment Report — Concise",
    report_type: "new_client_assessment",
    description:
      "A streamlined version of the full assessment for prospects with straightforward situations. Drops the deep portfolio detail. ~18–22 pages.",
    file_name: "MWP-Assessment-Concise.pdf",
    file_size_bytes: 1_640_000,
    mime_type: "application/pdf",
    is_default: false,
    extracted_text: `# Concise Assessment — Structure

1. Cover
2. Your Adviser
3. Client Objectives
4. Personal & Financial Position
5. Retirement Gap Analysis
6. Recommended Structure
7. Platform Recommendation
8. Model Portfolio — chosen risk profile
9. Fees & Charges
10. Next Steps
11. Disclaimers`,
  },
  {
    name: "Introductory Pitch — Firm",
    report_type: "introductory_pitch",
    description:
      "The mandate-winning introduction sent to prospects ahead of the first deep meeting. Firm story, philosophy, services, regulation, and example outcomes — tailored to the prospect's situation.",
    file_name: "MWP-IntroPitch-FirmOverview.pdf",
    file_size_bytes: 2_240_000,
    mime_type: "application/pdf",
    is_default: true,
    extracted_text: `# Introductory Pitch — Structure

1. Cover — Prospect name + firm wordmark
2. Why Titan Wealth — credibility & scale
3. Your Adviser & support team
4. Our investment philosophy
5. Services tailored to your situation
6. Regulation & client protection
7. Example outcomes (case studies)
8. Next steps`,
  },
  {
    name: "Quarterly Review Pack",
    report_type: "review_pack",
    description:
      "The quarterly review document used across the book. Portfolio performance, rebalancing actions, refreshed market commentary, and any structural changes. ~12–18 pages depending on holdings.",
    file_name: "MWP-Review-Quarterly.pdf",
    file_size_bytes: 1_980_000,
    mime_type: "application/pdf",
    is_default: true,
    extracted_text: `# Quarterly Review — Structure

1. Cover
2. Period Summary
3. Portfolio Performance — vs benchmark
4. Allocation vs Mandate
5. Holdings movement
6. Market Outlook — quarter ahead
7. Adviser notes
8. Next review date`,
  },
  {
    name: "Annual Review Pack",
    report_type: "review_pack",
    description:
      "The full annual review — broader than quarterly: includes refreshed goals, suitability, fee disclosure, and a forward 12-month plan.",
    file_name: "MWP-Review-Annual.pdf",
    file_size_bytes: 2_780_000,
    mime_type: "application/pdf",
    is_default: false,
    extracted_text: `# Annual Review — Structure

1. Cover & year in summary
2. Goals — revisited
3. Portfolio Performance — 1y / 3y / SI
4. Suitability check
5. Fee disclosure
6. Market context — year ahead
7. Forward 12-month plan
8. Suitability re-affirmation`,
  },
  {
    name: "Pension Transfer Assessment",
    report_type: "custom",
    description:
      "Specialist suitability document for UK pension transfers (DB/DC). Includes critical yield, transfer value analysis, and protections lost/gained.",
    file_name: "MWP-PensionTransfer-Assessment.pdf",
    file_size_bytes: 2_120_000,
    mime_type: "application/pdf",
    is_default: false,
    extracted_text: `# Pension Transfer — Structure

1. Cover
2. Scheme summary
3. Transfer Value Analysis
4. Critical Yield
5. Benefits gained / lost
6. Recommendation
7. Risk warnings & disclaimers`,
  },
  {
    name: "Tax Structuring Note",
    report_type: "custom",
    description:
      "Short bespoke note framing cross-border tax structure for British expats — UAE / GCC / UK interaction.",
    file_name: "MWP-TaxStructuring-Note.pdf",
    file_size_bytes: 740_000,
    mime_type: "application/pdf",
    is_default: false,
    extracted_text: `# Tax Structuring Note — Structure

1. Client residence position
2. UK tax exposure
3. GCC framework
4. Recommended wrapper
5. Reporting obligations
6. Caveats`,
  },
];

// Clear existing templates for a clean re-run
const { error: delErr } = await admin
  .from("report_templates")
  .delete()
  .eq("advisor_id", advisorId);
if (delErr) {
  console.error("delete failed:", delErr);
  process.exit(1);
}
console.log("Cleared existing templates.");

// Insert
const rows = TEMPLATES.map((t) => ({
  ...t,
  advisor_id: advisorId,
  // We don't upload an actual file — storage_path is a notional pointer.
  // The Templates page only displays metadata. When the user uploads real PDFs
  // later, they'll replace these rows via the upload flow.
  storage_path: `${advisorId}/seed-${t.file_name}`,
}));

const { data: inserted, error: insErr } = await admin
  .from("report_templates")
  .insert(rows)
  .select("id, name, report_type");
if (insErr) {
  console.error("insert failed:", insErr);
  process.exit(1);
}

console.log(`Inserted ${inserted.length} template(s):`);
for (const r of inserted) console.log(`  · [${r.report_type}] ${r.name}`);
