// @ts-nocheck — React.Component class typing requires @types/react which is
// available on Vercel but not in this container. Runtime behaviour is correct.
'use client'
import React from 'react'
import { AlertIcon } from '@/components/ui/Icons'

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    console.error(`[ErrorBoundary:${this.props.name ?? 'unknown'}]`, error, info)
    try {
      window?.posthog?.capture('error_boundary_triggered', {
        name: this.props.name, error: error.message, stack: error.stack?.slice(0, 500),
      })
    } catch {}
  }

  render() {
    if (!this.state.hasError) return this.props.children ?? null
    if (this.props.fallback)  return this.props.fallback
    return (
      <div style={{ padding:32, textAlign:'center', background:'#FFF7ED',
        border:'1px solid #FED7AA', borderRadius:12, margin:16 }}>
        <div style={{ marginBottom:12, display:'flex', justifyContent:'center' }}>
          <AlertIcon size={28} color="#92400E" />
        </div>
        <h3 style={{ fontFamily:'Palatino Linotype,serif', fontSize:18, fontWeight:700,
          color:'#92400E', marginBottom:8 }}>Something went wrong</h3>
        <p style={{ fontSize:13, color:'#78350F', marginBottom:16, maxWidth:380, margin:'0 auto 16px' }}>
          {this.state.error?.message ?? 'An unexpected error occurred.'}
        </p>
        <button onClick={() => this.setState({ hasError:false, error:null })}
          style={{ padding:'8px 20px', borderRadius:7, border:'none',
            background:'#92400E', color:'white', fontSize:13, fontWeight:600, cursor:'pointer' }}>
          Try again
        </button>
      </div>
    )
  }
}

export function withErrorBoundary(Component, name) {
  return function WrappedWithBoundary(props) {
    return (
      <ErrorBoundary name={name ?? Component.displayName ?? Component.name}>
        <Component {...props} />
      </ErrorBoundary>
    )
  }
}
