// TypeScript enabled
// ── app/guided/page.tsx ───────────────────────────────────────────────────────
// VeSiMy Guided — 8-step lean onboarding for users new to process mapping
// "New to process mapping? Start here."
// Available on all plans including free trial.

import type { Metadata } from 'next'
import { createServerSupabase } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import GuidedFlow from './GuidedFlow'

export const metadata: Metadata = {
  title: 'VeSiMy Guided — Map Your First Process Step by Step',
  description: 'New to process mapping? VeSiMy Guided walks you through your first value stream map in 8 steps. Learn real lean methodology while doing real work. No experience needed.',
  keywords: ['process mapping guide', 'VSM tutorial', 'lean for beginners', 'value stream mapping walkthrough'],
}

export default async function GuidedPage() {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/signup?ref=guided')

  const { data: profile } = await supabase
    .from('profiles').select('*').eq('id', user.id).single()
  if (!profile) redirect('/auth/login')

  return <GuidedFlow userId={user.id} profile={profile} />
}
