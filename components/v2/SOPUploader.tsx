// @ts-nocheck
// ── components/v2/SOPUploader.tsx ────────────────────────────────────────────
// Step 1 of V2 project creation: Upload SOP, build manually, or load reference.
'use client'
import { useState, useRef } from 'react'

const BRAND = '#0176D3'; const GREEN = '#2E844A'; const RULE = 'rgba(1,118,211,0.14)'
const ACCEPTED = '.pdf,.docx,.doc,.txt,.md,.csv,.rtf'

interface Props {
  projectId: string
  onParsed: (parsed: any) => void
  onManual: () => void
  onReference: () => void
  industryLabel?: string
}

export function SOPUploader({ projectId, onParsed, onManual, onReference, industryLabel }: Props) {
  const [dragging, setDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [progress, setProgress] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)
  const serif = 'DM Serif Display, Georgia, serif'
  const mono = 'IBM Plex Mono, monospace'

  async function handleFile(file: File) {
    setError(''); setUploading(true); setProgress('Reading file…')
    try {
      const form = new FormData()
      form.append('file', file)
      form.append('project_id', projectId)
      setProgress('Extracting text…')
      const res = await fetch('/api/v2/parse-sop', { method: 'POST', body: form })
      setProgress('Analysing process structure with AI…')
      const data = await res.json()
      if (!res.ok) { setError(data.hint || data.error || 'Parse failed'); setUploading(false); return }
      setProgress(`Found ${data.parsed.steps.length} process steps. Building map…`)
      setTimeout(() => { setUploading(false); setProgress(''); onParsed(data.parsed) }, 800)
    } catch (e: any) {
      setError(e.message || 'Upload failed'); setUploading(false)
    }
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault(); setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  return (
    <div style={{ maxWidth: 680, margin: '0 auto', padding: '48px 24px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 44 }}>
        <div style={{ fontFamily: mono, fontSize: 9, letterSpacing: 2.5, color: BRAND,
          textTransform: 'uppercase', marginBottom: 14 }}>
          {industryLabel ? `${industryLabel} · ` : ''}Step 1 of 2 — Build your process map
        </div>
        <h1 style={{ fontFamily: serif, fontSize: 'clamp(28px,4vw,44px)', fontWeight: 400,
          color: '#0D0C0A', lineHeight: 1.08, marginBottom: 14 }}>
          How would you like<br/>to start?
        </h1>
        <p style={{ fontSize: 15, color: '#6B6760', lineHeight: 1.8, maxWidth: 480, margin: '0 auto',
          fontWeight: 300 }}>
          You can upload an existing SOP, build your process step by step, or explore a reference project to see how it works.
        </p>
      </div>

      {/* Option cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* Upload SOP */}
        <div
          onDragOver={e => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          style={{ background: dragging ? 'rgba(1,118,211,0.06)' : 'white',
            border: `2px ${dragging ? 'solid' : 'dashed'} ${dragging ? BRAND : RULE}`,
            borderRadius: 14, padding: '28px 28px', transition: 'all .2s', cursor: 'pointer',
            position: 'relative' }}
          onClick={() => !uploading && fileRef.current?.click()}>
          <input ref={fileRef} type="file" accept={ACCEPTED} style={{ display: 'none' }}
            onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])}/>
          <div style={{ display: 'flex', gap: 18, alignItems: 'flex-start' }}>
            <div style={{ width: 44, height: 44, borderRadius: 11, background: 'rgba(1,118,211,0.10)',
              border: '1px solid rgba(1,118,211,0.2)', display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>📄</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#0D0C0A', marginBottom: 5 }}>
                Upload an SOP
              </div>
              <div style={{ fontSize: 13, color: '#6B6760', lineHeight: 1.7 }}>
                AI reads your document and maps every step automatically. You'll be able to review and edit everything before analysis.
              </div>
              <div style={{ fontFamily: mono, fontSize: 10, color: '#8E8A82', marginTop: 8, letterSpacing: .5 }}>
                Supports: PDF · DOCX · TXT · MD · CSV · RTF · Max 10MB
              </div>
            </div>
            {!uploading && (
              <div style={{ padding: '8px 16px', background: BRAND, color: 'white',
                borderRadius: 7, fontSize: 13, fontWeight: 600, flexShrink: 0 }}>
                {dragging ? 'Drop it →' : 'Upload →'}
              </div>
            )}
          </div>

          {uploading && (
            <div style={{ marginTop: 16, padding: '12px 16px', background: 'rgba(1,118,211,0.06)',
              borderRadius: 8, display: 'flex', gap: 10, alignItems: 'center' }}>
              <div style={{ width: 14, height: 14, border: `2px solid ${BRAND}`, borderTop: '2px solid transparent',
                borderRadius: '50%', animation: 'spin 0.8s linear infinite', flexShrink: 0 }}/>
              <span style={{ fontSize: 13, color: BRAND }}>{progress}</span>
            </div>
          )}
          {error && (
            <div style={{ marginTop: 12, padding: '10px 14px', background: 'rgba(192,64,42,0.06)',
              border: '1px solid rgba(192,64,42,0.25)', borderRadius: 7, fontSize: 13, color: '#C0402A' }}>
              {error}
            </div>
          )}
        </div>

        {/* Build manually */}
        <button onClick={onManual}
          style={{ background: 'white', border: `1.5px solid ${RULE}`, borderRadius: 14,
            padding: '22px 28px', cursor: 'pointer', display: 'flex', gap: 18, alignItems: 'flex-start',
            textAlign: 'left', transition: 'border-color .15s' }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = BRAND)}
          onMouseLeave={e => (e.currentTarget.style.borderColor = RULE)}>
          <div style={{ width: 44, height: 44, borderRadius: 11, background: 'rgba(46,132,74,0.10)',
            border: '1px solid rgba(46,132,74,0.2)', display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>✏️</div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#0D0C0A', marginBottom: 5 }}>
              Build step by step
            </div>
            <div style={{ fontSize: 13, color: '#6B6760', lineHeight: 1.7 }}>
              Add each step of your process manually. Ideal if you don't have a written SOP yet — this is how you'll create one.
            </div>
          </div>
        </button>

        {/* Reference project */}
        <button onClick={onReference}
          style={{ background: 'white', border: `1.5px solid ${RULE}`, borderRadius: 14,
            padding: '22px 28px', cursor: 'pointer', display: 'flex', gap: 18, alignItems: 'flex-start',
            textAlign: 'left', transition: 'border-color .15s' }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = '#6426A0')}
          onMouseLeave={e => (e.currentTarget.style.borderColor = RULE)}>
          <div style={{ width: 44, height: 44, borderRadius: 11, background: 'rgba(100,38,160,0.10)',
            border: '1px solid rgba(100,38,160,0.2)', display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>📚</div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#0D0C0A', marginBottom: 5 }}>
              Explore a reference project
            </div>
            <div style={{ fontSize: 13, color: '#6B6760', lineHeight: 1.7 }}>
              See a fully built example for your industry — real bottleneck data, root causes, kaizen events, and PDCA cycles. A working template you can learn from.
            </div>
          </div>
        </button>
      </div>

      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  )
}
