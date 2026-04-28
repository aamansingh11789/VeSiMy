// TypeScript enabled
// ── app/api/tier0/generate-report/route.ts ────────────────────────────────
// Tier 0 — no-account free process mapping report
// POST /api/tier0/generate-report
// Rate limit: 1 report per email per 24 hours
// Stores session in tier0_sessions, emails report via Sender API

import { NextResponse, type NextRequest } from 'next/server'
import { createAdminClient } from '@/lib/supabase-admin'

export const maxDuration = 60

// ── Types ──────────────────────────────────────────────────────────────────

interface Step {
  label: string
  time_seconds: number | null
}

interface Tier0Request {
  email: string
  firstName?: string
  industry: string
  processName: string
  steps: Step[]
  painStep?: number | null
  painDescription?: string
  targetCategory?: string
}

interface ReportOutput {
  summary: string
  totalTimeSeconds: number
  vaTimeSeconds: number
  nvaTimeSeconds: number
  pcePct: number
  wasteType: string
  wasteExplanation: string
  bottleneckStep: string
  firstAction: string
  leanConcept: string
  leanConceptExplanation: string
}

// ── Industry VA ratio table ────────────────────────────────────────────────
// Typical value-added % for each industry segment (lean literature benchmarks)
// Used when no step times are provided to set a realistic PCE baseline

const INDUSTRY_VA_RATIOS: Record<string, number> = {
  'Automotive':              0.22,
  'Aerospace':               0.18,
  'Food & Bev Mfg':         0.20,
  'Pharma':                  0.15,
  'Medical Devices':         0.16,
  'Electronics':             0.21,
  'Hospital / ED':           0.12,
  'Surgery / OR':            0.30,
  'Primary Care':            0.25,
  'Pharmacy':                0.20,
  'Software Dev':            0.35,
  'IT Operations':           0.30,
  'Retail Banking':          0.18,
  'Insurance':               0.15,
  'Law Firm':                0.20,
  'Restaurant':              0.40,
  'Craft Brewery':           0.22,
  'Winery':                  0.20,
  'Construction':            0.25,
  'default':                 0.28,
}

function getVaRatio(industry: string): number {
  return INDUSTRY_VA_RATIOS[industry] ?? INDUSTRY_VA_RATIOS.default
}

// ── Prompt builder ─────────────────────────────────────────────────────────

function buildPrompt(data: Tier0Request): string {
  const stepsText = data.steps.map((s, i) => {
    const timeLabel = s.time_seconds != null
      ? `${Math.round(s.time_seconds / 60 * 10) / 10} min`
      : 'time not measured'
    const isPain = data.painStep === i ? ' ← FLAGGED AS PAIN POINT' : ''
    return `  ${i + 1}. ${s.label} (${timeLabel})${isPain}`
  }).join('\n')

  const painNote = data.painDescription
    ? `\nThe user described this pain: "${data.painDescription}"`
    : ''

  const targetNote = data.targetCategory
    ? `\nImprovement target: ${data.targetCategory}`
    : ''

  return `You are a lean manufacturing expert with 15+ years on the floor. Analyze this process and return a lean report as JSON.

Industry: ${data.industry}
Process: ${data.processName}
${targetNote}

Process steps:
${stepsText}
${painNote}

Return ONLY valid JSON with this exact structure:
{
  "summary": "2-3 sentence plain-language summary of what this process does and where the waste is",
  "totalTimeSeconds": <number — sum of all step times, or estimated if not provided>,
  "vaTimeSeconds": <number — estimated value-added seconds>,
  "nvaTimeSeconds": <number — estimated non-value-added seconds>,
  "pcePct": <number — process cycle efficiency as a percentage, e.g. 18.4>,
  "wasteType": "<one of: Waiting | Overprocessing | Motion | Transport | Defects | Overproduction | Inventory | Underutilized talent>",
  "wasteExplanation": "1-2 sentences explaining where this waste type is most visible in this specific process",
  "bottleneckStep": "<name of the step most likely constraining flow — must match a step name above>",
  "firstAction": "One specific, concrete action the team can take this week. Not generic advice. Make it actionable for this specific process and industry.",
  "leanConcept": "<one lean concept most relevant to this process: e.g. Takt Time, 5S, SMED, Kanban, Poka-yoke, Standard Work, PDCA, 5 Whys>",
  "leanConceptExplanation": "1 sentence explaining why this concept applies to this specific process"
}

Rules:
- Be specific to this process and industry. No generic lean advice.
- The firstAction must be something the team can do this week with no capital budget.
- If step times are missing, estimate based on industry benchmarks.
- Return ONLY the JSON object. No preamble, no explanation, no markdown.`
}

