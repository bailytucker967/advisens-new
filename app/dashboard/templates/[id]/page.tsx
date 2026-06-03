import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "../../_components/PageHeader";
import { Button } from "@/components/ui/Button";
import {
  findReportType,
  REPORT_START,
  REPORT_END,
  PRODUCTS,
  type LibItem,
} from "@/lib/titan-library";

function SlideCard({ item, n }: { item: LibItem; n: number }) {
  return (
    <div className="rounded-xl border border-mahogany/10 bg-cream-50 p-5">
      <div className="flex items-center gap-3">
        <span className="grid h-7 w-7 flex-shrink-0 place-items-center rounded-full bg-gold/15 text-[12px] font-semibold text-gold-600">
          {n}
        </span>
        <h4 className="font-display text-[15px] text-mahogany">{item.title}</h4>
        <span className="ml-auto font-mono text-[10px] text-mahogany-400">
          p{item.deckPages}
        </span>
      </div>
      <ul className="mt-3 space-y-1.5 pl-10">
        {item.points.map((pt, i) => (
          <li key={i} className="flex gap-2 text-[12.5px] leading-relaxed text-mahogany-600">
            <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-gold/60" />
            <span>{pt}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default async function TemplateDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const t = findReportType(id);
  if (!t) notFound();

  return (
    <>
      <Link
        href="/dashboard/templates"
        className="mb-4 inline-flex items-center gap-1.5 text-[12px] text-mahogany-400 transition-colors hover:text-mahogany"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Templates
      </Link>
      <PageHeader
        eyebrow="Template"
        title={t.label}
        description={t.description}
        actions={
          <Button asChild>
            <Link href={`/dashboard/templates/${t.id}/build`}>
              Build this report →
            </Link>
          </Button>
        }
      />

      <h2 className="mb-3 text-[12px] font-semibold uppercase tracking-[0.14em] text-mahogany-400">
        Every report opens with
      </h2>
      <div className="space-y-3">
        {REPORT_START.map((item, i) => (
          <SlideCard key={item.id} item={item} n={i + 1} />
        ))}
      </div>

      <h2 className="mb-3 mt-8 text-[12px] font-semibold uppercase tracking-[0.14em] text-mahogany-400">
        Then the products that fit the angle
      </h2>
      <p className="mb-3 text-[13px] text-mahogany-500">
        The agent suggests these from the notes; you adjust. Open any one in
        Solutions to see its slides.
      </p>
      <div className="flex flex-wrap gap-2">
        {PRODUCTS.map((p) => (
          <Link
            key={p.id}
            href={`/dashboard/solutions/${p.id}`}
            className="rounded-full border border-mahogany/15 px-3 py-1.5 text-[12px] text-mahogany-600 transition-colors hover:border-gold/40 hover:text-gold-600"
          >
            {p.title}
          </Link>
        ))}
      </div>

      <h2 className="mb-3 mt-8 text-[12px] font-semibold uppercase tracking-[0.14em] text-mahogany-400">
        And closes with
      </h2>
      <div className="space-y-3">
        {REPORT_END.map((item, i) => (
          <SlideCard key={item.id} item={item} n={REPORT_START.length + i + 1} />
        ))}
      </div>
    </>
  );
}
