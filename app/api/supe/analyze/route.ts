// @ts-nocheck
import { NextResponse, type NextRequest } from 'next/server'
import { analyzeSteps } from '@/lib/supe-engine'
import { createServerSupabase } from '@/lib/supabase-server'

export const maxDuration = 60  // Vercel max execution time (seconds)

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabase()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const { project_id, steps, question, chat_history } = body

    if (!project_id) {
      return NextResponse.json({ error: 'project_id required' }, { status: 400 })
    }

    const safeSteps  = Array.isArray(steps) ? steps : []
    const recs       = analyzeSteps(safeSteps)
    const totalCT    = safeSteps.reduce((a, s) => a + (s.toolData?.stopwatch?.mean || s.cycle_time || 0), 0)
    const totalWait  = safeSteps.reduce((a, s) => a + (Number(s.wait_time) || 0), 0)
    const pce        = totalCT + totalWait > 0 ? ((totalCT / (totalCT + totalWait)) * 100).toFixed(1) : '0'
    const stepSummary = safeSteps.length
      ? safeSteps.map(s =>
          `• ${s.name}: CT=${s.cycle_time || s.toolData?.stopwatch?.mean || 0}s, Wait=${s.wait_time || 0}s, Ops=${s.operators || 1}, Defect=${s.defect_rate || 0}%, Uptime=${s.uptime || 100}%`
        ).join('\n')
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
      const systemPrompt = `You are Supe, a world-class lean manufacturing AI mentor built into VeSiMy. Precise, direct, practical — seasoned lean consultant tone, not a textbook.

PROCESS DATA:
${stepSummary}

PCE: ${pce}%
Issues detected: ${recs.map(r => `${r.severity.toUpperCase()} - ${r.principle} @ ${r.step_name || 'process'}`).join(', ') || 'none'}

Rules: tie advice to actual step data, use lean terms correctly, be specific with numbers, under 150 words unless calculation needed, no filler phrases.`

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
        let msg = responseText
        try { msg = JSON.parse(responseText)?.error?.message || responseText } catch {}
        answer = `Supe API error (${res.status}): ${msg.slice(0, 200)}`
      }
    } catch (e) {
      console.error('[supe] fetch failed:', e)
      answer = `Supe connection error: ${e?.message || 'Unknown'}. Check Vercel logs.`
    }

    return NextResponse.json({ recommendations: recs, insights, answer, issues_found: recs.length })
  } catch (e) {
    console.error('[supe/analyze] fatal:', e)
    return NextResponse.json({ error: `Analysis failed: ${e?.message}` }, { status: 500 })
  }
}
