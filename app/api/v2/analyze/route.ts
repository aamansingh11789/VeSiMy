// TypeScript enabled
// ── app/api/v2/analyze/route.ts ────────────────────────────────────────────────
// v4.0, Full 8-section AI Improvement Report
// Spec: VeSiMy v4 Section 8
// Returns structured JSON consumed by V2AnalysisReport.tsx

import { NextResponse, type NextRequest } from 'next/server'
import { createServerSupabase } from '@/lib/supabase-server'
import { callAI } from '@/lib/ai/ai-assist'
import { KNOWLEDGE_CHUNKS } from '@/lib/supe-knowledge'
import { getIndustryTerms, getIndustryLabel } from '@/lib/industry-language'
import { requirePlan } from '@/lib/require-plan'
import { rateLimit } from '@/lib/api-guard'
import { calcProcessMetrics, fmtPCE } from '@/lib/v2/process-metrics'
import { ctSeconds } from '@/lib/v2/cycle-time-utils'

export const maxDuration = 60

// ── Industry PCE benchmarks (from VSM/lean literature) ───────────────────────
const PCE_BENCHMARKS: Record<string, { typical: string; worldClass: string; note: string }> = {
  manufacturing:          { typical: '10–30%',  worldClass: '70%+', note: 'Toyota plants average 60–85%' },
  healthcare:             { typical: '5–15%',   worldClass: '40%+', note: 'Most ER processes under 10%' },
  service:                { typical: '5–20%',   worldClass: '50%+', note: 'Financial services typically 10–20%' },
  software:               { typical: '15–25%',  worldClass: '60%+', note: 'Agile teams with low WIP can reach 40–60%' },
  construction:           { typical: '20–35%',  worldClass: '60%+', note: 'Design-build models achieve higher PCE' },
  food_beverage:          { typical: '15–40%',  worldClass: '70%+', note: 'Continuous flow lines achieve 60%+' },
  logistics:              { typical: '20–35%',  worldClass: '65%+', note: 'Best-in-class warehouses 50–70%' },
  retail:                 { typical: '15–30%',  worldClass: '55%+', note: 'Omnichannel leaders reach 50%+' },
  default:                { typical: '10–30%',  worldClass: '60%+', note: 'Lean implementations target 50%+ within 2 years' },
}

// ── 8 wastes classification ───────────────────────────────────────────────────
const WASTE_TYPES = [
  'transportation', 'inventory', 'motion', 'waiting',
  'overproduction', 'overprocessing', 'defects', 'skills',
]

// ── RAG knowledge for analysis ────────────────────────────────────────────────
function getAnalysisKnowledge(): string {
  const keywords = [
    'vsm', 'value stream', 'waste', 'bottleneck', 'cycle time', 'takt',
    'pdca', 'kaizen', 'five why', 'fishbone', 'root cause', 'six sigma',
    'lean', 'tps', 'standard work', 'flow', 'inventory', 'defect',
    'theory of constraints', 'improvement', 'future state', 'pce',
  ]
  return (KNOWLEDGE_CHUNKS as any[])
    .filter((c: any) => c.tags?.some((tag: string) => keywords.some(kw => tag.toLowerCase().includes(kw))))
    .slice(0, 8)
    .map((c: any) => `[${c.section}]\n${c.content?.slice(0, 600)}`)
    .join('\n---\n')
}

// ── Rule-based CI tool selector ───────────────────────────────────────────────
function selectTool(step: any, takt = 0): string {
  if ((step.defect_rate || 0) > 5)              return 'ishikawa'
  if (takt > 0 && ctSeconds(step) > takt * 1.2) return 'stopwatch'
  if ((step.wait_time || 0) > (ctSeconds(step) || 1) * 2) return 'waste'
  if (step.step_type === 'decision')             return 'fivewhy'
  if (!ctSeconds(step))                          return 'stopwatch'
  return 'kaizen'
}

// ── Format time helper ────────────────────────────────────────────────────────
function fmtTime(s: number): string {
  if (!s || s < 0) return '0s'
  if (s < 120)     return `${Math.round(s)}s`
  if (s < 7200)    return `${(s / 60).toFixed(1)}m`
  if (s < 172800)  return `${(s / 3600).toFixed(1)}h`
  return `${(s / 86400).toFixed(1)}d`
}