// ── Fallback report when AI call fails ────────────────────────────────────

function buildFallbackReport(data: Tier0Request): ReportOutput {
  const vaRatio    = getVaRatio(data.industry)
  const totalSteps = data.steps.length || 5
  const totalSecs  = data.steps.reduce((sum, s) => sum + (s.time_seconds ?? 600), 0)
  const vaSecs     = Math.round(totalSecs * vaRatio)
  const nvaSecs    = totalSecs - vaSecs
  const pce        = Math.round(vaRatio * 100 * 10) / 10

  return {
    summary:              `Your ${data.processName} process has ${totalSteps} steps with an estimated process cycle efficiency of ${pce}%. Most of the lead time is non-value-added time sitting between steps.`,
    totalTimeSeconds:     totalSecs,
    vaTimeSeconds:        vaSecs,
    nvaTimeSeconds:       nvaSecs,
    pcePct:               pce,
    wasteType:            'Waiting',
    wasteExplanation:     `Queue time between steps is the most common source of waste in ${data.industry} processes and likely accounts for most of your total lead time.`,
    bottleneckStep:       data.steps[data.painStep ?? Math.floor(totalSteps / 2)]?.label ?? data.steps[0]?.label ?? 'Middle step',
    firstAction:          `Time each step individually using a stopwatch and record the actual wait time between steps. The ratio of wait time to active time will show you exactly where to focus.`,
    leanConcept:          'Process Cycle Efficiency',
    leanConceptExplanation: `PCE measures how much of your total lead time is actually value-adding — in ${data.industry}, world-class is typically 15–30%.`,
  }
}

// ── Email delivery ─────────────────────────────────────────────────────────

