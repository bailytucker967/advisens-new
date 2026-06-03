// Annual REVIEW PACK for an existing Titan client. Ends with Client Servicing /
// Next Steps so the standard MPS appendix (current house models) splices in —
// exactly what a review should show. Writes DRAFT to /tmp/review_draft.md.
import { generateDeck, CHART_DIRECTIVES, TITAN_FACTS, VISUAL_STYLE } from "./gen-common.mjs";

const FACT_FIND = `
EXISTING CLIENT — ANNUAL REVIEW
- Name: Catherine Wells. Age: 54. Nationality: British. Single. Health: good.
- Senior Legal Counsel at a multinational (DIFC, Dubai); ~9 years in the UAE, tax-free income ~£210,000/yr.
- Titan client since February 2024 (this is her second annual review, covering the 12 months to date, mid-2026).
- Objective set at onboarding: retire in the UK at 60 on ~£70,000/yr NET (today's money); 6-year horizon. Risk profile: Balanced.

CURRENT TITAN ARRANGEMENTS (managed by Titan)
- Offshore bond (RL360): ~£420,000, invested in the Titan Balanced Model Portfolio.
- Consolidated SIPP: ~£310,000 (two former UK pensions consolidated at onboarding), Titan Balanced Model Portfolio.
- Retained legacy ISAs: ~£95,000.
- Total invested with Titan: ~£730,000 (bond + SIPP); plus ISAs ~£95,000.
- UK buy-to-let property: value ~£540,000; interest-only mortgage ~£180,000; equity ~£360,000.

SINCE LAST REVIEW (the 12 months covered)
- Markets: positive year; the Titan GBP Balanced model returned broadly in line with its ARC peer benchmark (use the firm's Balanced figures: ~1-yr 3.16%, 3-yr 21.96%, 5-yr 17.60%, since inception 35.95% — these are house figures as at Jan 2026; frame the review around them).
- Catherine received a salary increase and raised her monthly contributions to the bond from £2,000 to £3,500.
- New consideration: she is now exploring whether she could bring retirement forward to 58 (a 4-year horizon).
- No change to risk profile (remains Balanced); ATR re-confirmed.

PLANNING ASSUMPTIONS to state: 5.0% net growth, 3% inflation, 4% sustainable withdrawal. Use current year 2026; retirement target 60 (2032), with a 58 (2030) scenario tested.

ADVISER: Ben Thompson, Titan Wealth International.
`;

const SYSTEM = `You are TWI Report Generator, drafting an annual REVIEW PACK for an EXISTING Titan Wealth International client, as a SLIDE DECK in the adviser's voice. This reviews an established plan against Titan's house view — it is not a first assessment.

OUTPUT FORMAT
- Well-structured markdown. Each top-level "## " heading is ONE slide. Short paragraphs, bold for key figures, GFM tables where useful. Start with the first "## " slide (no # title block).
- Use the chart blocks below to show performance, progress and projections. Ground every figure in the inputs; use [tk] only for genuinely unknown numbers. Do not invent fund names or performance figures beyond those provided.
- Tone: a confident, reassuring annual check-in for a client who is on track — celebrate progress, be straight about what to watch, and recommend clear next actions.

${CHART_DIRECTIVES}

${TITAN_FACTS}

${VISUAL_STYLE}`;

const BRIEF = `Draft Catherine Wells's annual review pack as a slide deck. Produce 13–15 top-level "## " slides, in this order:
1. ## Review Pack — an executive summary of the year and the headline message (on track; what changed). Lead with an advisens-callouts row (total managed, 1-yr return, progress to goal, years to retirement).
2. ## Your Adviser & Advice Team — Ben Thompson + the Titan team; continuity of service.
3. ## Since Your Last Review — what has changed over the 12 months (markets, her increased contributions, the new "retire at 58?" question); a concise table or callouts.
4. ## Portfolio Performance — the Titan Balanced model's performance over the period vs its ARC peer benchmark; use an advisens-growth and/or a returns table with the house Balanced figures (1-yr/3-yr/5-yr/since inception). Net of fees.
5. ## Progress Against Your Objectives — tracking toward the £70,000 NET retirement goal; an advisens-bars or advisens-calc showing where she is vs plan.
6. ## Your Current Position — updated balance sheet (bond, SIPP, ISAs, BTL equity); a table; total wealth.
7. ## Market & House-View Update — the Investment Committee's current view (rate cuts, AI, inflation moderating into 2026; selectivity and diversification) — a short, readable macro paragraph that bridges to the detailed MPS pack appended after this deck.
8. ## Asset Allocation & Rebalancing — her current Balanced allocation (advisens-donut ~60/34/6) and any rebalancing carried out over the year to keep the risk profile on track.
9. ## Bringing Retirement Forward? — test the "retire at 58 instead of 60" scenario: an advisens-calc or advisens-growth comparing the two, and what would need to be true (higher contributions / BTL deployment) to make 58 viable.
10. ## Increased Contributions — the impact of raising her monthly bond contribution from £2,000 to £3,500; an advisens-growth or bars showing the added pot at retirement.
11. ## Fees & Value — what she paid over the year (0.25%/quarter ongoing advice fee) and the service and value delivered against it.
12. ## Model Portfolio Service — confirm the Balanced model remains suitable and risk-mapped to Catherine; advisens-donut. ONE slide only — the detailed MPS pack (committee, returns, holdings, model fact sheets) is appended automatically after this slide, so do NOT reproduce it.
13. ## Recommended Actions — a priority-ordered table (maintain Balanced; keep the higher contributions; decision point on 58 vs 60 at next review; review protection and will; verify NI record); owner and timing.
14. ## Client Servicing — the ongoing service for the year ahead: quarterly calls, annual review, live portal, performance vs benchmark, rebalancing. Fee: 0.25% per quarter.
15. ## Next Steps — a brief, warm close confirming she is on track and the immediate actions, with a personal note from Ben.

IMPORTANT: End with "## Client Servicing" then "## Next Steps". Do NOT add an MPS appendix/committee/returns/holdings yourself — those are appended automatically. Use 2026 as the current year. CRITICAL — follow the STYLE rules above: every slide must LEAD WITH A VISUAL (callouts/chart/table) and carry at most a one-line intro plus 3–4 short bullets. No paragraphs, no padding. This is a presentation deck, not a written suitability report.`;

await generateDeck({
  label: "Review Pack — Catherine Wells",
  maxTokens: 18000,
  outPath: "/tmp/review_draft.md",
  system: SYSTEM,
  user: `Adviser: Ben Thompson, Titan Wealth International.\nClient: Catherine Wells (existing client, annual review).\n\n--- FACT-FIND ---\n${FACT_FIND}\n\n--- BRIEF ---\n${BRIEF}\n\nNow draft the review pack in markdown.`,
});
