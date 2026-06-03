// Introduction document for a prospect in the diary (first meeting NOT yet held).
// Firm-forward, tailored to the referral context, NO fabricated figures, and NO
// MPS appendix (the closing slide is titled so it does not match the splice).
// Writes DRAFT to /tmp/intro_draft.md.
import { generateDeck, TITAN_FACTS } from "./gen-common.mjs";

const CONTEXT = `
THIS IS A PRE-MEETING INTRODUCTION. The adviser has NOT yet met the prospect; the first meeting is in the diary for next week. Only outline information is known, from the referral and a brief introductory call. Do NOT invent specific figures, holdings, recommendations or projections — this introduces Titan and frames the first meeting. Where a specific number or detail would belong, leave a [tk] placeholder or speak in general terms.

PROSPECT (outline only)
- Name: Andrew Coulson. Approx age: 51. Nationality: British.
- Referred by an existing Titan client. Senior Operations / Projects Director at an energy company in Abu Dhabi; ~11 years in the UAE.
- Married; two older children (one at a UK university, one finishing school).
- Outline picture from the referral: several UK pensions accrued over a long UK and international career; a UK home (mortgage nearly repaid); meaningful cash holdings and some older offshore savings. No structured plan in place.
- Stage of life: starting to think about winding down over the next 3–5 years and a possible permanent return to the UK; wants to understand his options.

ADVISER: Ben Thompson, Titan Wealth International (cross-border / expat specialist).
`;

const SYSTEM = `You are TWI Report Generator, writing a polished, warm INTRODUCTION document for a Titan Wealth International adviser ahead of a FIRST meeting with a prospective client. This is NOT financial advice and NOT a full assessment.

PURPOSE: introduce Titan Wealth International and the adviser, show why Titan fits THIS prospect's situation as a senior British expat weighing a return to the UK, and frame what the first meeting will cover. Build confidence and rapport.

OUTPUT FORMAT
- Well-structured markdown. Each top-level "## " heading is ONE slide. Short, confident paragraphs and tight bullet lists. Use GFM tables sparingly where they add clarity.
- This is an introduction, NOT advice: do NOT invent specific figures, fund names, holdings or recommendations. Speak to how Titan approaches each area and what you will explore together. Use [tk] only if a specific placeholder is genuinely needed. Do NOT use the chart blocks.
- Tailor the currency/jurisdiction framing to a UAE-resident British expat (AED today, UK on return).

${TITAN_FACTS}`;

const BRIEF = `Draft Andrew Coulson's introduction document as a slide deck. Produce 9–11 top-level "## " slides, in this order:
1. ## Introduction — a warm welcome ahead of the first meeting; what this short document is and why Titan looks forward to meeting Andrew (note the referral, without naming the referrer). Set the tone.
2. ## Your Adviser & Advice Team — Ben Thompson (cross-border specialist, DipFA, CISI) and the wider advice team (give plausible names: paraplanner, associate, administrator); the direct, personal relationship.
3. ## Why Titan Wealth International — the firm's strength and expat focus ($48B+ AuA/AuM, ~1,300 staff, the only firm dually CISI Chartered and CII International Professional Partner). Why scale and dual accreditation matter.
4. ## Built for Your Position — the specific cross-border challenges facing a senior British expat in the Gulf weighing a UK return (multiple UK pensions, UAE-to-UK tax transition, IHT as a UK domiciliary, portable structures), and that these are Titan's core business, not edge cases.
5. ## Getting the Structure Right — Titan's approach to the foundations: mapping accounts, income and outgoings; an appropriate emergency reserve; getting the structure and protection right before anything else. General framing, not advice.
6. ## Understanding Your UK Pensions — how UK pensions typically work for expats, the options on relocation, and the considerations around reviewing and potentially consolidating several pots — what Titan will help Andrew assess (with a specialist transfer analysis where a defined benefit scheme is involved).
7. ## Your UK State Pension & National Insurance — how National Insurance works while living abroad, why gaps can arise, voluntary contributions, and checking the State Pension forecast — flagged as something to review.
8. ## Cash & Inflation — the real cost of holding too much cash over time, how much to keep liquid versus put to work, and how Titan thinks about deploying surplus capital tax-efficiently.
9. ## How We Work With You — the ongoing, whole-of-market relationship; one coordinated team across investments, pensions, tax, estate and protection; transparent, fee-based advice (general framing).
10. ## Ahead of Our Meeting — a friendly, practical close: what the first meeting will cover, what (if anything) is helpful to have to hand, and reassurance that there is no obligation. A warm sign-off from Ben.

IMPORTANT: This is an introduction. The final slide must be titled "## Ahead of Our Meeting" (do NOT use "Next Steps", "Client Servicing" or "Sign-off"). Do NOT include an MPS appendix, model portfolios, returns, holdings, or any specific figures. Keep it to ~10 slides.`;

await generateDeck({
  label: "Introduction — Andrew Coulson",
  maxTokens: 8000,
  outPath: "/tmp/intro_draft.md",
  system: SYSTEM,
  user: `Adviser: Ben Thompson, Titan Wealth International.\nProspect: Andrew Coulson (first meeting next week).\n\n--- CONTEXT ---\n${CONTEXT}\n\n--- BRIEF ---\n${BRIEF}\n\nNow draft the introduction document in markdown.`,
});
