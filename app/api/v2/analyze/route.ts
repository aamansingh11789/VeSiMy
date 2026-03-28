// @ts-nocheck
// ── app/api/v2/analyze/route.ts ────────────────────────────────────────────────
// Generates the Current State Analysis report for a V2 project.
// Reads all steps + tasks, calls Claude with lean methodology knowledge,
// returns structured report saved to analysis_reports table.

import { NextResponse, type NextRequest } from 'next/server'
import { createServerSupabase } from '@/lib/supabase-server'
import { callAI } from '@/lib/ai/ai-assist'
import { KNOWLEDGE_CHUNKS } from '@/lib/supe-knowledge'
import { getIndustryTerms, getIndustryLabel } from '@/lib/industry-language'

export const maxDuration = 60

// ── Pull relevant knowledge chunks for analysis — full RAG from uploaded DB ──────
function getAnalysisKnowledge(forTags?: string[]): string {
  const keywords = forTags || [
    'vsm','value stream','waste','bottleneck','cycle time','takt time',
    'pdca','kaizen','five why','fishbone','root cause','six sigma',
    'lean','tps','standard work','flow','inventory','defect',
    'time study','improvement','future state','metrics','kpi'
  ]
  const relevant = (KNOWLEDGE_CHUNKS as any[]).filter((c: any) =>
    c.tags?.some((tag: string) =>
      keywords.some(kw => tag.toLowerCase().includes(kw))
    )
  ).slice(0, 8)  // up to 8 chunks for comprehensive analysis
  // Include section name for traceability to VeSiMy_Supe_RAG_Knowledge_Base.txt
  return relevant.map((c: any) => `[SOURCE: ${c.section}]\n${c.content?.slice(0, 600)}`).join('\n---\n')
}

