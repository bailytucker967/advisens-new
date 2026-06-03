"use client";

import { type ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/**
 * Renders a report's markdown as a designed, branded "document" — the kind of
 * paginated, chart-rich report an adviser would actually hand a client, not a
 * flat Word-style page.
 *
 * On top of standard markdown it understands a small set of fenced "directive"
 * blocks that render real SVG charts and calculator panels inline. This lets a
 * generated report SHOW how the numbers were arrived at:
 *
 *   ```advisens-callouts
 *   [{ "label": "Projected at 60", "value": "£1.42m", "sub": "net of fees" }]
 *   ```
 *
 *   ```advisens-calc
 *   { "title": "Retirement gap model",
 *     "inputs": [{ "k": "Current capital", "v": "£250,000" }],
 *     "outputs": [{ "k": "Projected pot at 60", "v": "£1.42m", "emphasis": true }] }
 *   ```
 *
 *   ```advisens-growth
 *   { "title": "Projected wealth path", "note": "GBP · net of fees",
 *     "xLabels": ["2026","2035","2044"], "max": 1500,
 *     "series": [{ "label": "Recommended", "points": [250,640,1420] },
 *                { "label": "Status quo (cash)", "points": [250,300,360], "muted": true }] }
 *   ```
 *
 *   ```advisens-donut
 *   { "title": "Balanced model portfolio", "note": "target weights",
 *     "segments": [{ "label": "Global equities", "value": 55 },
 *                  { "label": "Fixed income", "value": 30 },
 *                  { "label": "Alternatives", "value": 10 },
 *                  { "label": "Cash", "value": 5 }] }
 *   ```
 *
 *   ```advisens-bars
 *   { "title": "Retirement income gap", "unit": "£/yr",
 *     "items": [{ "label": "Target net income", "value": 95000, "max": 95000 },
 *               { "label": "Projected from current plan", "value": 61000, "max": 95000, "muted": true }] }
 *   ```
 */

const GOLD = "#8a3ffc";
const GOLD_BRIGHT = "#9a5bff";
const GOLD_SOFT = "#c4a3ff";
const INK = "#31135e";
const SLATE = "#475569";

const DONUT_COLORS = [GOLD, GOLD_BRIGHT, "#6b7257", GOLD_SOFT, "#998fb3", "#cbb89a"];

function nodeText(node: unknown): string {
  if (node == null || node === false) return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(nodeText).join("");
  // React element with children
  const props = (node as { props?: { children?: unknown } }).props;
  if (props && "children" in props) return nodeText(props.children);
  return "";
}

function safeParse<T>(raw: unknown): T | null {
  try {
    return JSON.parse(nodeText(raw).trim()) as T;
  } catch {
    return null;
  }
}

export function ReportDocument({
  markdown,
  firmName,
  preparedDate,
  frameless,
}: {
  markdown: string;
  firmName?: string | null;
  preparedDate?: string | null;
  frameless?: boolean;
}) {
  return (
    <div
      className={
        frameless
          ? "bg-white text-slate-800"
          : "overflow-hidden rounded-lg bg-white text-slate-800 shadow-xl shadow-black/20 ring-1 ring-black/5"
      }
    >
      {/* Titan content-slide header: purple corner tab + Powering Ambitions + TW mark */}
      <div className="relative px-8 pt-7 sm:px-12">
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

      <div className="max-w-none px-10 py-6 sm:px-14 sm:py-7">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h1: (props) => (
              <h1
                className="mt-0 mb-2 font-display text-[30px] font-semibold leading-tight tracking-tight text-slate-900"
                {...props}
              />
            ),
            h2: (props) => (
              <h2
                className="mt-0 mb-3 font-display text-[26px] font-semibold leading-tight tracking-tight text-twi-deep"
                {...props}
              />
            ),
            h3: (props) => (
              <h3
                className="mt-4 mb-1.5 text-[14px] font-semibold text-slate-900"
                {...props}
              />
            ),
            p: (props) => (
              <p className="my-2 text-[13.5px] leading-[1.5] text-slate-700" {...props} />
            ),
            ul: (props) => (
              <ul
                className="my-3 list-disc space-y-1.5 pl-5 text-[14px] text-slate-700"
                {...props}
              />
            ),
            ol: (props) => (
              <ol
                className="my-3 list-decimal space-y-1.5 pl-5 text-[14px] text-slate-700"
                {...props}
              />
            ),
            li: (props) => <li className="leading-[1.65]" {...props} />,
            strong: (props) => (
              <strong className="font-semibold text-slate-900" {...props} />
            ),
            em: (props) => <em className="italic" {...props} />,
            blockquote: (props) => (
              <blockquote
                className="my-5 rounded-r-md border-l-[3px] border-gold/60 bg-gold-soft/10 py-2 pl-4 pr-3 text-[13.5px] italic text-slate-600"
                {...props}
              />
            ),
            a: (props) => (
              <a className="text-gold-600 underline underline-offset-2" {...props} />
            ),
            hr: () => <hr className="my-4 border-slate-200" />,
            // `pre` unwraps so our chart blocks aren't wrapped in a <pre>.
            pre: ({ children }) => <>{children}</>,
            code: ({ className, children }) => {
              const lang = /language-advisens-(\w+)/.exec(className || "")?.[1];
              if (lang) {
                const data = safeParse<Record<string, unknown>>(children);
                if (data) return <Directive kind={lang} data={data} />;
              }
              const isBlock = (className || "").startsWith("language-");
              if (isBlock) {
                return (
                  <pre className="my-4 overflow-x-auto rounded-md bg-slate-50 p-3 text-[12px] font-mono text-slate-700">
                    {children}
                  </pre>
                );
              }
              return (
                <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[12px] text-slate-800">
                  {children}
                </code>
              );
            },
            table: (props) => (
              <div className="my-3 overflow-x-auto rounded-lg border border-slate-200">
                <table className="w-full border-collapse text-[13px] text-slate-700" {...props} />
              </div>
            ),
            thead: (props) => <thead className="bg-slate-50" {...props} />,
            th: (props) => (
              <th
                className="border-b border-slate-200 px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500"
                {...props}
              />
            ),
            td: (props) => (
              <td className="border-b border-slate-100 px-3 py-2 align-top" {...props} />
            ),
          }}
        >
          {markdown}
        </ReactMarkdown>
      </div>
    </div>
  );
}

