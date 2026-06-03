import { PageHero } from "@/components/marketing/PageHero";
import { Reveal } from "@/components/marketing/Reveal";
import {
  SectionLabel,
  PrimaryCTA,
  SecondaryCTA,
  ArrowRight,
} from "@/components/marketing/ui";

export const metadata = {
  title: "How it works · TWI Report Generator",
  description:
    "How Titan's in-house report engine fits the adviser process: a tailored introduction before the meeting, a full assessment from your notes after it, and reviews that keep pace, all on Titan's templates and house view.",
};

const STEPS = [
  {
    n: "01",
    tag: "Before the meeting",
    title: "Walk in with a tailored introduction",
    body: "Tell the engine who you are seeing and share what you already know. It drafts an introduction pitch built around that prospect: the Titan story, the service lines that fit their situation, the team and the house view, instead of a generic deck.",
  },
  {
    n: "02",
    tag: "In the meeting",
    title: "Run the meeting the way you always do",
    body: "Take your notes, or record the call through your notetaker. Nothing changes about how you sit with a client. The engine works from whatever you capture.",
  },
  {
    n: "03",
    tag: "After the meeting",
    title: "Turn the notes into a full assessment",
    body: "Hand over the transcript or your notes. The engine builds the complete assessment around the products and approach you are taking the client down, fact-checked against Titan's house view, set in Titan's template and ready for your review.",
  },
  {
    n: "04",
    tag: "Ongoing",
    title: "Keep every client current",
    body: "Each client gets a folder. The introduction, the assessment and every review pack are saved together and refreshed against the latest Titan house view, so the whole book holds one standard.",
  },
];

const AGENTS = [
  {
    name: "Introduction agent",
    role: "Before the meeting",
    body: "Reads who you are about to meet and the context you add, then drafts a tailored introduction: the Titan story, the service lines that fit this prospect, and your team, ready for you to personalise.",
  },
  {
    name: "Assessment agent",
    role: "After the meeting",
    body: "Reads your transcript or notes, pulls the client's position, goals and constraints, and builds the full assessment around the products and approach you have chosen, in Titan's template.",
  },
  {
    name: "House-view check",
    role: "Always on",
    body: "Verifies every figure, product and claim against Titan's product set and compliance library. Anything it cannot confirm is flagged for you, never invented.",
  },
  {
    name: "Compositor",
    role: "The finish",
    body: "Lays the document into Titan's template, with the typography, charts, tables, disclaimers and signature in place, so what reaches your desk is ready to review.",
  },
];

export default function HowItWorksPage() {
  return (
    <>
      <PageHero
        index="01"
        kicker="How it works"
        title="It runs inside the way Titan"
        emphasis="advisers already work."
        intro="Every Titan engagement moves the same way: prepare, meet, assess, review. The report engine sits on that path and turns each stage into a finished, on-brand document in minutes, on Titan's templates and house view. Your judgment still drives every recommendation."
      />

      {/* Workflow */}
      <section className="bg-cream py-20 md:py-28">
        <div className="mx-auto max-w-5xl px-4 md:px-8">
          <Reveal>
            <SectionLabel index="①">The workflow</SectionLabel>
          </Reveal>
          <div className="mt-10 space-y-px overflow-hidden rounded-xl border border-mahogany/10 bg-mahogany/10">
            {STEPS.map((s, i) => (
              <Reveal key={s.n} delay={((i % 3) + 1) as 1 | 2 | 3}>
                <div className="grid gap-6 bg-cream-50 p-8 md:grid-cols-[auto_1fr] md:gap-10">
                  <div className="font-display text-[52px] leading-none text-gold/30">
                    {s.n}
                  </div>
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-mahogany-500">
                      {s.tag}
                    </div>
                    <h3 className="mt-2 font-display text-[24px] text-mahogany">
                      {s.title}
                    </h3>
                    <p className="mt-3 max-w-2xl text-[15px] leading-[1.7] text-mahogany-500">
                      {s.body}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Agents */}
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
            <SectionLabel index="②" tone="dark">
              Under the hood
            </SectionLabel>
            <h2 className="mt-4 max-w-2xl font-display text-[32px] font-light leading-tight md:text-[42px]">
              Specialist agents,{" "}
              <span className="italic text-gold">in Titan&apos;s house style.</span>
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-5 sm:grid-cols-2">
            {AGENTS.map((a, i) => (
              <Reveal key={a.name} delay={((i % 2) + 1) as 1 | 2}>
                <div className="h-full rounded-xl border border-cream/[0.1] bg-cream/[0.03] p-7 transition-colors hover:border-gold/40">
                  <div className="flex items-baseline justify-between">
                    <h3 className="font-display text-[20px] text-cream">
                      {a.name}
                    </h3>
                    <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-gold-soft">
                      {a.role}
                    </span>
                  </div>
                  <p className="mt-3 text-[14px] leading-[1.7] text-cream/55">
                    {a.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Your IP */}
      <section className="bg-parchment py-20 md:py-28">
        <div className="mx-auto max-w-5xl px-4 md:px-8">
          <div className="grid gap-10 md:grid-cols-[1fr_1.2fr] md:items-center">
            <Reveal>
              <h2 className="font-display text-[30px] font-light leading-tight text-mahogany md:text-[40px]">
                Your data never leaves{" "}
                <span className="italic text-gold-600">Titan.</span>
              </h2>
            </Reveal>
            <Reveal delay={1}>
              <div className="space-y-4 text-[15px] leading-[1.7] text-mahogany-500">
                <p>
                  The engine is trained on Titan&apos;s own reports, templates
                  and house view, so it writes like Titan, not like generic AI.
                  Client data stays inside Titan&apos;s environment and never
                  trains anyone else&apos;s model.
                </p>
                <p>
                  Because it sits on Titan&apos;s whole-of-market model, it knows
                  the in-house solutions without being limited to them. Advisers
                  still select from across the market; the engine builds the
                  document around the choice.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <CTABand />
    </>
  );
}

function CTABand() {
  return (
    <section className="bg-espresso py-20 text-cream">
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-7 px-4 text-center md:px-8">
        <h2 className="font-display text-[30px] font-light leading-tight md:text-[40px]">
          See it run on{" "}
          <span className="italic text-gold">one of your reports.</span>
        </h2>
        <div className="flex flex-col gap-3 sm:flex-row">
          <PrimaryCTA href="/demo">
            Watch the demo
            <ArrowRight className="transition-transform group-hover:translate-x-0.5" />
          </PrimaryCTA>
          <SecondaryCTA href="/login" tone="dark">
            Log in
          </SecondaryCTA>
        </div>
      </div>
    </section>
  );
}
