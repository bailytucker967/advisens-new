"use client";

import {
  type ReactNode,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Maximize2, Minimize2 } from "lucide-react";
import { ReportDocument } from "./ReportDocument";
import { withMpsAppendix } from "@/lib/mps-appendix";

/**
 * Renders a report as a click-through SLIDE DECK — one fixed 16:9 slide at a
 * time (deep-purple cover, then one branded content slide per `## ` section,
 * with the standard MPS appendix spliced in). Every slide is the same size: the
 * deck is authored on a 1280×720 canvas and scaled to fit, and content is
 * centred so slides never look top-heavy. Click the slide / use the arrows /
 * chevrons / dots to advance, or present it full-screen.
 */

const CW = 1280;
const CH = 720;

function splitSlides(md: string): string[] {
  const lines = (md || "").split("\n");
  const slides: string[] = [];
  let cur: string[] = [];
  const hasContent = (a: string[]) => a.some((l) => l.trim().length > 0);
  for (const line of lines) {
    if (/^##\s+/.test(line) && hasContent(cur)) {
      slides.push(cur.join("\n").trim());
      cur = [line];
    } else {
      cur.push(line);
    }
  }
  if (hasContent(cur)) slides.push(cur.join("\n").trim());
  return slides.length ? slides : [md];
}

/** Concentric arcs sweeping in from the right edge, echoing the real cover. */
function CoverArcs() {
  const colors = ["#8a3ffc", "#ffffff", "#8a3ffc", "#ffffff", "#8a3ffc", "#ffffff"];
  return (
    <svg
      className="pointer-events-none absolute right-0 top-0 h-full"
      width={CH}
      height={CH}
      viewBox="0 0 720 720"
      fill="none"
      aria-hidden
    >
      {[150, 215, 280, 345, 410, 475].map((r, i) => (
        <circle
          key={r}
          cx="720"
          cy="360"
          r={r}
          stroke={colors[i % colors.length]}
          strokeWidth="15"
          opacity="0.92"
        />
      ))}
    </svg>
  );
}

/** Deep-purple cover (1280×720) matching the real Titan report cover. */
function Cover({
  coverLabel,
  clientName,
}: {
  coverLabel: string;
  clientName?: string | null;
}) {
  return (
    <div className="relative h-full w-full overflow-hidden bg-twi-deep text-white">
      <CoverArcs />
      <Image
        src="/brand/twi-logo-white.png"
        alt="Titan Wealth International"
        width={300}
        height={89}
        priority
        className="absolute left-16 top-14 h-[58px] w-auto"
      />
      <h1 className="absolute left-16 top-[300px] font-display text-[64px] font-light leading-none tracking-tight text-white">
        {coverLabel}
      </h1>
      {clientName && (
        <div className="absolute bottom-14 left-16 font-display text-[30px] font-light text-white/90">
          {clientName}
        </div>
      )}
      <div className="absolute bottom-[60px] right-16 font-mono text-[15px] tracking-wide text-white/45">
        www.titanwealthinternational.com
      </div>
    </div>
  );
}

/** A content slide: ReportDocument laid out at 1280 wide, scaled to fit the
 * 720-tall canvas, and centred so short slides aren't top-heavy. */
function ContentCanvas({ markdown }: { markdown: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      const h = el.scrollHeight;
      setScale(h > CH ? CH / h : 1);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [markdown]);

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-white">
      <div ref={ref} style={{ width: CW, transform: `scale(${scale})`, transformOrigin: "center" }}>
        <ReportDocument markdown={markdown} frameless />
      </div>
    </div>
  );
}

/** Responsive 16:9 stage that scales the 1280×720 canvas to its own width. */
function Stage({
  children,
  onClick,
  className = "",
}: {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fit = () => setScale(el.clientWidth / CW);
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      onClick={onClick}
      className={`relative w-full overflow-hidden rounded-xl ring-1 ring-black/10 ${className}`}
      style={{ height: scale ? CH * scale : undefined, aspectRatio: scale ? undefined : "16 / 9" }}
    >
      {scale > 0 && (
        <div
          style={{ width: CW, height: CH, transform: `scale(${scale})`, transformOrigin: "top left" }}
          className="absolute left-0 top-0"
        >
          {children}
        </div>
      )}
    </div>
  );
}

