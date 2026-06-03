import Link from "next/link";
import { notFound } from "next/navigation";
import { FileText, Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { reportTypeLabel } from "@/lib/report-types";
import { PageHeader } from "../../_components/PageHeader";

export default async function ClientFolderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: client } = await supabase
    .from("clients")
    .select("id, full_name, email, status")
    .eq("id", id)
    .maybeSingle();
  if (!client) notFound();

  const { data: reports } = await supabase
    .from("reports")
    .select("id, title, report_type, status, updated_at")
    .eq("client_id", id)
    .order("updated_at", { ascending: false });

  const docs = reports ?? [];

  return (
    <>
      <PageHeader
        eyebrow="Client folder"
        title={client.full_name}
        description={`${docs.length} document${docs.length === 1 ? "" : "s"} in this folder${
          client.status ? ` · ${client.status}` : ""
        }.`}
      />

      <div className="space-y-2">
        {docs.map((r) => {
          const intro = r.report_type === "introductory_pitch";
          return (
            <Link
              key={r.id}
              href={`/dashboard/reports/${r.id}`}
              className="flex items-center gap-3 rounded-xl border border-mahogany/10 bg-cream-50 p-4 transition-colors hover:border-gold/40"
            >
              {intro ? (
                <Sparkles className="h-4 w-4 flex-shrink-0 text-gold-600" />
              ) : (
                <FileText className="h-4 w-4 flex-shrink-0 text-gold-600" />
              )}
              <div className="min-w-0 flex-1">
                <div className="truncate text-[14px] font-medium text-mahogany">
                  {r.title}
                </div>
                <div className="text-[12px] text-mahogany-400">
                  {reportTypeLabel(r.report_type)} · {r.status}
                </div>
              </div>
            </Link>
          );
        })}

        {docs.length === 0 && (
          <div className="rounded-xl border border-mahogany/10 bg-cream-50 p-10 text-center text-[14px] text-mahogany-500">
            No documents in this folder yet.
          </div>
        )}
      </div>
    </>
  );
}