// ── Lead time projection using ISO lean methodology ───────────────────────────
function calcProjection(pce: number | null, leadTime: number, nvaCount: number, bottleneckExists: boolean) {
  const currentPCE = pce ?? 10
  // Conservative: 20–30% lead time reduction from eliminating obvious NVA
  const conservativeTarget = Math.min(currentPCE * 1.5, currentPCE + 20)
  // Realistic: 40–50% lead time reduction from addressing bottleneck + top NVA
  const realisticTarget    = Math.min(currentPCE * 2.2, currentPCE + 40)
  // Optimistic: 60–70% reduction, world-class target for the industry
  const optimisticTarget   = Math.min(currentPCE * 3,   currentPCE + 60)

  const conservativeLT = leadTime * (currentPCE / Math.max(conservativeTarget, 1))
  const realisticLT    = leadTime * (currentPCE / Math.max(realisticTarget,    1))
  const optimisticLT   = leadTime * (currentPCE / Math.max(optimisticTarget,   1))

  return {
    current:      { pce: currentPCE,      leadTime, label: 'Current state' },
    conservative: { pce: conservativeTarget, leadTime: conservativeLT, label: 'Conservative' },
    realistic:    { pce: realisticTarget,    leadTime: realisticLT,    label: 'Realistic' },
    optimistic:   { pce: optimisticTarget,   leadTime: optimisticLT,   label: 'Optimistic' },
    methodology:  'ISO 22468, lead time reduction calculated from PCE improvement targets using VA time as fixed denominator',
  }
}

