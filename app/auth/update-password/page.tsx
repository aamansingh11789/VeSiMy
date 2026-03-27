// @ts-nocheck
'use client'
// ── app/auth/update-password/page.tsx ────────────────────────────────────────
import { useState }  from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { CheckIcon } from '@/components/ui/Icons'

const serif = 'Palatino Linotype,Book Antiqua,Palatino,Georgia,serif'
const GOLD  = 'var(--brand)'

export default function UpdatePasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirm,  setConfirm]  = useState('')
  const [loading,  setLoading]  = useState(false)
  const [done,     setDone]     = useState(false)
  const [error,    setError]    = useState('')

  async function handleUpdate() {
    setError('')
    if (password.length < 8)  { setError('Password must be at least 8 characters.'); return }
    if (password !== confirm)  { setError('Passwords do not match.'); return }
    setLoading(true)
    try {
      const supabase = createClient()
      const { error: err } = await supabase.auth.updateUser({ password })
      if (err) { setError(err.message); setLoading(false); return }
      setDone(true)
      setTimeout(() => router.push('/dashboard'), 2000)
    } catch { setError('Something went wrong. Please try again.') }
    setLoading(false)
  }

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg)', display:'flex', alignItems:'center', justifyContent:'center', padding:24 }}>
      <div style={{ maxWidth:420, width:'100%' }}>
        <div style={{ textAlign:'center', marginBottom:32 }}>
          <span style={{ fontFamily:serif, fontWeight:700, fontSize:28 }}>
            <span style={{ color:GOLD }}>V</span>e<span style={{ color:'#8C44CC' }}>S</span>i<span style={{ color:'#6CB9FC' }}>M</span>y
          </span>
        </div>
        {done ? (
          <div style={{ background:'#FFFFFF', border:'1px solid rgba(29,209,161,0.25)', borderRadius:16, padding:'36px 32px', textAlign:'center' }}>
            <div style={{ width:64, height:64, borderRadius:'50%', background:'rgba(29,209,161,0.1)', border:'2px solid #1DD1A1',
              display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px' }}>
              <CheckIcon size={28} color='#1DD1A1' />
            </div>
            <h2 style={{ fontFamily:serif, fontSize:22, fontWeight:700, color:'var(--text)', marginBottom:10 }}>Password updated</h2>
            <p style={{ fontSize:14, color:'var(--text3)' }}>Redirecting you to your dashboard…</p>
          </div>
        ) : (
          <div style={{ background:'#FFFFFF', border:'1px solid var(--border)', borderRadius:16, padding:'36px 32px' }}>
            <h2 style={{ fontFamily:serif, fontSize:24, fontWeight:700, color:'var(--text)', marginBottom:8 }}>Set a new password</h2>
            <p style={{ fontSize:14, color:'var(--text3)', marginBottom:28 }}>Choose a strong password for your account.</p>
            <div style={{ marginBottom:14 }}>
              <label style={{ fontSize:12, color:'var(--text3)', letterSpacing:0.5, display:'block', marginBottom:6 }}>NEW PASSWORD</label>
              <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Min. 8 characters" className="input" style={{ width:'100%', boxSizing:'border-box' }} />
            </div>
            <div style={{ marginBottom:16 }}>
              <label style={{ fontSize:12, color:'var(--text3)', letterSpacing:0.5, display:'block', marginBottom:6 }}>CONFIRM PASSWORD</label>
              <input type="password" value={confirm} onChange={e=>setConfirm(e.target.value)} onKeyDown={e=>e.key==='Enter'&&handleUpdate()} placeholder="Repeat password" className="input" style={{ width:'100%', boxSizing:'border-box' }} />
            </div>
            {error && (
              <div style={{ padding:'10px 14px', borderRadius:8, background:'rgba(255,107,107,0.08)', border:'1px solid rgba(255,107,107,0.25)', fontSize:13, color:'#FF6B6B', marginBottom:16 }}>
                {error}
              </div>
            )}
            <button onClick={handleUpdate} disabled={loading} style={{ width:'100%', padding:'13px', borderRadius:10, fontSize:15, fontWeight:700, cursor:loading?'wait':'pointer',
              background:'linear-gradient(135deg,#B8880A,var(--brand))', color:'var(--bg)', border:'none', opacity:loading?0.8:1 }}>
              {loading ? 'Updating…' : 'Update Password'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
