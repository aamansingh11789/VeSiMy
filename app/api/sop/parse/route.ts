// @ts-nocheck
// ── app/api/sop/parse/route.ts ────────────────────────────────────────────────
// Universal SOP → VSM step parser.
// Handles: STEP-prefix, numbered (1.), section X.Y, pipe-table, bullet Step A,
//          ALL-CAPS headings — and any mix thereof.
// Primary: Claude API (precise top-level-steps-only prompt with retry)
// Fallback: rule-based multi-pattern parser tested against 6 real-world formats

import { NextResponse, type NextRequest } from 'next/server'
import { createServerSupabase }           from '@/lib/supabase-server'

// ── helpers ───────────────────────────────────────────────────────────────────
function toSec(v: string, u: string): number {
  const n = parseFloat(v)
  if (isNaN(n)) return 0
  const uu = u.toLowerCase()
  if (uu.startsWith('hr') || uu.startsWith('hour')) return Math.round(n * 3600)
  if (uu.startsWith('min'))  return Math.round(n * 60)
  if (uu.startsWith('sec'))  return Math.round(n)
  return Math.round(n * 60)
}

function extractMetrics(block: string) {
  const s: any = {}
  const ctPs = [
    /(?:cycle\s*time|CT|c\/t)\s*[=:]\s*(\d+(?:\.\d+)?)\s*(sec|min|hr|hour|minute)s?/i,
    /(?:time|duration|takes?)\s*[=:]\s*(\d+(?:\.\d+)?)\s*(sec|min|hr|hour|minute)s?/i,
    /(?:approx(?:imate)?\s*time)\s*[=:,]\s*(\d+(?:\.\d+)?)\s*(sec|min|hr|hour|minute)s?/i,
    /\(CT:\s*(\d+(?:\.\d+)?)\s*(sec|min|hr|hour)s?\)/i,
    /\((\d+(?:\.\d+)?)\s*(sec|min|hr|hour|minute)s?\)/i,
    /(\d+(?:\.\d+)?)\s*(sec|min|hr|hour|minute)s?\s+per\s+(?:unit|piece|pallet|truck|board|batch|tray)/i,
  ]
  for (const p of ctPs) { const m = block.match(p); if (m) { s.cycle_time = toSec(m[1], m[2]); break } }

  const wtPs = [
    /(?:wait(?:ing)?\s*(?:time)?|queue\s*time)\s*(?:before\s+this\s+step)?\s*[=:]\s*(\d+(?:\.\d+)?)\s*(sec|min|hr|hour|minute)s?/i,
    /\bwait\s*[=:]\s*(\d+(?:\.\d+)?)\s*(sec|min|hr|hour|minute)s?/i,
  ]
  for (const p of wtPs) { const m = block.match(p); if (m) { s.wait_time = toSec(m[1], m[2]); break } }

  const stm = block.match(/(?:setup|changeover)\s*(?:time)?\s*[=:]\s*(\d+(?:\.\d+)?)\s*(sec|min|hr|hour)s?/i)
  if (stm) s.setup_time = toSec(stm[1], stm[2])

  const opPs = [
    /(\d+)\s*(?:x\s*)?(?:operator|worker|technician|staff|person|people)\b/i,
    /(?:operator|worker|staff)\s*[=:]\s*(\d+)/i,
  ]
  for (const p of opPs) { const m = block.match(p); if (m) { s.operators = parseInt(m[1]); break } }

  const dm = block.match(/(?:dept|department|team|area)\s*[=:\-–]\s*([A-Za-z][A-Za-z\s&\/,]{2,30}?)(?:[|,.\n]|$)/i)
  if (dm) s.department = dm[1].trim().replace(/\s+/g, ' ')

  const drm = block.match(/(?:defect|scrap|reject)\s*(?:rate|%)?\s*[=:]\s*(\d+(?:\.\d+)?)\s*%?/i)
           || block.match(/(\d+(?:\.\d+)?)\s*%\s*(?:defect|scrap|reject)/i)
  if (drm) s.defect_rate = parseFloat(drm[1])

  const utm = block.match(/(?:uptime|availability)\s*[=:]\s*(\d+(?:\.\d+)?)\s*%?/i)
           || block.match(/(\d+(?:\.\d+)?)\s*%\s*(?:uptime|availability)/i)
  if (utm) s.uptime = parseFloat(utm[1])

  const wipm = block.match(/(?:WIP)\s*[=:]\s*(\d+(?:\.\d+)?)/i)
            || block.match(/(\d+)\s*(?:units?|batches?|pallets?)\s*(?:WIP|in\s*queue)/i)
  if (wipm) s.wip = parseFloat(wipm[1])

  const nm = block.match(/CI\s+NOTE[:\s]+(.{10,300})/i)
  if (nm) s.notes = nm[1].trim().slice(0, 200)

  return s
}

