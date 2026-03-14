// @ts-nocheck
// ── app/dashboard/page.tsx ─────────────────────────────────────────────────
import { createServerSupabase } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { Sidebar }    from '@/components/layout/Sidebar'
import { BottomNav }  from '@/components/layout/BottomNav'
import { DashboardClient } from './DashboardClient'

export const metadata = { title: 'Dashboard' }

export default async function DashboardPage() {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const [{ data: profile }, { data: projects }] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase.from('projects').select('*').eq('user_id', user.id)
             .eq('status', 'active').order('updated_at', { ascending: false }).limit(20),
  ])

  if (!profile) redirect('/auth/login')

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
      <Sidebar profile={profile} />
      <main style={{ marginLeft: 240, flex: 1, padding: 28, minWidth: 0 }}>
        <DashboardClient profile={profile} initialProjects={projects || []} />
      </main>
      <BottomNav />
    </div>
  )
}
