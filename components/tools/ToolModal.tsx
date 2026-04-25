// TypeScript enabled
// ── components/tools/ToolModal.tsx ────────────────────────────────────────────
// Dispatcher for all CI tool modals.
// v4.0: Added OODATool, EightDTool, DMaICTool

'use client'

import StopwatchTool from './StopwatchTool'
import FiveWhyTool from './FiveWhyTool'
import IshikawaTool from './IshikawaTool'
import WasteTool from './WasteTool'
import KaizenTool from './KaizenTool'
import ImprovementTool from './ImprovementTool'
import SMEDTool from './SMEDTool'
import OODATool from './OODATool'
import EightDTool from './EightDTool'
import DMaICTool from './DMaICTool'

export interface ToolModalProps {
  tool: string
  step: {
    id: string
    name: string
    toolData?: Record<string, any>
  }
  onSave: (data: Record<string, any>) => Promise<void>
  onClose: () => void
}

const TOOL_COMPONENTS: Record<string, any> = {
  // Existing tools
  stopwatch:   StopwatchTool,
  fivewhy:     FiveWhyTool,
  ishikawa:    IshikawaTool,
  waste:       WasteTool,
  kaizen:      KaizenTool,
  improvement: ImprovementTool,
  smed:        SMEDTool,
  // v4.0 new tools
  ooda:        OODATool,
  eightd:      EightDTool,
  dmaic:       DMaICTool,
}

export function ToolModal({ tool, step, onSave, onClose }: ToolModalProps) {
  const ToolComponent = TOOL_COMPONENTS[tool]

  if (!ToolComponent) {
    console.warn(`Unknown tool modal requested: ${tool}`)
    return null
  }

  return (
    <ToolComponent
      key={`${tool}-${step.id}`}
      stepId={step.id}
      stepName={step.name}
      data={step.toolData?.[tool] || {}}
      onSave={onSave}
      onClose={onClose}
    />
  )
}

export default ToolModal
