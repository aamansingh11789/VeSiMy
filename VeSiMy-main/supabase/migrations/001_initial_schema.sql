-- ═══════════════════════════════════════════════════════════════════════════
--  OpusCycle Database Schema — Migration 001
--  Run with: supabase db push
-- ═══════════════════════════════════════════════════════════════════════════

-- ── Extensions ─────────────────────────────────────────────────────────────
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- ── User Profiles ──────────────────────────────────────────────────────────
-- Extends Supabase auth.users with app-specific data
create table public.profiles (
  id                uuid references auth.users on delete cascade primary key,
  email             text unique not null,
  full_name         text,
  avatar_url        text,
  industry          text,                          -- manufacturing, healthcare, logistics, etc.
  company           text,
  role              text,                          -- operations manager, CI lead, etc.

  -- Subscription
  stripe_customer_id    text unique,
  subscription_id       text unique,
  subscription_status   text default 'free',       -- free | pro | enterprise | canceled
  subscription_period_end timestamptz,
  plan_tier             text default 'free',        -- free | pro | enterprise

  -- Usage limits
  projects_count        int default 0,
  projects_limit        int default 3,             -- free=3, pro=unlimited, enterprise=unlimited

  created_at        timestamptz default now(),
  updated_at        timestamptz default now()
);

-- ── Organizations (for Enterprise team accounts) ───────────────────────────
create table public.organizations (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null,
  slug        text unique not null,
  plan_tier   text default 'enterprise',
  owner_id    uuid references public.profiles(id) on delete cascade,
  created_at  timestamptz default now()
);

create table public.org_members (
  id          uuid primary key default uuid_generate_v4(),
  org_id      uuid references public.organizations(id) on delete cascade,
  user_id     uuid references public.profiles(id) on delete cascade,
  role        text default 'member',              -- owner | admin | member | viewer
  invited_at  timestamptz default now(),
  joined_at   timestamptz,
  unique(org_id, user_id)
);

