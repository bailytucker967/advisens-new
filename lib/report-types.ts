// Single source of truth for how a report_type is shown in the UI.
// Used by overview, reports list, report detail and client pages so the
// label is identical everywhere (no "Intro pitch" vs "Introduction" drift).

export function reportTypeLabel(t: string | null | undefined): string {
  if (!t) return "Report";
  return (
    {
      new_client_assessment: "Assessment",
      introductory_pitch: "Introduction",
      review_pack: "Review pack",
      custom: "Bespoke",
    } as Record<string, string>
  )[t] ?? t.replace(/_/g, " ");
}
