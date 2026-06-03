// Generate the new fictional UAE showcase client (Michael Aldridge) assessment
// as a long-form deck (~26 client slides). Writes DRAFT to /tmp/uae_draft.md
// only — no DB write. Review/polish, then commit with commit-uae-client.mjs.
//
// Usage: node scripts/generate-uae-client.mjs
import Anthropic from "@anthropic-ai/sdk";
import { writeFile } from "node:fs/promises";
import { VISUAL_STYLE } from "./gen-common.mjs";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const MODEL = "claude-sonnet-4-6";

// ── Fictional senior-corporate-professional persona (Dubai) ───────────
const FACT_FIND = `
PERSONAL DETAILS
- Name: Michael Aldridge. Age: 48. Nationality: British. Health: Good.
- Marital status: Married. Spouse: Claire Aldridge, 45, British; part-time interior-design consultant (~£15,000/yr); health good.
- Employer: international energy & engineering services group (DMCC, Dubai). Position: Regional Managing Director, Middle East. Resident in Dubai 9 years.
- Children (3), all at British-curriculum schools in Dubai: Emily (17 — UK university from Sept 2027), Jack (14), Olivia (10).
- Residency intention: UNDECIDED — either remain in the Gulf to ~retirement, or return permanently to the UK in roughly 5–7 years. This is a live decision the plan must serve under both scenarios.

INCOME & EXPENDITURE (household, GBP equivalent; tax-free in the UAE)
- Michael package: base ~AED 1,500,000/yr (~£320,000) + typical bonus ~£85,000 + housing/schooling/medical benefits. Claire ~£15,000/yr.
- Household income ~£340,000/yr, entirely tax-free.
- Outgoings ~£260,000/yr: villa rent (~AED 320,000/yr, ~£70,000), school fees x3 (~£75,000), living/travel/lifestyle (~£115,000).
- Net surplus ~£80,000/yr (~£6,700/mo) — partly accumulating in cash.

ASSETS
- Cash / savings: £180,000 (Emirates NBD AED + UK accounts); ~£120,000 of this is surplus capital sitting idle.
- Frozen UK workplace pension #1 (former employer A, DC): £145,000 — deferred, limited fund range, ~0.70% AMC.
- Frozen UK workplace pension #2 (former employer B, DC): £78,000 — deferred, separate provider, unmanaged.
- Deferred UK DEFINED BENEFIT pension (final-salary, earlier UK career): £14,500/yr payable from age 65, CETV ~£330,000. Valuable guaranteed, inflation-linked income.
- Existing offshore savings bond (started 8 years ago with a NON-Titan provider): £125,000 — high establishment/ongoing charges (~2%+ all-in), underperforming, restrictive. Needs review.
- UK property (former family home, now let): value £750,000; interest-only BTL mortgage £300,000; equity £450,000; gross rent ~£32,000/yr.
- Legacy Stocks & Shares ISAs: £90,000 (cannot contribute as non-resident). General investment account / shares: £45,000.

LIABILITIES
- UK BTL interest-only mortgage: £300,000. No other debt.
- Gross assets (excluding DB CETV) ~£1,413,000; net of mortgage ~£1,113,000; plus the deferred DB income.

PROTECTION & ESTATE
- Life cover: employer death-in-service (~£640,000, ~2x package) — lapses on leaving. A modest personal level-term policy (~£250,000, ~8 yrs left). No critical illness or income protection.
- Estate: UK domicile of origin (full UK IHT on worldwide estate); estate ~£1.1m+ and growing. Old UK will (pre-youngest child); no LPAs; no trusts.

RISK
- Attitude to risk: GROWTH (medium-to-high). Long horizon on the bulk of capital; capacity for loss HIGH (large surplus, secure high income, diversified assets). ATR to be completed.

OBJECTIVES (priority order)
1. Consolidate the two frozen DC pensions; obtain a DB transfer analysis but, on the facts, likely RETAIN the valuable DB.
2. Review and replace the expensive legacy offshore bond with a competitively-charged, well-managed wrapper.
3. Deploy idle cash and the ~£80,000/yr surplus efficiently and tax-aware across the stay/return scenarios.
4. Decide and plan for stay-in-the-Gulf vs return-to-UK; structure investments to work under both.
5. Fund three children's UK university education — Emily imminent (2027), then Jack (~2031) and Olivia (~2035).
6. Reach financial independence by ~58 with the option to fully retire by 60 on ~£95,000/yr NET in today's money.
7. Mitigate UK inheritance tax on a growing estate; put proper protection, an up-to-date will and LPAs in place.

ADVISER: Ben Thompson, Titan Wealth International (cross-border / expat specialist).
PLANNING ASSUMPTIONS to state: 5.5% p.a. net growth (Growth profile), 3% inflation, 4% sustainable withdrawal, modelling to age 60 (12-year horizon), with a financial-independence checkpoint at 58.
`;

