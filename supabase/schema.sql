-- =====================================================================
-- Advisens — initial database schema
-- Run in: Supabase SQL editor (paste the whole file, click Run)
-- =====================================================================

-- Required extensions ---------------------------------------------------
create extension if not exists "pgcrypto";

-- =====================================================================
-- ENUMS
-- =====================================================================
create type report_type as enum (
  'new_client_assessment',
  'introductory_pitch',
  'review_pack',
  'custom'
);

create type report_status as enum (
  'draft',          -- being built / inputs being gathered
  'generating',     -- AI is drafting it
  'review',         -- AI draft ready, advisor reviewing
  'locked',         -- advisor confirmed, sent to client
  'archived'
);

create type comment_kind as enum (
  'note',           -- advisor leaves a comment
  'prompt_edit',    -- advisor asks AI to revise
  'system'          -- system event / audit
);

create type activity_kind as enum (
  'report_created',
  'report_generated',
  'report_edited',
  'report_locked',
  'report_archived',
  'template_uploaded',
  'template_deleted',
  'profile_updated',
  'client_created'
);

-- =====================================================================
-- TABLES
-- =====================================================================

-- Advisor profile -------------------------------------------------------
-- One row per auth.users entry. Holds the "Instructions for Advisens"
-- plus everything the AI needs to know about who the advisor is.
create table advisor_profiles (
  user_id          uuid primary key references auth.users(id) on delete cascade,
  full_name        text,
  firm_name        text,
  job_title        text,
  bio              text,
  jurisdiction     text,                       -- e.g. "UAE / DIFC"
  voice_sample     text,                       -- paste a few paragraphs of your writing
  instructions     text,                       -- "Instructions for Advisens" — free-form
  product_universe text,                       -- platforms, providers, funds the advisor uses
  signature_block  text,
  compliance_disclaimers text,
  brand_primary_color text,
  brand_logo_url   text,
  notetaker_provider text,                     -- 'fathom' | 'otter' | 'read.ai' | etc.
  notetaker_api_key text,                      -- stored server-side only, never exposed
  onboarding_completed boolean not null default false,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

-- Clients ---------------------------------------------------------------
-- Each report can optionally link to a client; clients accumulate history.
create table clients (
  id               uuid primary key default gen_random_uuid(),
  advisor_id       uuid not null references auth.users(id) on delete cascade,
  full_name        text not null,
  email            text,
  notes            text,
  status           text not null default 'prospect', -- 'prospect' | 'active' | 'inactive'
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);
create index clients_advisor_id_idx on clients(advisor_id);

-- Report templates ------------------------------------------------------
-- The advisor uploads their existing report templates here. The AI uses
-- structure, sections, language style from these as the source of truth.
create table report_templates (
  id               uuid primary key default gen_random_uuid(),
  advisor_id       uuid not null references auth.users(id) on delete cascade,
  name             text not null,                -- "Assessment report (long)"
  report_type      report_type not null,
  description      text,
  storage_path     text not null,                -- path inside the 'templates' storage bucket
  file_name        text not null,
  file_size_bytes  bigint,
  mime_type        text,
  extracted_text   text,                         -- parsed text content for AI context
  is_default       boolean not null default false,  -- the default template for this report_type
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);
create index report_templates_advisor_idx on report_templates(advisor_id);
create unique index report_templates_one_default_per_type
  on report_templates(advisor_id, report_type)
  where is_default;

-- Knowledge documents ---------------------------------------------------
-- Per-advisor reference library (market views, product info, past reports)
-- that the AI can pull from when drafting.
create table knowledge_documents (
  id               uuid primary key default gen_random_uuid(),
  advisor_id       uuid not null references auth.users(id) on delete cascade,
  title            text not null,
  description      text,
  storage_path     text,                         -- nullable: could be URL-only
  source_url       text,
  extracted_text   text,
  tags             text[] default '{}',
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);
create index knowledge_documents_advisor_idx on knowledge_documents(advisor_id);

-- Reports ---------------------------------------------------------------
-- A single bespoke report (e.g. "Assessment report — Khalid Al-Mansoori").
create table reports (
  id               uuid primary key default gen_random_uuid(),
  advisor_id       uuid not null references auth.users(id) on delete cascade,
  client_id        uuid references clients(id) on delete set null,
  template_id      uuid references report_templates(id) on delete set null,
  title            text not null,
  report_type      report_type not null,
  status           report_status not null default 'draft',
  -- Inputs gathered at creation time
  meeting_notes    text,                         -- pasted notes from the advisor
  transcript       text,                         -- pasted transcript from a notetaker
  notetaker_url    text,                         -- link to Fathom/Otter recording
  attachments_paths text[] default '{}',         -- storage paths for uploaded files
  additional_notes text,                         -- "anything else the AI should know"
  attachment_text  text,                         -- text extracted from uploads (parsed in-browser, fed to generation)
  -- Output
  current_version_id uuid,                       -- points to the active version
  -- Lifecycle
  locked_at        timestamptz,
  locked_by        uuid references auth.users(id),
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);
create index reports_advisor_idx on reports(advisor_id);
create index reports_client_idx on reports(client_id);
create index reports_status_idx on reports(status);

-- Report versions -------------------------------------------------------
-- Each AI generation or advisor edit creates a new version. The reports
-- table's current_version_id points at the latest.
create table report_versions (
  id               uuid primary key default gen_random_uuid(),
  report_id        uuid not null references reports(id) on delete cascade,
  version_number   int not null,
  -- Content
  content_markdown text not null,                -- the report body in markdown
  content_json     jsonb,                        -- structured form for richer rendering
  -- Provenance
  generated_by     text not null,                -- 'ai' | 'advisor_edit' | 'prompt_edit'
  prompt           text,                         -- advisor's prompt-edit instruction (if any)
  ai_model         text,                         -- e.g. 'claude-opus-4-7'
  ai_tokens_input  int,
  ai_tokens_output int,
  -- Metadata
  created_by       uuid references auth.users(id),
  created_at       timestamptz not null default now()
);
create index report_versions_report_idx on report_versions(report_id);
create unique index report_versions_unique on report_versions(report_id, version_number);

-- After-the-fact FK from reports.current_version_id (avoids circular create)
alter table reports
  add constraint reports_current_version_fk
  foreign key (current_version_id) references report_versions(id) on delete set null;

-- Report comments / prompt-edits ---------------------------------------
-- Advisor leaves comments on a report (and optionally tied to a version).
create table report_comments (
  id               uuid primary key default gen_random_uuid(),
  report_id        uuid not null references reports(id) on delete cascade,
  version_id       uuid references report_versions(id) on delete set null,
  kind             comment_kind not null,
  body             text not null,
  -- For prompt_edit kind: the new version this prompt produced
  resulted_in_version_id uuid references report_versions(id) on delete set null,
  author_id        uuid references auth.users(id),
  created_at       timestamptz not null default now()
);
create index report_comments_report_idx on report_comments(report_id);

-- Activity log ----------------------------------------------------------
-- Compliance audit trail. Append-only.
create table activity_log (
  id               uuid primary key default gen_random_uuid(),
  advisor_id       uuid not null references auth.users(id) on delete cascade,
  kind             activity_kind not null,
  subject_type     text,                         -- 'report' | 'template' | 'client' | 'profile'
  subject_id       uuid,
  metadata         jsonb default '{}',
  created_at       timestamptz not null default now()
);
create index activity_log_advisor_idx on activity_log(advisor_id, created_at desc);

-- =====================================================================
-- TRIGGERS
-- =====================================================================

-- updated_at maintenance
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger advisor_profiles_set_updated_at
  before update on advisor_profiles
  for each row execute function set_updated_at();

create trigger clients_set_updated_at
  before update on clients
  for each row execute function set_updated_at();

create trigger report_templates_set_updated_at
  before update on report_templates
  for each row execute function set_updated_at();

create trigger knowledge_documents_set_updated_at
  before update on knowledge_documents
  for each row execute function set_updated_at();

create trigger reports_set_updated_at
  before update on reports
  for each row execute function set_updated_at();

-- Auto-create an advisor_profiles row when a new auth user signs up
create or replace function handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into advisor_profiles (user_id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', ''));
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- =====================================================================
-- ROW-LEVEL SECURITY
-- Every table: advisor only sees their own rows.
-- =====================================================================

alter table advisor_profiles    enable row level security;
alter table clients             enable row level security;
alter table report_templates    enable row level security;
alter table knowledge_documents enable row level security;
alter table reports             enable row level security;
alter table report_versions     enable row level security;
alter table report_comments     enable row level security;
alter table activity_log        enable row level security;

-- advisor_profiles
create policy "own profile read"
  on advisor_profiles for select
  using (auth.uid() = user_id);
create policy "own profile insert"
  on advisor_profiles for insert
  with check (auth.uid() = user_id);
create policy "own profile update"
  on advisor_profiles for update
  using (auth.uid() = user_id);

-- clients
create policy "own clients read"
  on clients for select using (auth.uid() = advisor_id);
create policy "own clients write"
  on clients for all using (auth.uid() = advisor_id)
  with check (auth.uid() = advisor_id);

-- report_templates
create policy "own templates read"
  on report_templates for select using (auth.uid() = advisor_id);
create policy "own templates write"
  on report_templates for all using (auth.uid() = advisor_id)
  with check (auth.uid() = advisor_id);

-- knowledge_documents
create policy "own knowledge read"
  on knowledge_documents for select using (auth.uid() = advisor_id);
create policy "own knowledge write"
  on knowledge_documents for all using (auth.uid() = advisor_id)
  with check (auth.uid() = advisor_id);

-- reports
create policy "own reports read"
  on reports for select using (auth.uid() = advisor_id);
create policy "own reports write"
  on reports for all using (auth.uid() = advisor_id)
  with check (auth.uid() = advisor_id);

-- report_versions (scoped via parent report)
create policy "own report versions read"
  on report_versions for select
  using (exists (
    select 1 from reports r
    where r.id = report_versions.report_id and r.advisor_id = auth.uid()
  ));
create policy "own report versions write"
  on report_versions for all
  using (exists (
    select 1 from reports r
    where r.id = report_versions.report_id and r.advisor_id = auth.uid()
  ))
  with check (exists (
    select 1 from reports r
    where r.id = report_versions.report_id and r.advisor_id = auth.uid()
  ));

-- report_comments (scoped via parent report)
create policy "own report comments read"
  on report_comments for select
  using (exists (
    select 1 from reports r
    where r.id = report_comments.report_id and r.advisor_id = auth.uid()
  ));
create policy "own report comments write"
  on report_comments for all
  using (exists (
    select 1 from reports r
    where r.id = report_comments.report_id and r.advisor_id = auth.uid()
  ))
  with check (exists (
    select 1 from reports r
    where r.id = report_comments.report_id and r.advisor_id = auth.uid()
  ));

-- activity_log (read-only for the advisor)
create policy "own activity read"
  on activity_log for select using (auth.uid() = advisor_id);
create policy "own activity insert"
  on activity_log for insert with check (auth.uid() = advisor_id);

-- =====================================================================
-- STORAGE BUCKETS
-- Run these after the SQL above completes.
-- =====================================================================
insert into storage.buckets (id, name, public)
values
  ('templates', 'templates', false),
  ('transcripts', 'transcripts', false),
  ('attachments', 'attachments', false),
  ('reports', 'reports', false),
  ('knowledge', 'knowledge', false),
  ('brand', 'brand', false)
on conflict (id) do nothing;

-- Storage RLS: each advisor folders are namespaced by user_id at the root.
-- Path convention: <bucket>/<auth.uid()>/<filename>
create policy "own template files read"
  on storage.objects for select
  using (
    bucket_id = 'templates'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
create policy "own template files write"
  on storage.objects for insert
  with check (
    bucket_id = 'templates'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
create policy "own template files delete"
  on storage.objects for delete
  using (
    bucket_id = 'templates'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Apply the same pattern to the other buckets
do $$
declare b text;
begin
  foreach b in array array['transcripts', 'attachments', 'reports', 'knowledge', 'brand']
  loop
    execute format($f$
      create policy %I on storage.objects for select
      using (bucket_id = %L and (storage.foldername(name))[1] = auth.uid()::text);
    $f$, b || '_read', b);
    execute format($f$
      create policy %I on storage.objects for insert
      with check (bucket_id = %L and (storage.foldername(name))[1] = auth.uid()::text);
    $f$, b || '_write', b);
    execute format($f$
      create policy %I on storage.objects for delete
      using (bucket_id = %L and (storage.foldername(name))[1] = auth.uid()::text);
    $f$, b || '_delete', b);
  end loop;
end $$;
