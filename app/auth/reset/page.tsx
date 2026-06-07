// TypeScript enabled
'use client'
// ── app/auth/reset/page.tsx ───────────────────────────────────────────────────
import { useState } from 'react'
import Link         from 'next/link'
import { createClient } from '@/lib/supabase'
import { ArrowLeftIcon, CheckIcon } from '@/components/ui/Icons'


const serif = "'Sora','Inter',sans-serif"
const GOLD  = 'var(--brand)'

export default function ResetPage() {
  const [email,   setEmail]   = useState('')
  const [loading, setLoading] = useState(false)
  const [sent,    setSent]    = useState(false)
  const [error,   setError]   = useState('')

  async function handleReset() {
    setError('')
    if (!email.trim()) { setError('Please enter your email address.'); return }
    setLoading(true)
    try {
      const supabase = createClient()
      const { error: err } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: window.location.origin + '/auth/update-password',
      })
      if (err) { setError(err.message); setLoading(false); return }
      setSent(true)
    } catch { setError('Something went wrong. Please try again.') }
    setLoading(false)
  }

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg)', display:'flex', alignItems:'center', justifyContent:'center', padding:24,
      backgroundImage:'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(11,29,51,0.05) 0%, transparent 60%)' }}>
      <div style={{ maxWidth:420, width:'100%' }}>
        <div style={{ textAlign:'center', marginBottom:36 }}>
          <span style={{ fontFamily:serif, fontWeight:700, fontSize:28 }}>
            <span style={{ color:GOLD }}>V</span>e<span style={{ color:'#A8854F' }}>S</span>i<span style={{ color:'#6CB9FC' }}>M</span>y
          </span>
        </div>
        {sent ? (
          <div style={{ background:'#FFFFFF', border:'1px solid rgba(29,209,161,0.25)', borderRadius:16, padding:'36px 32px', textAlign:'center' }}>
            <div style={{ width:64, height:64, borderRadius:'50%', background:'rgba(29,209,161,0.1)', border:'2px solid #1DD1A1',
              display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px' }}>
              <CheckIcon size={28} color='#1DD1A1' />
            </div>
            <h2 style={{ fontFamily:serif, fontSize:22, fontWeight:700, color:'var(--text)', marginBottom:10 }}>Check your inbox</h2>
            <p style={{ fontSize:14, color:'var(--text3)', lineHeight:1.7, marginBottom:24 }}>
              A reset link was sent to <strong style={{ color:'var(--text)' }}>{email}</strong>. Check your spam folder if it doesn't arrive within a minute.
            </p>
            <Link href="/auth/login" style={{ textDecoration:'none', fontSize:13, color:'var(--text3)', display:'inline-flex', alignItems:'center', gap:6 }}>
              <ArrowLeftIcon size={13} /> Back to sign in
            </Link>
          </div>
        ) : (
          <div style={{ background:'#FFFFFF', border:'1px solid var(--vs-slate-200, #DDE3EA)', borderRadius:16, padding:'36px 32px' }}>
            <h2 style={{ fontFamily:serif, fontSize:24, fontWeight:700, color:'var(--text)', marginBottom:8 }}>Reset your password</h2>
            <p style={{ fontSize:14, color:'var(--text3)', marginBottom:28, lineHeight:1.6 }}>
              Enter the email you signed up with and we'll send a reset link.
            </p>
            <div style={{ marginBottom:16 }}>
              <label style={{ fontSize:12, color:'var(--text3)', letterSpacing:0.5, display:'block', marginBottom:6 }}>EMAIL</label>
              <input type="email" value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==='Enter'&&handleReset()}
                placeholder="you@company.com" className="input" style={{ width:'100%', boxSizing:'border-box' }} />
            </div>
            {error && (
              <div style={{ padding:'10px 14px', borderRadius:8, background:'rgba(255,107,107,0.08)', border:'1px solid rgba(255,107,107,0.25)', fontSize:13, color:'#FF6B6B', marginBottom:16 }}>
                {error}
              </div>
            )}
            <button onClick={handleReset} disabled={loading} style={{ width:'100%', padding:'13px', borderRadius:10, fontSize:15, fontWeight:700, cursor:loading?'wait':'pointer',
              background:'linear-gradient(135deg,#B8880A,var(--brand))', color:'var(--bg)', border:'none', opacity:loading?0.8:1 }}>
              {loading ? 'Sending…' : 'Send Reset Link'}
            </button>
            <div style={{ textAlign:'center', marginTop:20 }}>
              <Link href="/auth/login" style={{ textDecoration:'none', fontSize:13, color:'var(--sl-400)', display:'inline-flex', alignItems:'center', gap:5 }}>
                <ArrowLeftIcon size={12} /> Back to sign in
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
