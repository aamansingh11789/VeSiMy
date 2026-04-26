// TypeScript enabled — @ts-nocheck removed as part of quality pass
// ── app/api/projects/seed-industry-reference/route.ts ─────────────────────────
// Seeds ONLY the reference project(s) for the calling user's specific industry.
// Previously used an internal fetch() to seed-all-references which failed on
// Vercel because NEXT_PUBLIC_SITE_URL was unset → fell back to localhost:3000.
// Now calls the POST handler directly as a module import — no HTTP hop.

import { createServerSupabase } from '@/lib/supabase-server'
import { NextResponse, type NextRequest } from 'next/server'
import { INDUSTRY_REFERENCE_NAMES } from '@/lib/industry-reference-map'
import { POST as seedAllPOST } from '@/app/api/projects/seed-all-references/route'

export const maxDuration = 60  // Vercel max execution time (seconds)

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

    // ── Call the seed handler directly — no internal HTTP fetch ──────────────
    // Build a synthetic Request that carries the session cookie and industryFilter.
    // This avoids the localhost:3000 fetch that breaks on Vercel serverless.
    const syntheticReq = new Request(
      'https://vesimy.internal/api/projects/seed-all-references',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'cookie': _req.headers.get('cookie') || '',
        },
        body: JSON.stringify({ industryFilter: industry }),
      }
    )
    await seedAllPOST(syntheticReq as unknown as NextRequest)

    // Fetch the newly created primary project
    const { data: projects } = await supabase
      .from('projects').select('id, name').eq('user_id', user.id)
      .in('name', refNames).order('created_at', { ascending: false }).limit(1)

    const primary = projects?.[0]
    return NextResponse.json({
      id: primary?.id || null, industry, refNames, seeded: refNames,
      message: primary
        ? `Reference project ready: ${primary.name}`
        : `Seeded for ${industry}`,
    })

  } catch (err: any) {
    console.error('[seed-industry-reference]', err)
    return NextResponse.json({ error: 'An error occurred. Please try again.' }, { status: 500 })
  }
}