export function SlideDeck({
  markdown,
  firmName,
  preparedDate,
  title,
  coverLabel,
  clientName,
}: {
  markdown: string;
  firmName?: string | null;
  preparedDate?: string | null;
  title?: string | null;
  coverLabel?: string | null;
  clientName?: string | null;
}) {
  const body = withMpsAppendix(splitSlides(markdown));
  const label = coverLabel || "Assessment Report";
  const total = body.length + 1; // + cover
  const [i, setI] = useState(0);
  const [isFs, setIsFs] = useState(false);
  const deckRef = useRef<HTMLDivElement>(null);

  useEffect(() => setI(0), [markdown]);

  const go = useCallback(
    (n: number) => setI(() => Math.max(0, Math.min(total - 1, n))),
    [total],
  );
  const next = useCallback(() => setI((p) => Math.min(total - 1, p + 1)), [total]);
  const prev = useCallback(() => setI((p) => Math.max(0, p - 1)), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA")) return;
      if (e.key === "ArrowRight" || e.key === "PageDown" || e.key === " ") {
        e.preventDefault();
        next();
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault();
        prev();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  useEffect(() => {
    const onFs = () => setIsFs(document.fullscreenElement === deckRef.current);
    document.addEventListener("fullscreenchange", onFs);
    return () => document.removeEventListener("fullscreenchange", onFs);
  }, []);

  const toggleFs = () => {
    if (document.fullscreenElement) document.exitFullscreen?.().catch(() => {});
    else deckRef.current?.requestFullscreen?.().catch(() => {});
  };

  const renderSlide = (idx: number) =>
    idx === 0 ? (
      <Cover coverLabel={label} clientName={clientName} />
    ) : (
      <ContentCanvas markdown={body[idx - 1]} />
    );

  const ctlBtn = isFs
    ? "rounded-md border border-white/20 bg-white/10 px-3 py-1.5 text-[12px] text-white/80 transition-colors hover:text-white disabled:opacity-40"
    : "rounded-md border border-mahogany/15 bg-cream-50 px-3 py-1.5 text-[12px] text-mahogany-500 transition-colors hover:text-mahogany disabled:opacity-40";

  return (
    <div className="report-print-surface">
      {/* ── Interactive slideshow (also the full-screen surface) ── */}
      <div
        ref={deckRef}
        className={
          isFs
            ? "flex h-screen w-screen flex-col items-center justify-center gap-4 bg-[#0a0a0d] p-6"
            : "print:hidden"
        }
      >
        <div
          className="w-full"
          style={isFs ? { maxWidth: "min(100%, calc((100vh - 90px) * 16 / 9))" } : undefined}
        >
          <div className="group relative">
            <Stage onClick={next} className="cursor-pointer select-none shadow-2xl">
              {renderSlide(i)}
            </Stage>

            {i > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prev();
                }}
                aria-label="Previous slide"
                className="absolute left-2 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-twi-deep/70 text-white opacity-0 backdrop-blur transition-opacity hover:bg-twi-deep group-hover:opacity-100"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
            )}
            {i < total - 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  next();
                }}
                aria-label="Next slide"
                className="absolute right-2 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-twi-deep/70 text-white opacity-0 backdrop-blur transition-opacity hover:bg-twi-deep group-hover:opacity-100"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            )}
          </div>

          {/* Controls */}
          <div className="mt-3 flex items-center justify-between gap-2">
            <button onClick={prev} disabled={i === 0} className={ctlBtn}>
              ← Prev
            </button>
            <div
              className={`font-mono text-[11px] uppercase tracking-[0.18em] ${
                isFs ? "text-white/60" : "text-mahogany-400"
              }`}
            >
              Slide {i + 1} / {total}
            </div>
            <div className="flex items-center gap-2">
              <button onClick={next} disabled={i === total - 1} className={ctlBtn}>
                Next →
              </button>
              <button
                onClick={toggleFs}
                className={`inline-flex items-center gap-1.5 ${ctlBtn}`}
                aria-label={isFs ? "Exit full screen" : "Full screen"}
              >
                {isFs ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
                {isFs ? "Exit" : "Full screen"}
              </button>
            </div>
          </div>
        </div>

        {/* Dot rail (hidden in full screen) */}
        {!isFs && (
          <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5">
            {Array.from({ length: total }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => go(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-1.5 rounded-full transition-all ${
                  idx === i ? "w-5 bg-gold" : "w-1.5 bg-mahogany/20 hover:bg-mahogany/40"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Print / Export-PDF: every slide, one per page ── */}
      <div className="hidden print:block">
        <div className="mb-4 break-after-page">
          <Stage>
            <Cover coverLabel={label} clientName={clientName} />
          </Stage>
        </div>
        {body.map((slide, idx) => (
          <div key={idx} className="mb-4 break-after-page">
            <Stage>
              <ContentCanvas markdown={slide} />
            </Stage>
          </div>
        ))}
      </div>
    </div>
  );
}
