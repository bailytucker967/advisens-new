// Regenerate Jane Doe's assessment as a long-form client deck (~20 client
// slides), modelled on the gold-standard structure. Writes a DRAFT to
// /tmp/jane_v2_draft.md only — no DB write. Review/polish, then commit.
//
// Usage: node scripts/regenerate-jane.mjs
import Anthropic from "@anthropic-ai/sdk";
import { writeFile } from "node:fs/promises";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const MODEL = "claude-sonnet-4-6";

// ── Rich, internally consistent fact-find (fictional) ─────────────────
// Built out from Jane's established persona: 42, British, Dubai 6 years,
// £250k cash un-invested, ~£3,500/mo surplus, Balanced, return to UK to
// retire at 60 on £75k net (today's money).
const FACT_FIND = `
PERSONAL DETAILS
- Name: Jane Doe. Age: 42. DOB: 1984 (TBC). Nationality: British. Health: Good.
- Marital status: Married. Spouse: Mark Doe, 44, British, self-employed IT consultant (own DMCC company), health good.
- Employer: regional FMCG multinational (DMCC, Dubai). Position: Regional Marketing Director. Tax-free UAE employment income.
- Country of residence: UAE (Dubai), 6 years. Expected stay: a further 3–5 years, then permanent return to the UK.
- Dependents: 2 children — Sophie (10) and Tom (8), both at a British-curriculum school in Dubai. UK university intended (~2032 and ~2034).

INCOME & EXPENDITURE (household, GBP equivalent; AED tax-free)
- Jane gross salary: AED ~75,000/month (~£16,000). Spouse net consulting income: ~£3,500/month. Household income ~£168,000/yr.
- Outgoings ~£126,000/yr: villa rent (AED ~220,000/yr, ~£3,300/mo), school fees (AED ~120,000/yr, ~£2,000/mo), living/travel (~£5,000/mo).
- Net monthly surplus: ~£3,500 (~£42,000/yr) currently sitting in cash.

ASSETS
- Cash / instant savings: £250,000 (Emirates NBD + UK current account). 100% un-invested. This is the central issue — idle and exposed to inflation.
- Frozen UK workplace pension (DC): ~£90,000, deferred since Jane left the UK in 2020; no contributions since. Old provider, limited fund range, ~0.75% AMC.
- ISAs (legacy, held but cannot contribute as non-resident): ~£40,000 (stocks & shares).
- General investment account / legacy shares: ~£15,000.
- UK property (buy-to-let, currently let to tenants): value £520,000; BTL mortgage £290,000; equity £230,000; gross rent ~£24,000/yr broadly covering interest. Jane may return to it or trade up on return.

LIABILITIES
- UK BTL interest-only mortgage: £290,000. No other debt.

PROTECTION & ESTATE
- Life cover: employer death-in-service only (~4x salary, ~£300,000) — lapses if she leaves the employer. No personal life or critical illness cover.
- UK Will: outdated (pre-children), not valid for current wishes. No LPAs. No trusts in place.
- Domicile: UK domicile of origin; returning to the UK — full UK IHT exposure on worldwide estate on return.

RISK
- Attitude to risk: Balanced (medium). ATR questionnaire: to be completed. Capacity for loss: good (long horizon, strong surplus, secure income).

OBJECTIVES (priority order)
1. Put the £250,000 cash to work tax-efficiently before inflation erodes it further.
2. Build a retirement pot to retire in the UK at 60 on £75,000/yr NET in today's money.
3. Fund the children's UK university education (~2032 and ~2034).
4. Consolidate and re-energise the frozen £90,000 UK pension.
5. Mitigate UK inheritance-tax exposure on return.
6. Put proper personal protection and a valid UK will in place.

ADVISER: Ben Thompson, Titan Wealth International (cross-border / expat specialist).
PLANNING ASSUMPTIONS to use in modelling (state them): 5.0% p.a. net investment growth, 3% inflation, 4% sustainable withdrawal rate in retirement, retirement age 60 (18-year horizon).
`;

