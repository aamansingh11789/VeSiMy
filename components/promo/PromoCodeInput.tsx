// TypeScript enabled
'use client'
import { CheckIcon, XIcon } from '@/components/ui/Icons'
// ── components/promo/PromoCodeInput.tsx ──────────────────────────────────────
import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import toast from 'react-hot-toast'

interface Props {
  onApply?: (discountPercent: number, planType: string | null) => void
}

export function PromoCodeInput({ onApply }: Props) {
  const [code,    setCode]    = useState('')
  const [status,  setStatus]  = useState<'idle'|'checking'|'valid'|'invalid'>('idle')
  const [message, setMessage] = useState('')

  async function check() {
    if (!code.trim()) return
    setStatus('checking')
    const { data, error } = await createClient()
      .from('promo_codes')
      .select('*')
      .eq('code', code.toUpperCase().trim())
      .eq('is_active', true)
      .single()

    if (error || !data) {
      setStatus('invalid'); setMessage('Invalid or expired code.'); return
    }
    if (data.expires_at && new Date(data.expires_at) < new Date()) {
      setStatus('invalid'); setMessage('This code has expired.'); return
    }
    if (data.usage_limit && data.usage_count >= data.usage_limit) {
      setStatus('invalid'); setMessage('This code has reached its usage limit.'); return
    }

    setStatus('valid')
    setMessage(`${data.discount_percent}% off${data.plan_type ? ` ${data.plan_type} plan` : ''}!`)
    onApply?.(data.discount_percent, data.plan_type)
    toast.success(`Promo code applied, ${data.discount_percent}% off!`)
  }

  const borderColor = status==='valid' ? '#1DD1A1' : status==='invalid' ? 'var(--red)' : 'var(--border2)'
  const msgColor    = status==='valid' ? '#1DD1A1' : 'var(--red)'

  return (
    <div>
      <label className="label">Promo Code</label>
      <div style={{ display:'flex', gap:8 }}>
        <input className="input" placeholder="ENTER CODE" style={{ textTransform:'uppercase', fontFamily:'var(--font-mono)', letterSpacing:2, borderColor }}
          value={code}
          onChange={e => { setCode(e.target.value.toUpperCase()); setStatus('idle'); setMessage('') }}
          onKeyDown={e => e.key==='Enter' && check()} />
        <button onClick={check} disabled={status==='checking'||!code.trim()} className="btn btn-secondary btn-sm" style={{ whiteSpace:'nowrap' }}>
          {status==='checking' ? '⟳' : 'Apply'}
        </button>
      </div>
      {message && (
        <p style={{ marginTop:6, fontSize:11, color:msgColor, display:'flex', alignItems:'center', gap:4 }}>
          {status==='valid' ? <CheckIcon size={12} color='#2E844A'/> : <XIcon size={12} color='#C0402A'/>} {message}
        </p>
      )}
    </div>
  )
}
