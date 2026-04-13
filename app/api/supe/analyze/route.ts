// @ts-nocheck
import { NextResponse, type NextRequest } from 'next/server'
import { analyzeSteps } from '@/lib/supe-engine'
import { createServerSupabase } from '@/lib/supabase-server'
import { buildSupeSystemPrompt } from '@/lib/supe-knowledge'

export const maxDuration = 60  // Vercel max execution time (seconds)

// ── Simple in-memory rate limiter — 20 requests per user per minute ──────────
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()
function checkRateLimit(userId: string): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(userId)
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(userId, { count: 1, resetAt: now + 60_000 })
    return true
  }
  if (entry.count >= 20) return false
  entry.count++
  return true
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabase()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    if (!checkRateLimit(user.id)) {
      return NextResponse.json({ error: 'Too many requests. Please wait a moment.' }, { status: 429 })
    }

    // Verify paid plan (Supe AI is a Pro feature)
    const { data: supeProfile } = await supabase.from('profiles')
      .select('plan_tier, lifetime_access, is_beta').eq('id', user.id).single()
    const supeIsPaid = ['pro','lifetime','enterprise'].includes(supeProfile?.plan_tier) ||
      supeProfile?.lifetime_access || supeProfile?.is_beta
    if (!supeIsPaid) {
      return NextResponse.json({
        recommendations: [], insights: [], issues_found: 0,
        answer: 'Supe AI is a Pro feature. Upgrade to unlock AI-powered process analysis.',
      })
    }

    const body = await request.json()
    const { project_id, steps, question, chat_history, industry, project_name } = body

    if (!project_id) {
      return NextResponse.json({ error: 'project_id required' }, { status: 400 })
    }

    const safeSteps  = Array.isArray(steps) ? steps : []
    const recs       = analyzeSteps(safeSteps)
    const totalCT    = safeSteps.reduce((a, s) => a + (s.toolData?.stopwatch?.mean || s.cycle_time || 0), 0)
    const totalWait  = safeSteps.reduce((a, s) => a + (Number(s.wait_time) || 0), 0)
    const pce        = totalCT + totalWait > 0 ? ((totalCT / (totalCT + totalWait)) * 100).toFixed(1) : '0'
    const stepSummary = safeSteps.length
      ? safeSteps.map(s => {
          const ct = s.toolData?.stopwatch?.mean || s.cycle_time || 0
          const vaLabel = s.va_type === 'va' ? 'VA' : s.va_type === 'nva' ? 'NVA' : s.va_type === 'nnva' ? 'NNVA' : 'unclassified'
          const tools = Object.keys(s.toolData || {}).filter(k => k !== 'stopwatch').join(',')
          const waste = (s.toolData?.waste?.selected || []).join(',')
          return `• ${s.name} [${vaLabel}]: CT=${ct}s, Wait=${s.wait_time||0}s, Ops=${s.operators||1}, Defect=${s.defect_rate||0}%, Uptime=${s.uptime||100}%, Setup=${(s as any).setup_time||0}s, WIP=${s.wip||0}${tools ? `, tools=[${tools}]` : ''}${waste ? `, wastes=[${waste}]` : ''}`
        }).join('\n')
      : 'No steps added yet — user is exploring in demo mode.'

    let answer   = ''
    let insights = []
    let apiError = ''

    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      console.error('[supe] ANTHROPIC_API_KEY missing from environment')
      return NextResponse.json({
        recommendations: recs, insights: [], issues_found: recs.length,
        answer: 'Supe is not configured — ANTHROPIC_API_KEY is missing from Vercel environment variables.',
      })
    }

    try {
      // Build rich system prompt from RAG knowledge base + industry context
      // Pull live project data for richer context
      const { data: liveProject } = await supabase.from('projects')
        .select('name,description,industry,state,status,kaizen_roadmap')
        .eq('id', project_id).single()

      const systemPrompt = buildSupeSystemPrompt({
        industryKey:   industry || liveProject?.industry || null,
        projectName:   project_name || liveProject?.name || undefined,
        stepContext:   `PCE: ${pce}% | Issues: ${recs.map(r => `${r.severity.toUpperCase()} ${r.principle} @ ${r.step_name || 'process'}`).join(', ') || 'none'}`,
      }) + `

PROCESS DATA:
${stepSummary}

Rules: tie advice to actual step data, be specific with numbers, under 150 words unless calculation needed, no filler phrases.`

      const messages = question
        ? [...(chat_history || []).map(m => ({ role: m.role, content: m.content })), { role: 'user', content: question }]
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
          answer = text.trim() || 'No response — please try again.'
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
