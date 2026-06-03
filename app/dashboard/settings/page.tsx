import { PageHeader, Card } from "../_components/PageHeader";

export const metadata = { title: "Settings · TWI Report Generator" };

// What's already shipped — shown so the page reads as substantial, not empty.
const LIVE = [
  "AI report drafting from your meeting notes",
  "The governed Solutions library — every master-deck slide",
  "Introductions, full assessments and review packs",
  "Version history, prompt-edit and comments",
  "One-click PDF export",
];

// What's next — honest roadmap, not disabled buttons.
const ROADMAP: { title: string; detail: string; stage: string }[] = [
  {
    title: "Notetaker intake",
    detail:
      "Connect Fathom, Otter or Read.ai so meeting transcripts flow straight into a new report.",
    stage: "Next up",
  },
  {
    title: "Brand kit on export",
    detail:
      "Per-adviser logo, accent colour and typography applied automatically when a report is exported.",
    stage: "In design",
  },
  {
    title: "Team & roles",
    detail:
      "Invite the wider advice team, with shared, governed templates everyone builds from.",
    stage: "Planned",
  },
  {
    title: "Account & security",
    detail:
      "Single sign-on with your Titan login, plus a full audit trail of every report.",
    stage: "Planned",
  },
];

export default function SettingsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Settings"
        title="What's live, and what's next"
        description="The report engine today, and where it's heading. Built for Titan advisers, shipped in stages."
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Live now */}
        <Card className="lg:col-span-1">
          <div className="mb-3 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-gold" />
            <h3 className="text-sm font-semibold text-mahogany">Live now</h3>
          </div>
          <ul className="space-y-2.5">
            {LIVE.map((item) => (
              <li
                key={item}
                className="flex gap-2.5 text-[13px] leading-relaxed text-mahogany-700"
              >
                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gold" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </Card>

        {/* Roadmap */}
        <div className="lg:col-span-2">
          <div className="mb-3 flex items-center gap-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-mahogany-400">
              On the roadmap
            </span>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {ROADMAP.map((r) => (
              <div
                key={r.title}
                className="rounded-xl border border-mahogany/10 bg-cream-50 p-5"
              >
                <div className="mb-2 flex items-start justify-between gap-3">
                  <h3 className="text-sm font-semibold text-mahogany">
                    {r.title}
                  </h3>
                  <span className="whitespace-nowrap rounded-full bg-twi-deep/8 px-2.5 py-1 font-mono text-[9.5px] uppercase tracking-[0.12em] text-twi-deep">
                    {r.stage}
                  </span>
                </div>
                <p className="text-[12.5px] leading-relaxed text-mahogany-500">
                  {r.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
