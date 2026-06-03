"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { CatalogSection, CatalogSolution } from "@/lib/solutions-catalog";

type FlatSolution = CatalogSolution & {
  sectionId: string;
  sectionTitle: string;
  haystack: string;
};

export function SolutionsBrowser({ sections }: { sections: CatalogSection[] }) {
  const [q, setQ] = useState("");
  const [active, setActive] = useState<string>("all");

  // Flatten once, with a precomputed lowercase search string per solution.
  const flat: FlatSolution[] = useMemo(
    () =>
      sections.flatMap((sec) =>
        sec.solutions.map((sol) => ({
          ...sol,
          sectionId: sec.id,
          sectionTitle: sec.title,
          haystack: [
            sol.title,
            sol.summary,
            sol.keywords ?? "",
            sol.whenToUse ?? "",
            sec.title,
            ...sol.slides.map((s) => s.caption),
          ]
            .join(" ")
            .toLowerCase(),
        })),
      ),
    [sections],
  );

  const tokens = q.trim().toLowerCase().split(/\s+/).filter(Boolean);
  const textMatch = (s: FlatSolution) =>
    tokens.every((t) => s.haystack.includes(t));

  // Solutions matching the SEARCH only (used for per-category counts).
  const searchMatches = useMemo(
    () => (tokens.length ? flat.filter(textMatch) : flat),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [flat, q],
  );

  const countFor = (sectionId: string) =>
    searchMatches.filter((s) => s.sectionId === sectionId).length;

  // Final visible set = search AND active-category.
  const visible = searchMatches.filter(
    (s) => active === "all" || s.sectionId === active,
  );

  const searching = tokens.length > 0;
  const grouped = !searching && active === "all";

  return (
    <div>
      {/* ── Search: the hero. Type anything. ── */}
      <div className="relative mb-4">
        <input
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => e.key === "Escape" && setQ("")}
          placeholder="Search any solution, provider or topic — try “RL360”, “inheritance tax”, or “France”"
          aria-label="Search solutions"
          className="w-full rounded-2xl border border-mahogany/15 bg-white py-4 pl-5 pr-20 text-[15px] text-mahogany shadow-sm outline-none transition-colors placeholder:text-mahogany-400 focus:border-gold focus:ring-2 focus:ring-gold/30"
        />
        {q && (
          <button
            onClick={() => setQ("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md px-2 py-1 text-[12px] font-medium text-mahogany-400 transition-colors hover:bg-cream-100 hover:text-mahogany"
          >
            Clear
          </button>
        )}
      </div>

      {/* ── Category chips: tap a topic to jump straight there. ── */}
      <div className="mb-8 flex flex-wrap gap-2">
        <Chip
          label="All"
          count={searchMatches.length}
          activeNow={active === "all"}
          onClick={() => setActive("all")}
        />
        {sections.map((sec) => {
          const n = countFor(sec.id);
          return (
            <Chip
              key={sec.id}
              label={sec.title}
              count={n}
              dimmed={searching && n === 0}
              activeNow={active === sec.id}
              onClick={() => setActive(active === sec.id ? "all" : sec.id)}
            />
          );
        })}
      </div>

      {/* ── Results ── */}
      {visible.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-mahogany/20 bg-cream-50 p-12 text-center">
          <p className="text-[15px] text-mahogany">No solutions match “{q}”.</p>
          <p className="mt-1 text-[13px] text-mahogany-500">
            Try a provider (RL360, Utmost), a topic (IHT, residency, SIPP) or a
            country (France, Spain).
          </p>
          <button
            onClick={() => {
              setQ("");
              setActive("all");
            }}
            className="mt-4 rounded-lg bg-twi-deep px-4 py-2 text-[13px] text-white transition-opacity hover:opacity-90"
          >
            Reset
          </button>
        </div>
      ) : grouped ? (
        // Default browse: clean sections + cards.
        <div className="space-y-10">
          {sections.map((sec) => (
            <section key={sec.id} id={sec.id}>
              <h2 className="font-display text-[19px] text-mahogany">
                {sec.title}
              </h2>
              <p className="mb-4 mt-1 max-w-2xl text-[13px] leading-relaxed text-mahogany-500">
                {sec.blurb}
              </p>
              <CardGrid
                items={flat.filter((s) => s.sectionId === sec.id)}
                showSection={false}
              />
            </section>
          ))}
        </div>
      ) : (
        // Searching or a single category: flat result grid.
        <div>
          <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.16em] text-mahogany-400">
            {visible.length} result{visible.length === 1 ? "" : "s"}
            {active !== "all" &&
              ` in ${sections.find((s) => s.id === active)?.title}`}
          </p>
          <CardGrid items={visible} showSection />
        </div>
      )}
    </div>
  );
}

function Chip({
  label,
  count,
  activeNow,
  dimmed,
  onClick,
}: {
  label: string;
  count: number;
  activeNow: boolean;
  dimmed?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-[13px] font-medium transition-colors ${
        activeNow
          ? "border-twi-deep bg-twi-deep text-white"
          : dimmed
            ? "border-mahogany/10 bg-cream-50 text-mahogany-400 opacity-50"
            : "border-mahogany/15 bg-cream-50 text-mahogany-700 hover:border-gold hover:text-mahogany"
      }`}
    >
      {label}
      <span
        className={`ml-0.5 rounded-full px-1.5 py-0.5 text-[10px] tabular-nums ${
          activeNow ? "bg-white/20 text-white" : "bg-mahogany/10 text-mahogany-400"
        }`}
      >
        {count}
      </span>
    </button>
  );
}

function CardGrid({
  items,
  showSection,
}: {
  items: FlatSolution[];
  showSection: boolean;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((sol) => (
        <Link
          key={sol.id}
          href={`/dashboard/solutions/${sol.id}`}
          className="group flex flex-col rounded-xl border border-mahogany/10 bg-cream-50 p-5 transition-all hover:-translate-y-0.5 hover:border-gold/50 hover:shadow-[var(--shadow-warm)]"
        >
          <h3 className="font-display text-[15.5px] leading-tight text-mahogany">
            {sol.title}
          </h3>
          <p className="mt-1.5 flex-1 text-[12.5px] leading-relaxed text-mahogany-500">
            {sol.summary}
          </p>
          <div className="mt-3 flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.1em] text-mahogany-400">
            {showSection && (
              <>
                <span>{sol.sectionTitle}</span>
                <span className="text-mahogany/20">·</span>
              </>
            )}
            <span>
              {sol.slides.length > 0
                ? `${sol.slides.length} slide${sol.slides.length > 1 ? "s" : ""}`
                : "reference"}
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
