// TypeScript enabled
// ── app/dashboard/page.tsx ─────────────────────────────────────────────────
import { createServerSupabase } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { Sidebar }    from '@/components/layout/Sidebar'
import { BottomNav }  from '@/components/layout/BottomNav'
import { DashboardClient } from './DashboardClient'
import { IndustryWatermark } from '@/components/ui/IndustryWatermark'
import { VersionBanner } from '@/components/ui/VersionBanner'
import { getWatermarkGroup } from '@/lib/industry-reference-map'

export const metadata = { title: 'Dashboard — VeSiMy' }

export default async function DashboardPage() {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const [{ data: profile }, { data: rawProjects }] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase.from('projects')
      .select(`
        *,
        steps(
          id, cycle_time, cycle_time_unit, wait_time,
          is_main_flow, va_type, defect_rate,
          tool_data(tool, data)
        )
      `)
      .eq('user_id', user.id)
      .eq('status', 'active')
      .order('updated_at', { ascending: false })
      .limit(20),
  ])

  if (!profile) redirect('/auth/login')

  // Hydrate toolData on each step so getProjectScore can read stopwatch.mean
  const projects = (rawProjects || []).map((p: any) => ({
    ...p,
    steps: (p.steps || []).map((s: any) => ({
      ...s,
      toolData: Object.fromEntries(
        (s.tool_data || []).map((td: any) => [td.tool, td.data])
      ),
      tool_data: undefined,
    })),
  }))

  // Gate: only send genuinely new users to onboarding.
  // Existing users who already have an industry set are considered onboarded
  // even if the column was added after they signed up (onboarded defaults false).
  const isNewUser = !(profile as any).onboarded && !(profile as any).industry
  if (isNewUser) redirect('/onboarding')

  const wgroup = getWatermarkGroup((profile as any).industry || '')

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)', position: 'relative' }}>
      <VersionBanner />
      <Sidebar profile={profile} />
      <IndustryWatermark group={wgroup} />
      <main style={{ marginLeft: 'var(--sidebar-w, 240px)', flex: 1, padding: 28, minWidth: 0, position: 'relative', zIndex: 1 }}>
        <DashboardClient profile={profile} initialProjects={projects || []} />
      </main>
      <BottomNav />
    </div>
  )
}
