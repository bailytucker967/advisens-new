"use client";

import { useEffect, useRef, useState } from "react";

function CountUp({ target, suffix = "", duration = 1600 }: { target: number; suffix?: string; duration?: number }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const fired = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !fired.current) {
          fired.current = true;
          const start = performance.now();
          const tick = (now: number) => {
            const p = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 4);
            setVal(Math.round(eased * target));
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
          obs.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [target, duration]);

  return <span ref={ref}>{val}{suffix}</span>;
}

const STATS = [
  { value: 100, suffix: "%", label: "Anonymous\nby default" },
  { value: 0,   suffix: "",  label: "Obligations\nto proceed" },
  { value: 3,   suffix: "+", label: "Advisors ready\nto respond" },
];

export default function StatsBar() {
  return (
    <section className="relative overflow-hidden py-20 md:py-28">
      {/* Subtle centered glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at 50% 50%, rgba(16,185,129,0.07) 0%, transparent 65%)",
          transform: "translate(calc(var(--px, 0) * -20px), calc(var(--py, 0) * -12px))",
        }}
      />

      <div className="relative mx-auto max-w-5xl px-4 md:px-6">
        <div className="grid grid-cols-3">
          {STATS.map((s, i) => (
            <div
              key={i}
              className="relative px-4 md:px-10 text-center"
              style={{
                borderLeft: i > 0 ? "1px solid rgba(255,255,255,0.06)" : "none",
                transform: `translate(calc(var(--px, 0) * ${6 + i * 3}px), calc(var(--py, 0) * ${4 + i * 2}px))`,
              }}
            >
              <div className="text-5xl font-black tracking-tight text-white sm:text-6xl md:text-7xl lg:text-8xl">
                <CountUp target={s.value} suffix={s.suffix} />
              </div>
              <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400 whitespace-pre-line leading-relaxed">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