const SKIP_LINE = /^(purpose\b|scope\b|introduction\b|waste register|kaizen\b|build checklist|document approval|vesimy project|task sequence|ci note|metrics summary|procedure overview|references\b|definitions\b|safety\b|ppe\b|general\b|background\b|appendix\b|table\s+of\b|approved by|process owner|effective\b|revision\b|takt time|document number)\b/i

function cleanName(n: string): string {
  return n
    .replace(/\s*\[[^\]]*\]\s*/g, '')                                          // strip [VA] [NNVA]
    .replace(/\s*\((?:CT[:\s])?[\d.]+\s*(?:sec|min|hr|hour)s?\)\s*/gi, '')   // strip (CT: 42 sec)
    .replace(/\s+/g, ' ').trim()
}

function buildBlocks(lines: string[], re: RegExp, extract: (m: RegExpMatchArray) => string) {
  const hdrs: { i: number; name: string }[] = []
  const seen = new Set<string>()

  for (let i = 0; i < lines.length; i++) {
    if (SKIP_LINE.test(lines[i])) continue
    const m = lines[i].match(re)
    if (!m) continue
    const name = cleanName(extract(m))
    if (name.length < 4 || name.length > 80 || seen.has(name.toLowerCase())) continue
    seen.add(name.toLowerCase())
    hdrs.push({ i, name })
  }

  return hdrs.map((h, fi) => {
    const next = fi + 1 < hdrs.length ? hdrs[fi + 1].i : Math.min(h.i + 18, lines.length)
    return { name: h.name, ...extractMetrics(lines.slice(h.i, next).join(' ')) }
  })
}

