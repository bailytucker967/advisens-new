import { PageHero } from "@/components/marketing/PageHero";
import { Reveal } from "@/components/marketing/Reveal";
import { DemoStage } from "@/components/marketing/DemoStage";
import { ReportPaper } from "@/components/marketing/ReportPaper";
import {
  SectionLabel,
  PrimaryCTA,
  SecondaryCTA,
  ArrowRight,
} from "@/components/marketing/ui";

export const metadata = {
  title: "Live demo · TWI Report Generator",
  description:
    "Watch a full Titan client assessment built in ~14 seconds, and see how the engine does it, end to end.",
};

const BREAKDOWN = [
  {
    t: "It reads the meeting like you would",
    d: "The engine reads your notes and transcript, pulls out the client's position, goals and risk profile, and cross-references Titan's house view so the recommendations line up with the approach you are taking.",
  },
  {
    t: "It writes in Titan's voice",
    d: "Every section is written in Titan's template structure and house language. It reads like a Titan adviser wrote it, because it learned from Titan's own reports.",
  },
  {
    t: "It checks every fact",
    d: "Figures and products are verified against Titan's product set and compliance library. When something won't verify, it is flagged for you instead of guessed.",
  },
  {
    t: "It arrives ready to send",
    d: "Everything lands in Titan's template: charts, tables, disclaimers and signature. What reaches your desk is a finished document to review.",
  },
];

export default function DemoPage() {
  return (
    <>
      <PageHero
        index="05"
        kicker="Live demonstration"
        title="A full Titan assessment, built in"
        emphasis="~14 seconds."
        intro="Press play. The engine reads a discovery call, builds the assessment around the client's position and the recommended Titan approach, checks every figure against the house view, and sets it in Titan's template, start to finish."
      />

      {/* The demo stage */}
      <section className="bg-espresso pb-20 text-cream">
        <div className="mx-auto max-w-5xl px-4 md:px-8">
          <Reveal>
            <DemoStage />
          </Reveal>
        </div>
      </section>

      {/* Breakdown */}
      <section className="bg-cream py-20 md:py-28">
        <div className="mx-auto max-w-5xl px-4 md:px-8">
          <Reveal>
            <SectionLabel index="①">What just happened</SectionLabel>
            <h2 className="mt-4 max-w-2xl font-display text-[32px] font-light leading-tight text-mahogany md:text-[42px]">
              Fourteen seconds of work that used to take{" "}
              <span className="italic text-gold-600">three days.</span>
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-5 sm:grid-cols-2">
            {BREAKDOWN.map((b, i) => (
              <Reveal key={b.t} delay={((i % 2) + 1) as 1 | 2}>
                <div className="flex h-full gap-4 rounded-xl border border-mahogany/10 bg-cream-50 p-6">
                  <div className="font-display text-[28px] leading-none text-gold/40">
                    0{i + 1}
                  </div>
                  <div>
                    <h3 className="font-display text-[18px] leading-snug text-mahogany">
                      {b.t}
                    </h3>
                    <p className="mt-2 text-[13.5px] leading-[1.7] text-mahogany-500">
                      {b.d}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* The output */}
      <section className="bg-parchment py-20 md:py-28">
        <div className="mx-auto max-w-5xl px-4 md:px-8">
          <Reveal className="mb-12 text-center">
            <SectionLabel index="②">The output</SectionLabel>
            <h2 className="mx-auto mt-4 max-w-2xl font-display text-[32px] font-light leading-tight text-mahogany md:text-[42px]">
              This is what lands on{" "}
              <span className="italic text-gold-600">your desk.</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-[14px] leading-relaxed text-mahogany-500">
              A finished, client-ready document, set in Titan&apos;s template and
              written in Titan&apos;s voice.
            </p>
          </Reveal>
          <Reveal delay={1}>
            <ReportPaper />
          </Reveal>
        </div>
      </section>

      <section className="bg-espresso py-20 text-cream">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-7 px-4 text-center md:px-8">
          <h2 className="font-display text-[30px] font-light leading-tight md:text-[40px]">
            Put this on{" "}
            <span className="italic text-gold">your reports.</span>
          </h2>
          <div className="flex flex-col gap-3 sm:flex-row">
            <PrimaryCTA href="/login">
              Log in
              <ArrowRight className="transition-transform group-hover:translate-x-0.5" />
            </PrimaryCTA>
            <SecondaryCTA href="/how-it-works" tone="dark">
              How it works
            </SecondaryCTA>
          </div>
        </div>
      </section>
    </>
  );
}
