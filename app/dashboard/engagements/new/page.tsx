"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { PageHeader } from "../../_components/PageHeader";
import { Button } from "@/components/ui/Button";
import { Input, Textarea, Label } from "@/components/ui/Input";
import { INTRO_PIECES } from "@/lib/titan-library";

const STEPS = ["Prospect", "Introduction", "Meeting", "Assessment"] as const;

export default function NewEngagementPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);

  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [situation, setSituation] = useState("");
  const [context, setContext] = useState("");
  const [intro, setIntro] = useState("");
  const [notes, setNotes] = useState("");
  const [transcript, setTranscript] = useState("");
  const [products, setProducts] = useState("");
  const [assessment, setAssessment] = useState("");
  const [pieceIds, setPieceIds] = useState<string[]>(
    INTRO_PIECES.filter((p) => p.alwaysOn).map((p) => p.id),
  );

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function generate(kind: "intro" | "assessment") {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/engagements/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind,
          name,
          location,
          situation,
          context,
          notes,
          transcript,
          products,
          pieces: INTRO_PIECES.filter((p) => pieceIds.includes(p.id)).map((p) => ({
            title: p.title,
            summary: p.summary,
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generation failed.");
      if (kind === "intro") setIntro(data.markdown);
      else setAssessment(data.markdown);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Generation failed.");
    } finally {
      setBusy(false);
    }
  }

  async function finish() {
    setBusy(true);
    setError(null);
    try {
      if (!name.trim()) throw new Error("Add the prospect's name first.");
      const supabase = createClient();
      const { data: userData } = await supabase.auth.getUser();
      const user = userData.user;
      if (!user) throw new Error("Not authenticated.");

      const { data: client, error: cErr } = await supabase
        .from("clients")
        .insert({ advisor_id: user.id, full_name: name.trim() })
        .select("id")
        .single();
      if (cErr) throw cErr;

      const save = async (title: string, type: string, md: string) => {
        if (!md.trim()) return;
        const { data: rep, error: rErr } = await supabase
          .from("reports")
          .insert({
            advisor_id: user.id,
            client_id: client.id,
            title,
            report_type: type,
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
            content_markdown: md,
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
      };

      await save(`Introduction — ${name.trim()}`, "introductory_pitch", intro);
      await save(`Assessment — ${name.trim()}`, "new_client_assessment", assessment);

      router.push(`/dashboard/clients/${client.id}`);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save the engagement.");
      setBusy(false);
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="New engagement"
        title="Start a new engagement"
        description="From the first introduction to the full assessment, in one guided flow."
      />

      {/* Stepper */}
      <ol className="mb-8 flex flex-wrap gap-2">
        {STEPS.map((label, i) => (
          <li key={label} className="flex items-center gap-2">
            <span
              className={`grid h-7 w-7 place-items-center rounded-full text-[12px] font-semibold ${
                i === step
                  ? "bg-gold text-espresso"
                  : i < step
                    ? "bg-gold/20 text-gold-600"
                    : "bg-mahogany/10 text-mahogany-400"
              }`}
            >
              {i + 1}
            </span>
            <span
              className={`text-[13px] ${i === step ? "font-semibold text-mahogany" : "text-mahogany-400"}`}
            >
              {label}
            </span>
            {i < STEPS.length - 1 && <span className="mx-1 text-mahogany-400">→</span>}
          </li>
        ))}
      </ol>

      {error && (
        <div className="mb-5 rounded-md border border-oxblood/30 bg-oxblood/[0.08] px-3 py-2 text-[13px] text-oxblood">
          {error}
        </div>
      )}

      <div className="rounded-xl border border-mahogany/10 bg-cream-50 p-6 md:p-8">
        {/* Step 1 — Prospect */}
        {step === 0 && (
          <div className="space-y-5">
            <h3 className="text-sm font-semibold text-mahogany">Who are you meeting?</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Prospect name</Label>
                <Input id="name" placeholder="e.g. James Whitlock-Bryant" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="loc">Location / residency</Label>
                <Input id="loc" placeholder="e.g. British expat, Riyadh (KSA)" value={location} onChange={(e) => setLocation(e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="sit">Their situation</Label>
              <Textarea id="sit" rows={3} placeholder="e.g. Senior exec, returning to the UK in ~5 years, cash-heavy, pension consolidation and IHT concerns." value={situation} onChange={(e) => setSituation(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ctx">Anything else you know</Label>
              <Textarea id="ctx" rows={3} placeholder="Referral source, family, prior provider, sensitivities…" value={context} onChange={(e) => setContext(e.target.value)} />
            </div>
            <div className="flex justify-end">
              <Button onClick={() => setStep(1)} disabled={!name.trim()}>
                Next: introduction →
              </Button>
            </div>
          </div>
        )}

        {/* Step 2 — Introduction */}
        {step === 1 && (
          <div className="space-y-5">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-sm font-semibold text-mahogany">Introduction pitch</h3>
              <Button variant="secondary" onClick={() => generate("intro")} disabled={busy}>
                {busy ? "Drafting…" : intro ? "Redraft" : "Draft introduction"}
              </Button>
            </div>
            <p className="text-[12px] text-mahogany-400">
              The Introduction agent drafts a tailored pitch for {name || "this prospect"}. Edit it freely before saving.
            </p>
            <div className="rounded-lg border border-mahogany/10 bg-cream-100 p-4">
              <div className="text-[12px] font-semibold text-mahogany">
                Sections to include
              </div>
              <p className="mt-0.5 text-[11px] text-mahogany-400">
                Pre-selected for this prospect. Toggle any in or out; each is
                tailored to {name || "the client"}&apos;s currency and situation.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {INTRO_PIECES.map((p) => {
                  const on = pieceIds.includes(p.id);
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() =>
                        setPieceIds((ids) =>
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
            </div>
            <Textarea rows={16} placeholder="Click 'Draft introduction' to generate, then edit here." value={intro} onChange={(e) => setIntro(e.target.value)} className="font-mono text-[12px]" />
            <div className="flex justify-between">
              <Button variant="secondary" onClick={() => setStep(0)}>← Back</Button>
              <Button onClick={() => setStep(2)}>Next: meeting →</Button>
            </div>
          </div>
        )}

        {/* Step 3 — Meeting */}
        {step === 2 && (
          <div className="space-y-5">
            <h3 className="text-sm font-semibold text-mahogany">After the meeting</h3>
            <div className="space-y-2">
              <Label htmlFor="notes">Your meeting notes</Label>
              <Textarea id="notes" rows={5} placeholder="Paste your notes from the meeting." value={notes} onChange={(e) => setNotes(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tr">Transcript (optional)</Label>
              <Textarea id="tr" rows={4} placeholder="Paste a transcript from your notetaker." value={transcript} onChange={(e) => setTranscript(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="prod">Products & approach you're taking</Label>
              <Textarea id="prod" rows={3} placeholder="e.g. International SIPP, redeploy EOSB, balanced MPS (60/40), phased GBP migration, IHT review." value={products} onChange={(e) => setProducts(e.target.value)} />
            </div>
            <div className="flex justify-between">
              <Button variant="secondary" onClick={() => setStep(1)}>← Back</Button>
              <Button onClick={() => setStep(3)} disabled={!notes && !transcript}>Next: assessment →</Button>
            </div>
          </div>
        )}

        {/* Step 4 — Assessment */}
        {step === 3 && (
          <div className="space-y-5">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-sm font-semibold text-mahogany">Full assessment</h3>
              <Button variant="secondary" onClick={() => generate("assessment")} disabled={busy}>
                {busy ? "Building…" : assessment ? "Rebuild" : "Build assessment"}
              </Button>
            </div>
            <p className="text-[12px] text-mahogany-400">
              The Assessment agent builds the full report from your notes and the approach you chose. Edit before saving.
            </p>
            <Textarea rows={18} placeholder="Click 'Build assessment' to generate, then edit here." value={assessment} onChange={(e) => setAssessment(e.target.value)} className="font-mono text-[12px]" />
            <div className="flex justify-between">
              <Button variant="secondary" onClick={() => setStep(2)}>← Back</Button>
              <Button onClick={finish} disabled={busy || (!intro && !assessment)}>
                {busy ? "Saving…" : "Finish & save to client folder"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
