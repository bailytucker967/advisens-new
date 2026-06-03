// Titan Wealth International — standard Model Portfolio Service appendix.
//
// This is the FIRM-LEVEL investment pack that sits in the back of every full
// assessment report. It is the same in every report (the AI body is the
// client-specific part), so it lives here as static markdown rather than being
// generated — a single Sonnet call can't reach this length, and there is no
// reason to spend tokens regenerating identical content each time.
//
// Content is modelled on the master adviser deck's MPS section: investment
// philosophy, the Investment Committee, the market outlook, risk-weighted
// mandates, model-portfolio returns and the per-currency model fact sheets.
// All figures here are firm-level proposition data (returns, allocations,
// holdings of the house models) — not any individual client's data.
//
// Each entry is one slide. The renderer (SlideDeck) splits on `## `, so every
// string must begin with a single `## ` heading. Fenced `advisens-*` blocks
// render as inline SVG charts; GFM tables render as styled tables.
//
// Figures are as at 31 January 2026 (the latest MPS factsheet vintage).

const F = "```"; // a markdown code fence, kept out of the template literals below

export const MPS_APPENDIX_SLIDES: string[] = [
  // 1 — Section opener
  `## The Titan Model Portfolio Service

The pages that follow set out the investment proposition behind the recommendation in this report. Your portfolio is managed within Titan Wealth International's Model Portfolio Service: a range of discretionary, risk-mapped portfolios run by the Titan investment team and reviewed every month by the Investment Committee.

The service spans **five risk profiles**, in **three base currencies**, across passive, active and sustainable strategies, so the portfolio can be matched to both your attitude to risk and the currency you actually think and spend in.

${F}advisens-callouts
{ "items": [
  { "label": "Risk profiles", "value": "5", "sub": "Defensive to Adventurous" },
  { "label": "Base currencies", "value": "GBP · USD · EUR", "sub": "matched to the client" },
  { "label": "Track record from", "value": "Jan 2016", "sub": "10 years live" },
  { "label": "Dealing", "value": "Daily", "sub": "fully liquid" }
] }
${F}

For clients who need a personalised mandate — to exclude certain markets or sectors, or to meet a professional conflict — the **Bespoke Portfolio Service** offers the same process applied to a portfolio built around your specific constraints.`,

  // 2 — Principles
  `## Our Investment Principles

We invest after systematic research and analysis rather than on emotion, and hold to a small set of principles so the proposition does not drift.

- We invest in very high quality assets through third-party investment managers, selected by the TWI Investment Committee.
- Managers are chosen to give a globally diversified approach across multiple asset classes, currencies and sectors.
- We assess risk against return to target strong risk-adjusted returns over the medium to long term.
- The scale of our chosen banks and platforms gives access to **institutional fee rates**.
- We run **open architecture**: we are free to invest in the best funds available across the industry, not an in-house list.
- A high-conviction, active philosophy, combined with low turnover and competitive management rates, keeps the ongoing cost of the portfolio low.
- We favour managers with a consistent record of outperforming their peer group and a medium-to-long-term horizon, which reduces turnover.

### Three things every portfolio is built to be
**Responsible** — quality assets and managers we can stand behind. **Active** — high conviction, not index-hugging. **Low cost** — institutional pricing and low turnover.`,

  // 3 — Approach
  `## Our Investment Approach

Putting those principles into action requires a rigid, repeatable process. It combines hard quantitative work with judgement on the things a screen cannot capture.

### Quantitative analysis
We use a range of analytical tools and data sources to review existing portfolios and to screen new investments. At portfolio level we watch the key risk and performance metrics to make sure every unit of additional risk is justified. At holding level we review each position regularly, checking that its returns still meet expectations and that it earns its place against the alternatives on both performance and diversification.

### The intangibles
Alongside the numbers we weigh several qualitative factors:

- Whether the portfolio is correctly positioned for the current economic environment and our view of where markets go next.
- How each strategy's own investment approach fits our principles, and how we expect it to behave through the cycle.
- The history and beliefs of the management teams running the strategies we invest in. We need full confidence that their philosophy is aligned with ours.`,

  // 4 — Investment Committee
  `## The Investment Committee

The Investment Committee provides governance and oversight of the whole investment proposition. Its members bring experience and qualifications across investment management, financial planning and corporate governance, and together they set the firm's investment strategy.

The committee **meets monthly** to critique the existing proposition and the suitability of the advice given to clients, and convenes on an ad-hoc basis where immediate action is required. It considers proposed changes in light of developments in the global economy, the risk metrics of the existing portfolios, and the performance of each model against its benchmark. Every outcome is communicated directly to all advisers, so any required action is carried out consistently.

### Key objectives
- Provide a decision-making forum where the firm's representatives discuss the investment proposition and service.
- Review the effectiveness of that proposition and agree initiatives to improve it.
- Maintain a control framework so the firm operates within its agreed risk tolerances.`,

  // 5 — Market outlook
  `## Market Outlook

### Macro overview — Q4 2025 into 2026
The final quarter of 2025 tested several popular market themes. Investors first questioned whether the US would keep cutting rates, pushing government bond yields higher, before the central bank struck a more cautious tone on a cooling jobs market and delivered a further cut in December. The powerful rally in AI-related shares came under pressure on worries that prices had run ahead of fundamentals, then steadied after stronger-than-expected technology earnings.

Underlying data held up. Growth was recorded across the US, Canada, the euro area and the UK in the third quarter, and purchasing-manager surveys pointed to continued expansion into December. Inflation moderated — notably in the UK, giving the Bank of England room to cut — while remaining close to target in the euro area and Canada.

Against that backdrop several central banks eased: the US Federal Reserve cut twice, the Bank of England and Bank of Canada once each, while Japan raised rates as expected. Global equities ended the quarter higher, though gains were concentrated in a handful of sectors; bonds also rose, and the US dollar strengthened.

Moving into 2026, investors look less worried about the immediate impact of US trade policy. After several strong years for risk assets, sustaining the advance is likely to prove harder, which makes **selectivity and diversification** more important, not less.`,

  // 6 — Leadership
  `## Investment Leadership

Strategy is set by a senior Asset Allocation Committee and supported by a deep investment bench across the Titan group.

| Name | Role |
|---|---|
| Ian Wood | Chief Investment Officer, Titan Wealth |
| Iain Ramsay | Chief Investment Officer, Titan Wealth International |
| Pete Doherty | Head of Fixed Income, Titan Wealth |
| Alex Flower | Head of Investments, Titan Private Wealth |
| Andrew Deagan | Head of Research, Titan Private Wealth |
| Matthew Cureton | Managing Director, Titan Alternative Investments |
| Sekar Indran | Senior Portfolio Manager, Titan Asset Management |
| Jimmy Crewe | Investment Director, Titan Private Wealth |

**Iain Ramsay** began his career as a discretionary fund manager in the UK before serving as CIO of a global advisory business across the Middle East, US and Europe, and has been pivotal in building the international investment proposition. **Pete Doherty** joined in 2023 to build the in-house fixed income business after senior fixed-income roles at Goldman Sachs and Bank of America, and holds an FE fundInfo Alpha Manager rating. The committee is backed by a further bench of portfolio managers, analysts and researchers across the group.`,

  // 7 — Risk-weighted mandates
  `## Risk-Weighted Mandates

Each risk profile carries a strategic asset allocation, set and reviewed by the Investment Committee. As risk tolerance rises, the equity weighting increases and the fixed-income ballast falls, with a small cash holding kept for liquidity throughout.

| Risk profile | Equity | Fixed income | Cash |
|---|---:|---:|---:|
| Defensive | 32.5% | 62.4% | 5.1% |
| Cautious | 47.2% | 47.8% | 5.0% |
| Balanced | 60.9% | 34.2% | 5.0% |
| Growth | 76.3% | 18.8% | 5.0% |
| Adventurous | 82.8% | 11.9% | 5.3% |

${F}advisens-bars
{ "title": "Strategic equity weighting by risk profile", "unit": "% equity", "items": [
  { "label": "Defensive", "value": 32.5, "max": 82.8, "valueLabel": "32.5%" },
  { "label": "Cautious", "value": 47.2, "max": 82.8, "valueLabel": "47.2%" },
  { "label": "Balanced", "value": 60.9, "max": 82.8, "valueLabel": "60.9%" },
  { "label": "Growth", "value": 76.3, "max": 82.8, "valueLabel": "76.3%" },
  { "label": "Adventurous", "value": 82.8, "max": 82.8, "valueLabel": "82.8%" }
] }
${F}`,

  // 8 — Returns GBP
  `## Model Portfolio Returns — GBP

Cumulative returns of the GBP models to 31 January 2026, net of underlying fund costs. Past performance is not a guide to future returns.

| GBP model | 1m | 3m | 6m | YTD | 1yr | 3yr | 5yr | Since inception |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| Defensive | 0.41 | -0.36 | 3.62 | 0.41 | 5.15 | 20.74 | 13.09 | 20.42 |
| Cautious | 0.40 | -0.83 | 3.65 | 0.40 | 4.35 | 22.16 | 17.81 | 27.12 |
| Balanced | 0.17 | -1.35 | 3.48 | 0.17 | 3.16 | 21.96 | 17.60 | 35.95 |
| Growth | 0.21 | -1.68 | 4.04 | 0.21 | 2.97 | 26.84 | 23.90 | 49.76 |
| Adventurous | 0.38 | -1.75 | 3.89 | 0.38 | 2.42 | 26.93 | 25.65 | 54.43 |

${F}advisens-bars
{ "title": "GBP models — cumulative return since inception (Jan 2016)", "unit": "%", "items": [
  { "label": "Defensive", "value": 20.42, "max": 54.43, "valueLabel": "+20.4%" },
  { "label": "Cautious", "value": 27.12, "max": 54.43, "valueLabel": "+27.1%" },
  { "label": "Balanced", "value": 35.95, "max": 54.43, "valueLabel": "+36.0%" },
  { "label": "Growth", "value": 49.76, "max": 54.43, "valueLabel": "+49.8%" },
  { "label": "Adventurous", "value": 54.43, "max": 54.43, "valueLabel": "+54.4%" }
] }
${F}`,

  // 9 — Returns USD & EUR
  `## Model Portfolio Returns — USD & EUR

The same five risk profiles are available in US dollars and euros, so the portfolio can be held in the currency that matches your income and liabilities. Cumulative returns to 31 January 2026.

### USD models
| USD model | 1yr | 3yr | 5yr | Since inception |
|---|---:|---:|---:|---:|
| Defensive | 8.30 | 22.11 | 16.36 | 29.92 |
| Cautious | 9.22 | 27.64 | 23.17 | 38.86 |
| Balanced | 9.48 | 29.84 | 23.71 | 46.37 |
| Growth | 11.00 | 37.11 | 28.59 | 58.08 |
| Adventurous | 11.77 | 38.36 | 31.75 | 69.14 |

### EUR models
| EUR model | 1yr | 3yr | 5yr | Since inception |
|---|---:|---:|---:|---:|
| Defensive | 2.40 | 16.11 | 10.01 | 12.92 |
| Cautious | 1.73 | 20.08 | 17.56 | 20.22 |
| Balanced | 0.35 | 21.20 | 21.64 | 24.73 |
| Growth | -0.05 | 27.36 | 26.17 | 45.15 |
| Adventurous | -0.76 | 27.11 | 27.42 | 51.62 |`,

  // 10 — Key data
  `## Model Portfolio Key Data

The portfolios tilt towards higher-quality businesses than the broad market. The table compares the underlying equity holdings of the core and satellite funds against the MSCI World index on the measures we care about most.

| Measure | Core fund | Satellite fund | MSCI World |
|---|---:|---:|---:|
| Revenue growth (3yr CAGR) | 8.7% | 11.4% | 2.82% |
| EBIT growth (3yr CAGR) | 15.2% | 23.0% | 10.74% |
| Return on invested capital | 30.3% | 33.7% | 17.15% |
| Return on equity | 39.8% | 41.4% | 17.63% |
| Operating margin | 25.4% | 22.0% | 13.60% |
| Financial leverage | 2.4% | 4.7% | 13.76% |

On the fixed-income side, the core bond allocation runs a **yield to maturity of 5.1%** with a **weighted duration of 4.5 years**, giving an income stream without taking excessive interest-rate risk.`,

  // 11 — GBP Defensive
  `## GBP Defensive — Model Portfolio

**Capital preservation first.** The Defensive model leans on high-quality fixed income with a measured equity holding, for clients who want to protect capital while staying ahead of inflation.

**Launch** Jan 2016 · **Currency** GBP · **Asset class** Multi-asset · **Dealing** Daily · **Core manager** Titan Investment Solutions · **OCF** 0.72% · **Distribution yield** 2.22%

${F}advisens-donut
{ "title": "Current allocation", "note": "GBP Defensive", "segments": [
  { "label": "Equity", "value": 29.48 },
  { "label": "Fixed income", "value": 58.53 },
  { "label": "Cash", "value": 11.97 }
] }
${F}

| | 1yr | 3yr | 5yr | Since inception |
|---|---:|---:|---:|---:|
| Portfolio | 5.15 | 20.74 | 13.09 | 20.42 |
| ARC peer benchmark | 6.22 | 14.73 | 12.88 | — |

Benchmarked against the Asset Risk Consultants (ARC) private-client peer group.`,

  // 12 — GBP Cautious
  `## GBP Cautious — Model Portfolio

**Steady growth with a defensive core.** The Cautious model raises the equity weighting towards a roughly even split, suited to clients with a medium-term horizon who still want a substantial fixed-income ballast.

**Launch** Jan 2016 · **Currency** GBP · **Asset class** Multi-asset · **Dealing** Daily · **Core manager** Titan Investment Solutions · Benchmarked against the ARC peer group.

${F}advisens-donut
{ "title": "Current allocation", "note": "GBP Cautious", "segments": [
  { "label": "Equity", "value": 44.36 },
  { "label": "Fixed income", "value": 44.77 },
  { "label": "Cash", "value": 10.88 }
] }
${F}

| | 1yr | 3yr | 5yr | Since inception |
|---|---:|---:|---:|---:|
| Portfolio | 4.35 | 22.16 | 17.81 | 27.12 |`,

  // 13 — GBP Balanced
  `## GBP Balanced — Model Portfolio

**The core proposition for most clients.** With roughly 60% in equities and the balance in fixed income and cash, the Balanced model targets long-term growth through a full market cycle while keeping volatility in check.

**Launch** Jan 2016 · **Currency** GBP · **Asset class** Multi-asset · **Dealing** Daily · **Core manager** Titan Investment Solutions · Benchmarked against the ARC peer group.

${F}advisens-donut
{ "title": "Current allocation", "note": "GBP Balanced", "segments": [
  { "label": "Equity", "value": 60.87 },
  { "label": "Fixed income", "value": 33.56 },
  { "label": "Cash", "value": 8.70 }
] }
${F}

| | 1yr | 3yr | 5yr | Since inception |
|---|---:|---:|---:|---:|
| Portfolio | 3.16 | 21.96 | 17.60 | 35.95 |`,

  // 14 — GBP Growth
  `## GBP Growth — Model Portfolio

**Growth-led, for a longer horizon.** The Growth model carries around three-quarters in equities, accepting more short-term movement in exchange for higher expected returns over the medium to long term.

**Launch** Jan 2016 · **Currency** GBP · **Asset class** Multi-asset · **Dealing** Daily · **Core manager** Titan Investment Solutions · Benchmarked against the ARC peer group.

${F}advisens-donut
{ "title": "Current allocation", "note": "GBP Growth", "segments": [
  { "label": "Equity", "value": 74.33 },
  { "label": "Fixed income", "value": 17.52 },
  { "label": "Cash", "value": 8.15 }
] }
${F}

| | 1yr | 3yr | 5yr | Since inception |
|---|---:|---:|---:|---:|
| Portfolio | 2.97 | 26.84 | 23.90 | 49.76 |`,

  // 15 — GBP Adventurous
  `## GBP Adventurous — Model Portfolio

**Maximum long-term growth.** The Adventurous model holds the highest equity weighting in the range, for clients with a long horizon and the capacity to ride out larger swings in value in pursuit of the strongest expected return.

**Launch** Jan 2016 · **Currency** GBP · **Asset class** Multi-asset · **Dealing** Daily · **Core manager** Titan Investment Solutions · Benchmarked against the ARC peer group.

${F}advisens-donut
{ "title": "Current allocation", "note": "GBP Adventurous", "segments": [
  { "label": "Equity", "value": 82.12 },
  { "label": "Fixed income", "value": 10.75 },
  { "label": "Cash", "value": 7.14 }
] }
${F}

| | 1yr | 3yr | 5yr | Since inception |
|---|---:|---:|---:|---:|
| Portfolio | 2.42 | 26.93 | 25.65 | 54.43 |`,

  // 16 — Underlying holdings
  `## Underlying Holdings

The models combine low-cost index building blocks with a high-conviction selection of individual companies and bonds. The largest positions in the Balanced model illustrate the quality bias of the equity sleeve and the diversification of the fixed-income sleeve.

### Top equity holdings
| Holding | Weight |
|---|---:|
| Alphabet | 3.01% |
| Eli Lilly | 2.01% |
| TSMC | 1.86% |
| NVIDIA | 1.83% |
| Amazon | 1.53% |
| Hermès | 1.52% |
| Microsoft | 1.44% |
| ASML | 1.40% |
| CBOE Holdings | 1.33% |
| Novo Nordisk | 1.05% |

### Top fixed-income holdings
| Holding | Weight |
|---|---:|
| Lloyds Bank | 2.49% |
| Next Group 5.00% | 2.05% |
| Merck KGaA | 1.95% |
| Athene Global Funding | 1.81% |
| National Australia Bank | 1.81% |
| Morgan Stanley | 1.56% |

Alongside these, the equity sleeve uses index trackers (MSCI World, S&P 500, emerging markets and Asia-Pacific) to keep costs low and diversification broad.`,

  // 17 — Recent buys
  `## Recent Portfolio Activity — Buys

The committee runs an active, high-conviction process. Recent additions reflect quality businesses the team judged to be mispriced relative to their long-term cash generation.

- **Apple** — topped up a high-quality franchise where the market embeds long-term cash-flow growth well below Apple's own track record.
- **JPMorgan Chase** — a best-in-class global bank earning roughly 17% on equity, around double the sector average, yet valued in line with cyclical peers.
- **Lockheed Martin** — long-duration, highly visible cash flows from irreplaceable programmes as defence budgets reset higher across allied nations.
- **Arista Networks** — a software-led, capital-light networking compounder entrenched in cloud and AI data-centre buildout.
- **Procter & Gamble** — a defensive compounder with category-leading brands and resilient free cash flow through the cycle.`,

  // 18 — Recent sells
  `## Recent Portfolio Activity — Sells

The same discipline applies to exits — managing concentration, valuation and changing risk/reward rather than holding on out of habit.

- **Mastercard** — trimmed to manage payments overlap, with Visa and Adyen already held, and reduce concentration in one theme.
- **Salesforce** — reduced an overweight in application software into a period of sector weakness and rate sensitivity.
- **ServiceNow** — rebalanced exposure to high-multiple software after sustained drawdowns into early 2026.
- **Adobe** — exited the satellite holding on a deteriorating risk/reward, with generative-AI disruption and capital intensity rising.
- **UnitedHealth** — cut a small position on a softer near-term outlook for Medicare Advantage margins.`,

  // 19 — Why it matters
  `## What This Means For You

The model that this report recommends does not sit on its own. It is one risk-mapped point on a disciplined, institutionally managed range, backed by the process, governance and people set out in these pages.

- **Matched to you** — your recommended model is mapped to your attitude to risk, your time horizon and the currency you actually use.
- **Actively managed** — held to a high-conviction process and reviewed every month by the Investment Committee, not left to drift.
- **Institutionally priced** — open architecture and the group's scale keep underlying costs low.
- **Fully transparent** — you can see holdings, allocation and performance against benchmark at any time through your portal.

Your adviser will keep the recommendation under review with you at every meeting, and the committee will keep the underlying portfolio under review on your behalf in between.`,
];

