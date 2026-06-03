"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input, Textarea, Label } from "@/components/ui/Input";
import { Card } from "../../_components/PageHeader";
import { extractText, type ExtractResult } from "@/lib/extract-text";

const REPORT_TYPES = [
  { id: "new_client_assessment", label: "New client assessment" },
  { id: "introductory_pitch", label: "Introductory pitch" },
  { id: "review_pack", label: "Review pack" },
  { id: "custom", label: "Custom" },
] as const;

// Supabase Storage rejects uploads above the project's global file-size cap
// (50 MB by default) with "The object exceeded the maximum allowed size".
// We extract each file's text in the browser and send only that to generation,
// so the binary is optional: files over the cap aren't stored, but their
// extracted text is still used.
const MAX_ATTACHMENT_MB = 50;
const MAX_ATTACHMENT_BYTES = MAX_ATTACHMENT_MB * 1024 * 1024;
// Cap combined extracted text so a huge document can't blow the model context.
const MAX_ATTACHMENT_TEXT_CHARS = 200_000;

function fileKey(f: File): string {
  return `${f.name}:${f.size}:${f.lastModified}`;
}

type ReportType = (typeof REPORT_TYPES)[number]["id"];

type Template = {
  id: string;
  name: string;
  report_type: string;
  is_default: boolean;
};
type Client = { id: string; full_name: string };

