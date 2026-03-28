// @ts-nocheck
// ── app/api/projects/seed-industry-reference/route.ts ─────────────────────────
// Seeds ONLY the reference project(s) for the calling user's specific industry.
// Passes an industryFilter to seed-all-references so no other industry's projects
// are ever created in this user's account.
// Called from onboarding finish() and dashboard first-visit.
// Idempotent — safe to call multiple times.

import { createServerSupabase } from '@/lib/supabase-server'
import { NextResponse, type NextRequest } from 'next/server'
import { INDUSTRY_REFERENCE_NAMES } from '@/lib/industry-reference-map'

export async function POST(_req: NextRequest) {
  try {
    const supabase = await createServerSupabase()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data: profile } = await supabase
      .from('profiles').select('industry').eq('id', user.id).single()

    const industry: string = profile?.industry || ''
    const refNames: string[] = (INDUSTRY_REFERENCE_NAMES as any)[industry] || []

    if (!refNames.length) {
      return NextResponse.json({
        id: null, seeded: [], industry,
        message: `No reference project defined for industry: ${industry || 'unknown'}`,
      })
    }

    // Check if already seeded
    const { data: existing } = await supabase
      .from('projects').select('id, name')
      .eq('user_id', user.id).in('name', refNames)

    if (existing && existing.length >= refNames.length) {
      return NextResponse.json({
        id: existing[0]?.id || null,
        industry, already_exists: true,
        message: `Reference project already loaded for ${industry}`,
      })
    }

    // Seed ONLY this industry — pass filter to seed-all-references
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    await fetch(`${siteUrl}/api/projects/seed-all-references`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', cookie: _req.headers.get('cookie') || '' },
      body: JSON.stringify({ industryFilter: industry }),
    })

    const { data: projects } = await supabase
      .from('projects').select('id, name').eq('user_id', user.id)
      .in('name', refNames).order('created_at', { ascending: false }).limit(1)

    const primary = projects?.[0]
    return NextResponse.json({
      id: primary?.id || null, industry, refNames, seeded: refNames,
      message: primary ? `Reference project ready: ${primary.name}` : `Seeded for ${industry}`,
    })

  } catch (err: any) {
    console.error('[seed-industry-reference]', err)
    return NextResponse.json({ error: err?.message || 'Failed' }, { status: 500 })
  }
}
