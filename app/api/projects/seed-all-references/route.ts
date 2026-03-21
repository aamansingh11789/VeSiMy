// @ts-nocheck
// ── app/api/projects/seed-all-references/route.ts ─────────────────────────────
// Seeds all 5 industry reference projects in parallel for the current user.
// Idempotent — each individual seed checks if it already exists.
// Returns the manufacturing project ID so the dashboard can navigate there.

import { createServerSupabase } from '@/lib/supabase-server'
import { NextResponse, type NextRequest } from 'next/server'

const SEEDS = [
  '/api/projects/seed-reference',    // Manufacturing — Automotive Seat Assembly
  '/api/projects/seed-healthcare',   // Healthcare — Urgent Care Patient Flow
  '/api/projects/seed-realestate',   // Real Estate — Transaction Flow
  '/api/projects/seed-brewery',      // Craft Brewery — Batch Production
  '/api/projects/seed-winery',       // Winery — Boutique Wine Production
]

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabase()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    // Fire all seeds in parallel — each is idempotent
    const base = request.nextUrl.origin
    const results = await Promise.allSettled(
      SEEDS.map(path =>
        fetch(`${base}${path}`, {
          method: 'POST',
          headers: { cookie: request.headers.get('cookie') || '' },
        }).then(r => r.json())
      )
    )

    // Collect outcomes
    const seeded: string[] = []
    const existing: string[] = []
    let primaryId: string | null = null

    const labels = [
      '🏭 Manufacturing',
      '🏥 Healthcare',
      '🏠 Real Estate',
      '🍺 Craft Brewery',
      '🍷 Winery',
    ]

    results.forEach((r, i) => {
      if (r.status === 'fulfilled' && r.value?.id) {
        if (i === 0) primaryId = r.value.id  // Manufacturing is the one we navigate to
        if (r.value.already_exists) existing.push(labels[i])
        else seeded.push(labels[i])
      }
    })

    const allExisted = seeded.length === 0
    const count = seeded.length

    return NextResponse.json({
      id: primaryId,
      seeded,
      existing,
      already_exists: allExisted,
      message: allExisted
        ? 'All reference projects already in your dashboard'
        : `${count} reference project${count !== 1 ? 's' : ''} added: ${seeded.join(', ')}`,
    })

  } catch (err: any) {
    console.error('[seed-all-references]', err)
    return NextResponse.json(
      { error: err?.message || 'Failed to seed reference projects' },
      { status: 500 }
    )
  }
}
