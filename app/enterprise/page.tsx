// TypeScript enabled
'use client'
// ── app/enterprise/page.tsx, Dynamic Enterprise Quote Generator ──────────────

import { useState }  from 'react'
import Link          from 'next/link'
import { CheckIcon, ArrowRightIcon } from '@/components/ui/Icons'

const serif = "'Sora','Inter',sans-serif"
const GOLD  = '#0B1D33'

const COMPANY_SIZES = ['1-10','11-50','51-200','201-500','500+']
const ADDONS = [
  { id:'needs_api',        label:'API Access',           price:'$200/mo',  desc:'Integrate VeSiMy data with your ERP / MES' },
  { id:'needs_sso',        label:'SSO / SAML',           price:'$150/mo',  desc:'Okta, Azure AD, Google Workspace' },
  { id:'needs_sla',        label:'SLA Guarantee',        price:'$300/mo',  desc:'99.9% uptime SLA + 4hr support response' },
  { id:'needs_onboarding', label:'Dedicated Onboarding', price:'$500 one-time', desc:'Live onboarding sessions for your team' },
  { id:'needs_custom_int', label:'Custom Integrations',  price:'$250/mo',  desc:'Custom connectors for your specific tools' },
]

function fmtMoney(n: number) {
  return n.toLocaleString('en-US', { style:'currency', currency:'USD', minimumFractionDigits:0 })
}

