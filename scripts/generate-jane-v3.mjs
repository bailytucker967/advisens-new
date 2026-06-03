// Jane Doe v3 — lengthen to ~27 client slides mirroring Michael's structure
// (with Jane-specific swaps). Writes DRAFT to /tmp/jane_v3_draft.md.
import { generateDeck, CHART_DIRECTIVES, TITAN_FACTS, VISUAL_STYLE } from "./gen-common.mjs";

const FACT_FIND = `
PERSONAL DETAILS
- Name: Jane Doe. Age: 42. Nationality: British. Health: Good.
- Marital status: Married. Spouse: Mark Doe, 44, British, self-employed IT consultant (own DMCC company), health good.
- Employer: regional FMCG multinational (DMCC, Dubai). Position: Regional Marketing Director. Tax-free UAE employment income.
- Country of residence: UAE (Dubai), 6 years. Definite plan: permanent return to the UK to retire at 60 (18-year horizon).
- Dependents: 2 children — Sophie (10) and Tom (8), British-curriculum school in Dubai. UK university intended (~2032 and ~2034).

INCOME & EXPENDITURE (household, GBP equivalent; tax-free in the UAE)
- Jane salary ~AED 75,000/month (~£16,000 = ~£192,000/yr). Mark ~£3,500/month (~£42,000/yr). Household income ~£234,000/yr.
- Outgoings ~£192,000/yr (villa rent ~£3,300/mo, school fees ~£2,000/mo, living ~£10,700/mo). Net surplus ~£3,500/mo (~£42,000/yr) sitting in cash.

ASSETS
- Cash: £250,000 (Emirates NBD + UK), 100% un-invested — the central issue.
- Frozen UK workplace pension (DC): ~£90,000, deferred since 2020, limited fund range, ~0.75% AMC.
- Legacy ISAs: ~£40,000 (cannot contribute as non-resident). GIA/legacy shares: ~£15,000.
- UK buy-to-let property: value £520,000; interest-only BTL mortgage £290,000; equity £230,000; gross rent ~£24,000/yr.

LIABILITIES: UK BTL interest-only mortgage £290,000. Gross assets ~£915,000; net of mortgage ~£625,000.

PROTECTION & ESTATE: employer death-in-service only (~£300,000, lapses on leaving); no personal life or critical-illness cover. UK domicile; outdated pre-children will, no LPAs, no trusts. Full UK IHT exposure on return.

NATIONAL INSURANCE: Jane stopped UK NI contributions when she left in 2020 — likely has gaps in her record affecting State Pension entitlement; voluntary Class 2/3 top-ups should be checked.

RISK: Balanced (medium). ATR to be completed. Capacity for loss good.

OBJECTIVES: (1) put the £250k cash to work tax-efficiently; (2) retire in the UK at 60 on £75,000/yr NET (today's money); (3) fund the children's UK university; (4) consolidate the frozen £90k pension; (5) mitigate UK IHT on return; (6) protection + valid will. Structure must work across the UAE->UK move.

ADVISER: Ben Thompson, Titan Wealth International.
PLANNING ASSUMPTIONS to state: 5.0% net growth, 3% inflation, 4% withdrawal, retire 60 (18-yr horizon).
`;

const SYSTEM = `You are TWI Report Generator, an AI report-writing assistant for Titan Wealth International advisers. You draft bespoke, client-facing financial assessment reports as a SLIDE DECK in the adviser's voice.

OUTPUT FORMAT
- Output well-structured markdown. Each top-level "## " heading is ONE slide. Use short paragraphs, bold for key figures, and GFM tables where they add clarity. Do NOT begin with a single # title block — start with the first "## " slide.
- This is a designed, branded deck. Use the chart blocks below wherever figures support them, to SHOW how numbers were derived. Ground every figure in the fact-find; use [tk] for genuinely unknown numbers. Do not invent fund names or performance figures.

${CHART_DIRECTIVES}

${TITAN_FACTS}

${VISUAL_STYLE}`;

