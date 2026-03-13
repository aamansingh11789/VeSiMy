-- ── 007_process_journal.sql ─────────────────────────────────────────────────
-- Process Journal: auto + manual log of every change to a project
-- Run this in your Supabase SQL editor

create table if not exists public.process_journal (
  id           uuid primary key default gen_random_uuid(),
  project_id   uuid not null references public.projects(id) on delete cascade,
  user_id      uuid not null references auth.users(id) on delete cascade,
  type         text not null check (type in ('manual', 'vsm', 'kaizen', 'fivewhy', 'timestudy', 'smed', 'gemba', 'system')),
  content      text not null,
  meta         jsonb default '{}',   -- optional structured data (before/after, tool name, etc.)
  created_at   timestamptz not null default now()
);

-- Index for fast project lookups
create index if not exists process_journal_project_id_idx on public.process_journal (project_id, created_at desc);

-- RLS
alter table public.process_journal enable row level security;

-- Users can only read/write their own project journals
create policy "Users can read their own journal entries"
  on public.process_journal for select
  using (user_id = auth.uid());

create policy "Users can insert their own journal entries"
  on public.process_journal for insert
  with check (user_id = auth.uid());

create policy "Users can delete their own journal entries"
  on public.process_journal for delete
  using (user_id = auth.uid());
