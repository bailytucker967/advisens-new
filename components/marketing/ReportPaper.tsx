/**
 * A high-level, impressive sample client report — rendered in the Titan slide
 * theme: a deep-purple cover band (white logo + concentric arcs + Powering
 * Ambitions) above a branded content slide (purple corner tab, Powering
 * Ambitions + TW mark). Presentational; used in the demo.
 *
 * Sample client is kept consistent with the live DemoStage build
 * (Mr James Whitlock-Bryant — British, KSA-resident, repatriating in 2031).
 */
import Image from "next/image";
import { TitanArcs } from "./TitanArcs";

export function ReportPaper() {
  return (
    <div className="mx-auto max-w-3xl overflow-hidden rounded-lg bg-white shadow-[0_40px_100px_-30px_rgba(0,0,0,0.5)] ring-1 ring-black/5">
      {/* ── Deep-purple cover band ── */}
      <div className="relative flex min-h-[280px] flex-col justify-between overflow-hidden bg-twi-deep px-9 py-9 text-white sm:px-14">
        <TitanArcs className="h-full w-[58%]" opacity={0.9} />
        <Image
          src="/brand/twi-logo-white.png"
          alt="Titan Wealth International"
          width={180}
          height={53}
          className="relative h-8 w-auto"
        />
        <div className="relative">
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/55">
            Retirement &amp; Wealth Assessment
          </div>
          <h3 className="mt-3 max-w-md font-display text-[30px] font-light leading-[1.05] tracking-tight sm:text-[36px]">
            A clear path to retirement at 58,
            <span className="italic text-twi-teal"> on your terms.</span>
          </h3>
          <p className="mt-3 text-[12px] text-white/55">
            Prepared for Mr James Whitlock-Bryant · British expatriate, Riyadh
          </p>
        </div>
        <div className="relative flex items-center justify-between">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/55">
            Powering Ambitions
          </span>
          <span className="font-mono text-[10px] text-white/40">
            www.titanwealthinternational.com
          </span>
        </div>
      </div>

      {/* ── Content slide chrome ── */}
      <div className="relative px-9 pt-7 sm:px-14">
        <span className="absolute left-0 top-0 h-2.5 w-40 rounded-br-lg bg-twi-deep" />
        <div className="flex items-center justify-end">
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-twi-deep/70">
            Powering Ambitions
            <span className="grid h-6 w-6 place-items-center rounded-full border border-twi-deep/50 text-[8px] font-bold text-twi-deep">
              TW
            </span>
          </div>
        </div>
        <div className="mt-3 border-b border-slate-200" />
      </div>

      <div className="px-9 py-9 sm:px-14">
        {/* executive summary */}
        <div className="grid gap-8 sm:grid-cols-[1.4fr_1fr]">
          <div>
            <h4 className="font-display text-[18px] font-semibold text-twi-deep">
              Executive summary
            </h4>
            <p className="mt-3 text-[14px] leading-[1.75] text-slate-700">
              You are well positioned to return to the UK in 2031 and retire at
              58 with the lifestyle you described. Your Saudi End-of-Service
              Benefit, SAR 1.2m (~£255,000), sits with your employer at no yield
              today. Redeployed on receipt into a growth-oriented, tax-efficient
              structure while you remain UK non-resident, it should help close
              the £1.46m retirement gap with room to spare, without pushing past
              the risk level you set.
            </p>
            <p className="mt-3 text-[14px] leading-[1.75] text-slate-700">
              Our recommendation balances growth over your 13-year horizon with a
              planned de-risking glidepath, and migrates your currency exposure
              toward sterling as repatriation in 2031 approaches.
            </p>
          </div>

          {/* highlight stats */}
          <div className="space-y-4 border-l border-slate-200 pl-7">
            {[
              { k: "Horizon to retirement", v: "13 yrs" },
              { k: "Return to UK", v: "2031" },
              { k: "Projected at 58", v: "£2.95m" },
              { k: "Risk profile", v: "Balanced" },
            ].map((s) => (
              <div key={s.k}>
                <div className="font-display text-[26px] leading-none text-twi-deep">
                  {s.v}
                </div>
                <div className="mt-1 font-mono text-[9px] uppercase tracking-[0.15em] text-twi-purple">
                  {s.k}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* chart */}
        <div className="mt-10">
          <div className="flex items-baseline justify-between">
            <h4 className="font-display text-[17px] font-semibold text-twi-deep">
              Projected wealth path
            </h4>
            <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-slate-400">
              GBP · net of fees
            </span>
          </div>
          <WealthChart />
          <div className="mt-2 flex justify-between font-mono text-[9px] uppercase tracking-[0.12em] text-slate-400">
            <span>2026</span>
            <span>2031 · UK return</span>
            <span>2039 · retirement</span>
          </div>
        </div>

        <div className="my-9 h-px w-full bg-slate-200" />

        {/* recommendation */}
        <div>
          <h4 className="font-display text-[17px] font-semibold text-twi-deep">
            Our recommendation
          </h4>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {[
              {
                t: "Structure",
                d: "International SIPP wrapper for UK-bound retirement, preserving tax efficiency across the KSA and UK regimes.",
              },
              {
                t: "Allocation",
                d: "Balanced model portfolio (60/40), glidepathing to capital-preservation from age 55.",
              },
              {
                t: "Contributions",
                d: "Redeploy the SAR 1.2m End-of-Service Benefit on receipt and fund £8,420 per month, phased to average entry and timing risk.",
              },
            ].map((r) => (
              <div key={r.t} className="rounded-lg bg-slate-50 p-4 ring-1 ring-slate-200/70">
                <div className="font-mono text-[9px] uppercase tracking-[0.15em] text-twi-purple">
                  {r.t}
                </div>
                <p className="mt-2 text-[12.5px] leading-relaxed text-slate-700">
                  {r.d}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* signature */}
        <div className="mt-10 flex items-end justify-between border-t border-slate-200 pt-6">
          <div>
            <div className="font-display text-[15px] italic text-twi-deep">
              Prepared by your adviser
            </div>
            <div className="mt-1 font-mono text-[9px] uppercase tracking-[0.15em] text-slate-400">
              TWI Report Generator · in Titan&apos;s voice
            </div>
          </div>
          <div className="font-mono text-[9px] uppercase tracking-[0.15em] text-slate-400">
            p. 09 / 47
          </div>
        </div>
      </div>
    </div>
  );
}

function WealthChart() {
  // simple area + line projection — peaks at the £2.95m retirement target
  const pts = [
    [0, 524],
    [1, 660],
    [2, 810],
    [3, 980],
    [4, 1170],
    [5, 1390],
    [6, 1650],
    [7, 1980],
    [8, 2400],
    [9, 2950],
  ];
  const w = 600;
  const h = 150;
  const maxY = 3000;
  const x = (i: number) => (i / (pts.length - 1)) * w;
  const y = (v: number) => h - (v / maxY) * h;
  const line = pts.map(([i, v]) => `${x(i)},${y(v)}`).join(" ");
  const area = `0,${h} ${line} ${w},${h}`;

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className="mt-4 h-[150px] w-full"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="rp-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8a3ffc" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#8a3ffc" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0.25, 0.5, 0.75].map((g) => (
        <line
          key={g}
          x1="0"
          x2={w}
          y1={h * g}
          y2={h * g}
          stroke="rgba(49,19,94,0.08)"
          strokeWidth="1"
        />
      ))}
      <polygon points={area} fill="url(#rp-fill)" />
      <polyline
        points={line}
        fill="none"
        stroke="#8a3ffc"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx={x(9)} cy={y(2950)} r="4" fill="#8a3ffc" />
    </svg>
  );
}
