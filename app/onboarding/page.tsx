// @ts-nocheck
import { redirect } from 'next/navigation'
import { createServerSupabase } from '@/lib/supabase-server'

export const metadata = { title: 'Welcome to VeSiMy' }

export default async function OnboardingPage() {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  // Mark user as onboarded immediately — no wizard
  await supabase.from('profiles')
    .update({ onboarded: true })
    .eq('id', user.id)

  // Go straight to dashboard
  redirect('/dashboard')
}