async function sendReportEmail(
  email: string,
  firstName: string | undefined,
  processName: string,
  report: ReportOutput,
  sessionId: string,
): Promise<void> {
  const apiKey = process.env.SENDER_API_KEY
  if (!apiKey) {
    console.warn('[tier0/email] SENDER_API_KEY not set — skipping email')
    return
  }

  const name    = firstName ?? 'there'
  const minutes = Math.round(report.totalTimeSeconds / 60)
  const vaMins  = Math.round(report.vaTimeSeconds / 60)

  const htmlBody = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="background:#F3F3F3;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;margin:0;padding:40px 20px">
  <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #E5E5E5">

    <div style="background:#032D60;padding:28px 32px">
      <div style="color:#fff;font-size:20px;font-weight:700;letter-spacing:-0.3px">VeSiMy</div>
      <div style="color:#8ec5e8;font-size:13px;margin-top:4px">Lean Analysis Report</div>
    </div>

    <div style="padding:32px">
      <p style="color:#181818;font-size:16px;margin:0 0 8px">Hi ${name},</p>
      <p style="color:#3E3E3C;font-size:15px;line-height:1.6;margin:0 0 24px">
        Here is the lean analysis for your <strong>${processName}</strong> process.
      </p>

      <div style="background:#F8F8F8;border-radius:8px;padding:20px;margin-bottom:24px">
        <p style="color:#181818;font-size:14px;font-weight:600;margin:0 0 12px;text-transform:uppercase;letter-spacing:0.06em">Summary</p>
        <p style="color:#3E3E3C;font-size:15px;line-height:1.6;margin:0">${report.summary}</p>
      </div>

      <div style="display:grid;gap:12px;margin-bottom:24px">
        <div style="background:#F3F3F3;border-radius:8px;padding:16px;display:flex;justify-content:space-between;align-items:center">
          <span style="color:#706E6B;font-size:14px">Process Cycle Efficiency</span>
          <span style="color:#0176D3;font-size:18px;font-weight:700">${report.pcePct}%</span>
        </div>
        <div style="background:#F3F3F3;border-radius:8px;padding:16px;display:flex;justify-content:space-between;align-items:center">
          <span style="color:#706E6B;font-size:14px">Value-added time</span>
          <span style="color:#2E844A;font-size:16px;font-weight:600">${vaMins} min of ${minutes} min</span>
        </div>
        <div style="background:#F3F3F3;border-radius:8px;padding:16px;display:flex;justify-content:space-between;align-items:center">
          <span style="color:#706E6B;font-size:14px">Primary waste type</span>
          <span style="color:#BA0517;font-size:15px;font-weight:600">${report.wasteType}</span>
        </div>
        <div style="background:#F3F3F3;border-radius:8px;padding:16px;display:flex;justify-content:space-between;align-items:center">
          <span style="color:#706E6B;font-size:14px">Bottleneck step</span>
          <span style="color:#181818;font-size:15px;font-weight:600">${report.bottleneckStep}</span>
        </div>
      </div>

      <div style="background:#EFF6FF;border-left:3px solid #0176D3;border-radius:0 8px 8px 0;padding:16px 20px;margin-bottom:24px">
        <p style="color:#0a3d78;font-size:13px;font-weight:700;margin:0 0 6px;text-transform:uppercase;letter-spacing:0.06em">First Action This Week</p>
        <p style="color:#181818;font-size:15px;line-height:1.6;margin:0">${report.firstAction}</p>
      </div>

      <div style="background:#F8F4FF;border-radius:8px;padding:16px 20px;margin-bottom:32px">
        <p style="color:#6426A0;font-size:13px;font-weight:700;margin:0 0 6px;text-transform:uppercase;letter-spacing:0.06em">${report.leanConcept}</p>
        <p style="color:#3E3E3C;font-size:14px;line-height:1.6;margin:0">${report.leanConceptExplanation}</p>
      </div>

      <div style="border-top:1px solid #E5E5E5;padding-top:24px">
        <p style="color:#181818;font-size:15px;font-weight:600;margin:0 0 8px">Want to go further?</p>
        <p style="color:#3E3E3C;font-size:14px;line-height:1.6;margin:0 0 20px">
          Build a full VSM map and run a complete improvement cycle. 14-day free trial, no card required.
        </p>
        <a href="https://vesimy.com/auth/signup?utm_source=tier0&utm_medium=email&utm_campaign=report_delivery"
           style="display:inline-block;background:#0176D3;color:#fff;text-decoration:none;padding:12px 24px;border-radius:8px;font-size:15px;font-weight:600">
          Start Free Trial
        </a>
      </div>
    </div>

    <div style="background:#F8F8F8;border-top:1px solid #E5E5E5;padding:20px 32px">
      <p style="color:#706E6B;font-size:13px;line-height:1.6;margin:0">
        Max Singh, Founder — VeSiMy<br>
        LSS Green Belt · 12+ years manufacturing operations · ex-Tesla<br>
        <a href="mailto:founder@vesimy.com" style="color:#0176D3">founder@vesimy.com</a>
      </p>
      <p style="color:#A8A8A8;font-size:12px;margin:12px 0 0">
        You received this because you mapped a process at vesimy.com/start.
        <a href="https://vesimy.com/unsubscribe?id=${sessionId}" style="color:#A8A8A8">Unsubscribe</a>
      </p>
    </div>
  </div>
</body>
</html>`

  try {
    const res = await fetch('https://api.sender.net/v2/emails', {
      method:  'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type':  'application/json',
      },
      body: JSON.stringify({
        from:    { name: 'Max Singh, VeSiMy', email: 'founder@vesimy.com' },
        to:      [{ email }],
        subject: `Your lean report is here${firstName ? `, ${firstName}` : ''}`,
        html:    htmlBody,
        groups:  [process.env.SENDER_TIER0_GROUP_ID].filter(Boolean),
      }),
    })
    if (!res.ok) {
      const body = await res.text()
      console.error('[tier0/email] Sender error:', res.status, body)
    }
  } catch (err) {
    console.error('[tier0/email] Send failed:', err)
  }
}

// ── Store session ──────────────────────────────────────────────────────────

async function storeSession(
  data: Tier0Request,
  report: ReportOutput,
  ipHash: string,
): Promise<string> {
  const admin = createAdminClient()
  const { data: row, error } = await admin
    .from('tier0_sessions')
    .insert({
      email:           data.email.toLowerCase().trim(),
      first_name:      data.firstName ?? null,
      industry:        data.industry,
      process_name:    data.processName,
      steps:           data.steps,
      pain_step:       data.painStep ?? null,
      pain_description: data.painDescription ?? null,
      target_category: data.targetCategory ?? null,
      report_json:     report,
      report_generated_at: new Date().toISOString(),
      ip_hash:         ipHash,
    })
    .select('id')
    .single()

  if (error) {
    console.error('[tier0/store] Insert error:', error.message)
    throw error
  }
  return (row as any).id as string
}

// ── Rate limit check ───────────────────────────────────────────────────────

async function checkRateLimit(email: string): Promise<boolean> {
  const admin = createAdminClient()
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  const { count, error } = await admin
    .from('tier0_sessions')
    .select('id', { count: 'exact', head: true })
    .eq('email', email.toLowerCase().trim())
    .gte('created_at', since)

  if (error) {
    console.error('[tier0/rate] Check error:', error.message)
    return true // allow on error to avoid false blocks
  }
  return (count ?? 0) === 0
}

// ── Main handler ───────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as Tier0Request

    // Validate required fields
    if (!body.email || !body.industry || !body.processName || !Array.isArray(body.steps)) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: email, industry, processName, steps' },
        { status: 400 }
      )
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid email address' },
        { status: 400 }
      )
    }

    // Truncate inputs to prevent prompt injection / large payloads
    body.processName  = String(body.processName).slice(0, 120)
    body.targetMetric = body.targetMetric ? String(body.targetMetric).slice(0, 80) : undefined
    body.steps        = body.steps.slice(0, 12).map(s => ({
      ...s,
      name:      String(s.name || '').slice(0, 80),
      waitBefore:String(s.waitBefore || '').slice(0, 20),
      cycleTime: String(s.cycleTime || '').slice(0, 20),
      painPoint: s.painPoint ? String(s.painPoint).slice(0, 200) : undefined,
    }))

    if (body.steps.length < 2 || body.steps.length > 12) {
      return NextResponse.json(
        { success: false, error: 'Process must have between 2 and 12 steps' },
        { status: 400 }
      )
    }

    // Rate limit check
    const allowed = await checkRateLimit(body.email)
    if (!allowed) {
      return NextResponse.json(
        { success: false, error: 'rate_limited', message: 'One report per email per 24 hours. Check your inbox for your previous report.' },
        { status: 429 }
      )
    }

    // IP hash for secondary rate limiting (GDPR-safe)
    const xff    = request.headers.get('x-forwarded-for') ?? ''
    const ip     = xff.split(',')[0].trim() || 'unknown'
    const ipHash = await crypto.subtle.digest(
      'SHA-256',
      new TextEncoder().encode(ip)
    ).then(buf => Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join(''))

    // Call Anthropic API
    let report: ReportOutput
    const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY

    if (ANTHROPIC_KEY) {
      try {
        const aiRes = await fetch('https://api.anthropic.com/v1/messages', {
          method:  'POST',
          headers: {
            'Content-Type':    'application/json',
            'x-api-key':       ANTHROPIC_KEY,
            'anthropic-version': '2023-06-01',
          },
          body: JSON.stringify({
            model:      'claude-opus-4-5',
            max_tokens: 1024,
            messages:   [{ role: 'user', content: buildPrompt(body) }],
          }),
        })

        if (!aiRes.ok) {
          throw new Error(`Anthropic ${aiRes.status}`)
        }

        const aiData = await aiRes.json()
        const raw    = aiData.content?.[0]?.text ?? ''
        // Strip any markdown fences if the model includes them
        const clean  = raw.replace(/```json|```/g, '').trim()
        report       = JSON.parse(clean) as ReportOutput
      } catch (aiErr) {
        console.error('[tier0/ai] Error, using fallback:', aiErr)
        report = buildFallbackReport(body)
      }
    } else {
      console.warn('[tier0/ai] ANTHROPIC_API_KEY not set — using fallback report')
      report = buildFallbackReport(body)
    }

    // Store session (required before email so we have sessionId)
    let sessionId: string
    try {
      sessionId = await storeSession(body, report, ipHash)
    } catch (dbErr) {
      console.error('[tier0/store] Failed:', dbErr)
      // Still return the report — don't fail the user because of a DB issue
      sessionId = 'unknown'
    }

    // Send email (non-blocking — don't fail the request if email fails)
    sendReportEmail(body.email, body.firstName, body.processName, report, sessionId)
      .catch(err => console.error('[tier0/email] Background send error:', err))

    return NextResponse.json({ success: true, report, sessionId })

  } catch (err: any) {
    console.error('[tier0/generate-report] Unhandled error:', err)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
