// @ts-nocheck
// ── app/api/v2/future-state/route.ts ──────────────────────────────────────────
// Generates a Future/Target State VSM and detailed report.
// Input: project_id + target statement + Supe conversation transcript
// Output: future state steps array + projected metrics + action plan

import { NextResponse, type NextRequest } from 'next/server'
import { createServerSupabase } from '@/lib/supabase-server'
import { callAI } from '@/lib/ai/ai-assist'
import { getIndustryTerms, getIndustryLabel } from '@/lib/industry-language'
import { KNOWLEDGE_CHUNKS } from '@/lib/supe-knowledge'

export const maxDuration = 60

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabase()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const {
      project_id, target_statement, target_category, target_value,
      target_deadline, target_unit, supe_transcript,
    } = body

    const [{ data: project }, { data: steps }, { data: currentReport }] = await Promise.all([
      supabase.from('projects').select('*').eq('id', project_id).eq('user_id', user.id).single(),
      supabase.from('steps').select('*').eq('project_id', project_id).order('position'),
      supabase.from('analysis_reports')
        .select('*').eq('project_id', project_id).eq('report_type', 'current_state')
        .order('report_version', { ascending: false }).limit(1).single(),
    ])

    if (!project) return NextResponse.json({ error: 'Project not found' }, { status: 404 })

    const { data: profile } = await supabase.from('profiles').select('industry').eq('id', user.id).single()
    const industry = project.industry || profile?.industry || 'general_manufacturing'
    const t = getIndustryTerms(industry)
    const industryLabel = getIndustryLabel(industry)

    // Full RAG from uploaded knowledge base — not generic data
    const knowledge = (KNOWLEDGE_CHUNKS as any[])
      .filter((c: any) => c.tags?.some((tag: string) =>
        ['future state','kaizen','pdca','improvement','lean','tps','value stream',
         'takt time','cycle time','waste','standard work','flow','pull system',
         'hoshin','andon','poka-yoke','five why','root cause','six sigma','dmaic']
          .some(kw => tag.toLowerCase().includes(kw))
      )).slice(0, 10).map((c: any) => `[SOURCE: ${c.section}]\n${c.content?.slice(0, 550)}`).join('\n---\n')

    const stepsText = (steps || []).map((s: any, i: number) =>
      `Step ${i+1}: "${s.name}" [${s.step_type}] CT:${s.cycle_time||'?'}${s.cycle_time_unit||'s'} Wait:${s.wait_time||0}s Defect:${s.defect_rate||0}% WIP:${s.wip||0} VA:${s.is_value_added||'?'}`
    ).join('\n')

    const currentStateContext = currentReport ? `
Current state analysis found:
- PCE: ${currentReport.va_ratio}
- Lead time: ${currentReport.estimated_lead_time}
- Improvement potential: ${JSON.stringify(currentReport.improvement_potential)}
- Top bottlenecks: ${(currentReport.bottlenecks || []).slice(0,3).map((b: any) => b.step_name).join(', ')}
` : ''

    const supeContext = supe_transcript
      ? `\nSupe AI brainstorming session transcript:\n${supe_transcript.slice(0, 2000)}`
      : ''

    // Build industry-aware terminology for the prompt
    const langContext = `Industry terminology for ${industryLabel}:
- Product/output: ${t.product}
- Customer: ${t.customer}  
- Process step: ${t.processStep}
- Cycle time: ${t.cycleTime}
- Wait time: ${t.waitTime}
- Defect: ${t.defect}
- Bottleneck: ${t.bottleneck || 'bottleneck'}
- Gemba (workplace): ${t.gemba}
- Improvement action: ${t.kaizen}
- Value stream: ${t.valueStream}
Use these terms throughout — never use generic lean jargon when this industry has a specific equivalent.`

    const prompt = `You are a senior lean VSM consultant. Create a detailed Future State plan for this ${industryLabel} process.

LEAN KNOWLEDGE:
${knowledge}

${langContext}

TARGET:
Category: ${target_category || 'not specified'}
Statement: ${target_statement}
Value to achieve: ${target_value || 'not specified'} ${target_unit || ''}
Deadline: ${target_deadline || 'not specified'}

CURRENT PROCESS: ${project.name}
${stepsText}
${currentStateContext}${supeContext}

Return ONLY valid JSON:
{
  "target_achievement": "Assessment of how achievable the stated target is based on current data — honest, specific",
  "tolerance_range": "Expected tolerance e.g. ±15% depending on implementation consistency",
  "future_state_steps": [
    {
      "position": 0,
      "name": "step name",
      "step_type": "process",
      "change_type": "improved|eliminated|added|merged|unchanged",
      "change_description": "what specifically changes and why",
      "target_cycle_time": number,
      "cycle_time_unit": "seconds",
      "target_defect_rate": number,
      "target_wip": number,
      "projected_gain": "specific gain e.g. reduce CT by 30s",
      "ci_tool_to_use": "stopwatch|fishbone|fivewhy|waste|kaizen|pdca",
      "is_value_added": "va|nnva|nva"
    }
  ],
  "projected_metrics": {
    "new_lead_time": "estimated future lead time",
    "new_pce": "estimated future PCE %",
    "cycle_time_reduction": "% reduction",
    "defect_reduction": "% reduction",
    "target_gap": "how close does this get to the stated target"
  },
  "action_plan": [
    {
      "sequence": 1,
      "title": "action title",
      "description": "detailed description of what to do",
      "responsible": "who typically owns this type of action",
      "timeframe": "suggested timeframe",
      "ci_tool": "which CI tool to use",
      "expected_outcome": "measurable expected result",
      "dependencies": ["what must happen first"]
    }
  ],
  "what_supe_contributed": "summary of how the brainstorming session shaped this plan",
  "disclaimer": "These projections are based on the data provided and industry benchmarks. Actual results depend on implementation quality, team engagement, and process stability. A tolerance of ±20% should be expected on all projected metrics."
}`

    let futureState: any = {}
    try {
      const raw = await callAI(prompt, 2500)
      if (raw) {
        const clean = raw.replace(/```json\s*/gi,'').replace(/```\s*/gi,'').trim()
        futureState = JSON.parse(clean)
      }
    } catch (e) {
      console.warn('[future-state] AI parse failed')
      futureState = {
        target_achievement: 'Analysis requires complete current state data to project future state accurately.',
        tolerance_range: '±20% based on data completeness',
        future_state_steps: [],
        projected_metrics: { new_lead_time: 'TBD', new_pce: 'TBD', cycle_time_reduction: 'TBD', defect_reduction: 'TBD', target_gap: 'Complete current state data first' },
        action_plan: [],
        disclaimer: 'These projections are based on the data provided and industry benchmarks.',
      }
    }

    // Get existing report version count
    const { count } = await supabase.from('analysis_reports')
      .select('*', { count: 'exact', head: true })
      .eq('project_id', project_id).eq('report_type', 'future_state')

    const report = {
      project_id, user_id: user.id,
      report_type: 'future_state',
      report_version: (count || 0) + 1,
      summary: `Future State plan targeting: ${target_statement}`,
      target_statement, target_category, target_value, target_deadline,
      target_achievement: futureState.target_achievement,
      tolerance_range: futureState.tolerance_range,
      future_state_steps: futureState.future_state_steps || [],
      improvement_potential: futureState.projected_metrics || {},
      action_plan: futureState.action_plan || [],
      disclaimer: futureState.disclaimer || 'Projections based on data provided. ±20% tolerance expected.',
      raw_ai_response: JSON.stringify(futureState),
    }

    // Save target to project
    await supabase.from('projects').update({
      project_target: target_statement,
      target_category, target_value,
      target_deadline: target_deadline || null,
      target_unit,
    }).eq('id', project_id)

    const { data: saved } = await supabase
      .from('analysis_reports').insert(report).select('id').single()

    return NextResponse.json({ success: true, report: { ...report, id: saved?.id }, future_state: futureState })

  } catch (err: any) {
    console.error('[future-state]', err)
    return NextResponse.json({ error: err?.message || 'Future state generation failed' }, { status: 500 })
  }
}
