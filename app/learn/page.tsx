// @ts-nocheck
import { redirect }             from 'next/navigation'
import { createServerSupabase } from '@/lib/supabase-server'
import { Sidebar }              from '@/components/layout/Sidebar'
import { BottomNav }            from '@/components/layout/BottomNav'
import { LearningCenter }       from '@/components/learn/LearningCenter'

export const metadata = { title: 'Learning Center — VeSiMy' }

export default async function LearnPage() {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  if (!profile) redirect('/auth/login')

  return (
    <div style={{ display:'flex', minHeight:'100vh', background:'var(--bg)' }}>
      <Sidebar profile={profile} />
      <main style={{ marginLeft: 240, flex:1, overflow:'hidden', minWidth:0 }}>
        <LearningCenter userId={user.id} />
      </main>
      <BottomNav />
    </div>
  )
}
