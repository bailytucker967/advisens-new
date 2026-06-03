// Quick test that ANTHROPIC_API_KEY works and the Claude integration drafts a report.
// Run: node --env-file=.env.local scripts/test-claude.mjs
import Anthropic from "@anthropic-ai/sdk";

const apiKey = process.env.ANTHROPIC_API_KEY;
if (!apiKey) {
  console.error("Missing ANTHROPIC_API_KEY");
  process.exit(1);
}

const anthropic = new Anthropic({ apiKey });

const system = `You are Advisens, an AI report-writing assistant for financial advisers.
Draft bespoke client reports in the advisor's voice. Output well-structured markdown.
Never invent products or figures not provided.

--- ADVISOR ---
Jurisdiction: UAE
Voice: plain, direct English. Conservative tone in market views.`;

const user = `Draft a "new client assessment" report titled "Test Assessment — Jane Doe".

Client: Jane Doe

--- MEETING NOTES ---
Age 42, British expat in Dubai 6 years. Two kids in international school.
Portfolio currently in cash GBP ~£250k. Wants growth-oriented strategy with
some UK tax efficiency. Comfortable with medium risk. Planning to retire in
UK around 60.

Now draft the report in markdown.`;

console.log("Calling Claude Sonnet 4.6...");
const t0 = Date.now();

const response = await anthropic.messages.create({
  model: "claude-sonnet-4-6",
  max_tokens: 2048,
  system,
  messages: [{ role: "user", content: user }],
});

const elapsed = ((Date.now() - t0) / 1000).toFixed(1);
const text = response.content
  .filter((b) => b.type === "text")
  .map((b) => b.text)
  .join("\n");

console.log(`\n✓ ${elapsed}s · in=${response.usage.input_tokens}tok · out=${response.usage.output_tokens}tok\n`);
console.log("=== DRAFT (first 1500 chars) ===");
console.log(text.slice(0, 1500));
console.log(text.length > 1500 ? `\n... (${text.length - 1500} more chars)` : "");
console.log("\n✓ All good.");
