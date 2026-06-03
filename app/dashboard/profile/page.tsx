import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "../_components/PageHeader";
import { ProfileForm } from "./ProfileForm";

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("advisor_profiles")
    .select("*")
    .eq("user_id", user!.id)
    .maybeSingle();

  return (
    <>
      <PageHeader
        eyebrow="Profile"
        title="Instructions for TWI Report Generator"
        description="Tell TWI Report Generator about your firm, your voice, your product universe, and how you operate. Every report it drafts uses this as context — think of it as your firm's onboarding document for the AI."
      />
      <ProfileForm profile={profile ?? { user_id: user!.id }} />
    </>
  );
}
