import { PageHero } from "@/components/marketing/PageHero";
import { Reveal } from "@/components/marketing/Reveal";
import {
  SectionLabel,
  PrimaryCTA,
  SecondaryCTA,
  ArrowRight,
} from "@/components/marketing/ui";

export const metadata = {
  title: "Why in-house · TWI Report Generator",
  description:
    "Why Titan runs its report engine in-house: it writes in Titan's voice, client data never leaves Titan, it fits the vertically-integrated whole-of-market model, and it holds one standard across every adviser.",
};

const REASONS = [
  {
    t: "It sounds like Titan",
    d: "Trained on Titan's own reports, templates and house view, every document carries Titan's voice and standards. Clients read it as Titan's work.",
  },
  {
    t: "Client data never leaves Titan",
    d: "Generic AI sends client data to an outside model. This runs inside Titan's environment, so nothing about a client is shared or used to train anyone else's system.",
  },
  {
    t: "Whole-of-market, not boxed in",
    d: "It knows Titan's in-house solutions but never restricts the adviser to them. You choose from across the market; the engine builds the document around your choice.",
  },
  {
    t: "Checked against the house view",
    d: "Every figure, product and claim is verified against Titan's product set and compliance library. Anything it cannot confirm is flagged for you, never invented.",
  },
  {
    t: "Hours back to advisers",
    d: "The time lost to formatting, stitching and re-typing goes back to clients. A report that took days reaches review in minutes.",
  },
  {
    t: "Built for cross-border advice",
    d: "Expat tax framing, multi-jurisdiction structures and repatriation planning come built in, the way Titan's expat clients actually need it.",
  },
];

const TRUST = [
  { k: "CISI Chartered", v: "Chartered Status firm, the highest CISI standard" },
  { k: "CII International Partner", v: "International Professional Partner firm" },
  { k: "Data stays in Titan", v: "Per-firm isolation, no shared training" },
  { k: "Regulator-ready", v: "Built for FCA-regulated advice" },
];

export default function WhyPage() {
  return (
    <>
      <PageHero
        index="03"
        kicker="Why in-house"
        title="Why Titan builds this"
        emphasis="in-house."
        intro="Generic AI tools send client data to someone else's model and write in no one's voice. Owning the engine keeps the data inside Titan, puts every document in Titan's house style, and gives every adviser the same standard, from London to Dubai."
      />

      <section className="bg-cream py-20 md:py-28">
        <div className="mx-auto max-w-5xl px-4 md:px-8">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {REASONS.map((r, i) => (
              <Reveal key={r.t} delay={((i % 3) + 1) as 1 | 2 | 3}>
                <div className="h-full rounded-xl border border-mahogany/10 bg-cream-50 p-7 transition-all duration-300 hover:-translate-y-1 hover:border-gold/40 hover:shadow-[var(--shadow-warm)]">
                  <h3 className="font-display text-[19px] leading-snug text-mahogany">
                    {r.t}
                  </h3>
                  <p className="mt-3 text-[13.5px] leading-[1.7] text-mahogany-500">
                    {r.d}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Trust */}
      <section className="relative overflow-hidden bg-espresso py-20 text-cream md:py-28">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(115deg, transparent 0 38px, rgba(138,63,252,0.5) 38px 39px)",
          }}
        />
        <div className="relative mx-auto max-w-5xl px-4 md:px-8">
          <Reveal>
            <SectionLabel index="④" tone="dark">
              Trust &amp; security
            </SectionLabel>
            <h2 className="mt-4 max-w-2xl font-display text-[32px] font-light leading-tight md:text-[42px]">
              Client data never{" "}
              <span className="italic text-gold">leaves Titan.</span>
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-px overflow-hidden rounded-xl border border-cream/[0.08] bg-cream/[0.08] sm:grid-cols-2 lg:grid-cols-4">
            {TRUST.map((t, i) => (
              <Reveal key={t.k} delay={((i % 4) + 1) as 1 | 2 | 3 | 4} className="bg-espresso-800 p-7">
                <div className="font-display text-[18px] text-gold-soft">{t.k}</div>
                <div className="mt-2 text-[12.5px] leading-relaxed text-cream/55">
                  {t.v}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-parchment py-20 text-mahogany md:py-24">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-7 px-4 text-center md:px-8">
          <h2 className="font-display text-[30px] font-light leading-tight md:text-[40px]">
            Titan&apos;s standard,{" "}
            <span className="italic text-gold-600">on every document.</span>
          </h2>
          <div className="flex flex-col gap-3 sm:flex-row">
            <PrimaryCTA href="/login">
              Log in
              <ArrowRight className="transition-transform group-hover:translate-x-0.5" />
            </PrimaryCTA>
            <SecondaryCTA href="/demo">Watch the demo</SecondaryCTA>
          </div>
        </div>
      </section>
    </>
  );
}