/* ── Directive router ──────────────────────────────────────────────── */

function Directive({ kind, data }: { kind: string; data: Record<string, unknown> }) {
  switch (kind) {
    case "callouts":
      return <Callouts items={(data as unknown as { items?: Callout[] }).items ?? (data as unknown as Callout[])} />;
    case "calc":
      return <CalcPanel data={data as unknown as CalcData} />;
    case "growth":
      return <GrowthChart data={data as unknown as GrowthData} />;
    case "donut":
      return <DonutChart data={data as unknown as DonutData} />;
    case "bars":
      return <BarsChart data={data as unknown as BarsData} />;
    default:
      return null;
  }
}

function Frame({ title, note, children }: { title?: string; note?: string; children: ReactNode }) {
  return (
    <figure className="my-4 rounded-xl border border-slate-200 bg-gradient-to-b from-slate-50/60 to-white p-4">
      {(title || note) && (
        <figcaption className="mb-4 flex items-baseline justify-between gap-3">
          {title && (
            <span className="font-display text-[15px] font-semibold text-slate-900">{title}</span>
          )}
          {note && (
            <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-slate-400">
              {note}
            </span>
          )}
        </figcaption>
      )}
      {children}
    </figure>
  );
}

/* ── Stat callouts ─────────────────────────────────────────────────── */

type Callout = { label: string; value: string; sub?: string };

function Callouts({ items }: { items: Callout[] }) {
  if (!Array.isArray(items)) return null;
  return (
    <div className="my-4 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-slate-200 bg-slate-200 sm:grid-cols-4">
      {items.map((s, i) => (
        <div key={i} className="bg-white px-4 py-4">
          <div className="font-display text-[24px] leading-none text-slate-900">{s.value}</div>
          <div className="mt-1.5 font-mono text-[9px] uppercase tracking-[0.14em] text-gold-600">
            {s.label}
          </div>
          {s.sub && <div className="mt-0.5 text-[10px] text-slate-400">{s.sub}</div>}
        </div>
      ))}
    </div>
  );
}

