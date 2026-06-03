import { Reveal } from "./Reveal";

/** Interior-page header: compact espresso band with editorial masthead. */
export function PageHero({
  index,
  kicker,
  title,
  emphasis,
  intro,
}: {
  index: string;
  kicker: string;
  title: string;
  emphasis?: string;
  intro?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-espresso pt-36 pb-16 text-cream md:pt-44 md:pb-20">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, #2a0f54 0%, #1b1233 50%, #150a30 100%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(115deg, transparent 0 38px, rgba(138,63,252,0.5) 38px 39px)",
        }}
      />
      <div className="paper-grain pointer-events-none absolute inset-0 opacity-50" />
      <div
        className="pointer-events-none absolute inset-0"
        style={{ boxShadow: "inset 0 0 180px 50px rgba(10,7,5,0.6)" }}
      />

      <div className="relative mx-auto max-w-5xl px-4 md:px-8">
        <Reveal>
          <div className="mb-8 flex items-center gap-3 border-y border-cream/[0.1] py-3">
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-gold-soft">
              <span className="text-gold">{index}</span> — {kicker}
            </span>
          </div>
          <h1 className="max-w-3xl font-display text-[40px] font-light leading-[1.02] tracking-[-0.015em] md:text-[56px]">
            {title}{" "}
            {emphasis && <span className="italic text-gold">{emphasis}</span>}
          </h1>
          {intro && (
            <p className="mt-6 max-w-2xl text-[16px] leading-[1.7] text-cream/60">
              {intro}
            </p>
          )}
        </Reveal>
      </div>
    </section>
  );
}
