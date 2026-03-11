// @ts-nocheck
// ── app/project/[id]/page.tsx ────────────────────────────────────────────────
import { createServerSupabase } from '@/lib/supabase-server'
import { redirect, notFound } from 'next/navigation'
import { Sidebar } from '@/components/layout/Sidebar'
import { BottomNav } from '@/components/layout/BottomNav'
import { ProjectClient } from './ProjectClient'

interface Props {
  params: { id: string }
}

export async function generateMetadata({ params }: Props) {
  const supabase = await createServerSupabase()
  const { data } = await supabase
    .from('projects')
    .select('name')
    .eq('id', params.id)
    .single()

  return {
    title: data?.name ? `${data.name} — Vesimy` : 'Project — Vesimy',
  }
}

export default async function ProjectPage({ params }: Props) {
  const supabase = await createServerSupabase()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  const [{ data: profile }, { data: project, error }] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase
      .from('projects')
      .select(`
        *,
        steps (
          *,
          tool_data (*)
        )
      `)
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
      toolData: Object.fromEntries(
        (step.tool_data || []).map((td: any) => [td.tool, td.data])
      ),
      tool_data: undefined,
    }))

  const initialProject = { ...project, steps }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#03030D' }}>
      <Sidebar profile={profile} />
      <main
        style={{ marginLeft: 240, flex: 1, minWidth: 0, overflow: 'hidden' }}
        className="project-main"
      >
        <ProjectClient initialProject={initialProject} profile={profile} />
      </main>
      <BottomNav />
    </div>
  )
}