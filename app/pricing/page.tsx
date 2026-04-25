// TypeScript enabled
// ── app/pricing/page.tsx ──────────────────────────────────────────────────
// VeSiMy v4.0 pricing page — 4 tiers: Free Start / Free Trial / Pro / Enterprise
// SPRING25 promo code active

'use client'

import type React from 'react'
import { useState } from 'react'
import Link from 'next/link'
import { VLogoMark, VeSiMyWordmark } from '@/components/ui/Logo'
import { ArrowLeftIcon } from '@/components/ui/Icons'

// ── Design tokens ─────────────────────────────────────────────────────────
const C = {
  bg0:      '#02040D',
  bg1:      '#060C1A',
  bg2:      '#0A1228',
  bg3:      '#0F1830',
  bg4:      '#162040',
  blue:     '#3B7CFF',
  blueDim:  '#2760E0',
  blueGlow: 'rgba(59,124,255,0.15)',
  blueBdr:  'rgba(59,124,255,0.25)',
  blueLight:'#90BAFF',
  cyan:     '#22D3EE',
  purple:   '#A78BFA',
  t1:       '#EEF2FF',
  t2:       '#8B9CC8',
  t3:       '#4B5880',
  t4:       '#2A3455',
  b1:       'rgba(255,255,255,0.04)',
  b2:       'rgba(255,255,255,0.07)',
  b3:       'rgba(255,255,255,0.12)',
}

const cardShadow = `
  inset 0 1px 0 rgba(255,255,255,0.07),
  inset 0 -1px 0 rgba(0,0,0,0.5),
  3px 3px 0 rgba(4,8,20,0.9),
  6px 6px 0 rgba(3,6,15,0.7),
  9px 9px 0 rgba(2,4,10,0.4),
  0 16px 40px rgba(0,0,0,0.7)
`
const marbleShadow = `
  inset 0 1px 0 rgba(255,255,255,0.6),
  inset 0 -1px 0 rgba(0,0,0,0.3),
  3px 3px 0 rgba(80,80,80,0.4),
  6px 6px 0 rgba(60,60,60,0.3),
  9px 9px 0 rgba(40,40,40,0.2),
  0 16px 40px rgba(0,0,0,0.6)
`
const btnShadow = `
  inset 0 1px 0 rgba(255,255,255,0.25),
  inset 0 -1px 0 rgba(0,0,0,0.3),
  0 2px 0 rgba(20,50,140,0.9),
  0 4px 0 rgba(15,38,105,0.7),
  0 8px 24px rgba(59,124,255,0.25)
`

// ── Tier data ─────────────────────────────────────────────────────────────
interface Tier {
  id:            string
  label:         string
  price:         number | null
  priceMonthly:  number | null
  priceAnnual:   number | null
  priceSub:      string
  priceSubAnnual?:string
  tagline:       string
  cta:           string
  ctaHref:       string
  ctaStyle:      'primary' | 'outline'
  badge:         string | null
  accentColor:   string
  marble?:       boolean
  promoCode?:    string
  promoDetail?:  string
  features:      string[]
  notIncluded:   string[]
}

