// Seed a rich, designed Jane Doe assessment report for the preview-test demo
// account. This replaces the flat "Word-like" generated draft with a full
// adviser-built report that uses Advisens' visual directives (callouts,
// calculator panels, growth/donut/bar charts) so it renders like a real
// client report — and shows how the figures were derived.
//
// It also tidies the demo account: removes the duplicate "Route Test — Jane
// Doe" reports and attaches the showcase version to the canonical
// "Test Assessment — Jane Doe" report (linked to the Jane Doe client).
//
// Usage: set -a && source .env.local && set +a && node scripts/seed-jane-report.mjs

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
console.log(`Seeding Jane Doe report for ${ADVISOR_EMAIL} (${advisorId})`);

// Make sure the advisor profile carries the fictional firm so the report
// letterhead reads correctly.
await admin
  .from("advisor_profiles")
  .update({
    full_name: "Ben Thompson",
    firm_name: "Titan Wealth International",
    job_title: "Senior Wealth Adviser",
    jurisdiction: "UAE / GCC",
  })
  .eq("user_id", advisorId);

// Ensure the Jane Doe client exists.
let { data: jane } = await admin
  .from("clients")
  .select("id")
  .eq("advisor_id", advisorId)
  .eq("full_name", "Jane Doe")
  .maybeSingle();
if (!jane) {
  const { data: created, error: cErr } = await admin
    .from("clients")
    .insert({
      advisor_id: advisorId,
      full_name: "Jane Doe",
      status: "prospect",
      notes: "British expat, Dubai. Returning to UK ~age 60.",
    })
    .select("id")
    .single();
  if (cErr) {
    console.error("client insert failed:", cErr);
    process.exit(1);
  }
  jane = created;
}
console.log(`Jane Doe client: ${jane.id}`);

// Remove the messy duplicate "Route Test — Jane Doe" reports (cascades to
// their versions/comments).
const { data: dupes } = await admin
  .from("reports")
  .select("id")
  .eq("advisor_id", advisorId)
  .eq("title", "Route Test — Jane Doe");
if (dupes?.length) {
  await admin.from("reports").delete().in("id", dupes.map((d) => d.id));
  console.log(`Removed ${dupes.length} duplicate Route Test report(s).`);
}

// Find (or create) the canonical assessment report.
let { data: report } = await admin
  .from("reports")
  .select("id")
  .eq("advisor_id", advisorId)
  .eq("title", "Financial Planning Assessment — Jane Doe")
  .maybeSingle();
if (!report) {
  // Reuse the existing "Test Assessment — Jane Doe" if present, else create.
  const { data: existing } = await admin
    .from("reports")
    .select("id")
    .eq("advisor_id", advisorId)
    .eq("title", "Test Assessment — Jane Doe")
    .maybeSingle();
  if (existing) {
    report = existing;
  } else {
    const { data: created, error: rErr } = await admin
      .from("reports")
      .insert({
        advisor_id: advisorId,
        client_id: jane.id,
        title: "Financial Planning Assessment — Jane Doe",
        report_type: "new_client_assessment",
        status: "draft",
      })
      .select("id")
      .single();
    if (rErr) {
      console.error("report insert failed:", rErr);
      process.exit(1);
    }
    report = created;
  }
}

// Normalise the canonical report's metadata.
await admin
  .from("reports")
  .update({
    title: "Financial Planning Assessment — Jane Doe",
    client_id: jane.id,
    report_type: "new_client_assessment",
    meeting_notes:
      "Met Jane today. Age 42, British expat in Dubai 6 years. Two children in international school. Holds ~£250k in GBP cash, currently un-invested. Comfortable monthly surplus ~£3,500. Medium risk appetite. Wants to grow wealth tax-efficiently and return to the UK to retire at ~60 (18-year horizon). Target retirement lifestyle ~£75k/yr in today's money.",
    additional_notes:
      "UK-bound retirement — structure must work across UAE and UK tax. Concentration risk: 100% GBP cash. No existing pension contributions since leaving the UK.",
  })
  .eq("id", report.id);
console.log(`Canonical report: ${report.id}`);

// Clear existing versions for a clean re-run.
await admin.from("report_versions").delete().eq("report_id", report.id);
await admin
  .from("reports")
  .update({ current_version_id: null })
  .eq("id", report.id);

// ── Build the report markdown ─────────────────────────────────────────
const F = "```";
const block = (kind, obj) =>
  `${F}advisens-${kind}\n${JSON.stringify(obj, null, 2)}\n${F}`;