function parsePipeTable(lines: string[]) {
  const HDR  = /^(?:operation|step|process|task|activity)\s*\|/i
  const seen = new Set<string>()
  const steps: any[] = []

  for (const l of lines) {
    if (!l.includes('|') || HDR.test(l)) continue
    const cols = l.split('|').map((c: string) => c.trim()).filter(Boolean)
    if (cols.length < 2 || cols[0].length < 3 || cols[0].length > 70) continue
    if (/^(SOP|step\s+\d|line:|takt|--|#)/i.test(cols[0])) continue
    if (seen.has(cols[0].toLowerCase())) continue
    seen.add(cols[0].toLowerCase())

    const st: any = { name: cols[0], ...extractMetrics(cols.slice(1).join(' ')) }
    if (!st.cycle_time && cols[1]) { const tm = cols[1].match(/^(\d+(?:\.\d+)?)\s*(sec|min|hr|hour)s?$/i); if (tm) st.cycle_time = toSec(tm[1], tm[2]) }
    if (!st.operators  && cols[2]) { const om = cols[2].match(/^(\d+)$/); if (om) st.operators = parseInt(om[1]) }
    if (!st.uptime     && cols[3]) { const um = cols[3].match(/^(\d+(?:\.\d+)?)%?$/); if (um && parseFloat(um[1]) <= 100) st.uptime = parseFloat(um[1]) }
    steps.push(st)
  }
  return steps
}

const AC_SKIP = /(?:SOP|PROCEDURE|INSTRUCTION|OVERVIEW|SUMMARY|MANUAL)\s*$|^(SOP\b|STANDARD\b|PROCEDURE\b|DOCUMENT\b|REVISION\b|PURPOSE\b|SCOPE\b|APPROVED\b|TAKT\b|EQUIPMENT\b|SAFETY\b|PPE\b|REFERENCES\b|DEFINITIONS\b|INTRODUCTION\b|OVERVIEW\b|SUMMARY\b|BACKGROUND\b|GENERAL\b|APPENDIX\b|FACILITY\b|TABLE\s+OF\b|STEP\s+\d|DEPT\b|OPERATION\s*\|)/

function parseAllCaps(lines: string[]) {
  // Only collect all-caps lines that look like PROCESS STEP names (not doc titles)
  return buildBlocks(lines, /^([A-Z][A-Z0-9\s\-–&\/(),]{3,60})$/, m => m[1])
    .filter((s: any) => !AC_SKIP.test(s.name) && !s.name.includes('|'))
}

// ── main rule-based parser ────────────────────────────────────────────────────
function parseRules(text: string): any[] {
  const lines = text.split('\n').map((l: string) => l.trim()).filter((l: string) => l.length > 0)

  // Detect dominant structure
  let sp=0, nb=0, sn=0, bs=0, ac=0, pt=0
  for (const l of lines.slice(0, 80)) {
    if      (/^STEP\s+\d+[\s:\-–]/.test(l))              sp++
    else if (/^\d{1,2}[.)]\s+[A-Z]/.test(l))             nb++
    else if (/^\d+\.\d+\s+[A-Z]/.test(l))                sn++
    else if (/^[•\-\*]\s+Step\s+[A-Za-z\d]/.test(l))    bs++
    else if (/^[A-Z][A-Z\s\-]{5,60}$/.test(l) && !/^(SOP|PROCEDURE|STANDARD|PURPOSE|SCOPE|APPROVED|TAKT|OPERATION\s*\|)/.test(l)) ac++
    if (/\|.*\|/.test(l)) pt++
  }

  // Try strategies in confidence order, stop at first returning 2–25 steps
  const tries: (() => any[])[] = []
  if (sp >= 2) tries.push(() => buildBlocks(lines, /^STEP\s+\d+[:\s\-–—]+(.+)/, m => m[1]))
  if (pt >= 3) tries.push(() => parsePipeTable(lines))
  if (sn >= 2) tries.push(() => buildBlocks(lines, /^(\d+\.\d+)\s+([A-Z].{3,70})$/, m => m[2]))
  if (bs >= 2) tries.push(() => buildBlocks(lines, /^[•\-\*]\s+Step\s+[A-Za-z\d]+\s*[—\-–:]\s*(.+)/, m => m[1]))
  if (ac >= 3) tries.push(() => parseAllCaps(lines))  // ALLCAPS before numbered when dominant
  tries.push(() => buildBlocks(lines, /^(\d{1,2})[.)]\s+([A-Z].{4,80})$/, m => m[2]))
  if (ac >= 2) tries.push(() => parseAllCaps(lines))   // also try after numbered
  // Final fallbacks
  tries.push(() => buildBlocks(lines, /^(\d+\.\d+)\s+([A-Z].{3,70})$/, m => m[2]))
  tries.push(() => buildBlocks(lines, /^[•\-\*]\s+Step\s+[A-Za-z\d]+\s*[—\-–:]\s*(.+)/, m => m[1]))

  for (const fn of tries) {
    const steps = fn()
    if (steps.length >= 2 && steps.length <= 25) return steps
  }
  return []
}

// ── DOCX extraction ───────────────────────────────────────────────────────────
async function extractDocx(buf: Buffer): Promise<string> {
  try {
    const mammoth = require('mammoth')
    const r = await mammoth.extractRawText({ buffer: buf })
    return r.value || ''
  } catch {
    try {
      const s = buf.toString('binary')
      const m = s.match(/<w:body>([\s\S]*?)<\/w:body>/)
      if (!m) return ''
      return m[1]
        .replace(/<w:t[^>]*>([^<]*)<\/w:t>/g, '$1 ')
        .replace(/<w:p\b[^>]*>/g, '\n')
        .replace(/<[^>]+>/g, '')
        .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
        .replace(/\n{3,}/g, '\n\n').trim()
    } catch { return '' }
  }
}

// ── PDF extraction ────────────────────────────────────────────────────────────
async function extractPdf(buf: Buffer): Promise<string> {
  try {
    const pp = require('pdf-parse')
    return (await pp(buf)).text || ''
  } catch {
    const ts: string[] = []
    const re = /\(([^)]+)\)\s*Tj/g
    let m: any
    const s = buf.toString('latin1')
    while ((m = re.exec(s)) !== null) ts.push(m[1])
    return ts.join(' ').replace(/\s{2,}/g, ' ').trim()
  }
}

