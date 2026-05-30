// TypeScript enabled, @ts-nocheck removed as part of quality pass
import { NextResponse, type NextRequest } from 'next/server'
import { analyzeSteps } from '@/lib/supe-engine'
import { createServerSupabase } from '@/lib/supabase-server'
import { buildSupeSystemPrompt } from '@/lib/supe-knowledge'

export const maxDuration = 60  // Vercel max execution time (seconds)

// ── DB-backed rate limiter, works across all serverless instances ────────────
// Replaces the broken in-memory Map which reset on every cold start and was
// not shared across concurrent Vercel function instances.
// In-memory per-process fallback rate limiter, used only when the DB table is absent.
// Resets on cold start (acceptable degradation); DB table is the production path.
const fallbackCounts = new Map<string, { count: number; window: number }>()

// Uses Supabase to count requests per user per minute window.
async function checkRateLimit(supabase: any, userId: string): Promise<boolean> {
  const windowStart = new Date(Date.now() - 60_000).toISOString()
  try {
    const { count, error } = await supabase
      .from('supe_rate_log')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .gte('created_at', windowStart)

    if (error) throw error   // fall through to in-memory path

    if ((count ?? 0) >= 20) return false
    await supabase.from('supe_rate_log').insert({ user_id: userId })
    return true
  } catch {
    // supe_rate_log table missing, apply in-memory rate limit as fallback.
    // This prevents unlimited access during schema migration gaps.
    console.warn('[supe] rate limit table not found, using in-memory fallback (run migration)')
    const now  = Date.now()
    const slot = fallbackCounts.get(userId)
    if (slot && now - slot.window < 60_000) {
      if (slot.count >= 10) return false   // tighter limit without DB persistence
      slot.count++
    } else {
      fallbackCounts.set(userId, { count: 1, window: now })
    }
    return true
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabase()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    if (!(await checkRateLimit(supabase, user.id))) {
      return NextResponse.json({ error: 'Too many requests. Please wait a moment.' }, { status: 429 })
    }

    // Verify paid plan, uses requirePlan for consistent beta_expires_at check
    const { requirePlan } = await import('@/lib/require-plan')
    const planBlock = await requirePlan(supabase, user, ['pro', 'lifetime', 'enterprise', 'trialing'])
    if (planBlock) {
      return NextResponse.json({
        recommendations: [], insights: [], issues_found: 0,
        answer: 'Supe AI is a Pro feature. Upgrade to Pro to unlock AI-powered process analysis.',
      })
    }

    const body = await request.json()
    const { project_id, steps, question, chat_history, industry, project_name } = body

    if (!project_id) {
      return NextResponse.json({ error: 'project_id required' }, { status: 400 })
    }

    const safeSteps  = Array.isArray(steps) ? steps : []
    const recs       = analyzeSteps(safeSteps)

    // Unit-normalised CT: ctSeconds() converts stopwatch.mean (ms) → seconds
    // and handles cycle_time_unit (minutes/hours/days) correctly.
    function stepCT(s: any): number {
      const swMean = s.toolData?.stopwatch?.mean
      if (swMean && swMean > 0) return swMean / 1000   // ms → seconds
      const unit = s.cycle_time_unit || 'seconds'
      const multipliers: Record<string, number> = { seconds: 1, minutes: 60, hours: 3600, days: 86400 }
      return (Number(s.cycle_time) || 0) * (multipliers[unit] || 1)
    }

    const mainSteps  = safeSteps.filter((s: any) => s.is_main_flow !== false)
    const totalCT    = mainSteps.reduce((a: number, s: any) => a + stepCT(s), 0)
    const totalWait  = mainSteps.reduce((a: number, s: any) => a + (Number(s.wait_time) || 0), 0)
    const pce        = totalCT + totalWait > 0 ? ((totalCT / (totalCT + totalWait)) * 100).toFixed(1) : '0'
    const stepSummary = safeSteps.length
      ? safeSteps.map((s: any) => {
          const ct = stepCT(s)
          const vaLabel = s.va_type === 'va' ? 'VA' : s.va_type === 'nva' ? 'NVA' : s.va_type === 'nnva' ? 'NNVA' : 'unclassified'
          const tools = Object.keys(s.toolData || {}).filter((k: string) => k !== 'stopwatch').join(',')
          const waste = (s.toolData?.waste?.selected || []).join(',')
          return `• ${s.name} [${vaLabel}]: CT=${ct.toFixed(1)}s, Wait=${s.wait_time||0}s, Ops=${s.operators||1}, Defect=${s.defect_rate||0}%, Uptime=${s.uptime||100}%, Setup=${(s as any).setup_time||0}s, WIP=${s.wip||0}${tools ? `, tools=[${tools}]` : ''}${waste ? `, wastes=[${waste}]` : ''}`
        }).join('\n')
      : 'No steps added yet, user is exploring in demo mode.'

    let answer   = ''
    let insights = []
    let apiError = ''

    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      console.error('[supe] ANTHROPIC_API_KEY missing from environment')
      return NextResponse.json({
        recommendations: recs, insights: [], issues_found: recs.length,
        answer: 'Supe is not configured, ANTHROPIC_API_KEY is missing from Vercel environment variables.',
      })
    }

    try {
      // Build rich system prompt from RAG knowledge base + industry context
      // Pull live project data for richer context
      const { data: liveProject } = await supabase.from('projects')
        .select('name,description,industry,state,status,kaizen_roadmap')
        .eq('id', project_id).single()

      // Fix S-1: re-compute PCE as VA-aware using canonical library
      // (the earlier pce variable used all-CT / leadTime, not VA-only)
      const vaSteps   = safeSteps.filter((s: any) => s.va_type === 'va' || s.is_value_added === 'va')
      const vaCT      = vaSteps.reduce((a: number, s: any) => a + stepCT(s), 0)
      const canonPCE  = totalCT + totalWait > 0 && vaCT > 0
        ? ((vaCT / (totalCT + totalWait)) * 100).toFixed(1)
        : vaSteps.length === 0
          ? `${pce} (unclassified, assign VA/NNVA/NVA types for accuracy)`
          : '0'

      const systemPrompt = buildSupeSystemPrompt({
        industryKey:   industry || liveProject?.industry || null,
        projectName:   project_name || liveProject?.name || undefined,
        stepContext:   `PCE: ${canonPCE}% | Issues: ${recs.map(r => `${r.severity.toUpperCase()} ${r.principle} @ ${r.step_name || 'process'}`).join(', ') || 'none'}`,
      }) + `

PROCESS DATA:
${stepSummary}

Rules: tie advice to actual step data, be specific with numbers, under 150 words unless calculation needed, no filler phrases.`

      // Fix Sec-1: Sanitize chat_history, only allow 'user' and 'assistant' roles.
      // This prevents prompt injection via crafted system-role messages from the client.
      const SAFE_ROLES = new Set(['user', 'assistant'])
      const safeHistory = (chat_history || [])
        .filter((m: any) => m && typeof m.content === 'string' && SAFE_ROLES.has(m.role))
        .map((m: any) => ({ role: m.role as 'user' | 'assistant', content: String(m.content).slice(0, 4000) }))

      const messages = question
        ? [...safeHistory, { role: 'user' as const, content: String(question).slice(0, 2000) }]
        : [{ role: 'user', content: 'Give me 3 specific actionable lean insights for this process. Use actual step names and numbers. Be direct.' }]

      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({ model: 'claude-haiku-4-5-20251001', max_tokens: 500, system: systemPrompt, messages }),
      })

      const responseText = await res.text()

      if (res.ok) {
        let d
        try { d = JSON.parse(responseText) } catch { d = {} }
        const text = d.content?.[0]?.text || ''
        if (question) {
          answer = text.trim() || 'No response, please try again.'
        } else {
          insights = text.split('\n').filter(l => l.trim()).slice(0, 5)
          answer = text.trim()
        }
      } else {
        console.error('[supe] API error', res.status, responseText.slice(0, 500))
        answer = "Supe is temporarily unavailable. Please try again in a moment."
      }
    } catch (e) {
      console.error('[supe] fetch failed:', e)
      answer = "Supe is temporarily unavailable. Please try again in a moment."
    }

    return NextResponse.json({ recommendations: recs, insights, answer, issues_found: recs.length })
  } catch (e) {
    console.error('[supe/analyze] fatal:', e)
    return NextResponse.json({ error: `Analysis failed: ${e?.message}` }, { status: 500 })
  }
}
