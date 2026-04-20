// TypeScript enabled
// ── app/dashboard/page.tsx ─────────────────────────────────────────────────
import { createServerSupabase } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { Sidebar }    from '@/components/layout/Sidebar'
import { BottomNav }  from '@/components/layout/BottomNav'
import { DashboardClient } from './DashboardClient'
import { IndustryWatermark } from '@/components/ui/IndustryWatermark'
import { getWatermarkGroup } from '@/lib/industry-reference-map'

export const metadata = { title: 'Dashboard — VeSiMy' }

export default async function DashboardPage() {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const [{ data: profile }, { data: rawProjects }] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase.from('projects')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .order('updated_at', { ascending: false })
      .limit(20),
  ])

  if (!profile) redirect('/auth/login')

  // No steps join — avoids RLS conflicts on nested tables.
  // Project cards on dashboard use project-level metadata only.
  const projects = (rawProjects || []).map((p: any) => ({ ...p, steps: [] }))

  // Gate: only send genuinely new users to onboarding.
  // Existing users who already have an industry set are considered onboarded
  // even if the column was added after they signed up (onboarded defaults false).
  const isNewUser = !(profile as any).onboarded && !(profile as any).industry
  if (isNewUser) redirect('/onboarding')

  const wgroup = getWatermarkGroup((profile as any).industry || '')

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)', position: 'relative' }}>
      <Sidebar profile={profile} />
      <IndustryWatermark group={wgroup} />
      <main style={{ marginLeft: 'var(--sidebar-w, 240px)', flex: 1, padding: 28, minWidth: 0, position: 'relative', zIndex: 1 }}>
        <DashboardClient profile={profile} initialProjects={projects || []} />
      </main>
      <BottomNav />
    </div>
  )
}
