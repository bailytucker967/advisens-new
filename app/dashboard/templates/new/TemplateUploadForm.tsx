"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input, Textarea, Label } from "@/components/ui/Input";
import { Card } from "../../_components/PageHeader";

const REPORT_TYPES = [
  { id: "new_client_assessment", label: "New client assessment" },
  { id: "introductory_pitch", label: "Introductory pitch" },
  { id: "review_pack", label: "Review pack" },
  { id: "custom", label: "Custom" },
] as const;

export function TemplateUploadForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [reportType, setReportType] = useState<(typeof REPORT_TYPES)[number]["id"]>(
    "new_client_assessment",
  );
  const [description, setDescription] = useState("");
  const [isDefault, setIsDefault] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!file) {
      setError("Pick a file to upload.");
      return;
    }
    setSubmitting(true);
    try {
      const supabase = createClient();
      const { data: userData } = await supabase.auth.getUser();
      const user = userData.user;
      if (!user) throw new Error("Not authenticated.");

      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const storagePath = `${user.id}/${Date.now()}-${safeName}`;

      const { error: uploadError } = await supabase.storage
        .from("templates")
        .upload(storagePath, file, {
          contentType: file.type,
          upsert: false,
        });
      if (uploadError) throw uploadError;

      // If this is a default, clear other defaults of the same type first.
      if (isDefault) {
        await supabase
          .from("report_templates")
          .update({ is_default: false })
          .eq("advisor_id", user.id)
          .eq("report_type", reportType)
          .eq("is_default", true);
      }

      const { error: insertError } = await supabase
        .from("report_templates")
        .insert({
          advisor_id: user.id,
          name: name || file.name,
          report_type: reportType,
          description,
          storage_path: storagePath,
          file_name: file.name,
          file_size_bytes: file.size,
          mime_type: file.type,
          is_default: isDefault,
        });
      if (insertError) throw insertError;

      router.push("/dashboard/templates");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">Template name</Label>
          <Input
            id="name"
            placeholder="e.g. Assessment report — long form"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">Report type</Label>
          <select
            id="type"
            value={reportType}
            onChange={(e) =>
              setReportType(e.target.value as typeof reportType)
            }
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
          <Label htmlFor="desc">Description (optional)</Label>
          <Textarea
            id="desc"
            placeholder="Anything TWI Report Generator should know about how this template is used…"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="file">File</Label>
          <input
            id="file"
            type="file"
            accept=".pdf,.doc,.docx,.txt,.md"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="block w-full text-sm text-mahogany file:mr-4 file:rounded-md file:border-0 file:bg-gold file:px-4 file:py-2 file:text-sm file:font-semibold file:text-espresso hover:file:bg-gold-bright"
          />
          {file && (
            <p className="text-[11px] text-mahogany-400">
              {file.name} · {(file.size / 1024).toFixed(0)} KB
            </p>
          )}
        </div>

        <label className="flex items-start gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={isDefault}
            onChange={(e) => setIsDefault(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-white/20 bg-white/5"
          />
          <span className="text-[13px] text-mahogany">
            Use as the default template for this report type
          </span>
        </label>

        {error && (
          <div className="rounded-md border border-oxblood/30 bg-oxblood/[0.08] px-3 py-2 text-[13px] text-oxblood">
            {error}
          </div>
        )}

        <div className="flex items-center gap-2">
          <Button type="submit" disabled={submitting}>
            {submitting ? "Uploading…" : "Upload template"}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => router.push("/dashboard/templates")}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  );
}
