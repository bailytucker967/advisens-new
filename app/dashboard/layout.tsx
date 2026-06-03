import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardNav } from "./_components/DashboardNav";
import { TopBar } from "./_components/TopBar";

export const metadata = { title: "Dashboard · TWI Report Generator" };

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("advisor_profiles")
    .select("full_name, firm_name, onboarding_completed")
    .eq("user_id", user.id)
    .maybeSingle();

  return (
    <div className="min-h-screen bg-cream text-mahogany">
      <div className="flex">
        <DashboardNav />
        <div className="min-w-0 flex-1 lg:pl-64">
          <TopBar
            email={user.email ?? ""}
            displayName={profile?.full_name ?? user.email ?? "Advisor"}
            firmName={profile?.firm_name ?? null}
          />
          <main className="mx-auto max-w-6xl px-6 py-8 md:px-10">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