const SYSTEM = `You are TWI Report Generator, an AI report-writing assistant for Titan Wealth International advisers. You draft bespoke, client-facing financial assessment reports as a SLIDE DECK in the adviser's voice.

OUTPUT FORMAT
- Output well-structured markdown. Each top-level "## " heading is ONE slide. Use short paragraphs, bold for key figures, and GFM tables where they add clarity. Do NOT begin the document with a single # title block — start directly with the first "## " slide.
- This is a designed, branded deck, not a flat document. Use the fenced chart blocks below wherever figures support them, to SHOW how numbers were derived. Each block must contain valid JSON only, placed immediately under the heading it illustrates. Only chart figures present in or directly derived from the inputs — never fabricate data to fill a chart.
- Ground every figure in the provided fact-find. Where a specific number is genuinely unknown, leave a [tk] placeholder. Do not invent fund names or performance figures.

CHART BLOCKS
A row of headline stat cards:
\`\`\`advisens-callouts
{ "items": [ { "label": "Projected at 60", "value": "£1.42m", "sub": "net of fees" }, { "label": "Risk profile", "value": "Growth" } ] }
\`\`\`
A calculator panel (inputs gathered -> modelled output):
\`\`\`advisens-calc
{ "title": "Retirement gap model", "note": "assumptions -> output", "inputs": [ { "k": "Current capital", "v": "£663,000" } ], "outputs": [ { "k": "Projected pot at 60", "v": "£2.6m", "emphasis": true } ], "footnote": "Illustrative; not a guarantee of future performance." }
\`\`\`
A growth/projection chart (first series highlighted; mark a comparison line with "muted": true):
\`\`\`advisens-growth
{ "title": "Projected wealth path", "note": "GBP · net of fees", "xLabels": ["2026","2032","2038"], "max": 3000, "series": [ { "label": "Recommended", "points": [663,1500,2600] }, { "label": "Status quo", "points": [663,900,1180], "muted": true } ] }
\`\`\`
A donut (allocation; values are weights):
\`\`\`advisens-donut
{ "title": "Recommended allocation", "note": "Growth", "segments": [ { "label": "Global equities", "value": 74 }, { "label": "Fixed income", "value": 18 }, { "label": "Cash", "value": 8 } ] }
\`\`\`
Horizontal comparison bars:
\`\`\`advisens-bars
{ "title": "Retirement income gap", "unit": "£/yr", "items": [ { "label": "Target net income", "value": 95000, "max": 95000, "valueLabel": "£95,000" }, { "label": "Projected", "value": 78000, "max": 95000, "valueLabel": "£78,000", "muted": true } ] }
\`\`\`

ABOUT TITAN WEALTH INTERNATIONAL (for the firm slides — use real, grounded facts):
Vertically integrated, whole-of-market wealth manager specialising in cross-border advice for British and Western expats. Group assets under advice & management $48B+, ~1,300 staff, 80,000+ regulatory licences across the group. The only international advisory firm dually accredited as a CISI Chartered firm AND a CII International Professional Partner firm. Tagline: Powering Ambitions. Service lines: Investment Management (Model Portfolio Service, Bespoke Portfolio, DFM, cash management), Financial Planning, Pensions & transfers, Tax Planning, Estate Planning & wills, Property & lending, Protection, FX, and Migration/Golden Visa advisory. UK-regulated group entities (FCA) plus international arms (UAE SCA, etc.). The advice team: Ben Thompson (lead adviser), with a paraplanner, associate adviser and client administrator.

${VISUAL_STYLE}`;

