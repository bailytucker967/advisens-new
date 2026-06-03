import Anthropic from "@anthropic-ai/sdk";
import { requireAnthropicKey } from "@/lib/env";
import { PRODUCTS } from "@/lib/titan-library";

// Default model — Sonnet 4.6 is excellent for structured report drafting
// and ~5x cheaper than Opus 4.7. Bump specific call sites to Opus when
// quality demands it.
const MODEL = "claude-sonnet-4-6";

export function getAnthropic() {
  return new Anthropic({ apiKey: requireAnthropicKey() });
}

type Profile = {
  full_name?: string | null;
  firm_name?: string | null;
  job_title?: string | null;
  bio?: string | null;
  jurisdiction?: string | null;
  voice_sample?: string | null;
  instructions?: string | null;
  product_universe?: string | null;
  signature_block?: string | null;
  compliance_disclaimers?: string | null;
};

type Template = {
  name: string;
  report_type: string;
  description?: string | null;
  extracted_text?: string | null;
};

type ReportInputs = {
  title: string;
  report_type: string;
  client_name?: string | null;
  meeting_notes?: string | null;
  transcript?: string | null;
  notetaker_url?: string | null;
  additional_notes?: string | null;
  attachment_text?: string | null;
};

function buildSystemPrompt(profile: Profile | null, template: Template | null) {
  const parts: string[] = [
    "You are TWI Report Generator, an AI report-writing assistant for financial advisers.",
    "Your job is to draft bespoke client-facing reports in the advisor's voice, using their template structure and product universe as the source of truth.",
    "Output the report as well-structured markdown. Use clear section headings (## for sections), short paragraphs, and tables only when they add clarity.",
    "Never invent funds, products, performance figures, or factual data not provided in the inputs. If a number is unknown, leave a clear [tk] placeholder for the advisor to fill in.",
    `\n--- VISUAL DIRECTIVES ---
TWI Report Generator renders the report as a designed document, not a plain page. To make it look like a real adviser-built report — and to SHOW how figures were derived rather than just stating them — embed these fenced JSON blocks where they add value. Use them genuinely (only with figures present in or directly derived from the inputs); never fabricate data to fill a chart.

A row of headline stat cards (use once near the top):
\`\`\`advisens-callouts
{ "items": [ { "label": "Projected at 60", "value": "£1.42m", "sub": "net of fees" }, { "label": "Risk profile", "value": "Balanced" } ] }
\`\`\`

A calculator panel that shows the inputs gathered and the modelled output (ideal for retirement-gap / projection sections — demonstrates the workings):
\`\`\`advisens-calc
{ "title": "Retirement gap model", "note": "assumptions → output", "inputs": [ { "k": "Current capital", "v": "£250,000" }, { "k": "Assumed net growth", "v": "5.5% p.a." } ], "outputs": [ { "k": "Projected pot at 60", "v": "£1.42m", "emphasis": true }, { "k": "Shortfall vs target", "v": "Closed" } ], "footnote": "Illustrative; not a guarantee of future performance." }
\`\`\`

A growth/projection chart (first series is the highlighted one; mark a comparison line with "muted": true):
\`\`\`advisens-growth
{ "title": "Projected wealth path", "note": "GBP · net of fees", "xLabels": ["2026","2035","2044"], "max": 1500, "series": [ { "label": "Recommended", "points": [250,640,1420] }, { "label": "Status quo (cash)", "points": [250,300,360], "muted": true } ] }
\`\`\`

A donut for an asset allocation / portfolio split (values are weights):
\`\`\`advisens-donut
{ "title": "Recommended allocation", "note": "target weights", "segments": [ { "label": "Global equities", "value": 55 }, { "label": "Fixed income", "value": 30 }, { "label": "Alternatives", "value": 10 }, { "label": "Cash", "value": 5 } ] }
\`\`\`

Horizontal comparison bars (e.g. income gap, fee comparison):
\`\`\`advisens-bars
{ "title": "Retirement income gap", "unit": "£/yr", "items": [ { "label": "Target net income", "value": 95000, "max": 95000, "valueLabel": "£95,000" }, { "label": "Projected from current plan", "value": 61000, "max": 95000, "valueLabel": "£61,000", "muted": true } ] }
\`\`\`

Each block must contain valid JSON only. Place a block immediately under the heading it illustrates.`,
  ];

  if (profile) {
    if (profile.instructions) {
      parts.push("\n--- ADVISOR'S STANDING INSTRUCTIONS ---\n" + profile.instructions);
    }
    const bioBits = [
      profile.full_name && `Advisor: ${profile.full_name}`,
      profile.job_title && `Title: ${profile.job_title}`,
      profile.firm_name && `Firm: ${profile.firm_name}`,
      profile.jurisdiction && `Jurisdiction: ${profile.jurisdiction}`,
      profile.bio && `Bio: ${profile.bio}`,
    ].filter(Boolean);
    if (bioBits.length) parts.push("\n--- ADVISOR PROFILE ---\n" + bioBits.join("\n"));
    if (profile.voice_sample)
      parts.push("\n--- ADVISOR'S WRITING VOICE (sample) ---\n" + profile.voice_sample);
    if (profile.product_universe)
      parts.push(
        "\n--- ADVISOR'S PRODUCT UNIVERSE (do not recommend anything outside this list) ---\n" +
          profile.product_universe,
      );
    if (profile.compliance_disclaimers)
      parts.push("\n--- REQUIRED DISCLAIMERS ---\n" + profile.compliance_disclaimers);
    if (profile.signature_block)
      parts.push("\n--- CLOSING SIGNATURE BLOCK ---\n" + profile.signature_block);
  }

  if (template) {
    parts.push(
      `\n--- TEMPLATE: ${template.name} (${template.report_type}) ---`,
      template.description ? `Description: ${template.description}` : "",
      template.extracted_text
        ? "Template content (mirror this structure and tone):\n" + template.extracted_text
        : "[Template file content not yet parsed — use a standard structure for this report type.]",
    );
  }

  return parts.filter(Boolean).join("\n");
}

