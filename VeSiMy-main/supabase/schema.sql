-- ══════════════════════════════════════════════════════════════════════════════
--  OpusCycle — Supabase Database Schema
--  Run this in: Supabase Dashboard → SQL Editor → New Query → Run
--  Or via CLI: supabase db push
-- ══════════════════════════════════════════════════════════════════════════════

-- ── Enable UUID extension ────────────────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ══════════════════════════════════════════════════════════════════════════════
--  PROFILES
--  Extended user data beyond Supabase Auth's built-in users table
-- ══════════════════════════════════════════════════════════════════════════════
create table if not exists profiles (
  id            uuid references auth.users(id) on delete cascade primary key,
  email         text,
  full_name     text,
  avatar_url    text,
  organization  text,
  role          text default 'member',        -- 'owner' | 'admin' | 'member'
  plan          text default 'free',          -- 'free' | 'pro' | 'enterprise'
  stripe_customer_id text,
  projects_limit int default 3,              -- free: 3, pro: unlimited
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

-- Auto-create profile when user signs up
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ══════════════════════════════════════════════════════════════════════════════
--  ORGANIZATIONS (for Enterprise / Team plan)
-- ══════════════════════════════════════════════════════════════════════════════
create table if not exists organizations (
  id          uuid default uuid_generate_v4() primary key,
  name        text not null,
  slug        text unique not null,
  owner_id    uuid references profiles(id) on delete set null,
  plan        text default 'enterprise',
  created_at  timestamptz default now()
);

create table if not exists org_members (
  org_id      uuid references organizations(id) on delete cascade,
  user_id     uuid references profiles(id) on delete cascade,
  role        text default 'member',          -- 'owner' | 'admin' | 'member'
  joined_at   timestamptz default now(),
  primary key (org_id, user_id)
);

-- ══════════════════════════════════════════════════════════════════════════════
--  PROJECTS
--  Top-level VSM project (maps to the entire project object from v1 demo)
-- ══════════════════════════════════════════════════════════════════════════════
create table if not exists projects (
  id              uuid default uuid_generate_v4() primary key,
  user_id         uuid references profiles(id) on delete cascade not null,
  org_id          uuid references organizations(id) on delete set null,

  -- Core metadata
  name            text not null,
  description     text,
  industry        text,                       -- 'manufacturing' | 'healthcare' | 'service' | etc.
  state           text default 'current',     -- 'current' | 'future'
  status          text default 'active',      -- 'active' | 'archived'

  -- VSM parameters (from project setup form)
  product         text,                       -- Product family name
  customer        text,                       -- Customer name
  supplier        text,                       -- Supplier name
  demand          numeric,                    -- Units per day
  working_hours   numeric,                    -- Hours per shift
  available_time_sec numeric,                 -- Available time in seconds
  takt_time       numeric,                    -- Manual takt override (seconds)
  shifts          int default 1,

  -- Thumbnail / preview
  thumbnail_url   text,

  -- Timestamps
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

-- ══════════════════════════════════════════════════════════════════════════════
--  STEPS
--  Process steps within a project (VSM process boxes)
-- ══════════════════════════════════════════════════════════════════════════════
create table if not exists steps (
  id                  uuid default uuid_generate_v4() primary key,
  project_id          uuid references projects(id) on delete cascade not null,
  user_id             uuid references profiles(id) on delete cascade not null,

  -- Ordering
  position            int not null default 0,

  -- Step metadata (from StepModal)
  name                text not null,
  department          text,
  operators           int default 1,

  -- Process metrics
  uptime              numeric,                -- % uptime
  defect_rate         numeric,                -- % defect rate
  completion_accuracy numeric,                -- % C&A

  -- Timing (seconds)
  wait_time           numeric default 0,      -- Queue / wait time
  trans_time          numeric default 0,      -- Transport time
  wip                 numeric default 0,      -- WIP units

  -- Flow type
  flow_type           text default 'push',    -- 'push' | 'supermarket'
  sm_min              numeric,                -- Supermarket min
  sm_max              numeric,                -- Supermarket max

  -- Notes
  notes               text,

  created_at          timestamptz default now(),
  updated_at          timestamptz default now()
);

-- ══════════════════════════════════════════════════════════════════════════════
--  TOOL DATA
--  Each CI tool's data stored per step (replaces toolData in localStorage)
--  tool_type: 'stopwatch' | 'fivewhy' | 'ishikawa' | 'waste' | 'kaizen' | 'improvement'
-- ══════════════════════════════════════════════════════════════════════════════
create table if not exists tool_data (
  id          uuid default uuid_generate_v4() primary key,
  step_id     uuid references steps(id) on delete cascade not null,
  user_id     uuid references profiles(id) on delete cascade not null,
  tool_type   text not null,
  data        jsonb not null default '{}',    -- Full tool payload as JSON
  saved_at    timestamptz default now(),
  updated_at  timestamptz default now(),
  unique(step_id, tool_type)                  -- One record per tool per step
);

-- ══════════════════════════════════════════════════════════════════════════════
--  KAIZEN EVENTS  (also stored in tool_data.data, but indexed here for queries)
-- ══════════════════════════════════════════════════════════════════════════════
create table if not exists kaizen_events (
  id          uuid default uuid_generate_v4() primary key,
  step_id     uuid references steps(id) on delete cascade not null,
  project_id  uuid references projects(id) on delete cascade not null,
  user_id     uuid references profiles(id) on delete cascade not null,

  kz_id       text,                           -- Human-readable ID: KZ-001
  title       text not null,
  description text,
  category    text,                           -- 'Safety' | 'Quality' | 'Delivery' | etc.
  priority    text default 'medium',          -- 'low' | 'medium' | 'high' | 'critical'
  status      text default 'open',            -- 'open' | 'in-progress' | 'complete' | 'verified'
  owner       text,
  due_date    date,
  completed_at timestamptz,

  -- Before/after photos stored as Supabase Storage paths
  photo_before text,
  photo_after  text,

  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- ══════════════════════════════════════════════════════════════════════════════
--  SUBSCRIPTIONS (Stripe integration - Phase 3)
-- ══════════════════════════════════════════════════════════════════════════════
create table if not exists subscriptions (
  id                    uuid default uuid_generate_v4() primary key,
  user_id               uuid references profiles(id) on delete cascade not null unique,
  stripe_customer_id    text,
  stripe_subscription_id text,
  plan                  text default 'free',  -- 'free' | 'pro' | 'enterprise'
  status                text,                 -- 'active' | 'canceled' | 'past_due'
  current_period_end    timestamptz,
  cancel_at_period_end  boolean default false,
  created_at            timestamptz default now(),
  updated_at            timestamptz default now()
);

-- ══════════════════════════════════════════════════════════════════════════════
--  UPDATED_AT TRIGGERS (auto-update timestamps)
-- ══════════════════════════════════════════════════════════════════════════════
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_profiles_updated_at    before update on profiles    for each row execute function update_updated_at();
create trigger trg_projects_updated_at    before update on projects    for each row execute function update_updated_at();
create trigger trg_steps_updated_at       before update on steps       for each row execute function update_updated_at();
create trigger trg_tool_data_updated_at   before update on tool_data   for each row execute function update_updated_at();
create trigger trg_kaizen_updated_at      before update on kaizen_events for each row execute function update_updated_at();
create trigger trg_subs_updated_at        before update on subscriptions for each row execute function update_updated_at();

-- ══════════════════════════════════════════════════════════════════════════════
--  ROW LEVEL SECURITY (RLS)
--  Users can only see their own data (or their org's data)
-- ══════════════════════════════════════════════════════════════════════════════
alter table profiles         enable row level security;
alter table projects         enable row level security;
alter table steps            enable row level security;
alter table tool_data        enable row level security;
alter table kaizen_events    enable row level security;
alter table subscriptions    enable row level security;
alter table organizations    enable row level security;
alter table org_members      enable row level security;

-- ── Profiles: users can read/update their own ────────────────────────────────
create policy "profiles_select_own" on profiles for select using (auth.uid() = id);
create policy "profiles_update_own" on profiles for update using (auth.uid() = id);

-- ── Projects: users own their projects ───────────────────────────────────────
create policy "projects_all_own" on projects
  for all using (auth.uid() = user_id);

-- Org members can see org projects
create policy "projects_org_select" on projects
  for select using (
    org_id is not null and
    exists (select 1 from org_members where org_id = projects.org_id and user_id = auth.uid())
  );

-- ── Steps: follow project ownership ─────────────────────────────────────────
create policy "steps_all_own" on steps
  for all using (auth.uid() = user_id);

-- ── Tool data: follow step ownership ────────────────────────────────────────
create policy "tool_data_all_own" on tool_data
  for all using (auth.uid() = user_id);

-- ── Kaizen events ────────────────────────────────────────────────────────────
create policy "kaizen_all_own" on kaizen_events
  for all using (auth.uid() = user_id);

-- ── Subscriptions: own only ──────────────────────────────────────────────────
create policy "subs_all_own" on subscriptions
  for all using (auth.uid() = user_id);

-- ── Indexes for performance ──────────────────────────────────────────────────
create index if not exists idx_projects_user_id   on projects(user_id);
create index if not exists idx_projects_org_id    on projects(org_id);
create index if not exists idx_steps_project_id   on steps(project_id);
create index if not exists idx_steps_position     on steps(project_id, position);
create index if not exists idx_tool_data_step_id  on tool_data(step_id);
create index if not exists idx_kaizen_project_id  on kaizen_events(project_id);
create index if not exists idx_kaizen_status      on kaizen_events(status);
