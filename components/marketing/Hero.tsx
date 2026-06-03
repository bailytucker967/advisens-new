"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { PrimaryCTA, SecondaryCTA, ArrowRight } from "./ui";
import { TitanArcs } from "./TitanArcs";

const HeroCanvas = dynamic(() => import("./HeroCanvas"), { ssr: false });

const TICKS = ["CISI Chartered", "CII International Partner", "Data stays in Titan"];

export function Hero() {
  const cardRef = useRef<HTMLDivElement>(null);

  function onMouseMove(e: React.MouseEvent) {
    const card = cardRef.current;
    if (!card) return;
    const r = card.getBoundingClientRect();
    const px = (e.clientX - (r.left + r.width / 2)) / r.width;
    const py = (e.clientY - (r.top + r.height / 2)) / r.height;
    card.style.transform = `perspective(1400px) rotateY(${px * 4}deg) rotateX(${-py * 4}deg)`;
  }
  function onMouseLeave() {
    if (cardRef.current)
      cardRef.current.style.transform =
        "perspective(1400px) rotateY(0deg) rotateX(0deg)";
  }

  return (
    <section
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className="relative overflow-hidden bg-espresso"
    >
      {/* ── Faded, aged backdrop (no spotlight glow) ── */}
      {/* washed warm wash, top-left to bottom-right */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, #2a0f54 0%, #1b1233 45%, #150a30 100%)",
        }}
      />
      {/* faded oxblood bloom, very soft & low-contrast */}
      <div
        className="pointer-events-none absolute -left-1/4 top-1/3 h-[700px] w-[700px] rounded-full opacity-50"
        style={{
          background:
            "radial-gradient(circle, rgba(138,63,252,0.35), transparent 65%)",
          filter: "blur(90px)",
        }}
      />
      {/* engraved gold contour lines (faded topographic feel) */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(115deg, transparent 0 38px, rgba(138,63,252,0.5) 38px 39px)",
        }}
      />
      {/* subtle motes */}
      <div className="pointer-events-none absolute inset-0 opacity-70">
        <HeroCanvas />
      </div>
      {/* grain */}
      <div className="paper-grain pointer-events-none absolute inset-0 opacity-[0.6]" />
      {/* vignette — darken edges for an aged, bound feel */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          boxShadow: "inset 0 0 200px 60px rgba(10,7,5,0.7)",
        }}
      />

      {/* vertical editorial label on the far edge */}
      <div className="pointer-events-none absolute left-4 top-1/2 hidden -translate-y-1/2 -rotate-90 xl:block">
        <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-cream/25">
          Report Intelligence
        </span>
      </div>

      <div className="relative mx-auto max-w-6xl px-4 pt-44 pb-24 md:px-8 md:pt-56 md:pb-32">
        {/* masthead rule — bordered top + bottom so it reads as an editorial
            strip clearly separated from the floating nav above it */}
        <div className="text-reveal text-reveal-1 mb-12 flex items-center gap-3 border-y border-cream/[0.1] py-3">
          <span className="h-1.5 w-1.5 rounded-full bg-gold" />
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-gold-soft">
            For Titan Wealth advisers
          </span>
          <span className="ml-auto hidden font-mono text-[10px] uppercase tracking-[0.3em] text-cream/30 sm:block">
            Powering Ambitions
          </span>
        </div>

        <div className="grid items-center gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
          {/* Copy */}
          <div>
            <h1 className="font-display text-[46px] font-light leading-[0.96] tracking-[-0.015em] text-cream sm:text-[58px] md:text-[72px]">
              <span className="text-reveal text-reveal-2 block">
                Bespoke client
              </span>
              <span className="text-reveal text-reveal-2 block">reports,</span>
              <span className="text-reveal text-reveal-3 mt-1 block italic text-gold">
                in Titan&apos;s voice
              </span>
              <span className="text-reveal text-reveal-4 block font-light text-cream/55">
                built in minutes.
              </span>
            </h1>

            <p className="text-reveal text-reveal-4 mt-8 max-w-md text-[15px] leading-[1.7] text-cream/60">
              Titan&apos;s in-house report engine for advisers. From the
              first&#8209;meeting introduction to the full assessment and every
              review, on Titan&apos;s templates and house view,{" "}
              <span className="text-cream/80">in minutes.</span>
            </p>

            <div className="text-reveal text-reveal-5 mt-9 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
              <PrimaryCTA href="/demo">
                Watch the 14-second demo
                <ArrowRight className="transition-transform group-hover:translate-x-0.5" />
              </PrimaryCTA>
              <SecondaryCTA href="/how-it-works" tone="dark">
                How it works
              </SecondaryCTA>
            </div>

            <div className="text-reveal text-reveal-5 mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-cream/[0.08] pt-5 text-[11px] text-cream/40">
              {TICKS.map((t) => (
                <span key={t} className="flex items-center gap-1.5">
                  <span className="h-1 w-1 rounded-full bg-gold" />
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Bound document */}
          <div className="relative" style={{ perspective: "1400px" }}>
            {/* page stack behind */}
            <div className="absolute inset-0 translate-x-3 translate-y-4 rotate-[1.5deg] rounded-sm bg-cream/20" />
            <div className="absolute inset-0 translate-x-1.5 translate-y-2 rotate-[0.75deg] rounded-sm bg-cream/40" />

            <div
              ref={cardRef}
              className="animate-floaty relative transition-transform duration-300 ease-out will-change-transform"
            >
              <div className="relative overflow-hidden rounded-lg bg-twi-deep text-white shadow-[0_40px_90px_-20px_rgba(0,0,0,0.6)] ring-1 ring-white/10">
                <TitanArcs className="h-full w-[60%]" opacity={0.9} />
                <div className="relative flex min-h-[320px] flex-col justify-between px-9 py-9">
                  {/* logo + confidential */}
                  <div className="flex items-center justify-between">
                    <Image
                      src="/brand/twi-logo-white.png"
                      alt="Titan Wealth International"
                      width={150}
                      height={44}
                      className="h-7 w-auto"
                    />
                    <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/45">
                      Private &amp; confidential
                    </span>
                  </div>

                  {/* title block */}
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/50">
                      Assessment Report
                    </div>
                    <div className="mt-3 max-w-[16rem] font-display text-[26px] font-light leading-[1.1] text-white">
                      Retirement &amp; Wealth Assessment
                    </div>
                    <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.15em] text-white/45">
                      Prepared for Mr J. Whitlock&#8209;Bryant · Q2 2026
                    </div>
                  </div>

                  {/* footer */}
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/45">
                      Powering Ambitions
                    </span>
                    <span className="font-mono text-[9px] text-white/35">
                      www.titanwealthinternational.com
                    </span>
                  </div>
                </div>
              </div>

              {/* floating stat pill */}
              <div className="absolute -bottom-4 -left-5 flex items-center gap-2.5 rounded-full border border-cream/10 bg-espresso-800/95 px-4 py-2 shadow-xl backdrop-blur">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-gold" />
                <span className="font-mono text-[11px] text-cream">
                  Built in 14.0s · 47 pages
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
