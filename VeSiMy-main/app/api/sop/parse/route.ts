// @ts-nocheck
// ── app/api/sop/parse/route.ts ────────────────────────────────────────────────
// Parses SOP text into VSM steps with full field extraction.
// Extracts: name, department, operators, cycle_time, wait_time, setup_time,
//           defect_rate, uptime, completion_accuracy, wip, notes
// Uses Claude API if available, otherwise rule-based parser.

import { NextResponse, type NextRequest } from 'next/server'
import { createServerSupabase }           from '@/lib/supabase-server'

// ── helpers ───────────────────────────────────────────────────────────────────

// Convert a time string like "15 min", "2 hr", "90 sec" → seconds
function toSeconds(value: string, unit: string): number {
  const n = parseFloat(value)
  if (isNaN(n)) return 0
  const u = unit.toLowerCase()
  if (u.startsWith('hr') || u.startsWith('hour')) return Math.round(n * 3600)
  if (u.startsWith('min'))                          return Math.round(n * 60)
  if (u.startsWith('sec'))                          return Math.round(n)
  return Math.round(n * 60) // default: assume minutes
}

// Extract a numeric value after a keyword pattern from a block of text
function extractNumber(text: string, patterns: RegExp[]): number | null {
  for (const pat of patterns) {
    const m = text.match(pat)
    if (m) return parseFloat(m[1])
  }
  return null
}

