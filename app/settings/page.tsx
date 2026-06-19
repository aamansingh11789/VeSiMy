// TypeScript enabled
// ── app/settings/page.tsx ────────────────────────────────────────────────────
import { createServerSupabase } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { Sidebar } from '@/components/layout/Sidebar'
import { BottomNav } from '@/components/layout/BottomNav'
import { SettingsClient } from './SettingsClient'

export const metadata = { title: 'Settings, VeSiMy' }

export default async function SettingsPage() {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const [{ data: profile }, { data: projRows }] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase.from('projects').select('id, status').eq('user_id', user.id),
  ])
  // Count visible projects in JS so legacy NULL-status projects are included.
  const projectCount = (projRows || []).filter((p: any) => p.status !== 'archived' && p.status !== 'template').length

  return (
    <div style={{ display:'flex', minHeight:'100vh', background:'var(--bg)' }}>
      <Sidebar profile={profile} />
      <main style={{ marginLeft: 'var(--sidebar-w, 240px)', flex:1, minWidth:0 }} className="settings-main">
        <div style={{ maxWidth:760, padding:'32px 40px' }} className="settings-inner">
          <SettingsClient profile={profile} user={{ email: user.email }} projectCount={projectCount || 0} />
        </div>
      </main>
      <BottomNav />
    </div>
  )
}