const BRIEF = `Draft Jane Doe's full Titan Wealth International financial assessment report as a slide deck. Produce 26–27 top-level "## " slides, in EXACTLY this order. Each is one slide:
1. ## Assessment Report — confident executive summary; lead with an advisens-callouts row (net worth, idle cash, retirement target, horizon).
2. ## Your Adviser & Advice Team — Ben Thompson + the Titan team (give plausible names); CISI-qualified; whole-of-market.
3. ## Why Titan Wealth International — firm strength and expat focus (advisens-callouts: $48B+, ~1,300 staff, dual accreditation).
4. ## Services Offered — grouped lists (Financial Planning, Investment Management, Pensions & Transfers, Protection, Property & Lending).
5. ## Scope of Services — a table of what is / isn't in scope for this engagement.
6. ## Group Regulation — Titan as a regulated group (FCA UK; SCA UAE); cross-border advice may involve multiple entities; short table.
7. ## Asset Overview — full balance sheet (cash, frozen DC pension, ISAs, GIA, UK property equity, mortgage); advisens-callouts + table; gross and net.
8. ## Client Classification & Risk Profile — Ordinary (retail) client; Balanced risk; capacity for loss good; ATR to be completed.
9. ## Your Current Position — personal, family, income (~£234k) and expenditure; ~£3,500/mo surplus; flag the 100% cash concentration and the lapsing employer life cover.
10. ## Your UK Return — Timeline & Transition — Jane returns to the UK to retire at 60; lay out the runway and what changes at the point of return (tax residence, CGT, ISA access); the principle of building structures now that travel seamlessly home. A simple timeline table.
11. ## UK Tax Position on Return — UK income-tax bands; convert the £75,000 NET target to GROSS and annual tax (advisens-calc); note CGT/IHT apply on return; tax-free now in the UAE.
12. ## The Cost of Holding Cash — model £250,000 in cash vs invested over the horizon (advisens-growth, recommended vs cash-after-inflation); urgency.
13. ## Retirement & Financial Independence — gap analysis: target net income, pot required at 4%, projected, shortfall; monthly savings required. advisens-calc + advisens-bars.
14. ## Cashflow Forecast — a forward view of total investable wealth over 18 years, with school fees rolling off (2034); advisens-growth recommended vs status quo.
15. ## Frozen UK Pension — Consolidation — the £90,000 deferred DC pot, drawbacks, and the case to consolidate into a SIPP.
16. ## SIPP — Recommendation — UK FCA-regulated personal pension; open architecture, drawdown, 25% PCLS, inheritable; invested in the Titan Balanced model.
17. ## Offshore Bond — Tax-Efficient Growth — recommend an international bond (RL360 / Standard Life International) for the £250k: gross roll-up, 5% tax-deferred withdrawals, multi-currency, portable across the move, trust-wrappable. advisens-growth illustration.
18. ## ISA / GIA — UK Wrapper Strategy on Return — legacy ISAs/GIA and the sequencing once UK-resident; a wrapper-priority table.
19. ## UK State Pension & National Insurance — Jane's NI gaps since leaving the UK; checking the State Pension forecast; voluntary Class 2/3 contributions to restore entitlement; how the State Pension reduces the private drawdown requirement from 67.
20. ## Education Funding — the two children's UK university costs (~2032, ~2034); advisens-bars of estimated cost vs earmarked provision.
21. ## Currency & Repatriation Planning — Jane earns and holds AED today but retires in GBP; the plan to glidepath currency exposure toward sterling as 2044 approaches, and manage the AED->GBP transition; the offshore bond's multi-currency flexibility.
22. ## Trust & Estate Planning — UK IHT exposure on return on the worldwide estate; a worked IHT note; offshore bond in trust; urgent will rewrite and LPAs; pensions-into-IHT from April 2027.
23. ## Protection Review — the gap (employer-only cover that lapses; no CIC/IP); recommend personal life and critical-illness cover sized to liabilities and family; current-vs-recommended table.
24. ## Model Portfolio Service — recommend Titan's discretionary Balanced model, risk-mapped to Jane, reviewed monthly by the Investment Committee; advisens-donut (~60% equity / 34% fixed income / 6% cash). ONE slide only — the detailed MPS pack is appended automatically after this slide, so do NOT reproduce committee/returns/holdings.
25. ## Implementation Roadmap — a priority-ordered table of every recommendation (action, owner, timing).
26. ## Client Servicing — ongoing service: direct line to Ben + team, quarterly call, annual review, live portal, performance vs benchmark, rebalancing. Fee: 0.25% per quarter.
27. ## Next Steps — a brief, warm sign-off with the immediate actions and a personal note from Ben.

IMPORTANT: End with "## Client Servicing" then "## Next Steps". Do NOT add an MPS appendix/committee/returns/holdings — those are appended automatically. Use the current year 2026 and retirement year 2044 consistently. CRITICAL — follow the STYLE rules above: every slide must LEAD WITH A VISUAL (callouts/chart/table) and carry at most a one-line intro plus 3–4 short bullets. No paragraphs, no padding. This is a presentation deck, not a written suitability report.`;

await generateDeck({
  label: "Jane Doe v3",
  maxTokens: 28000,
  outPath: "/tmp/jane_v3_draft.md",
  system: SYSTEM,
  user: `Adviser: Ben Thompson, Titan Wealth International.\nClient: Jane Doe.\n\n--- FACT-FIND ---\n${FACT_FIND}\n\n--- BRIEF ---\n${BRIEF}\n\nNow draft the full report in markdown.`,
});
