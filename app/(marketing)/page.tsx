import Link from "next/link";
import { Hero } from "@/components/marketing/Hero";
import { Reveal } from "@/components/marketing/Reveal";
import {
  Eyebrow,
  SectionLabel,
  PrimaryCTA,
  SecondaryCTA,
  ArrowRight,
} from "@/components/marketing/ui";

export default function HomePage() {
  return (
    <>
      <Hero />

      {/* ============ HOW IT WORKS — teaser ============ */}
      <section className="bg-cream py-24 md:py-32">
        <div className="mx-auto max-w-6xl px-4 md:px-8">
          <Reveal>
            <SectionLabel index="01">The adviser process</SectionLabel>
            <h2 className="mt-4 max-w-2xl font-display text-[34px] leading-[1.05] tracking-tight text-mahogany md:text-[44px]">
              Built around the way Titan{" "}
              <span className="italic text-gold-600">advisers already work.</span>
            </h2>
          </Reveal>

          <div className="mt-14 grid gap-px overflow-hidden rounded-xl border border-mahogany/10 bg-mahogany/10 md:grid-cols-3">
            {[
              {
                n: "01",
                tag: "Before the meeting",
                title: "A tailored introduction",
                body: "Tell the engine who you are seeing; it drafts an introduction pitch around that prospect and the Titan services that fit.",
              },
              {
                n: "02",
                tag: "After the meeting",
                title: "A full assessment",
                body: "Hand over the notes; it builds the complete report around the products and approach you are taking, in Titan's template.",
              },
              {
                n: "03",
                tag: "Every client",
                title: "One client folder",
                body: "The introduction and every report save to the client's folder, refreshed against Titan's house view.",
              },
            ].map((step, i) => (
              <Reveal key={step.n} delay={(i + 1) as 1 | 2 | 3} className="bg-cream-50 p-7">
                <div className="font-display text-[40px] leading-none text-gold/40">
                  {step.n}
                </div>
                <div className="mt-4 text-[10px] font-mono uppercase tracking-[0.18em] text-mahogany-500">
                  {step.tag}
                </div>
                <h3 className="mt-2 font-display text-[20px] text-mahogany">
                  {step.title}
                </h3>
                <p className="mt-2 text-[13px] leading-relaxed text-mahogany-500">
                  {step.body}
                </p>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-10">
            <SecondaryCTA href="/how-it-works">
              See the full breakdown
              <ArrowRight />
            </SecondaryCTA>
          </Reveal>
        </div>
      </section>

      {/* ============ LIVE DEMO — teaser (dark band) ============ */}
      <section className="relative overflow-hidden bg-espresso py-24 text-cream md:py-32">
        <div
          className="pointer-events-none absolute right-0 top-0 h-[400px] w-[500px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(138,63,252,0.14), transparent 70%)",
            filter: "blur(70px)",
          }}
        />
        <div className="relative mx-auto max-w-6xl px-4 md:px-8">
          <Reveal>
            <SectionLabel index="02" tone="dark">
              Live demonstration
            </SectionLabel>
            <h2 className="mt-4 max-w-3xl font-display text-[34px] leading-[1.05] tracking-tight md:text-[46px]">
              A full Titan assessment,{" "}
              <span className="italic text-gold-gradient">
                built in ~14 seconds.
              </span>
            </h2>
            <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-cream/60">
              Watch the engine read a discovery call, build the assessment around
              the client's position and the recommended Titan approach, check
              every figure against the house view, and set it in Titan's template.
            </p>
          </Reveal>
          <Reveal className="mt-9">
            <PrimaryCTA href="/demo">
              Watch the demo
              <ArrowRight className="transition-transform group-hover:translate-x-0.5" />
            </PrimaryCTA>
          </Reveal>
        </div>
      </section>

      {/* ============ USE CASES — teaser ============ */}
      <section className="bg-cream py-24 md:py-32">
        <div className="mx-auto max-w-6xl px-4 md:px-8">
          <Reveal>
            <SectionLabel index="03">What it produces</SectionLabel>
            <h2 className="mt-4 max-w-2xl font-display text-[34px] leading-[1.05] tracking-tight text-mahogany md:text-[44px]">
              Every document a Titan engagement needs.
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { t: "Introduction pitches", d: "Tailored to the prospect before you sit down." },
              { t: "Client assessments", d: "The full suitability report, built from your notes." },
              { t: "Review packs", d: "Quarterly and annual reviews, refreshed against the house view." },
              { t: "Bespoke documents", d: "Anything in the Titan toolkit, taught from one example." },
            ].map((u, i) => (
              <Reveal key={u.t} delay={((i % 4) + 1) as 1 | 2 | 3 | 4}>
                <div className="group h-full rounded-xl border border-mahogany/10 bg-cream-50 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-gold/40 hover:shadow-[var(--shadow-warm)]">
                  <div className="font-display text-[18px] text-mahogany">{u.t}</div>
                  <p className="mt-2 text-[13px] leading-relaxed text-mahogany-500">
                    {u.d}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-10">
            <SecondaryCTA href="/use-cases">
              Explore use cases
              <ArrowRight />
            </SecondaryCTA>
          </Reveal>
        </div>
      </section>

      {/* ============ STATS / WHY band ============ */}
      <section className="bg-parchment py-20">
        <div className="mx-auto max-w-6xl px-4 md:px-8">
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-mahogany/10 bg-mahogany/10 md:grid-cols-4">
            {[
              { v: "~90%", l: "of report-building time back to advising clients" },
              { v: "In-house", l: "trained on Titan's templates, never generic AI" },
              { v: "Your data", l: "stays inside Titan, never trains another model" },
              { v: "One standard", l: "across every adviser and every office" },
            ].map((s, i) => (
              <Reveal key={s.l} delay={((i % 4) + 1) as 1 | 2 | 3 | 4} className="bg-cream p-7">
                <div className="font-display text-[30px] leading-none tracking-tight text-mahogany md:text-[34px]">
                  {s.v}
                </div>
                <div className="mt-2 text-[12px] leading-relaxed text-mahogany-500">
                  {s.l}
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-10">
            <SecondaryCTA href="/why">
              Why Titan owns this in-house
              <ArrowRight />
            </SecondaryCTA>
          </Reveal>
        </div>
      </section>

      {/* ============ ENQUIRE ============ */}
      <section id="enquire" className="relative overflow-hidden bg-espresso py-24 text-cream md:py-32">
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(138,63,252,0.12), transparent 70%)",
            filter: "blur(80px)",
          }}
        />
        <div className="relative mx-auto max-w-3xl px-4 text-center md:px-8">
          <Reveal>
            <Eyebrow tone="dark" className="justify-center">
              For Titan advisers
            </Eyebrow>
            <h2 className="mt-5 font-display text-[36px] leading-[1.05] tracking-tight md:text-[50px]">
              See TWI Report Generator on{" "}
              <span className="italic text-gold-gradient">your own reports.</span>
            </h2>
            <p className="mx-auto mt-5 max-w-lg text-[15px] leading-relaxed text-cream/60">
              Bring a recent client meeting and watch a finished, on-brand
              report come together in minutes.
            </p>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <PrimaryCTA href="/demo">
                Watch the demo
                <ArrowRight className="transition-transform group-hover:translate-x-0.5" />
              </PrimaryCTA>
              <SecondaryCTA href="/login" tone="dark">
                Log in
              </SecondaryCTA>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
