// TypeScript enabled
'use client'
import { AlertIcon } from '@/components/ui/Icons'
// ── components/ui/ErrorBoundary.tsx ──────────────────────────────────────────
// Global error boundary — catches React render errors, prevents white screen.
// Wrap around any high-risk subtree (ProjectClient, tools, etc.)

import React from 'react'

interface State { hasError: boolean; error?: Error }

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode; name?: string },
  State
> {
  constructor(props: any) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error(`[ErrorBoundary:${this.props.name || 'unknown'}]`, error, info)
    // PostHog error capture — silent if not available
    try {
      ;(window as any)?.posthog?.capture('error_boundary_triggered', {
        name: this.props.name,
        error: error.message,
        stack: error.stack?.slice(0, 500),
      })
    } catch {}
  }

  render() {
    if (!this.state.hasError) return this.props.children

    if (this.props.fallback) return this.props.fallback

    return (
      <div style={{
        padding: 32, textAlign: 'center', background: '#FFF7ED',
        border: '1px solid #FED7AA', borderRadius: 12, margin: 16,
      }}>
        <div style={{ marginBottom:12, display:"flex", justifyContent:"center" }}><AlertIcon size={28} color="#92400E"/></div>
        <h3 style={{ fontFamily: 'Palatino Linotype,serif', fontSize: 18, fontWeight: 700,
          color: '#92400E', marginBottom: 8 }}>
          Something went wrong
        </h3>
        <p style={{ fontSize: 13, color: '#78350F', marginBottom: 16, maxWidth: 380, margin: '0 auto 16px' }}>
          {this.state.error?.message || 'An unexpected error occurred.'}
        </p>
        <button
          onClick={() => this.setState({ hasError: false, error: undefined })}
          style={{ padding: '8px 20px', borderRadius: 7, border: 'none',
            background: '#92400E', color: 'white', fontSize: 13, fontWeight: 600,
            cursor: 'pointer' }}>
          Try again
        </button>
      </div>
    )
  }
}

// HOC for functional component wrapping
export function withErrorBoundary<T extends object>(
  Component: React.ComponentType<T>,
  name?: string
) {
  return function WrappedWithBoundary(props: T) {
    return (
      <ErrorBoundary name={name || Component.displayName || Component.name}>
        <Component {...props} />
      </ErrorBoundary>
    )
  }
}
