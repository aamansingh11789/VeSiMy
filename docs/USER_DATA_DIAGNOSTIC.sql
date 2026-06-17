-- ═══════════════════════════════════════════════════════════════════
-- VeSiMy User Data Diagnostic
-- Run these in the Supabase SQL editor (read-only checks first).
-- Each block is independent. Nothing here modifies data except the
-- clearly marked OPTIONAL FIX blocks at the bottom (commented out).
-- ═══════════════════════════════════════════════════════════════════

-- 1) ACCOUNT INVENTORY ────────────────────────────────────────────
-- How many accounts, when created, last activity.
select
  p.email,
  p.id as user_id,
  p.created_at,
  count(distinct pr.id) as project_count
from public.profiles p
left join public.projects pr on pr.user_id = p.id
group by p.email, p.id, p.created_at
order by p.created_at desc;

-- 2) DUPLICATE / RELATED ACCOUNTS ─────────────────────────────────
-- Greg is known to have two emails. Surface any same-person duplicates
-- by looking for similar email handles.
select email, id, created_at
from public.profiles
where email ilike '%gfoertsch%'
   or email ilike '%greg%'
order by created_at;

-- 3) ORPHANED PROJECTS ────────────────────────────────────────────
-- Projects whose user_id no longer maps to a profile (should be zero).
select pr.id, pr.name, pr.user_id, pr.created_at
from public.projects pr
left join public.profiles p on p.id = pr.user_id
where p.id is null;

-- 4) ORPHANED STEPS ───────────────────────────────────────────────
-- Steps pointing at a project that no longer exists (should be zero).
select s.id, s.project_id, s.name
from public.steps s
left join public.projects pr on pr.id = s.project_id
where pr.id is null;

-- 5) PROJECTS WITH NO STEPS ───────────────────────────────────────
-- Empty maps. Not a bug, but useful to know (abandoned or brand-new).
select p.email as owner, pr.name, pr.created_at
from public.projects pr
join public.profiles p on p.id = pr.user_id
left join public.steps s on s.project_id = pr.id
where s.id is null
order by pr.created_at desc;

-- 6) PER-USER ROW COUNTS ACROSS ALL TABLES ────────────────────────
-- Confirms each user's data is intact and attributable.
select 'projects'  as tbl, user_id, count(*) from public.projects  group by user_id
union all
select 'steps',     s.user_id, count(*) from public.steps s        group by s.user_id
union all
select 'kanban_cards', user_id, count(*) from public.kanban_cards group by user_id
union all
select 'analysis_reports', user_id, count(*) from public.analysis_reports group by user_id
order by tbl, count desc;

-- 7) THE REFERENCE PROJECT ────────────────────────────────────────
-- Confirm the seeded ⭐ master project exists and is attached to the founder.
select pr.name, p.email, count(s.id) as steps
from public.projects pr
join public.profiles p on p.id = pr.user_id
left join public.steps s on s.project_id = pr.id
where pr.name like '⭐%'
group by pr.name, p.email;

-- ═══════════════════════════════════════════════════════════════════
-- OPTIONAL FIX BLOCKS — read first, run only if the checks above
-- confirm the situation. Uncomment to use.
-- ═══════════════════════════════════════════════════════════════════

-- A) MERGE GREG'S TWO ACCOUNTS
-- Decide which email Greg keeps, then move the other account's projects.
-- Replace KEEP and DROP with the two real emails before running.
--
-- update public.projects
-- set user_id = (select id from public.profiles where email = 'KEEP_EMAIL')
-- where user_id = (select id from public.profiles where email = 'DROP_EMAIL');
--
-- Also move steps if steps carry user_id directly:
-- update public.steps
-- set user_id = (select id from public.profiles where email = 'KEEP_EMAIL')
-- where user_id = (select id from public.profiles where email = 'DROP_EMAIL');

-- B) DELETE A TRULY ORPHANED PROJECT (only if block 3 returned rows)
-- delete from public.projects where id = 'PUT_ORPHAN_ID_HERE';