const SYSTEM = `You are TWI Report Generator, an AI report-writing assistant for Titan Wealth International advisers. You draft bespoke, client-facing financial assessment reports as a SLIDE DECK in the adviser's voice.

OUTPUT FORMAT
- Output well-structured markdown. Each top-level "## " heading is ONE slide. Use short paragraphs, bold for key figures, and GFM tables where they add clarity.
- This is a designed, branded deck, not a flat document. Use the fenced chart blocks below wherever figures support them, to SHOW how numbers were derived. Each block must contain valid JSON only, placed immediately under the heading it illustrates. Only chart figures that are present in or directly derived from the inputs — never fabricate data to fill a chart.
- Ground every figure in the provided fact-find. Where a specific number is genuinely unknown, leave a [tk] placeholder. Do not invent fund names or performance figures.

CHART BLOCKS
A row of headline stat cards:
\`\`\`advisens-callouts
{ "items": [ { "label": "Projected at 60", "value": "£1.42m", "sub": "net of fees" }, { "label": "Risk profile", "value": "Balanced" } ] }
\`\`\`
A calculator panel (inputs gathered -> modelled output) — ideal for the retirement-gap and tax slides:
\`\`\`advisens-calc
{ "title": "Retirement gap model", "note": "assumptions -> output", "inputs": [ { "k": "Current capital", "v": "£250,000" } ], "outputs": [ { "k": "Projected pot at 60", "v": "£1.42m", "emphasis": true } ], "footnote": "Illustrative; not a guarantee of future performance." }
\`\`\`
A growth/projection chart (first series highlighted; mark a comparison line with "muted": true):
\`\`\`advisens-growth
{ "title": "Projected wealth path", "note": "GBP · net of fees", "xLabels": ["2026","2035","2044"], "max": 1500, "series": [ { "label": "Recommended", "points": [250,640,1420] }, { "label": "Status quo (cash)", "points": [250,300,360], "muted": true } ] }
\`\`\`
A donut (allocation; values are weights):
\`\`\`advisens-donut
{ "title": "Recommended allocation", "note": "Balanced", "segments": [ { "label": "Global equities", "value": 60 }, { "label": "Fixed income", "value": 34 }, { "label": "Cash", "value": 6 } ] }
\`\`\`
Horizontal comparison bars:
\`\`\`advisens-bars
{ "title": "Retirement income gap", "unit": "£/yr", "items": [ { "label": "Target net income", "value": 75000, "max": 75000, "valueLabel": "£75,000" }, { "label": "Projected from current plan", "value": 48000, "max": 75000, "valueLabel": "£48,000", "muted": true } ] }
\`\`\`

ABOUT TITAN WEALTH INTERNATIONAL (for the firm slides — use real, grounded facts):
Vertically integrated, whole-of-market wealth manager specialising in cross-border advice for British and Western expats. Group assets under advice & management $48B+, ~1,300 staff, 80,000+ regulatory licences across the group. The only international advisory firm dually accredited as a CISI Chartered firm AND a CII International Professional Partner firm. Tagline: Powering Ambitions. Service lines: Investment Management (Model Portfolio Service, Bespoke Portfolio, DFM, cash management), Financial Planning, Pensions & transfers, Tax Planning, Estate Planning & wills, Property & lending, Protection, FX, and Migration/Golden Visa advisory. UK-regulated group entities (FCA) plus international arms (UAE SCA, etc.).`;

