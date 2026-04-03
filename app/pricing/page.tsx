// @ts-nocheck
'use client'
// ── app/pricing/page.tsx ──────────────────────────────────────────────────────

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { VesimyLogo } from '@/components/ui/Logo'
import { PLANS } from '@/lib/stripe'
import toast from 'react-hot-toast'
import {
  ArrowLeftIcon,
  SparkleIcon,
  CrownIcon,
  BuildingIcon,
  CheckIcon,
  ZapIcon,
} from '@/components/ui/Icons'

const serif = 'Palatino Linotype,Book Antiqua,Palatino,serif'

const PLAN_META: Record<
  string,
  {
    icon: any
    border: string
    bg: string
    badge: string | null
    highlight: boolean
    gold: boolean
    accent: string
  }
> = {
  free: {
    icon: SparkleIcon,
    border: 'rgba(184,180,172,0.6)',
    bg: 'rgba(248,247,245,0.97)',
    badge: null,
    highlight: false,
    gold: false,
    accent: 'var(--text2)',
  },
  pro: {
    icon: ZapIcon,
    border: 'rgba(1,118,211,0.34)',
    bg: 'rgba(1,118,211,0.04)',
    badge: 'MOST POPULAR',
    highlight: true,
    gold: false,
    accent: '#0176D3',
  },
  lifetime: {
    icon: CrownIcon,
    border: 'rgba(1,118,211,0.42)',
    bg: 'rgba(1,118,211,0.06)',
    badge: 'BEST VALUE',
    highlight: false,
    gold: true,
    accent: '#0176D3',
  },
  enterprise: {
    icon: BuildingIcon,
    border: 'rgba(108,185,252,0.24)',
    bg: 'rgba(108,185,252,0.03)',
    badge: 'FOR TEAMS',
    highlight: false,
    gold: false,
    accent: '#6CB9FC',
  },
}

