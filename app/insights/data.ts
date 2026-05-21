export type ContentType = "article" | "social" | "ad";

export interface InsightItem {
  id: string;
  type: ContentType;
  title: string;
  excerpt: string;
  fullContent?: string;
  slug?: string;
  date: string;
  readTime?: string;
  platform?: string;
  tags: string[];
  externalUrl?: string;
}

const LI = "https://www.linkedin.com/company/advisensplatform/";

export const insights: InsightItem[] = [
  {
    id: "1",
    type: "article",
    title: "How to Vet a Financial Advisor Before Signing Anything",
    excerpt:
      "Most people spend more time researching a new phone than they do figuring out how to vet a financial advisor. In the GCC especially, the cost of choosing the wrong advisor is high.",
    slug: "how-to-vet-a-financial-advisor",
    date: "10 May 2026",
    readTime: "8 min read",
    tags: ["GCC", "Financial Advice", "Expats"],
    externalUrl: "https://advisens.com/insights/how-to-vet-a-financial-advisor",
  },
  {
    id: "2",
    type: "social",
    title: "Introducing Advisens",
    excerpt:
      "Most people shake hands with a financial advisor after a 30-minute meeting and sign on the dotted line. No credential check. No fee structure comparison.",
    fullContent: `Most people shake hands with a financial advisor after a 30-minute meeting and sign on the dotted line.

No credential check. No fee structure comparison. No idea how that advisor gets paid or whose interests they're actually serving.

In the GCC, that's an expensive habit.

Advisens was built to change the starting point.

Submit your financial situation anonymously. Multiple advisors respond with how they'd approach your case — their methodology, their priorities, their fee philosophy.

You see how they think before they know who you are.

No meeting scheduled. No identity revealed. No sales pitch delivered.

That's where vetting should begin.`,
    date: "10 May 2026",
    platform: "LinkedIn",
    tags: ["Brand", "Intro"],
    externalUrl: LI,
  },
  {
    id: "3",
    type: "social",
    title: "The Phone Analogy",
    excerpt:
      "You spent more time researching your last phone than most people spend vetting their financial advisor. The stakes aren't comparable. The process should be.",
    fullContent: `You spent more time researching your last phone than most people spend vetting their financial advisor.

You compared specs. Read reviews. Checked the return policy.

Then you handed someone influence over your savings, your retirement, and your investment decisions after one meeting.

The stakes aren't comparable. The process should be.

Before your next advisor meeting — see how they think first.`,
    date: "14 May 2026",
    platform: "LinkedIn",
    tags: ["Financial Advice", "GCC"],
    externalUrl: LI,
  },
  {
    id: "4",
    type: "social",
    title: "The 4 Fee Models",
    excerpt:
      "Your financial advisor's fee structure tells you more than their credentials. There are 4 models — here's what each one means for you.",
    fullContent: `Your financial advisor's fee structure tells you more than their credentials.

There are 4 models. Here's what each one means for you:

AUM (% of assets managed)
They earn more as your portfolio grows. Incentives are broadly aligned — but they may avoid strategies that reduce assets under their management.

Hourly / flat fee
They earn the same regardless of what they recommend. Closest to pure objectivity.

Commission
They earn when they place you in a product. The product provider pays them — not you. That's exactly why it deserves the most scrutiny.

Hybrid
A mix of the above. Ask which part of their income comes from which source.

The question isn't just "what do you charge?"

It's "what happens to your income based on what you recommend to me?"

If that question makes your advisor uncomfortable — pay attention to that reaction.`,
    date: "18 May 2026",
    platform: "LinkedIn",
    tags: ["Financial Advice", "Education"],
    externalUrl: LI,
  },
  {
    id: "5",
    type: "social",
    title: "5 Red Flags in an Advisor Meeting",
    excerpt:
      "5 things a financial advisor says that should make you stop the meeting. Confident, transparent advisors welcome direct questions.",
    fullContent: `5 things a financial advisor says that should make you stop the meeting:

1. "I always act in your best interest" — without offering it in writing
2. Guaranteed return language — any advisor using this phrase is either wrong or dishonest
3. Urgency framing — "this offer won't be available next week"
4. Product recommendations before they've asked a single question about your situation
5. Evasiveness when asked exactly how they're compensated

Confident, transparent advisors welcome direct questions.

The ones who deflect have already told you something important.`,
    date: "22 May 2026",
    platform: "LinkedIn",
    tags: ["Financial Advice", "Red Flags"],
    externalUrl: LI,
  },
  {
    id: "6",
    type: "social",
    title: "GCC Expat Financial Planning",
    excerpt:
      "If you're an expat managing finances across two countries, your advisor needs to understand both. Specialisation matters.",
    fullContent: `If you're an expat managing finances across two countries, your advisor needs to understand both.

UAE savings alongside a UK pension. US retirement accounts. End-of-service gratuity decisions. Cross-border tax implications.

An advisor who has never handled dual-country planning isn't the right fit — regardless of how impressive their credentials look on paper.

Specialisation matters. In the GCC, where offshore investment products with hidden lock-in periods and steep surrender charges are common, the cost of the wrong advisor isn't just a bad return.

It's years of being trapped in something you didn't fully understand when you signed it.

Ask for specialisation directly. Before you reveal anything personal.`,
    date: "26 May 2026",
    platform: "LinkedIn",
    tags: ["Expats", "GCC", "Cross-border"],
    externalUrl: LI,
  },
  {
    id: "7",
    type: "social",
    title: "What If You Could See How Advisors Think?",
    excerpt:
      "What if you could see how 3 different financial advisors would handle your situation — before any of them knew your name?",
    fullContent: `What if you could see how 3 different financial advisors would handle your situation — before any of them knew your name?

No meeting. No identity revealed. No sales pitch.

Just their methodology, laid out side by side.

You'd know immediately who leads with products and who leads with planning. Who asks the right questions. Whose fee philosophy you trust.

That informed position is what every first advisor meeting should start from.

That's what Advisens is for.`,
    date: "30 May 2026",
    platform: "LinkedIn",
    tags: ["Brand", "Platform"],
    externalUrl: LI,
  },
  {
    id: "12",
    type: "social",
    title: "The Surrender Period Trap",
    excerpt:
      "You didn't know it was in the small print. Most offshore investment products sold to expats in the GCC come with surrender periods — often 10, 15, or 25 years.",
    fullContent: `You didn't know it was in the small print.

Most offshore investment products sold to expats in the GCC come with surrender periods — often 10, 15, or 25 years.

Exit early and you lose a significant portion of what you put in. Sometimes everything from the first few years.

The advisor who sold it earned a commission upfront. Your money is locked in — and theirs has already left.

This isn't a rare edge case. It's the standard structure for a category of product that has been sold aggressively to mobile professionals who don't intend to stay in one place for decades.

Before you sign anything — understand the exit terms.

Advisens was built for exactly this kind of situation. Submit your case anonymously. See how qualified advisors would approach your position — before any of them know who you are.`,
    date: "13 May 2026",
    platform: "LinkedIn",
    tags: ["Offshore Products", "GCC", "Expats"],
    externalUrl: LI,
  },
  {
    id: "14",
    type: "social",
    title: "The 41-Year-Old Expat",
    excerpt:
      "A 41 year old expat in Dubai sat across from a financial advisor. Felt understood. Signed a 25 year savings plan. Three years later he moved back to the UK. Surrender charges: £18,000.",
    fullContent: `A 41 year old expat in Dubai sat across from a financial advisor.

Felt understood.

Signed a 25 year savings plan.

Left feeling sorted.

Three years later he moved back to the UK.

Surrender charges: £18,000.

The advisor: unreachable.

This isn't a rare story.

It's the most common one we hear from people in the GCC.

The problem wasn't that he chose the wrong advisor.

The problem was he had no way to evaluate the approach before he committed to it. No second opinion. No comparison. No understanding of what the fee structure actually meant for him long term.

Just a confident conversation and a signature.

Advisens exists for the moment before that signature.

Submit your situation anonymously. See how multiple advisors would actually approach your case: their thinking, their fees, their priorities; before anyone knows who you are.

You choose the approach first.

The advisor second.

That's the order it should always happen in.`,
    date: "21 May 2026",
    platform: "LinkedIn",
    tags: ["Expats", "GCC", "Offshore Products"],
    externalUrl: LI,
  },
  {
    id: "13",
    type: "social",
    title: "The Information Asymmetry",
    excerpt:
      "The first time you meet a financial advisor, the information gap is entirely in their favour. They know exactly how they get paid. You walk in knowing almost nothing about them.",
    fullContent: `The first time you meet a financial advisor, the information gap is entirely in their favour.

They know exactly how they get paid.
They know which products carry the highest commission.
They know what questions to ask to move you toward a decision.

You walk in knowing almost nothing about them.

That's not an accident. It's how the industry was designed.

Advisens flips it.

Submit your situation anonymously. See how multiple advisors would actually approach your case — their methodology, their fee structure, their priorities — before anyone schedules a meeting.

You walk into the first conversation already knowing how they think.

That's a different position to negotiate from.`,
    date: "14 May 2026",
    platform: "LinkedIn",
    tags: ["Financial Advice", "GCC", "Brand"],
    externalUrl: LI,
  },
  {
    id: "8",
    type: "ad",
    title: "See How Advisors Think. Stay Anonymous.",
    excerpt:
      "Most people spend more time researching a new phone than vetting their financial advisor. In the GCC, that's a costly mistake.",
    fullContent: `Introductory text:
Most people spend more time researching a new phone than vetting their financial advisor. In the GCC, that's a costly mistake. Commission-driven products with hidden lock-in periods get sold to expats every day. Getting out takes years.

Advisens lets you see how multiple qualified advisors would approach your situation — completely anonymously — before you ever schedule a meeting.

Headline: See How Advisors Think. Stay Anonymous.
CTA: Learn More`,
    date: "10 May 2026",
    platform: "LinkedIn Ad",
    tags: ["LinkedIn", "Brand Awareness"],
    externalUrl: LI,
  },
  {
    id: "9",
    type: "ad",
    title: "Unbiased Financial Advice. Stay Anonymous.",
    excerpt:
      "In the GCC, commission-driven advisory culture is the norm, not the exception. The advisor who shook your hand may earn more when you're in a worse product.",
    fullContent: `Introductory text:
In the GCC, commission-driven advisory culture is the norm, not the exception. The advisor who shook your hand may earn more when you're in a worse product.

Before your next meeting, see how multiple qualified advisors would actually approach your case — no identity revealed, no sales pitch delivered.

Headline: Unbiased Financial Advice. Stay Anonymous.
CTA: Learn More`,
    date: "10 May 2026",
    platform: "LinkedIn Ad",
    tags: ["LinkedIn", "Brand Awareness"],
    externalUrl: LI,
  },
  {
    id: "10",
    type: "ad",
    title: "Compare Advisors Before You Meet Any of Them",
    excerpt:
      "Submit your financial situation anonymously. Multiple qualified advisors respond with how they'd approach your case.",
    fullContent: `Introductory text:
Submit your financial situation anonymously. Multiple qualified advisors respond with how they'd approach your case — their priorities, planning sequence, and fee philosophy. No meeting scheduled. No identity revealed. No sales pitch delivered.

You decide who aligns with your goals. Then, and only then, do you decide who to meet.

Headline: Compare Advisors Before You Meet Any of Them
CTA: Learn More`,
    date: "10 May 2026",
    platform: "LinkedIn Ad",
    tags: ["LinkedIn", "Brand Awareness"],
    externalUrl: LI,
  },
  {
    id: "11",
    type: "ad",
    title: "Vet Your Advisor Before They Know Your Name",
    excerpt:
      "What happens to your advisor's income based on what they recommend to you? If that question makes them uncomfortable — that's your answer.",
    fullContent: `Introductory text:
What happens to your advisor's income based on what they recommend to you? If that question makes them uncomfortable — that's your answer.

Advisens lets you evaluate advisor methodology completely anonymously. Submit your situation. See how multiple qualified advisors respond. Decide who earns a meeting.

Headline: Vet Your Advisor Before They Know Your Name
CTA: Learn More`,
    date: "10 May 2026",
    platform: "LinkedIn Ad",
    tags: ["LinkedIn", "Brand Awareness"],
    externalUrl: LI,
  },
];