// ── Claude API parser ─────────────────────────────────────────────────────────
async function parseWithClaude(text: string, retry = false): Promise<any[] | null> {
  if (!process.env.ANTHROPIC_API_KEY) return null

  const retryNote = retry
    ? '\n\nCRITICAL: Return NO MORE THAN 12 steps. You previously returned too many — you are including sub-tasks or table rows. Only top-level process steps count.'
    : ''

  const prompt = `You are a lean manufacturing expert extracting process steps from an SOP to build a Value Stream Map.

Extract ONLY the top-level process steps — the main operations in the flow (usually 4–12 steps total).

STRICT RULES:
1. Look for "STEP 01", "STEP 02", "1. Step Name", "3.1 Step Name", "• Step A —" as top-level markers
2. Do NOT include sub-tasks (numbered items INSIDE a step like "1.1", "2.1", "a.", "b.")  
3. Do NOT include rows from: Waste Register, Kaizen Targets, Metrics tables, Approval tables, Build Checklists
4. Do NOT include section headings (Scope, Purpose, References, Safety, etc.)
5. If a DOCX table was flattened to plain text, consecutive lines after a step header are its data:
   STEP 01  ORDER RECEIPT   ← this is the step name
   Cycle Time               ← label  
   48 sec                   ← value = cycle_time: 48
   Operators                ← label
   1                        ← value = operators: 1
   Wait Time
   4 min                    ← wait_time: 240 seconds${retryNote}

For each step return these fields where available:
name (required, clean, max 60 chars — no [NVA] tags, no timing), department, operators (int),
cycle_time (seconds), wait_time (seconds), setup_time (seconds), defect_rate (% as number),
uptime (% as number), wip (int), notes (max 180 chars — CI notes, bottleneck flags)

Return ONLY a valid JSON array. Nothing else.
[{"name":"Order Receipt","operators":1,"cycle_time":48,"wait_time":240,"notes":"14s NVA walk to printer"}]

SOP TEXT:
${text.slice(0, 6000)}`

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
        messages: [{ role: 'user', content: prompt }],
      }),
    })
    if (!res.ok) return null
    const d     = await res.json()
    const raw   = d.content?.[0]?.text || ''
    const match = raw.match(/\[[\s\S]*\]/)
    if (!match) return null
    const parsed = JSON.parse(match[0])
    if (!Array.isArray(parsed) || parsed.length === 0) return null
    if (parsed.length > 20 && !retry) return parseWithClaude(text, true)
    return parsed
  } catch { return null }
}

// ── Route handler ─────────────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    let text = ''
    const ct = request.headers.get('content-type') || ''

    if (ct.includes('application/json')) {
      const body = await request.json()
      text = body.text || ''
    } else if (ct.includes('multipart/form-data')) {
      const fd   = await request.formData()
      const file = fd.get('file') as File | null
      if (file) {
        const name = file.name.toLowerCase()
        const buf  = Buffer.from(await file.arrayBuffer())
        if (name.endsWith('.docx') || name.endsWith('.doc')) {
          text = await extractDocx(buf)
          if (!text.trim())
            return NextResponse.json({ error: 'Could not read DOCX. In Word, use File → Save As → Plain Text (.txt), then upload the .txt file.' }, { status: 400 })
        } else if (name.endsWith('.pdf')) {
          text = await extractPdf(buf)
          if (!text.trim())
            return NextResponse.json({ error: 'Could not extract PDF text. Use Paste Text mode instead.' }, { status: 400 })
        } else {
          text = buf.toString('utf8').replace(/\r\n/g, '\n').replace(/\r/g, '\n')
        }
      }
    }

    if (!text.trim())
      return NextResponse.json({ error: 'No text found. Try Paste Text mode.' }, { status: 400 })

    text = text.replace(/\t/g, ' ').replace(/[ ]{3,}/g, '  ').replace(/\n{4,}/g, '\n\n\n').trim()

    // Try Claude → fall back to rules
    let steps: any[] = []
    const ai = await parseWithClaude(text)
    steps = (ai && ai.length > 0) ? ai : parseRules(text)

    // Cap + clean names
    steps = steps
      .slice(0, 25)
      .map((s: any) => ({ ...s, name: cleanName((s.name || 'Unnamed Step').slice(0, 80)) }))
      .filter((s: any) => s.name.length >= 3)

    return NextResponse.json({ steps, count: steps.length, source: ai ? 'ai' : 'rule-based' })

  } catch (e: any) {
    console.error('[SOP/parse]', e)
    return NextResponse.json({ error: 'Parse failed. Try pasting the SOP text directly.' }, { status: 500 })
  }
}
