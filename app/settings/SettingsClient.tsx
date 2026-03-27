// @ts-nocheck
'use client'
import { INDUSTRY_OPTIONS, getIndustryLabel } from '@/lib/industry-language'
// ── app/settings/SettingsClient.tsx ──────────────────────────────────────────

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { createClient } from '@/lib/supabase'
import { PLANS } from '@/lib/plans'
import { CreditCardIcon, CrownIcon, ExternalLinkIcon, CheckIcon } from '@/components/ui/Icons'


interface Props {
  profile: any
  user:    { email?: string }
}

const PLAN_COLOR = { free:'var(--text3)', pro:'#0176D3', enterprise:'#6CB9FC' }

export function SettingsClient({ profile, user }: Props) {
  const router   = useRouter()
  const [portalLoading, setPortalLoading] = useState(false)
  const [saving,        setSaving]        = useState(false)
  const [name,          setName]          = useState(profile?.full_name || '')

  const planKey    = (profile?.plan_tier || 'trial') as keyof typeof PLANS
  const plan       = PLANS[planKey] || PLANS.free
  const isPaid     = planKey !== 'free'
  const isBeta     = profile?.is_beta || profile?.lifetime_access
  const subStatus  = profile?.subscription_status || 'free'
  const periodEnd  = profile?.subscription_period_end ? new Date(profile.subscription_period_end).toLocaleDateString('en-US', { month:'long', day:'numeric', year:'numeric' }) : null

  async function openPortal() {
    setPortalLoading(true)
    try {
      const res  = await fetch('/api/stripe/portal', { method:'POST' })
      const data = await res.json()
      if (data.url) window.location.href = data.url
      else toast.error('Could not open billing portal. Contact support.')
    } catch { toast.error('Network error. Please try again.') }
    setPortalLoading(false)
  }

  async function saveName() {
    setSaving(true)
    const { error } = await createClient().from('profiles').update({ full_name: name }).eq('id', profile.id)
    if (error) toast.error('Failed to save name.')
    else toast.success('Name updated!')
    setSaving(false)
  }

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom:40 }}>
        <h1 style={{ fontFamily:'Palatino Linotype,serif', fontSize:32, fontWeight:700, color:'var(--text)', marginBottom:6 }}>Settings</h1>
        <p style={{ color:'var(--text3)', fontSize:14 }}>Manage your account, subscription, and preferences.</p>
      </div>

      {/* ── Subscription ── */}
      <section style={{ marginBottom:32 }}>
        <h2 style={{ fontSize:13, fontFamily:'monospace', letterSpacing:1.5, color:'var(--text3)', marginBottom:16, textTransform:'uppercase' }}>Subscription</h2>
        <div className="card" style={{ padding:24 }}>
          <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:16, flexWrap:'wrap' }}>
            <div>
              <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8 }}>
                <CrownIcon size={18} color={PLAN_COLOR[planKey] || 'var(--text3)'} />
                <span style={{ fontSize:20, fontWeight:700, color:PLAN_COLOR[planKey] || 'var(--text)', fontFamily:'Palatino Linotype,serif' }}>
                  {isBeta ? 'Lifetime Beta Access' : plan.name}
                </span>
                {(subStatus === 'trialing') && (
                  <span style={{ fontSize:10, background:'rgba(29,209,161,0.12)', color:'#1DD1A1', border:'1px solid rgba(29,209,161,0.2)', borderRadius:100, padding:'2px 10px' }}>TRIAL</span>
                )}
                {(subStatus === 'past_due') && (
                  <span style={{ fontSize:10, background:'rgba(255,107,107,0.12)', color:'#FF6B6B', border:'1px solid rgba(255,107,107,0.2)', borderRadius:100, padding:'2px 10px' }}>PAYMENT FAILED</span>
                )}
              </div>

              <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
                {plan.features.slice(0,3).map((f,i) => (
                  <div key={i} style={{ display:'flex', alignItems:'center', gap:8 }}>
                    <CheckIcon size={12} color='#1DD1A1' strokeWidth={3} />
                    <span style={{ fontSize:13, color:'var(--text3)' }}>{f}</span>
                  </div>
                ))}
              </div>

              {periodEnd && (
                <p style={{ fontSize:12, color:'var(--sl-400)', marginTop:12 }}>
                  {subStatus === 'trialing' ? `Trial ends ${periodEnd}` : `Renews ${periodEnd}`}
                </p>
              )}
            </div>

            <div style={{ display:'flex', flexDirection:'column', gap:10, flexShrink:0 }}>
              {isPaid || isBeta ? (
                <>
                  {!isBeta && (
                    <button onClick={openPortal} disabled={portalLoading} className="btn btn-secondary" style={{ whiteSpace:'nowrap' }}>
                      <CreditCardIcon size={14} />
                      {portalLoading ? 'Opening…' : 'Manage Billing'}
                    </button>
                  )}
                  {!isBeta && (
                    <button onClick={openPortal} disabled={portalLoading} className="btn btn-ghost" style={{ whiteSpace:'nowrap', fontSize:12 }}>
                      <ExternalLinkIcon size={12} />
                      View Invoices
                    </button>
                  )}
                </>
              ) : (
                <Link href="/pricing" className="btn-primary" style={{ whiteSpace:'nowrap', textDecoration:'none', display:'inline-flex', alignItems:'center', gap:6 }}>
                  <CrownIcon size={14} />
                  Upgrade to Pro — $29/mo
                </Link>
              )}
            </div>
          </div>

          {subStatus === 'past_due' && (
            <div style={{ marginTop:16, padding:'12px 16px', background:'rgba(255,107,107,0.08)', border:'1px solid rgba(255,107,107,0.2)', borderRadius:8 }}>
              <p style={{ fontSize:13, color:'#FF6B6B', marginBottom:6, fontWeight:600 }}>Payment failed</p>
              <p style={{ fontSize:12, color:'var(--text3)' }}>Your last payment didn't go through. Update your payment method to keep your Pro access.</p>
              <button onClick={openPortal} style={{ marginTop:10, fontSize:12, color:'#FF6B6B', background:'none', border:'1px solid rgba(255,107,107,0.3)', borderRadius:6, padding:'6px 14px', cursor:'pointer' }}>
                Update Payment Method
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ── Plan comparison ── */}
      {!isPaid && !isBeta && (
        <section style={{ marginBottom:32 }}>
          <div className="card" style={{ padding:24, background:'rgba(1,118,211,0.03)', borderColor:'rgba(1,118,211,0.15)' }}>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12 }}>
              <CrownIcon size={16} color='#0176D3' />
              <span style={{ fontSize:15, fontWeight:700, color:'#0176D3' }}>Upgrade to Pro</span>
              <span style={{ fontSize:12, color:'var(--text3)' }}>— $29/month · 14-day trial when upgrading</span>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:20 }}>
              {PLANS.pro.features.map((f,i) => (
                <div key={i} style={{ display:'flex', alignItems:'center', gap:8 }}>
                  <CheckIcon size={12} color='#0176D3' strokeWidth={3} />
                  <span style={{ fontSize:12, color:'#B0B0C8' }}>{f}</span>
                </div>
              ))}
            </div>
            <Link href="/pricing" className="btn-primary" style={{ textDecoration:'none', display:'inline-flex', alignItems:'center', gap:6 }}>
              <CrownIcon size={14} /> View Plans & Upgrade
            </Link>
          </div>
        </section>
      )}

      {/* ── Account ── */}
      <section style={{ marginBottom:32 }}>
        <h2 style={{ fontSize:13, fontFamily:'monospace', letterSpacing:1.5, color:'var(--text3)', marginBottom:16, textTransform:'uppercase' }}>Account</h2>
        <div className="card" style={{ padding:24 }}>
          <div style={{ display:'flex', flexDirection:'column', gap:18 }}>
            <div>
              <label className="label">Display Name</label>
              <div style={{ display:'flex', gap:10 }}>
                <input className="input" value={name} onChange={e => setName(e.target.value)} placeholder="Your name" style={{ flex:1 }} />
                <button onClick={saveName} disabled={saving || name === profile?.full_name} className="btn btn-secondary">
                  {saving ? 'Saving…' : 'Save'}
                </button>
              </div>
            </div>
            <div>
              <label className="label">Email Address</label>
              <input className="input" value={user.email || ''} disabled style={{ opacity:0.6, cursor:'not-allowed' }} />
              <p style={{ fontSize:11, color:'var(--sl-400)', marginTop:4 }}>Email cannot be changed here. Contact support if needed.</p>
            </div>
            <div>
              <label className="label">Your Industry</label>
              <IndustrySelector profileId={profile.id} currentIndustry={(profile as any).industry} />
              <p style={{ fontSize:11, color:'var(--text3)', marginTop:5 }}>VeSiMy adapts its language to your field — patients, batches, matters, or units, depending on your industry.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Usage ── */}
      <section style={{ marginBottom:32 }}>
        <h2 style={{ fontSize:13, fontFamily:'monospace', letterSpacing:1.5, color:'var(--text3)', marginBottom:16, textTransform:'uppercase' }}>Usage</h2>
        <div className="card" style={{ padding:24 }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:20 }}>
            {[
              ['Projects', `${profile?.projects_count || 0} · unlimited`, '#1DD1A1'],
              ['Plan',      plan.name,                                                                                     PLAN_COLOR[planKey] || 'var(--text3)'],
              ['Status',    isBeta ? 'Lifetime' : subStatus.charAt(0).toUpperCase() + subStatus.slice(1),                 isPaid || isBeta ? '#1DD1A1' : 'var(--text3)'],
            ].map(([label, val, color]) => (
              <div key={label} style={{ textAlign:'center' }}>
                <div style={{ fontSize:22, fontWeight:700, color, fontFamily:'Palatino Linotype,serif' }}>{val}</div>
                <div style={{ fontSize:11, color:'var(--sl-400)', fontFamily:'monospace', letterSpacing:1, textTransform:'uppercase', marginTop:2 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Danger zone ── */}
      <section>
        <h2 style={{ fontSize:13, fontFamily:'monospace', letterSpacing:1.5, color:'#FF6B6B', marginBottom:16, textTransform:'uppercase' }}>Danger Zone</h2>
        <div className="card" style={{ padding:24, borderColor:'rgba(255,107,107,0.15)' }}>
          <p style={{ fontSize:13, color:'var(--text3)', marginBottom:16 }}>
            These actions are permanent and cannot be undone.
          </p>
          <div style={{ display:'flex', gap:12, flexWrap:'wrap' }}>
            {isPaid && !isBeta && (
              <button onClick={openPortal} disabled={portalLoading} className="btn btn-ghost" style={{ fontSize:13, color:'#FF6B6B', borderColor:'rgba(255,107,107,0.2)' }}>
                Cancel Subscription
              </button>
            )}
            <button onClick={async () => {
              if (!confirm('Are you sure? This will sign you out of all devices.')) return
              await createClient().auth.signOut()
      try { (window as any)?.posthog?.reset() } catch {} // clear PostHog identity
              router.push('/')
            }} className="btn btn-ghost" style={{ fontSize:13 }}>
              Sign Out
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
