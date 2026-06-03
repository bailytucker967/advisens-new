# TWI Report Generator

Titan Wealth International's in-house AI report engine for advisers. Next.js App
Router app. **Local-first — not currently deployed.** See [`CLAUDE.md`](CLAUDE.md)
for architecture, conventions, and ground rules.

## Quick start

```bash
npm install
cp .env.example .env.local   # then fill in the values
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Collaborating on this project (team handoff)

This repo is shared between Titan teammates. Fastest way in:

1. **Get added as a collaborator** on the GitHub repo (ask the owner).
2. `git clone` the repo, then `cp .env.example .env.local`.
3. **Get the dev keys from the owner** and paste them into `.env.local`. The team
   shares **one dev Supabase** (URL + anon + service-role keys) plus an Anthropic
   API key. You do **not** need to create your own Supabase project or run
   `schema.sql` — that's only for the from-scratch path below.
4. `npm install && npm run dev`, then sign in with the dev test account (see
   [`CLAUDE.md`](CLAUDE.md)).
5. Open the repo folder in your own Claude Code — [`CLAUDE.md`](CLAUDE.md) gives
   it the full project context.

**Workflow:** branch off `main`, commit, open a PR. **Do not push to `main`**
without the owner's go-ahead — a director pitch is pending and `main` is kept as
the last clean state.

The setup section below is only for spinning up a *fresh* Supabase project; skip
it for the shared dev setup.

## Setup — first time

### 1. Supabase

1. Create a project at [supabase.com](https://supabase.com). Pick a region
   close to your users.
2. **Settings → API** — copy these into `.env.local`:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon` `public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` `secret` key → `SUPABASE_SERVICE_ROLE_KEY`
3. **SQL Editor** — paste the contents of [`supabase/schema.sql`](supabase/schema.sql)
   and run it. This creates all tables, RLS policies, triggers, and storage
   buckets.
4. **Authentication → URL Configuration** — set Site URL to
   `http://localhost:3000` (dev) and add `https://advisens.com/*` (prod)
   under Redirect URLs.

### 2. Anthropic (Claude API)

1. Sign up at [console.anthropic.com](https://console.anthropic.com), add
   billing, create an API key.
2. Paste it into `.env.local` as `ANTHROPIC_API_KEY`.

### 3. Run locally

```bash
npm run dev
```

Sign up at [http://localhost:3000/signup](http://localhost:3000/signup).
Confirm via the email Supabase sends (in dev mode you may need to confirm
the user manually in the Supabase dashboard if email isn't configured).
Then sign in and explore the dashboard.

## Project structure

```
advisens-new/
├── app/
│   ├── (auth)/              ← login, signup, forgot/reset password
│   ├── auth/                ← callback + signout route handlers
│   ├── dashboard/           ← authenticated app
│   │   ├── _components/     ← shared dashboard components (nav, topbar)
│   │   ├── reports/
│   │   ├── templates/
│   │   ├── clients/
│   │   ├── knowledge/
│   │   ├── profile/         ← "Instructions for Advisens"
│   │   └── settings/
│   ├── api/reports/[id]/    ← generate, edit, comments, lock
│   ├── page.tsx             ← marketing homepage (renders prototype.html)
│   └── layout.tsx
├── components/ui/           ← Button, Input, etc.
├── lib/
│   ├── claude.ts            ← Anthropic SDK wrapper + prompt builders
│   ├── env.ts               ← typed env-var access
│   ├── utils.ts             ← cn() helper
│   └── supabase/
│       ├── client.ts        ← browser client
│       ├── server.ts        ← server client + getUser()
│       └── admin.ts         ← service-role client (server-only)
├── middleware.ts            ← session refresh + auth redirects
├── public/                  ← static assets including the marketing prototype
└── supabase/schema.sql      ← run this in Supabase SQL Editor on first setup
```

## Architecture notes

- **Auth gating**: `middleware.ts` redirects unauthenticated visits to
  `/dashboard/*` to `/login`, and signed-in visits to `/login` etc. to
  `/dashboard`. Per-route checks also exist in `app/dashboard/layout.tsx`.
- **Database access**: server components use `createClient()` from
  `lib/supabase/server.ts` (cookie-aware, respects RLS). Client components
  use `createClient()` from `lib/supabase/client.ts`. The service-role
  admin client is only for trusted server routes that need to bypass RLS.
- **AI generation**: report generation runs inside the
  `/api/reports/[id]/generate` route handler. It assembles a system prompt
  from the advisor's profile + chosen template, then calls Claude. The
  output is saved as a new `report_versions` row.
- **Storage**: each bucket is namespaced by `<auth.uid()>/<filename>`.
  RLS policies enforce that advisors can only read/write their own folder.

## Deployment

Pushed to `main` → Vercel auto-deploys. Set the same env vars in the Vercel
project (Project Settings → Environment Variables) for Preview + Production.
The Supabase project used for production should be separate from the dev
project — create a second Supabase project named `advisens-prod` and run
the same `supabase/schema.sql` against it.

## Common Supabase gotchas

- **"Email not confirmed"** on login: by default Supabase requires email
  confirmation. In dev, you can either configure SMTP, or manually confirm
  the user in Authentication → Users → click the row → Confirm email.
- **Storage upload 403**: confirm RLS policies were created (the schema.sql
  does this). Path must start with `<your-user-id>/`.
- **"Missing Supabase env vars"** error: `.env.local` not loaded. Restart
  `npm run dev` after editing.
