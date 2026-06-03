"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  AudioLines,
  Search,
  FileText,
  ShieldCheck,
  Play,
  Pause,
  RotateCcw,
  Check,
  Download,
  Send,
} from "lucide-react";
import Image from "next/image";
import { TitanArcs } from "./TitanArcs";

/* ============================================================
   Heritage palette used inside the white "paper" document.
   The report stays on white stock (like a real PDF); accents
   are mapped to the TWI Report Generator heritage tokens.
============================================================ */
const C = {
  ink: "#1b1233",
  head: "#31135e",
  body: "#4b4658",
  bodyDark: "#2e2150",
  faint: "#998fb3",
  line: "#e7e1f4",
  lineFaint: "#f1eefa",
  gold: "#8a3ffc",
  goldDark: "#6f25d8",
  goldBright: "#9a5bff",
  mahog: "#31135e",
  oxblood: "#c2410c",
  sage: "#15937e",
  cream: "#ffffff",
};

const COMPLETE_AT = 14400;
const TOTAL_PAGES = 47;

type AgentDef = {
  id: string;
  label: string;
  sub: string;
  startMs: number;
  /** percent added per 100ms — duration to 100% = 10000/speed ms */
  speed: number;
  Icon: typeof AudioLines;
};

const AGENTS: AgentDef[] = [
  { id: "discovery", label: "Discovery agent", sub: "Parsing the meeting", startMs: 0, speed: 6, Icon: AudioLines },
  { id: "profile", label: "Profile agent", sub: "Cross-referencing prior work", startMs: 900, speed: 3.5, Icon: Search },
  { id: "template", label: "Template agent", sub: "Populating your document", startMs: 2500, speed: 1.8, Icon: FileText },
  { id: "verification", label: "Verification agent", sub: "Compliance + fact check", startMs: 9500, speed: 5, Icon: ShieldCheck },
];

const DISCOVERY = `DISCOVERY CALL · 22 May 2026
Captured via Fireflies · 53 min

CLIENT
James Whitlock-Bryant, 45
British · KSA resident since 2020
Visa: KSA employment + UAE Golden
Director, Infrastructure Investments
Public Investment Fund (Riyadh)

SPOUSE
Caroline Whitlock-Bryant, 42
British · ex Allen & Overy lawyer
Not currently working

DEPENDENTS
3 children · ages 7, 10, 13
All at British International
School Riyadh (BISR)
School fees ~SAR 285k / year

INCOME (monthly)
PIF salary             SAR 145,000
Avg bonus              SAR  60,000
Living costs          -SAR  38,000
Surplus                SAR 167,000

ASSETS
Cash Riyad Bank        SAR 280,000
Cash NatWest UK        GBP  88,000
Cash Emirates NBD      AED 215,000
   (DMCC freezone biz)
KSA EOSB accrued       SAR 1,200,000
PIF DC pension         SAR 580,000
UK Surrey home         GBP 950,000
   · mortgage          GBP 420,000
   · rented (£4,200/m)
UK Clapham BTL         GBP 580,000
   · mortgage          GBP 180,000
   · rented (£2,400/m)
UK Aviva (frozen)      GBP 145,000
UK ISA Vanguard (frzn) GBP  78,000

GOALS (client's words)
1. "Return to UK in 2031, cleanly,
    with the kids settled"
2. "EOSB is just sat there"
3. "Worried about UK tax on return"
4. "Too cash-heavy, want growth"
5. "Caroline's NI restart on return"
6. "UK school fees £75k+ from 2031"

CONCERNS
"5 years feels like nothing. We've
not really planned."
"PIF gratuity is the wildcard."

RISK PROFILE
ATR completed: Balanced-Growth

REPORT TEMPLATE
titan-bespoke-assessment-v3 (47pp)
· cover · client class · position
· methodology · retirement math
· scenarios · UK tax · KSA EOSB
· FX exposure · platform
· illustration · risk · MPS
· fee drag · fees · timeline
· team · firm · letter`;

/* ============================================================
   Small presentational helpers (white-paper styling)
============================================================ */
function Label({ children, color }: { children: ReactNode; color?: string }) {
  return (
    <div
      className="text-[9.5px] font-semibold uppercase tracking-[0.16em]"
      style={{ color: color ?? C.faint }}
    >
      {children}
    </div>
  );
}

const PILL: Record<string, { bg: string; fg: string }> = {
  gold: { bg: "rgba(138,63,252,0.10)", fg: C.goldDark },
  amber: { bg: "rgba(138,63,252,0.14)", fg: C.gold },
  sage: { bg: "rgba(21,147,126,0.14)", fg: "#0f6f5e" },
  oxblood: { bg: "rgba(194,65,27,0.10)", fg: C.oxblood },
  slate: { bg: "#f1eefa", fg: "#6a5f86" },
};

function Pill({ tone = "slate", children }: { tone?: keyof typeof PILL | string; children: ReactNode }) {
  const p = PILL[tone] ?? PILL.slate;
  return (
    <span
      className="inline-block rounded-full px-2 py-0.5 text-[9.5px] font-semibold leading-none"
      style={{ background: p.bg, color: p.fg }}
    >
      {children}
    </span>
  );
}

const STRIPE: Record<string, string> = {
  gold: C.gold,
  amber: C.goldBright,
  oxblood: C.oxblood,
  sage: C.sage,
  mahog: C.mahog,
};

