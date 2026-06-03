"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, MessageSquare, Wand2, Download } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Textarea, Label } from "@/components/ui/Input";
import { Card } from "../../_components/PageHeader";
import { SlideDeck } from "./SlideDeck";

type Version = {
  id: string;
  version_number: number;
  generated_by: string;
  prompt: string | null;
  content_markdown: string;
  created_at: string;
};

type Comment = {
  id: string;
  kind: string;
  body: string;
  created_at: string;
  version_id: string | null;
};

type Report = {
  id: string;
  title: string;
  status: string;
  report_type: string;
  current_version_id: string | null;
  locked_at: string | null;
};

const COVER_LABELS: Record<string, string> = {
  new_client_assessment: "Assessment Report",
  introductory_pitch: "Introduction",
  review_pack: "Review Pack",
  custom: "Report",
};

export function ReportWorkspace({
  report,
  versions,
  comments,
  firmName,
  clientName,
}: {
  report: Report;
  versions: Version[];
  comments: Comment[];
  firmName?: string | null;
  clientName?: string | null;
}) {
  const router = useRouter();
  const [activeVersionId, setActiveVersionId] = useState(
    report.current_version_id ?? versions[0]?.id ?? null,
  );
  const [comment, setComment] = useState("");
  const [editPrompt, setEditPrompt] = useState("");
  const [working, setWorking] = useState<"comment" | "edit" | "lock" | null>(null);
  const [error, setError] = useState<string | null>(null);

  const activeVersion =
    versions.find((v) => v.id === activeVersionId) ?? versions[0];

  async function postJson(url: string, body: object) {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || "Request failed");
    }
    return res.json();
  }

  async function handleAddComment() {
    if (!comment.trim()) return;
    setWorking("comment");
    setError(null);
    try {
      await postJson(`/api/reports/${report.id}/comments/`, {
        kind: "note",
        body: comment.trim(),
        version_id: activeVersionId,
      });
      setComment("");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save comment.");
    } finally {
      setWorking(null);
    }
  }

  async function handlePromptEdit() {
    if (!editPrompt.trim()) return;
    setWorking("edit");
    setError(null);
    try {
      await postJson(`/api/reports/${report.id}/edit/`, {
        prompt: editPrompt.trim(),
      });
      setEditPrompt("");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to edit report.");
    } finally {
      setWorking(null);
    }
  }

  async function handleLock() {
    setWorking("lock");
    setError(null);
    try {
      await postJson(`/api/reports/${report.id}/lock/`, {});
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to lock report.");
    } finally {
      setWorking(null);
    }
  }

  const isLocked = report.status === "locked";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
      {/* Left: report content */}
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-2 text-[12px]">
          <div className="flex items-center gap-2">
            {versions.length > 1 && (
              <>
                <span className="text-mahogany-400">Versions:</span>
                {versions.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setActiveVersionId(v.id)}
                    className={`px-2.5 py-1 rounded-md border text-[11px] ${
                      v.id === activeVersionId
                        ? "border-gold/40 bg-gold-soft/30 text-gold"
                        : "border-mahogany/10 bg-cream-50 text-mahogany-500 hover:text-mahogany"
                    }`}
                  >
                    v{v.version_number}
                  </button>
                ))}
              </>
            )}
          </div>
          {activeVersion && (
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 rounded-md border border-mahogany/15 bg-cream-50 px-3 py-1.5 text-[11px] font-medium text-mahogany-500 hover:text-mahogany hover:border-gold/40"
            >
              <Download className="h-3.5 w-3.5" /> Export PDF
            </button>
          )}
        </div>

        {activeVersion ? (
          <SlideDeck
            markdown={activeVersion.content_markdown}
            firmName={firmName}
            title={report.title}
            coverLabel={COVER_LABELS[report.report_type] ?? "Assessment Report"}
            clientName={clientName}
          />
        ) : (
          <Card>
            <p className="text-mahogany-500 text-sm">No version yet.</p>
          </Card>
        )}
      </div>

      {/* Right: actions */}
      <div className="space-y-4">
        <Card>
          <div className="flex items-center gap-2 mb-3">
            <Wand2 className="h-4 w-4 text-gold-600" />
            <h3 className="text-sm font-semibold text-mahogany">Prompt-edit</h3>
          </div>
          <p className="text-[12px] text-mahogany-500 mb-3 leading-relaxed">
            Tell TWI Report Generator how to revise this draft. It will create a new
            version.
          </p>
          <Textarea
            rows={3}
            placeholder="e.g. Make section 3 more conservative. Tighten the executive summary."
            value={editPrompt}
            onChange={(e) => setEditPrompt(e.target.value)}
            disabled={isLocked}
          />
          <Button
            onClick={handlePromptEdit}
            disabled={working !== null || isLocked || !editPrompt.trim()}
            className="mt-3 w-full"
            size="sm"
          >
            {working === "edit" ? "Editing…" : "Revise draft"}
          </Button>
        </Card>

        <Card>
          <div className="flex items-center gap-2 mb-3">
            <MessageSquare className="h-4 w-4 text-mahogany-500" />
            <h3 className="text-sm font-semibold text-mahogany">Comments</h3>
          </div>
          <Textarea
            rows={2}
            placeholder="Leave a comment…"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            disabled={isLocked}
          />
          <Button
            onClick={handleAddComment}
            disabled={working !== null || isLocked || !comment.trim()}
            className="mt-3 w-full"
            variant="secondary"
            size="sm"
          >
            {working === "comment" ? "Adding…" : "Add comment"}
          </Button>

          {comments.length > 0 && (
            <ul className="mt-4 space-y-3 max-h-64 overflow-y-auto pr-1">
              {comments.map((c) => (
                <li
                  key={c.id}
                  className="rounded-md border border-mahogany/10 bg-cream-50 px-3 py-2"
                >
                  <div className="text-[10px] text-mahogany-400 mb-1 uppercase tracking-wide">
                    {c.kind === "prompt_edit" ? "Prompt-edit" : "Note"}
                  </div>
                  <p className="text-[12px] text-mahogany whitespace-pre-wrap">
                    {c.body}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card>
          <div className="flex items-center gap-2 mb-2">
            <Lock className="h-4 w-4 text-mahogany-500" />
            <h3 className="text-sm font-semibold text-mahogany">Lock & save</h3>
          </div>
          <p className="text-[12px] text-mahogany-500 mb-3 leading-relaxed">
            Locking saves this version as final and makes it read-only.
          </p>
          {isLocked ? (
            <div className="rounded-md border border-mahogany/20 bg-mahogany/[0.08] px-3 py-2 text-[12px] text-mahogany-500">
              Locked {new Date(report.locked_at!).toLocaleDateString()}
            </div>
          ) : (
            <Button
              onClick={handleLock}
              disabled={working !== null}
              variant="secondary"
              size="sm"
              className="w-full"
            >
              {working === "lock" ? "Locking…" : "Confirm & lock"}
            </Button>
          )}
        </Card>

        {error && (
          <div className="rounded-md border border-oxblood/30 bg-oxblood/[0.08] px-3 py-2 text-[12px] text-oxblood">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
