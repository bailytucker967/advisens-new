"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { PageHeader } from "../../../_components/PageHeader";
import { Button } from "@/components/ui/Button";
import { Input, Textarea, Label } from "@/components/ui/Input";
import { PRODUCTS, REPORT_START, REPORT_END } from "@/lib/titan-library";

type ClientRow = { id: string; full_name: string };

export function ReportBuilder({
  reportTypeId,
  reportTypeLabel,
  clients,
}: {
  reportTypeId: string;
  reportTypeLabel: string;
  clients: ClientRow[];
}) {
  const router = useRouter();
  const [clientId, setClientId] = useState("");
  const [newClientName, setNewClientName] = useState("");
  const [notes, setNotes] = useState("");
  const [transcript, setTranscript] = useState("");
  const [angle, setAngle] = useState("");
  const [productIds, setProductIds] = useState<string[]>([]);
  const [markdown, setMarkdown] = useState("");
  const [busy, setBusy] = useState(false);
  const [suggesting, setSuggesting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clientName = () =>
    clients.find((c) => c.id === clientId)?.full_name || newClientName.trim();
  const selectedTitles = PRODUCTS.filter((p) => productIds.includes(p.id)).map(
    (p) => p.title,
  );

  async function suggest() {
    setSuggesting(true);
    setError(null);
    try {
      const res = await fetch("/api/engagements/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind: "suggest", notes, transcript, products: angle }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not suggest products.");
      if (Array.isArray(data.productIds)) setProductIds(data.productIds);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not suggest products.");
    } finally {
      setSuggesting(false);
    }
  }

  async function build() {
    setBusy(true);
    setError(null);
    try {
      const products = [
        angle,
        selectedTitles.length ? `Selected products: ${selectedTitles.join(", ")}` : "",
      ]
        .filter(Boolean)
        .join(". ");
      const res = await fetch("/api/engagements/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: "assessment",
          name: clientName(),
          notes,
          transcript,
          products,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Build failed.");
      setMarkdown(data.markdown);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Build failed.");
    } finally {
      setBusy(false);
    }
  }

  async function save() {
    setBusy(true);
    setError(null);
    try {
      const name = clientName();
      if (!name) throw new Error("Pick an existing client or name a new one.");
      if (!markdown.trim()) throw new Error("Build the report first.");
      const supabase = createClient();
      const { data: userData } = await supabase.auth.getUser();
      const user = userData.user;
      if (!user) throw new Error("Not authenticated.");

      let cid = clientId;
      if (!cid) {
        const { data: c, error: cErr } = await supabase
          .from("clients")
          .insert({ advisor_id: user.id, full_name: name })
          .select("id")
          .single();
        if (cErr) throw cErr;
        cid = c.id;
      }
      const { data: rep, error: rErr } = await supabase
        .from("reports")
        .insert({
          advisor_id: user.id,
          client_id: cid,
          title: `${reportTypeLabel} — ${name}`,
          report_type: reportTypeId,
          status: "review",
        })
        .select("id")
        .single();
      if (rErr) throw rErr;
      const { data: ver, error: vErr } = await supabase
        .from("report_versions")
        .insert({
          report_id: rep.id,
          version_number: 1,
          content_markdown: markdown,
          generated_by: "ai",
          created_by: user.id,
        })
        .select("id")
        .single();
      if (vErr) throw vErr;
      await supabase
        .from("reports")
        .update({ current_version_id: ver.id })
        .eq("id", rep.id);

      router.push(`/dashboard/clients/${cid}`);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save the report.");
      setBusy(false);
    }
  }

  return (
    <>
      <PageHeader
        eyebrow={`Build · ${reportTypeLabel}`}
        title="Build a report"
        description="Start straight from here, no introduction needed. The report opens and closes on the fixed Titan pages; you choose the products in between."
      />

      {error && (
        <div className="mb-5 rounded-md border border-oxblood/30 bg-oxblood/[0.08] px-3 py-2 text-[13px] text-oxblood">
          {error}
        </div>
      )}

      <div className="space-y-6">
        {/* Client */}
        <div className="rounded-xl border border-mahogany/10 bg-cream-50 p-6">
          <h3 className="mb-4 text-sm font-semibold text-mahogany">Client</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="client">Existing client</Label>
              <select
                id="client"
                value={clientId}
                onChange={(e) => {
                  setClientId(e.target.value);
                  if (e.target.value) setNewClientName("");
                }}
                className="flex h-10 w-full rounded-md border border-mahogany/15 bg-cream-50 px-3 py-2 text-sm text-mahogany focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/40"
              >
                <option value="">— Select a client —</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.full_name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="new">…or new client</Label>
              <Input
                id="new"
                placeholder="New client name"
                value={newClientName}
                onChange={(e) => {
                  setNewClientName(e.target.value);
                  if (e.target.value) setClientId("");
                }}
              />
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="rounded-xl border border-mahogany/10 bg-cream-50 p-6 space-y-5">
          <h3 className="text-sm font-semibold text-mahogany">From the meeting</h3>
          <div className="space-y-2">
            <Label htmlFor="notes">Your notes</Label>
            <Textarea id="notes" rows={5} placeholder="Paste your meeting notes." value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tr">Transcript (optional)</Label>
            <Textarea id="tr" rows={4} placeholder="Paste a transcript from your notetaker." value={transcript} onChange={(e) => setTranscript(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="angle">Your angle</Label>
            <Input id="angle" placeholder="e.g. consolidate UK pensions, EOSB redeployment, IHT review" value={angle} onChange={(e) => setAngle(e.target.value)} />
          </div>
        </div>

        {/* Products */}
        <div className="rounded-xl border border-mahogany/10 bg-cream-50 p-6">
          <div className="mb-1 flex items-center justify-between gap-3">
            <h3 className="text-sm font-semibold text-mahogany">Products to include</h3>
            <Button variant="secondary" onClick={suggest} disabled={suggesting || (!notes && !transcript)}>
              {suggesting ? "Suggesting…" : "Suggest from notes"}
            </Button>
          </div>
          <p className="mb-3 text-[12px] text-mahogany-400">
            The agent suggests products from your notes; toggle any in or out. Each
            sits between the fixed opening and closing pages.
          </p>
          <div className="flex flex-wrap gap-2">
            {PRODUCTS.map((p) => {
              const on = productIds.includes(p.id);
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() =>
                    setProductIds((ids) =>
                      on ? ids.filter((x) => x !== p.id) : [...ids, p.id],
                    )
                  }
                  className={`rounded-full border px-3 py-1.5 text-[12px] transition-colors ${
                    on
                      ? "border-gold bg-gold/15 text-gold-600"
                      : "border-mahogany/15 text-mahogany-500 hover:border-gold/40"
                  }`}
                >
                  {on ? "" : "+ "}
                  {p.title}
                </button>
              );
            })}
          </div>
          <div className="mt-4 text-[11px] text-mahogany-400">
            Opens with {REPORT_START.map((s) => s.title).join(" → ")} · closes with{" "}
            {REPORT_END.map((s) => s.title).join(" → ")}
          </div>
        </div>

        {/* Build + review */}
        <div className="rounded-xl border border-mahogany/10 bg-cream-50 p-6 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-sm font-semibold text-mahogany">The report</h3>
            <Button variant="secondary" onClick={build} disabled={busy || (!notes && !transcript)}>
              {busy ? "Building…" : markdown ? "Rebuild" : "Build report"}
            </Button>
          </div>
          <Textarea
            rows={18}
            placeholder="Build the report, then edit here before saving."
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            className="font-mono text-[12px]"
          />
          <div className="flex justify-end">
            <Button onClick={save} disabled={busy || !markdown}>
              {busy ? "Saving…" : "Save to client folder"}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