// ═════════════════════════════════════════════════════════════════════════════
export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabase()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    // Rate limit AI analysis: 10 runs per user per minute.
    const arl = rateLimit(`v2analyze:${user.id}`, { limit: 10, windowMs: 60_000 })
    if (!arl.ok) {
      return NextResponse.json(
        { error: 'You are running analyses too quickly. Please wait a moment.' },
        { status: 429, headers: { 'Retry-After': String(arl.retryAfterSec) } }
      )
    }

    const planBlock = await requirePlan(supabase, user, ['pro', 'lifetime', 'enterprise', 'trialing'])
    if (planBlock) return planBlock

    const { project_id } = await request.json()

    // ── Fetch project + steps + tool_data ────────────────────────────────
    const [{ data: project }, { data: stepsRaw }, { data: profile }] = await Promise.all([
      supabase.from('projects').select('*').eq('id', project_id).eq('user_id', user.id).single(),
      supabase.from('steps').select('*, tool_data(*)').eq('project_id', project_id).order('position'),
      supabase.from('profiles').select('industry, plan_tier').eq('id', user.id).single(),
    ])

    if (!project) return NextResponse.json({ error: 'Project not found' }, { status: 404 })

    const steps = stepsRaw || []
    const industry = project.industry || profile?.industry || 'manufacturing'
    const t = getIndustryTerms(industry)
    const industryLabel = getIndustryLabel(industry)
    const benchmarkKey = Object.keys(PCE_BENCHMARKS).find(k => industry.toLowerCase().includes(k)) || 'default'
    const benchmark = PCE_BENCHMARKS[benchmarkKey]

    // ── Canonical metrics ─────────────────────────────────────────────────
    const metrics = calcProcessMetrics(steps, project)
    const { mainSteps, totalCT, totalWait, leadTime, vaCT, pce, takt: taktTime, bottleneck } = metrics

    const vaSteps       = mainSteps.filter((s: any) => s.va_type === 'va')
    const nvaSteps      = mainSteps.filter((s: any) => s.va_type === 'nva')
    const nnvaSteps     = mainSteps.filter((s: any) => s.va_type === 'nnva')
    const missingCT     = mainSteps.filter((s: any) => !ctSeconds(s))
    const defectSteps   = mainSteps.filter((s: any) => (s.defect_rate || 0) > 3)

    // ── Step text for AI prompt ───────────────────────────────────────────
    const stepsText = steps.map((s: any, i: number) =>
      `Step ${i+1}: "${s.name}" [${s.step_type || 'process'}] VA:${s.va_type || '?'}\n` +
      `  CT: ${ctSeconds(s) ? fmtTime(ctSeconds(s)) : 'MISSING'} | Wait: ${fmtTime(s.wait_time || 0)} | WIP: ${s.wip || 0}\n` +
      `  Defect: ${s.defect_rate || 0}% | Uptime: ${s.uptime || 100}% | Ops: ${s.operators || 1}\n` +
      `  Tasks: ${(s.tasks || []).join('; ') || 'none'}`
    ).join('\n')

    // ── AI prompt, returns structured 8-section data ─────────────────────
    const prompt = `You are a senior lean VSM analyst with ISO 22468 certification. Return ONLY valid JSON, no markdown, no preamble.

LEAN KNOWLEDGE BASE:
${getAnalysisKnowledge()}

PROCESS: ${project.name}
INDUSTRY: ${industryLabel}
STEPS: ${steps.length} | VA time: ${fmtTime(vaCT)} | Lead time: ${fmtTime(leadTime)} | PCE: ${pce !== null ? pce.toFixed(1) + '%' : 'unknown'}
BOTTLENECK: ${bottleneck?.name || 'not identified'} | TAKT: ${taktTime ? fmtTime(taktTime) : 'not set'}
NVA steps: ${nvaSteps.length} | NNVA steps: ${nnvaSteps.length} | Missing CT: ${missingCT.length}

STEP DATA:
${stepsText}

Return this JSON exactly:
{
  "executive_summary": "One paragraph (3-5 sentences). Plain language. What the map shows, biggest opportunity, recommended first action. Write for both a plant manager and a floor supervisor.",
  "bottleneck": {
    "step_name": "name of the primary constraint step",
    "constraint_score": 0-100,
    "wip_upstream": 0,
    "wait_downstream_seconds": 0,
    "ct_vs_takt": "e.g. 145% of takt",
    "plain_explanation": "2 sentences in plain language explaining why this step is the constraint",
    "toc_note": "1 sentence on Theory of Constraints and what fixing this step unlocks"
  },
  "nva_activities": [
    {
      "step_name": "step name",
      "activity": "description of the NVA activity",
      "waste_type": "one of: transportation|inventory|motion|waiting|overproduction|overprocessing|defects|skills",
      "impact_score": 1-10,
      "estimated_time_cost_seconds": 0,
      "elimination_approach": "how to eliminate or reduce this waste"
    }
  ],
  "recommendations": [
    {
      "finding": "what the data shows",
      "what": "specific action to take",
      "why": "why this addresses the root cause not the symptom",
      "how": "which specific tool (pdca|dmaic|8d|ooda|smed|fivewhy|ishikawa|waste|kaizen|stopwatch) and why that tool is the right one for this problem",
      "tool": "tool_id",
      "priority": "immediate|short_term|medium_term",
      "step_name": "which step this applies to"
    }
  ],
  "priority_matrix": [
    {
      "action": "brief action label",
      "impact": 1-10,
      "effort": 1-10,
      "tool": "tool_id",
      "step_name": "step name"
    }
  ],
  "next_steps": [
    {
      "sequence": 1,
      "action": "specific action",
      "step_name": "which process step",
      "tool": "tool_id",
      "rationale": "why this is first",
      "expected_outcome": "what improvement this produces"
    }
  ]
}`

    let aiData: any = {}
    try {
      const raw = await callAI(prompt, 2000)
      if (raw) {
        const clean = raw.replace(/```json\s*/gi, '').replace(/```\s*/gi, '').trim()
        aiData = JSON.parse(clean)
      }
    } catch (e) {
      console.warn('[analyze v4] AI parse failed, using rule-based fallback')
    }

    // ── Rule-based fallback data ───────────────────────────────────────────
    const bottleneckStep = bottleneck || mainSteps.find((s: any) => s.is_bottleneck) || mainSteps[0]
    const fallbackBottleneck = {
      step_name: bottleneckStep?.name || 'Unknown',
      constraint_score: 75,
      wip_upstream: bottleneckStep?.wip || 0,
      wait_downstream_seconds: mainSteps[mainSteps.indexOf(bottleneckStep) + 1]?.wait_time || 0,
      ct_vs_takt: taktTime && ctSeconds(bottleneckStep) ? `${Math.round(ctSeconds(bottleneckStep) / taktTime * 100)}% of takt` : 'Takt not set',
      plain_explanation: `${bottleneckStep?.name || 'This step'} has the highest combination of WIP upstream and cycle time relative to demand. Work accumulates here, creating the longest wait for downstream steps.`,
      toc_note: 'Improving any other step before this constraint has zero effect on overall throughput or lead time.',
    }

    const fallbackNVA = nvaSteps.map((s: any) => ({
      step_name: s.name,
      activity: `Non-value-added work at ${s.name}`,
      waste_type: (s.defect_rate || 0) > 3 ? 'defects' : (s.wait_time || 0) > ctSeconds(s) ? 'waiting' : 'overprocessing',
      impact_score: Math.min(10, Math.round(((s.wait_time || 0) + ctSeconds(s)) / Math.max(totalCT / 10, 1))),
      estimated_time_cost_seconds: ctSeconds(s) || 0,
      elimination_approach: `Apply ${selectTool(s, taktTime ?? 0)} to identify and eliminate the root cause of waste at this step.`,
    }))

    const fallbackRecs = mainSteps.slice(0, 3).map((s: any, i: number) => ({
      finding: `${s.name} ${i === 0 ? 'is the primary constraint' : 'has elevated waste indicators'}`,
      what: `Apply ${selectTool(s, taktTime ?? 0)} analysis to ${s.name}`,
      why: 'Addressing the root cause at this step removes systemic waste rather than managing its symptoms',
      how: `Use ${selectTool(s, taktTime ?? 0)}, this tool is appropriate because it is structured for the type of waste pattern present at this step`,
      tool: selectTool(s, taktTime ?? 0),
      priority: i === 0 ? 'immediate' : 'short_term',
      step_name: s.name,
    }))

    const fallbackMatrix = mainSteps.slice(0, 5).map((s: any, i: number) => ({
      action: `Improve ${s.name}`,
      impact: Math.max(3, 10 - i * 1.5),
      effort: Math.max(2, 4 + i),
      tool: selectTool(s, taktTime ?? 0),
      step_name: s.name,
    }))

    // ── Calculate projection ──────────────────────────────────────────────
    const projection = calcProjection(pce, leadTime, nvaSteps.length, !!bottleneckStep)

    // ── Get next version number for this project ──────────────────────────
    const { count: existingCount } = await supabase
      .from('analysis_reports')
      .select('*', { count: 'exact', head: true })
      .eq('project_id', project_id)
      .eq('user_id', user.id)
    const nextVersion = (existingCount ?? 0) + 1

    // ── Assemble 8-section report ─────────────────────────────────────────
    const report = {
      project_id,
      user_id:        user.id,
      report_type:    'full_ai_report',
      report_version: nextVersion,
      generated_at:   new Date().toISOString(),
      ai_analysis_used: Object.keys(aiData).length > 0,

      // Section 1
      executive_summary: aiData.executive_summary || `${project.name} is a ${steps.length}-step ${industryLabel} process with a measured PCE of ${pce !== null ? pce.toFixed(1) + '%' : 'unknown (missing CT data)'}. The primary constraint is ${bottleneckStep?.name || 'not yet identified'}. ${nvaSteps.length} steps are classified as non-value-added, representing the primary opportunity for lead time reduction. The first recommended action is to address the bottleneck step using a structured improvement cycle.`,

      // Section 2, Current state snapshot data
      current_state: {
        total_steps:     steps.length,
        total_ct:        totalCT,
        total_wait:      totalWait,
        lead_time:       leadTime,
        va_ct:           vaCT,
        pce:             pce,
        pce_formatted:   fmtPCE(pce),
        takt_time:       taktTime ?? 0,
        industry_benchmark: benchmark,
        steps_by_va: {
          va:   vaSteps.length,
          nnva: nnvaSteps.length,
          nva:  nvaSteps.length,
          unknown: mainSteps.filter((s: any) => !s.va_type).length,
        },
        defect_steps:  defectSteps.map((s: any) => ({ name: s.name, rate: s.defect_rate })),
        wip_by_step:   mainSteps.map((s: any) => ({ name: s.name, wip: s.wip || 0 })),
        ct_by_step:    mainSteps.map((s: any) => ({ name: s.name, ct: ctSeconds(s) || 0, takt: taktTime ?? 0, va: s.va_type })),
        missing_ct:    missingCT.length,
        data_completeness: Math.max(0, Math.round(100 - (missingCT.length / Math.max(steps.length, 1)) * 60 - (nvaSteps.filter((s: any) => !s.tasks?.length).length * 5))),
      },

      // Section 3
      bottleneck: aiData.bottleneck || fallbackBottleneck,

      // Section 4
      nva_analysis: {
        activities: aiData.nva_activities || fallbackNVA,
        by_waste_type: WASTE_TYPES.map(w => ({
          type: w,
          count: (aiData.nva_activities || fallbackNVA).filter((a: any) => a.waste_type === w).length,
          total_seconds: (aiData.nva_activities || fallbackNVA)
            .filter((a: any) => a.waste_type === w)
            .reduce((s: number, a: any) => s + (a.estimated_time_cost_seconds || 0), 0),
        })).filter(w => w.count > 0).sort((a, b) => b.count - a.count),
      },

      // Section 5
      recommendations: aiData.recommendations || fallbackRecs,

      // Section 6
      priority_matrix: aiData.priority_matrix || fallbackMatrix,

      // Section 7
      projection,

      // Section 8
      next_steps: aiData.next_steps || mainSteps.slice(0, 3).map((s: any, i: number) => ({
        sequence: i + 1,
        action: `Run ${selectTool(s, taktTime ?? 0)} on ${s.name}`,
        step_name: s.name,
        tool: selectTool(s, taktTime ?? 0),
        rationale: i === 0 ? 'This is the primary constraint, fixing it improves total system throughput' : 'High waste indicator at this step',
        expected_outcome: 'Lead time reduction and improved flow through this step',
      })),

      // Legacy fields (keep for backward compat with existing UI)
      summary:              aiData.executive_summary?.slice(0, 200) + '…' || project.name,
      total_steps:          steps.length,
      va_ratio:             fmtPCE(pce),
      estimated_lead_time:  fmtTime(leadTime),
      improvement_potential: {
        conservative: `${Math.round(projection.conservative.pce)}% PCE / ${fmtTime(projection.conservative.leadTime)} lead time`,
        optimistic:   `${Math.round(projection.optimistic.pce)}% PCE / ${fmtTime(projection.optimistic.leadTime)} lead time`,
        basis: `ISO lean projection from ${pce !== null ? pce.toFixed(1) : '?'}% baseline PCE`,
        primary_lever: aiData.bottleneck?.step_name || bottleneckStep?.name || 'Address constraint',
      },
      bottlenecks: aiData.bottleneck
        ? [{ step_name: aiData.bottleneck.step_name, reason: aiData.bottleneck.plain_explanation, tool: selectTool(bottleneckStep, taktTime ?? 0) }]
        : [{ step_name: bottleneckStep?.name, reason: fallbackBottleneck.plain_explanation, tool: selectTool(bottleneckStep, taktTime ?? 0) }],
      missing_information: missingCT.map((s: any) => ({ step_name: s.name, impact: `Missing CT for "${s.name}" affects PCE and bottleneck accuracy` })),
      ci_suggestions: steps.map((s: any) => ({ step_name: s.name, tool: selectTool(s, taktTime ?? 0), reason: '', priority: s.is_bottleneck ? 'critical' : 'standard' })),
      action_plan: (aiData.next_steps || []).map((ns: any) => ({ step: ns.step_name, action: ns.action, why: ns.rationale, expected_gain: ns.expected_outcome, ci_tool: ns.tool })),
      mapping_guidance: missingCT.length > 0 ? [`Add cycle time to ${missingCT.length} step${missingCT.length > 1 ? 's' : ''} for accurate analysis`] : [],
      disclaimer: 'This report is based on data entered by the user. Missing steps, incorrect parameters, or incomplete data will affect findings. Improvement estimates should be validated through direct observation (gemba).',
      raw_ai_response:  JSON.stringify(aiData).slice(0, 5000), // truncate for DB
      process_description: project.description || '',
    }

    // ── Pack new section data into v4_data jsonb for persistence ────────
    const v4Data = {
      executive_summary: report.executive_summary,
      current_state:     report.current_state,
      bottleneck:        report.bottleneck,
      nva_analysis:      report.nva_analysis,
      recommendations:   report.recommendations,
      priority_matrix:   report.priority_matrix,
      projection:        report.projection,
      next_steps:        report.next_steps,
    }

    // ── DB insert, only schema-safe fields ───────────────────────────────
    // analysis_reports schema: summary, process_description, total_steps, va_ratio,
    // estimated_lead_time, improvement_potential, bottlenecks, missing_information,
    // ci_suggestions, mapping_guidance, action_plan, raw_ai_response, disclaimer
    const dbInsert = {
      project_id:           report.project_id,
      user_id:              report.user_id,
      report_type:          report.report_type,
      report_version:       report.report_version,
      generated_at:         report.generated_at,
      summary:              report.summary,
      process_description:  report.process_description || '',
      total_steps:          report.total_steps,
      va_ratio:             report.va_ratio,
      estimated_lead_time:  report.estimated_lead_time,
      improvement_potential: report.improvement_potential,
      bottlenecks:          report.bottlenecks,
      missing_information:  report.missing_information,
      ci_suggestions:       report.ci_suggestions,
      mapping_guidance:     report.mapping_guidance,
      action_plan:          report.action_plan,
      raw_ai_response:      report.raw_ai_response || '',
      disclaimer:           report.disclaimer,
      v4_data:              v4Data,
    }

    // ── Save to database ──────────────────────────────────────────────────
    const { data: saved, error: insertErr } = await supabase
      .from('analysis_reports')
      .insert(dbInsert)
      .select('id')
      .single()

    if (insertErr) console.error('[analyze v4] DB save error:', insertErr.message)

    return NextResponse.json({ success: true, report: { ...report, id: saved?.id }, saved: !!insertErr === false })

  } catch (err: any) {
    console.error('[analyze v4]', err)
    return NextResponse.json({ error: 'Analysis failed. Please check your data and try again.' }, { status: 500 })
  }
}
