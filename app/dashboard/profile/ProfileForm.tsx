"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input, Textarea, Label } from "@/components/ui/Input";
import { Card } from "../_components/PageHeader";

type Profile = {
  user_id: string;
  full_name?: string | null;
  firm_name?: string | null;
  job_title?: string | null;
  bio?: string | null;
  jurisdiction?: string | null;
  voice_sample?: string | null;
  instructions?: string | null;
  product_universe?: string | null;
  signature_block?: string | null;
  compliance_disclaimers?: string | null;
};

export function ProfileForm({ profile }: { profile: Profile }) {
  const router = useRouter();
  const [form, setForm] = useState<Profile>(profile);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function update<K extends keyof Profile>(key: K, value: Profile[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setSaved(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      const supabase = createClient();
      const { error: err } = await supabase
        .from("advisor_profiles")
        .upsert({ ...form, user_id: profile.user_id, onboarding_completed: true });
      if (err) throw err;
      setSaved(true);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <h3 className="text-sm font-semibold text-mahogany mb-4">About you</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Full name">
            <Input
              value={form.full_name ?? ""}
              onChange={(e) => update("full_name", e.target.value)}
            />
          </Field>
          <Field label="Job title">
            <Input
              value={form.job_title ?? ""}
              onChange={(e) => update("job_title", e.target.value)}
              placeholder="e.g. Senior Wealth Manager"
            />
          </Field>
          <Field label="Firm name">
            <Input
              value={form.firm_name ?? ""}
              onChange={(e) => update("firm_name", e.target.value)}
            />
          </Field>
          <Field label="Jurisdiction">
            <Input
              value={form.jurisdiction ?? ""}
              onChange={(e) => update("jurisdiction", e.target.value)}
              placeholder="e.g. UAE / GCC"
            />
          </Field>
        </div>
        <div className="mt-4 space-y-2">
          <Label>Short bio</Label>
          <Textarea
            rows={3}
            value={form.bio ?? ""}
            onChange={(e) => update("bio", e.target.value)}
            placeholder="A few sentences about your background, specialties, and the clients you serve."
          />
        </div>
      </Card>

      <Card>
        <h3 className="text-sm font-semibold text-mahogany mb-1">
          Instructions for TWI Report Generator
        </h3>
        <p className="text-[12px] text-mahogany-500 mb-4">
          Free-form notes — think "system prompt." Anything the AI should
          always keep in mind when drafting on your behalf.
        </p>
        <Textarea
          rows={8}
          value={form.instructions ?? ""}
          onChange={(e) => update("instructions", e.target.value)}
          placeholder={`- I write in plain, direct English. No jargon unless the reader knows it.
- Always include a UK tax angle alongside UAE for British expat clients.
- Conservative tone in market commentary — never make forward-looking promises.
- Cite specific product names from my product universe; never invent funds.
- Reports should always close with a "next steps" section.`}
        />
      </Card>

      <Card>
        <h3 className="text-sm font-semibold text-mahogany mb-1">Your voice</h3>
        <p className="text-[12px] text-mahogany-500 mb-4">
          Paste 2–4 paragraphs of your existing writing (an old report, an
          email, a market note). TWI Report Generator uses these to match your tone.
        </p>
        <Textarea
          rows={6}
          value={form.voice_sample ?? ""}
          onChange={(e) => update("voice_sample", e.target.value)}
          placeholder="Paste sample writing here…"
        />
      </Card>

      <Card>
        <h3 className="text-sm font-semibold text-mahogany mb-1">Product universe</h3>
        <p className="text-[12px] text-mahogany-500 mb-4">
          List the platforms, providers, model portfolios, and funds you
          actually use. The AI will never recommend something outside this list.
        </p>
        <Textarea
          rows={6}
          value={form.product_universe ?? ""}
          onChange={(e) => update("product_universe", e.target.value)}
          placeholder={`Platforms: International SIPP via [Provider], Offshore Bond via [Provider]
Model portfolios: Cautious / Balanced / Growth
Approved fund houses: Vanguard, BlackRock, Dimensional, …`}
        />
      </Card>

      <Card>
        <h3 className="text-sm font-semibold text-mahogany mb-1">
          Signature & disclaimers
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Signature block</Label>
            <Textarea
              rows={4}
              value={form.signature_block ?? ""}
              onChange={(e) => update("signature_block", e.target.value)}
              placeholder={`Jane Smith\nSenior Wealth Manager\nAcme Wealth · Dubai`}
            />
          </div>
          <div className="space-y-2">
            <Label>Compliance disclaimers</Label>
            <Textarea
              rows={4}
              value={form.compliance_disclaimers ?? ""}
              onChange={(e) => update("compliance_disclaimers", e.target.value)}
              placeholder="Standard disclaimers that should appear on every report."
            />
          </div>
        </div>
      </Card>

      {error && (
        <div className="rounded-md border border-oxblood/30 bg-oxblood/[0.08] px-3 py-2 text-[13px] text-oxblood">
          {error}
        </div>
      )}
      {saved && (
        <div className="rounded-md border border-gold/40 bg-gold-soft/30 px-3 py-2 text-[13px] text-gold-soft">
          Saved.
        </div>
      )}

      <div className="flex items-center gap-2">
        <Button type="submit" disabled={saving}>
          {saving ? "Saving…" : "Save profile"}
        </Button>
      </div>
    </form>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
    </div>
  );
}
