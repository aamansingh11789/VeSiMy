// TypeScript enabled
import { redirect } from 'next/navigation'
import { createServerSupabase } from '@/lib/supabase-server'
import { OnboardingClient } from './OnboardingClient'

export const metadata = { title: 'Welcome to VeSiMy — Get Set Up' }

export default async function OnboardingPage() {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles').select('*').eq('id', user.id).single()
  if (!profile) redirect('/auth/login')

  // If already onboarded, go to dashboard
  if (profile.onboarded) redirect('/dashboard')

  return <OnboardingClient profile={profile} />
}