export function NewReportForm({
  templates,
  clients,
}: {
  templates: Template[];
  clients: Client[];
}) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [reportType, setReportType] = useState<ReportType>("new_client_assessment");
  const [clientId, setClientId] = useState<string>("");
  const [newClientName, setNewClientName] = useState("");
  const [templateId, setTemplateId] = useState<string>("");
  const [meetingNotes, setMeetingNotes] = useState("");
  const [transcript, setTranscript] = useState("");
  const [notetakerUrl, setNotetakerUrl] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [extractions, setExtractions] = useState<
    Record<string, ExtractResult | "pending">
  >({});
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Filter templates by selected report type
  const templatesForType = useMemo(
    () => templates.filter((t) => t.report_type === reportType),
    [templates, reportType],
  );

  // Auto-pick the default template for this type
  useMemo(() => {
    const def = templatesForType.find((t) => t.is_default);
    setTemplateId(def?.id ?? templatesForType[0]?.id ?? "");
  }, [templatesForType]);

  // Kick off text extraction as soon as files are chosen, so the user sees
  // progress and we can send only the extracted text (not the binary).
  function onPickFiles(list: FileList | null) {
    const files = list ? Array.from(list) : [];
    setAttachments(files);
    const pending: Record<string, ExtractResult | "pending"> = {};
    files.forEach((f) => (pending[fileKey(f)] = "pending"));
    setExtractions(pending);
    files.forEach((f) => {
      const k = fileKey(f);
      extractText(f).then((res) =>
        setExtractions((prev) => ({ ...prev, [k]: res })),
      );
    });
  }

  const extracting = attachments.some(
    (f) => extractions[fileKey(f)] === "pending",
  );

  function buildAttachmentText(): string {
    const parts: string[] = [];
    for (const f of attachments) {
      const r = extractions[fileKey(f)];
      if (r && r !== "pending" && r.text) {
        parts.push(`--- ATTACHMENT: ${f.name} ---\n${r.text}`);
      }
    }
    const combined = parts.join("\n\n");
    return combined.length > MAX_ATTACHMENT_TEXT_CHARS
      ? combined.slice(0, MAX_ATTACHMENT_TEXT_CHARS) +
          "\n\n[attachment text truncated]"
      : combined;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError("Give the report a title.");
      return;
    }
    const attachmentText = buildAttachmentText();
    if (!meetingNotes && !transcript && !notetakerUrl && !attachmentText) {
      setError(
        "Add at least one source: notes, transcript, a notetaker URL, or a file we can read.",
      );
      return;
    }

    setSubmitting(true);
    try {
      const supabase = createClient();
      const { data: userData } = await supabase.auth.getUser();
      const user = userData.user;
      if (!user) throw new Error("Not authenticated.");

      // Resolve client: either selected, newly named, or none.
      let resolvedClientId: string | null = clientId || null;
      if (!clientId && newClientName.trim()) {
        const { data: newClient, error: cErr } = await supabase
          .from("clients")
          .insert({ advisor_id: user.id, full_name: newClientName.trim() })
          .select("id")
          .single();
        if (cErr) throw cErr;
        resolvedClientId = newClient.id;
      }

      // Upload attachments. Skip anything over the storage cap, and treat any
      // upload failure as non-fatal: attachments are stored for reference and
      // aren't used during generation, so they must never block report creation.
      const attachmentPaths: string[] = [];
      for (const file of attachments) {
        if (file.size > MAX_ATTACHMENT_BYTES) continue;
        const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
        const path = `${user.id}/${Date.now()}-${safe}`;
        const { error: uErr } = await supabase.storage
          .from("attachments")
          .upload(path, file, { contentType: file.type, upsert: false });
        if (uErr) {
          console.warn(`Attachment "${file.name}" was not uploaded:`, uErr.message);
          continue;
        }
        attachmentPaths.push(path);
      }

      const { data: report, error: rErr } = await supabase
        .from("reports")
        .insert({
          advisor_id: user.id,
          client_id: resolvedClientId,
          template_id: templateId || null,
          title: title.trim(),
          report_type: reportType,
          status: "draft",
          meeting_notes: meetingNotes || null,
          transcript: transcript || null,
          notetaker_url: notetakerUrl || null,
          additional_notes: additionalNotes || null,
          attachments_paths: attachmentPaths,
        })
        .select("id")
        .single();
      if (rErr) throw rErr;

      // Save extracted attachment text in a separate, resilient update so report
      // creation still succeeds if the attachment_text column isn't migrated yet.
      if (attachmentText) {
        const { error: atErr } = await supabase
          .from("reports")
          .update({ attachment_text: attachmentText })
          .eq("id", report.id);
        if (atErr)
          console.warn(
            "Extracted attachment text was not saved (run the attachment_text migration?):",
            atErr.message,
          );
      }

      router.push(`/dashboard/reports/${report.id}`);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to create report.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <h3 className="text-sm font-semibold text-mahogany mb-4">The basics</h3>
        <div className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="title">Report title</Label>
            <Input
              id="title"
              placeholder="e.g. Assessment report — James Whitlock-Bryant"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Report type</Label>
              <select
                id="type"
                value={reportType}
                onChange={(e) => setReportType(e.target.value as ReportType)}
                className="flex h-10 w-full rounded-md border border-mahogany/15 bg-cream-50 px-3 py-2 text-sm text-mahogany focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/40"
              >
                {REPORT_TYPES.map((t) => (
                  <option key={t.id} value={t.id} className="bg-cream-50">
                    {t.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="template">Template</Label>
              <select
                id="template"
                value={templateId}
                onChange={(e) => setTemplateId(e.target.value)}
                className="flex h-10 w-full rounded-md border border-mahogany/15 bg-cream-50 px-3 py-2 text-sm text-mahogany focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/40"
              >
                {templatesForType.length === 0 ? (
                  <option value="" className="bg-cream-50">
                    No template — upload one in Templates
                  </option>
                ) : (
                  templatesForType.map((t) => (
                    <option key={t.id} value={t.id} className="bg-cream-50">
                      {t.name}
                      {t.is_default ? " (default)" : ""}
                    </option>
                  ))
                )}
              </select>
              {templatesForType.length === 0 && (
                <p className="text-[11px] text-gold/80">
                  Tip: upload a{" "}
                  <Link
                    href="/dashboard/templates/new"
                    className="underline hover:text-gold"
                  >
                    template
                  </Link>{" "}
                  for this report type to get the best results.
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="client">Client</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <select
                id="client"
                value={clientId}
                onChange={(e) => {
                  setClientId(e.target.value);
                  if (e.target.value) setNewClientName("");
                }}
                className="flex h-10 w-full rounded-md border border-mahogany/15 bg-cream-50 px-3 py-2 text-sm text-mahogany focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/40"
              >
                <option value="" className="bg-cream-50">
                  — Existing client —
                </option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id} className="bg-cream-50">
                    {c.full_name}
                  </option>
                ))}
              </select>
              <Input
                placeholder="or new client name…"
                value={newClientName}
                onChange={(e) => {
                  setNewClientName(e.target.value);
                  if (e.target.value) setClientId("");
                }}
              />
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <h3 className="text-sm font-semibold text-mahogany mb-1">Meeting intake</h3>
        <p className="text-[12px] text-mahogany-400 mb-5">
          Give TWI Report Generator everything you'd give a junior analyst — notes,
          transcripts, recordings, supporting files.
        </p>

        <div className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="notes">Your meeting notes</Label>
            <Textarea
              id="notes"
              rows={6}
              placeholder="Paste your notes from the meeting — handwritten typed up, bullet points, anything."
              value={meetingNotes}
              onChange={(e) => setMeetingNotes(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="transcript">Transcript</Label>
            <Textarea
              id="transcript"
              rows={5}
              placeholder="Paste a full transcript from Fathom, Otter, Read.ai, etc."
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ntu">AI notetaker recording URL</Label>
            <Input
              id="ntu"
              type="url"
              placeholder="https://fathom.video/calls/..."
              value={notetakerUrl}
              onChange={(e) => setNotetakerUrl(e.target.value)}
            />
            <p className="text-[11px] text-mahogany-400">
              Paste a shareable link if you'd rather not paste the transcript.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="files">Attachments</Label>
            <input
              id="files"
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.txt,.md,.png,.jpg,.jpeg,.csv,.xlsx"
              onChange={(e) => onPickFiles(e.target.files)}
              className="block w-full text-sm text-mahogany file:mr-4 file:rounded-md file:border-0 file:bg-gold file:px-4 file:py-2 file:text-sm file:font-semibold file:text-espresso hover:file:bg-gold-bright"
            />
            {attachments.length > 0 && (
              <ul className="text-[11px] text-mahogany-500 space-y-1 mt-1">
                {attachments.map((f) => {
                  const r = extractions[fileKey(f)];
                  const sizeLabel =
                    f.size >= 1024 * 1024
                      ? `${(f.size / 1024 / 1024).toFixed(1)} MB`
                      : `${(f.size / 1024).toFixed(0)} KB`;
                  return (
                    <li key={fileKey(f)}>
                      · {f.name} ({sizeLabel}){" "}
                      {r === "pending" ? (
                        <span className="text-mahogany-400">· reading…</span>
                      ) : r && r.text ? (
                        <span className="text-gold-600">
                          · {r.chars.toLocaleString()} characters read
                        </span>
                      ) : r && r.warning ? (
                        <span className="text-oxblood">· {r.warning}</span>
                      ) : null}
                    </li>
                  );
                })}
              </ul>
            )}
            <p className="mt-1.5 text-[11px] leading-relaxed text-mahogany-400">
              We read each file&apos;s text in your browser and send only that to
              generation. Files over {MAX_ATTACHMENT_MB} MB aren&apos;t stored,
              but their text is still used. Scanned PDFs and images need OCR and
              can&apos;t be read yet.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="extra">Further notes for TWI Report Generator</Label>
            <Textarea
              id="extra"
              rows={4}
              placeholder="Anything else the AI should know? Tone preferences, risk caveats, client sensitivities, internal context that wasn't in the meeting…"
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
            />
          </div>
        </div>
      </Card>

      {error && (
        <div className="rounded-md border border-oxblood/30 bg-oxblood/[0.08] px-3 py-2 text-[13px] text-oxblood">
          {error}
        </div>
      )}

      <div className="flex items-center gap-2">
        <Button type="submit" disabled={submitting || extracting}>
          {submitting
            ? "Saving…"
            : extracting
              ? "Reading attachments…"
              : "Save & continue →"}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.push("/dashboard/reports")}
        >
          Cancel
        </Button>
        <p className="ml-auto text-[11px] text-mahogany-400">
          Generation happens on the next step. Nothing's sent yet.
        </p>
      </div>
    </form>
  );
}
