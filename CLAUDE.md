# TWI Report Generator

Titan Wealth International's **in-house AI report engine** for advisers (this is an
internal tool, NOT a SaaS). It turns a client meeting (notes / transcript) into a
finished, on-brand financial report — rendered as a slide deck — in the firm's
house style. End goal: an internal pitch to Titan's director team.

## Ground rules (read first)

- **Local-first. Do NOT deploy, and do NOT push to `main`, without the owner's
  explicit go-ahead.** A director pitch is pending and `main` is kept as the last
  clean state. Work on feature branches and open PRs.
- Running local AI generations against the shared dev Supabase is fine.
- **Demo clients are fictional** (Jane Doe, Michael Aldridge, Catherine Wells,
  Andrew Coulson). Never put real confidential client data into the code or DB —
  real client documents are reference-only, for structure/voice/layout.
- **No emojis or decorative glyphs anywhere user-facing.** Keep it clean and
  corporate. In tables use plain words ("Yes" / "No" / "Partial"), never ✓/✗.
- `public/deck-slides/` holds rendered slides from Titan's master deck (internal
  material) — keep this repo **private**.

## Stack

- Next.js 16 (App Router, Turbopack) · React 19 · TypeScript
- Tailwind v4 (`@theme` is in `app/globals.css`)
- Supabase — auth + Postgres (`lib/supabase/*`)
- Anthropic SDK (`@anthropic-ai/sdk`), model `claude-sonnet-4-6` (`lib/claude.ts`)

## Running it locally

1. `cp .env.example .env.local` and fill in the values (ask the owner — the team
   shares one dev Supabase: URL + anon key + service-role key, plus an Anthropic
   API key). `.env.local` is gitignored; never commit it.
2. `npm install`
3. `npm run dev` → http://localhost:3000
4. Test login (dev only, disposable): `preview-test@advisens.dev` / `TestPass1234`
   — profile is Ben Thompson / Titan Wealth International.

## Architecture you must know

**Reports are multi-slide DECKS, not prose.** Report markdown is split on `## `
headings → one slide each.

- `app/dashboard/reports/[id]/SlideDeck.tsx` — the click-through 16:9 slideshow
  viewer (deep-purple cover + concentric arcs, fullscreen, print-to-PDF). Authored
  on a 1280×720 canvas and scaled to fit.
- `app/dashboard/reports/[id]/ReportDocument.tsx` — renders one content slide:
  GFM plus fenced **chart blocks** (` ```advisens-callouts / -calc / -growth /
  -donut / -bars `) → inline SVG charts.
- `lib/mps-appendix.ts` — a fixed Model Portfolio Service appendix spliced into
  assessments/reviews before the closing slide.
- Report content is versioned in the DB (`report_versions`); a report renders its
  `current_version_id`.

**Generation pipeline (`scripts/`).** Long decks need streaming at high
max_tokens. `gen-common.mjs` holds the shared SYSTEM + house style (`VISUAL_STYLE`
= visual-first, concise, no emojis). `generate-*.mjs` writes a draft to `/tmp`;
polish by hand; then `commit-*.mjs` or `add-version.mjs <report_id> <md.file>
--commit` writes a new `report_version`. `validate-md-charts.mjs <file>` checks
chart JSON parses.

**Solutions library** (`app/dashboard/solutions/`, `lib/solutions-catalog.ts`) —
the governed master-deck slides per product. Images live in
`public/deck-slides/p<N>.png` (rendered at 150 dpi, cropped 8% off the bottom to
remove client footnotes). The list is a search-first browser
(`SolutionsBrowser.tsx`). To add slides: render the deck page → drop the PNG in →
add `{ page, caption }` to the catalog.

**Brand** (`app/globals.css`): Deep Purple `#31135E`, Empowered Purple `#8A3FFC`,
Inter. The heritage tokens (cream / gold / mahogany / espresso) are ALIASES mapped
to Titan colours; newer tokens are `twi-deep` / `twi-purple`. Source-of-truth
product copy is `lib/titan-library.ts`. Report-type display labels live in
`lib/report-types.ts` (Assessment / Introduction / Review pack / Bespoke).

## Layout

- `app/(marketing)/` — public landing (home, `/demo`, `/how-it-works`,
  `/use-cases`, `/why`)
- `app/dashboard/` — the app: Overview, Reports, Clients, Templates, Solutions,
  Profile, Settings
- `components/marketing/` — landing + animated demo components
- `lib/` — supabase, claude, titan-library, solutions-catalog, mps-appendix,
  report-types
- `scripts/` — report generation / commit / validation
- `public/deck-slides/` — rendered master-deck slides (internal; keep private)

## Conventions

- Verify UI changes by actually running the app (or the preview) and looking —
  don't trust DOM queries alone.
- Keep `npx tsc --noEmit` clean.
- A report must read like a presentation: lead each slide with a visual, a
  one-line intro (≤18 words), a few short bullets, no paragraphs.
