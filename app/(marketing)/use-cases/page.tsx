import { PageHero } from "@/components/marketing/PageHero";
import { Reveal } from "@/components/marketing/Reveal";
import {
  SectionLabel,
  PrimaryCTA,
  SecondaryCTA,
  ArrowRight,
} from "@/components/marketing/ui";

export const metadata = {
  title: "Use cases · TWI Report Generator",
  description:
    "Introduction pitches, full client assessments, review packs and bespoke documents: every document a Titan engagement produces, in Titan's voice and on Titan's templates.",
};

const CASES = [
  {
    tag: "Introduction pitch",
    title: "Walk in already tailored to them",
    body: "Before the first meeting, the engine reads who you are seeing and drafts an introduction built around that prospect: the Titan story, the service lines that fit their situation, and your team. You personalise it, rather than write it from scratch the night before.",
    points: [
      "Built around the prospect",
      "Relevant Titan service lines",
      "On-brand, presentation-ready",
    ],
  },
  {
    tag: "Client assessment",
    title: "From discovery call to full report",
    body: "Hand over the notes or transcript and the engine produces the complete assessment in Titan's template: position, goals, risk profile, the gap analysis and the recommended structure, built around the products and approach you are taking the client down.",
    points: [
      "Retirement & wealth gap analysis",
      "Cross-border tax framing (UK / GCC)",
      "Risk-weighted allocation & rationale",
    ],
  },
  {
    tag: "Review pack",
    title: "Quarterly and annual reviews, in minutes",
    body: "The recurring work that eats the week. The engine pulls the client's history, refreshes performance and market commentary against Titan's house view, and produces a consistent review pack, so every client gets the same standard of care.",
    points: [
      "Portfolio performance & rebalancing",
      "Refreshed against the house view",
      "Consistent across the whole book",
    ],
  },
  {
    tag: "Bespoke documents",
    title: "Anything in the Titan toolkit",
    body: "Cash-flow plans, estate notes, fund-switch rationales, suitability letters. If Titan produces it, teach the engine once from a single example and it reproduces that document to the same standard.",
    points: [
      "Taught from one example",
      "Titan structure & disclaimers",
      "Every document type",
    ],
  },
];

export default function UseCasesPage() {
  return (
    <>
      <PageHero
        index="02"
        kicker="Use cases"
        title="Every document a Titan"
        emphasis="engagement produces."
        intro="From the first introduction to the ongoing reviews, the engine produces what a Titan engagement needs, in Titan's voice and on Titan's templates."
      />

      <section className="bg-cream py-20 md:py-28">
        <div className="mx-auto max-w-5xl px-4 md:px-8">
          <div className="space-y-6">
            {CASES.map((c, i) => (
              <Reveal key={c.tag} delay={((i % 3) + 1) as 1 | 2 | 3}>
                <div className="grid gap-7 rounded-xl border border-mahogany/10 bg-cream-50 p-8 transition-all duration-300 hover:border-gold/40 hover:shadow-[var(--shadow-warm)] md:grid-cols-[1.4fr_1fr] md:p-10">
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-gold-600">
                      {c.tag}
                    </div>
                    <h3 className="mt-3 font-display text-[26px] leading-tight text-mahogany">
                      {c.title}
                    </h3>
                    <p className="mt-4 text-[15px] leading-[1.7] text-mahogany-500">
                      {c.body}
                    </p>
                  </div>
                  <div className="flex flex-col justify-center gap-2.5 border-t border-mahogany/10 pt-5 md:border-l md:border-t-0 md:pl-8 md:pt-0">
                    {c.points.map((p) => (
                      <div
                        key={p}
                        className="flex items-start gap-2.5 text-[13px] text-mahogany"
                      >
                        <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gold" />
                        {p}
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-espresso py-20 text-cream">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-7 px-4 text-center md:px-8">
          <h2 className="font-display text-[30px] font-light leading-tight md:text-[40px]">
            See it build a full{" "}
            <span className="italic text-gold">Titan assessment.</span>
          </h2>
          <div className="flex flex-col gap-3 sm:flex-row">
            <PrimaryCTA href="/login">
              Log in
              <ArrowRight className="transition-transform group-hover:translate-x-0.5" />
            </PrimaryCTA>
            <SecondaryCTA href="/demo" tone="dark">
              Watch the demo
            </SecondaryCTA>
          </div>
        </div>
      </section>
    </>
  );
}