const md = [
  "# Financial Planning Assessment — Jane Doe",
  "*New Client Assessment · Prepared by Titan Wealth International*",

  "> **At a glance —** Jane is well placed to return to the UK and retire at 60 on her target lifestyle. Her £250,000 cash holding is currently working far below its potential; redeployed into a structured, medium-risk portfolio it is projected to close all but a small fraction of her retirement income gap — a gap a modest increase in monthly contributions closes entirely, without taking risk beyond her stated comfort.",

  block("callouts", {
    items: [
      { label: "Investment horizon", value: "18 yrs", sub: "to age 60" },
      { label: "Projected pot at 60", value: "£1.9m", sub: "net of fees" },
      { label: "Risk profile", value: "Balanced", sub: "Profile 3 of 5" },
      { label: "Capital deployed", value: "£250k", sub: "phased over 12 mo" },
    ],
  }),

  "## 1. Your objectives",
  "From our introductory meeting, your priorities are clear and consistent:",
  [
    "- **Return to the UK and retire at around age 60**, maintaining a comfortable lifestyle of roughly **£75,000 per year** in today's money.",
    "- **Put your cash to work.** Your £250,000 GBP holding is secure but is losing real value to inflation while uninvested.",
    "- **Grow tax-efficiently**, with a structure that remains efficient both while you are a UAE resident and after you become UK tax-resident again.",
    "- **Stay within a medium risk appetite** — you are comfortable with measured market exposure but not with speculative positions.",
  ].join("\n"),

  "## 2. Personal & financial position",
  "| Detail | Position |",
  "|---|---|",
  "| Age | 42 |",
  "| Nationality | British |",
  "| Current residence | Dubai, UAE (6 years) |",
  "| Dependants | Two children, international school |",
  "| Planned return to UK | ~age 60 (18-year horizon) |",
  "| Liquid capital | ~£250,000 (GBP cash) |",
  "| Monthly investable surplus | ~£3,500 |",
  "| Existing UK pensions | To be consolidated [tk] |",
  "| Risk profile | Medium / Balanced |",
  "",
  "Two observations stand out. First, **100% of your investable wealth is held in a single currency, in cash** — a concentration that carries both inflation risk and currency risk against your future GBP liabilities. Second, you have a long runway: an 18-year horizon is more than enough to ride out market cycles within a balanced mandate.",

  "## 3. The retirement income gap",
  "We modelled the capital required to sustain your target lifestyle, and what your current and recommended plans are projected to deliver. The workings below set out every assumption used — nothing is hidden in a black box.",
  block("calc", {
    title: "Retirement income — gap model",
    note: "assumptions → modelled output",
    inputs: [
      { k: "Current age", v: "42" },
      { k: "Target retirement age", v: "60" },
      { k: "Investment horizon", v: "18 years" },
      { k: "Current capital", v: "£250,000" },
      { k: "Planned monthly contribution", v: "£3,500" },
      { k: "Assumed net return (Balanced)", v: "5.5% p.a." },
      { k: "Inflation assumption", v: "2.5% p.a." },
    ],
    outputs: [
      { k: "Projected pot at 60", v: "£1.9m", emphasis: true },
      { k: "Pot required for £75k income", v: "£2.0m" },
      { k: "Projected shortfall", v: "~£100k (≈5%)" },
      { k: "Closes fully with", v: "+£300 / mo" },
    ],
    footnote:
      "Illustrative projection using a 3.5% sustainable withdrawal rate; figures are inflation-adjusted and net of estimated fees. Not a guarantee of future performance.",
  }),
  "Translated into the income each plan can sustainably support:",
  block("bars", {
    title: "Sustainable net retirement income",
    unit: "£ per year",
    items: [
      { label: "Your target", value: 75000, max: 75000, valueLabel: "£75,000" },
      {
        label: "Recommended plan supports",
        value: 71000,
        max: 75000,
        valueLabel: "£71,000",
      },
      {
        label: "Status quo (cash) supports",
        value: 41000,
        max: 75000,
        valueLabel: "£41,000",
        muted: true,
      },
    ],
  }),

  "## 4. Projected outcomes",
  "The difference between leaving capital in cash and deploying it within a balanced mandate compounds dramatically over your horizon.",
  block("growth", {
    title: "Projected wealth path",
    note: "GBP 000s · net of fees",
    xLabels: ["2026 · age 42", "2035 · age 51", "2044 · age 60"],
    max: 2100,
    series: [
      { label: "Recommended (Balanced)", points: [250, 880, 1900] },
      { label: "Status quo (cash)", points: [250, 560, 1100], muted: true },
    ],
  }),

  "## 5. Recommended structure",
  "We recommend deploying your capital through an **international, UK-compatible investment structure** that preserves tax efficiency on both sides of your move:",
  [
    "- **Wrapper —** an internationally portable structure that remains efficient as a UAE resident and converts cleanly into UK reporting when you repatriate.",
    "- **Glidepath —** a balanced 60/40-style allocation today, automatically de-risking toward capital preservation from age 55 as retirement approaches.",
    "- **Phased deployment —** the £250,000 invested over 12 months to average your entry point and manage timing risk.",
    "- **Contributions —** continue your ~£3,500/month, increased to ~£3,800 to fully close the modelled gap.",
  ].join("\n"),

  "## 6. Recommended portfolio",
  "Your Balanced mandate (Profile 3 of 5) targets the following long-term allocation:",
  block("donut", {
    title: "Balanced mandate — target allocation",
    note: "Profile 3 of 5",
    segments: [
      { label: "Global equities", value: 52 },
      { label: "Fixed income", value: 28 },
      { label: "Property & infrastructure", value: 8 },
      { label: "Alternatives", value: 7 },
      { label: "Cash", value: 5 },
    ],
  }),

  "## 7. Currency & tax considerations",
  "Because your future liabilities are in sterling, we anchor the portfolio in GBP while diversifying currency exposure to reduce concentration risk — a meaningful improvement on today's 100% GBP-cash position.",
  block("bars", {
    title: "Recommended currency exposure",
    unit: "% of portfolio",
    items: [
      { label: "GBP", value: 45, max: 100, valueLabel: "45%" },
      { label: "USD", value: 35, max: 100, valueLabel: "35%" },
      { label: "EUR", value: 12, max: 100, valueLabel: "12%" },
      { label: "Other", value: 8, max: 100, valueLabel: "8%" },
    ],
  }),
  "On tax: while UAE-resident you benefit from a nil personal income-tax environment, making this an ideal window to build the portfolio. On repatriation we will plan the timing of gains and the wrapper's UK reporting status to keep your eventual UK tax position efficient. *Specific UK tax advice should be confirmed with a UK-regulated tax adviser ahead of your return.* [tk]",

  "## 8. Fees & charges",
  "Total cost of ownership matters: over an 18-year horizon, a 1% annual difference in fees can cost six figures. Our recommended structure is materially leaner than the legacy bonds many expatriates hold:",
  "| Component | Recommended | Typical legacy structure |",
  "|---|---|---|",
  "| Platform / wrapper | 0.30% | 0.90% |",
  "| Investment management | 0.55% | 1.00% |",
  "| Advice | 0.30% | 0.40% |",
  "| **Total ongoing** | **1.15% p.a.** | **2.30% p.a.** |",
  block("bars", {
    title: "Total annual cost of ownership",
    unit: "% per year",
    items: [
      {
        label: "Titan Wealth recommended",
        value: 1.15,
        max: 2.3,
        valueLabel: "1.15%",
      },
      {
        label: "Typical legacy structure",
        value: 2.3,
        max: 2.3,
        valueLabel: "2.30%",
        muted: true,
      },
    ],
  }),

  "## 9. Implementation roadmap",
  "| Step | Action | Timing |",
  "|---|---|---|",
  "| 1 | Confirm objectives & risk profile; sign engagement | Week 1 |",
  "| 2 | Open international investment structure | Weeks 2–3 |",
  "| 3 | Begin phased deployment of £250,000 | Months 1–12 |",
  "| 4 | Establish £3,800/month contribution | Month 1 |",
  "| 5 | First portfolio review | Quarter 1 |",
  "| 6 | Annual review & glidepath check | Year 1+ |",

  "## 10. About Titan Wealth International",
  "Titan Wealth International advises internationally mobile professionals and their families across the GCC. We build bespoke, fee-transparent portfolios designed around a single client objective at a time, with an in-house investment committee and a disciplined, evidence-based approach. We act as your adviser through every stage — accumulation in the Gulf, and a clean transition home.",

  "## 11. Your adviser",
  "This assessment was prepared for you personally. I will walk you through every figure at our next meeting and answer any questions before you decide on anything.",
  "",
  "*Ben Thompson*  ",
  "Senior Wealth Adviser, Titan Wealth International  ",
  "ben.thompson@titanwealthinternational.com",

  "---",
  "**Important information.** This report is a personalised illustration prepared for Jane Doe and is private and confidential. Projections are illustrative, depend on the assumptions stated, and are not a guarantee of future performance. The value of investments can fall as well as rise. This document is not a personal tax recommendation; UK tax matters should be confirmed with a UK-regulated tax adviser ahead of any return to the UK. Figures marked [tk] are to be confirmed.",
].join("\n\n");

// Insert as v1 and set current.
const { data: version, error: vErr } = await admin
  .from("report_versions")
  .insert({
    report_id: report.id,
    version_number: 1,
    content_markdown: md,
    generated_by: "ai",
    ai_model: "claude-sonnet-4-6",
    created_by: advisorId,
  })
  .select("id")
  .single();
if (vErr) {
  console.error("version insert failed:", vErr);
  process.exit(1);
}

await admin
  .from("reports")
  .update({ status: "review", current_version_id: version.id })
  .eq("id", report.id);

console.log(`Inserted designed report version ${version.id} (${md.length} chars).`);
console.log("Done.");