function buildUserPrompt(inputs: ReportInputs) {
  return [
    `Draft a new ${inputs.report_type} titled "${inputs.title}".`,
    inputs.client_name ? `Client: ${inputs.client_name}` : "",
    "",
    "--- MEETING NOTES ---",
    inputs.meeting_notes || "(none provided)",
    "",
    "--- TRANSCRIPT ---",
    inputs.transcript || "(none provided)",
    "",
    inputs.notetaker_url ? `Notetaker recording: ${inputs.notetaker_url}` : "",
    "",
    "--- ADDITIONAL CONTEXT FROM ADVISOR ---",
    inputs.additional_notes || "(none provided)",
    "",
    inputs.attachment_text
      ? "--- TEXT EXTRACTED FROM ATTACHED DOCUMENTS ---"
      : "",
    inputs.attachment_text || "",
    "",
    "Now draft the full report in markdown.",
  ]
    .filter(Boolean)
    .join("\n");
}

export async function generateReport({
  profile,
  template,
  inputs,
}: {
  profile: Profile | null;
  template: Template | null;
  inputs: ReportInputs;
}) {
  const anthropic = getAnthropic();
  const system = buildSystemPrompt(profile, template);
  const user = buildUserPrompt(inputs);

  const response = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 8192,
    system,
    messages: [{ role: "user", content: user }],
  });

  const text = response.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("\n");

  return {
    content: text,
    tokensIn: response.usage.input_tokens,
    tokensOut: response.usage.output_tokens,
    model: MODEL,
  };
}

export async function revisedReport({
  profile,
  template,
  previousMarkdown,
  prompt,
}: {
  profile: Profile | null;
  template: Template | null;
  previousMarkdown: string;
  prompt: string;
}) {
  const anthropic = getAnthropic();
  const system =
    buildSystemPrompt(profile, template) +
    "\n\n--- REVISION TASK ---\nThe advisor has reviewed a previous draft and asked for specific changes. Apply the requested changes faithfully while preserving everything that wasn't asked to change. Return the full revised report in markdown.";

  const user = [
    "--- PREVIOUS DRAFT ---",
    previousMarkdown,
    "",
    "--- ADVISOR'S REQUESTED CHANGES ---",
    prompt,
    "",
    "Return the full revised report.",
  ].join("\n");

  const response = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 8192,
    system,
    messages: [{ role: "user", content: user }],
  });

  const text = response.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("\n");

  return {
    content: text,
    tokensIn: response.usage.input_tokens,
    tokensOut: response.usage.output_tokens,
    model: MODEL,
  };
}