/* ── Calculator panel (inputs → outputs) ───────────────────────────── */

type KV = { k: string; v: string; emphasis?: boolean };
type CalcData = { title?: string; note?: string; inputs: KV[]; outputs: KV[]; footnote?: string };

function CalcPanel({ data }: { data: CalcData }) {
  const inputs = data.inputs ?? [];
  const outputs = data.outputs ?? [];
  return (
    <Frame title={data.title ?? "How this was calculated"} note={data.note ?? "model inputs → output"}>
      <div className="grid gap-5 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
        {/* inputs */}
        <div className="space-y-1.5">
          <div className="mb-2 font-mono text-[9px] uppercase tracking-[0.16em] text-slate-400">
            Inputs gathered
          </div>
          {inputs.map((row, i) => (
            <div
              key={i}
              className="flex items-baseline justify-between gap-3 border-b border-dashed border-slate-200 pb-1.5 text-[12.5px]"
            >
              <span className="text-slate-500">{row.k}</span>
              <span className="font-mono font-medium text-slate-800">{row.v}</span>
            </div>
          ))}
        </div>
        {/* arrow */}
        <div className="hidden place-items-center sm:grid">
          <div className="grid h-9 w-9 place-items-center rounded-full border border-gold/30 text-gold-600">
            →
          </div>
        </div>
        {/* outputs */}
        <div className="space-y-2 rounded-lg bg-gold-soft/10 p-4 ring-1 ring-gold/15">
          <div className="mb-1 font-mono text-[9px] uppercase tracking-[0.16em] text-gold-600">
            Modelled output
          </div>
          {outputs.map((row, i) => (
            <div key={i} className="flex items-baseline justify-between gap-3">
              <span className="text-[12.5px] text-slate-600">{row.k}</span>
              <span
                className={
                  row.emphasis
                    ? "font-display text-[20px] leading-none text-slate-900"
                    : "font-mono text-[13px] font-medium text-slate-800"
                }
              >
                {row.v}
              </span>
            </div>
          ))}
        </div>
      </div>
      {data.footnote && (
        <p className="mt-3 text-[11px] leading-relaxed text-slate-400">{data.footnote}</p>
      )}
    </Frame>
  );
}

/* ── Growth chart (area + comparison line) ─────────────────────────── */

type GrowthSeries = { label: string; points: number[]; muted?: boolean };
type GrowthData = { title?: string; note?: string; xLabels?: string[]; max?: number; series: GrowthSeries[] };

function GrowthChart({ data }: { data: GrowthData }) {
  const series = data.series ?? [];
  const w = 600;
  const h = 170;
  const allPts = series.flatMap((s) => s.points);
  const max = data.max ?? (allPts.length ? Math.max(...allPts) * 1.1 : 100);
  const main = series[0];
  const n = main?.points.length ?? 0;
  const x = (i: number) => (n <= 1 ? 0 : (i / (n - 1)) * w);
  const y = (v: number) => h - (v / max) * h;
  const toLine = (pts: number[]) => pts.map((v, i) => `${x(i)},${y(v)}`).join(" ");

  return (
    <Frame title={data.title} note={data.note}>
      <svg viewBox={`0 0 ${w} ${h}`} className="h-[170px] w-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id="rd-growth-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={GOLD} stopOpacity="0.26" />
            <stop offset="100%" stopColor={GOLD} stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0.25, 0.5, 0.75].map((g) => (
          <line key={g} x1="0" x2={w} y1={h * g} y2={h * g} stroke="rgba(71,85,105,0.10)" strokeWidth="1" />
        ))}
        {main && <polygon points={`0,${h} ${toLine(main.points)} ${w},${h}`} fill="url(#rd-growth-fill)" />}
        {series.map((s, si) => (
          <polyline
            key={si}
            points={toLine(s.points)}
            fill="none"
            stroke={s.muted ? "rgba(71,85,105,0.45)" : GOLD}
            strokeWidth={s.muted ? 1.5 : 2.5}
            strokeDasharray={s.muted ? "5 4" : undefined}
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
        ))}
        {main && <circle cx={x(n - 1)} cy={y(main.points[n - 1])} r="4" fill={GOLD} />}
      </svg>
      <div className="mt-2 flex items-center justify-between">
        <div className="flex flex-wrap gap-4">
          {series.map((s, i) => (
            <span key={i} className="flex items-center gap-1.5 text-[11px] text-slate-500">
              <span
                className="inline-block h-2 w-3 rounded-sm"
                style={{ background: s.muted ? "rgba(71,85,105,0.45)" : GOLD }}
              />
              {s.label}
            </span>
          ))}
        </div>
        {data.xLabels && (
          <div className="flex gap-4 font-mono text-[9px] uppercase tracking-[0.12em] text-slate-400">
            {data.xLabels.map((l, i) => (
              <span key={i}>{l}</span>
            ))}
          </div>
        )}
      </div>
    </Frame>
  );
}

