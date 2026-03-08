// @ts-nocheck
'use client'
// ── app/pricing/page.tsx ──────────────────────────────────────────────────────
// FIX: Added lifetime plan, safe null-price handling, correct icons, enterprise CTA

import { useState }       from 'react'
import { useRouter }      from 'next/navigation'
import Link               from 'next/link'
import { VesimyLogo }     from '@/components/ui/Logo'
import { PLANS }          from '@/lib/stripe'
import { ThemeToggle } from '@/components/ui/ThemeProvider'
import { ArrowLeftIcon, SparkleIcon, CrownIcon, BuildingIcon, CheckIcon, InfinityIcon, ZapIcon } from '@/components/ui/Icons'


const serif = 'Palatino Linotype,Book Antiqua,Palatino,serif'

// ── Safe icon + color per plan ─────────────────────────────────────────────────
const PLAN_META: Record<string,{ icon:any; border:string; bg:string; badge:string|null; highlight:boolean; gold:boolean }> = {
  free:       { icon:SparkleIcon,  border:'rgba(40,40,92,0.5)',     bg:'rgba(8,8,24,0.75)',        badge:null,            highlight:false, gold:false },
  pro:        { icon:ZapIcon,       border:'rgba(212,162,8,0.35)',   bg:'rgba(212,162,8,0.04)',     badge:'Most Popular',  highlight:true,  gold:false },
  lifetime:   { icon:CrownIcon,     border:'rgba(212,162,8,0.5)',    bg:'rgba(212,162,8,0.06)',     badge:'Beta Exclusive', highlight:false, gold:true },
  enterprise: { icon:BuildingIcon, border:'rgba(108,185,252,0.25)', bg:'rgba(108,185,252,0.03)',  badge:'For Teams',     highlight:false, gold:false },
}