export default function EnterprisePage() {
  const [form, setForm] = useState({
    company_name:'', contact_email:'', contact_name:'',
    company_size:'', num_users:'10', num_projects:'20',
    needs_api:false, needs_sso:false, needs_sla:false,
    needs_onboarding:false, needs_custom_int:false,
    discount_code:'', notes:'',
  })
  const [quote, setQuote]       = useState<any>(null)
  const [loading, setLoading]   = useState(false)
  const [error,   setError]     = useState('')

  const set = (k: string, v: any) => { setForm(f=>({...f,[k]:v})); setQuote(null) }

  // ── Live estimate (client-side) ───────────────────────────────────────────
  const users   = Math.max(1, parseInt(form.num_users)||1)
  const volDisc = users>=500?0.30:users>=200?0.20:users>=50?0.10:0
  const base    = users * 15
  const addons  = (form.needs_api?200:0)+(form.needs_sso?150:0)+(form.needs_sla?300:0)+(form.needs_custom_int?250:0)
  const monthly = Math.round(base*(1-volDisc) + addons)
  const annual  = Math.round(monthly*10)

  async function getQuote() {
    setError('')
    if (!form.company_name||!form.contact_email||!form.contact_name)
      { setError('Please complete company name, contact name, and email.'); return }
    setLoading(true)
    try {
      const res  = await fetch('/api/enterprise/quote', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(form) })
      const data = await res.json()
      if (!res.ok) { setError(data.error||'Failed to generate quote'); setLoading(false); return }
      setQuote(data)
    } catch { setError('Network error. Please try again.') }
    setLoading(false)
  }

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg)', color:'var(--text)',
      backgroundImage:'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(108,185,252,0.04) 0%, transparent 60%)' }}>
      {/* Nav */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'20px 40px', borderBottom:'1px solid rgba(215,213,206,0.95)' }}>
        <Link href="/" style={{ textDecoration:'none' }}>
          <span style={{ fontFamily:serif, fontWeight:700, fontSize:22 }}>
            <span style={{ color:GOLD }}>V</span>e<span style={{ color:'#A8854F' }}>S</span>i<span style={{ color:'#6CB9FC' }}>M</span>y
          </span>
        </Link>
        <Link href="/pricing" style={{ fontSize:13, color:'var(--text3)', textDecoration:'none' }}>← All Plans</Link>
      </div>

      <div style={{ maxWidth:960, margin:'0 auto', padding:'48px 24px 80px' }}>
        <div style={{ textAlign:'center', marginBottom:48 }}>
          <div style={{ fontSize:11, color:'#6CB9FC', letterSpacing:2, fontFamily:'var(--font-mono)', marginBottom:12 }}>ENTERPRISE PRICING</div>
          <h1 style={{ fontFamily:serif, fontSize:'clamp(28px,4vw,52px)', fontWeight:700, marginBottom:12 }}>
            Build your quote in<br /><span style={{ color:'#6CB9FC' }}>30 seconds.</span>
          </h1>
          <p style={{ fontSize:16, color:'var(--text3)', maxWidth:440, margin:'0 auto' }}>
            Pricing scales with your team. Volume discounts apply automatically. Beta companies get 33% off.
          </p>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 380px', gap:28, alignItems:'start' }}>
          {/* Left: configurator */}
          <div style={{ display:'flex', flexDirection:'column', gap:20 }}>

            {/* Usage */}
            <Card title="Usage">
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
                <div>
                  <label className="label">Number of Users</label>
                  <input className="input" type="number" min="1" value={form.num_users}
                    onChange={e=>set('num_users',e.target.value)} />
                  {volDisc > 0 && <div style={{ fontSize:11, color:'#1DD1A1', marginTop:4 }}>
                    {Math.round(volDisc*100)}% volume discount applied
                  </div>}
                </div>
                <div>
                  <label className="label">Estimated Projects / Month</label>
                  <input className="input" type="number" min="1" value={form.num_projects}
                    onChange={e=>set('num_projects',e.target.value)} />
                </div>
              </div>
            </Card>

            {/* Add-ons */}
            <Card title="Add-ons">
              <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                {ADDONS.map(a => (
                  <button key={a.id} type="button" onClick={()=>set(a.id, !(form as any)[a.id])} style={{ display:'flex', alignItems:'center', gap:14, padding:'14px 16px', borderRadius:10, cursor:'pointer', textAlign:'left', border:'1px solid', transition:'all 0.15s',
                    background: (form as any)[a.id]?'rgba(108,185,252,0.06)':'rgba(248,247,245,0.97)',
                    borderColor: (form as any)[a.id]?'rgba(108,185,252,0.35)':'rgba(184,180,172,0.6)' }}>
                    <div style={{ width:20, height:20, borderRadius:5, border:`2px solid ${(form as any)[a.id]?'#6CB9FC':'var(--vs-slate-200, #DDE3EA)'}`, background:(form as any)[a.id]?'#6CB9FC':'transparent', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                      {(form as any)[a.id] && <CheckIcon size={12} color='var(--bg)' strokeWidth={3} />}
                    </div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:13, fontWeight:600, color:'var(--text)' }}>{a.label}</div>
                      <div style={{ fontSize:11, color:'var(--text3)' }}>{a.desc}</div>
                    </div>
                    <span style={{ fontSize:12, color:'#6CB9FC', whiteSpace:'nowrap', flexShrink:0 }}>{a.price}</span>
                  </button>
                ))}
              </div>
            </Card>

            {/* Contact + code */}
            <Card title="Company Details">
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
                <div>
                  <label className="label">Company Name *</label>
                  <input className="input" value={form.company_name} onChange={e=>set('company_name',e.target.value)} placeholder="Acme Corp" />
                </div>
                <div>
                  <label className="label">Company Size</label>
                  <select className="input" value={form.company_size} onChange={e=>set('company_size',e.target.value)}>
                    <option value="">Select…</option>
                    {COMPANY_SIZES.map(s=><option key={s}>{s} employees</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Contact Name *</label>
                  <input className="input" value={form.contact_name} onChange={e=>set('contact_name',e.target.value)} placeholder="Jane Smith" />
                </div>
                <div>
                  <label className="label">Contact Email *</label>
                  <input className="input" type="email" value={form.contact_email} onChange={e=>set('contact_email',e.target.value)} placeholder="jane@acme.com" />
                </div>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginTop:4 }}>
                <div>
                  <label className="label">Beta Discount Code</label>
                  <input className="input" value={form.discount_code} onChange={e=>set('discount_code',e.target.value.toUpperCase())} placeholder="BETA-XXXX-33" style={{ fontFamily:'var(--font-mono)' }} />
                  <p style={{ fontSize:11, color:'var(--sl-400)', marginTop:4 }}>If you're affiliated with a Gold Standard beta tester</p>
                </div>
                <div>
                  <label className="label">Notes</label>
                  <input className="input" value={form.notes} onChange={e=>set('notes',e.target.value)} placeholder="Anything specific to your needs…" />
                </div>
              </div>
            </Card>

            {error && <div style={{ padding:'12px 16px', borderRadius:8, background:'rgba(255,107,107,0.08)', border:'1px solid rgba(255,107,107,0.3)', fontSize:13, color:'#FF6B6B' }}>{error}</div>}

            <button onClick={getQuote} disabled={loading} style={{ padding:'14px', borderRadius:10, fontSize:15, fontWeight:700, cursor:'pointer', border:'none', display:'flex', alignItems:'center', justifyContent:'center', gap:8,
              background:'linear-gradient(135deg,#1090D4,#6CB9FC)', color:'var(--bg)', opacity:loading?0.8:1 }}>
              {loading ? '⟳ Generating Quote…' : 'Generate My Quote'} <ArrowRightIcon size={16} />
            </button>
          </div>

          {/* Right: live price panel */}
          <div style={{ position:'sticky', top:24 }}>
            <div style={{ background:'rgba(248,247,245,0.97)', border:'1px solid rgba(108,185,252,0.25)', borderRadius:16, padding:'24px', overflow:'hidden' }}>
              <div style={{ fontSize:10, color:'#6CB9FC', letterSpacing:2, fontFamily:'var(--font-mono)', marginBottom:16 }}>LIVE ESTIMATE</div>

              <div style={{ marginBottom:20 }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:4 }}>
                  <span style={{ fontSize:13, color:'var(--text3)' }}>Monthly</span>
                  <span style={{ fontFamily:serif, fontSize:32, fontWeight:700, color:'var(--text)' }}>{fmtMoney(monthly)}</span>
                </div>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline' }}>
                  <span style={{ fontSize:13, color:'var(--text3)' }}>Annual (2 months free)</span>
                  <div style={{ textAlign:'right' }}>
                    <span style={{ fontFamily:serif, fontSize:22, fontWeight:700, color:'#6CB9FC' }}>{fmtMoney(annual)}</span>
                    <div style={{ fontSize:11, color:'#1DD1A1' }}>Save {fmtMoney(monthly*12-annual)}/yr</div>
                  </div>
                </div>
              </div>

              <div style={{ borderTop:'1px solid rgba(215,213,206,0.95)', paddingTop:14, marginBottom:14 }}>
                <div style={{ fontSize:10, color:'var(--sl-400)', letterSpacing:1, fontFamily:'var(--font-mono)', marginBottom:10 }}>BREAKDOWN</div>
                {[
                  ['Base', `${users} users × $15`, fmtMoney(Math.round(users*15))],
                  volDisc>0 ? ['Volume discount', `-${Math.round(volDisc*100)}%`, `-${fmtMoney(Math.round(users*15*volDisc))}`] : null,
                  form.needs_api         ? ['API Access', '', '$200'] : null,
                  form.needs_sso         ? ['SSO / SAML', '', '$150'] : null,
                  form.needs_sla         ? ['SLA', '', '$300'] : null,
                  form.needs_custom_int  ? ['Custom Integrations', '', '$250'] : null,
                ].filter(Boolean).map((row: any, i) => (
                  <div key={i} style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
                    <span style={{ fontSize:12, color:'var(--text3)' }}>{row[0]}{row[1]?' '+row[1]:''}</span>
                    <span style={{ fontSize:12, color: row[2].startsWith('-')?'#1DD1A1':'var(--text)', fontFamily:'var(--font-mono)' }}>{row[2]}</span>
                  </div>
                ))}
              </div>

              {volDisc > 0 && (
                <div style={{ background:'rgba(29,209,161,0.08)', border:'1px solid rgba(29,209,161,0.2)', borderRadius:8, padding:'8px 12px', marginBottom:14 }}>
                  <span style={{ fontSize:12, color:'#1DD1A1' }}>{Math.round(volDisc*100)}% volume discount applied</span>
                </div>
              )}

              {/* Official quote */}
              {quote && (
                <div style={{ background:'rgba(11,29,51,0.06)', border:'1px solid rgba(11,29,51,0.25)', borderRadius:10, padding:'14px', marginTop:8 }}>
                  <div style={{ fontSize:10, color:GOLD, letterSpacing:1, fontFamily:'var(--font-mono)', marginBottom:6 }}>OFFICIAL QUOTE</div>
                  <div style={{ fontSize:13, color:'var(--text)', fontWeight:600, marginBottom:4 }}>Ref: {quote.quote_ref}</div>
                  {quote.breakdown.code_discount && (
                    <div style={{ fontSize:12, color:'#1DD1A1', marginBottom:4 }}>{quote.breakdown.code_discount} applied</div>
                  )}
                  <div style={{ display:'flex', justifyContent:'space-between', marginTop:8 }}>
                    <span style={{ fontSize:12, color:'var(--text3)' }}>Final monthly</span>
                    <span style={{ fontFamily:serif, fontSize:20, fontWeight:700, color:GOLD }}>{fmtMoney(quote.breakdown.final_monthly)}</span>
                  </div>
                  <div style={{ display:'flex', justifyContent:'space-between' }}>
                    <span style={{ fontSize:12, color:'var(--text3)' }}>Annual (2 mo free)</span>
                    <span style={{ fontFamily:serif, fontSize:16, fontWeight:700, color:'#6CB9FC' }}>{fmtMoney(quote.breakdown.annual)}</span>
                  </div>
                  <p style={{ fontSize:11, color:'var(--sl-400)', marginTop:8 }}>Valid 30 days · {quote.quote_ref} · Quote emailed to {form.contact_email}</p>
                </div>
              )}

              {quote && (
                <div style={{ marginTop:20, background:'rgba(29,209,161,0.07)', border:'1px solid rgba(29,209,161,0.22)', borderRadius:12, padding:'18px 20px' }}>
                  <div style={{ fontWeight:700, fontSize:14, color:'#1DD1A1', marginBottom:10 }}>What happens next</div>
                  <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                    {[
                      ['Within 24 hours','Our team reviews your quote and contacts you to confirm details'],
                      ['Kick-off call','30-minute call to align on rollout plan, integrations, and success metrics'],
                      ['90-day pilot','Start with a free pilot on one site or one product line, no risk'],
                    ].map(([step, desc]) => (
                      <div key={step} style={{ display:'flex', gap:12, alignItems:'flex-start' }}>
                        <span style={{ color:'#1DD1A1', fontWeight:700, fontSize:13, flexShrink:0 }}>→</span>
                        <div>
                          <span style={{ color:'var(--text)', fontWeight:600, fontSize:13 }}>{step}: </span>
                          <span style={{ color:'var(--text2)', fontSize:13 }}>{desc}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop:16, display:'flex', gap:10, flexWrap:'wrap' }}>
                    <a
                      href={`mailto:founder@vesimy.com?subject=Enterprise%20Quote%20${encodeURIComponent(quote.quote_ref)}`}
                      style={{ padding:'10px 20px', background:'linear-gradient(135deg,#0a5eaa,#0B1D33)', color:'var(--bg)', fontWeight:700, fontSize:13, borderRadius:10, textDecoration:'none', display:'inline-block' }}
                    >
                      Email us directly →
                    </a>
                    <a
                      href="https://calendly.com/vesimy/enterprise"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ padding:'10px 20px', border:'1px solid rgba(29,209,161,0.3)', color:'#1DD1A1', fontWeight:600, fontSize:13, borderRadius:10, textDecoration:'none', display:'inline-block' }}
                    >
                      Book a call
                    </a>
                  </div>
                </div>
              )}

              <p style={{ fontSize:11, color:'var(--vs-slate-200, #DDE3EA)', textAlign:'center', marginTop:14 }}>
                * Estimate. Official quote locks your price for 30 days.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Card({ title, children }: { title:string; children?:any }) {
  return (
    <div style={{ background:'rgba(248,247,245,0.97)', border:'1px solid rgba(184,180,172,0.6)', borderRadius:14, padding:'22px 24px' }}>
      <p style={{ fontSize:10, color:'#6CB9FC', letterSpacing:2, fontFamily:'var(--font-mono)', marginBottom:18 }}>{title.toUpperCase()}</p>
      {children}
    </div>
  )
}
