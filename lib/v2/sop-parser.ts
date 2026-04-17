// @ts-nocheck
// ── lib/v2/sop-parser.ts ─────────────────────────────────────────────────────

import { callAI } from '@/lib/ai/ai-assist'
import { KNOWLEDGE_CHUNKS } from '@/lib/supe-knowledge'
import { getIndustryTerms, getIndustryLabel } from '@/lib/industry-language'

export const STEP_TYPES = [
  { id: 'process',    label: 'Process Operation',   iso: 'ISO 22468 §5.2' },
  { id: 'decision',   label: 'Decision / Check',    iso: 'ISO 22468 §5.3' },
  { id: 'delay',      label: 'Delay / Wait',        iso: 'ASME Y14.3' },
  { id: 'inspection', label: 'Inspection / QC',     iso: 'ISO 9001 §8.6' },
  { id: 'transport',  label: 'Transport / Move',    iso: 'ISO 22468 §5.4' },
  { id: 'storage',    label: 'Storage / Inventory', iso: 'ISO 22468 §5.4' },
  { id: 'rework',     label: 'Rework / Correction', iso: 'ISO 9001 §8.7' },
  { id: 'start_end',  label: 'Start / End',         iso: 'BPMN 2.0' },
]

export type StepType = 'process'|'decision'|'delay'|'inspection'|'transport'|'storage'|'rework'|'start_end'

export interface ParsedStep {
  position: number; name: string; step_type: StepType
  tasks: string[]; governing_entity: string; department: string; notes: string
  cycle_time_type: 'measured'|'assumed'; cycle_time_unit: string
  missing_info_flags: string[]; from_sop: boolean; sop_original_text: string
  wip: number; operators: number; defect_rate: number; wait_time: number
  flow_type: 'push'|'supermarket'
}

export interface ParsedSOP {
  process_title: string; process_description: string
  governing_entities: string[]; industry_hints: string[]
  steps: ParsedStep[]; missing_fields: string[]; parsing_notes: string
}

export async function extractTextFromFile(buffer: Buffer, filename: string, mimeType: string): Promise<string> {
  const ext = filename.toLowerCase().split('.').pop() || ''
  if (ext === 'docx' || mimeType.includes('wordprocessingml')) {
    const mammoth = await import('mammoth') as any
    const result = await mammoth.extractRawText({ buffer })
    return result.value?.trim() || ''
  }
  if (ext === 'pdf' || mimeType === 'application/pdf') {
    try {
      const pdfParse = await import('pdf-parse') as any
      const result = await pdfParse.default(buffer)
      return result.text?.trim() || ''
    } catch {
      return '[PDF_PARSE_FAILED: Copy-paste the text content manually]'
    }
  }
  return buffer.toString('utf-8').trim()
}

export async function parseSOP(rawText: string, industryId: string): Promise<ParsedSOP> {
  // Pull from uploaded Supe RAG knowledge base — VSM + lean methodology chunks
  const chunks = (KNOWLEDGE_CHUNKS as any[])
    .filter((c: any) => c.tags?.some((t: string) =>
      ['vsm','value stream','process','standard work','lean','tps','kaizen','waste',
       'cycle time','takt','time study','gemba','flow'].some(kw => t.toLowerCase().includes(kw))
    ))
    .slice(0, 5)
    .map((c: any) => c.content?.slice(0, 450))
    .join('\n---\n')

  const prompt = `You are a lean VSM expert (ISO 22468, TPS, Six Sigma). Parse this SOP and return ONLY valid JSON.

INDUSTRY: ${industryLabel}
Industry terminology to use when naming steps and tasks:
- Product/output is called: ${t.product}
- The customer is: ${t.customer}
- A process step is called: ${t.processStep}
- Cycle time is called: ${t.cycleTime}
- Defect is called: ${t.defect}
- The workplace is called: ${t.gemba}
Use these terms for step names and task descriptions where appropriate.
LEAN CONTEXT: ${chunks}

SOP TEXT:
===
${rawText.slice(0, 7000)}
===

Return this JSON structure only, no markdown:
{"process_title":"string","process_description":"string","governing_entities":["array"],"industry_hints":["array"],"missing_fields":["array"],"parsing_notes":"string","steps":[{"position":0,"name":"string","step_type":"process|decision|delay|inspection|transport|storage|rework|start_end","tasks":["physical task 1","physical task 2"],"governing_entity":"string","department":"string","notes":"string","cycle_time_type":"measured|assumed","cycle_time_unit":"seconds|minutes|hours|days|weeks","missing_info_flags":["cycle_time","operators","defect_rate"],"from_sop":true,"sop_original_text":"exact original text","wip":0,"operators":1,"defect_rate":0,"wait_time":0,"flow_type":"push"}]}

Rules: Extract EVERY step. Use step_type decision for approvals/checks/if-statements. Flag missing_info_flags for any unmeasured fields. tasks = physical activities happening in this step.`

  try {
    const raw = await callAI(prompt, 3000)
    if (!raw) throw new Error('empty AI response')
    const clean = raw.replace(/```json\s*/gi,'').replace(/```\s*/gi,'').trim()
    const parsed = JSON.parse(clean) as ParsedSOP
    if (!parsed.steps?.length) throw new Error('no steps')
    parsed.steps = parsed.steps.map((s, i) => ({
      ...s, position: i,
      tasks: Array.isArray(s.tasks) ? s.tasks : [],
      missing_info_flags: Array.isArray(s.missing_info_flags) ? s.missing_info_flags : ['cycle_time'],
      from_sop: true,
    }))
    return parsed
  } catch (err: any) {
    console.error('[parseSOP] failed:', err.message)
    return {
      process_title: 'Uploaded Process',
      process_description: 'Review each step and complete missing information.',
      governing_entities: [], industry_hints: [],
      missing_fields: ['All steps need manual review'],
      parsing_notes: 'Auto-parse encountered an issue. Please review and edit each step.',
      steps: rawText.split(/\n\n+/).filter(p=>p.trim().length>20).slice(0,20).map((t,i)=>({
        position:i, name:t.replace(/^\d+[\.\)]\s+/,'').slice(0,60).trim(),
        step_type:'process' as StepType, tasks:[t.trim()], governing_entity:'',
        department:'', notes:'', cycle_time_type:'assumed', cycle_time_unit:'seconds',  // FIX: was 'minutes' — all calculations assume seconds
        missing_info_flags:['cycle_time','operators','defect_rate','department'],
        from_sop:true, sop_original_text:t.trim(), wip:0, operators:1,
        defect_rate:0, wait_time:0, flow_type:'push',
      })),
    }
  }
}