-- ── Projects ───────────────────────────────────────────────────────────────
create table public.projects (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid references public.profiles(id) on delete cascade not null,
  org_id      uuid references public.organizations(id) on delete set null,

  name        text not null default 'New Project',
  description text,
  industry    text,                               -- manufacturing | healthcare | logistics | retail | domestic | other
  status      text default 'active',             -- active | archived | template

  -- VSM metadata
  customer        text,
  monthly_demand  numeric,
  takt_time       numeric,
  working_hrs     numeric default 8,
  shifts          int default 1,

  -- Project data (full JSON blob — mirrors the v1 demo structure)
  vsm_data        jsonb default '{"steps":[],"connectors":[]}'::jsonb,

  -- Sharing
  is_public       boolean default false,
  share_token     text unique default encode(gen_random_bytes(16), 'hex'),

  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- ── Process Steps ──────────────────────────────────────────────────────────
create table public.steps (
  id              uuid primary key default uuid_generate_v4(),
  project_id      uuid references public.projects(id) on delete cascade not null,
  user_id         uuid references public.profiles(id) on delete cascade not null,

  name            text not null,
  position        int default 0,                 -- order in the VSM

  -- Step metrics
  cycle_time      numeric,                        -- seconds
  operators       numeric default 1,
  uptime          numeric default 95,             -- percent
  defect_rate     numeric default 0,
  completion_acc  numeric default 100,            -- %C&A
  wait_time       numeric default 0,
  trans_time      numeric default 0,
  wip             numeric default 0,
  flow_type       text default 'push',            -- push | supermarket
  sm_min          numeric,
  sm_max          numeric,
  department      text,
  notes           text,

  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

-- ── Tool Data (per step, per tool) ─────────────────────────────────────────
-- Stores results from all 6 CI tools attached to each step
create table public.tool_data (
  id          uuid primary key default uuid_generate_v4(),
  step_id     uuid references public.steps(id) on delete cascade not null,
  project_id  uuid references public.projects(id) on delete cascade not null,
  user_id     uuid references public.profiles(id) on delete cascade not null,
  tool        text not null,                     -- stopwatch | fivewhy | ishikawa | waste | kaizen | improvement
  data        jsonb not null default '{}'::jsonb,
  saved_at    timestamptz default now(),
  updated_at  timestamptz default now(),
  unique(step_id, tool)
);

-- ── Kaizen Events ──────────────────────────────────────────────────────────
create table public.kaizen_events (
  id              uuid primary key default uuid_generate_v4(),
  project_id      uuid references public.projects(id) on delete cascade,
  step_id         uuid references public.steps(id) on delete set null,
  user_id         uuid references public.profiles(id) on delete cascade not null,
  org_id          uuid references public.organizations(id) on delete set null,

  title           text not null,
  description     text,
  category        text,                          -- quality | delivery | cost | safety | morale
  priority        text default 'medium',         -- low | medium | high | critical
  status          text default 'open',           -- open | in_progress | complete | canceled

  owner           text,
  due_date        date,
  completion_date date,

  before_photo_url text,
  after_photo_url  text,
  before_notes     text,
  after_notes      text,

  estimated_savings numeric,
  actual_savings    numeric,

  actions         jsonb default '[]'::jsonb,

  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- ── Stripe Webhooks Log ────────────────────────────────────────────────────
create table public.stripe_events (
  id            text primary key,                -- Stripe event ID
  type          text not null,
  data          jsonb not null,
  processed_at  timestamptz default now()
);

-- ═══════════════════════════════════════════════════════════════════════════
--  ROW LEVEL SECURITY (RLS)
-- ═══════════════════════════════════════════════════════════════════════════

alter table public.profiles       enable row level security;
alter table public.organizations  enable row level security;
alter table public.org_members    enable row level security;
alter table public.projects       enable row level security;
alter table public.steps          enable row level security;
alter table public.tool_data      enable row level security;
alter table public.kaizen_events  enable row level security;

-- Profiles: users can only read/write their own
create policy "profiles_self" on public.profiles
  for all using (auth.uid() = id);

-- Projects: owner can do everything; org members can read
create policy "projects_owner" on public.projects
  for all using (auth.uid() = user_id);

create policy "projects_public_read" on public.projects
  for select using (is_public = true);

-- Steps: only project owner
create policy "steps_owner" on public.steps
  for all using (auth.uid() = user_id);

-- Tool data: only the user who owns the step
create policy "tool_data_owner" on public.tool_data
  for all using (auth.uid() = user_id);

-- Kaizen: owner + org members
create policy "kaizen_owner" on public.kaizen_events
  for all using (auth.uid() = user_id);

-- Org members: see their own membership
create policy "org_members_self" on public.org_members
  for select using (auth.uid() = user_id);

-- Organizations: members can read
create policy "orgs_members_read" on public.organizations
  for select using (
    exists (select 1 from public.org_members m where m.org_id = id and m.user_id = auth.uid())
  );

-- ═══════════════════════════════════════════════════════════════════════════
--  FUNCTIONS & TRIGGERS
-- ═══════════════════════════════════════════════════════════════════════════

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Auto-update updated_at
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger touch_projects    before update on public.projects    for each row execute procedure public.touch_updated_at();
create trigger touch_steps       before update on public.steps       for each row execute procedure public.touch_updated_at();
create trigger touch_tool_data   before update on public.tool_data   for each row execute procedure public.touch_updated_at();
create trigger touch_kaizen      before update on public.kaizen_events for each row execute procedure public.touch_updated_at();
create trigger touch_profiles    before update on public.profiles    for each row execute procedure public.touch_updated_at();

-- Increment project count on insert
create or replace function public.increment_project_count()
returns trigger language plpgsql security definer as $$
begin
  update public.profiles set projects_count = projects_count + 1 where id = new.user_id;
  return new;
end;
$$;
create trigger on_project_created after insert on public.projects for each row execute procedure public.increment_project_count();

create or replace function public.decrement_project_count()
returns trigger language plpgsql security definer as $$
begin
  update public.profiles set projects_count = greatest(0, projects_count - 1) where id = old.user_id;
  return old;
end;
$$;
create trigger on_project_deleted after delete on public.projects for each row execute procedure public.decrement_project_count();

-- ═══════════════════════════════════════════════════════════════════════════
--  INDEXES
-- ═══════════════════════════════════════════════════════════════════════════
create index idx_projects_user_id    on public.projects(user_id);
create index idx_projects_org_id     on public.projects(org_id);
create index idx_steps_project_id    on public.steps(project_id);
create index idx_steps_position      on public.steps(project_id, position);
create index idx_tool_data_step_id   on public.tool_data(step_id);
create index idx_kaizen_project_id   on public.kaizen_events(project_id);
create index idx_kaizen_status       on public.kaizen_events(status);
