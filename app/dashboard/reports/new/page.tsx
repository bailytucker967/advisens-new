import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "../../_components/PageHeader";
import { NewReportForm } from "./NewReportForm";

export default async function NewReportPage() {
  const supabase = await createClient();

  const [{ data: templates }, { data: clients }] = await Promise.all([
    supabase
      .from("report_templates")
      .select("id, name, report_type, is_default")
      .order("is_default", { ascending: false })
      .order("updated_at", { ascending: false }),
    supabase
      .from("clients")
      .select("id, full_name")
      .order("full_name", { ascending: true }),
  ]);

  return (
    <>
      <PageHeader
        eyebrow="Reports · New"
        title="Create a new report"
        description="Pick a template, drop in your meeting notes or transcript, and TWI Report Generator will draft a bespoke version in your firm's voice."
      />
      <NewReportForm
        templates={templates ?? []}
        clients={clients ?? []}
      />
    </>
  );
}
