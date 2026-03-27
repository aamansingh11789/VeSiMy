// @ts-nocheck
'use client'
// ── components/ui/AIAssistPanel.tsx ─────────────────────────────────────────
// Reusable AI assist button + result panel.
// Drops into any tool with zero friction. Never required — always optional.
//
// Usage:
//   <AIAssistButton label="Interpret results" onClick={handleAssist} loading={loading} />
//   <AIResultPanel result={result} source={source} error={error} onClear={clear}
//                  onUse={text => doSomething(text)} />

import { useState } from 'react'

// ── The button ────────────────────────────────────────────────────────────────
export function AIAssistButton({
  label,
  onClick,
  loading,
  disabled,
  small,
}: {
  label: string
  onClick: () => void
  loading?: boolean
  disabled?: boolean
  small?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading || disabled}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        padding: small ? '4px 10px' : '6px 14px',
        borderRadius: 8,
        border: '1px solid rgba(100,38,160,0.3)',
        background: loading ? 'rgba(100,38,160,0.05)' : 'rgba(100,38,160,0.08)',
        color: '#8C44CC',
        fontSize: small ? 11 : 12,
        fontWeight: 600,
        cursor: loading || disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition: 'all 0.15s',
        fontFamily: 'inherit',
        whiteSpace: 'nowrap',
      }}
      onMouseEnter={e => { if (!loading && !disabled) e.currentTarget.style.background = 'rgba(100,38,160,0.14)' }}
      onMouseLeave={e => { e.currentTarget.style.background = loading ? 'rgba(100,38,160,0.05)' : 'rgba(100,38,160,0.08)' }}
    >
      {loading ? (
        <>
          <span style={{ display: 'inline-block', animation: 'aiSpin 0.8s linear infinite', fontSize: 12 }}>⟳</span>
          Thinking…
        </>
      ) : (
        <>
          <span style={{ fontSize:9, fontWeight:800, letterSpacing:.5, fontFamily:"monospace" }}>AI</span>
          {label}
        </>
      )}
      <style>{`@keyframes aiSpin{to{transform:rotate(360deg)}}`}</style>
    </button>
  )
}

// ── The result panel ──────────────────────────────────────────────────────────
export function AIResultPanel({
  result,
  source,
  error,
  onClear,
  onUse,
  useLabel = 'Use this',
  title,
}: {
  result: string | Record<string, any> | null
  source: 'ai' | 'rule' | null
  error: string | null
  onClear: () => void
  onUse?: (result: any) => void
  useLabel?: string
  title?: string
}) {
  if (!result && !error) return null

  const isError = !!error
  const displayText = typeof result === 'string' ? result : result ? JSON.stringify(result, null, 2) : null

  return (
    <div style={{
      marginTop: 10,
      borderRadius: 10,
      border: `1px solid ${isError ? 'rgba(192,64,42,0.25)' : 'rgba(100,38,160,0.2)'}`,
      background: isError ? 'rgba(192,64,42,0.04)' : 'rgba(100,38,160,0.04)',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        padding: '7px 12px',
        borderBottom: `1px solid ${isError ? 'rgba(192,64,42,0.15)' : 'rgba(100,38,160,0.12)'}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: isError ? 'rgba(192,64,42,0.06)' : 'rgba(100,38,160,0.06)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize:9, fontWeight:800, letterSpacing:.5, fontFamily:'monospace' }}>{isError ? '!' : 'AI'}</span>
          <span style={{ fontSize: 10, fontWeight: 700, color: isError ? '#C0402A' : '#8C44CC', fontFamily: 'monospace', letterSpacing: 0.8 }}>
            {isError ? 'ERROR' : source === 'ai' ? (title || 'AI ASSIST') : (title || 'SMART ASSIST')}
          </span>
          {source === 'rule' && !isError && (
            <span style={{ fontSize: 9, color: 'var(--text3)', fontFamily: 'monospace' }}>rule-based · free</span>
          )}
          {source === 'ai' && (
            <span style={{ fontSize: 9, color: 'var(--text3)', fontFamily: 'monospace' }}>AI-powered</span>
          )}
        </div>
        <button
          type="button"
          onClick={onClear}
          style={{ background: 'none', border: 'none', color: 'var(--text3)', cursor: 'pointer', fontSize: 14, padding: '0 2px', lineHeight: 1 }}
        >×</button>
      </div>

      {/* Content */}
      <div style={{ padding: '10px 12px' }}>
        {isError ? (
          <p style={{ fontSize: 12, color: '#C0402A', lineHeight: 1.6, margin: 0 }}>{error}</p>
        ) : displayText ? (
          <p style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.75, margin: 0, whiteSpace: 'pre-line' }}>{displayText}</p>
        ) : null}

        {/* Action buttons */}
        {!isError && result && onUse && (
          <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
            <button
              type="button"
              onClick={() => onUse(result)}
              style={{
                padding: '5px 12px', borderRadius: 6, border: '1px solid rgba(100,38,160,0.3)',
                background: 'rgba(100,38,160,0.1)', color: '#8C44CC', fontSize: 11, fontWeight: 700,
                cursor: 'pointer', fontFamily: 'inherit',
              }}
            >
              {useLabel}
            </button>
            <button
              type="button"
              onClick={onClear}
              style={{
                padding: '5px 10px', borderRadius: 6, border: '1px solid var(--border)',
                background: 'transparent', color: 'var(--text3)', fontSize: 11,
                cursor: 'pointer', fontFamily: 'inherit',
              }}
            >
              Dismiss
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Inline AI badge (for tool headers showing AI is active) ───────────────────
export function AIBadge({ small }: { small?: boolean }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 3,
      padding: small ? '1px 5px' : '2px 7px',
      borderRadius: 100,
      background: 'rgba(100,38,160,0.1)',
      border: '1px solid rgba(100,38,160,0.25)',
      fontSize: small ? 8 : 9,
      fontWeight: 700,
      color: '#8C44CC',
      fontFamily: 'monospace',
      letterSpacing: 0.5,
    }}>
      AI
    </span>
  )
}
