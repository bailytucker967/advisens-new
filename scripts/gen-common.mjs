// Shared helpers for the report-generation scripts (Jane v3, intro, review).
// Streams a deck from Anthropic, writes it to a draft file, prints slide list.
import Anthropic from "@anthropic-ai/sdk";
import { writeFile } from "node:fs/promises";

export const MODEL = "claude-sonnet-4-6";
export const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// The fenced chart blocks the renderer understands (used in assessments/reviews).
export const CHART_DIRECTIVES = `CHART BLOCKS — each must contain valid JSON only, placed under the heading it illustrates. Only use figures present in or directly derived from the inputs; never fabricate data to fill a chart.
A row of headline stat cards:
\`\`\`advisens-callouts
{ "items": [ { "label": "Projected at 60", "value": "£1.42m", "sub": "net of fees" } ] }
\`\`\`
A calculator panel (inputs gathered -> modelled output):
\`\`\`advisens-calc
{ "title": "Retirement gap model", "note": "assumptions -> output", "inputs": [ { "k": "Current capital", "v": "£250,000" } ], "outputs": [ { "k": "Projected pot", "v": "£1.42m", "emphasis": true } ], "footnote": "Illustrative; not a guarantee." }
\`\`\`
A growth/projection chart (first series highlighted; mark a comparison line with "muted": true):
\`\`\`advisens-growth
{ "title": "Projected wealth", "note": "GBP · net of fees", "xLabels": ["2026","2032","2038"], "max": 1500, "series": [ { "label": "Recommended", "points": [250,640,1420] }, { "label": "Status quo", "points": [250,300,360], "muted": true } ] }
\`\`\`
A donut (allocation; values are weights):
\`\`\`advisens-donut
{ "title": "Allocation", "note": "Balanced", "segments": [ { "label": "Global equities", "value": 60 }, { "label": "Fixed income", "value": 34 }, { "label": "Cash", "value": 6 } ] }
\`\`\`
Horizontal comparison bars:
\`\`\`advisens-bars
{ "title": "Income gap", "unit": "£/yr", "items": [ { "label": "Target", "value": 75000, "max": 75000, "valueLabel": "£75,000" }, { "label": "Projected", "value": 61000, "max": 75000, "valueLabel": "£61,000", "muted": true } ] }
\`\`\``;

export const TITAN_FACTS = `ABOUT TITAN WEALTH INTERNATIONAL (firm facts — real, grounded): vertically integrated, whole-of-market wealth manager specialising in cross-border advice for British and Western expats. Group assets under advice & management $48B+, ~1,300 staff, 80,000+ regulatory licences across the group. The only international advisory firm dually accredited as a CISI Chartered firm AND a CII International Professional Partner firm. Tagline: Powering Ambitions. Service lines: Investment Management (Model Portfolio Service, Bespoke Portfolio, DFM, cash management), Financial Planning, Pensions & transfers, Tax Planning, Estate Planning & wills, Property & lending, Protection, FX, and Migration/Golden Visa advisory. UK-regulated group entities (FCA) plus international arms (UAE SCA, etc.). Advice team: Ben Thompson (lead adviser, DipFA, CISI), plus a paraplanner, associate adviser and client administrator.`;

// Visual, concise house style — the single most important steer. A Titan
// assessment is a PRESENTATION deck (graphs/tables/images), not a wordy
// suitability report.
export const VISUAL_STYLE = `STYLE — VISUAL & CONCISE (this is the most important instruction, follow it on EVERY slide):
This is a presentation DECK, not a written suitability report. Each slide must be scannable in seconds and feel full and designed, like a Keynote slide.
- LEAD WITH A VISUAL on every slide that involves any figures: an advisens-callouts row, an advisens-growth / advisens-bars / advisens-donut chart, an advisens-calc panel, or a compact GFM table. Show the numbers — do not describe them in prose.
- Keep words to an absolute minimum: at most a single one-line intro under the heading (<= 18 words), and where context is needed, 3-4 SHORT bullet points (<= 12 words each). NEVER write paragraphs. Never more than ~40 words of prose on a slide.
- Cut all hedging, repetition and explanation. Trust the chart/table to make the point.
- Aim for one strong visual + a few crisp bullets per slide. A slide of plain text is a failure.
- NO EMOJIS or decorative glyphs anywhere (no check-marks, crosses, warning triangles, clipboards, or similar symbols). In tables use plain words — "Yes" / "No" / "Partial". Keep it clean, corporate and professional.`;

export async function generateDeck({ system, user, maxTokens, outPath, label }) {
  console.log(`Generating ${label} with ${MODEL} (max_tokens ${maxTokens}, streaming)...`);
  const stream = anthropic.messages.stream({
    model: MODEL,
    max_tokens: maxTokens,
    system,
    messages: [{ role: "user", content: user }],
  });
  const resp = await stream.finalMessage();
  const text = resp.content.filter((b) => b.type === "text").map((b) => b.text).join("\n");
  await writeFile(outPath, text);
  const headings = text.split("\n").filter((l) => /^##\s+/.test(l));
  console.log(`\nTokens in/out: ${resp.usage.input_tokens} / ${resp.usage.output_tokens}`);
  console.log(`Chars: ${text.length} · Stop: ${resp.stop_reason}`);
  console.log(`\n## slides (${headings.length}):`);
  headings.forEach((h, i) => console.log(`  ${i + 1}. ${h.replace(/^##\s+/, "")}`));
  console.log(`\nDraft written to ${outPath}`);
  return { text, usage: resp.usage };
}
