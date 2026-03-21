// @ts-nocheck
// ── app/auth/login/page.tsx ────────────────────────────────────────────────
'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import toast from 'react-hot-toast'
import { VesimyLogo } from '@/components/ui/Logo'

function LoginForm() {
  const router       = useRouter()
  const searchParams = useSearchParams()
  const redirect     = searchParams.get('redirect') || '/dashboard'
  const authError    = searchParams.get('error')
  const errorMessages: Record<string, string> = {
    oauth_denied:    'Google sign-in was cancelled. Please try again.',
    exchange_failed: 'Sign-in failed. The link may have expired — please try again.',
    no_user:         'Could not retrieve your account. Please try again.',
    unexpected:      'Something went wrong. Please try again or use email sign-in.',
  }
  const authErrorMsg = authError ? (errorMessages[authError] || 'Sign-in failed. Please try again.') : null
  const supabase     = createClient()

  const [mode,     setMode]     = useState<'login' | 'signup'>('login')
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [name,     setName]     = useState('')
  const [loading,  setLoading]  = useState(false)

  async function handleGoogleLogin() {
    setLoading(true)
    // Store intended destination so callback can redirect correctly
    // We cannot pass ?next= as a query param — Supabase rejects URLs
    // that don't exactly match the allowlist (no wildcard query params)
    if (typeof window !== 'undefined' && redirect !== '/dashboard') {
      sessionStorage.setItem('auth_redirect', redirect)
    }
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/api/auth/callback` },
    })
    if (error) { toast.error(error.message); setLoading(false) }
  }

  async function handleEmailAuth(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      if (mode === 'signup') {
        const { data, error } = await supabase.auth.signUp({
          email, password,
          options: { data: { full_name: name }, emailRedirectTo: `${window.location.origin}/api/auth/callback` },
        })
        if (error) throw error
        // If session returned immediately (email confirm disabled) go to onboarding
        // Otherwise show toast and stay on page so user knows to check email
        if (data?.session) {
          router.push('/onboarding')
        } else {
          toast.success('✉️ Check your email — click the link to confirm your account', { duration: 8000 })
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        window.location.href = redirect
      }
    } catch (err: any) {
      toast.error(err.message || 'Authentication failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4"
         style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 20%, rgba(100,38,160,0.08) 0%, transparent 60%), var(--bg)' }}>
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <VesimyLogo size={56} />
          </div>
          <h1 style={{ fontFamily: 'Palatino Linotype,Book Antiqua,Palatino,serif', fontSize: 28, fontWeight: 700, letterSpacing: 1 }}
              className="text-[var(--gold)]">
            Vesimy
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text3)', letterSpacing: 3 }}>CONTINUOUS IMPROVEMENT</p>
        </div>

        <div className="card p-6">
          <div className="flex mb-6 rounded-[8px] overflow-hidden border" style={{ borderColor: 'var(--border)', background: 'var(--bg2)' }}>
            {(['login', 'signup'] as const).map(m => (
              <button key={m} onClick={() => setMode(m)}
                className="flex-1 py-2 text-sm font-medium transition-all"
                style={{
                  background: mode === m ? 'linear-gradient(135deg,#B8880A,var(--gold))' : 'transparent',
                  color:      mode === m ? 'var(--bg)' : 'var(--text3)',
                  fontWeight: mode === m ? 700 : 400,
                }}>
                {m === 'login' ? 'Sign In' : 'Sign Up'}
              </button>
            ))}
          </div>

          <button onClick={handleGoogleLogin} disabled={loading} className="btn btn-ghost w-full mb-4 gap-3" style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:10 }}>
            <svg width="18" height="18" viewBox="0 0 48 48">
              <path fill="#4285F4" d="M47.5 24.5c0-1.6-.1-3.2-.4-4.7H24v8.9h13.2c-.6 3-2.3 5.5-4.9 7.2v6h7.9c4.6-4.2 7.3-10.5 7.3-17.4z"/>
              <path fill="#34A853" d="M24 48c6.5 0 12-2.1 16-5.8l-7.9-6c-2.2 1.5-5 2.3-8.1 2.3-6.2 0-11.5-4.2-13.4-9.9H2.4v6.2C6.4 42.7 14.7 48 24 48z"/>
              <path fill="#FBBC05" d="M10.6 28.6c-.5-1.5-.8-3-.8-4.6s.3-3.1.8-4.6v-6.2H2.4C.9 16.5 0 20.1 0 24s.9 7.5 2.4 10.8l8.2-6.2z"/>
              <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.9 2.3 30.4 0 24 0 14.7 0 6.4 5.3 2.4 13.2l8.2 6.2C12.5 13.7 17.8 9.5 24 9.5z"/>
            </svg>
            Continue with Google
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
            <span className="text-xs" style={{ color: 'var(--sl-400)' }}>or</span>
            <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
          </div>

          <form onSubmit={handleEmailAuth} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="label">Full Name</label>
                <input className="input" type="text" placeholder="Max Patel"
                  value={name} onChange={e => setName(e.target.value)} required />
              </div>
            )}
            <div>
              <label className="label">Email</label>
              <input className="input" type="email" placeholder="max@company.com"
                value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div>
              <label className="label">Password</label>
              <input className="input" type="password" placeholder="••••••••"
                value={password} onChange={e => setPassword(e.target.value)} required minLength={8} />
            </div>
            <button type="submit" disabled={loading} className="btn btn-primary w-full mt-2" style={{ height: 42 }}>
              {loading ? 'Please wait…' : mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          {mode === 'login' && (
            <p className="text-center mt-4 text-xs" style={{ color: 'var(--sl-400)' }}>
              <Link href="/auth/reset" className="hover:text-[var(--gold)] transition-colors">Forgot password?</Link>
            </p>
          )}
        </div>

        <p className="text-center mt-4 text-xs" style={{ color: 'var(--sl-400)' }}>
          By continuing you agree to our{' '}
          <Link href="/terms" className="hover:text-[var(--gold)]">Terms</Link> and{' '}
          <Link href="/privacy" className="hover:text-[var(--gold)]">Privacy Policy</Link>
        </p>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}
