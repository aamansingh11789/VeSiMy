// TypeScript enabled
'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function DemoPage() {
  const router = useRouter()

  // Auto-redirect after 4 seconds
  useEffect(() => {
    const t = setTimeout(() => router.push('/auth/signup?ref=1'), 4000)
    return () => clearTimeout(t)
  }, [])

  return (
    <div style={{
      minHeight: '100vh',
      background: '#1A1714',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '40px 24px', fontFamily: 'Inter, sans-serif',
    }}>
      <div style={{ maxWidth: 540, textAlign: 'center' }}>

        <div style={{ fontSize: 48, marginBottom: 24 }}>⭐</div>

        <h1 style={{
          fontFamily: 'Palatino Linotype, Georgia, serif',
          fontSize: 'clamp(24px,4vw,36px)', fontWeight: 700,
          color: '#F8F7F5', lineHeight: 1.2, marginBottom: 16,
        }}>
          The sample project lives inside the real app.
        </h1>

        <p style={{ fontSize: 15, color: 'rgba(248,247,245,0.6)', lineHeight: 1.8, marginBottom: 12 }}>
          VeSiMy is a web app — there is no separate demo mode.
          The best way to see it is to create a free account and open the
          fully-built <strong style={{ color: '#0176D3' }}>Automotive Seat Assembly</strong> reference project.
        </p>

        <p style={{ fontSize: 14, color: 'rgba(248,247,245,0.4)', lineHeight: 1.7, marginBottom: 32 }}>
          It comes pre-loaded with 6 process steps, 2 sub-assembly branches,
          time studies, a fishbone analysis, 5 Why root cause, waste identification,
          kaizen events, a Yamazumi chart, and standard work — every tool populated
          with real automotive manufacturing data. You can click through everything
          and explore exactly how the platform works.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
          <Link
            href="/auth/signup?ref=1"
            style={{
              padding: '14px 36px', background: '#0176D3', color: '#0D0C0A',
              borderRadius: 10, fontSize: 15, fontWeight: 700, textDecoration: 'none',
              display: 'inline-block',
            }}
          >
            Create free account and open sample project →
          </Link>

          <Link
            href="/"
            style={{ fontSize: 13, color: 'rgba(248,247,245,0.4)', textDecoration: 'none' }}
          >
            ← Back to homepage
          </Link>
        </div>

        <p style={{ fontSize: 11, color: 'rgba(248,247,245,0.2)', marginTop: 28, fontFamily: 'monospace' }}>
          Redirecting automatically in a few seconds…
        </p>

      </div>
    </div>
  )
}