// ── Rule-based parser ─────────────────────────────────────────────────────────
function parseTextToSteps(text: string) {
  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0)

  type ParsedStep = {
    name:                string
    department?:         string
    operators?:          number
    cycle_time?:         number   // seconds
    wait_time?:          number   // seconds
    setup_time?:         number   // seconds
    defect_rate?:        number   // %
    uptime?:             number   // %
    completion_accuracy?:number   // %
    wip?:                number
    notes?:              string
  }

  const steps: ParsedStep[] = []

  // Find numbered step lines: "1. Step Name" or "1) Step Name"
  const numberedLines = lines.filter(l => /^\d+[\.]\s+\S/.test(l))
  const useNumbered   = numberedLines.length >= 3

  const stepLines = useNumbered ? numberedLines : lines.filter(l => {
    if (l.length < 3 || l.length > 80) return false
    if (/^(standard operating|sop|procedure|revision|page|date|author|version|purpose|notes|targets|performance|department|approved|effective)/i.test(l)) return false
    if (/^[-─═]+$/.test(l)) return false
    if (!useNumbered && !/^[A-Z]/.test(l)) return false
    if (l.includes('.') && l.length > 50) return false
    return true
  })

  for (let si = 0; si < stepLines.length; si++) {
    let line = stepLines[si]

    // Strip leading number
    if (useNumbered) line = line.replace(/^\d+[\.\)]\s*/, '')

    // Grab the description block = this line + next 2-3 non-step lines
    const nextStepIdx = useNumbered
      ? lines.indexOf(stepLines[si + 1] || '') 
      : lines.indexOf(stepLines[si]) + 1
    const currentIdx = lines.indexOf(stepLines[si])
    const blockLines = lines.slice(
      currentIdx,
      nextStepIdx > currentIdx ? Math.min(nextStepIdx, currentIdx + 5) : currentIdx + 4
    )
    const block = blockLines.join(' ')

    // ── Extract step name ──────────────────────────────────────────────────
    // Remove timing from name
    let name = line
      .replace(/\([^)]*(?:min|sec|hr|hour|minute)[^)]*\)/gi, '')
      .split(' — ')[0].split(' – ')[0]
      .trim()

    if (name.length < 3 || name.length > 80) continue
    if (/^(standard operating|sop|version|purpose|notes|targets|performance)/i.test(name)) continue

    // ── Extract cycle time ─────────────────────────────────────────────────
    // Looks for: (15 min), CT: 30 sec, Cycle Time: 2 hr, "takes 5 minutes"
    let cycle_time: number | undefined
    const ctPatterns = [
      /\((\d+(?:\.\d+)?)\s*(min|sec|hr|hour|minute)s?\s*(?:per\s+\w+)?\)/i,
      /(?:cycle\s*time|CT)\s*[=:]\s*(\d+(?:\.\d+)?)\s*(min|sec|hr|hour|minute)s?/i,
      /(?:takes?|duration|time)\s*[=:]?\s*(\d+(?:\.\d+)?)\s*(min|sec|hr|hour|minute)s?/i,
      /(\d+(?:\.\d+)?)\s*(min|sec|hr|hour|minute)s?\s*(?:cycle|per\s+(?:unit|piece|item|batch))/i,
    ]
    for (const pat of ctPatterns) {
      const m = block.match(pat)
      if (m) { cycle_time = toSeconds(m[1], m[2]); break }
    }

    // ── Extract wait / queue time ──────────────────────────────────────────
    let wait_time: number | undefined
    const wtPatterns = [
      /(?:wait|queue|waiting)\s*(?:time)?\s*[=:]\s*(\d+(?:\.\d+)?)\s*(min|sec|hr|hour|minute)s?/i,
      /(?:waits?\s+(?:up\s+to\s+)?|delay\s+of\s+)(\d+(?:\.\d+)?)\s*(min|sec|hr|hour|minute)s?/i,
    ]
    for (const pat of wtPatterns) {
      const m = block.match(pat)
      if (m) { wait_time = toSeconds(m[1], m[2]); break }
    }

    // ── Extract setup time ─────────────────────────────────────────────────
    let setup_time: number | undefined
    const stPatterns = [
      /(?:setup|set-up|changeover|SMED)\s*(?:time)?\s*[=:]\s*(\d+(?:\.\d+)?)\s*(min|sec|hr|hour|minute)s?/i,
    ]
    for (const pat of stPatterns) {
      const m = block.match(pat)
      if (m) { setup_time = toSeconds(m[1], m[2]); break }
    }

    // ── Extract operators ──────────────────────────────────────────────────
    let operators: number | undefined
    const opMatch = block.match(
      /(\d+)\s*(?:operator|worker|person|people|staff|technician|employee)s?/i
    ) || block.match(/(?:operator|worker|staff|headcount)\s*[=:]\s*(\d+)/i)
    if (opMatch) operators = parseInt(opMatch[1])

    // ── Extract department ─────────────────────────────────────────────────
    let department: string | undefined
    const deptMatch = block.match(
      /(?:dept|department|team|group|area|zone|station)\s*[=:\-–]\s*([A-Za-z][A-Za-z\s&\/]{2,30}?)(?:[,.\n]|$)/i
    )
    if (deptMatch) department = deptMatch[1].trim()

    // ── Extract defect rate ────────────────────────────────────────────────
    let defect_rate: number | undefined
    const drMatch = block.match(
      /(?:defect|scrap|reject|error|rework)\s*(?:rate|%)?\s*[=:<]\s*(\d+(?:\.\d+)?)\s*%?/i
    ) || block.match(/(\d+(?:\.\d+)?)\s*%\s*(?:defect|scrap|reject|error)/i)
    if (drMatch) defect_rate = parseFloat(drMatch[1])

    // ── Extract uptime ────────────────────────────────────────────────────
    let uptime: number | undefined
    const utMatch = block.match(
      /(?:uptime|availability|OEE)\s*[=:]\s*(\d+(?:\.\d+)?)\s*%?/i
    ) || block.match(/(\d+(?:\.\d+)?)\s*%\s*(?:uptime|availability)/i)
    if (utMatch) uptime = parseFloat(utMatch[1])

    // ── Extract completion accuracy (C&A) ─────────────────────────────────
    let completion_accuracy: number | undefined
    const caMatch = block.match(
      /(?:completion\s*accuracy|C&A|first\s*pass|first-pass|first\s*time\s*right|FTR|FPY)\s*[=:]\s*(\d+(?:\.\d+)?)\s*%?/i
    )
    if (caMatch) completion_accuracy = parseFloat(caMatch[1])

    // ── Extract WIP ───────────────────────────────────────────────────────
    let wip: number | undefined
    const wipMatch = block.match(
      /(?:WIP|work.in.progress|inventory|queue)\s*[=:]\s*(\d+(?:\.\d+)?)\s*(?:units?|pcs?|pieces?|parts?)?/i
    ) || block.match(/(\d+)\s*(?:units?|pcs?|pieces?|parts?)\s*(?:WIP|in\s*queue|waiting)/i)
    if (wipMatch) wip = parseFloat(wipMatch[1])

    // ── Build notes ───────────────────────────────────────────────────────
    const noteParts: string[] = []
    if (cycle_time)  noteParts.push(`CT: ${cycle_time >= 3600 ? (cycle_time/3600).toFixed(1)+'hr' : cycle_time >= 60 ? (cycle_time/60).toFixed(0)+'min' : cycle_time+'sec'}`)
    if (wait_time)   noteParts.push(`Wait: ${wait_time >= 60 ? (wait_time/60).toFixed(0)+'min' : wait_time+'sec'}`)
    if (setup_time)  noteParts.push(`Setup: ${setup_time >= 60 ? (setup_time/60).toFixed(0)+'min' : setup_time+'sec'}`)
    if (operators)   noteParts.push(`Operators: ${operators}`)
    if (defect_rate) noteParts.push(`Defect: ${defect_rate}%`)
    if (uptime)      noteParts.push(`Uptime: ${uptime}%`)

    const step: ParsedStep = { name }
    if (department)          step.department          = department
    if (operators)           step.operators           = operators
    if (cycle_time)          step.cycle_time          = cycle_time
    if (wait_time)           step.wait_time           = wait_time
    if (setup_time)          step.setup_time          = setup_time
    if (defect_rate)         step.defect_rate         = defect_rate
    if (uptime)              step.uptime              = uptime
    if (completion_accuracy) step.completion_accuracy = completion_accuracy
    if (wip)                 step.wip                 = wip
    if (noteParts.length)    step.notes               = noteParts.join(' | ')

    steps.push(step)
  }

  // Deduplicate
  const seen = new Set<string>()
  return steps.filter(s => {
    const k = s.name.toLowerCase()
    if (seen.has(k)) return false
    seen.add(k)
    return true
  })
}

