// @ts-nocheck
import { NextResponse, type NextRequest } from 'next/server'
import { createServerSupabase }           from '@/lib/supabase-server'
import { analyzeSteps }                   from '@/lib/supe-engine'

export async function POST(request: NextRequest) {
  try {
    const { project_id, steps, question, chat_history } = await request.json()
    if (!project_id) return NextResponse.json({ error:'project_id required' }, { status:400 })

    const supabase = await createServerSupabase()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error:'Unauthorized' }, { status:401 })

    const recs       = analyzeSteps(steps)
    const totalCT    = steps.reduce((a:number,s:any) => a+(s.toolData?.stopwatch?.mean||s.cycle_time||0), 0)
    const totalWait  = steps.reduce((a:number,s:any) => a+(Number(s.wait_time)||0), 0)
    const pce        = totalCT+totalWait > 0 ? ((totalCT/(totalCT+totalWait))*100).toFixed(1) : '0'
    const stepSummary = steps.map((s:any) =>
      `• ${s.name}: CT=${s.cycle_time||s.toolData?.stopwatch?.mean||0}s, Wait=${s.wait_time||0}s, Ops=${s.operators||1}, Defect=${s.defect_rate||0}%, Uptime=${s.uptime||100}%`
    ).join('\n')

    let answer = ''
    let insights: string[] = []

    if (process.env.ANTHROPIC_API_KEY) {
      try {
        const systemPrompt = `You are Supe, a world-class lean manufacturing AI mentor built into VeSiMy. You are precise, direct, and practical — you speak like a seasoned lean consultant, not a textbook.

CURRENT PROCESS DATA:
${stepSummary}

PCE: ${pce}%
Active Issues: ${recs.map(r=>`${r.severity.toUpperCase()} - ${r.principle} @ ${r.step_name||'process'}`).join(', ')||'none detected'}

Your responses:
- Always tie advice back to THIS specific process data
- Use lean terminology correctly (VSM, kaizen, SMED, poka-yoke, andon, heijunka, etc.)
- Be specific with numbers and targets where possible
- Keep answers under 150 words unless a detailed calculation is needed
- Never say "great question" or add filler phrases`

        // Build messages — either a conversation or initial analysis
        let messages: any[]

        if (question) {
          // Chat mode — user asked a specific question
          const history = (chat_history || []).map((m:any) => ({ role: m.role, content: m.content }))
          messages = [...history, { role:'user', content: question }]
        } else {
          // Initial analysis mode
          messages = [{ role:'user', content:`Analyze this process and give me 3 specific, actionable lean insights. Focus on the biggest waste opportunities. Be direct and use the actual step names and numbers.` }]
        }

        const res = await fetch('https://api.anthropic.com/v1/messages', {
          method:'POST',
          headers:{ 'Content-Type':'application/json', 'x-api-key':process.env.ANTHROPIC_API_KEY!, 'anthropic-version':'2023-06-01' },
          body: JSON.stringify({ model:'claude-haiku-4-5-20251001', max_tokens:500, system:systemPrompt, messages }),
        })

        if (res.ok) {
          const d = await res.json()
          const text = d.content?.[0]?.text || ''
          if (question) {
            answer = text.trim()
          } else {
            insights = text.split('\n').filter((l:string) => l.trim()).slice(0,5)
          }
        } else {
          const errBody = await res.text()
          console.error('[supe] Anthropic API error:', res.status, errBody)
        }
      } catch(e) { console.error('[supe]', e) }
    }

    return NextResponse.json({ recommendations:recs, insights, answer, issues_found:recs.length })
  } catch(e) {
    console.error('[supe/analyze]', e)
    return NextResponse.json({ error:'Analysis failed' }, { status:500 })
  }
}