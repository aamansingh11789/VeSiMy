// @ts-nocheck
'use client'
// ── app/pricing/page.tsx ──────────────────────────────────────────────────────

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { VesimyLogo } from '@/components/ui/Logo'
import { PLANS } from '@/lib/stripe'
import { ThemeToggle } from '@/components/ui/ThemeProvider'
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
    glow: string
  }
> = {
  free: {
    icon: SparkleIcon,
    border: 'rgba(40,40,92,0.5)',
    bg: 'rgba(8,8,24,0.75)',
    badge: null,
    highlight: false,
    gold: false,
    accent: '#8B88B3',
    glow: 'none',
  },
  pro: {
    icon: ZapIcon,
    border: 'rgba(212,162,8,0.35)',
    bg: 'rgba(212,162,8,0.04)',
    badge: 'Most Popular',
    highlight: true,
    gold: false,
    accent: '#D4A208',
    glow: '0 18px 42px rgba(212,162,8,0.12)',
  },
  lifetime: {
    icon: CrownIcon,
    border: 'rgba(212,162,8,0.5)',
    bg: 'rgba(212,162,8,0.06)',
    badge: 'Beta Exclusive',
    highlight: false,
    gold: true,
    accent: '#D4A208',
    glow: '0 16px 34px rgba(212,162,8,0.10)',
  },
  enterprise: {
    icon: BuildingIcon,
    border: 'rgba(108,185,252,0.25)',
    bg: 'rgba(108,185,252,0.03)',
    badge: 'For Teams',
    highlight: false,
    gold: false,
    accent: '#6CB9FC',
    glow: 'none',
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
          background: 'rgba(212,162,8,0.08)',
          border: '1px solid rgba(212,162,8,0.18)',
          borderRadius: 999,
          padding: '5px 14px',
          marginBottom: 18,
        }}
      >
        <span
          style={{
            fontSize: 11,
            color: '#D4A208',
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
          color: '#F3F1FB',
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
        background: 'rgba(8,8,24,0.82)',
        border: '1px solid rgba(26,26,64,0.8)',
        borderRadius: 999,
        padding: '6px 6px 6px 16px',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.03)',
      }}
    >
      <span
        style={{
          fontSize: 13,
          color: annual ? 'var(--text2)' : '#EAE8F4',
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
            ? 'linear-gradient(135deg,#C49510,#D4A208)'
            : 'rgba(40,40,92,0.6)',
          boxShadow: annual ? '0 4px 12px rgba(212,162,8,0.18)' : 'none',
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
            background: '#EAE8F4',
            transition: 'left 0.2s',
          }}
        />
      </button>

      <span
        style={{
          fontSize: 13,
          color: annual ? '#EAE8F4' : 'var(--text2)',
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

export default function PricingPage() {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)
  const [annual, setAnnual] = useState(false)

  async function handleCheckout(planKey: string) {
    if (planKey === 'free') {
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

  function getDisplayPrice(plan: typeof PLANS[keyof typeof PLANS], key: string): number | null {
    if (plan.price === null || plan.price === undefined) return null
    if (plan.price === 0) return 0
    if (key === 'lifetime') return plan.price
    return annual ? Math.round((plan.price as number) * 0.8) : (plan.price as number)
  }

  function getSavings(plan: typeof PLANS[keyof typeof PLANS], key: string): number {
    if (!plan.price || key === 'lifetime') return 0
    const monthly = plan.price as number
    const disc = annual ? Math.round(monthly * 0.8) : monthly
    return (monthly - disc) * 12
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#03030D',
        backgroundImage:
          'radial-gradient(ellipse 80% 50% at 20% 0%, rgba(212,162,8,0.08) 0%, transparent 55%), radial-gradient(ellipse 60% 40% at 80% 100%, rgba(100,38,160,0.06) 0%, transparent 55%)',
      }}
    >
      <nav
        style={{
          borderBottom: '1px solid rgba(26,26,64,0.55)',
          padding: '14px 18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 14,
          flexWrap: 'wrap',
          background: 'rgba(3,3,13,0.55)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <Link href="/" style={{ textDecoration: 'none' }}>
          <VesimyLogo size={36} showText />
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <ThemeToggle size={28} />
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
          subtitle="Start free. Upgrade only when Vesimy starts delivering measurable value to your team."
        />

        <div style={{ marginTop: 34, textAlign: 'center' }}>
          <PricingToggle annual={annual} setAnnual={setAnnual} />
        </div>
      </div>

      <div
        style={{
          maxWidth: 1180,
          margin: '0 auto',
          padding: '18px 16px 78px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,280px),1fr))',
          gap: 22,
          alignItems: 'start',
        }}
      >
        {(Object.entries(PLANS) as [string, typeof PLANS[keyof typeof PLANS]][]).map(([key, plan]) => {
          const meta = PLAN_META[key] || PLAN_META.free
          const Icon = meta.icon
          const price = getDisplayPrice(plan, key)
          const isLoad = loading === key
          const isEnterprise = key === 'enterprise'
          const isLifetime = key === 'lifetime'

          return (
            <div
              key={key}
              id={key}
              style={{
                background:
                  meta.highlight
                    ? 'linear-gradient(180deg, rgba(212,162,8,0.06), rgba(8,8,24,0.84) 65%)'
                    : meta.gold
                      ? 'linear-gradient(180deg, rgba(212,162,8,0.08), rgba(8,8,24,0.84) 62%)'
                      : meta.bg,
                border: `1px solid ${meta.border}`,
                borderRadius: 20,
                padding: '30px 30px 28px',
                paddingTop: 36,
                position: 'relative',
                transform: meta.highlight ? 'translateY(-6px)' : 'none',
                boxShadow: meta.glow,
                overflow: 'visible',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = meta.highlight
                  ? 'translateY(-10px)'
                  : 'translateY(-6px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = meta.highlight
                  ? 'translateY(-6px)'
                  : 'translateY(0)'
              }}
            >
              {(meta.highlight || meta.gold) && (
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    pointerEvents: 'none',
                    borderRadius: 20,
                    background:
                      meta.highlight
                        ? 'radial-gradient(circle at top left, rgba(212,162,8,0.08), transparent 36%)'
                        : 'radial-gradient(circle at top left, rgba(212,162,8,0.06), transparent 34%)',
                  }}
                />
              )}

              {meta.badge && (
                <div
                  style={{
                    position: 'absolute',
                    top: -16,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    fontSize: 11,
                    fontWeight: 700,
                    padding: '4px 14px',
                    borderRadius: 999,
                    whiteSpace: 'nowrap',
                    letterSpacing: 0.5,
                    background:
                      meta.highlight || meta.gold
                        ? 'linear-gradient(135deg,#C49510,#D4A208)'
                        : 'rgba(108,185,252,0.15)',
                    border:
                      meta.highlight || meta.gold
                        ? 'none'
                        : '1px solid rgba(108,185,252,0.3)',
                    color: meta.highlight || meta.gold ? '#03030D' : '#6CB9FC',
                    boxShadow:
                      meta.highlight || meta.gold
                        ? '0 6px 16px rgba(212,162,8,0.18)'
                        : 'none',
                    zIndex: 3,
                  }}
                >
                  {meta.badge}
                </div>
              )}

              <div style={{ marginBottom: 24, position: 'relative' }}>
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
                          ? 'rgba(212,162,8,0.12)'
                          : isEnterprise
                            ? 'rgba(108,185,252,0.10)'
                            : 'rgba(40,40,92,0.4)',
                      border:
                        meta.highlight || meta.gold
                          ? '1px solid rgba(212,162,8,0.18)'
                          : isEnterprise
                            ? '1px solid rgba(108,185,252,0.18)'
                            : '1px solid rgba(255,255,255,0.04)',
                    }}
                  >
                    <Icon
                      size={18}
                      color={
                        meta.highlight || meta.gold
                          ? '#D4A208'
                          : isEnterprise
                            ? '#6CB9FC'
                            : '#8B88B3'
                      }
                    />
                  </div>

                  <div>
                    <div
                      style={{
                        fontSize: 20,
                        fontWeight: 700,
                        color: '#F3F1FB',
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
                          color: '#D4A208',
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
                          color: meta.highlight || meta.gold ? '#D4A208' : '#F3F1FB',
                          lineHeight: 1,
                        }}
                      >
                        {price === 0 ? 'Free' : `$${price}`}
                      </span>

                      {price !== null && price > 0 && (
                        <span style={{ fontSize: 14, color: 'var(--text2)' }}>
                          {isLifetime ? 'one-time' : `/mo${annual ? ' · billed annually' : ''}`}
                        </span>
                      )}
                    </div>

                    {!isLifetime && price !== null && price > 0 && annual && getSavings(plan, key) > 0 && (
                      <p style={{ fontSize: 12, color: '#1DD1A1', marginTop: 8, fontWeight: 600 }}>
                        Save ${getSavings(plan, key)}/year vs monthly billing
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
                onClick={() => handleCheckout(key)}
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
                      ? 'linear-gradient(135deg,#C49510,#D4A208,#F4A623)'
                      : isEnterprise
                        ? 'rgba(108,185,252,0.10)'
                        : 'rgba(40,40,92,0.5)',
                  color:
                    meta.highlight || meta.gold
                      ? '#03030D'
                      : isEnterprise
                        ? '#6CB9FC'
                        : '#EAE8F4',
                  boxShadow:
                    meta.highlight || meta.gold
                      ? '0 8px 22px rgba(212,162,8,0.18)'
                      : 'none',
                }}
              >
                {isLoad
                  ? '⟳ Redirecting…'
                  : isEnterprise
                    ? 'Get a Quote →'
                    : price === 0
                      ? 'Get Started Free'
                      : plan.cta}
              </button>

              {isLifetime && (
                <p
                  style={{
                    fontSize: 11,
                    color: 'var(--text2)',
                    textAlign: 'center',
                    marginBottom: 16,
                    marginTop: -10,
                    lineHeight: 1.5,
                  }}
                >
                  Available during Launch Week only ·{' '}
                  <Link href="/beta" style={{ color: '#D4A208', textDecoration: 'none', fontWeight: 700 }}>
                    Join Launch Week →
                  </Link>
                </p>
              )}

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
                            ? 'rgba(212,162,8,0.12)'
                            : isEnterprise
                              ? 'rgba(108,185,252,0.10)'
                              : 'rgba(40,40,92,0.5)',
                        border:
                          meta.highlight || meta.gold
                            ? '1px solid rgba(212,162,8,0.18)'
                            : isEnterprise
                              ? '1px solid rgba(108,185,252,0.16)'
                              : '1px solid rgba(255,255,255,0.03)',
                      }}
                    >
                      <CheckIcon
                        size={10}
                        color={
                          meta.highlight || meta.gold
                            ? '#D4A208'
                            : isEnterprise
                              ? '#6CB9FC'
                              : '#8B88B3'
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
        })}
      </div>

      <div style={{ maxWidth: 920, margin: '0 auto', padding: '0 24px 52px' }}>
        <div
          style={{
            background:
              'linear-gradient(135deg, rgba(212,162,8,0.06), rgba(212,162,8,0.02) 44%, rgba(8,8,24,0.7))',
            border: '1px solid rgba(212,162,8,0.18)',
            borderRadius: 20,
            padding: '26px 30px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 20,
            flexWrap: 'wrap',
            boxShadow: '0 12px 34px rgba(212,162,8,0.05)',
          }}
        >
          <div style={{ maxWidth: 620 }}>
            <div
              style={{
                fontSize: 11,
                color: '#D4A208',
                letterSpacing: 2,
                fontFamily: 'monospace',
                marginBottom: 8,
                textTransform: 'uppercase',
                fontWeight: 700,
              }}
            >
              Gold Standard Beta
            </div>

            <p style={{ fontSize: 17, fontWeight: 700, color: '#F3F1FB', margin: '0 0 6px' }}>
              Want the $99 Lifetime plan?
            </p>

            <p style={{ fontSize: 13, color: 'var(--text2)', margin: 0, lineHeight: 1.65 }}>
              Join during Launch Week — open to all practitioners. Get 30 days of Pro, then unlock
              Lifetime for a one-time $99 and keep your Gold Standard badge permanently.
            </p>
          </div>

          <Link
            href="/beta"
            style={{
              textDecoration: 'none',
              padding: '12px 24px',
              borderRadius: 12,
              fontWeight: 700,
              fontSize: 14,
              whiteSpace: 'nowrap',
              background: 'linear-gradient(135deg,#C49510,#D4A208)',
              color: '#03030D',
              boxShadow: '0 8px 18px rgba(212,162,8,0.16)',
            }}
          >
            Apply for Beta →
          </Link>
        </div>
      </div>

      <div
        style={{
          borderTop: '1px solid rgba(26,26,64,0.55)',
          borderBottom: '1px solid rgba(26,26,64,0.45)',
          padding: '30px 24px',
          textAlign: 'center',
          background: 'rgba(255,255,255,0.01)',
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
            '256-bit SSL encryption',
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
            color: '#F3F1FB',
            textAlign: 'center',
            marginBottom: 42,
          }}
        >
          Common questions
        </h2>

        {[
          [
            'What is the Gold Standard beta?',
            'During Launch Week, every practitioner who signs up gets Gold Standard status — a permanent badge on their account. You get 30 days of Pro access free, then a one-time $99 unlocks Lifetime access — 99 projects, forever. After launch week, this offer is gone.',
          ],
          [
            'Can I switch plans later?',
            'Yes — upgrade or downgrade anytime from your account settings. Changes apply immediately.',
          ],
          [
            'What happens after my free trial?',
            "After 14 days you'll be prompted to choose a plan. No automatic charges. We send a reminder 3 days before.",
          ],
          [
            'Is my process data secure?',
            'All data is encrypted at rest and in transit. Your VSM maps and process data are private to your account.',
          ],
          [
            'How does enterprise pricing work?',
            "Enterprise is quote-based — $15/user/month with volume discounts at 50, 200, and 500+ users. Add-ons like API, SSO, and SLA stack on top. Gold Standard beta users' companies get 33% off.",
          ],
          [
            'Do you offer refunds?',
            'Yes — 30-day money-back guarantee on all paid plans, no questions asked.',
          ],
        ].map(([q, a]) => (
          <div
            key={q}
            style={{
              borderBottom: '1px solid rgba(26,26,64,0.45)',
              paddingBottom: 22,
              marginBottom: 22,
            }}
          >
            <p
              style={{
                fontSize: 16,
                fontWeight: 650,
                color: '#F3F1FB',
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
          borderTop: '1px solid rgba(26,26,64,0.4)',
          padding: '24px',
          textAlign: 'center',
        }}
      >
        <p style={{ fontSize: 12, color: 'var(--text3)' }}>
          © 2026 VeSiMy ·{' '}
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