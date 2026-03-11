"use client";

import React, { useEffect, useState } from "react";

export default function CaseStats() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch("/api/stats/cases-this-month");
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled && typeof data.count === "number") {
          setCount(data.count);
        }
      } catch {
        // quietly ignore
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (!count || count <= 0) return null;

  return (
    <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[11px] font-medium text-emerald-100 border border-emerald-300/40">
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
      <span>{count} cases submitted this month</span>
    </div>
  );
}

