// TypeScript enabled
import { redirect }             from 'next/navigation'
import { createServerSupabase } from '@/lib/supabase-server'
import { Sidebar }              from '@/components/layout/Sidebar'
import { BottomNav }            from '@/components/layout/BottomNav'
import { LearningCenter }       from '@/components/learn/LearningCenter'
import { IndustryWatermark }     from '@/components/ui/IndustryWatermark'
import { getWatermarkGroup }     from '@/lib/industry-reference-map'

export const metadata = { title: 'Learning Center — VeSiMy' }

export default async function LearnPage() {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  if (!profile) redirect('/auth/login')

  const wgroup = getWatermarkGroup((profile as any).industry || '')

  return (
    <div style={{ display:'flex', minHeight:'100vh', background:'var(--bg)', position:'relative' }}>
      <Sidebar profile={profile} />
      <IndustryWatermark group={wgroup} />
      <main style={{ marginLeft: 'var(--sidebar-w, 240px)', flex:1, overflow:'hidden', minWidth:0, position:'relative', zIndex:1 }}>
        <LearningCenter userId={user.id} />
      </main>
      <BottomNav />
    </div>
  )
}
