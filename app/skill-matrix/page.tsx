// TypeScript enabled
// ── app/skill-matrix/page.tsx ─────────────────────────────────────────────────
// Team Skill Matrix, track lean improvement maturity
// Spec: Section 10, VeSiMy v4 Specification

import type { Metadata } from 'next'
import { createServerSupabase } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { Sidebar } from '@/components/layout/Sidebar'
import { BottomNav } from '@/components/layout/BottomNav'
import SkillMatrixClient from './SkillMatrixClient'

export const metadata: Metadata = {
  title: 'Skill Matrix, VeSiMy',
  description: 'Track your lean improvement maturity. See how your mapping speed, data quality, and tool usage are developing over time.',
}

export default async function SkillMatrixPage() {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const [{ data: profile }, { data: skillData }, { data: events }, { data: projects }] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase.from('skill_matrix').select('*').eq('user_id', user.id).single(),
    supabase.from('skill_matrix_events').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(20),
    supabase.from('projects').select('id, name, status, created_at, updated_at').eq('user_id', user.id).order('updated_at', { ascending: false }),
  ])

  if (!profile) redirect('/auth/login')

  // Keep legacy NULL-status projects; only hide archived/template.
  const visibleProjects = (projects || []).filter((p: any) => p.status !== 'archived' && p.status !== 'template')

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
      <Sidebar profile={profile} />
      <main style={{ marginLeft: 'var(--sidebar-w, 240px)', flex: 1, minWidth: 0, padding: 0 }}>
        <SkillMatrixClient
          profile={profile}
          skillData={skillData}
          events={events || []}
          projectCount={visibleProjects.length}
        />
      </main>
      <BottomNav />
    </div>
  )
}