// ── CI tool recommendation logic ──────────────────────────────────────────────
function determineCITool(step: any, taktTime = 0): { tool: string; reason: string } {
  if ((step.defect_rate || 0) > 5)
    return { tool: 'fishbone', reason: `Defect rate ${step.defect_rate}% — map root causes across all categories` }
  if (taktTime > 0 && (step.cycle_time || 0) > taktTime)
    return { tool: 'stopwatch', reason: 'Cycle time exceeds takt — time study needed to establish accurate baseline' }
  if ((step.wait_time || 0) > (step.cycle_time || 1) * 2)
    return { tool: 'waste', reason: 'Wait time exceeds process time — significant waiting waste identified' }
  if (step.missing_info_flags?.includes('cycle_time'))
    return { tool: 'stopwatch', reason: 'No cycle time data — time study required before any analysis' }
  if (step.step_type === 'decision' || step.step_type === 'inspection')
    return { tool: 'fivewhy', reason: 'Decision/inspection points often hide systemic causes — 5 Why recommended' }
  return { tool: 'kaizen', reason: 'Use Kaizen event to target structured improvement on this step' }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabase()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const { project_id } = body

    // ── Fetch project + steps ──────────────────────────────────────────────
    const [{ data: project }, { data: steps }] = await Promise.all([
      supabase.from('projects').select('*').eq('id', project_id).eq('user_id', user.id).single(),
      supabase.from('steps').select('*').eq('project_id', project_id).order('position'),
    ])

    if (!project) return NextResponse.json({ error: 'Project not found' }, { status: 404 })

    const { data: profile } = await supabase.from('profiles').select('industry').eq('id', user.id).single()
    const industry = project.industry || profile?.industry || 'general_manufacturing'
    const t = getIndustryTerms(industry)
    const industryLabel = getIndustryLabel(industry)
    const knowledge = getAnalysisKnowledge()

    // ── Calculate preliminary metrics ─────────────────────────────────────
    const totalSteps = steps?.length || 0
    const stepsWithCT = steps?.filter(s => s.cycle_time > 0) || []
    const totalCT = stepsWithCT.reduce((a: number, s: any) => a + (s.cycle_time || 0), 0)
    const totalWait = steps?.reduce((a: number, s: any) => a + (s.wait_time || 0), 0) || 0
    const leadTime = totalCT + totalWait
    const vaSteps = steps?.filter(s => s.is_value_added === 'va') || []
    const vaCT = vaSteps.reduce((a: number, s: any) => a + (s.cycle_time || 0), 0)
    const pce = leadTime > 0 ? Math.round((vaCT / leadTime) * 100) : 0
    const missingCT = steps?.filter(s => !s.cycle_time || s.cycle_time === 0) || []
    const stepsWithDefects = steps?.filter(s => (s.defect_rate || 0) > 3) || []

    // ── Per-step CI suggestions (rule-based first) ─────────────────────────
    const taktTime = project.takt_time || 0
    const ciSuggestions = steps?.map((s: any) => ({
      step_id: s.id,
      step_name: s.name,
      step_type: s.step_type,
      ...determineCITool(s, taktTime),
      priority: (s.defect_rate > 5 || (s.cycle_time > (project.takt_time || 99999))) ? 'critical' : 'standard',
    })) || []

    const missingInfo = steps?.flatMap((s: any) =>
      (s.missing_info_flags || []).map((flag: string) => ({
        step_id: s.id,
        step_name: s.name,
        field: flag,
        impact: flag === 'cycle_time'
          ? `Cannot calculate PCE or identify bottlenecks without ${t.cycleTime} for "${s.name}"`
          : `Incomplete data on "${s.name}" reduces analysis accuracy`,
      }))
    ) || []

    // ── Build analysis prompt ──────────────────────────────────────────────
    const stepsText = (steps || []).map((s: any, i: number) => `
Step ${i + 1}: "${s.name}" [${s.step_type}]
  ${t.cycleTime}: ${s.cycle_time ? `${s.cycle_time} ${s.cycle_time_unit || 'seconds'} (${s.cycle_time_type || 'assumed'})` : 'NOT SET'}
  ${t.waitTime}: ${s.wait_time || 0} ${s.cycle_time_unit || 'seconds'}
  ${t.wip}: ${s.wip || 0} | ${t.operators}: ${s.operators || 1} | Defect rate: ${s.defect_rate || 0}%
  VA Classification: ${s.is_value_added || 'unclassified'}
  Governing entity: ${s.governing_entity || 'none specified'}
  Tasks: ${(s.tasks || []).join('; ') || 'none specified'}
  Missing: ${(s.missing_info_flags || []).join(', ') || 'none'}`).join('\n')

    const prompt = `You are a lean VSM analyst certified in ISO 22468, TPS, and Six Sigma. Analyse this ${industryLabel} process and return ONLY valid JSON.

LEAN METHODOLOGY REFERENCE:
${knowledge}

INDUSTRY: ${industryLabel}
Industry language: ${t.product}=${t.product}, ${t.cycleTime}=${t.cycleTime}, ${t.defect}=${t.defect}, ${t.gemba}=${t.gemba}

PROCESS: ${project.name}
${project.description ? `Description: ${project.description}` : ''}
Steps: ${totalSteps} | Avg CT with data: ${Math.round(totalCT/Math.max(stepsWithCT.length,1))}s | Est. Lead Time: ${Math.round(leadTime/60)}min | PCE: ${pce}%

STEP DATA:
${stepsText}

Return this JSON only, no markdown:
{
  "process_summary": "2-3 sentence plain language description of what this process does and its primary purpose",
  "key_findings": ["finding 1", "finding 2", "finding 3"],
  "bottleneck_analysis": "Which step is the primary constraint and why, in 2 sentences using ${industryLabel} language",
  "improvement_potential": {
    "conservative": "percentage range e.g. 15-25%",
    "optimistic": "percentage range e.g. 35-55%",
    "basis": "what the estimate is based on (missing data, cycle time ratios, defect rates, etc.)",
    "primary_lever": "the single biggest improvement opportunity"
  },
  "mapping_guidance": ["specific instruction to improve the map quality 1", "instruction 2", "instruction 3"],
  "priority_actions": [
    {"step": "step name", "action": "what to do", "why": "why this matters", "expected_gain": "what improvement expected"}
  ],
  "process_risks": ["risk 1", "risk 2"],
  "data_quality_note": "honest assessment of how complete the data is and what would make the analysis more accurate"
}`

    let aiFindings: any = {}
    try {
      const raw = await callAI(prompt, 1500)
      if (raw) {
        const clean = raw.replace(/```json\s*/gi, '').replace(/```\s*/gi, '').trim()
        aiFindings = JSON.parse(clean)
      }
    } catch (e) {
      console.warn('[analyze] AI parse failed, using rule-based only')
    }

    // ── Format lead time for display ──────────────────────────────────────
    const formatLeadTime = (secs: number) => {
      if (secs < 120) return `${secs.toFixed(0)} seconds`
      if (secs < 7200) return `${(secs/60).toFixed(1)} minutes`
      if (secs < 172800) return `${(secs/3600).toFixed(1)} hours`
      return `${(secs/86400).toFixed(1)} days`
    }

    // ── Assemble full report ───────────────────────────────────────────────
    const report = {
      project_id,
      user_id: user.id,
      report_type: 'current_state',
      report_version: 1,
      summary: aiFindings.process_summary || `${project.name} — ${totalSteps} steps mapped across ${industryLabel} process.`,
      process_description: project.description || '',
      total_steps: totalSteps,
      va_ratio: `${pce}%`,
      estimated_lead_time: formatLeadTime(leadTime),
      improvement_potential: aiFindings.improvement_potential || {
        conservative: `${Math.max(10, Math.round((1 - pce/100) * 30))}–${Math.max(15, Math.round((1 - pce/100) * 45))}%`,
        optimistic: `${Math.max(20, Math.round((1 - pce/100) * 50))}–${Math.max(30, Math.round((1 - pce/100) * 70))}%`,
        basis: `Based on ${pce}% PCE, ${missingCT.length} steps without ${t.cycleTime}, and ${stepsWithDefects.length} high-defect steps`,
        primary_lever: missingCT.length > 0 ? `Complete ${t.cycleTime} data for all steps` : 'Address identified bottleneck',
      },
      bottlenecks: ciSuggestions.filter(s => s.priority === 'critical'),
      missing_information: missingInfo,
      ci_suggestions: ciSuggestions,
      mapping_guidance: aiFindings.mapping_guidance || [
        ...(missingCT.length > 0 ? [`Add ${t.cycleTime} data to ${missingCT.length} step${missingCT.length > 1 ? 's' : ''} — this is required for bottleneck analysis`] : []),
        ...(vaSteps.length === 0 ? ['Classify each step as Value-Add, Necessary Non-Value-Add, or Non-Value-Add to enable PCE calculation'] : []),
        ...(steps?.some((s: any) => !s.governing_entity) ? ['Add governing entities (regulatory bodies, departments, systems) to steps where applicable'] : []),
        'Verify task descriptions accurately reflect what physically happens at each step',
      ],
      action_plan: (aiFindings.priority_actions || []).map((a: any, i: number) => ({
        sequence: i + 1,
        step: a.step,
        action: a.action,
        why: a.why,
        expected_gain: a.expected_gain,
        ci_tool: ciSuggestions.find(c => c.step_name === a.step)?.tool || 'kaizen',
      })),
      disclaimer: 'This report is based solely on the data entered by the user. Missing steps, incorrect parameters, or incomplete data will affect the accuracy of findings and recommendations. All improvement estimates carry inherent uncertainty and should be validated with direct observation at the process (gemba).',
      raw_ai_response: JSON.stringify(aiFindings),
    }

    // ── Save to database ───────────────────────────────────────────────────
    const { data: saved, error: saveErr } = await supabase
      .from('analysis_reports')
      .insert(report)
      .select('id')
      .single()

    if (saveErr) {
      console.error('[analyze] save failed:', saveErr.message)
      // Return report even if save fails
      return NextResponse.json({ success: true, report, saved: false })
    }

    return NextResponse.json({ success: true, report: { ...report, id: saved.id }, saved: true })

  } catch (err: any) {
    console.error('[analyze]', err)
    return NextResponse.json({ error: err?.message || 'Analysis failed' }, { status: 500 })
  }
}
