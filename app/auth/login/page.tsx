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
  const supabase     = createClient()

  const [mode,     setMode]     = useState<'login' | 'signup'>('login')
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [name,     setName]     = useState('')
  const [loading,  setLoading]  = useState(false)

  async function handleGoogleLogin() {
    setLoading(true)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/api/auth/callback?next=${redirect}` },
    })
    if (error) { toast.error(error.message); setLoading(false) }
  }

  async function handleEmailAuth(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: { data: { full_name: name }, emailRedirectTo: `${window.location.origin}/api/auth/callback?next=${redirect}` },
        })
        if (error) throw error
        toast.success('Check your email to confirm your account')
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        router.push(redirect)
        router.refresh()
      }
    } catch (err: any) {
      toast.error(err.message || 'Authentication failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4"
         style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 20%, rgba(100,38,160,0.08) 0%, transparent 60%), #03030D' }}>
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <VesimyLogo size={56} />
          </div>
          <h1 style={{ fontFamily: 'Palatino Linotype,Book Antiqua,Palatino,serif', fontSize: 28, fontWeight: 700, letterSpacing: 1 }}
              className="text-[#D4A208]">
            Vesimy
          </h1>
          <p className="text-sm mt-1" style={{ color: '#7070A0', letterSpacing: 3 }}>CONTINUOUS IMPROVEMENT</p>
        </div>

        <div className="card p-6">
          <div className="flex mb-6 rounded-[8px] overflow-hidden border" style={{ borderColor: '#1A1A40', background: '#080818' }}>
            {(['login', 'signup'] as const).map(m => (
              <button key={m} onClick={() => setMode(m)}
                className="flex-1 py-2 text-sm font-medium transition-all"
                style={{
                  background: mode === m ? 'linear-gradient(135deg,#C49510,#D4A208)' : 'transparent',
                  color:      mode === m ? '#03030D' : '#7070A0',
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
            <div className="flex-1 h-px" style={{ background: '#1A1A40' }} />
            <span className="text-xs" style={{ color: '#38385C' }}>or</span>
            <div className="flex-1 h-px" style={{ background: '#1A1A40' }} />
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
            <p className="text-center mt-4 text-xs" style={{ color: '#38385C' }}>
              <Link href="/auth/reset" className="hover:text-[#D4A208] transition-colors">Forgot password?</Link>
            </p>
          )}
        </div>

        <p className="text-center mt-4 text-xs" style={{ color: '#38385C' }}>
          By continuing you agree to our{' '}
          <Link href="/terms" className="hover:text-[#D4A208]">Terms</Link> and{' '}
          <Link href="/privacy" className="hover:text-[#D4A208]">Privacy Policy</Link>
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