const TIERS: Tier[] = [
  {
    id: 'free_start',
    label: 'Free Start',
    price: null,
    priceMonthly: null,
    priceAnnual:  null,
    priceSub: 'No account required',
    tagline: 'Map any process in under 5 minutes and get a real AI lean report sent to your inbox.',
    cta: 'Map a Process Now',
    ctaHref: '/start',
    ctaStyle: 'outline',
    badge: null,
    accentColor: C.cyan,
    features: [
      '6-step guided flow',
      'AI-generated lean report (emailed)',
      'Waste identification',
      'First improvement action',
      'No login required',
      '1 report per 24 hours',
    ],
    notIncluded: ['Saved process maps', 'VSM canvas', 'Pro methodology tools', 'Team collaboration'],
  },
  {
    id: 'free_trial',
    label: 'Free Trial',
    price: null,
    priceMonthly: null,
    priceAnnual:  null,
    priceSub: '14-day trial, no card required',
    tagline: 'Full platform access. Build real process maps, run PDCA cycles, and explore every tool.',
    cta: 'Start Free Trial',
    ctaHref: '/auth/signup',
    ctaStyle: 'outline',
    badge: 'Most Popular Start',
    accentColor: C.blue,
    features: [
      'Everything in Free Start',
      'VeSiMy Guided (8-step onboarding)',
      'VSM canvas — up to 3 maps',
      'PDCA, 8D, DMAIC, OODA tools',
      'AI lean analysis (5 reports/month)',
      'Industry-specific templates',
      'Mobile and desktop',
      'Single user',
    ],
    notIncluded: ['Unlimited maps', 'Full AI report engine', 'Team collaboration', 'Skill matrix'],
  },
  {
    id: 'pro',
    label: 'Pro',
    price: 29,
    priceMonthly: 29,
    priceAnnual:  23,
    priceSub: 'per month, billed monthly',
    priceSubAnnual: '$23/mo billed annually — save $72/yr',
    tagline: 'The full VeSiMy platform for lean practitioners who need to move fast and prove results.',
    cta: 'Get Pro',
    ctaHref: '/auth/signup?plan=pro',
    ctaStyle: 'primary',
    badge: 'Best Value',
    accentColor: C.t1,
    marble: true,
    promoCode: 'SPRING25',
    promoDetail: 'Use code SPRING25 for 25% off your first 3 months',
    features: [
      'Everything in Free Trial',
      'Unlimited VSM maps',
      'Full AI lean report engine',
      'AI Supe assistant',
      'All methodology tools (unlimited)',
      'Version history and snapshots',
      'PDF and Excel export',
      'Priority email support',
      'Single user',
    ],
    notIncluded: ['Team collaboration', 'Skill matrix (team)', 'Enterprise SLA'],
  },
  {
    id: 'enterprise',
    label: 'Enterprise',
    price: null,
    priceMonthly: null,
    priceAnnual:  null,
    priceSub: 'Annual contract, team seats',
    tagline: 'Multi-user deployment with team collaboration, skill matrix, and enterprise SLA.',
    cta: 'Contact Sales',
    ctaHref: '/enterprise',
    ctaStyle: 'outline',
    badge: null,
    accentColor: C.purple,
    features: [
      'Everything in Pro',
      'Team collaboration (live maps)',
      'Skill matrix — track team capability',
      'Multi-user seat management',
      'SSO / SAML integration',
      'Dedicated onboarding',
      'SLA and uptime guarantee',
      'Custom industry templates',
      'Analytics dashboard',
      'Quarterly review calls',
    ],
    notIncluded: [],
  },
]

const FAQS: { q: string; a: string }[] = [
  {
    q: 'What is the difference between Free Start and Free Trial?',
    a: 'Free Start requires no account at all. You map a process at vesimy.com/start, submit your email, and receive an AI lean report. Free Trial creates an account and gives you full platform access for 14 days, including the VSM canvas, all methodology tools, and VeSiMy Guided onboarding.',
  },
  {
    q: 'Do I need a credit card to start the free trial?',
    a: 'No. The 14-day free trial requires no payment information. You will be prompted to add a card only if you choose to upgrade to Pro before or after the trial ends.',
  },
  {
    q: 'Can I use the SPRING25 promo code?',
    a: 'Yes. SPRING25 is active and gives you 25% off your first 3 months of a Pro plan. Apply it at checkout when upgrading.',
  },
  {
    q: 'What happens to my maps if I do not upgrade after the trial?',
    a: 'Your account and all saved maps remain accessible for viewing. Editing and new map creation require an active Pro plan.',
  },
  {
    q: 'Is VeSiMy ISO 22468 compliant?',
    a: 'Yes. VeSiMy follows ISO 22468 Value Stream Management methodology standards. All VSM notation, phase structure, and metric definitions align with the standard.',
  },
  {
    q: 'Can I export my process maps?',
    a: 'Pro and Enterprise users can export maps as PDF and Excel files. Free Trial users can view and edit but cannot export.',
  },
]

