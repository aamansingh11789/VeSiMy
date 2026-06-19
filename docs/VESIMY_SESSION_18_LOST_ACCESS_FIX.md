# VeSiMy Session 18 — URGENT: older users lost access to projects

Greg and other older users could not see/open their projects. Two root causes,
both fixed across every affected read path.

## Root cause 1 — RLS-tripping nested tool_data join (projects vanish / won't open)
A nested embed of tool_data inside steps inside projects
(e.g. `steps(*, tool_data(*))`) trips Supabase row-level security in real user
sessions and makes the whole query return empty or error. This is the same
failure mode documented before; it had spread to several queries.

Fixed (nested join removed; tool_data now fetched in a separate, RLS-safe
top-level query — its policy is auth.uid() = user_id — and stitched back):
- app/dashboard/page.tsx            (dashboard list)        [fixed earlier]
- lib/db.ts fetchProject            (v1 project open)
- app/project/[id]/page.tsx         (v2 project open)  <-- main "can't open" path
- app/api/v2/analyze/route.ts       (AI analyze)

## Root cause 2 — status='active' filter hides legacy NULL-status projects
Projects created before the `status` column existed can have a NULL status.
Any SQL status predicate (.eq('status','active'), .neq, .not.in) ALSO excludes
NULL rows, so those older projects disappeared from lists and counts.

Fixed (status now filtered in JS: keep active + NULL, hide only archived/template):
- app/dashboard/page.tsx            [fixed earlier]
- lib/db.ts fetchProjects           (project list)
- app/api/projects/route.ts         (GET list + POST limit count)
- app/skill-matrix/page.tsx         (project list + count)
- app/settings/page.tsx             (project count)
Note: `status: 'active'` on INSERT (new projects, seeds) is intentional and kept.

## Verification
- Final code sweep: no nested tool_data embeds remain in any real read query.
- No SQL-side status filters remain on SELECTs.
- TypeScript: 0 errors.

## IMPORTANT — needs live verification (cannot run the real DB from here)
This is a strong, evidence-based diagnosis, but it must be confirmed on the
Vercel preview with a real older-user account (ideally Greg's):
  1. Log in as an affected user.
  2. Dashboard should now list their projects (not 0).
  3. Opening a project should load steps + tools without error.
  4. Running Analyze should work.
If projects are still missing after this deploys, the cause is data-side (the
rows themselves), not the query, and we would inspect the projects table for
those users' user_id / status values directly in Supabase.

## Deploy
git checkout develop
# extract zip over working tree
git add -A
git commit -m "fix: restore older users' access (remove RLS-tripping tool_data joins, keep NULL-status projects)"
git push origin develop
# verify on preview with an older-user account BEFORE merging to main