function Card({
  children,
  stripe,
  tinted,
  className = "",
}: {
  children: ReactNode;
  stripe?: keyof typeof STRIPE;
  tinted?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-lg border p-3.5 ${className}`}
      style={{
        borderColor: C.line,
        background: tinted ? C.cream : "#ffffff",
        boxShadow: "0 1px 2px rgba(28,19,16,0.04)",
      }}
    >
      {stripe && (
        <span
          className="absolute left-0 top-0 h-full w-[3px]"
          style={{ background: STRIPE[stripe] }}
        />
      )}
      {children}
    </div>
  );
}

function BigNum({ children, color, sm }: { children: ReactNode; color?: string; sm?: boolean }) {
  return (
    <div
      className={`font-display font-semibold tracking-tight ${sm ? "text-[22px]" : "text-[30px]"} leading-none`}
      style={{ color: color ?? C.ink }}
    >
      {children}
    </div>
  );
}

function AssetLine({ label, value, note, tone }: { label: string; value: string; note?: string; tone?: string }) {
  return (
    <div className="flex items-baseline justify-between gap-2 py-[3px] text-[10.5px]">
      <span style={{ color: C.body }}>{label}</span>
      <span className="flex items-baseline gap-1.5 font-mono">
        {note && <span style={{ color: C.faint }} className="text-[9px]">{note}</span>}
        <span style={{ color: tone === "oxblood" ? C.oxblood : tone === "amber" ? C.gold : C.bodyDark }} className="font-semibold">
          {value}
        </span>
      </span>
    </div>
  );
}

function Hr() {
  return <div className="my-2.5 h-px w-full" style={{ background: C.lineFaint }} />;
}

function PageHead({ title, n }: { title: string; n: number }) {
  return (
    <div className="flex items-baseline justify-between border-b pb-3" style={{ borderColor: C.line }}>
      <h2 className="font-display text-[19px] font-semibold leading-tight tracking-tight" style={{ color: C.head }}>
        {title}
      </h2>
      <div className="font-mono text-[9.5px] font-semibold uppercase tracking-[0.16em]" style={{ color: C.faint }}>
        Page {String(n).padStart(2, "0")} / {TOTAL_PAGES}
      </div>
    </div>
  );
}

function Foot({ n }: { n: number }) {
  return (
    <div
      className="absolute bottom-3 left-7 right-7 flex items-center justify-between border-t pt-2 text-[8.5px] font-semibold uppercase tracking-[0.18em]"
      style={{ borderColor: C.line, color: C.faint }}
    >
      <span>Titan Wealth International · Bespoke Wealth Assessment</span>
      <span className="font-mono">{String(n).padStart(2, "0")} / {TOTAL_PAGES}</span>
    </div>
  );
}

function PageShell({ children, cover }: { children: ReactNode; cover?: boolean }) {
  if (cover) {
    return (
      <div
        className="relative overflow-hidden px-7 py-7 text-white"
        style={{ minHeight: 660, background: C.head }}
      >
        <TitanArcs className="h-full w-[58%]" opacity={0.9} />
        {children}
      </div>
    );
  }
  return (
    <div className="relative px-7 py-7" style={{ minHeight: 660, background: "#ffffff" }}>
      {/* Titan content-slide chrome: purple corner tab + Powering Ambitions + TW */}
      <span
        className="absolute left-0 top-0 h-2 w-32 rounded-br-lg"
        style={{ background: C.head }}
      />
      <div
        className="mb-3 flex items-center justify-end gap-1.5 font-mono text-[8px] font-semibold uppercase tracking-[0.18em]"
        style={{ color: C.head }}
      >
        <span className="opacity-70">Powering Ambitions</span>
        <span
          className="grid h-5 w-5 place-items-center rounded-full border text-[7px] font-bold"
          style={{ borderColor: "rgba(49,19,94,0.5)" }}
        >
          TW
        </span>
      </div>
      {children}
    </div>
  );
}

/* ---- Donut ---- */
function Donut({ slices }: { slices: [string, number, string][] }) {
  const total = slices.reduce((s, [, v]) => s + v, 0);
  const r = 38;
  const circ = 2 * Math.PI * r;
  let offset = 0;
  return (
    <div className="flex items-center gap-5">
      <svg viewBox="0 0 100 100" className="h-[104px] w-[104px] -rotate-90">
        {slices.map(([label, val, color]) => {
          const frac = val / total;
          const dash = `${frac * circ} ${circ}`;
          const el = (
            <circle
              key={label}
              cx="50"
              cy="50"
              r={r}
              fill="none"
              stroke={color}
              strokeWidth="13"
              strokeDasharray={dash}
              strokeDashoffset={-offset * circ}
            />
          );
          offset += frac;
          return el;
        })}
      </svg>
      <div className="space-y-1.5">
        {slices.map(([label, val, color]) => (
          <div key={label} className="flex items-center gap-1.5 text-[10.5px]" style={{ color: C.bodyDark }}>
            <span className="h-2 w-2 rounded-sm" style={{ background: color }} />
            {label}
            <span className="ml-1 font-mono" style={{ color: C.faint }}>{val.toFixed(2)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---- Projected-wealth area chart ---- */
function GrowthChart() {
  // recommended vs status-quo, indexed 0..100 over 14 years
  const recs = [10, 16, 22, 30, 38, 50, 60, 70, 78, 87, 94, 98];
  const sq = [10, 12, 14, 17, 20, 24, 28, 32, 36, 41, 46, 50];
  const pts = (arr: number[]) => arr.map((v, i) => `${(i / (arr.length - 1)) * 100} ${100 - v}`).join(" L ");
  const recsPath = `M 0 ${100 - recs[0]} L ${pts(recs)} L 100 100 L 0 100 Z`;
  const sqPath = `M 0 ${100 - sq[0]} L ${pts(sq)} L 100 100 L 0 100 Z`;
  return (
    <div className="relative">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-[156px] w-full">
        <defs>
          <linearGradient id="g-recs" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8a3ffc" stopOpacity="0.30" />
            <stop offset="100%" stopColor="#8a3ffc" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[25, 50, 75].map((g) => (
          <line key={g} x1="0" x2="100" y1={g} y2={g} stroke="rgba(27,18,51,0.07)" strokeWidth="0.4" />
        ))}
        <path d={sqPath} fill="rgba(138,63,252,0.06)" />
        <polyline points={sq.map((v, i) => `${(i / (sq.length - 1)) * 100},${100 - v}`).join(" ")} fill="none" stroke={C.oxblood} strokeWidth="0.8" strokeDasharray="2 2" vectorEffect="non-scaling-stroke" />
        <path d={recsPath} fill="url(#g-recs)" />
        <polyline points={recs.map((v, i) => `${(i / (recs.length - 1)) * 100},${100 - v}`).join(" ")} fill="none" stroke={C.gold} strokeWidth="1.4" vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
      </svg>
      <div className="mt-1 flex justify-between font-mono text-[9px] uppercase tracking-[0.12em]" style={{ color: C.faint }}>
        <span>2026 · age 45</span>
        <span>2031 · exit</span>
        <span>2039 · retire</span>
      </div>
      <div className="mt-2 flex gap-4 text-[9.5px]" style={{ color: C.body }}>
        <span className="flex items-center gap-1.5"><span className="h-[2px] w-4" style={{ background: C.gold }} />With recommendation</span>
        <span className="flex items-center gap-1.5"><span className="h-[2px] w-4" style={{ background: C.oxblood, opacity: 0.6 }} />Status quo</span>
      </div>
    </div>
  );
}

/* ---- Risk-mandate stacked bars ---- */
function RiskBars() {
  const rows: [string, number, number, number, boolean][] = [
    ["Defensive", 32.5, 62.4, 5.1, false],
    ["Cautious", 47.2, 47.8, 5.0, false],
    ["Balanced", 60.9, 34.2, 4.9, true],
    ["Growth", 76.3, 18.8, 5.0, true],
    ["Adventurous", 82.8, 11.9, 5.3, false],
  ];
  return (
    <div className="space-y-2">
      {rows.map(([name, eq, fi, cash, rec]) => (
        <div key={name} className="flex items-center gap-3">
          <div className="w-24 shrink-0 text-[10.5px]" style={{ color: rec ? C.goldDark : C.body, fontWeight: rec ? 600 : 400 }}>
            {name}{rec && " ◂"}
          </div>
          <div className="flex h-4 flex-1 overflow-hidden rounded-sm">
            <div style={{ width: `${eq}%`, background: C.gold }} className="flex items-center justify-center text-[8px] font-semibold text-white">{eq}</div>
            <div style={{ width: `${fi}%`, background: "#8c8378" }} />
            <div style={{ width: `${cash}%`, background: "#d8cfbf" }} />
          </div>
        </div>
      ))}
      <div className="mt-1 flex gap-4 text-[9px] uppercase tracking-wider" style={{ color: C.faint }}>
        <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-sm" style={{ background: C.gold }} />Equity</span>
        <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-sm" style={{ background: "#8c8378" }} />Fixed income</span>
        <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-sm" style={{ background: "#d8cfbf" }} />Cash</span>
      </div>
    </div>
  );
}

/* ---- Monte-Carlo style probability fan ---- */
function ScenarioChart() {
  const p90 = [10, 21, 33, 47, 61, 75, 89, 100];
  const p50 = [10, 16, 24, 33, 43, 54, 66, 78];
  const p10 = [10, 13, 17, 22, 28, 34, 41, 48];
  const target = 64;
  const xAt = (len: number, i: number) => (i / (len - 1)) * 100;
  const line = (arr: number[]) => arr.map((v, i) => `${xAt(arr.length, i)},${100 - v}`).join(" ");
  const top = p90.map((v, i) => `${xAt(p90.length, i)} ${100 - v}`);
  const bot = p10.map((v, i) => `${xAt(p10.length, i)} ${100 - v}`).reverse();
  const band = `M ${top.join(" L ")} L ${bot.join(" L ")} Z`;
  return (
    <div className="relative">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-[150px] w-full">
        {[25, 50, 75].map((g) => (
          <line key={g} x1="0" x2="100" y1={g} y2={g} stroke="rgba(27,18,51,0.07)" strokeWidth="0.4" />
        ))}
        <path d={band} fill="rgba(138,63,252,0.13)" />
        <polyline points={line(p90)} fill="none" stroke={C.gold} strokeWidth="0.6" strokeDasharray="2 1.5" opacity="0.55" vectorEffect="non-scaling-stroke" />
        <polyline points={line(p10)} fill="none" stroke={C.gold} strokeWidth="0.6" strokeDasharray="2 1.5" opacity="0.55" vectorEffect="non-scaling-stroke" />
        <line x1="0" x2="100" y1={100 - target} y2={100 - target} stroke={C.sage} strokeWidth="0.8" strokeDasharray="3 2" vectorEffect="non-scaling-stroke" />
        <polyline points={line(p50)} fill="none" stroke={C.gold} strokeWidth="1.6" vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
      </svg>
      <div className="mt-1 flex justify-between font-mono text-[9px] uppercase tracking-[0.12em]" style={{ color: C.faint }}>
        <span>2026 · age 45</span>
        <span>2031 · exit</span>
        <span>2039 · retire</span>
      </div>
      <div className="mt-2 flex flex-wrap gap-4 text-[9.5px]" style={{ color: C.body }}>
        <span className="flex items-center gap-1.5"><span className="h-[2px] w-4" style={{ background: C.gold }} />Median path (P50)</span>
        <span className="flex items-center gap-1.5"><span className="h-2.5 w-3 rounded-sm" style={{ background: "rgba(138,63,252,0.18)" }} />P10–P90 range</span>
        <span className="flex items-center gap-1.5"><span className="h-[2px] w-4" style={{ background: C.sage }} />Target £2.95M</span>
      </div>
    </div>
  );
}

/* ---- Currency exposure: current vs recommended target ---- */
function CurrencyBars() {
  const rows: [string, number, number, string][] = [
    ["GBP", 26, 48, C.gold],
    ["SAR", 41, 18, C.goldBright],
    ["USD", 11, 22, C.sage],
    ["AED", 14, 9, "#8c8378"],
    ["Other", 8, 3, "#d8cfbf"],
  ];
  return (
    <div className="space-y-2.5">
      {rows.map(([cur, now, tgt, col]) => (
        <div key={cur} className="flex items-center gap-3 text-[10px]">
          <div className="w-9 shrink-0 font-mono font-semibold" style={{ color: C.bodyDark }}>{cur}</div>
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <div className="h-2 flex-1 overflow-hidden rounded-sm" style={{ background: C.lineFaint }}>
                <div className="h-full" style={{ width: `${now}%`, background: "#b3a896" }} />
              </div>
              <span className="w-8 text-right font-mono" style={{ color: C.faint }}>{now}%</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 flex-1 overflow-hidden rounded-sm" style={{ background: C.lineFaint }}>
                <div className="h-full" style={{ width: `${tgt}%`, background: col }} />
              </div>
              <span className="w-8 text-right font-mono font-semibold" style={{ color: C.bodyDark }}>{tgt}%</span>
            </div>
          </div>
        </div>
      ))}
      <div className="mt-1 flex gap-4 text-[9px] uppercase tracking-wider" style={{ color: C.faint }}>
        <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-sm" style={{ background: "#b3a896" }} />Current</span>
        <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-sm" style={{ background: C.gold }} />Recommended target</span>
      </div>
    </div>
  );
}

/* ---- Fee drag: gross vs net wealth over time ---- */
function FeeDragChart() {
  const gross = [10, 18, 27, 38, 50, 63, 77, 92, 100];
  const net = [10, 17, 25, 35, 45, 56, 68, 81, 88];
  const xAt = (len: number, i: number) => (i / (len - 1)) * 100;
  const line = (arr: number[]) => arr.map((v, i) => `${xAt(arr.length, i)},${100 - v}`).join(" ");
  const top = gross.map((v, i) => `${xAt(gross.length, i)} ${100 - v}`);
  const bot = net.map((v, i) => `${xAt(net.length, i)} ${100 - v}`).reverse();
  const gap = `M ${top.join(" L ")} L ${bot.join(" L ")} Z`;
  return (
    <div className="relative">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-[150px] w-full">
        {[25, 50, 75].map((g) => (
          <line key={g} x1="0" x2="100" y1={g} y2={g} stroke="rgba(27,18,51,0.07)" strokeWidth="0.4" />
        ))}
        <path d={gap} fill="rgba(138,63,252,0.10)" />
        <polyline points={line(gross)} fill="none" stroke={C.sage} strokeWidth="1.2" strokeDasharray="3 2" vectorEffect="non-scaling-stroke" />
        <polyline points={line(net)} fill="none" stroke={C.gold} strokeWidth="1.6" vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
      </svg>
      <div className="mt-1 flex justify-between font-mono text-[9px] uppercase tracking-[0.12em]" style={{ color: C.faint }}>
        <span>2026</span>
        <span>2033</span>
        <span>2039 · retire</span>
      </div>
      <div className="mt-2 flex flex-wrap gap-4 text-[9.5px]" style={{ color: C.body }}>
        <span className="flex items-center gap-1.5"><span className="h-[2px] w-4" style={{ background: C.sage }} />Gross · zero-fee theoretical</span>
        <span className="flex items-center gap-1.5"><span className="h-[2px] w-4" style={{ background: C.gold }} />Net of all Titan Wealth fees</span>
        <span className="flex items-center gap-1.5"><span className="h-2.5 w-3 rounded-sm" style={{ background: "rgba(138,63,252,0.14)" }} />Cumulative fee drag</span>
      </div>
    </div>
  );
}

/* ============================================================
   PAGE RENDERERS — each a self-contained white-paper layout
============================================================ */
type PageDef = { n: number; label: string; render: (n: number) => ReactNode };

/* reveal timing is derived from page order so the deck can be
   reordered without hand-tuning every timestamp */
const FIRST_REVEAL = 1200;
const LAST_REVEAL = 13900;
function pageRevealAt(i: number, count: number) {
  if (count <= 1) return FIRST_REVEAL;
  return Math.round(FIRST_REVEAL + (LAST_REVEAL - FIRST_REVEAL) * (i / (count - 1)));
}

const PAGES: PageDef[] = [
  /* 01 COVER */
  {
    n: 1,
    label: "Cover",
    render: () => (
      <PageShell cover>
        <div className="absolute left-8 right-8 top-7 flex items-center justify-between">
          <Image
            src="/brand/twi-logo-white.png"
            alt="Titan Wealth International"
            width={150}
            height={44}
            className="h-7 w-auto"
          />
          <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-white/55">AD-2026-1042</span>
        </div>

        <div className="absolute inset-0 flex flex-col justify-center px-12">
          <Label color="#58f9ca">Bespoke Wealth Assessment</Label>
          <div className="mt-1 text-[10px] uppercase tracking-[0.18em] text-white/50">Prepared for</div>
          <h1 className="mt-5 font-display text-[52px] font-semibold leading-[0.95] tracking-tight text-white">
            James<br />Whitlock-Bryant
          </h1>
          <div className="mt-7 flex items-center gap-3">
            <div className="h-px w-12" style={{ background: C.gold }} />
            <div className="text-[12px] text-white/80">Director, Infrastructure Investments · Public Investment Fund</div>
          </div>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {["British", "KSA resident · since 2020", "Returning UK · 2031", "UAE Golden Visa"].map((t) => (
              <span
                key={t}
                className="inline-block rounded-full border border-white/20 bg-white/10 px-2 py-0.5 text-[9.5px] font-semibold leading-none text-white/85"
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        <div className="absolute bottom-7 left-8 right-8 flex items-end justify-between">
          <div>
            <Label color="rgba(255,255,255,0.5)">Powering Ambitions</Label>
            <div className="mt-0.5 text-[12px] font-medium text-white/80">28 May 2026</div>
          </div>
          <div className="text-right">
            <Label color="rgba(255,255,255,0.5)">Confidential</Label>
            <div className="mt-0.5 text-[10px] italic text-white/55">www.titanwealthinternational.com</div>
          </div>
        </div>
      </PageShell>
    ),
  },

  /* 03 · CLASSIFICATION */
  {
    n: 3,
    label: "Classification",
    render: (n) => (
      <PageShell>
        <PageHead title="Client classification" n={n} />
        <p className="mt-4 max-w-2xl text-[12px] leading-relaxed" style={{ color: C.body }}>
          Your classification governs the standard of care, level of disclosure, and protection mechanisms applied throughout our engagement. Both the category and risk profile are reviewable on request and at scheduled reviews.
        </p>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <Card stripe="gold">
            <div className="mb-2 flex items-start justify-between">
              <Label>Category</Label>
              <Pill tone="gold">Highest protection</Pill>
            </div>
            <h3 className="text-[17px] font-semibold" style={{ color: C.ink }}>Ordinary Client</h3>
            <p className="mt-3 text-[11px] leading-relaxed" style={{ color: C.body }}>
              Ordinary Clients receive the highest level of regulatory protection available. Categorisation persists across all services, products and transactions unless changed in writing.
            </p>
          </Card>

          <Card stripe="amber">
            <div className="mb-2 flex items-start justify-between">
              <Label>Risk profile</Label>
              <Pill tone="amber">ATR completed in-call</Pill>
            </div>
            <h3 className="text-[17px] font-semibold" style={{ color: C.ink }}>Balanced, with a Growth lean</h3>
            <div className="mt-4 flex items-center gap-1.5">
              {["Defensive", "Cautious", "Balanced", "Growth", "Adventurous"].map((tier, i) => (
                <div key={tier} className="flex-1 text-center">
                  <div className="h-1.5 rounded-sm" style={{ background: i === 2 || i === 3 ? C.gold : "#e7e1d6" }} />
                  <div className="mt-1 text-[7.5px] font-semibold uppercase tracking-wider" style={{ color: C.faint }}>{tier}</div>
                </div>
              ))}
            </div>
            <p className="mt-3 text-[10.5px] leading-relaxed" style={{ color: C.body }}>
              Tolerance for moderate drawdown in exchange for long-term growth. Bias toward Growth on a 5-year horizon, dropping to Balanced as repatriation approaches.
            </p>
          </Card>
        </div>

        <Card className="mt-3">
          <Label>Capacity for loss: scenario modelling</Label>
          <div className="mt-3 grid grid-cols-3 gap-3">
            {([
              ["-15% drawdown", "£345k", "Within tolerance", "sage"],
              ["-25% drawdown", "£575k", "Acceptable · 7y horizon", "amber"],
              ["-35% drawdown", "£805k", "Stress-test threshold", "oxblood"],
            ] as const).map(([scen, loss, status, tone]) => (
              <div key={scen} className="text-center">
                <BigNum sm>{loss}</BigNum>
                <div className="mt-1 text-[10px]" style={{ color: C.faint }}>{scen}</div>
                <div className="mt-2"><Pill tone={tone}>{status}</Pill></div>
              </div>
            ))}
          </div>
        </Card>
        <Foot n={n} />
      </PageShell>
    ),
  },

  /* 05 · ASSET OVERVIEW */
  {
    n: 5,
    label: "Asset overview",
    render: (n) => (
      <PageShell>
        <PageHead title="Personal & financial position" n={n} />
        <div className="mt-5 grid grid-cols-4 gap-3">
          {([
            ["Gross AUM", "GBP 2.40M", "9 holdings · 4 currencies", "gold"],
            ["Net AUM", "GBP 2.05M", "After UK property mortgages", "gold"],
            ["Liquid AUM", "GBP 188k", "Cash + freezone balance", "amber"],
            ["Monthly surplus", "GBP 21.4k", "~62% of net income", "amber"],
          ] as const).map(([l, v, sub, s]) => (
            <Card key={l} stripe={s}>
              <Label>{l}</Label>
              <div className="mt-2 font-display text-[19px] font-semibold" style={{ color: C.ink }}>{v}</div>
              <div className="mt-1.5 text-[9.5px]" style={{ color: C.faint }}>{sub}</div>
            </Card>
          ))}
        </div>

        <div className="mt-4 grid grid-cols-3 gap-3">
          <Card tinted>
            <Label color={C.goldDark}>Cash &amp; liquid</Label>
            <div className="mt-2">
              <AssetLine label="Riyad Bank (KSA salary)" value="SAR 280,000" note="~£55k" />
              <AssetLine label="NatWest (UK current)" value="GBP 88,000" />
              <AssetLine label="Emirates NBD (DMCC biz)" value="AED 215,000" note="~£45k" />
            </div>
            <Hr />
            <div className="flex justify-between text-[11px] font-semibold" style={{ color: C.ink }}><span>Total liquid</span><span className="font-mono">£188,000</span></div>
          </Card>
          <Card tinted>
            <Label color={C.goldDark}>Pensions &amp; retirement</Label>
            <div className="mt-2">
              <AssetLine label="KSA EOSB accrued" value="SAR 1.20M" note="~£255k" tone="amber" />
              <AssetLine label="PIF DC pension" value="SAR 580,000" note="~£124k" />
              <AssetLine label="UK Aviva (frozen)" value="GBP 145,000" />
            </div>
            <Hr />
            <div className="flex justify-between text-[11px] font-semibold" style={{ color: C.ink }}><span>Total retirement</span><span className="font-mono">£524,000</span></div>
          </Card>
          <Card tinted>
            <Label color={C.goldDark}>UK property</Label>
            <div className="mt-2">
              <AssetLine label="Surrey home (rented)" value="GBP 950,000" />
              <AssetLine label="Clapham BTL" value="GBP 580,000" />
              <AssetLine label="Mortgages outstanding" value="GBP (600,000)" tone="oxblood" />
            </div>
            <Hr />
            <div className="flex justify-between text-[11px] font-semibold" style={{ color: C.ink }}><span>Net property</span><span className="font-mono">£930,000</span></div>
            <div className="mt-1 text-[9.5px]" style={{ color: C.faint }}>Combined rental: GBP 6,600 / mo</div>
          </Card>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-3">
          <Card tinted className="col-span-2">
            <Label>Structures &amp; wrappers</Label>
            <div className="mt-2 grid grid-cols-2 gap-3 text-[11px]">
              <div>
                <AssetLine label="UK ISA (Vanguard, frozen)" value="GBP 78,000" />
                <AssetLine label="DMCC freezone company" value="~AED 250k t/o" />
                <AssetLine label="UAE Golden Visa" value="via DMCC" tone="amber" />
              </div>
              <p className="text-[10px] leading-relaxed" style={{ color: C.body }}>
                Structure uses the DMCC route for the UAE Golden Visa, separating GCC business interests from KSA employment. Caroline holds a dependant visa under James&apos;s status.
              </p>
            </div>
          </Card>
          <Card tinted>
            <Label>Protection coverage</Label>
            <div className="mt-2 space-y-1.5 text-[10.5px]" style={{ color: C.body }}>
              <div className="flex items-center justify-between"><span>Life cover</span><Pill tone="amber">3× salary</Pill></div>
              <div className="flex items-center justify-between"><span>Critical illness</span><Pill tone="oxblood">Not in place</Pill></div>
              <div className="flex items-center justify-between"><span>UK Will</span><Pill tone="amber">Stale (2017)</Pill></div>
              <div className="flex items-center justify-between"><span>KSA / UAE Will</span><Pill tone="oxblood">Not in place</Pill></div>
            </div>
          </Card>
        </div>
        <Foot n={n} />
      </PageShell>
    ),
  },

  /* 08 · METHODOLOGY */
  {
    n: 8,
    label: "Methodology",
    render: (n) => (
      <PageShell>
        <PageHead title="How this plan was built" n={n} />
        <p className="mt-4 max-w-2xl text-[12px] leading-relaxed" style={{ color: C.body }}>
          Every figure in this assessment is reproducible. Below are the exact inputs captured in your discovery call, the assumptions the model applies, and the outputs they produce. Change an input and the plan re-derives. None of it is a black box.
        </p>

        <div className="mt-5 grid grid-cols-[1fr_auto_1fr] items-stretch gap-3">
          <Card tinted>
            <Label color={C.goldDark}>Inputs captured · 22 May call</Label>
            <table className="mt-2.5 w-full text-[10.5px]"><tbody style={{ color: C.body }}>
              {[
                ["Age / target retirement", "45 / 58"],
                ["Repatriation year", "2031"],
                ["Net monthly surplus", "SAR 167,000"],
                ["Liquid + investable", "£188,000"],
                ["EOSB accrued", "SAR 1.20M"],
                ["Net income target (today)", "£75,000"],
                ["Risk profile (ATR)", "Balanced-Growth"],
              ].map(([k, v]) => (
                <tr key={k}><td className="py-1">{k}</td><td className="text-right font-mono" style={{ color: C.bodyDark }}>{v}</td></tr>
              ))}
            </tbody></table>
          </Card>

          <div className="flex items-center justify-center">
            <div className="grid h-8 w-8 place-items-center rounded-full text-[14px] font-semibold" style={{ background: "rgba(138,63,252,0.12)", color: C.goldDark }}>→</div>
          </div>

          <Card stripe="gold">
            <Label color={C.goldDark}>Modelled outputs</Label>
            <table className="mt-2.5 w-full text-[10.5px]"><tbody style={{ color: C.body }}>
              {([
                ["Funding gap to retirement", "£1.46M", false],
                ["Required monthly contribution", "£8,420", true],
                ["Projected wealth at 58", "£2.95M", true],
                ["Probability of success", "87%", false],
                ["Total fee drag (13y)", "£220k", false],
              ] as const).map(([k, v, em]) => (
                <tr key={k}><td className="py-1">{k}</td><td className="text-right font-mono" style={{ color: em ? C.goldDark : C.bodyDark, fontWeight: em ? 700 : 400 }}>{v}</td></tr>
              ))}
            </tbody></table>
          </Card>
        </div>

        <div className="mt-4"><Label>Key assumptions applied</Label></div>
        <div className="mt-2 grid grid-cols-4 gap-3">
          {([
            ["Net growth", "5.5% p.a.", "7% gross less 1.45% all-in fees"],
            ["Inflation", "3.0% p.a.", "UK CPI, long-run"],
            ["GBP : SAR", "4.90", "spot, reviewed quarterly"],
            ["Safe withdrawal", "5.0%", "at and through retirement"],
          ] as const).map(([l, v, sub]) => (
            <Card key={l}>
              <Label>{l}</Label>
              <div className="mt-1.5 font-display text-[18px] font-semibold" style={{ color: C.ink }}>{v}</div>
              <div className="mt-1 text-[9px] leading-snug" style={{ color: C.faint }}>{sub}</div>
            </Card>
          ))}
        </div>

        <Card tinted className="mt-3">
          <div className="flex items-start gap-3">
            <div className="grid h-6 w-6 shrink-0 place-items-center rounded-full text-[11px] font-semibold" style={{ background: "rgba(138,63,252,0.14)", color: C.goldDark }}>i</div>
            <p className="text-[10.5px] leading-relaxed" style={{ color: C.body }}>
              We keep the assumptions conservative. A ±1% change in net growth moves the projected pot at 58 by roughly ±£260k. Section 14 stress-tests this across 1,000 simulated market paths rather than a single straight line.
            </p>
          </div>
        </Card>
        <Foot n={n} />
      </PageShell>
    ),
  },

  /* 11 · RETIREMENT GAP */
  {
    n: 11,
    label: "Retirement gap",
    render: (n) => (
      <PageShell>
        <PageHead title="Retirement gap analysis" n={n} />
        <p className="mt-4 max-w-2xl text-[12px] leading-relaxed" style={{ color: C.body }}>
          A two-phase model. Phase one (5y) targets clean UK repatriation in 2031. Phase two targets sustainable retirement income at age 58.
        </p>

        <div className="mt-5 grid grid-cols-3 gap-3">
          <Card stripe="oxblood">
            <Label>Funding gap to retirement</Label>
            <BigNum color={C.oxblood}>£1.46M</BigNum>
            <div className="mt-2 text-[9.5px]" style={{ color: C.faint }}>at 7% gross growth · 13y horizon</div>
          </Card>
          <Card stripe="amber">
            <Label>Required monthly contribution</Label>
            <BigNum>£8,420</BigNum>
            <div className="mt-2 text-[9.5px]" style={{ color: C.faint }}>~SAR 39,800 · 24% of surplus</div>
          </Card>
          <Card stripe="gold">
            <Label>Projected wealth at 58</Label>
            <BigNum>£2.95M</BigNum>
            <div className="mt-2 text-[9.5px]" style={{ color: C.faint }}>net of UK property · post-recs</div>
          </Card>
        </div>

        <Card className="mt-4">
          <Label>Closing the gap</Label>
          <div className="mt-3 space-y-3">
            {([
              ["Status quo trajectory at age 58", "£1.49M", 50, "linear-gradient(90deg,#c98b8b,#c2410c)"],
              ["Target wealth at 58 (net income £95k, inflation-adj.)", "£2.95M", 100, "linear-gradient(90deg,#c4a3ff,#8a3ffc)"],
              ["With recommended contribution plan", "£2.95M", 100, C.sage],
            ] as const).map(([l, v, w, bg]) => (
              <div key={l}>
                <div className="mb-1 flex justify-between text-[10px]" style={{ color: C.body }}><span>{l}</span><span className="font-mono font-semibold">{v}</span></div>
                <div className="h-2.5 overflow-hidden rounded" style={{ background: C.lineFaint }}>
                  <div className="h-full" style={{ width: `${w}%`, background: bg }} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <div className="mt-3 grid grid-cols-2 gap-3">
          <Card tinted>
            <Label>Monthly contribution by growth rate</Label>
            <table className="mt-2 w-full font-mono text-[11px]"><tbody>
              {[["At 5%", "£10,180 / mo", false], ["At 7%", "£8,420 / mo", true], ["At 9%", "£6,950 / mo", false]].map(([a, b, bold]) => (
                <tr key={a as string}><td className="py-1" style={{ fontFamily: "var(--font-inter)", color: C.body }}>{a}</td><td className="text-right" style={{ color: C.ink, fontWeight: bold ? 700 : 400 }}>{b}</td></tr>
              ))}
            </tbody></table>
          </Card>
          <Card tinted>
            <Label>Income assumptions at retirement</Label>
            <table className="mt-2 w-full text-[11px]"><tbody style={{ color: C.body }}>
              {[["Net income target (today)", "£75,000"], ["Inflation-adjusted (3% pa)", "£110,150"], ["Gross-up requirement", "£134,360"], ["Safe withdrawal rate", "5.0%"]].map(([a, b]) => (
                <tr key={a}><td className="py-1">{a}</td><td className="text-right font-mono">{b}</td></tr>
              ))}
            </tbody></table>
          </Card>
        </div>
        <Foot n={n} />
      </PageShell>
    ),
  },

  /* 14 · SCENARIO */
  {
    n: 14,
    label: "Scenario analysis",
    render: (n) => (
      <PageShell>
        <PageHead title="Scenario analysis & probability of success" n={n} />
        <p className="mt-4 max-w-2xl text-[12px] leading-relaxed" style={{ color: C.body }}>
          The plan is tested against 1,000 simulated market paths rather than a single straight-line return. This shows the range of outcomes you might see, and how likely you are to meet your retirement target.
        </p>

        <div className="mt-5 grid grid-cols-3 gap-3">
          <Card stripe="gold">
            <Label>Probability of success</Label>
            <BigNum color={C.gold}>87%</BigNum>
            <div className="mt-2 text-[9.5px]" style={{ color: C.faint }}>paths meeting the £2.95M target</div>
          </Card>
          <Card stripe="amber">
            <Label>Median outcome at 58</Label>
            <BigNum>£2.95M</BigNum>
            <div className="mt-2 text-[9.5px]" style={{ color: C.faint }}>50th percentile (P50)</div>
          </Card>
          <Card stripe="oxblood">
            <Label>Downside at P10</Label>
            <BigNum color={C.oxblood}>£2.21M</BigNum>
            <div className="mt-2 text-[9.5px]" style={{ color: C.faint }}>still clears core income needs</div>
          </Card>
        </div>

        <Card className="mt-4">
          <Label>Distribution of outcomes · 2026 → 2039</Label>
          <div className="mt-3"><ScenarioChart /></div>
        </Card>

        <Card tinted className="mt-3">
          <Label>Scenario detail</Label>
          <table className="mt-2 w-full text-[10.5px]">
            <thead>
              <tr style={{ color: C.faint, borderBottom: `1px solid ${C.line}` }}>
                {["Scenario", "Avg net return", "Wealth at 58", "Meets target", "Likelihood"].map((h, i) => (
                  <th key={h} className={`pb-1.5 text-[9px] font-semibold uppercase tracking-wider ${i === 0 ? "text-left" : "text-right"}`} style={{ fontFamily: "var(--font-inter)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="font-mono" style={{ color: C.bodyDark }}>
              {([
                ["Bull (P90)", "7.4%", "£3.71M", "Yes", "10%"],
                ["Base (P50)", "5.5%", "£2.95M", "Yes", "50%"],
                ["Bear (P10)", "3.4%", "£2.21M", "Core only", "10%"],
              ] as const).map((r) => (
                <tr key={r[0]} style={{ borderBottom: `1px solid ${C.lineFaint}`, background: r[0] === "Base (P50)" ? "rgba(138,63,252,0.06)" : undefined }}>
                  <td className="py-1.5" style={{ fontFamily: "var(--font-inter)", fontWeight: r[0] === "Base (P50)" ? 600 : 400, color: r[0] === "Base (P50)" ? C.goldDark : C.bodyDark }}>{r[0]}</td>
                  <td className="text-right">{r[1]}</td>
                  <td className="text-right font-semibold" style={{ color: C.ink }}>{r[2]}</td>
                  <td className="text-right">{r[3]}</td>
                  <td className="text-right" style={{ color: C.faint }}>{r[4]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
        <Foot n={n} />
      </PageShell>
    ),
  },

  /* 17 · UK TAX BANDS */
  {
    n: 17,
    label: "UK tax bands",
    render: (n) => (
      <PageShell>
        <PageHead title="UK income tax · retirement gross-up" n={n} />
        <p className="mt-4 max-w-2xl text-[12px] leading-relaxed" style={{ color: C.body }}>
          To deliver net retirement income of <strong className="font-mono">£75,000</strong>, gross income is calculated against UK income tax bands as at drawdown.
        </p>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <Card stripe="gold">
            <Label>Annual tax liability (today)</Label>
            <BigNum>£16,470</BigNum>
            <div className="mt-2 text-[9.5px]" style={{ color: C.faint }}>~17.99% effective on £91,470 gross</div>
          </Card>
          <Card stripe="amber">
            <Label>Tax liability at retirement (2039)</Label>
            <BigNum>£24,210</BigNum>
            <div className="mt-2 text-[9.5px]" style={{ color: C.faint }}>~18.00% effective on £134,360 gross</div>
          </Card>
        </div>

        <Card className="mt-4">
          <Label>Income split across tax bands (today)</Label>
          <div className="mt-3 flex h-11 overflow-hidden rounded">
            {([
              ["£12,570 · 0%", 13.7, "#b78a4e"],
              ["£37,700 · 20%", 41.2, "#8a3ffc"],
              ["£30,000 · 40%", 32.8, "#6f25d8"],
              ["£11,200 · 45%", 12.3, "#31135e"],
            ] as const).map(([t, w, bg]) => (
              <div key={t} className="flex items-center justify-center text-[9.5px] font-semibold text-white" style={{ width: `${w}%`, background: bg }}>{t}</div>
            ))}
          </div>
        </Card>

        <table className="mt-4 w-full font-mono text-[10.5px]">
          <thead>
            <tr style={{ color: C.faint, borderBottom: `1px solid ${C.line}` }}>
              {["Band", "Range", "Rate", "Gross", "Tax", "Net"].map((h, i) => (
                <th key={h} className={`pb-1.5 text-[9px] font-semibold uppercase tracking-wider ${i === 0 ? "text-left" : "text-right"}`} style={{ fontFamily: "var(--font-inter)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody style={{ color: C.bodyDark }}>
            {[
              ["Personal Allowance", "£0 – 12,570", "0%", "£12,570", "£0", "£12,570"],
              ["Basic Rate", "£12,571 – 50,270", "20%", "£37,700", "£7,540", "£30,160"],
              ["Higher Rate", "£50,271 – 125,140", "40%", "£30,000", "£12,000", "£18,000"],
              ["Additional Rate", "Over £125,140", "45%", "£11,200", "£5,040", "£6,160"],
            ].map((r) => (
              <tr key={r[0]}>
                <td className="py-1.5">{r[0]}</td>
                {r.slice(1).map((c, i) => <td key={i} className="text-right">{c}</td>)}
              </tr>
            ))}
            <tr style={{ borderTop: `2px solid ${C.line}`, color: C.ink, fontWeight: 700 }}>
              <td className="py-2">Total</td><td /><td /><td className="text-right">£91,470</td><td className="text-right">£16,470</td><td className="text-right">£75,000</td>
            </tr>
          </tbody>
        </table>

        <Card tinted className="mt-4">
          <div className="flex items-start gap-3">
            <div className="text-[12px] font-semibold" style={{ color: C.gold }}>!</div>
            <div>
              <div className="text-[11.5px] font-semibold" style={{ color: C.head }}>Statutory residence on UK return</div>
              <p className="mt-1 text-[10.5px] leading-relaxed" style={{ color: C.body }}>
                UK Statutory Residence Test (SRT) implications need pre-2031 planning. Days-in-country tracking, &quot;ties&quot; assessment, and split-year treatment are all material. Independent UK tax counsel recommended 12–18 months ahead of return.
              </p>
            </div>
          </div>
        </Card>
        <Foot n={n} />
      </PageShell>
    ),
  },

  /* 20 · KSA EOSB */
  {
    n: 20,
    label: "KSA EOSB",
    render: (n) => (
      <PageShell>
        <PageHead title="KSA End-of-Service Benefits · analysis" n={n} />
        <p className="mt-4 max-w-2xl text-[12px] leading-relaxed" style={{ color: C.body }}>
          Saudi labour law mandates End-of-Service Benefits (EOSB) for foreign employees on termination. PIF, as your employer, accrues the benefit on your behalf, and it sits in the employer ledger today without yield.
        </p>

        <div className="mt-5 grid grid-cols-3 gap-3">
          <Card stripe="amber">
            <Label>EOSB accrued to date</Label>
            <BigNum>SAR 1.20M</BigNum>
            <div className="mt-2 text-[9.5px]" style={{ color: C.faint }}>~GBP 255,000 · 5y service</div>
          </Card>
          <Card stripe="gold">
            <Label>Projected EOSB at exit (2031)</Label>
            <BigNum>SAR 2.40M</BigNum>
            <div className="mt-2 text-[9.5px]" style={{ color: C.faint }}>~GBP 510,000 · 10y est.</div>
          </Card>
          <Card stripe="oxblood">
            <Label>Yield on current arrangement</Label>
            <BigNum color={C.oxblood}>0.0%</BigNum>
            <div className="mt-2 text-[9.5px]" style={{ color: C.faint }}>sits in employer ledger</div>
          </Card>
        </div>

        <Card className="mt-4">
          <Label>EOSB calculation methodology</Label>
          <div className="mt-3 grid grid-cols-2 gap-5 text-[11px] leading-relaxed" style={{ color: C.body }}>
            <div>
              <div className="mb-1 font-semibold" style={{ color: C.ink }}>First five years</div>
              <p>Half month&apos;s wage per year of service. Calculation base: last drawn wage (including allowances).</p>
            </div>
            <div>
              <div className="mb-1 font-semibold" style={{ color: C.ink }}>Beyond five years</div>
              <p>Full month&apos;s wage per year of service. Five-year mark passed in Q3 2025, so the accrual rate has now doubled.</p>
            </div>
          </div>
        </Card>

        <Card tinted className="mt-3">
          <div className="flex items-start gap-3">
            <div className="grid h-7 w-7 shrink-0 place-items-center rounded-md" style={{ background: "rgba(21,147,126,0.16)" }}>
              <Check className="h-4 w-4" style={{ color: C.sage }} />
            </div>
            <div>
              <div className="text-[11.5px] font-semibold" style={{ color: C.head }}>Recommendation summary</div>
              <p className="mt-1.5 text-[10.5px] leading-relaxed" style={{ color: C.body }}>
                Establish a parallel structure to deploy projected SAR 2.40M EOSB efficiently on exit. Phase plan: tax-efficient receipt while non-UK resident (pre-SRT clock), redirect to a multi-currency wrapper, allocate per the balanced-growth mandate. Detailed structure follows in sections 26–29.
              </p>
            </div>
          </div>
        </Card>
        <Foot n={n} />
      </PageShell>
    ),
  },

  /* 23 · CURRENCY / FX */
  {
    n: 23,
    label: "Currency / FX",
    render: (n) => (
      <PageShell>
        <PageHead title="Currency & FX exposure" n={n} />
        <p className="mt-4 max-w-2xl text-[12px] leading-relaxed" style={{ color: C.body }}>
          You earn in Saudi riyal, hold assets across four currencies, and will retire in sterling. That makes currency a core planning risk in its own right. The plan migrates exposure toward your eventual home currency as 2031 approaches.
        </p>

        <div className="mt-5 grid grid-cols-3 gap-3">
          <Card stripe="oxblood">
            <Label>Currencies held today</Label>
            <BigNum color={C.oxblood}>4</BigNum>
            <div className="mt-2 text-[9.5px]" style={{ color: C.faint }}>SAR · GBP · AED · USD</div>
          </Card>
          <Card stripe="amber">
            <Label>Unhedged FX on return</Label>
            <BigNum>~£312k</BigNum>
            <div className="mt-2 text-[9.5px]" style={{ color: C.faint }}>exposed to SAR/GBP at repatriation</div>
          </Card>
          <Card stripe="gold">
            <Label>Target home-currency weight</Label>
            <BigNum>48%</BigNum>
            <div className="mt-2 text-[9.5px]" style={{ color: C.faint }}>GBP by 2031, from 26% today</div>
          </Card>
        </div>

        <div className="mt-4 grid grid-cols-[1.3fr_1fr] gap-3">
          <Card>
            <Label>Exposure migration · current vs recommended</Label>
            <div className="mt-3"><CurrencyBars /></div>
          </Card>
          <Card tinted>
            <Label color={C.goldDark}>Repatriation FX plan</Label>
            <ul className="mt-2.5 space-y-2 text-[10.5px] leading-relaxed" style={{ color: C.body }}>
              {[
                ["Phased conversion", "stage SAR → GBP across 2029–2031 to average the rate rather than converting in one go at exit."],
                ["Multi-currency wrapper", "hold GBP / USD sleeves inside the platform, with no forced conversion when switching funds."],
                ["EOSB receipt", "SAR 2.40M received while non-resident, then converted on a planned schedule."],
              ].map(([h, b]) => (
                <li key={h} className="flex items-start gap-2">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full" style={{ background: C.gold }} />
                  <span><strong style={{ color: C.ink }}>{h}</strong> — {b}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
        <Foot n={n} />
      </PageShell>
    ),
  },

  /* 26 · PLATFORM */
  {
    n: 26,
    label: "Platform",
    render: (n) => (
      <PageShell>
        <PageHead title="Recommended platform: international wrapper" n={n} />
        <div className="mt-5 grid grid-cols-[1.1fr_1.4fr] gap-3">
          <div className="relative overflow-hidden rounded-lg p-4 text-white" style={{ background: "linear-gradient(150deg,#3d1d6e,#1b1233)" }}>
            <Label color="#c4a3ff">Platform provider</Label>
            <div className="mt-2 font-display text-[24px] font-semibold leading-tight">Sandstone International</div>
            <div className="mt-2 text-[10.5px] leading-relaxed text-white/65">Offshore multi-currency life-assurance platform · Isle of Man · 35+ years · AKG B+ (4-star)</div>
            <div className="mt-5 grid grid-cols-2 gap-y-3 gap-x-4">
              {([["250,000+", "Policyholders"], ["170", "Countries"], ["$20B+", "Assets under custody"], ["350+", "Fund universe"]] as const).map(([v, l]) => (
                <div key={l}>
                  <div className="font-mono text-[16px] font-semibold">{v}</div>
                  <div className="mt-0.5 text-[8.5px] font-semibold uppercase tracking-wider text-white/55">{l}</div>
                </div>
              ))}
            </div>
            <div className="absolute -bottom-12 -right-12 h-40 w-40 rounded-full" style={{ background: "radial-gradient(circle,rgba(138,63,252,0.30),transparent 60%)" }} />
          </div>

          <div className="space-y-3">
            <Card tinted>
              <Label>Why this platform for your case</Label>
              <ul className="mt-2 space-y-1.5 text-[10.5px] leading-relaxed" style={{ color: C.body }}>
                {[
                  ["Multi-currency", "GBP / EUR / USD / CHF / AUD, supporting eventual UK repatriation in GBP."],
                  ["Tax-deferred", "growth inside the wrapper, with a 5% pa cumulative withdrawal allowance that matters given your UK SRT exposure."],
                  ["Open architecture", "350+ funds, no initial fund charges, low platform admin."],
                  ["Flex", "stop / start payments, lump-sum top-ups for EOSB redirection, online switching."],
                  ["Custodian-grade", "top-tier custody, institutional settlement, reinsurance backing."],
                ].map(([h, b], i) => (
                  <li key={h} className="flex items-start gap-2">
                    <span className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full text-[9px] font-semibold" style={{ background: "rgba(138,63,252,0.14)", color: C.goldDark }}>{i + 1}</span>
                    <span><strong style={{ color: C.ink }}>{h}</strong> — {b}</span>
                  </li>
                ))}
              </ul>
            </Card>
            <div className="grid grid-cols-2 gap-3">
              <Card tinted>
                <Label>Regulator</Label>
                <div className="mt-1 text-[12px] font-semibold" style={{ color: C.ink }}>Isle of Man FSA</div>
                <div className="mt-1 text-[9.5px]" style={{ color: C.faint }}>Reg ref: [redacted in demo]</div>
              </Card>
              <Card tinted>
                <Label>Settlement / custody</Label>
                <div className="mt-1 text-[12px] font-semibold" style={{ color: C.ink }}>Tier-1 global bank</div>
                <div className="mt-1 text-[9.5px]" style={{ color: C.faint }}>$12T+ assets under custody</div>
              </Card>
            </div>
          </div>
        </div>
        <Foot n={n} />
      </PageShell>
    ),
  },

  /* 29 · ILLUSTRATION */
  {
    n: 29,
    label: "Illustration",
    render: (n) => (
      <PageShell>
        <PageHead title="Illustration · projected wealth path" n={n} />
        <p className="mt-3 text-[12px] leading-relaxed" style={{ color: C.body }}>
          Net of all contractual fees. 7% gross / 5.5% net assumed (consistent with the Balanced-Growth mandate). Includes the SAR 2.40M EOSB top-up at 2031 (age 50).
        </p>

        <Card className="mt-4">
          <GrowthChart />
          <div className="mt-4 grid grid-cols-4 gap-3">
            {([["Age 45 (today)", "£188k", C.ink], ["Age 50 (exit)", "£1.04M", C.ink], ["Age 55", "£2.16M", C.ink], ["Age 58 (retire)", "£2.95M", C.gold]] as const).map(([l, v, col]) => (
              <div key={l}>
                <Label>{l}</Label>
                <div className="mt-1 font-display text-[18px] font-semibold" style={{ color: col }}>{v}</div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="mt-3">
          <Label>Year-by-year projection (selected)</Label>
          <table className="mt-2 w-full font-mono text-[10.5px]">
            <thead>
              <tr style={{ color: C.faint, borderBottom: `1px solid ${C.line}` }}>
                {["Age", "Yr", "Contribution", "Growth", "Fund value", "Note"].map((h, i) => (
                  <th key={h} className={`pb-1.5 text-[9px] font-semibold uppercase tracking-wider ${i === 0 ? "text-left" : "text-right"}`} style={{ fontFamily: "var(--font-inter)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody style={{ color: C.bodyDark }}>
              {([
                [45, 0, "£188,000", "£10,340", "£298,840", ""],
                [47, 2, "£100,800", "£22,884", "£539,762", ""],
                [49, 4, "£100,800", "£36,863", "£807,912", ""],
                [50, 5, "£100,800", "£510,000", "£1,418,712", "EOSB redirect"],
                [52, 7, "£100,800", "£78,029", "£1,668,430", ""],
                [55, 10, "£100,800", "£110,890", "£2,164,940", ""],
                [58, 13, "£100,800", "£153,420", "£2,953,560", "Target reached"],
              ] as const).map((r) => (
                <tr key={r[0]} style={{ borderBottom: `1px solid ${C.lineFaint}`, background: r[5] ? "rgba(21,147,126,0.07)" : undefined }}>
                  <td className="py-1.5">{r[0]}</td>
                  <td className="text-right">{r[1]}</td>
                  <td className="text-right">{r[2]}</td>
                  <td className="text-right" style={{ color: r[5] === "EOSB redirect" ? C.gold : undefined, fontWeight: r[5] === "EOSB redirect" ? 700 : 400 }}>{r[3]}</td>
                  <td className="text-right font-semibold" style={{ color: C.ink }}>{r[4]}</td>
                  <td className="text-right text-[9.5px]" style={{ color: r[5] ? C.sage : C.faint, fontWeight: r[5] ? 600 : 400 }}>{r[5]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
        <Foot n={n} />
      </PageShell>
    ),
  },

  /* 32 · RISK MANDATES */
  {
    n: 32,
    label: "Risk mandates",
    render: (n) => (
      <PageShell>
        <PageHead title="Risk-weighted strategic asset allocation" n={n} />
        <p className="mt-3 text-[12px] leading-relaxed" style={{ color: C.body }}>
          Strategic allocations per risk profile, reviewed monthly by the Investment Committee. Your Balanced-Growth weighting falls between Balanced and Growth, and we hold it as a 60/40 blend of the two mandates.
        </p>
        <Card className="mt-5">
          <RiskBars />
        </Card>
        <table className="mt-4 w-full text-[10.5px]">
          <thead>
            <tr style={{ color: C.faint, borderBottom: `1px solid ${C.line}` }}>
              {["Profile", "Equity", "Fixed Income", "Cash", "Exp. return (5y)", "Max drawdown"].map((h, i) => (
                <th key={h} className={`pb-2 text-[9px] font-semibold uppercase tracking-wider ${i === 0 ? "text-left" : "text-right"}`} style={{ fontFamily: "var(--font-inter)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="font-mono" style={{ color: C.bodyDark }}>
            {([
              ["Defensive", "32.5%", "62.4%", "5.1%", "3.0–4.5%", "-8%", false],
              ["Cautious", "47.2%", "47.8%", "5.0%", "4.0–5.5%", "-12%", false],
              ["Balanced", "60.9%", "34.2%", "4.9%", "5.0–7.0%", "-18%", true],
              ["Growth", "76.3%", "18.8%", "5.0%", "6.5–8.5%", "-25%", true],
              ["Adventurous", "82.8%", "11.9%", "5.3%", "7.5–10.5%", "-35%", false],
            ] as const).map((r) => (
              <tr key={r[0]} style={{ borderBottom: `1px solid ${C.lineFaint}`, background: r[6] ? "rgba(138,63,252,0.06)" : undefined }}>
                <td className="py-1.5" style={{ fontFamily: "var(--font-inter)", color: r[6] ? C.goldDark : C.bodyDark, fontWeight: r[6] ? 600 : 400 }}>{r[0]}{r[6] && " ◂"}</td>
                {r.slice(1, 6).map((c, i) => <td key={i} className="text-right" style={{ color: i === 4 ? C.faint : undefined }}>{c}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
        <Foot n={n} />
      </PageShell>
    ),
  },

  /* 36 · GBP BALANCED MPS */
  {
    n: 36,
    label: "GBP Balanced MPS",
    render: (n) => (
      <PageShell>
        <PageHead title="GBP Balanced MPS · composition & holdings" n={n} />
        <div className="mt-5 grid grid-cols-[1fr_1.4fr] gap-3">
          <Card>
            <Label>Asset class allocation</Label>
            <div className="mt-3">
              <Donut slices={[["Equity", 60.51, C.gold], ["Fixed Income", 34.40, "#8c8378"], ["Cash", 5.09, "#d8cfbf"]]} />
            </div>
            <Hr />
            <Label>Key data</Label>
            <table className="mt-2 w-full text-[10px]"><tbody style={{ color: C.body }}>
              {[["Launch", "Jan 2016"], ["OCF", "0.75%"], ["Yield", "2.22%"], ["Currency", "GBP"], ["Liquidity", "Daily"]].map(([a, b]) => (
                <tr key={a}><td className="py-0.5" style={{ color: C.faint }}>{a}</td><td className="text-right font-mono">{b}</td></tr>
              ))}
              <tr style={{ borderTop: `1px solid ${C.line}` }}><td className="py-1 font-semibold" style={{ color: C.ink }}>YTD</td><td className="text-right font-mono font-semibold" style={{ color: C.sage }}>+7.43%</td></tr>
            </tbody></table>
          </Card>

          <div className="space-y-3">
            <Card>
              <Label>Top equity holdings (40 total)</Label>
              <div className="mt-2.5 grid grid-cols-2 gap-x-4 gap-y-1 text-[10px]">
                {([["Alphabet", 2.92], ["NVIDIA", 2.64], ["Eli Lilly", 2.22], ["Amazon", 2.19], ["Uber", 1.72], ["Hermès", 1.72], ["Microsoft", 1.69], ["TSMC", 1.67], ["Broadcom", 1.37], ["CBOE", 1.32], ["ASML", 1.16], ["Mastercard", 0.87]] as const).map(([name, w]) => (
                  <div key={name} className="flex items-center justify-between gap-2 border-b py-1" style={{ borderColor: C.lineFaint }}>
                    <span className="truncate" style={{ color: C.bodyDark }}>{name}</span>
                    <div className="flex shrink-0 items-center gap-1.5">
                      <div className="h-1 w-8 overflow-hidden rounded-sm" style={{ background: C.lineFaint }}><div className="h-full" style={{ width: `${(w / 3) * 100}%`, background: C.gold }} /></div>
                      <span className="w-9 text-right font-mono" style={{ color: C.body }}>{w.toFixed(2)}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
            <div className="grid grid-cols-2 gap-3">
              <Card tinted>
                <Label>Sector tilt</Label>
                <div className="mt-2 space-y-1.5 text-[10px]" style={{ color: C.body }}>
                  {[["Information Technology", "28.4%"], ["Healthcare", "14.1%"], ["Financials", "12.9%"], ["Cons. Discretionary", "11.7%"], ["Other", "32.9%"]].map(([a, b]) => (
                    <div key={a} className="flex items-center justify-between"><span>{a}</span><span className="font-mono">{b}</span></div>
                  ))}
                </div>
              </Card>
              <Card tinted>
                <Label>Geographic split</Label>
                <div className="mt-2 space-y-1.5 text-[10px]" style={{ color: C.body }}>
                  {[["United States", "58.2%"], ["Europe (ex UK)", "14.8%"], ["United Kingdom", "9.6%"], ["Asia-Pacific", "11.2%"], ["EM & other", "6.2%"]].map(([a, b]) => (
                    <div key={a} className="flex items-center justify-between"><span>{a}</span><span className="font-mono">{b}</span></div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
        <Foot n={n} />
      </PageShell>
    ),
  },

  /* 39 · FEE DRAG */
  {
    n: 39,
    label: "Fee drag",
    render: (n) => (
      <PageShell>
        <PageHead title="The true cost of advice: fee drag over time" n={n} />
        <p className="mt-4 max-w-2xl text-[12px] leading-relaxed" style={{ color: C.body }}>
          Fees compound the way returns do. Instead of a single headline percentage, we show the cumulative pound cost of every charge across your full horizon, alongside what the same plan would cost on a typical high-fee alternative.
        </p>

        <div className="mt-5 grid grid-cols-3 gap-3">
          <Card stripe="gold">
            <Label>Total fee drag · 13 years</Label>
            <BigNum>£220k</BigNum>
            <div className="mt-2 text-[9.5px]" style={{ color: C.faint }}>terminal value forgone to costs</div>
          </Card>
          <Card stripe="sage">
            <Label>Saved vs high-fee alt.</Label>
            <BigNum color={C.sage}>£163k</BigNum>
            <div className="mt-2 text-[9.5px]" style={{ color: C.faint }}>1.45% vs a 2.35% all-in peer</div>
          </Card>
          <Card stripe="amber">
            <Label>Reduction in yield (RIY)</Label>
            <BigNum>1.45%</BigNum>
            <div className="mt-2 text-[9.5px]" style={{ color: C.faint }}>vs 1.85% industry average</div>
          </Card>
        </div>

        <Card className="mt-4">
          <Label>Gross vs net wealth path: the gap is the fee</Label>
          <div className="mt-3"><FeeDragChart /></div>
          <div className="mt-4 grid grid-cols-3 gap-3">
            {([["Value at 58 · gross", "£3.17M", C.sage], ["Value at 58 · net of fees", "£2.95M", C.gold], ["Cumulative fee drag", "£220k", C.oxblood]] as const).map(([l, v, col]) => (
              <div key={l}>
                <Label>{l}</Label>
                <div className="mt-1 font-display text-[17px] font-semibold" style={{ color: col }}>{v}</div>
              </div>
            ))}
          </div>
        </Card>
        <Foot n={n} />
      </PageShell>
    ),
  },

  /* 41 · FEES */
  {
    n: 41,
    label: "Fees",
    render: (n) => (
      <PageShell>
        <PageHead title="Fees & transparency" n={n} />
        <p className="mt-3 text-[12px] leading-relaxed" style={{ color: C.body }}>
          Full breakdown of every charge applied to the recommended structure. Total RIY estimated at 1.45% pa, below the industry average of 1.85% pa for comparable wrappers.
        </p>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <Card>
            <Label>Platform &amp; product charges</Label>
            <table className="mt-2 w-full font-mono text-[11px]"><tbody style={{ color: C.bodyDark }}>
              {[["ICP fee (18 mo)", "0.50% pm"], ["Annual management", "0.125% pm"], ["Platform admin", "GBP 9.80 pm"], ["Trade execution", "GBP 5 / trade"]].map(([a, b]) => (
                <tr key={a}><td className="py-1" style={{ fontFamily: "var(--font-inter)" }}>{a}</td><td className="text-right">{b}</td></tr>
              ))}
            </tbody></table>
          </Card>
          <Card>
            <Label>Underlying OCF</Label>
            <table className="mt-2 w-full font-mono text-[11px]"><tbody style={{ color: C.bodyDark }}>
              {[["Balanced MPS", "0.75%", false], ["Growth MPS", "0.77%", false], ["Blended (60/40)", "0.76%", true], ["Industry avg", "0.95%", false]].map(([a, b, bold]) => (
                <tr key={a as string} style={{ color: a === "Industry avg" ? C.faint : undefined }}><td className="py-1" style={{ fontFamily: "var(--font-inter)", fontWeight: bold ? 700 : 400 }}>{a}</td><td className="text-right" style={{ fontWeight: bold ? 700 : 400 }}>{b}</td></tr>
              ))}
            </tbody></table>
          </Card>
        </div>

        <Card tinted className="mt-3">
          <div className="grid grid-cols-2 items-center gap-5">
            <div>
              <Label>Total RIY vs industry benchmark</Label>
              <div className="mt-2 space-y-3 text-[11px]">
                <div>
                  <div className="mb-1 flex justify-between" style={{ color: C.body }}><span>Industry average wrapper RIY</span><span className="font-mono font-semibold">1.85%</span></div>
                  <div className="h-2 overflow-hidden rounded" style={{ background: C.lineFaint }}><div className="h-full w-full" style={{ background: "#b3a896" }} /></div>
                </div>
                <div>
                  <div className="mb-1 flex justify-between" style={{ color: C.goldDark }}><span>Your structure RIY (est.)</span><span className="font-mono font-semibold">1.45%</span></div>
                  <div className="h-2 overflow-hidden rounded" style={{ background: C.lineFaint }}><div className="h-full" style={{ width: "78%", background: C.gold }} /></div>
                </div>
              </div>
            </div>
            <div>
              <Label>Starter bonus offset</Label>
              <div className="mt-1 font-display text-[22px] font-semibold" style={{ color: C.sage }}>+ GBP 6,840</div>
              <div className="mt-1 text-[9.5px]" style={{ color: C.faint }}>Credit applied to first 18 months, offsetting ~83% of ICP fees</div>
            </div>
          </div>
        </Card>
        <Foot n={n} />
      </PageShell>
    ),
  },

  /* 43 · TIMELINE */
  {
    n: 43,
    label: "Timeline",
    render: (n) => (
      <PageShell>
        <PageHead title="Implementation & servicing timeline" n={n} />
        <div className="mt-5 grid grid-cols-3 gap-3">
          {([["Phase 01", "First 6 weeks", "Implementation", "gold"], ["Phase 02", "6 months", "Stabilisation", "amber"], ["Phase 03", "Ongoing", "Cadenced review", "mahog"]] as const).map(([n, t, l, s]) => (
            <Card key={n} stripe={s}>
              <Label>{n}</Label>
              <div className="mt-1 font-display text-[17px] font-semibold" style={{ color: C.ink }}>{t}</div>
              <div className="mt-2"><Label>{l}</Label></div>
            </Card>
          ))}
        </div>

        <div className="mt-5 space-y-1">
          {([
            ["Week 1", "Spouse review", "Caroline joins for scope confirmation, ATR re-validation, signatory walkthrough", C.gold],
            ["Week 2", "Documentation", "KYC across providers, source-of-funds, applications prepared and signed", C.gold],
            ["Week 3", "First contribution", "SAR 39,800 standing order initiated · funds allocated 60/40 Balanced/Growth", C.gold],
            ["Week 4", "EOSB redirection plan", "Letter to PIF HR re. preferred receipt structure on exit (2031)", C.goldBright],
            ["Week 6", "Implementation audit", "Allocation verification · rebalance against committee allocation drift", C.goldBright],
            ["Month 3", "First review call", "Performance vs benchmark · positioning commentary · adjustment flagging", C.mahog],
            ["Quarterly", "Standing review", "Portfolio briefing · markets context · goal progress check-in", C.mahog],
            ["Annual", "Full review", "Fact-find refresh · review pack issued · 5-year roadmap progress", C.mahog],
          ] as const).map(([when, what, detail, col]) => (
            <div key={when + what} className="flex items-start gap-4 border-l-2 py-1.5 pl-4" style={{ borderColor: col }}>
              <div className="w-16 shrink-0 text-[10px] font-semibold uppercase tracking-wider" style={{ color: C.bodyDark }}>{when}</div>
              <div className="flex-1">
                <div className="text-[11.5px] font-semibold" style={{ color: C.ink }}>{what}</div>
                <div className="mt-0.5 text-[10px] leading-relaxed" style={{ color: C.body }}>{detail}</div>
              </div>
            </div>
          ))}
        </div>
        <Foot n={n} />
      </PageShell>
    ),
  },

  /* 45 · TEAM */
  {
    n: 45,
    label: "Your team",
    render: (n) => (
      <PageShell>
        <PageHead title="Your dedicated advice team" n={n} />
        <p className="mt-4 max-w-2xl text-[12px] leading-relaxed" style={{ color: C.body }}>
          The plan set out on the preceding pages is delivered by a dedicated four-person team. You hold the relationship with your Private Wealth Director; the team handles execution, paraplanning, and administration so nothing falls through the cracks.
        </p>

        <Card className="mt-6">
          <div className="flex items-start gap-5">
            <div className="grid h-16 w-16 shrink-0 place-items-center rounded-full text-[19px] font-semibold text-white" style={{ background: "linear-gradient(135deg,#3d2168,#1b1233)" }}>OW</div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <Pill tone="gold">Lead adviser</Pill>
                <Pill tone="slate">CISI Chartered</Pill>
              </div>
              <h3 className="mt-2 text-[17px] font-semibold" style={{ color: C.ink }}>Ben Thompson</h3>
              <div className="mt-0.5 text-[10.5px] font-semibold uppercase tracking-wider" style={{ color: C.goldDark }}>Private Wealth Director</div>
              <p className="mt-2.5 text-[11.5px] leading-relaxed" style={{ color: C.body }}>
                12 years advising international clients one-to-one. Core focus on retirement and legacy planning for expatriate professionals across the GCC, with cross-jurisdictional expertise across UK, US, and Australian regimes.
              </p>
              <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 font-mono text-[10px]" style={{ color: C.faint }}>
                <span>+971 50 248 9170</span>
                <span>ben.thompson@titanwealthinternational.com</span>
              </div>
            </div>
          </div>
        </Card>

        <div className="mt-3 grid grid-cols-3 gap-3">
          {([
            ["DH", "Daniel Hartwell", "Associate", "Cashflow modelling, investment analysis · 4 yrs GCC advisory", C.gold],
            ["SC", "Sarah Caldwell", "Paraplanner", "Portfolio construction, report drafting · 5 yrs international", C.goldBright],
            ["HV", "Helena Voss", "Executive Administrator", "KYC, onboarding, ongoing client servicing", "#6b6258"],
          ] as const).map(([init, name, role, bio, bg]) => (
            <Card key={name}>
              <div className="mb-3 flex items-center gap-3">
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-[11px] font-semibold text-white" style={{ background: bg }}>{init}</div>
                <div className="min-w-0">
                  <div className="text-[11.5px] font-semibold leading-tight" style={{ color: C.ink }}>{name}</div>
                  <div className="mt-0.5 text-[9px] uppercase tracking-wider" style={{ color: C.faint }}>{role}</div>
                </div>
              </div>
              <p className="text-[10px] leading-relaxed" style={{ color: C.body }}>{bio}</p>
            </Card>
          ))}
        </div>
        <Foot n={n} />
      </PageShell>
    ),
  },

  /* 46 · WHY TITAN */
  {
    n: 46,
    label: "Why Titan Wealth",
    render: (n) => (
      <PageShell>
        <PageHead title="Why Titan Wealth International" n={n} />
        <p className="mt-4 max-w-2xl text-[12px] leading-relaxed" style={{ color: C.body }}>
          We are expatriates advising expatriates. The same strategies we use to build and protect our own wealth abroad are the strategies we bring to your plan.
        </p>

        <div className="mt-6 grid grid-cols-4 gap-3">
          {([
            ["$48B+", "Group assets under advice"],
            ["18,000", "Clients across the group"],
            ["1,300", "Staff across the group"],
            ["80+", "Regulatory licenses"],
          ] as const).map(([v, l]) => (
            <Card key={l} stripe="gold">
              <BigNum sm>{v}</BigNum>
              <div className="mt-2 text-[9.5px] leading-snug" style={{ color: C.faint }}>{l}</div>
            </Card>
          ))}
        </div>

        <div className="mt-3 grid grid-cols-2 gap-3">
          <Card tinted>
            <Label color={C.goldDark}>Accreditations</Label>
            <p className="mt-2.5 text-[11px] leading-relaxed" style={{ color: C.body }}>
              Chartered Status at firm level with the Chartered Institute of Securities &amp; Investment, and International Professional Partner Firm status with the Chartered Insurance Institute.
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              <Pill tone="gold">CISI Chartered</Pill>
              <Pill tone="gold">CII Partner Firm</Pill>
              <Pill tone="slate">FT Top 100 Advisers</Pill>
            </div>
          </Card>
          <Card tinted>
            <Label color={C.goldDark}>Global footprint</Label>
            <div className="mt-2.5 grid grid-cols-2 gap-y-1.5 text-[10.5px]" style={{ color: C.body }}>
              {["United Kingdom", "United States", "Europe", "Middle East", "Africa", "Asia", "Australia", "Offshore"].map((r) => (
                <div key={r} className="flex items-center gap-1.5">
                  <span className="h-1 w-1 rounded-full" style={{ background: C.gold }} />{r}
                </div>
              ))}
            </div>
          </Card>
        </div>
        <Foot n={n} />
      </PageShell>
    ),
  },

  /* 47 · LETTER */
  {
    n: 47,
    label: "Letter",
    render: (n) => (
      <PageShell>
        <PageHead title="A personal note from your adviser" n={n} />
        <div className="mt-5 max-w-2xl space-y-3 text-[12.5px] leading-[1.7]" style={{ color: C.bodyDark }}>
          <p className="font-display text-[14px]">Dear James,</p>
          <p>Thank you for the candid conversation on the 22nd. This document is the first step. The figures will change as your life does; the structure is built to flex with them.</p>
          <p>The 2031 horizon is closer than it feels. Section 43 sets out the first six weeks. I will be in touch on Monday morning to confirm the spouse review with Caroline. She mentioned the NI restart concern, and I will bring our cross-border team into that call.</p>
          <p>The KSA gratuity piece is the lever I want us to focus on. There is a clear opportunity to capture five years of compounding before you head back to the UK, while you are still non-resident for UK purposes. Section 20 sets the case out in detail.</p>
          <p>In the meantime, your dedicated team (Daniel, Sarah and Helena) are available on the numbers attached. We review quarterly and reset the plan in full at the annual review. Both are included in our ongoing service.</p>
          <p className="mt-6 italic" style={{ color: C.faint }}>With my best regards,</p>
        </div>
        <div className="mt-2 max-w-2xl">
          <div className="font-display text-[20px] italic" style={{ color: C.ink }}>Ben Thompson</div>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-[10px]" style={{ color: C.faint }}>
            <span className="font-semibold uppercase tracking-wider">Private Wealth Director</span>
            <span className="h-3 w-px" style={{ background: C.line }} />
            <span className="font-mono">+971 50 248 9170</span>
            <span className="h-3 w-px" style={{ background: C.line }} />
            <span>ben.thompson@titanwealthinternational.com</span>
          </div>
        </div>
        <Foot n={n} />
      </PageShell>
    ),
  },
];

/* agent computed state from the master clock */
type AgentState = { state: "idle" | "running" | "done"; pct: number };
function agentStateAt(a: AgentDef, elapsed: number): AgentState {
  const dur = 10000 / a.speed;
  if (elapsed < a.startMs) return { state: "idle", pct: 0 };
  const pct = Math.min(100, ((elapsed - a.startMs) / dur) * 100);
  return { state: pct >= 100 ? "done" : "running", pct };
}

function fmtClock(ms: number) {
  const s = Math.min(ms, 14000) / 1000;
  const m = Math.floor(s / 60).toString().padStart(2, "0");
  const sec = Math.floor(s % 60).toString().padStart(2, "0");
  return `${m}:${sec}`;
}

/* ============================================================
   MAIN COMPONENT
============================================================ */
export function DemoStage() {
  const [elapsed, setElapsed] = useState(0);
  const [phase, setPhase] = useState<"idle" | "running" | "paused" | "done">("idle");
  const [activePage, setActivePage] = useState<number>(PAGES[0].n);

  const rafRef = useRef<number | null>(null);
  const startTsRef = useRef<number | null>(null);
  const baseRef = useRef(0);
  const lastRevealedRef = useRef(0);

  const loop = useCallback((ts: number) => {
    if (startTsRef.current === null) startTsRef.current = ts;
    const e = baseRef.current + (ts - startTsRef.current);
    if (e >= COMPLETE_AT) {
      baseRef.current = COMPLETE_AT;
      setElapsed(COMPLETE_AT);
      setPhase("done");
      rafRef.current = null;
      return;
    }
    setElapsed(e);
    rafRef.current = requestAnimationFrame(loop);
  }, []);

  const play = useCallback(() => {
    startTsRef.current = null;
    setPhase("running");
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(loop);
  }, [loop]);

  const pause = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    baseRef.current = elapsed;
    setPhase("paused");
  }, [elapsed]);

  const replay = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    baseRef.current = 0;
    lastRevealedRef.current = 0;
    setElapsed(0);
    setActivePage(PAGES[0].n);
    startTsRef.current = null;
    setPhase("running");
    rafRef.current = requestAnimationFrame(loop);
  }, [loop]);

  // autoplay on mount (or jump to complete for reduced motion)
  useEffect(() => {
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      baseRef.current = COMPLETE_AT;
      lastRevealedRef.current = PAGES.length;
      setElapsed(COMPLETE_AT);
      setActivePage(PAGES[PAGES.length - 1].n);
      setPhase("done");
      return;
    }
    play();
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // follow the latest revealed page as the build progresses
  const revealedCount = useMemo(
    () => PAGES.filter((_, i) => pageRevealAt(i, PAGES.length) <= elapsed).length,
    [elapsed],
  );
  useEffect(() => {
    if (revealedCount > 0 && revealedCount !== lastRevealedRef.current) {
      lastRevealedRef.current = revealedCount;
      setActivePage(PAGES[revealedCount - 1].n);
    }
  }, [revealedCount]);

  const done = phase === "done";
  const completedNums = PAGES.slice(0, done ? PAGES.length : revealedCount).map((p) => p.n);
  const pagesBuilt = done
    ? TOTAL_PAGES
    : Math.min(TOTAL_PAGES, Math.round((revealedCount / PAGES.length) * TOTAL_PAGES));
  const current = PAGES.find((p) => p.n === activePage) ?? PAGES[0];
  const showBody = revealedCount > 0 || done;

  return (
    <div>
      {/* template-loaded ribbon */}
      <div className="mb-3 flex items-center gap-2 text-[11px] text-cream/55">
        <Check className="h-3.5 w-3.5 text-gold-soft" />
        <span>
          <span className="text-cream/80">Template loaded:</span>{" "}
          titan-bespoke-assessment-v3.template{" "}
          <span className="text-cream/35">· indexed on 142 prior reports · trained on adviser voice · product universe synced</span>
        </span>
      </div>

      <div className="overflow-hidden rounded-2xl border border-cream/10 bg-espresso shadow-[var(--shadow-warm-lg)]">
        {/* window chrome */}
        <div className="flex items-center justify-between border-b border-cream/[0.08] bg-cream/[0.02] px-5 py-3">
          <div className="flex items-center gap-2.5">
            <span className="h-2.5 w-2.5 rounded-full bg-cream/15" />
            <span className="h-2.5 w-2.5 rounded-full bg-cream/15" />
            <span className="h-2.5 w-2.5 rounded-full bg-cream/15" />
            <span className="ml-2 font-mono text-[11px] text-cream/45">twi · report-generator</span>
          </div>
          <div className="flex items-center gap-4 font-mono text-[11px] text-cream/45">
            <span>{fmtClock(elapsed)}</span>
            <span className="hidden sm:inline">|</span>
            <span className="hidden sm:inline">Pages built: <span className="text-gold-soft">{pagesBuilt}</span> / {TOTAL_PAGES}</span>
            <div className="flex items-center gap-1.5">
              {phase === "running" ? (
                <button onClick={pause} className="flex items-center gap-1 rounded-full border border-cream/15 px-2.5 py-1 text-[10px] uppercase tracking-[0.1em] text-cream/65 transition-colors hover:text-cream">
                  <Pause className="h-3 w-3" /> Pause
                </button>
              ) : phase === "paused" ? (
                <button onClick={play} className="flex items-center gap-1 rounded-full border border-cream/15 px-2.5 py-1 text-[10px] uppercase tracking-[0.1em] text-cream/65 transition-colors hover:text-cream">
                  <Play className="h-3 w-3" /> Resume
                </button>
              ) : (
                <button onClick={replay} className="flex items-center gap-1 rounded-full border border-cream/15 px-2.5 py-1 text-[10px] uppercase tracking-[0.1em] text-cream/65 transition-colors hover:text-cream">
                  <RotateCcw className="h-3 w-3" /> {done ? "Replay" : "Run"}
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="grid divide-y divide-cream/[0.06] md:grid-cols-[230px_210px_minmax(0,1fr)] md:divide-x md:divide-y-0">
          {/* INPUT */}
          <div className="max-h-[760px] overflow-y-auto p-5 scrollbar-hide">
            <div className="mb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-cream/45">Input · Discovery call</div>
            <pre className="whitespace-pre-wrap font-mono text-[10.5px] leading-[1.65] text-cream/70">{DISCOVERY}</pre>
          </div>

          {/* AGENTS */}
          <div className="p-5">
            <div className="mb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-cream/45">Agents</div>
            <div className="space-y-2.5">
              {AGENTS.map((a) => {
                const s = agentStateAt(a, elapsed);
                const border =
                  s.state === "running" ? "border-gold/40" : s.state === "done" ? "border-sage/40" : "border-cream/[0.06]";
                const icon =
                  s.state === "done" ? "text-sage" : s.state === "running" ? "text-gold-soft" : "text-cream/35";
                const status = s.state === "idle" ? "—" : s.state === "done" ? "Done" : `${Math.round(s.pct)}%`;
                const bar = s.state === "done" ? "bg-sage" : "bg-gold";
                const Icon = a.Icon;
                return (
                  <div key={a.id} className={`rounded-md border bg-cream/[0.02] px-3 py-2.5 ${border}`}>
                    <div className="flex items-center gap-2.5">
                      <Icon className={`h-3.5 w-3.5 ${icon} ${s.state === "running" ? "animate-pulse" : ""}`} />
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-[12px] font-semibold leading-tight text-cream">{a.label}</div>
                        <div className="mt-0.5 text-[10px] text-cream/45">{a.sub}</div>
                      </div>
                      <div className="w-8 shrink-0 text-right font-mono text-[10px] text-cream/45">{status}</div>
                    </div>
                    <div className="mt-2 h-[2px] overflow-hidden rounded-sm bg-cream/[0.06]">
                      <div className={`h-full ${bar}`} style={{ width: `${s.pct}%`, transition: "width 200ms cubic-bezier(0.23,1,0.32,1)" }} />
                    </div>
                  </div>
                );
              })}
            </div>

            {done && (
              <div className="mt-5 border-t border-cream/[0.08] pt-4">
                <div className="mb-1.5 flex items-center gap-2 font-semibold text-sage">
                  <Check className="h-3.5 w-3.5" />
                  <span className="text-[12px] text-cream">Report ready for adviser review</span>
                </div>
                <div className="mb-3 font-mono text-[10px] leading-relaxed text-cream/50">
                  Built in 14.0s · 47 pages · trained on 142 prior reports
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <span className="flex items-center gap-1 rounded border border-cream/10 bg-cream/[0.03] px-2 py-1 text-[10px] text-cream/70"><Download className="h-3 w-3" /> Export PDF</span>
                  <span className="flex items-center gap-1 rounded border border-cream/10 bg-cream/[0.03] px-2 py-1 text-[10px] text-cream/70"><FileText className="h-3 w-3" /> Export Keynote</span>
                  <span className="flex items-center gap-1 rounded border border-cream/10 bg-cream/[0.03] px-2 py-1 text-[10px] text-cream/70"><Send className="h-3 w-3" /> Send to CRM</span>
                </div>
              </div>
            )}
          </div>

          {/* OUTPUT DOCUMENT */}
          <div className="relative flex flex-col bg-white" style={{ minHeight: 760 }}>
            <div className="flex shrink-0 items-center justify-between border-b px-6 py-3 text-[10px]" style={{ borderColor: C.line, color: C.faint }}>
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-semibold uppercase tracking-[0.18em]" style={{ color: C.head }}>Bespoke Wealth Assessment</span>
                <span className={`hidden font-mono transition-opacity duration-500 sm:inline ${showBody ? "opacity-100" : "opacity-0"}`}>28 May 2026 · AD-2026-1042 · J. Whitlock-Bryant</span>
              </div>
              <span className="font-mono">{showBody ? `${String(activePage).padStart(2, "0")} / ${TOTAL_PAGES}` : `— / ${TOTAL_PAGES}`}</span>
            </div>

            {/* page tabs */}
            <div className="flex shrink-0 gap-0.5 overflow-x-auto border-b px-2 py-1.5 scrollbar-hide" style={{ borderColor: C.line }}>
              {PAGES.map((p) => {
                const isActive = p.n === activePage;
                const isDone = completedNums.includes(p.n);
                return (
                  <button
                    key={p.n}
                    disabled={!isDone}
                    onClick={() => isDone && setActivePage(p.n)}
                    className="shrink-0 rounded px-2 py-1 text-[10px] font-medium transition-colors"
                    style={{
                      background: isActive ? C.mahog : "transparent",
                      color: isActive ? "#fff" : isDone ? C.bodyDark : "#cabfb0",
                      cursor: isDone && !isActive ? "pointer" : "default",
                    }}
                  >
                    <span className="mr-0.5 font-mono text-[9px] opacity-60">{String(p.n).padStart(2, "0")}</span>
                    {p.label}
                  </button>
                );
              })}
            </div>

            {/* page body */}
            <div className="relative flex-1 overflow-y-auto">
              {showBody ? (
                <div key={activePage} className="report-page-in">
                  {current.render(current.n)}
                </div>
              ) : (
                <div className="grid h-full place-items-center px-8 py-20 text-center">
                  <div>
                    <div className="mb-2 text-[10px] uppercase tracking-[0.18em]" style={{ color: C.faint }}>Agents working</div>
                    <div className="text-[13px] italic" style={{ color: C.body }}>Building bespoke assessment in your template…</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-start gap-2.5 text-[11px] leading-relaxed text-cream/40">
        <span className="mt-0.5">ⓘ</span>
        <span>Demonstration content. Client data, recommendations and figures are synthesised for a fictional case. After the build completes, click any page tab to browse.</span>
      </div>
    </div>
  );
}