// ── Component ─────────────────────────────────────────────────────────────
export default function PricingPage() {
  const [annual,     setAnnual]     = useState(false)
  const [hoveredId,  setHoveredId]  = useState<string | null>(null)
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(null)

  return (
    <div style={{
      background:  C.bg0,
      minHeight:   '100vh',
      fontFamily:  '-apple-system,BlinkMacSystemFont,"Segoe UI","Satoshi",Arial,sans-serif',
      color:       C.t1,
      position:    'relative',
    }}>
      {/* Dot grid */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
        backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.18) 1px, transparent 1px)`,
        backgroundSize: '28px 28px', opacity: 0.16,
      }} />

      {/* Nav */}
      <nav style={{
        position:     'sticky', top: 0, zIndex: 100,
        padding:      '0 24px',
        height:       60,
        display:      'flex', alignItems: 'center', justifyContent: 'space-between',
        background:   'rgba(2,4,13,0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: `1px solid ${C.b1}`,
      }}>
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
          <VLogoMark size={28} />
          <VeSiMyWordmark size={15} onDark />
        </Link>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <Link href="/auth/login" style={{ textDecoration: 'none', color: C.t2, fontSize: 14, fontWeight: 500 }}>Log in</Link>
          <Link href="/auth/signup" style={{ textDecoration: 'none' }}>
            <button style={{
              padding: '8px 18px', borderRadius: 8, border: 'none',
              background: C.blue, color: '#fff', fontSize: 14, fontWeight: 700,
              cursor: 'pointer', fontFamily: 'inherit',
            }}>Start free</button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{
        position: 'relative', zIndex: 1,
        padding: '80px 24px 60px', textAlign: 'center', maxWidth: 720, margin: '0 auto',
      }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: C.blueGlow, border: `1px solid ${C.blueBdr}`,
          borderRadius: 20, padding: '5px 14px', marginBottom: 24,
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: C.blue, display: 'block' }} />
          <span style={{ fontSize: 12, color: C.blueLight, letterSpacing: '0.08em', fontWeight: 700, textTransform: 'uppercase' }}>Pricing</span>
        </div>

        <h1 style={{
          fontSize: 'clamp(32px, 6vw, 56px)',
          fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.08,
          margin: '0 0 16px',
          textShadow: '0 2px 0 rgba(0,0,0,0.4), 0 6px 20px rgba(0,0,0,0.5)',
        }}>
          Start free.{' '}
          <span style={{
            background: `linear-gradient(135deg, ${C.blue} 0%, ${C.cyan} 100%)`,
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>Build something real.</span>
        </h1>

        <p style={{ fontSize: 17, color: C.t2, lineHeight: 1.7, maxWidth: 520, margin: '0 auto 36px' }}>
          No account needed to start. No card needed to try. Every plan includes AI-powered lean
          analysis built on real methodology.
        </p>

        {/* Annual toggle */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 4,
          background: C.bg2, border: `1px solid ${C.b2}`,
          borderRadius: 100, padding: '4px',
          boxShadow: cardShadow,
        }}>
          {(['Monthly', 'Annual'] as const).map(label => {
            const isAnn = label === 'Annual'
            const active = isAnn ? annual : !annual
            return (
              <button
                key={label}
                onClick={() => setAnnual(isAnn)}
                style={{
                  padding: '8px 20px', borderRadius: 100, border: 'none', cursor: 'pointer',
                  background: active ? C.blue : 'transparent',
                  color: active ? '#fff' : C.t3,
                  fontWeight: 600, fontSize: 14,
                  transition: 'all 0.2s',
                  fontFamily: 'inherit',
                  display: 'flex', alignItems: 'center', gap: 8,
                }}
              >
                {label}
                {isAnn && (
                  <span style={{
                    background: 'rgba(34,211,238,0.15)', border: '1px solid rgba(34,211,238,0.3)',
                    color: C.cyan, fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 100,
                  }}>Save 20%</span>
                )}
              </button>
            )
          })}
        </div>
      </section>

      {/* Cards */}
      <section style={{
        position: 'relative', zIndex: 1,
        maxWidth: 1200, margin: '0 auto', padding: '0 24px 80px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: 24, alignItems: 'start',
      }}>
        {TIERS.map(tier => {
          const isHovered = hoveredId === tier.id
          const isPro     = tier.id === 'pro'
          const dispPrice = isPro
            ? (annual ? tier.priceAnnual : tier.priceMonthly)
            : null

          return (
            <div
              key={tier.id}
              onMouseEnter={() => setHoveredId(tier.id)}
              onMouseLeave={() => setHoveredId(null)}
              style={{
                position:     'relative',
                borderRadius: 20,
                padding:      '32px 28px',
                transition:   'transform 0.25s ease, box-shadow 0.25s ease',
                transform:    isHovered ? 'translateY(-4px)' : 'none',
                cursor:       'default',
                ...(isPro ? {
                  background: `linear-gradient(135deg, rgba(240,240,245,0.97), rgba(210,215,235,0.95))`,
                  border:     '1px solid rgba(255,255,255,0.7)',
                  boxShadow:  isHovered
                    ? `inset 0 1px 0 rgba(255,255,255,0.8), 5px 5px 0 rgba(80,80,80,0.35), 10px 10px 0 rgba(60,60,60,0.25), 20px 24px 60px rgba(0,0,0,0.5)`
                    : marbleShadow,
                } : {
                  background: `linear-gradient(145deg, ${C.bg2}, ${C.bg3})`,
                  border:     `1px solid ${isHovered ? tier.accentColor + '44' : C.b2}`,
                  boxShadow:  cardShadow,
                }),
              }}
            >
              {/* Badge */}
              {tier.badge && (
                <div style={{
                  position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)',
                  background: isPro
                    ? `linear-gradient(135deg, #1a1a2e, #2a2a4e)`
                    : `linear-gradient(135deg, ${C.blue}, ${C.blueDim})`,
                  color: isPro ? C.blueLight : '#fff',
                  fontSize: 11, fontWeight: 700,
                  padding: '4px 16px', borderRadius: 100,
                  letterSpacing: '0.06em', textTransform: 'uppercase', whiteSpace: 'nowrap',
                  border: isPro ? `1px solid ${C.blueBdr}` : 'none',
                }}>{tier.badge}</div>
              )}

              {/* Label */}
              <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: isPro ? C.bg2 : tier.accentColor, marginBottom: 6 }}>
                {tier.label}
              </div>

              {/* Price */}
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, marginBottom: 4 }}>
                <span style={{
                  fontSize: dispPrice ? 46 : 34, fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1,
                  color: isPro ? C.bg0 : C.t1,
                  textShadow: isPro ? '0 1px 0 rgba(255,255,255,0.5)' : '0 2px 0 rgba(0,0,0,0.4)',
                }}>
                  {dispPrice != null ? `$${dispPrice}` : (tier.price == null ? 'Free' : `$${tier.price}`)}
                </span>
                {dispPrice != null && (
                  <span style={{ fontSize: 14, color: isPro ? C.bg3 : C.t3, paddingBottom: 5 }}>/mo</span>
                )}
              </div>

              {/* Price sub */}
              <div style={{ fontSize: 13, color: isPro ? C.bg3 : C.t3, marginBottom: 14, lineHeight: 1.4 }}>
                {annual && tier.priceSubAnnual ? tier.priceSubAnnual : tier.priceSub}
              </div>

              {/* Promo */}
              {tier.promoCode && (
                <div style={{
                  background: isPro ? 'rgba(59,124,255,0.1)' : C.blueGlow,
                  border: `1px dashed ${C.blueBdr}`,
                  borderRadius: 8, padding: '8px 12px', marginBottom: 14,
                  fontSize: 12, color: isPro ? C.blue : C.blueLight,
                  display: 'flex', alignItems: 'center', gap: 6,
                }}>
                  <span>🏷</span>{tier.promoDetail}
                </div>
              )}

              {/* Tagline */}
              <p style={{ fontSize: 13, lineHeight: 1.6, color: isPro ? C.bg3 : C.t2, marginBottom: 20, minHeight: 56 }}>
                {tier.tagline}
              </p>

              {/* CTA */}
              <Link href={tier.ctaHref} style={{ display: 'block', textDecoration: 'none', marginBottom: 24 }}>
                <button style={{
                  width: '100%', padding: '13px 20px', borderRadius: 10, border: 'none',
                  cursor: 'pointer', fontSize: 14, fontWeight: 700, fontFamily: 'inherit',
                  transition: 'all 0.2s',
                  ...(tier.ctaStyle === 'primary' ? {
                    background: `linear-gradient(135deg, ${C.bg0}, ${C.bg2})`,
                    color: C.t1,
                    boxShadow: `inset 0 1px 0 rgba(255,255,255,0.1), 0 2px 0 rgba(0,0,0,0.6), 0 8px 20px rgba(0,0,0,0.3)`,
                  } : {
                    background: 'transparent',
                    color: isPro ? C.bg0 : tier.accentColor,
                    border: `2px solid ${isPro ? C.bg2 : tier.accentColor}`,
                  }),
                }}>{tier.cta}</button>
              </Link>

              {/* Divider */}
              <div style={{ height: 1, background: isPro ? 'rgba(0,0,0,0.1)' : C.b2, marginBottom: 18 }} />

              {/* Features */}
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {tier.features.map((f, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 13, color: isPro ? C.bg0 : C.t2, padding: '4px 0', lineHeight: 1.5 }}>
                    <span style={{ color: isPro ? C.bg2 : tier.accentColor, fontSize: 15, lineHeight: 1.4, flexShrink: 0 }}>✓</span>
                    {f}
                  </li>
                ))}
                {tier.notIncluded.map((f, i) => (
                  <li key={`no-${i}`} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 13, color: isPro ? 'rgba(15,24,48,0.3)' : C.t4, padding: '4px 0', lineHeight: 1.5, textDecoration: 'line-through' }}>
                    <span style={{ fontSize: 15, lineHeight: 1.4, flexShrink: 0, opacity: 0.4 }}>✗</span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </section>

      {/* ISO note */}
      <section style={{ position: 'relative', zIndex: 1, maxWidth: 720, margin: '0 auto', padding: '0 24px 72px', textAlign: 'center' }}>
        <div style={{ background: C.bg2, border: `1px solid ${C.b2}`, borderRadius: 14, padding: '20px 28px', boxShadow: cardShadow }}>
          <p style={{ fontSize: 14, color: C.t2, lineHeight: 1.7, margin: 0 }}>
            All plans include ISO 22468-aligned methodology, 68 industry templates, and AI analysis
            powered by the VeSiMy lean knowledge base. No recurring upsells. No data sold.
          </p>
        </div>
      </section>

      {/* Lifetime deal — launch period */}
      <section style={{ position: 'relative', zIndex: 1, maxWidth: 720, margin: '0 auto 60px', padding: '0 24px' }}>
        <div style={{ background: 'linear-gradient(135deg, #0A1228, #162040)', border: '1px solid rgba(59,124,255,0.3)', borderRadius: 20, padding: '28px 32px', display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ fontSize: 36 }}>⚡</div>
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ fontFamily: '"JetBrains Mono",monospace', fontSize: 10, color: '#3B7CFF', letterSpacing: 2, marginBottom: 6 }}>LAUNCH OFFER — LIMITED TIME</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: C.t1, marginBottom: 6 }}>Lifetime access for $99</div>
            <p style={{ color: C.t2, fontSize: 14, lineHeight: 1.65, margin: 0 }}>
              Everything in Pro, up to 30 projects, all future tool releases included, 33% enterprise discount, and a Gold Standard founder badge. One payment, no recurring fees ever.
            </p>
          </div>
          <a href="/auth/signup?plan=lifetime" style={{
            flexShrink: 0, padding: '12px 24px', borderRadius: 10, border: 'none',
            background: 'linear-gradient(135deg, #3B7CFF, #2760E0)', color: '#fff',
            fontWeight: 700, fontSize: 14, textDecoration: 'none', display: 'inline-block',
            boxShadow: '0 4px 20px rgba(59,124,255,0.35)',
          }}>
            Get Lifetime — $99
          </a>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ position: 'relative', zIndex: 1, maxWidth: 720, margin: '0 auto', padding: '0 24px 100px' }}>
        <h2 style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.02em', textAlign: 'center', marginBottom: 6 }}>Common questions</h2>
        <p style={{ color: C.t2, textAlign: 'center', marginBottom: 32, fontSize: 15 }}>
          More questions? Email{' '}
          <a href="mailto:founder@vesimy.com" style={{ color: C.blueLight, textDecoration: 'none' }}>founder@vesimy.com</a>
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {FAQS.map((faq, i) => {
            const open = openFaqIdx === i
            return (
              <div key={i} style={{
                background:   open ? C.bg2 : 'transparent',
                border:       `1px solid ${open ? C.b3 : C.b1}`,
                borderRadius: 12, overflow: 'hidden',
                transition:   'background 0.2s, border-color 0.2s',
              }}>
                <button
                  onClick={() => setOpenFaqIdx(open ? null : i)}
                  style={{
                    width: '100%', textAlign: 'left',
                    padding: '16px 20px', background: 'none', border: 'none', cursor: 'pointer',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16,
                    fontFamily: 'inherit',
                  }}
                >
                  <span style={{ fontSize: 15, fontWeight: 600, color: open ? C.t1 : C.t2, lineHeight: 1.4 }}>{faq.q}</span>
                  <span style={{
                    flexShrink: 0, width: 24, height: 24, borderRadius: '50%',
                    background: open ? C.blue : C.bg3, color: open ? '#fff' : C.t3,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 16, fontWeight: 700, transition: 'all 0.2s',
                  }}>{open ? '−' : '+'}</span>
                </button>
                {open && (
                  <div style={{ padding: '0 20px 16px' }}>
                    <p style={{ fontSize: 14, color: C.t2, lineHeight: 1.7, margin: 0 }}>{faq.a}</p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </section>

      {/* Bottom CTA */}
      <section style={{
        position: 'relative', zIndex: 1,
        padding: '60px 24px 100px', textAlign: 'center',
        borderTop: `1px solid ${C.b1}`,
      }}>
        <h2 style={{ fontSize: 'clamp(24px, 5vw, 44px)', fontWeight: 800, letterSpacing: '-0.025em', marginBottom: 14 }}>
          No account needed to start.
        </h2>
        <p style={{ color: C.t2, fontSize: 16, marginBottom: 36, maxWidth: 420, margin: '0 auto 36px' }}>
          Map a process in under 5 minutes. Get a real AI lean report in your inbox. Free, always.
        </p>
        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/start" style={{ textDecoration: 'none' }}>
            <button style={{
              padding: '14px 32px', borderRadius: 12, border: 'none', cursor: 'pointer',
              background: `linear-gradient(135deg, ${C.blue}, ${C.blueDim})`,
              color: '#fff', fontSize: 15, fontWeight: 700,
              fontFamily: 'inherit', boxShadow: btnShadow,
            }}>Map a Process Free</button>
          </Link>
          <Link href="/auth/signup" style={{ textDecoration: 'none' }}>
            <button style={{
              padding: '14px 32px', borderRadius: 12, cursor: 'pointer',
              background: 'transparent', border: `2px solid ${C.b3}`,
              color: C.t2, fontSize: 15, fontWeight: 600, fontFamily: 'inherit',
            }}>Start Free Trial</button>
          </Link>
        </div>
      </section>
    </div>
  )
}