export default function PricingPage() {
  const router  = useRouter()
  const [loading, setLoading] = useState<string|null>(null)
  const [annual,  setAnnual]  = useState(false)

  async function handleCheckout(planKey: string) {
    if (planKey === 'free')       { router.push('/auth/signup'); return }
    if (planKey === 'enterprise') { router.push('/enterprise'); return }

    setLoading(planKey)
    try {
      const res  = await fetch('/api/stripe/checkout', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ plan:planKey }) })
      const data = await res.json()
      if (res.status === 401) { router.push(`/auth/signup?plan=${planKey}&next=/pricing`); return }
      if (data.url) window.location.href = data.url
      else alert(data.error || 'Something went wrong. Please try again.')
    } catch (e: any) { alert(e?.message || 'Network error. Check your connection and try again.') }
    finally { setLoading(null) }
  }

  // Safe price calculation — handles null (enterprise) and 0 (free)
  function getDisplayPrice(plan: typeof PLANS[keyof typeof PLANS], key: string): number | null {
    if (plan.price === null || plan.price === undefined) return null  // enterprise
    if (plan.price === 0) return 0
    if (key === 'lifetime') return plan.price  // no annual discount on one-time
    return annual ? Math.round((plan.price as number) * 0.8) : plan.price as number
  }

  function getSavings(plan: typeof PLANS[keyof typeof PLANS], key: string): number {
    if (!plan.price || key === 'lifetime') return 0
    const monthly = plan.price as number
    const disc    = annual ? Math.round(monthly * 0.8) : monthly
    return (monthly - disc) * 12
  }

  return (
    <div style={{ minHeight:'100vh', background:'#03030D',
      backgroundImage:'radial-gradient(ellipse 80% 50% at 20% 0%, rgba(212,162,8,0.06) 0%, transparent 55%), radial-gradient(ellipse 60% 40% at 80% 100%, rgba(100,38,160,0.05) 0%, transparent 55%)',
    }}>
      {/* Nav */}
      <nav style={{ borderBottom:'1px solid rgba(26,26,64,0.6)', padding:'12px 16px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <Link href="/" style={{ textDecoration:'none' }}><VesimyLogo size={36} showText /></Link>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <ThemeToggle size={28} />
          <Link href="/dashboard" style={{ display:'flex', alignItems:'center', gap:6, color:'#7070A0', fontSize:13, textDecoration:'none' }}>
            <ArrowLeftIcon size={14} /> Back to dashboard
          </Link>
        </div>
      </nav>

      {/* Header */}
      <div style={{ textAlign:'center', padding:'64px 24px 48px' }}>
        <div style={{ display:'inline-block', background:'rgba(212,162,8,0.08)', border:'1px solid rgba(212,162,8,0.2)', borderRadius:100, padding:'4px 16px', marginBottom:20 }}>
          <span style={{ fontSize:12, color:'#D4A208', fontFamily:'monospace', letterSpacing:1.5 }}>PRICING</span>
        </div>
        <h1 style={{ fontFamily:serif, fontSize:'clamp(28px,5vw,48px)', fontWeight:700, color:'#EAE8F4', marginBottom:16, lineHeight:1.15 }}>
          Upgrade when VeSiMy<br />earns it.
        </h1>
        <p style={{ fontSize:18, color:'#7070A0', maxWidth:520, margin:'0 auto 36px' }}>
          Start free. No credit card required. Upgrade only when you're ready.
        </p>

        {/* Annual toggle */}
        <div style={{ display:'inline-flex', alignItems:'center', gap:12, background:'rgba(8,8,24,0.8)', border:'1px solid rgba(26,26,64,0.8)', borderRadius:100, padding:'6px 6px 6px 16px' }}>
          <span style={{ fontSize:13, color:annual?'#7070A0':'#EAE8F4', transition:'color 0.2s' }}>Monthly</span>
          <button onClick={() => setAnnual(a=>!a)} style={{ width:44, height:24, borderRadius:100, border:'none', cursor:'pointer', position:'relative', transition:'background 0.2s',
            background:annual?'linear-gradient(135deg,#C49510,#D4A208)':'rgba(40,40,92,0.6)' }}>
            <div style={{ position:'absolute', top:3, left:annual?23:3, width:18, height:18, borderRadius:'50%', background:'#EAE8F4', transition:'left 0.2s' }} />
          </button>
          <span style={{ fontSize:13, color:annual?'#EAE8F4':'#7070A0', transition:'color 0.2s' }}>Annual</span>
          <span style={{ fontSize:11, background:'rgba(29,209,161,0.12)', color:'#1DD1A1', border:'1px solid rgba(29,209,161,0.2)', borderRadius:100, padding:'2px 10px', marginRight:4 }}>
            Save 20%
          </span>
        </div>
      </div>

      {/* Plan cards */}
      <div style={{ maxWidth:1160, margin:'0 auto', padding:'0 16px 80px', display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(min(100%,280px),1fr))', gap:20, alignItems:'start' }}>
        {(Object.entries(PLANS) as [string, typeof PLANS[keyof typeof PLANS]][]).map(([key, plan]) => {
          const meta   = PLAN_META[key] || PLAN_META.free
          const Icon   = meta.icon
          const price  = getDisplayPrice(plan, key)
          const isLoad = loading === key
          const isEnterprise = key === 'enterprise'
          const isLifetime   = key === 'lifetime'

          return (
            <div key={key} id={key} style={{ background:meta.bg, border:`1px solid ${meta.border}`, borderRadius:16, padding:28, position:'relative',
              transform:meta.highlight?'scale(1.03)':'none', boxShadow:meta.highlight?'0 0 40px rgba(212,162,8,0.10)':meta.gold?'0 0 30px rgba(212,162,8,0.08)':'none' }}>

              {/* Badge */}
              {meta.badge && (
                <div style={{ position:'absolute', top:-13, left:'50%', transform:'translateX(-50%)', fontSize:11, fontWeight:700, padding:'3px 14px', borderRadius:100, whiteSpace:'nowrap', letterSpacing:0.5,
                  background: meta.highlight?'linear-gradient(135deg,#C49510,#D4A208)':meta.gold?'linear-gradient(135deg,#C49510,#D4A208)':'rgba(108,185,252,0.15)',
                  border:     meta.highlight||meta.gold?'none':'1px solid rgba(108,185,252,0.3)',
                  color:      meta.highlight||meta.gold?'#03030D':'#6CB9FC' }}>
                  {meta.badge}
                </div>
              )}

              {/* Plan header */}
              <div style={{ marginBottom:24 }}>
                <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12 }}>
                  <div style={{ width:36, height:36, borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center',
                    background: meta.highlight?'rgba(212,162,8,0.12)':meta.gold?'rgba(212,162,8,0.12)':'rgba(40,40,92,0.4)' }}>
                    <Icon size={18} color={meta.highlight||meta.gold?'#D4A208':'#7070A0'} />
                  </div>
                  <span style={{ fontSize:18, fontWeight:700, color:'#EAE8F4', fontFamily:serif }}>{plan.name}</span>
                  {isLifetime && <span style={{ fontSize:10, color:'#D4A208', fontFamily:'monospace', letterSpacing:1 }}>ONE-TIME</span>}
                </div>
                <p style={{ fontSize:13, color:'#7070A0', marginBottom:16, lineHeight:1.5 }}>{plan.description}</p>

                {/* Price */}
                {isEnterprise ? (
                  <div>
                    <div style={{ fontSize:28, fontWeight:700, color:'#6CB9FC', fontFamily:serif }}>Custom</div>
                    <div style={{ fontSize:13, color:'#7070A0', marginTop:4 }}>Based on users & usage</div>
                  </div>
                ) : (
                  <div>
                    <div style={{ display:'flex', alignItems:'baseline', gap:4 }}>
                      <span style={{ fontSize:42, fontWeight:700, fontFamily:serif, color:meta.highlight||meta.gold?'#D4A208':'#EAE8F4' }}>
                        {price === 0 ? 'Free' : `$${price}`}
                      </span>
                      {price !== null && price > 0 && (
                        <span style={{ fontSize:14, color:'#7070A0' }}>
                          {isLifetime ? ' one-time' : `/mo${annual?' · billed annually':''}`}
                        </span>
                      )}
                    </div>
                    {!isLifetime && price !== null && price > 0 && annual && getSavings(plan, key) > 0 && (
                      <p style={{ fontSize:12, color:'#1DD1A1', marginTop:4 }}>Save ${getSavings(plan,key)}/year vs monthly</p>
                    )}
                    {isLifetime && (
                      <p style={{ fontSize:12, color:'#1DD1A1', marginTop:4 }}>No recurring fees. Forever.</p>
                    )}
                  </div>
                )}
              </div>

              {/* CTA */}
              <button onClick={() => handleCheckout(key)} disabled={isLoad} style={{ width:'100%', padding:'11px 20px', borderRadius:10, fontSize:14, fontWeight:700, cursor:isLoad?'wait':'pointer', marginBottom:20, border:'none', transition:'all 0.2s', opacity:isLoad?0.7:1,
                background: meta.highlight||meta.gold?'linear-gradient(135deg,#C49510,#D4A208,#F4A623)':isEnterprise?'rgba(108,185,252,0.12)':'rgba(40,40,92,0.5)',
                color: meta.highlight||meta.gold?'#03030D':isEnterprise?'#6CB9FC':'#EAE8F4',
                boxShadow: meta.highlight?'0 4px 20px rgba(212,162,8,0.3)':meta.gold?'0 4px 16px rgba(212,162,8,0.2)':'none',
                border: isEnterprise?'1px solid rgba(108,185,252,0.25)':'none' as any,
              }}>
                {isLoad ? '⟳ Redirecting…' : isEnterprise ? 'Get a Quote →' : price === 0 ? 'Get Started Free' : plan.cta}
              </button>

              {/* Beta note for lifetime */}
              {isLifetime && (
                <p style={{ fontSize:11, color:'#7070A0', textAlign:'center', marginBottom:16, marginTop:-12 }}>
                  Available during Launch Week only · <Link href="/beta" style={{ color:'#D4A208', textDecoration:'none' }}>Join Launch Week →</Link>
                </p>
              )}

              {/* Features */}
              <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                {plan.features.map((f: string, i: number) => (
                  <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:10 }}>
                    <div style={{ width:18, height:18, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:1,
                      background:meta.highlight||meta.gold?'rgba(212,162,8,0.12)':'rgba(40,40,92,0.5)' }}>
                      <CheckIcon size={10} color={meta.highlight||meta.gold?'#D4A208':'#7070A0'} strokeWidth={3} />
                    </div>
                    <span style={{ fontSize:13, color:'#B0B0C8', lineHeight:1.4 }}>{f}</span>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* Beta CTA strip */}
      <div style={{ maxWidth:860, margin:'0 auto', padding:'0 24px 48px' }}>
        <div style={{ background:'rgba(212,162,8,0.05)', border:'1px solid rgba(212,162,8,0.2)', borderRadius:16, padding:'24px 32px', display:'flex', alignItems:'center', justifyContent:'space-between', gap:20, flexWrap:'wrap' }}>
          <div>
            <div style={{ fontSize:11, color:'#D4A208', letterSpacing:2, fontFamily:'monospace', marginBottom:6 }}>GOLD STANDARD BETA</div>
            <p style={{ fontSize:15, fontWeight:600, color:'#EAE8F4', margin:'0 0 4px' }}>Want the $99 Lifetime plan?</p>
            <p style={{ fontSize:13, color:'#7070A0', margin:0 }}>Join during Launch Week — open to all practitioners. 30-day Pro trial, then $99 Lifetime. Permanent Gold Standard badge.</p>
          </div>
          <Link href="/beta" style={{ textDecoration:'none', padding:'11px 24px', borderRadius:10, fontWeight:700, fontSize:14, whiteSpace:'nowrap',
            background:'linear-gradient(135deg,#C49510,#D4A208)', color:'#03030D' }}>
            Apply for Beta →
          </Link>
        </div>
      </div>

      {/* Trust strip */}
      <div style={{ borderTop:'1px solid rgba(26,26,64,0.6)', padding:'32px 24px', textAlign:'center' }}>
        <div style={{ display:'flex', flexWrap:'wrap', justifyContent:'center', gap:32 }}>
          {['256-bit SSL encryption','Cancel anytime','Stripe-secured payments','No hidden fees','GDPR compliant'].map(t=>(
            <span key={t} style={{ fontSize:12, color:'#38385C', display:'flex', alignItems:'center', gap:5 }}>
              <CheckIcon size={11} color='#1DD1A1' strokeWidth={3} /> {t}
            </span>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div style={{ maxWidth:680, margin:'0 auto', padding:'32px 24px 80px' }}>
        <h2 style={{ fontFamily:serif, fontSize:28, fontWeight:700, color:'#EAE8F4', textAlign:'center', marginBottom:40 }}>Common questions</h2>
        {[
          ['What is the Gold Standard beta?',  'During Launch Week, every practitioner who signs up gets Gold Standard status — a permanent badge on their account. You get 30 days of Pro access free, then a one-time $99 unlocks Lifetime access — 99 projects, forever. After launch week, this offer is gone.'],
          ['Can I switch plans later?',         'Yes — upgrade or downgrade anytime from your account settings. Changes apply immediately.'],
          ['What happens after my free trial?', 'After 14 days you\'ll be prompted to choose a plan. No automatic charges. We send a reminder 3 days before.'],
          ['Is my process data secure?',        'All data is encrypted at rest and in transit. Your VSM maps and process data are private to your account.'],
          ['How does enterprise pricing work?', 'Enterprise is quote-based — $15/user/month with volume discounts at 50, 200, and 500+ users. Add-ons (API, SSO, SLA) stack on top. Gold Standard beta users\' companies get 33% off.'],
          ['Do you offer refunds?',             'Yes — 30-day money-back guarantee on all paid plans, no questions asked.'],
        ].map(([q, a]) => (
          <div key={q} style={{ borderBottom:'1px solid rgba(26,26,64,0.5)', paddingBottom:20, marginBottom:20 }}>
            <p style={{ fontSize:15, fontWeight:600, color:'#EAE8F4', marginBottom:8 }}>{q}</p>
            <p style={{ fontSize:13, color:'#7070A0', lineHeight:1.7 }}>{a}</p>
          </div>
        ))}
      </div>

      <div style={{ borderTop:'1px solid rgba(26,26,64,0.4)', padding:'24px', textAlign:'center' }}>
        <p style={{ fontSize:12, color:'#38385C' }}>
          © 2026 VeSiMy ·{' '}
          <Link href="/terms"   style={{ color:'#38385C', textDecoration:'none' }}>Terms</Link> ·{' '}
          <Link href="/privacy" style={{ color:'#38385C', textDecoration:'none' }}>Privacy</Link>
        </p>
      </div>
    </div>
  )
}