// ── Route handler ─────────────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    let text = ''
    const contentType = request.headers.get('content-type') || ''

    if (contentType.includes('application/json')) {
      const body = await request.json()
      text = body.text || ''
    } else if (contentType.includes('multipart/form-data')) {
      const fd   = await request.formData()
      const file = fd.get('file') as File | null
      if (file) {
        const buf = await file.arrayBuffer()
        const raw = Buffer.from(buf).toString('utf8', 0, 50000)
        text = raw.replace(/[^\x20-\x7E\n\r\t]/g, ' ').replace(/\s{3,}/g, '\n')
      }
    }

    if (!text.trim()) return NextResponse.json({ error: 'No text content found. Try Paste Text mode.' }, { status: 400 })

    let steps: any[] = []

    // Try Claude API first — it extracts fields much more accurately
    if (process.env.ANTHROPIC_API_KEY) {
      try {
        const res = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': process.env.ANTHROPIC_API_KEY,
            'anthropic-version': '2023-06-01',
          },
          body: JSON.stringify({
            model: 'claude-haiku-4-5-20251001',
            max_tokens: 2000,
            messages: [{
              role: 'user',
              content: `You are a lean manufacturing expert. Extract all process steps from this SOP and return a JSON array.

For each step extract ALL available fields:
- name: step name (required, max 60 chars)
- department: dept/team/area if mentioned
- operators: number of people required
- cycle_time: time in SECONDS to complete (convert min→×60, hr→×3600)
- wait_time: queue/wait time in SECONDS before this step
- setup_time: changeover/setup time in SECONDS
- defect_rate: defect/scrap/reject % as number (e.g. 1.5)
- uptime: machine uptime/availability % as number (e.g. 95)
- completion_accuracy: first-pass yield / C&A % as number
- wip: work-in-progress units as number
- notes: any other relevant info

Return ONLY a JSON array, no other text. Example:
[{"name":"Weld Frame","department":"Fabrication","operators":2,"cycle_time":180,"wait_time":300,"defect_rate":0.5,"uptime":92,"notes":"Use MIG welder, check per WI-042"}]

SOP TEXT:
${text.slice(0, 5000)}`,
            }],
          }),
        })
        if (res.ok) {
          const d     = await res.json()
          const raw2  = d.content?.[0]?.text || ''
          const match = raw2.match(/\[[\s\S]*\]/)
          if (match) {
            const parsed = JSON.parse(match[0])
            if (Array.isArray(parsed) && parsed.length > 0) steps = parsed
          }
        }
      } catch (e) { console.error('[SOP/Claude]', e) }
    }

    // Fallback to rule-based parser
    if (!steps.length) steps = parseTextToSteps(text)

    return NextResponse.json({ steps, count: steps.length })
  } catch (e) {
    console.error('[SOP/parse]', e)
    return NextResponse.json({ error: 'Parse failed' }, { status: 500 })
  }
}
