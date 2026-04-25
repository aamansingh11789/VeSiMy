// TypeScript enabled
// ── app/project/[id]/history/page.tsx ─────────────────────────────────────────
// Version history for a project — view and compare saved snapshots
// Spec: Section 9 — Versioning and Journal

import type { Metadata } from 'next'
import { createServerSupabase } from '@/lib/supabase-server'
import { redirect, notFound } from 'next/navigation'
import { Sidebar } from '@/components/layout/Sidebar'
import { BottomNav } from '@/components/layout/BottomNav'
import VersionHistoryClient from './VersionHistoryClient'

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  return { title: 'Version History — VeSiMy' }
}

export default async function VersionHistoryPage({ params }: { params: { id: string } }) {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const [{ data: profile }, { data: project }, { data: snapshots }] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase.from('projects').select('id, name, created_at, updated_at').eq('id', params.id).eq('user_id', user.id).single(),
    supabase.from('version_snapshots').select('*').eq('project_id', params.id).eq('user_id', user.id).order('version_number', { ascending: false }),
  ])

  if (!profile) redirect('/auth/login')
  if (!project) notFound()

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
      <Sidebar profile={profile} />
      <main style={{ marginLeft: 'var(--sidebar-w, 240px)', flex: 1, minWidth: 0 }}>
        <VersionHistoryClient project={project} snapshots={snapshots || []} isPaid={['pro','lifetime','enterprise'].includes(profile.plan_tier)} />
      </main>
      <BottomNav />
    </div>
  )
}