/* ── Donut chart ───────────────────────────────────────────────────── */

type DonutSeg = { label: string; value: number; color?: string };
type DonutData = { title?: string; note?: string; segments: DonutSeg[] };

function DonutChart({ data }: { data: DonutData }) {
  const segs = data.segments ?? [];
  const total = segs.reduce((a, s) => a + s.value, 0) || 1;
  const R = 52;
  const r = 32;
  const cx = 60;
  const cy = 60;
  let acc = 0;
  const arc = (frac: number) => {
    const a = 2 * Math.PI * frac - Math.PI / 2;
    return [cx + R * Math.cos(a), cy + R * Math.sin(a), cx + r * Math.cos(a), cy + r * Math.sin(a)];
  };

  return (
    <Frame title={data.title} note={data.note}>
      <div className="flex flex-col items-center gap-6 sm:flex-row sm:gap-8">
        <svg viewBox="0 0 120 120" className="h-[150px] w-[150px] shrink-0">
          {segs.map((s, i) => {
            const f0 = acc / total;
            acc += s.value;
            const f1 = acc / total;
            const [x0o, y0o, x0i, y0i] = arc(f0);
            const [x1o, y1o, x1i, y1i] = arc(f1);
            const large = f1 - f0 > 0.5 ? 1 : 0;
            const d = `M ${x0o} ${y0o} A ${R} ${R} 0 ${large} 1 ${x1o} ${y1o} L ${x1i} ${y1i} A ${r} ${r} 0 ${large} 0 ${x0i} ${y0i} Z`;
            return <path key={i} d={d} fill={s.color ?? DONUT_COLORS[i % DONUT_COLORS.length]} />;
          })}
        </svg>
        <ul className="w-full space-y-2">
          {segs.map((s, i) => (
            <li key={i} className="flex items-center justify-between gap-3 text-[12.5px]">
              <span className="flex items-center gap-2 text-slate-600">
                <span
                  className="inline-block h-2.5 w-2.5 rounded-sm"
                  style={{ background: s.color ?? DONUT_COLORS[i % DONUT_COLORS.length] }}
                />
                {s.label}
              </span>
              <span className="font-mono font-medium text-slate-800">
                {Math.round((s.value / total) * 100)}%
              </span>
            </li>
          ))}
        </ul>
      </div>
    </Frame>
  );
}

/* ── Horizontal bars (gap / comparison) ────────────────────────────── */

type BarItem = { label: string; value: number; max: number; muted?: boolean; valueLabel?: string };
type BarsData = { title?: string; note?: string; unit?: string; items: BarItem[] };

function BarsChart({ data }: { data: BarsData }) {
  const items = data.items ?? [];
  return (
    <Frame title={data.title} note={data.note ?? data.unit}>
      <div className="space-y-3.5">
        {items.map((it, i) => {
          const pct = Math.max(0, Math.min(100, (it.value / (it.max || 1)) * 100));
          return (
            <div key={i}>
              <div className="mb-1 flex items-baseline justify-between text-[12px]">
                <span className="text-slate-600">{it.label}</span>
                <span className="font-mono font-medium text-slate-800">
                  {it.valueLabel ?? it.value.toLocaleString()}
                </span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${pct}%`,
                    background: it.muted
                      ? "rgba(71,85,105,0.35)"
                      : `linear-gradient(90deg, ${GOLD_SOFT}, ${GOLD})`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </Frame>
  );
}