const BRIEF = `Draft Jane Doe's full Titan Wealth International financial assessment report as a slide deck. Produce AT LEAST 18, ideally 20–22, top-level "## " slides, in EXACTLY this order. Each is one slide:

1. ## Assessment Report — a confident executive summary of Jane's position, objectives and the recommended direction. Lead with an advisens-callouts row of headline figures (net worth, idle cash, retirement target, horizon).
2. ## Your Adviser & Advice Team — Ben Thompson and the wider Titan advice team (adviser, paraplanner, associate, administration); qualifications (CISI). Warm and personal.
3. ## Why Titan Wealth International — the firm's strength and expat focus (use the $48B+, 1,300 staff, dual accreditation, awards). An advisens-callouts row works well.
4. ## Services Offered — the breadth (Financial Advice, Insurance/Protection, Investment Management) as grouped lists.
5. ## Scope of Services — the full grid of what is and isn't in scope for Jane's engagement.
6. ## Group Regulation — that Titan is a group of regulated entities (FCA in the UK; SCA in the UAE); cross-border advice may involve multiple entities. A short table of representative entities/regulators.
7. ## Asset Overview — Jane's full balance sheet (cash, frozen pension, ISAs, GIA, UK property equity, mortgage), with an advisens-callouts row and a table. State gross and net asset value.
8. ## Client Classification & Risk Profile — classified as an Ordinary (retail) client with the highest regulatory protection; Balanced risk; capacity for loss good; ATR to be completed.
9. ## Your Current Position — personal, family, income and expenditure summary; surplus ~£3,500/mo; flag the 100% cash concentration and the lapsing employer-only life cover.
10. ## UK Tax Position on Return — the UK income-tax bands; convert Jane's £75,000 NET target into the GROSS income and annual tax liability needed at retirement (use an advisens-calc). Note she is tax-free now but UK income tax/CGT/IHT apply on return.
11. ## The Cost of Holding Cash — model £250,000 left in cash vs invested over the horizon; show real (after-inflation) erosion with an advisens-growth (recommended vs status-quo-cash) and frame the urgency.
12. ## Retirement Breakdown — the gap analysis: target net income, pot required at 60 (4% withdrawal), projected from the current plan, and the shortfall; show monthly savings required at a few growth rates. Use an advisens-calc and/or advisens-bars.
13. ## Frozen UK Pension — Consolidation — the £90,000 deferred DC pot, its drawbacks (limited funds, higher AMC), and the case for consolidating into a SIPP.
14. ## SIPP — Recommendation — UK FCA-regulated personal pension wrapper; open architecture, income drawdown, 25% PCLS, inheritable; how it serves Jane's retirement objective.
15. ## Offshore Bond — Tax-Efficient Growth — recommend an international/offshore bond (e.g. RL360 / Standard Life International) for the bulk of the £250k: gross roll-up, 5% tax-deferred withdrawals, multi-currency, portable across the UAE→UK move, trust-wrappable. Include an advisens-growth illustration of the bond growing at 5% net.
16. ## ISA / GIA — UK Wrapper Strategy on Return — using the legacy ISAs and restarting ISA subscriptions once UK-resident; GIA for flexibility; sequencing relative to the bond.
17. ## Education Funding — earmarking part of the surplus/portfolio for the children's UK university costs (~2032 and ~2034); an advisens-bars of estimated cost vs earmarked provision.
18. ## Trust & Estate Planning — UK IHT exposure on return on the worldwide estate; wrapping the offshore bond in trust to remove it from the estate while retaining control; the need for an up-to-date UK will and LPAs. A worked IHT note.
19. ## Protection Review — the gap: employer-only death-in-service that lapses on leaving; recommend personal life and critical-illness cover sized to liabilities and family needs.
20. ## Model Portfolio Service — the recommended investment solution: Titan's discretionary Balanced model, risk-mapped to Jane, reviewed monthly by the Investment Committee. Include an advisens-donut of the Balanced allocation (≈60% equity / 34% fixed income / 6% cash). Keep this to ONE slide — the detailed MPS pack (committee, returns, holdings, model fact sheets) is appended automatically after this slide, so do NOT reproduce it.
21. ## Client Servicing — the ongoing service: direct line to Ben plus a full team, quarterly call, annual review, live wealth tracking via the investor portal, performance vs benchmark and rebalancing. Fee: 0.25% per quarter.
22. ## Next Steps — a brief, warm sign-off with the immediate actions (complete ATR, open the SIPP and bond, update the will, arrange protection) and a personal note from Ben.

IMPORTANT: End the deck with "## Client Servicing" then "## Next Steps". Do NOT add an MPS appendix, committee, model-portfolio returns tables or holdings — those are appended automatically. Write thoroughly; this should read like a real 20-page Titan adviser report, not a summary.`;

console.log(`Generating Jane v2 draft with ${MODEL} (max_tokens 24000, streaming)...`);
const stream = anthropic.messages.stream({
  model: MODEL,
  max_tokens: 24000,
  system: SYSTEM,
  messages: [
    {
      role: "user",
      content: `Adviser: Ben Thompson, Titan Wealth International.\nClient: Jane Doe.\n\n--- FACT-FIND ---\n${FACT_FIND}\n\n--- BRIEF ---\n${BRIEF}\n\nNow draft the full report in markdown.`,
    },
  ],
});
const resp = await stream.finalMessage();

const text = resp.content.filter((b) => b.type === "text").map((b) => b.text).join("\n");
await writeFile("/tmp/jane_v2_draft.md", text);

const headings = text.split("\n").filter((l) => /^##\s+/.test(l));
console.log(`\nTokens in/out: ${resp.usage.input_tokens} / ${resp.usage.output_tokens}`);
console.log(`Chars: ${text.length}`);
console.log(`Stop reason: ${resp.stop_reason}`);
console.log(`\n## slides (${headings.length}):`);
headings.forEach((h, i) => console.log(`  ${i + 1}. ${h.replace(/^##\s+/, "")}`));
console.log(`\nDraft written to /tmp/jane_v2_draft.md`);