function SectionTitle({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string
  title: React.ReactNode
  subtitle?: string
}) {
  return (
    <div style={{ textAlign: 'center', maxWidth: 760, margin: '0 auto' }}>
      <div
        style={{
          display: 'inline-block',
          background: 'rgba(1,118,211,0.08)',
          border: '1px solid rgba(1,118,211,0.18)',
          borderRadius: 999,
          padding: '5px 14px',
          marginBottom: 18,
        }}
      >
        <span
          style={{
            fontSize: 11,
            color: '#0176D3',
            fontFamily: 'monospace',
            letterSpacing: 1.6,
            textTransform: 'uppercase',
            fontWeight: 700,
          }}
        >
          {eyebrow}
        </span>
      </div>

      <h1
        style={{
          fontFamily: serif,
          fontSize: 'clamp(30px,5vw,56px)',
          fontWeight: 700,
          color: 'var(--text)',
          marginBottom: 16,
          lineHeight: 1.08,
          letterSpacing: 0.2,
        }}
      >
        {title}
      </h1>

      {subtitle && (
        <p
          style={{
            fontSize: 18,
            color: 'var(--text2)',
            maxWidth: 620,
            margin: '0 auto',
            lineHeight: 1.7,
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  )
}

function PricingToggle({
  annual,
  setAnnual,
}: {
  annual: boolean
  setAnnual: (value: boolean) => void
}) {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 12,
        background: 'rgba(248,247,245,0.97)',
        border: '1px solid rgba(215,213,206,0.95)',
        borderRadius: 999,
        padding: '6px 6px 6px 16px',
        boxShadow: '',
      }}
    >
      <span
        style={{
          fontSize: 13,
          color: annual ? 'var(--text2)' : 'var(--text)',
          transition: 'color 0.2s',
        }}
      >
        Monthly
      </span>

      <button
        onClick={() => setAnnual(!annual)}
        style={{
          width: 46,
          height: 24,
          borderRadius: 999,
          border: 'none',
          cursor: 'pointer',
          position: 'relative',
          transition: 'background 0.2s',
          background: annual
            ? 'linear-gradient(135deg,#0a5eaa,#0176D3)'
            : 'rgba(184,180,172,0.6)',
          boxShadow: annual ? '0 4px 12px rgba(1,118,211,0.18)' : 'none',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 3,
            left: annual ? 25 : 3,
            width: 18,
            height: 18,
            borderRadius: '50%',
            background: 'var(--text)',
            transition: 'left 0.2s',
          }}
        />
      </button>

      <span
        style={{
          fontSize: 13,
          color: annual ? 'var(--text)' : 'var(--text2)',
          transition: 'color 0.2s',
        }}
      >
        Annual
      </span>

      <span
        style={{
          fontSize: 11,
          background: 'rgba(29,209,161,0.12)',
          color: '#1DD1A1',
          border: '1px solid rgba(29,209,161,0.2)',
          borderRadius: 999,
          padding: '3px 10px',
          marginRight: 4,
          fontWeight: 700,
        }}
      >
        Save 20%
      </span>
    </div>
  )
}

function PlanCard({
  planKey,
  plan,
  meta,
  annual,
  loading,
  onCheckout,
}: {
  planKey: string
  plan: any
  meta: any
  annual: boolean
  loading: string | null
  onCheckout: (key: string) => void
}) {
  const Icon = meta.icon
  const isLoad = loading === planKey
  const isEnterprise = planKey === 'enterprise'
  const isLifetime = planKey === 'lifetime'

  let price: number | null = null
  if (plan.price === null || plan.price === undefined) {
    price = null
  } else if (plan.price === 0) {
    price = 0
  } else if (planKey === 'lifetime') {
    price = plan.price
  } else {
    price = annual ? Math.round(plan.price * 0.8) : plan.price
  }

  const savings =
    !plan.price || planKey === 'lifetime'
      ? 0
      : (plan.price - (annual ? Math.round(plan.price * 0.8) : plan.price)) * 12

  return (
    <div
      key={planKey}
      id={planKey}
      style={{
        position: 'relative',
        borderRadius: 20,
        padding: 26,
        background:
          meta.highlight
            ? 'linear-gradient(180deg, rgba(1,118,211,0.05), rgba(248,247,245,0.97) 70%)'
            : meta.gold
              ? 'linear-gradient(180deg, rgba(1,118,211,0.06), rgba(248,247,245,0.97) 70%)'
              : `linear-gradient(180deg, rgba(255,255,255,0.0), ${meta.bg})`,
        border: `1px solid ${meta.border}`,
        boxShadow: meta.highlight
          ? '0 0 0 1px rgba(1,118,211,0.18), 0 18px 60px rgba(0,0,0,0.42)'
          : meta.gold
            ? '0 0 0 1px rgba(1,118,211,0.10), 0 14px 40px rgba(0,0,0,0.34)'
            : '0 12px 32px rgba(0,0,0,0.32)',
        backdropFilter: 'blur(14px)',
        transition: 'transform .25s ease, box-shadow .25s ease',
        transform: meta.highlight ? 'translateY(-4px)' : 'none',
        overflow: 'hidden',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = meta.highlight ? 'translateY(-8px)' : 'translateY(-6px)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = meta.highlight ? 'translateY(-4px)' : 'translateY(0)'
      }}
    >
      {meta.badge && (
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 18,
            fontSize: 11,
            fontWeight: 800,
            padding: '5px 14px',
            borderRadius: 999,
            letterSpacing: 1.2,
            background:
              meta.highlight || meta.gold
                ? 'linear-gradient(135deg,#0a5eaa,#0176D3)'
                : 'rgba(108,185,252,0.15)',
            border:
              meta.highlight || meta.gold
                ? 'none'
                : '1px solid rgba(108,185,252,0.3)',
            color: meta.highlight || meta.gold ? 'var(--bg)' : '#6CB9FC',
            boxShadow:
              meta.highlight || meta.gold
                ? '0 6px 16px rgba(1,118,211,0.18)'
                : 'none',
          }}
        >
          {meta.badge}
        </div>
      )}

      <div style={{ marginBottom: 22 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background:
                meta.highlight || meta.gold
                  ? 'rgba(1,118,211,0.12)'
                  : isEnterprise
                    ? 'rgba(108,185,252,0.10)'
                    : 'rgba(184,180,172,0.6)',
              border:
                meta.highlight || meta.gold
                  ? '1px solid rgba(1,118,211,0.18)'
                  : isEnterprise
                    ? '1px solid rgba(108,185,252,0.18)'
                    : '1px solid rgba(255,255,255,0.0)',
            }}
          >
            <Icon
              size={18}
              color={
                meta.highlight || meta.gold
                  ? '#0176D3'
                  : isEnterprise
                    ? '#6CB9FC'
                    : 'var(--text2)'
              }
            />
          </div>

          <div>
            <div
              style={{
                fontSize: 20,
                fontWeight: 700,
                color: 'var(--text)',
                fontFamily: serif,
                lineHeight: 1.1,
              }}
            >
              {plan.name}
            </div>

            {isLifetime && (
              <div
                style={{
                  fontSize: 10,
                  color: '#0176D3',
                  fontFamily: 'monospace',
                  letterSpacing: 1.2,
                  marginTop: 3,
                  textTransform: 'uppercase',
                }}
              >
                One-time access
              </div>
            )}
          </div>
        </div>

        <p
          style={{
            fontSize: 13,
            color: 'var(--text2)',
            marginBottom: 18,
            lineHeight: 1.6,
            minHeight: 42,
          }}
        >
          {plan.description}
        </p>

        {isEnterprise ? (
          <div>
            <div
              style={{
                fontSize: 34,
                fontWeight: 700,
                color: '#6CB9FC',
                fontFamily: serif,
                lineHeight: 1,
              }}
            >
              Custom
            </div>
            <div style={{ fontSize: 13, color: 'var(--text2)', marginTop: 8 }}>
              Based on users, deployment needs, and support requirements
            </div>
          </div>
        ) : (
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: 6,
                flexWrap: 'wrap',
              }}
            >
              <span
                style={{
                  fontSize: 46,
                  fontWeight: 700,
                  fontFamily: serif,
                  color: meta.highlight || meta.gold ? '#0176D3' : 'var(--text)',
                  lineHeight: 1,
                }}
              >
                {price === 0 ? 'Free' : `$${price}`}
              </span>

              {price !== null && price > 0 && (
                <span style={{ fontSize: 14, color: 'var(--text2)' }}>
                  {isLifetime ? 'once' : `/mo${annual ? ' · billed annually' : ''}`}
                </span>
              )}
            </div>

            {!isLifetime && price !== null && price > 0 && annual && savings > 0 && (
              <p style={{ fontSize: 12, color: '#1DD1A1', marginTop: 8, fontWeight: 600 }}>
                Save ${savings}/year vs monthly billing
              </p>
            )}

            {isLifetime && (
              <p style={{ fontSize: 12, color: '#1DD1A1', marginTop: 8, fontWeight: 600 }}>
                No recurring fees. One payment. Lifetime access.
              </p>
            )}
          </div>
        )}
      </div>

      <button
        onClick={() => onCheckout(planKey)}
        disabled={isLoad}
        style={{
          width: '100%',
          padding: '12px 20px',
          borderRadius: 12,
          fontSize: 14,
          fontWeight: 700,
          cursor: isLoad ? 'wait' : 'pointer',
          marginBottom: 20,
          border: isEnterprise ? '1px solid rgba(108,185,252,0.22)' : 'none',
          transition: 'all 0.2s',
          opacity: isLoad ? 0.7 : 1,
          background:
            meta.highlight || meta.gold
              ? 'linear-gradient(135deg,#0a5eaa,#0176D3,#F4A623)'
              : isEnterprise
                ? 'rgba(108,185,252,0.10)'
                : 'rgba(215,213,206,0.9)',
          color:
            meta.highlight || meta.gold
              ? 'var(--bg)'
              : isEnterprise
                ? '#6CB9FC'
                : 'var(--text)',
          boxShadow:
            meta.highlight || meta.gold
              ? '0 8px 22px rgba(1,118,211,0.18)'
              : 'none',
        }}
      >
        {isLoad
          ? '⟳ Redirecting…'
          : isEnterprise
            ? 'Get a Quote →'
            : price === 0
              ? 'Start free — no card needed'
              : plan.cta}
      </button>


      <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
        {plan.features.map((f: string, i: number) => (
          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
            <div
              style={{
                width: 18,
                height: 18,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                marginTop: 1,
                background:
                  meta.highlight || meta.gold
                    ? 'rgba(1,118,211,0.12)'
                    : isEnterprise
                      ? 'rgba(108,185,252,0.10)'
                      : 'rgba(215,213,206,0.9)',
                border:
                  meta.highlight || meta.gold
                    ? '1px solid rgba(1,118,211,0.18)'
                    : isEnterprise
                      ? '1px solid rgba(108,185,252,0.16)'
                      : '1px solid rgba(255,255,255,0.0)',
              }}
            >
              <CheckIcon
                size={10}
                color={
                  meta.highlight || meta.gold
                    ? '#0176D3'
                    : isEnterprise
                      ? '#6CB9FC'
                      : 'var(--text2)'
                }
                strokeWidth={3}
              />
            </div>

            <span style={{ fontSize: 13, color: '#B8B5D1', lineHeight: 1.5 }}>
              {f}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function PricingPage() {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)
  const [annual, setAnnual] = useState(false)
  const [showPromo, setShowPromo] = useState(false)

  useEffect(() => {
    const dismissed = localStorage.getItem('vesimy_spring25_dismissed')
    const expired = new Date() > new Date('2026-04-21T00:00:00')
    if (!dismissed && !expired) setShowPromo(true)
  }, [])

  function dismissPromo() {
    localStorage.setItem('vesimy_spring25_dismissed', '1')
    setShowPromo(false)
  }

  function copyPromoCode() {
    navigator.clipboard.writeText('SPRING25').catch(() => {})
    toast.success('Code copied!')
  }

  async function handleCheckout(planKey: string) {
    if (planKey === 'free' || planKey === 'trial') {
      router.push('/auth/signup')
      return
    }

    if (planKey === 'enterprise') {
      router.push('/enterprise')
      return
    }

    setLoading(planKey)

    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: planKey }),
      })

      const data = await res.json()

      if (res.status === 401) {
        router.push(`/auth/signup?plan=${planKey}&next=/pricing`)
        return
      }

      if (data.url) {
        window.location.href = data.url
      } else {
        alert(data.error || 'Something went wrong. Please try again.')
      }
    } catch (e: any) {
      alert(e?.message || 'Network error. Check your connection and try again.')
    } finally {
      setLoading(null)
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--bg)',
        backgroundImage:
          'radial-gradient(ellipse 80% 50% at 20% 0%, rgba(1,118,211,0.08) 0%, transparent 55%), radial-gradient(ellipse 60% 40% at 80% 100%, rgba(100,38,160,0.06) 0%, transparent 55%)',
      }}
    >
      <nav
        style={{
          borderBottom: '1px solid rgba(215,213,206,0.95)',
          padding: '14px 18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 14,
          flexWrap: 'wrap',
          background: 'rgba(248,247,245,0.97)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <Link href="/" style={{ textDecoration: 'none' }}>
          <VesimyLogo size={36} showText />
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Link
            href="/dashboard"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              color: 'var(--text2)',
              fontSize: 13,
              textDecoration: 'none',
              fontWeight: 600,
            }}
          >
            <ArrowLeftIcon size={14} /> Back to dashboard
          </Link>
        </div>
      </nav>

      <div style={{ padding: '72px 24px 52px' }}>
        <SectionTitle
          eyebrow="Pricing"
          title={
            <>
              Premium process intelligence,
              <br />
              priced for real operators.
            </>
          }
          subtitle="The free plan gives you unlimited projects and all 9 CI tools — no credit card, no expiry. Upgrade to Pro for Supe AI, process simulation, and the A3 export. First upgrade includes a 14-day free trial."
        />

        <div style={{ marginTop: 34, textAlign: 'center' }}>
          <PricingToggle annual={annual} setAnnual={setAnnual} />
        </div>
      </div>

      {showPromo && (
        <div style={{ maxWidth: 1180, margin: '0 auto', padding: '0 16px 0', marginBottom: 0 }}>
          <div style={{
            background: 'rgba(196,155,46,0.08)', border: '1px solid rgba(196,155,46,0.3)',
            borderRadius: 10, padding: '14px 18px', marginBottom: 28,
            display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap',
          }}>
            <span style={{ fontSize: 20 }}>🌱</span>
            <div style={{ flex: 1, minWidth: 200 }}>
              <strong style={{ color: 'var(--text)' }}>Spring CI Sprint</strong>
              <span style={{ color: 'var(--text2)', fontSize: 14 }}> — 20% off your first payment. Use code </span>
              <code style={{ background: 'rgba(196,155,46,0.12)', padding: '2px 8px', borderRadius: 4, fontWeight: 700, color: '#C49B2E' }}>SPRING25</code>
              <span style={{ color: 'var(--text3)', fontSize: 13 }}> · Expires Easter Sunday, 20 April</span>
            </div>
            <button onClick={copyPromoCode} style={{
              padding: '7px 14px', borderRadius: 8, border: '1px solid var(--border)',
              background: '#fff', cursor: 'pointer', fontSize: 13, color: 'var(--text2)', fontWeight: 600,
            }}>Copy code</button>
            <button onClick={dismissPromo} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--text3)', fontSize: 22, lineHeight: 1, padding: '0 4px',
            }}>×</button>
          </div>
        </div>
      )}

      <div
        style={{
          maxWidth: 1180,
          margin: '0 auto',
          padding: '0 16px 78px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,280px),1fr))',
          gap: 22,
          alignItems: 'start',
        }}
      >
        {(Object.entries(PLANS) as [string, typeof PLANS[keyof typeof PLANS]][]).map(([key, plan]) => (
          <PlanCard
            key={key}
            planKey={key}
            plan={plan}
            meta={PLAN_META[key] || PLAN_META.free}
            annual={annual}
            loading={loading}
            onCheckout={handleCheckout}
          />
        ))}
      </div>

      <div style={{ maxWidth: 920, margin: '0 auto', padding: '0 24px 52px' }}>
      </div>

      <div
        style={{
          borderTop: '1px solid rgba(215,213,206,0.95)',
          borderBottom: '1px solid rgba(215,213,206,0.95)',
          padding: '30px 24px',
          textAlign: 'center',
          background: 'rgba(255,255,255,0.0)',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: 28,
            maxWidth: 980,
            margin: '0 auto',
          }}
        >
          {[
            '256-bit encryption in transit and at rest',
            'Cancel anytime',
            'Stripe-secured payments',
            'No hidden fees',
            'GDPR compliant',
          ].map((t) => (
            <span
              key={t}
              style={{
                fontSize: 12,
                color: 'var(--text3)',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <CheckIcon size={11} color="#1DD1A1" strokeWidth={3} /> {t}
            </span>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 760, margin: '0 auto', padding: '56px 24px 84px' }}>
        <h2
          style={{
            fontFamily: serif,
            fontSize: 32,
            fontWeight: 700,
            color: 'var(--text)',
            textAlign: 'center',
            marginBottom: 42,
          }}
        >
          Common questions
        </h2>

        {[
          [
            'Is VeSiMy web-based or do I need to install something?',
            'Entirely browser-based. Nothing to install, no IT ticket required. Works on any modern browser on desktop or mobile. Your account and data are accessible from any device.',
          ],
          [
            'Why do I need an account to use it?',
            'Your VSM data, process steps, time studies, and kaizen logs need somewhere to live so you can return to them across sessions. We store your work securely in your account. You can explore a sample project without signing up — click Explore sample project on the homepage.',
          ],
          [
            'What data do you log? Do you use my process data for anything?',
            'We log standard usage analytics — pages visited, features used — to improve the product. Your process data, including VSMs, cycle times, and root cause analyses, is private to your account. It is never shared, sold, or used to train AI models. We do not analyse what your processes look like or identify your operations.',
          ],
          [
            'Is the Lifetime plan still available?',
            'Yes — the Lifetime plan is $99 once and gives you all Pro features forever, with no monthly fee. There is no expiry or deadline on this offer.',
          ],
          [
            'Can I switch plans later?',
            'Yes — upgrade or downgrade anytime from your account settings. Changes apply immediately.',
          ],
          [
            'Is the Free plan really free forever?',
            "Yes. The Free plan gives you unlimited projects with all 9 CI tools — forever, no credit card needed. When you upgrade to Pro, you get a 14-day free trial before your card is charged, with a reminder 3 days before.",
          ],
          [
            'Is my process data secure?',
            'All data is encrypted at rest and in transit. Your VSM maps and process data are private to your account.',
          ],
          [
            'How does enterprise pricing work?',
            "Enterprise is quote-based — $15/user/month with volume discounts at 50, 200, and 500+ users. Add-ons like API, SSO, and SLA stack on top.",
          ],
          [
            'Do you offer refunds?',
            'Yes — 30-day money-back guarantee on all paid plans, no questions asked.',
          ],
        ].map(([q, a]) => (
          <div
            key={q}
            style={{
              borderBottom: '1px solid rgba(215,213,206,0.95)',
              paddingBottom: 22,
              marginBottom: 22,
            }}
          >
            <p
              style={{
                fontSize: 16,
                fontWeight: 650,
                color: 'var(--text)',
                marginBottom: 8,
              }}
            >
              {q}
            </p>
            <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.75 }}>{a}</p>
          </div>
        ))}
      </div>

      <div
        style={{
          borderTop: '1px solid rgba(215,213,206,0.95)',
          padding: '24px',
          textAlign: 'center',
        }}
      >
        <p style={{ fontSize: 12, color: 'var(--text3)' }}>
          © 2026 VeSiMy Ltd ·{' '}
          <Link href="/terms" style={{ color: 'var(--text3)', textDecoration: 'none' }}>
            Terms
          </Link>{' '}
          ·{' '}
          <Link href="/privacy" style={{ color: 'var(--text3)', textDecoration: 'none' }}>
            Privacy
          </Link>
        </p>
      </div>
    </div>
  )
}