// Heading patterns that mark the start of a report's closing section. The MPS
// appendix is spliced in immediately BEFORE the first slide that matches, so it
// lands after the client's recommendation but before "Client Servicing" /
// sign-off. If a deck has no closing slide (e.g. an introduction pitch or a
// short bespoke doc), nothing is inserted.
const CLOSE_HEADING_RE =
  /^#{2,3}\s+.*\b(client servicing|ongoing service|servicing|next steps|sign[\s-]?off|signing off|in summary|in closing|conclusion)\b/i;

function firstHeading(slide: string): string {
  for (const line of slide.split("\n")) {
    if (/^#{2,3}\s+/.test(line.trim())) return line.trim();
  }
  return slide.split("\n")[0] ?? "";
}

/**
 * Given the client-specific body split into slides, return a new slide array
 * with the standard MPS appendix spliced in just before the closing section.
 * Full assessments (which carry a "Client Servicing" close) get the appendix;
 * anything without a recognised close is returned unchanged.
 */
export function withMpsAppendix(bodySlides: string[]): string[] {
  if (!bodySlides || bodySlides.length === 0) return bodySlides;
  const closeIdx = bodySlides.findIndex((s) => CLOSE_HEADING_RE.test(firstHeading(s)));
  if (closeIdx === -1) return bodySlides;
  return [
    ...bodySlides.slice(0, closeIdx),
    ...MPS_APPENDIX_SLIDES,
    ...bodySlides.slice(closeIdx),
  ];
}
