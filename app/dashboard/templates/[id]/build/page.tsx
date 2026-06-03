import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { findReportType } from "@/lib/titan-library";
import { ReportBuilder } from "./ReportBuilder";

export const metadata = { title: "Build report · TWI Report Generator" };

export default async function BuildReportPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const reportType = findReportType(id);
  if (!reportType) notFound();

  const supabase = await createClient();
  const { data: clients } = await supabase
    .from("clients")
    .select("id, full_name")
    .order("full_name", { ascending: true });

  return (
    <ReportBuilder
      reportTypeId={reportType.id}
      reportTypeLabel={reportType.label}
      clients={clients ?? []}
    />
  );
}
