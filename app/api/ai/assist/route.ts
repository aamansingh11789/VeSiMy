// @ts-nocheck
// ── app/api/ai/assist/route.ts ───────────────────────────────────────────────
// Unified AI assist endpoint for all tool intelligence features.
// Uses rule-based engine first (free, instant), escalates to AI for
// generative tasks. Gracefully degrades — always returns something useful.
//
// Request: POST { type, data }
// Response: { result: string, source: 'ai' | 'rule' }

import { NextResponse, type NextRequest } from 'next/server'
import { createServerSupabase } from '@/lib/supabase-server'
import { callAI, aiAvailable } from '@/lib/ai/ai-assist'
import {
  interpretTimeStudy,
  prioritiseWastes,
  suggestImprovementTarget,
  suggestNextWhy,
  suggestYamazumiRebalance,
  diagnoseStep,
} from '@/lib/ai/rule-engine'

// ── Auth helper ───────────────────────────────────────────────────────────────
async function getUser(req: NextRequest) {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

// ── Main handler ──────────────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  const user = await getUser(request)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await request.json()
    const { type, data } = body

    switch (type) {

      // ── Time Study: interpret results ───────────────────────────────────────
      case 'timestudy_interpret': {
        const { laps, mean, baseline } = data
        const lapsMs = (laps || []).map((l: any) => l.t || l)
        const ruleResult = interpretTimeStudy(lapsMs, mean || 0, baseline)

        // Enhance with AI if available and we have enough data
        if (aiAvailable() && lapsMs.length >= 3 && mean > 0) {
          const cv = lapsMs.length > 1
            ? (Math.sqrt(lapsMs.reduce((a: number,l: number)=>a+Math.pow(l-mean,2),0)/(lapsMs.length-1))/mean*100).toFixed(1)
            : 0
          const prompt = `You are a lean manufacturing expert. Interpret this time study result in 3-4 concise bullet points.
Step: ${data.stepName || 'Process step'}
Observations: ${lapsMs.length} laps, mean ${(mean/1000).toFixed(1)}s, CV ${cv}%, min ${(Math.min(...lapsMs)/1000).toFixed(1)}s, max ${(Math.max(...lapsMs)/1000).toFixed(1)}s
${baseline ? `Baseline: ${(baseline/1000).toFixed(1)}s` : ''}
Focus on: process stability, whether to collect more data, and the most important recommended next step. Be specific and practical.`

          const aiResult = await callAI(prompt, 300)
          if (aiResult) return NextResponse.json({ result: aiResult, source: 'ai' })
        }

        return NextResponse.json({ result: ruleResult, source: 'rule' })
      }

      // ── Waste ID: prioritise selected wastes ────────────────────────────────
      case 'waste_prioritise': {
        const { selected, notes, stepName, cycletime, takt } = data
        const ruleResult = prioritiseWastes(selected || [], notes || {})

        if (aiAvailable() && (selected || []).length >= 2) {
          const prompt = `You are a lean manufacturing expert. A practitioner has identified these wastes at step "${stepName || 'a process step'}":
${(selected || []).join(', ')}
${Object.entries(notes||{}).map(([k,v])=>`${k}: "${v}"`).join('\n')}
${cycletime ? `Step cycle time: ${cycletime}s` : ''}${takt ? `, Takt time: ${takt}s` : ''}

Rank these wastes by elimination priority (1 = tackle first). For each, give one sentence on why and one concrete action. Be direct and specific.`

          const aiResult = await callAI(prompt, 300)
          if (aiResult) return NextResponse.json({ result: aiResult, source: 'ai' })
        }

        return NextResponse.json({ result: ruleResult, source: 'rule' })
      }

      // ── Improvement Tool: suggest target ───────────────────────────────────
      case 'improvement_target': {
        const { metric, baseline, isBottleneck, takt, stepName } = data
        const { target, rationale, timeline } = suggestImprovementTarget(
          metric || 'Cycle Time', Number(baseline) || 0, !!isBottleneck, Number(takt) || undefined
        )

        const ruleText = `Suggested target: ${target}\nRationale: ${rationale}\nTimeline: ${timeline}`

        if (aiAvailable() && baseline) {
          const prompt = `You are a lean manufacturing expert. Suggest an improvement target for:
Step: ${stepName || 'process step'}
Metric: ${metric}
Current value (baseline): ${baseline}
${isBottleneck ? 'This step is a BOTTLENECK (over Takt Time).' : ''}
${takt ? `Takt Time: ${takt}s` : ''}

Provide: (1) a specific numeric target, (2) why that target is realistic based on lean benchmarks, (3) timeline to achieve it. Be concise — 3 sentences maximum.`

          const aiResult = await callAI(prompt, 200)
          if (aiResult) return NextResponse.json({ result: aiResult, source: 'ai' })
        }

        return NextResponse.json({ result: ruleText, source: 'rule' })
      }

      // ── 5 Why: suggest next why ─────────────────────────────────────────────
      case 'fivewhy_next': {
        const { level, prevAnswer, problem, whysSoFar } = data
        const ruleResult = suggestNextWhy(level || 1, prevAnswer || '')

        if (aiAvailable() && prevAnswer) {
          const prompt = `You are a lean manufacturing expert helping with a 5 Why root cause analysis.
Problem: ${problem || 'Process issue'}
Why chain so far:
${(whysSoFar || []).map((w: string, i: number) => `Why ${i+1}: ${w}`).join('\n')}
Previous answer (Why ${(level||1)-1}): ${prevAnswer}

Suggest a single concise question for "Why ${level}?" that digs deeper toward the systemic root cause. The question should be specific to the previous answer and avoid blaming people. Reply with just the question, nothing else.`

          const aiResult = await callAI(prompt, 80)
          if (aiResult) return NextResponse.json({ result: aiResult.replace(/^["']|["']$/g,''), source: 'ai' })
        }

        return NextResponse.json({ result: ruleResult, source: 'rule' })
      }

      // ── 5 Why: draft countermeasure ─────────────────────────────────────────
      case 'fivewhy_countermeasure': {
        const { rootCause, problem, stepName } = data

        if (!rootCause) return NextResponse.json({ result: 'Enter the root cause first.', source: 'rule' })

        if (aiAvailable()) {
          const prompt = `You are a lean manufacturing expert. Write a countermeasure for this root cause.
Problem: ${problem || 'Process issue'}
Step: ${stepName || 'process step'}
Root cause: ${rootCause}

Write a specific, actionable countermeasure in 1-2 sentences. Include: what action to take, what standard/system to change, and how to verify it worked. Do not include an owner or due date — the user will add those. Be direct and practical.`

          const aiResult = await callAI(prompt, 150)
          if (aiResult) return NextResponse.json({ result: aiResult, source: 'ai' })
        }

        // Rule-based fallback: structured prompt based on root cause patterns
        const rc = rootCause.toLowerCase()
        let fallback = ''
        if (rc.includes('training') || rc.includes('knowledge')) {
          fallback = `Develop and deliver a structured training programme covering ${rootCause.split(' ').slice(0,4).join(' ')}. Verify effectiveness through demonstrated competency assessment, not just sign-off.`
        } else if (rc.includes('procedure') || rc.includes('process') || rc.includes('sop')) {
          fallback = `Revise the procedure to prevent this condition. Add a poka-yoke or checklist step that makes it impossible or immediately visible if the root cause condition arises.`
        } else if (rc.includes('communication') || rc.includes('information') || rc.includes('aware')) {
          fallback = `Implement a structured communication mechanism (visual management, handover checklist, or escalation trigger) to ensure this information reaches the right person at the right time.`
        } else {
          fallback = `Implement a systemic change that prevents the root cause from recurring: modify the process, add an error-proof mechanism, or establish a monitoring system that detects early warning signs.`
        }
        return NextResponse.json({ result: fallback, source: 'rule' })
      }

      // ── Fishbone: generate causes ───────────────────────────────────────────
      case 'fishbone_causes': {
        const { problem, framework, stepName } = data

        if (!problem) return NextResponse.json({ result: null, source: 'rule' })

        if (aiAvailable()) {
          const cats = framework === '6M Manufacturing'
            ? ['Machine', 'Method', 'Material', 'Manpower', 'Measurement', 'Mother Nature']
            : framework === '8P Service'
            ? ['People', 'Process', 'Policies', 'Procedures', 'Place', 'Product', 'Productivity', 'Price']
            : ['Suppliers', 'Systems', 'Skills', 'Surroundings']

          const prompt = `You are a lean manufacturing expert. For this problem at process step "${stepName || 'process step'}", suggest 2 likely causes for each Ishikawa category.

Problem: ${problem}
Framework: ${framework}
Categories: ${cats.join(', ')}

Return ONLY a JSON object like: {"Machine": ["cause1", "cause2"], "Method": ["cause1", "cause2"], ...}
Keep each cause under 8 words. Be specific to the problem described, not generic.`

          const aiResult = await callAI(prompt, 400)
          if (aiResult) {
            try {
              const match = aiResult.match(/\{[\s\S]*\}/)
              if (match) {
                const parsed = JSON.parse(match[0])
                return NextResponse.json({ result: parsed, source: 'ai' })
              }
            } catch { /* fall through to rule */ }
          }
        }

        return NextResponse.json({ result: null, source: 'rule' }) // UI shows empty state gracefully
      }

      // ── Kaizen: draft event ─────────────────────────────────────────────────
      case 'kaizen_draft': {
        const { finding, stepName, principle } = data

        if (aiAvailable() && finding) {
          const prompt = `You are a lean manufacturing expert. Draft a Kaizen event from this finding.
Finding: ${finding}
Step: ${stepName || 'process step'}
Lean principle: ${principle || 'waste elimination'}

Return ONLY a JSON object with these exact fields:
{
  "title": "short action-oriented title (max 60 chars)",
  "description": "1-2 sentences describing what to do",
  "category": one of ["Safety","Quality","Delivery","Cost","Morale","Environment","Productivity","5S"],
  "priority": one of ["low","medium","high","critical"],
  "actions": ["specific action 1", "specific action 2", "specific action 3"]
}
Be specific and actionable. No generic language.`

          const aiResult = await callAI(prompt, 300)
          if (aiResult) {
            try {
              const match = aiResult.match(/\{[\s\S]*\}/)
              if (match) {
                const parsed = JSON.parse(match[0])
                return NextResponse.json({ result: parsed, source: 'ai' })
              }
            } catch { /* fall through */ }
          }
        }

        // Rule-based draft
        return NextResponse.json({
          result: {
            title: `Improve ${stepName || 'step'}: ${(finding || '').slice(0, 40)}`,
            description: finding || '',
            category: 'Quality',
            priority: 'medium',
            actions: ['Investigate root cause', 'Implement countermeasure', 'Verify improvement and update standard'],
          },
          source: 'rule',
        })
      }

      // ── Standard Work: write instruction ───────────────────────────────────
      case 'standard_work_instruction': {
        const { opSteps, stepName, takt } = data

        if (!opSteps || !opSteps.length) {
          return NextResponse.json({ result: 'No operator steps defined. Add steps in the Operator Steps section first.', source: 'rule' })
        }

        if (aiAvailable()) {
          const stepList = opSteps.map((s: any, i: number) =>
            `${i+1}. [${(s.va_type||'').toUpperCase()}] [${(s.step_type||'man').toUpperCase()}] ${s.name} — ${s.time}s`
          ).join('\n')

          const prompt = `You are a lean manufacturing expert. Write a Standard Work Instruction for an operator.
Process step: ${stepName}
${takt ? `Takt Time: ${takt}s` : ''}
Operator tasks:
${stepList}

Write clear, numbered instructions in plain language that a new operator could follow. For each task include the action and any key quality or safety point. Keep each instruction to one sentence. Format as a numbered list.`

          const aiResult = await callAI(prompt, 400)
          if (aiResult) return NextResponse.json({ result: aiResult, source: 'ai' })
        }

        // Rule-based: format the steps as plain instructions
        const instructions = (opSteps || []).map((s: any, i: number) =>
          `${i+1}. ${s.name} [${(s.step_type||'man').toUpperCase()}] — target time: ${s.time}s`
        ).join('\n')
        return NextResponse.json({
          result: `Standard Work Instructions — ${stepName}\n\n${instructions}\n\nTotal time: ${opSteps.reduce((a: number, s: any) => a + s.time, 0)}s${takt ? ` (Takt: ${takt}s)` : ''}`,
          source: 'rule',
        })
      }

      // ── Yamazumi: rebalance suggestion ──────────────────────────────────────
      case 'yamazumi_rebalance': {
        const { operators, takt } = data
        const ruleResult = suggestYamazumiRebalance(operators || [], Number(takt) || 0)

        if (aiAvailable() && (operators||[]).length > 1 && takt) {
          const opList = (operators||[]).map((o: any) =>
            `${o.stepName}: ${o.totalTime}s total (tasks: ${(o.tasks||[]).map((t: any)=>`${t.name} ${t.time}s [${t.va_type}]`).join(', ')})`
          ).join('\n')

          const prompt = `You are a lean manufacturing expert. Suggest how to rebalance this Yamazumi chart.
Takt Time: ${takt}s
Operators and their work:
${opList}

Identify overloaded operators, suggest specific tasks to move between operators to get all operators as close to Takt as possible, and note any NVA tasks to eliminate first. Be specific about which task moves where.`

          const aiResult = await callAI(prompt, 300)
          if (aiResult) return NextResponse.json({ result: aiResult, source: 'ai' })
        }

        return NextResponse.json({ result: ruleResult, source: 'rule' })
      }

      // ── VSM Step: quick diagnosis ───────────────────────────────────────────
      case 'step_diagnose': {
        const { step, takt } = data
        const ruleResult = diagnoseStep(step || {}, Number(takt) || undefined)

        if (aiAvailable() && step) {
          const ct = step.toolData?.stopwatch?.mean || Number(step.cycle_time) || 0
          const wt = Number(step.wait_time) || 0
          const wastes = step.toolData?.waste?.selected || []
          const openKaizens = (step.toolData?.kaizen?.items || []).filter((k: any) => k.status !== 'complete')

          const prompt = `You are a lean manufacturing expert. Give a 2-3 sentence diagnosis of this process step.
Step: ${step.name}
Cycle time: ${ct ? ct+'s' : 'not measured'}
Wait time: ${wt ? wt+'s' : 'none'}
VA type: ${step.va_type || 'not set'}
${takt ? `Takt time: ${takt}s` : ''}
WIP: ${step.wip || 0} units
Defect rate: ${step.defect_rate || 0}%
Uptime: ${step.uptime || 100}%
Wastes identified: ${wastes.join(', ') || 'none'}
Open Kaizen events: ${openKaizens.length}

Identify the single most important improvement opportunity and one specific action to take. Reference the step name and actual numbers. Be direct — no generic lean theory.`

          const aiResult = await callAI(prompt, 200)
          if (aiResult) return NextResponse.json({ result: aiResult, source: 'ai' })
        }

        return NextResponse.json({ result: ruleResult, source: 'rule' })
      }

      // ── Report: executive summary ───────────────────────────────────────────
      case 'report_summary': {
        const { projectName, steps, pce, takt, bottleneck, totalCT, totalWT, openKaizens } = data

        if (aiAvailable()) {
          const prompt = `You are a lean manufacturing expert. Write a 2-paragraph executive summary for this VSM improvement report.

Project: ${projectName}
Process Cycle Efficiency: ${pce}%
Takt Time: ${takt ? takt+'s' : 'not set'}
Total Cycle Time: ${totalCT ? (totalCT/60).toFixed(1)+'min' : 'unknown'}
Total Wait Time: ${totalWT ? (totalWT/60).toFixed(1)+'min' : 'unknown'}
Bottleneck step: ${bottleneck || 'none identified'}
Steps mapped: ${(steps||[]).length}
Open Kaizen events: ${openKaizens || 0}

Paragraph 1: Current state summary — what the data shows about process health.
Paragraph 2: Top 3 improvement priorities and expected benefit if addressed.
Use specific numbers from the data. Write in professional language suitable for a manager or client presentation.`

          const aiResult = await callAI(prompt, 350)
          if (aiResult) return NextResponse.json({ result: aiResult, source: 'ai' })
        }

        // Rule-based executive summary
        const pceLvl = pce < 30 ? 'significantly below' : pce < 60 ? 'below' : pce < 85 ? 'approaching' : 'at'
        const summary = `The value stream for ${projectName || 'this process'} is currently operating at ${pce || 0}% Process Cycle Efficiency — ${pceLvl} the world-class target of 85–95%. Of the total lead time, only ${pce || 0}% is value-adding; the remaining ${100-(pce||0)}% represents wait, queue, and non-value-adding activity.${bottleneck ? ` The primary constraint is ${bottleneck}, which is the bottleneck limiting overall throughput.` : ''}\n\nTop improvement priorities: (1) ${bottleneck ? `Resolve the ${bottleneck} bottleneck` : 'Identify and address the process bottleneck'}; (2) Reduce the largest WIP queues to improve flow and reduce lead time; (3) Close the ${openKaizens || 0} open Kaizen event${openKaizens !== 1 ? 's' : ''} currently in progress. Addressing these three areas in sequence will deliver the highest return on improvement effort.`

        return NextResponse.json({ result: summary, source: 'rule' })
      }

      default:
        return NextResponse.json({ error: `Unknown assist type: ${type}` }, { status: 400 })
    }
  } catch (e) {
    console.error('[ai/assist]', e)
    return NextResponse.json({ error: 'Assist failed' }, { status: 500 })
  }
}
