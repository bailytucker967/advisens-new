import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "../../_components/PageHeader";
import { findProduct } from "@/lib/titan-library";
import {
  findCatalogSolution,
  sectionForSolution,
} from "@/lib/solutions-catalog";

export default async function SolutionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const solution = findCatalogSolution(id);
  const product = findProduct(id);
  if (!solution && !product) notFound();

  const section = sectionForSolution(id);
  const title = solution?.title ?? product!.title;
  const summary = solution?.summary ?? product!.summary;
  const eyebrow = section?.title ?? product?.category ?? "Solution";
  const whenToUse = solution?.whenToUse ?? product?.relevance;
  const slides = solution?.slides ?? [];

  // Reference fallback (points) when a solution has no curated deck slides yet.
  const fallbackProduct = solution
    ? solution.productId
      ? findProduct(solution.productId)
      : undefined
    : product;
  const points = fallbackProduct?.points ?? [];

  return (
    <>
      <Link
        href="/dashboard/solutions"
        className="mb-4 inline-block text-[12px] text-mahogany-400 transition-colors hover:text-mahogany"
      >
        Back to solutions
      </Link>
      <PageHeader eyebrow={eyebrow} title={title} description={summary} />

      {slides.length > 0 ? (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-mahogany">
              The slides{" "}
              <span className="font-normal text-mahogany-400">
                · straight from the master deck
              </span>
            </h3>
            <span className="font-mono text-[11px] text-mahogany-400">
              {slides.length} slide{slides.length > 1 ? "s" : ""}
            </span>
          </div>
          <p className="-mt-2 max-w-2xl text-[13px] leading-relaxed text-mahogany-500">
            These are the canonical Titan slides for this solution, taken from
            the master adviser deck. Every report you build uses these as the
            governed starting point — one template, so every adviser is
            consistent before they tailor to the client.
          </p>

          {slides.map((slide) => (
            <figure
              key={slide.page}
              className="overflow-hidden rounded-xl border border-mahogany/10 bg-white shadow-[var(--shadow-warm)] ring-1 ring-black/5"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/deck-slides/p${slide.page}.png`}
                alt={slide.caption}
                loading="lazy"
                className="block h-auto w-full"
              />
              <figcaption className="flex items-center justify-between gap-3 border-t border-mahogany/10 bg-cream-50 px-4 py-2.5">
                <span className="text-[12.5px] text-mahogany-600">
                  {slide.caption}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-mahogany-400">
                  deck p{slide.page}
                </span>
              </figcaption>
            </figure>
          ))}

          {whenToUse && (
            <div className="rounded-md bg-cream-100 p-3 text-[12px] leading-relaxed text-mahogany-500">
              When you build a report, the agent draws on these slides for{" "}
              {title}. Relevance: {whenToUse}.
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-xl border border-mahogany/10 bg-cream-50 p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-mahogany">
              What this solution covers
            </h3>
            <span className="font-mono text-[11px] text-mahogany-400">
              master-deck slides coming soon
            </span>
          </div>
          {points.length > 0 ? (
            <ul className="space-y-2.5">
              {points.map((pt, i) => (
                <li
                  key={i}
                  className="flex gap-3 text-[13.5px] leading-relaxed text-mahogany-700"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gold" />
                  <span>{pt}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-[13px] text-mahogany-500">{summary}</p>
          )}
          {whenToUse && (
            <div className="mt-5 rounded-md bg-cream-100 p-3 text-[12px] leading-relaxed text-mahogany-500">
              The deck slides for this solution are being added. Until then, the
              agent uses these points when you build a report. Relevance:{" "}
              {whenToUse}.
            </div>
          )}
        </div>
      )}
    </>
  );
}
