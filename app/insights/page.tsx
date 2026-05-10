"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { insights, ContentType } from "./data";

const typeConfig = {
  article: {
    label: "Article",
    gradient: "from-blue-500 to-cyan-500",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    text: "text-blue-300",
    hoverBorder: "hover:border-blue-400/40",
    glow: "from-blue-500/10 via-cyan-500/10 to-teal-500/10",
  },
  social: {
    label: "Social",
    gradient: "from-violet-500 to-purple-500",
    bg: "bg-violet-500/10",
    border: "border-violet-500/20",
    text: "text-violet-300",
    hoverBorder: "hover:border-violet-400/40",
    glow: "from-violet-500/10 via-purple-500/10 to-fuchsia-500/10",
  },
  ad: {
    label: "Ad",
    gradient: "from-emerald-500 to-teal-500",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    text: "text-emerald-300",
    hoverBorder: "hover:border-emerald-400/40",
    glow: "from-emerald-500/10 via-teal-500/10 to-cyan-500/10",
  },
};

const filterLabels: { value: "all" | ContentType; label: string }[] = [
  { value: "all", label: "All" },
  { value: "article", label: "Articles" },
  { value: "social", label: "Social" },
  { value: "ad", label: "Ads" },
];

export default function InsightsPage() {
  const router = useRouter();
  const [filter, setFilter] = useState<"all" | ContentType>("all");
  const [expanded, setExpanded] = useState<string | null>(null);

  const handleSubmitCase = () => router.push("/submit");
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    router.push("/");
  };

  const filtered =
    filter === "all" ? insights : insights.filter((i) => i.type === filter);

  return (
    <div className="min-h-screen text-slate-900 flex flex-col relative">
      <div
        className="fixed inset-0 -z-30 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/web%20background.jpeg')" }}
      />
      <div className="fixed inset-0 -z-20 bg-linear-to-b from-black/35 via-black/20 to-black/10" />

      <Header onNavClick={handleNavClick} onSubmitCase={handleSubmitCase} />

      <div className="relative z-10 flex-1">
        {/* Page header */}
        <section className="relative border-t border-white/10 overflow-hidden">
          <div className="relative mx-auto max-w-6xl px-4 py-14 md:px-6 md:py-18">
            <div className="text-center mb-10 md:mb-14">
              <div className="inline-block">
                <h1 className="inline-block rounded-full bg-white px-6 py-2 text-xl font-semibold tracking-tight text-slate-900 shadow-lg shadow-slate-200/50 md:text-2xl border border-slate-100 relative overflow-hidden group">
                  <span className="relative z-10">Insights</span>
                  <div className="absolute inset-0 bg-linear-to-r from-blue-500/5 via-violet-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </h1>
              </div>
              <p className="mt-4 text-sm text-slate-200 md:text-base max-w-xl mx-auto">
                Articles, social content, and ad copy — everything Advisens publishes, in one place.
              </p>
            </div>

            {/* Filter tabs */}
            <div className="flex justify-center gap-2 flex-wrap">
              {filterLabels.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => { setFilter(value); setExpanded(null); }}
                  className={`rounded-full px-5 py-2 text-sm font-medium transition-all duration-200 border ${
                    filter === value
                      ? "bg-white text-slate-900 border-white shadow-lg shadow-white/10"
                      : "bg-white/5 text-white/70 border-white/10 hover:bg-white/10 hover:text-white hover:border-white/20"
                  }`}
                >
                  {label}
                  <span className={`ml-2 text-xs ${filter === value ? "text-slate-500" : "text-white/30"}`}>
                    {value === "all" ? insights.length : insights.filter((i) => i.type === value).length}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Cards grid */}
        <section className="px-4 md:px-6 pb-20">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((item) => {
                const cfg = typeConfig[item.type];
                const isExpanded = expanded === item.id;

                return (
                  <div
                    key={item.id}
                    className={`group relative flex flex-col rounded-2xl border bg-white/5 backdrop-blur-sm p-5 transition-all duration-300 ${cfg.border} ${cfg.hoverBorder} hover:bg-white/8 hover:shadow-lg hover:shadow-black/20 ${isExpanded ? "lg:col-span-1" : ""}`}
                  >
                    {/* Glow on hover */}
                    <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}>
                      <div className={`absolute inset-0 rounded-2xl bg-linear-to-br ${cfg.glow} blur-xl`} />
                    </div>

                    <div className="relative z-10 flex flex-col h-full">
                      {/* Type badge + platform */}
                      <div className="flex items-center justify-between mb-3">
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${cfg.bg} ${cfg.text} border ${cfg.border}`}>
                          <span className={`h-1.5 w-1.5 rounded-full bg-linear-to-br ${cfg.gradient}`} />
                          {cfg.label}
                        </span>
                        {item.platform && (
                          <span className="text-xs text-slate-400">{item.platform}</span>
                        )}
                      </div>

                      {/* Title */}
                      <h3 className="text-base font-semibold text-white leading-snug mb-2 group-hover:text-white transition-colors">
                        {item.title}
                      </h3>

                      {/* Excerpt */}
                      <p className="text-sm text-slate-300 leading-relaxed mb-4 flex-1">
                        {isExpanded && item.fullContent ? (
                          <span className="whitespace-pre-line text-slate-200">{item.fullContent}</span>
                        ) : (
                          item.excerpt
                        )}
                      </p>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-3 border-t border-white/8">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-400">{item.date}</span>
                          {item.readTime && (
                            <>
                              <span className="h-1 w-1 rounded-full bg-slate-500" />
                              <span className="text-xs text-slate-400">{item.readTime}</span>
                            </>
                          )}
                        </div>

                        {item.type === "article" && item.slug ? (
                          <Link
                            href={`/insights/${item.slug}`}
                            className={`text-xs font-medium ${cfg.text} hover:text-white transition-colors flex items-center gap-1 group/link`}
                          >
                            Read
                            <span className="transition-transform duration-200 group-hover/link:translate-x-0.5">→</span>
                          </Link>
                        ) : item.fullContent ? (
                          <button
                            onClick={() => setExpanded(isExpanded ? null : item.id)}
                            className={`text-xs font-medium ${cfg.text} hover:text-white transition-colors flex items-center gap-1`}
                          >
                            {isExpanded ? "Collapse" : "Expand"}
                            <span className={`transition-transform duration-200 ${isExpanded ? "rotate-90" : ""}`}>→</span>
                          </button>
                        ) : null}
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {item.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-xs text-slate-400 bg-white/5 border border-white/8 rounded-full px-2 py-0.5"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {filtered.length === 0 && (
              <div className="text-center py-20 text-slate-400 text-sm">
                No content in this category yet.
              </div>
            )}
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
