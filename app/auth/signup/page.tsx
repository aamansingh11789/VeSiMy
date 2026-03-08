// @ts-nocheck
'use client'
// ── app/auth/signup/page.tsx ─────────────────────────────────────────────────
import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import { VesimyLogo } from '@/components/ui/Logo'
import { PLANS } from '@/lib/stripe'

function SignupForm() {
  const router       = useRouter()
  const searchParams = useSearchParams()
  const planKey      = searchParams.get('plan') as string | null
  const plan         = planKey && PLANS[planKey as keyof typeof PLANS] ? PLANS[planKey as keyof typeof PLANS] : null

  const [form,    setForm]    = useState({ name: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')

  async function redirectToCheckout(key: string) {
    try {
      const res  = await fetch('/api/stripe/checkout', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ plan: key }) })
      const data = await res.json()
      if (data.url) window.location.href = data.url
      else router.push('/dashboard')
    } catch { router.push('/dashboard') }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError('')
    const { error: err } = await createClient().auth.signUp({
      email: form.email, password: form.password,
      options: { data: { full_name: form.name } },
    })
    if (err) { setError(err.message); setLoading(false); return }
    if (planKey && planKey !== 'free') await redirectToCheckout(planKey)
    else router.push('/onboarding')
  }

  const handleGoogle = async () => {
    await createClient().auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${location.origin}/api/auth/callback` },
    })
  }

  return (
    <div style={{ minHeight:'100vh', background:'#03030D', display:'flex', alignItems:'center', justifyContent:'center', padding:24 }}>
      <div style={{ width:'100%', maxWidth:420 }}>
        <div style={{ textAlign:'center', marginBottom:32 }}>
          <div style={{ display:'flex', justifyContent:'center', marginBottom:16 }}>
            <VesimyLogo size={48} showText />
          </div>
          <h1 style={{ fontFamily:'Palatino Linotype,serif', fontSize:24, fontWeight:700, color:'#EAE8F4', marginBottom:6 }}>Create your account</h1>
          {plan && planKey !== 'free' ? (
            <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(212,162,8,0.08)', border:'1px solid rgba(212,162,8,0.2)', borderRadius:100, padding:'5px 14px', marginTop:4 }}>
              <span style={{ fontSize:13, color:'#D4A208', fontWeight:600 }}>✦ {plan.name} — ${plan.price}/mo</span>
              <span style={{ fontSize:12, color:'#7070A0' }}>· 14-day free trial</span>
            </div>
          ) : (
            <p style={{ color:'#7070A0', fontSize:14 }}>Free plan · 3 projects · All 6 CI tools</p>
          )}
        </div>

        <div className="card" style={{ padding:28 }}>
          <button onClick={handleGoogle} className="btn btn-ghost" style={{ width:'100%', justifyContent:'center', marginBottom:20, padding:'10px 20px' }}>
            <svg width="18" height="18" viewBox="0 0 18 18"><path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/><path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" fill="#34A853"/><path d="M3.964 10.71c-.18-.54-.282-1.117-.282-1.71s.102-1.17.282-1.71V4.958H.957C.347 6.173 0 7.548 0 9s.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/><path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/></svg>
            Continue with Google
          </button>
          <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:20 }}>
            <div style={{ flex:1, height:1, background:'var(--border)' }} />
            <span style={{ fontSize:12, color:'#38385C' }}>or</span>
            <div style={{ flex:1, height:1, background:'var(--border)' }} />
          </div>
          <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:14 }}>
            <div><label className="label">Full Name</label>
              <input className="input" placeholder="Your name" required value={form.name} onChange={e => setForm(f=>({...f,name:e.target.value}))} /></div>
            <div><label className="label">Work Email</label>
              <input className="input" type="email" placeholder="you@company.com" required value={form.email} onChange={e => setForm(f=>({...f,email:e.target.value}))} /></div>
            <div><label className="label">Password</label>
              <input className="input" type="password" placeholder="8+ characters" minLength={8} required value={form.password} onChange={e => setForm(f=>({...f,password:e.target.value}))} /></div>
            {error && <p style={{ color:'#FF6B6B', fontSize:13, background:'rgba(255,107,107,0.08)', padding:'8px 12px', borderRadius:8 }}>{error}</p>}
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ width:'100%', justifyContent:'center', padding:'11px 20px', marginTop:4 }}>
              {loading
                ? (planKey && planKey !== 'free' ? 'Setting up your trial…' : 'Creating account…')
                : (planKey && planKey !== 'free' ? `Start ${plan?.name} Free Trial` : 'Create Free Account')}
            </button>
          </form>
        </div>

        <p style={{ textAlign:'center', marginTop:14, fontSize:12, color:'#38385C' }}>
          By signing up you agree to our <Link href="/terms" style={{ color:'#7070A0', textDecoration:'none' }}>Terms</Link> and <Link href="/privacy" style={{ color:'#7070A0', textDecoration:'none' }}>Privacy Policy</Link>
        </p>
        <p style={{ textAlign:'center', marginTop:10, fontSize:13, color:'#7070A0' }}>
          Already have an account?{' '}<Link href="/auth/login" style={{ color:'#D4A208', textDecoration:'none' }}>Sign in</Link>
        </p>
      </div>
    </div>
  )
}

export default function SignupPage() {
  return (
    <Suspense>
      <SignupForm />
    </Suspense>
  )
}
