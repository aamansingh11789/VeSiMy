// TypeScript enabled
'use client'
import { XIcon } from '@/components/ui/Icons'
// ── components/tools/SOPUpload.tsx ───────────────────────────────────────────
// Upload a SOP file (PDF or TXT) and auto-generate VSM steps from it

import { useState, useRef } from 'react'
import toast from 'react-hot-toast'
import { Modal } from '@/components/ui/Modal'

function Chip({ label, color }: { label: string; color: string }) {
  return (
    <span style={{ fontSize:10, padding:'2px 7px', borderRadius:20, border:`1px solid ${color}40`,
      background:`${color}15`, color, fontFamily:'var(--font-mono)', whiteSpace:'nowrap' }}>
      {label}
    </span>
  )
}


interface ParsedStep { name: string; department?: string; notes?: string; cycle_time?: number; wait_time?: number; setup_time?: number; operators?: string; defect_rate?: number; uptime?: number; wip?: string }
interface Props {
  projectId: string
  onStepsGenerated: (steps: ParsedStep[]) => void
  onClose: () => void
}

export function SOPUpload({ projectId, onStepsGenerated, onClose }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [file,      setFile]      = useState<File|null>(null)
  const [parsing,   setParsing]   = useState(false)
  const [preview,   setPreview]   = useState<ParsedStep[]>([])
  const [manualText,setManualText]= useState('')
  const [mode,      setMode]      = useState<'upload'|'paste'>('paste')

  async function parse() {
    const text = mode==='paste' ? manualText : null
    if (!file && !text) return

    setParsing(true)
    try {
      let body: FormData | string
      let headers: Record<string,string> = {}

      if (mode==='paste') {
        headers['Content-Type'] = 'application/json'
        body = JSON.stringify({ project_id:projectId, text })
      } else {
        const fd = new FormData()
        fd.append('file', file!)
        fd.append('project_id', projectId)
        body = fd
      }

      const res = await fetch('/api/sop/parse', { method:'POST', headers, body })
      const data = await res.json()

      if (!res.ok) { toast.error(data.error||'Parse failed'); return }
      setPreview(data.steps || [])
      if (!data.steps?.length) toast.error('No steps found. Try pasting text directly.')
    } catch (e) {
      toast.error('Failed to parse SOP')
    } finally {
      setParsing(false)
    }
  }

  function confirm() {
    if (!preview.length) return
    // Don't close here, let handleSOPSteps close after DB saves complete
    onStepsGenerated(preview)
  }

  function removeStep(i: number) {
    setPreview(p => p.filter((_,j) => j!==i))
  }

  return (
    <Modal
      title="Import SOP, Auto-Generate Steps"
      onClose={onClose}
      onSave={preview.length > 0 ? confirm : undefined}
      saveLabel={`Add ${preview.length} step${preview.length !== 1 ? 's' : ''} to Project`}
      disableSave={preview.length === 0}
    >
      <div>

        {preview.length === 0 ? (
          <div style={{ padding: 0 }}>
            {/* Mode toggle */}
            <div style={{ display:'flex', gap:6, marginBottom:16 }}>
              {(['upload','paste'] as const).map(m => (
                <button key={m} onClick={() => setMode(m)} style={{ flex:1, padding:'8px', borderRadius:'var(--radius-sm)', border:'1px solid', cursor:'pointer',
                  background:mode===m?'var(--brand-dim)':'transparent', borderColor:mode===m?'var(--brand-glow)':'var(--vs-slate-200, #DDE3EA)',
                  color:mode===m?'var(--brand)':'var(--text2)', fontSize:12, fontWeight:mode===m?700:400 }}>
                  {m==='upload'?'Upload File':'Paste Text'}
                </button>
              ))}
            </div>

            {mode==='upload' ? (
              <div>
                <div onClick={() => inputRef.current?.click()}
                  style={{ border:`2px dashed ${file?'var(--brand)':'var(--vs-slate-200, #DDE3EA)'}`, borderRadius:'var(--radius)', padding:'32px 24px', textAlign:'center', cursor:'pointer',
                    background:file?'var(--brand-dim)':'transparent', transition:'all 0.2s' }}>
                  <div style={{ fontSize:11, fontWeight:800, fontFamily:'var(--font-mono)', letterSpacing:1, color:'var(--text3)', marginBottom:8 }}>{file?'FILE':'UPLOAD'}</div>
                  <div style={{ fontSize:14, color:'var(--text)', fontWeight:500, marginBottom:4 }}>
                    {file ? file.name : 'Click to select a file'}
                  </div>
                  <div style={{ fontSize:12, color:'var(--text3)' }}>Supports: PDF, TXT, DOCX (text content)</div>
                  <input ref={inputRef} type="file" accept=".pdf,.txt,.docx,.doc" style={{ display:'none' }}
                    onChange={e => setFile(e.target.files?.[0]||null)} />
                </div>
                <p style={{ fontSize:12, color:'var(--text3)', marginTop:10, lineHeight:1.6 }}>
                  VeSiMy reads your SOP and identifies process steps automatically. Each numbered item, bullet, or step header becomes a VSM step. You can edit them before adding.
                </p>
              </div>
            ) : (
              <div>
                <label className="label">Paste your SOP text</label>
                <textarea className="input" rows={8} placeholder={'1. Receive raw materials\n2. Inspect for defects\n3. Load into machine\n4. Run process (set: 5 min)\n5. Quality check\n6. Pack and label\n7. Transfer to warehouse'}
                  style={{ resize:'vertical', fontFamily:'var(--font-mono)', fontSize:12, lineHeight:1.6 }}
                  value={manualText} onChange={e => setManualText(e.target.value)} />
                <p style={{ fontSize:12, color:'var(--text3)', marginTop:8 }}>
                  Works best with numbered or bulleted steps. One step per line. Include timing in parentheses like (15 min) and it will be extracted.
                </p>
              </div>
            )}
          </div>
        ) : (
          <div style={{ padding: 0 }}>
            <p style={{ fontSize:13, color:'var(--text2)', marginBottom:14 }}>
              Found <strong style={{ color:'var(--brand)' }}>{preview.length} steps</strong>. Review and remove any that don&apos;t belong, then click Add to Project.
            </p>
            <div style={{ maxHeight:320, overflowY:'auto', display:'flex', flexDirection:'column', gap:6 }}>
              {preview.map((s,i) => (
                <div key={i} style={{ padding:'10px 12px', background:'var(--vs-paper, #F7F8FA)', border:'1px solid var(--vs-slate-200, #DDE3EA)', borderRadius:'var(--radius-sm)' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                    <span style={{ fontSize:11, color:'var(--text3)', fontFamily:'var(--font-mono)', minWidth:22 }}>{i+1}.</span>
                    <input style={{ flex:1, background:'transparent', border:'none', color:'var(--text)', fontSize:13, outline:'none', fontWeight:600 }}
                      value={s.name} onChange={e => setPreview(p => p.map((x,j) => j===i?{...x,name:e.target.value}:x))} />
                    <button onClick={() => removeStep(i)} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--red)', fontSize:14, padding:'0 4px', flexShrink:0 }}><XIcon size={14}/></button>
                  </div>
                  {/* Show extracted fields as chips */}
                  {(s.cycle_time||s.wait_time||s.setup_time||s.operators||s.department||s.defect_rate||s.uptime||s.wip) && (
                    <div style={{ display:'flex', flexWrap:'wrap', gap:4, marginTop:6, paddingLeft:32 }}>
                      {s.department        && <Chip label={s.department} color="#C9A66B" />}
                      {s.operators         && <Chip label={`${s.operators} ops`} color="#6CB9FC" />}
                      {s.cycle_time        && <Chip label={`CT ${s.cycle_time>=60?(s.cycle_time/60).toFixed(0)+'min':s.cycle_time+'s'}`} color="#1DD1A1" />}
                      {s.wait_time         && <Chip label={`Wait ${s.wait_time>=60?(s.wait_time/60).toFixed(0)+'min':s.wait_time+'s'}`} color="#C9A66B" />}
                      {s.setup_time        && <Chip label={`Setup ${s.setup_time>=60?(s.setup_time/60).toFixed(0)+'min':s.setup_time+'s'}`} color="#9B5FE0" />}
                      {s.defect_rate       && <Chip label={`${s.defect_rate}% defect`} color="#FF6B6B" />}
                      {s.uptime            && <Chip label={`${s.uptime}% uptime`} color="#1DD1A1" />}
                      {s.wip               && <Chip label={`WIP ${s.wip}`} color="var(--text3)" />}
                    </div>
                  )}
                  {s.notes && !(s.cycle_time||s.wait_time||s.operators) && (
                    <div style={{ fontSize:11, color:'var(--text3)', marginTop:4, paddingLeft:32 }}>{s.notes}</div>
                  )}
                </div>
              ))}
            </div>
            <button onClick={() => setPreview([])} style={{ marginTop:10, background:'none', border:'none', color:'var(--text3)', fontSize:12, cursor:'pointer' }}>
              ← Parse again
            </button>
          </div>
        )}

        <div className="modal-footer">
          <button onClick={onClose} className="btn btn-ghost btn-sm">Cancel</button>
          {preview.length === 0 ? (
            <button onClick={parse} disabled={parsing||(mode==='upload'&&!file)||(mode==='paste'&&!manualText.trim())}
              className="btn btn-primary btn-sm">
              {parsing ? '⟳ Parsing…' : '⟳ Parse SOP'}
            </button>
          ) : (
            <button onClick={confirm} disabled={!preview.length} className="btn btn-primary btn-sm">
              ＋ Add {preview.length} Steps to Project
            </button>
          )}
        </div>
      </div>
    </Modal>
  )
}
