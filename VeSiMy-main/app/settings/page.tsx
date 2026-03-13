// @ts-nocheck
// ── app/settings/page.tsx ────────────────────────────────────────────────────
import { createServerSupabase } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { Sidebar } from '@/components/layout/Sidebar'
import { BottomNav } from '@/components/layout/BottomNav'
import { SettingsClient } from './SettingsClient'

export const metadata = { title: 'Settings — Vesimy' }

export default async function SettingsPage() {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()

  return (
    <div style={{ display:'flex', minHeight:'100vh', background:'var(--bg)' }}>
      <Sidebar profile={profile} />
      <main style={{ marginLeft: 240, flex:1, minWidth:0 }} className="settings-main">
        <div style={{ maxWidth:760, padding:'32px 40px' }} className="settings-inner">
          <SettingsClient profile={profile} user={{ email: user.email }} />
        </div>
      </main>
      <BottomNav />
    </div>
  )
}