// ── Introduction agent (Agent 1) ─────────────────────────────────
// Drafts a tailored introduction pitch ahead of a first meeting.
export async function generateIntroPitch({
  profile,
  prospect,
  pieces,
}: {
  profile: Profile | null;
  prospect: {
    name?: string | null;
    location?: string | null;
    situation?: string | null;
    context?: string | null;
  };
  pieces?: { title: string; summary: string }[];
}) {
  const anthropic = getAnthropic();
  const adviser = profile?.full_name || "the Titan adviser";
  const firm = profile?.firm_name || "Titan Wealth International";
  const sections =
    pieces && pieces.length
      ? pieces.map((p) => `- ${p.title}: ${p.summary}`).join("\n")
      : "- Your Advice Team\n- Financial Structure & Security";

  const system = [
    "You are the Introduction agent inside the TWI Report Generator, writing for a Titan Wealth International adviser ahead of a FIRST meeting with a prospective client.",
    "Draft a polished, tailored INTRODUCTION pitch — not a full assessment and not financial advice. Introduce Titan Wealth International and the adviser, and show why Titan fits THIS prospect's situation.",
    "About Titan Wealth International: a vertically integrated wealth manager specialising in cross-border advice for British and Western expats. It offers proprietary investment products and technology alongside whole-of-market access, so advisers are never restricted to in-house solutions. Dual accredited as a CISI Chartered Status firm and a CII International Professional Partner firm. Tagline: Powering Ambitions. Service lines: Investment Management, Financial Planning and pensions, Tax Planning, Estate Planning, Property, Lending, Protection, and Migration advisory.",
    "Assemble the introduction from these sections, one ## heading each, in this order:\n" +
      sections,
    "Tailor every section to THIS client's currency, jurisdiction and assets. Use the client's own currency (a KSA resident's cash is in SAR, not AED; a UAE resident's in AED; show assets in the currency they are actually held in, not GBP by default). Never use a currency, tax regime or example that does not apply to this client.",
    "Write confidently and warmly, in Titan's voice, and output well-structured markdown. This is an introduction, not advice: do NOT invent specific figures, fund names or recommendations. Where a specific number would belong, leave a [tk] placeholder.",
    "You may include ONE fenced ```advisens-callouts block near the top for a row of highlight cards. It must contain valid JSON only.",
  ].join("\n\n");

  const user = [
    `Adviser: ${adviser}, ${firm}.`,
    prospect.name ? `Prospect: ${prospect.name}` : "Prospect: (to be confirmed)",
    prospect.location ? `Location / residency: ${prospect.location}` : "",
    prospect.situation ? `Their situation: ${prospect.situation}` : "",
    prospect.context ? `Context the adviser already has: ${prospect.context}` : "",
    "",
    "Draft the introduction pitch in markdown now.",
  ]
    .filter(Boolean)
    .join("\n");

  const response = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 4096,
    system,
    messages: [{ role: "user", content: user }],
  });

  const text = response.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("\n");

  return {
    content: text,
    tokensIn: response.usage.input_tokens,
    tokensOut: response.usage.output_tokens,
    model: MODEL,
  };
}

// Suggests which Titan products fit, from the meeting notes (the "agent
// suggests, you adjust" step). Returns validated product ids.
export async function suggestProducts({
  notes,
  transcript,
  angle,
}: {
  notes?: string | null;
  transcript?: string | null;
  angle?: string | null;
}): Promise<string[]> {
  const anthropic = getAnthropic();
  const catalog = PRODUCTS.map((p) => `${p.id}: ${p.title} — ${p.relevance}`).join("\n");
  const system =
    "You select which Titan products fit a client based on the meeting notes. Reply with ONLY a JSON array of product ids drawn from the catalog. No prose, no markdown.";
  const user = [
    "Catalog (id: name — when relevant):",
    catalog,
    "",
    "Meeting notes:",
    notes || "(none)",
    transcript ? `\nTranscript:\n${transcript}` : "",
    angle ? `\nAdviser's angle: ${angle}` : "",
    "",
    'Return the fitting product ids as a JSON array, e.g. ["sipp","offshore-bond"].',
  ]
    .filter(Boolean)
    .join("\n");

  const response = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 200,
    system,
    messages: [{ role: "user", content: user }],
  });
  const text = response.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("");
  try {
    const m = text.match(/\[[\s\S]*\]/);
    const ids: unknown = m ? JSON.parse(m[0]) : [];
    return Array.isArray(ids)
      ? ids.filter(
          (x): x is string =>
            typeof x === "string" && PRODUCTS.some((p) => p.id === x),
        )
      : [];
  } catch {
    return [];
  }
}
