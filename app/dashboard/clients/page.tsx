import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { PageHeader, Card, EmptyState } from "../_components/PageHeader";
import { Button } from "@/components/ui/Button";

export default async function ClientsPage() {
  const supabase = await createClient();
  const { data: clients } = await supabase
    .from("clients")
    .select("id, full_name, email, status, updated_at")
    .neq("status", "archived")
    .order("updated_at", { ascending: false });

  return (
    <>
      <PageHeader
        eyebrow="Clients"
        title="Client roster"
        description="Every report ties to a client. Each client accumulates a history of reports, notes, and meetings."
        actions={
          <Button asChild>
            <Link href="/dashboard/reports/new">+ New report</Link>
          </Button>
        }
      />

      {clients && clients.length > 0 ? (
        <Card className="p-0 overflow-hidden">
          <ul className="divide-y divide-mahogany/10">
            {clients.map((c) => (
              <li key={c.id}>
                <Link
                  href={`/dashboard/clients/${c.id}`}
                  className="flex items-center justify-between px-5 py-4 transition-colors hover:bg-mahogany/[0.03]"
                >
                  <div>
                    <div className="text-sm font-medium text-mahogany">
                      {c.full_name}
                    </div>
                    <div className="text-[11px] text-mahogany-400 mt-0.5">
                      {c.email ?? "—"}
                      {c.status ? ` · ${c.status}` : ""}
                    </div>
                  </div>
                  <span className="text-mahogany-400">→</span>
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      ) : (
        <EmptyState
          title="No clients yet"
          description="Clients are created automatically when you make a report for them, or you can add one ahead of time when starting a report."
          action={
            <Button asChild>
              <Link href="/dashboard/reports/new">Create report</Link>
            </Button>
          }
        />
      )}
    </>
  );
}