const BRIEF = `Draft Michael Aldridge's full Titan Wealth International financial assessment report as a slide deck. Produce 26–27 top-level "## " slides, in EXACTLY this order. Each is one slide:

1. ## Assessment Report — confident executive summary; lead with an advisens-callouts row (net worth, idle cash, retirement target, horizon).
2. ## Your Adviser & Advice Team — Ben Thompson + the wider Titan team (give plausible names); CISI-qualified; whole-of-market commitment.
3. ## Why Titan Wealth International — firm strength and expat focus (advisens-callouts: $48B+, ~1,300 staff, dual accreditation).
4. ## Services Offered — grouped lists (Financial Planning, Investment Management, Pensions & Transfers, Protection, Property & Lending).
5. ## Scope of Services — a table of what is and isn't in scope for this engagement.
6. ## Group Regulation — Titan as a regulated group (FCA UK; SCA UAE); cross-border advice may involve multiple entities; short entity/regulator table.
7. ## Asset Overview — full balance sheet (cash, 2 frozen DC pensions, DB pension noted, legacy offshore bond, UK property equity, ISAs, GIA, mortgage); advisens-callouts + table; gross and net asset value.
8. ## Client Classification & Risk Profile — Ordinary (retail) client; GROWTH risk; high capacity for loss; ATR to be completed; rationale table.
9. ## Your Current Position — personal, family, income (~£340k tax-free) and expenditure; ~£6,700/mo surplus; flag idle cash and the lapsing employer life cover.
10. ## Stay or Return — Scenario Planning — the live decision (remain in the Gulf vs permanent UK return in 5–7 yrs); summarise the tax and structural implications of each, and the principle that the plan must work under both. A two-column comparison table.
11. ## UK Tax Position — UK income-tax bands; convert the £95,000 NET target to GROSS and annual tax (advisens-calc); note CGT/IHT on return; currently tax-free in the UAE.
12. ## The Cost of Holding Cash — model the idle cash vs invested over the horizon (advisens-growth, recommended vs cash-after-inflation); urgency.
13. ## Retirement & Financial Independence — gap analysis: target net income, pot required at 4%, projected from current plan, shortfall; FI checkpoint at 58, full retirement at 60. advisens-calc + advisens-bars.
14. ## Cashflow Forecast — a forward view: surplus invested, school fees rolling off (2027/2031/2035), the path to the target pot. An advisens-growth of total wealth over 12 years.
15. ## Frozen UK Pensions — Consolidation — the two DC pots (£145k + £78k), their drawbacks, and the case to consolidate into one SIPP; a small table of the two schemes.
16. ## Defined Benefit Pension — Analysis — the deferred DB (£14,500/yr from 65, CETV ~£330k); explain the guaranteed, inflation-linked value; recommend a formal transfer analysis but, on the facts, that retaining the DB is very likely the right answer. Balanced and compliant in tone.
17. ## SIPP — Recommendation — consolidate the two DC pots into an FCA-regulated SIPP; open architecture, drawdown, 25% PCLS, inheritable; invested in the Titan Growth model.
18. ## Review of Existing Offshore Bond — assess the legacy £125k bond (high charges ~2%+, restrictive, underperforming); recommend switching to a competitively-charged, Titan-managed bond; note any exit-penalty check required.
19. ## Offshore Bond — Tax-Efficient Growth — recommend a new international bond (e.g. RL360 / Standard Life International) for the idle cash plus the switched legacy bond: gross roll-up, 5% tax-deferred withdrawals, multi-currency, portable across stay/return, trust-wrappable. advisens-growth illustration.
20. ## ISA / GIA — UK Wrapper Strategy — legacy ISAs/GIA and the sequencing on UK return (or if remaining abroad); a wrapper-priority table.
21. ## Education Funding — three children's UK university costs, Emily imminent (2027); advisens-bars of estimated cost vs earmarked provision.
22. ## Trust & Estate Planning — UK IHT on a growing ~£1.1m+ estate; a worked IHT illustration table; offshore bond in trust; urgent will rewrite and LPAs; note pensions-into-IHT from April 2027.
23. ## Protection Review — the gap (employer cover lapses; thin personal cover; no CIC/IP); recommend personal life, critical illness and income protection sized to liabilities and the high income; a current-vs-recommended table.
24. ## Model Portfolio Service — recommend Titan's discretionary GROWTH model, risk-mapped to Michael, reviewed monthly by the Investment Committee; advisens-donut (~74% equity / 18% fixed income / 8% cash). ONE slide only — the detailed MPS pack is appended automatically after this slide, so do NOT reproduce committee/returns/holdings.
25. ## Implementation Roadmap — a priority-ordered table of every recommendation (action, owner, timing) pulling the whole plan together.
26. ## Client Servicing — the ongoing service: direct line to Ben + team, quarterly call, annual review, live portal, performance vs benchmark, rebalancing. Fee: 0.25% per quarter.
27. ## Next Steps — a brief, warm sign-off with the immediate actions and a personal note from Ben.

IMPORTANT: End the deck with "## Client Servicing" then "## Next Steps". Do NOT add an MPS appendix, committee, model-portfolio returns tables or holdings — those are appended automatically. CRITICAL — follow the STYLE rules above: every slide must LEAD WITH A VISUAL (callouts/chart/table) and carry at most a one-line intro plus 3–4 short bullets. No paragraphs, no padding. This is a presentation deck, not a written suitability report.`;

console.log(`Generating UAE client (Michael Aldridge) draft with ${MODEL} (max_tokens 28000, streaming)...`);
const stream = anthropic.messages.stream({
  model: MODEL,
  max_tokens: 28000,
  system: SYSTEM,
  messages: [
    {
      role: "user",
      content: `Adviser: Ben Thompson, Titan Wealth International.\nClient: Michael Aldridge (and spouse Claire).\n\n--- FACT-FIND ---\n${FACT_FIND}\n\n--- BRIEF ---\n${BRIEF}\n\nNow draft the full report in markdown.`,
    },
  ],
});
const resp = await stream.finalMessage();

const text = resp.content.filter((b) => b.type === "text").map((b) => b.text).join("\n");
await writeFile("/tmp/uae_draft.md", text);

const headings = text.split("\n").filter((l) => /^##\s+/.test(l));
console.log(`\nTokens in/out: ${resp.usage.input_tokens} / ${resp.usage.output_tokens}`);
console.log(`Chars: ${text.length}`);
console.log(`Stop reason: ${resp.stop_reason}`);
console.log(`\n## slides (${headings.length}):`);
headings.forEach((h, i) => console.log(`  ${i + 1}. ${h.replace(/^##\s+/, "")}`));
console.log(`\nDraft written to /tmp/uae_draft.md`);
