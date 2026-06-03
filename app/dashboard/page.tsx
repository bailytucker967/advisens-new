import Link from "next/link";
import { ArrowRight, FileText, FolderOpen, Users, UserCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { PageHeader, Card, EmptyState } from "./_components/PageHeader";
import { Button } from "@/components/ui/Button";
import { reportTypeLabel } from "@/lib/report-types";
import { REPORT_TYPES } from "@/lib/titan-library";

export default async function DashboardOverview() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [
    { data: recentReports },
    { count: reportCount },
    { count: clientCount },
  ] = await Promise.all([
    supabase
      .from("reports")
      .select("id, title, report_type, status, updated_at")
      .order("updated_at", { ascending: false })
      .limit(5),
    supabase.from("reports").select("id", { count: "exact", head: true }),
    supabase.from("clients").select("id", { count: "exact", head: true }).neq("status", "archived"),
  ]);

  const { data: profile } = await supabase
    .from("advisor_profiles")
    .select("full_name, onboarding_completed")
    .eq("user_id", user?.id ?? "")
    .maybeSingle();
  const firstName =
    profile?.full_name?.split(" ")[0] || user?.email?.split("@")[0] || "there";

  return (
    <>
      <PageHeader
        eyebrow="Overview"
        title={`Welcome back, ${firstName}`}
        description="Pick up where you left off, or start a new report from a fresh meeting."
        actions={
          <Button asChild>
            <Link href="/dashboard/reports/new">New report →</Link>
          </Button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard
          icon={<FileText className="h-4 w-4" />}
          label="Reports"
          value={reportCount ?? 0}
          href="/dashboard/reports"
        />
        <StatCard
          icon={<FolderOpen className="h-4 w-4" />}
          label="Templates"
          value={REPORT_TYPES.length}
          href="/dashboard/templates"
        />
        <StatCard
          icon={<Users className="h-4 w-4" />}
          label="Clients"
          value={clientCount ?? 0}
          href="/dashboard/clients"
        />
      </div>

      <h2 className="text-[15px] font-semibold text-mahogany mb-4">Recent reports</h2>

      {recentReports && recentReports.length > 0 ? (
        <Card className="p-0 overflow-hidden">
          <ul className="divide-y divide-mahogany/10">
            {recentReports.map((r) => (
              <li key={r.id}>
                <Link
                  href={`/dashboard/reports/${r.id}`}
                  className="flex items-center justify-between px-5 py-4 hover:bg-mahogany/[0.03]"
                >
                  <div>
                    <div className="text-sm font-medium text-mahogany">
                      {r.title}
                    </div>
                    <div className="text-[11px] text-mahogany-400 mt-0.5">
                      {reportTypeLabel(r.report_type)} · {r.status}
                    </div>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 text-mahogany-400" />
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      ) : (
        <EmptyState
          title="No reports yet"
          description="Start by uploading a template, or jump straight into creating a new client report."
          action={
            <div className="flex items-center gap-2 justify-center">
              <Button asChild variant="secondary">
                <Link href="/dashboard/templates">Upload template</Link>
              </Button>
              <Button asChild>
                <Link href="/dashboard/reports/new">Create report</Link>
              </Button>
            </div>
          }
        />
      )}

      {!profile?.onboarding_completed && (
      <div className="mt-10 rounded-lg border border-emerald-400/15 bg-gold/[0.04] p-5 flex items-start gap-3">
        <UserCircle className="h-5 w-5 text-gold-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <div className="text-sm font-medium text-mahogany">
            Complete your profile
          </div>
          <p className="text-[13px] text-mahogany-500 mt-1 leading-relaxed">
            Tell TWI Report Generator about your firm, voice, and product universe. The AI
            uses this whenever it drafts a report for you.
          </p>
          <Link
            href="/dashboard/profile"
            className="inline-flex items-center gap-1 text-[12px] text-gold-600 hover:text-gold mt-2 font-medium"
          >
            Set up profile <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
      )}
    </>
  );
}

function StatCard({
  icon,
  label,
  value,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-lg border border-mahogany/10 bg-cream-50 p-5 hover:bg-mahogany/[0.04] transition-colors block"
    >
      <div className="flex items-center gap-2 text-mahogany-500 text-[11px] uppercase tracking-wide">
        {icon}
        {label}
      </div>
      <div className="mt-3 text-[28px] font-semibold tracking-tight">{value}</div>
    </Link>
  );
}
