// @ts-nocheck
// ── app/project/[id]/page.tsx ─────────────────────────────────────────────────
// Routes to V1 ProjectClient or V2ProjectClient based on project.version.

import { createServerSupabase } from '@/lib/supabase-server'
import { redirect, notFound } from 'next/navigation'
import { Sidebar } from '@/components/layout/Sidebar'
import { BottomNav } from '@/components/layout/BottomNav'
import { ProjectClient } from './ProjectClient'
import { V2ProjectClient } from '@/components/v2/V2ProjectClient'

interface Props { params: { id: string } }

export async function generateMetadata({ params }: Props) {
  const supabase = await createServerSupabase()
  const { data } = await supabase.from('projects').select('name').eq('id', params.id).single()
  return { title: data?.name ? `${data.name} — VeSiMy` : 'Project — VeSiMy' }
}

export default async function ProjectPage({ params }: Props) {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const [{ data: profile }, { data: project, error }] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase.from('projects')
      .select(`*, steps(*, tool_data(*))`)
      .eq('id', params.id)
      .eq('user_id', user.id)
      .single(),
  ])

  if (!profile) redirect('/auth/login')
  if (error || !project) notFound()

  const steps = (project.steps || [])
    .sort((a: any, b: any) => (a.position ?? 0) - (b.position ?? 0))
    .map((step: any) => ({
      ...step,
      tasks: Array.isArray(step.tasks) ? step.tasks : [],
      missing_info_flags: Array.isArray(step.missing_info_flags) ? step.missing_info_flags : [],
      toolData: Object.fromEntries((step.tool_data || []).map((td: any) => [td.tool, td.data])),
      tool_data: undefined,
    }))

  const initialProject = { ...project, steps }
  const isV2 = project.version === 'v2'

  // ── V2 project — new builder ───────────────────────────────────────────────
  if (isV2) {
    return (
      <div style={{ display: 'flex', minHeight: '100dvh', background: 'var(--bg)' }}>
        <Sidebar profile={profile} collapsed />
        <main style={{ marginLeft: 'var(--sidebar-w, 56px)', flex: 1, minWidth: 0, overflow: 'hidden', height: '100dvh' }}>
          <V2ProjectClient project={initialProject} profile={profile} steps={steps} />
        </main>
      </div>
    )
  }

  // ── V1 project — existing builder ─────────────────────────────────────────
  return (
    <div style={{ display: 'flex', minHeight: '100dvh', background: 'var(--bg)' }}>
      <Sidebar profile={profile} />
      <main className="project-main" style={{ marginLeft: 'var(--sidebar-w, 240px)', flex: 1, minWidth: 0, minHeight: '100dvh', overflow: 'visible', position: 'relative' }}>
        <ProjectClient initialProject={initialProject} profile={profile} />
      </main>
      <BottomNav />
    </div>
  )
}
