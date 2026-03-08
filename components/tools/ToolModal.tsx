// @ts-nocheck
'use client'
// ── components/tools/ToolModal.tsx ───────────────────────────────────────────
// Routes to the correct CI tool component based on tool ID

import StopwatchTool   from './StopwatchTool'
import FiveWhyTool     from './FiveWhyTool'
import IshikawaTool    from './IshikawaTool'
import WasteTool       from './WasteTool'
import KaizenTool      from './KaizenTool'
import ImprovementTool from './ImprovementTool'

export interface ToolModalProps {
  tool:    string
  step:    { id: string; name: string; toolData?: Record<string, any> }
  onSave:  (data: Record<string, any>) => Promise<void>
  onClose: () => void
}

export function ToolModal({ tool, step, onSave, onClose }: ToolModalProps) {
  const data   = step.toolData?.[tool] || {}
  const common = { stepId: step.id, stepName: step.name, data, onSave, onClose }

  switch (tool) {
    case 'stopwatch':   return <StopwatchTool   {...common} />
    case 'fivewhy':     return <FiveWhyTool     {...common} />
    case 'ishikawa':    return <IshikawaTool    {...common} />
    case 'waste':       return <WasteTool       {...common} />
    case 'kaizen':      return <KaizenTool      {...common} />
    case 'improvement': return <ImprovementTool {...common} />
    default:            return null
  }
}
