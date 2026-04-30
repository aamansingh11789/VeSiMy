// TypeScript enabled
'use client'
// ── app/dashboard/DashboardClient.tsx ────────────────────────────────────────

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  PlusIcon,
  ArrowRightIcon,
  ClockIcon,
  ZapIcon,
  BarChartIcon,
  CrownIcon,
  ActivityIcon,
  ChevronRightIcon,
} from '@/components/ui/Icons'
import toast from 'react-hot-toast'
import { formatDistanceToNow } from 'date-fns'
import type { Profile, Project } from '@/lib/store'
import { getIndustryTerms, getIndustryLabel, INDUSTRY_SECTORS, getIndustriesBySector } from '@/lib/industry-language'
import { getIndustryReferenceNames } from '@/lib/industry-reference-map'
import Link from 'next/link'
import { BetaBanner } from '@/components/beta/BetaBanner'
import { useAnalytics } from '@/hooks/useAnalytics'

interface Props {
  profile: Profile
  initialProjects: Project[]
}

function UpgradeToast() {
  const params = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    if (params.get('upgraded') !== 'true') return

    const plan = params.get('plan') || 'pro'
    toast.success(
      `You're now on ${plan.charAt(0).toUpperCase() + plan.slice(1)} — premium features are unlocked.`,
      { duration: 8000 }
    )
    window.history.replaceState({}, '', '/dashboard')

    // FIX: poll for profile update so premium features unlock immediately.
    // ProfileRefresh uses Supabase Realtime, but if Realtime is not enabled on
    // the profiles table this is the safety net.
    let attempts = 0
    const interval = setInterval(async () => {
      attempts++
      try {
        const res = await fetch('/api/profile/me')
        if (res.ok) {
          const { plan_tier, lifetime_access } = await res.json()
          if (['pro', 'lifetime', 'enterprise'].includes(plan_tier) || lifetime_access) {
            router.refresh()
            clearInterval(interval)
            return
          }
        }
      } catch { /* ignore */ }
      if (attempts >= 12) clearInterval(interval)  // stop after 60s
    }, 5000)

    return () => clearInterval(interval)
  // FIX: router removed from deps — same issue as ProfileRefresh.
  // router is a new object on every render; keeping it in deps restarted the polling loop.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params])

  return null
}

// Industry options loaded from lib/industry-language.ts via the IndustrySelector component

const serif = 'Palatino Linotype,Book Antiqua,Palatino,serif'

function getProjectScore(project: any) {
  // Uses actual joined step data for accurate project health scoring.
  const steps      = (project.steps || []) as any[]
  const mainSteps  = steps.filter(s => s.is_main_flow !== false)
  // Fix I-3: check BOTH cycle_time field AND stopwatch.mean — users who capture
  // CT via the Stopwatch tool store it in toolData, not in cycle_time directly.
  const withCT     = mainSteps.filter(s =>
    Number(s.cycle_time) > 0 || Number(s.toolData?.stopwatch?.mean) > 0
  )
  const withVA     = mainSteps.filter(s => s.va_type || s.is_value_added)
  const recentEdit = new Date(project.updated_at) > new Date(Date.now() - 7 * 86400_000)

  return Math.min(100,
    (mainSteps.length > 0  ? 20 : 0) +
    (mainSteps.length >= 3 ? 10 : 0) +
    (mainSteps.length >= 6 ? 10 : 0) +
    (withCT.length >= Math.max(1, mainSteps.length * 0.5) ? 20 : 0) +
    (withVA.length > 0     ? 15 : 0) +
    (project.industry      ? 10 : 0) +
    (recentEdit            ? 15 : 0)
  )
}

function getScoreColor(score: number) {
  return score >= 70 ? '#1DD1A1' : score >= 40 ? '#F4A623' : '#FF6B6B'
}

function getScoreLabel(score: number, count: number) {
  if (score >= 70) return 'Active'
  if (count === 0) return 'Empty'
  if (score >= 40) return 'Building'
  return 'Started'
}

// ── Mini SVG health gauge ─────────────────────────────────────────────────────
function MiniGauge({ score }: { score: number }) {
  const color = getScoreColor(score)
  const r = 16
  const circ = 2 * Math.PI * r
  const dash = (score / 100) * circ

  return (
    <svg width="46" height="46" viewBox="0 0 46 46" style={{ flexShrink: 0 }}>
      <defs>
        <linearGradient id={`gauge-${score}`} x1="0" x2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.7" />
          <stop offset="100%" stopColor={color} />
        </linearGradient>
      </defs>
      <circle
        cx="23"
        cy="23"
        r={r}
        fill="none"
        stroke="rgba(40,40,92,0.28)"
        strokeWidth="3.5"
      />
      <circle
        cx="23"
        cy="23"
        r={r}
        fill="none"
        stroke={`url(#gauge-${score})`}
        strokeWidth="3.5"
        strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round"
        transform="rotate(-90 23 23)"
        style={{ transition: 'stroke-dasharray 1s ease' }}
      />
      <text
        x="23"
        y="27"
        textAnchor="middle"
        fill={color}
        fontSize="10"
        fontWeight="700"
      >
        {score}
      </text>
    </svg>
  )
}

// ── Per-project health card ───────────────────────────────────────────────────
function ProjectHealthCard({ project }: { project: Project; key?: any }) {
  const count = project.steps?.length || 0
  const score = getProjectScore(project)
  const color = getScoreColor(score)
  const status = getScoreLabel(score, count)

  return (
    <Link href={`/project/${project.id}`} style={{ textDecoration: 'none' }}>
      <div
        className="card"
        style={{
          padding: '20px 22px',
          cursor: 'pointer',
          minHeight: 118,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, width: '100%' }}>
          <MiniGauge score={score} />

          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                gap: 10,
                marginBottom: 8,
              }}
            >
              <div style={{ minWidth: 0 }}>
                <h3
                  style={{
                    fontSize: 15,
                    fontWeight: 650,
                    color: 'var(--text)',
                    margin: 0,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    letterSpacing: 0.1,
                  }}
                >
                  {project.name}
                </h3>

                {project.customer && (
                  <div
                    style={{
                      fontSize: 11,
                      color: 'var(--text3)',
                      marginTop: 3,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {project.customer}
                  </div>
                )}
              </div>

              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  background: `${color}14`,
                  color,
                  border: `1px solid ${color}2b`,
                  borderRadius: 999,
                  padding: '3px 9px',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                  letterSpacing: 0.25,
                }}
              >
                {status}
              </span>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                flexWrap: 'wrap',
              }}
            >
              {project.industry && (
                <span
                  style={{
                    fontSize: 11,
                    color: 'var(--text2)',
                    padding: '3px 8px',
                    borderRadius: 999,
                    background: 'transparent',
                    border: '1px solid transparent',
                  }}
                >
                  {project.industry}
                </span>
              )}

              <span style={{ fontSize: 11, color: 'var(--text3)' }}>
                {count} step{count !== 1 ? 's' : ''}
              </span>

              <span
                style={{
                  fontSize: 11,
                  color: 'var(--text3)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                <ClockIcon size={10} />
                {formatDistanceToNow(new Date(project.updated_at), { addSuffix: true })}
              </span>
            </div>
          </div>

          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 10,
              background: 'rgba(255,255,255,0.025)',
              border: '1px solid transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <ChevronRightIcon size={14} color="#4F4C74" />
          </div>
        </div>
      </div>
    </Link>
  )
}

// ── Portfolio health overview ─────────────────────────────────────────────────
function HealthOverview({ projects }: { projects: Project[] }) {
  if (!projects.length) return null

  const scores = projects.map(getProjectScore)
  const avg = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
  const high = scores.filter((s) => s >= 70).length
  const mid = scores.filter((s) => s >= 40 && s < 70).length
  const low = scores.filter((s) => s < 40).length
  const color = getScoreColor(avg)

  return (
    <div
      className="card"
      style={{
        padding: '24px 28px',
        marginBottom: 28,
        background: '#FFFFFF',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'stretch',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 20,
        }}
      >
        <div style={{ minWidth: 180 }}>
          <p
            style={{
              fontSize: 10,
              color: 'var(--text2)',
              letterSpacing: 1.8,
              fontFamily: 'monospace',
              marginBottom: 8,
            }}
          >
            IMPROVEMENT PROGRESS
          </p>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
            <span
              style={{
                fontFamily: serif,
                fontSize: 48,
                fontWeight: 700,
                color,
                lineHeight: 1,
              }}
            >
              {avg}
            </span>
            <span style={{ fontSize: 13, color: 'var(--text2)' }}>/ 100 avg</span>
          </div>

          <p style={{ fontSize: 13, color: 'var(--text2)', marginTop: 10 }}>
            A live view of project quality, momentum, and mapping maturity.
          </p>
        </div>

        <div
          style={{
            display: 'flex',
            gap: 18,
            alignItems: 'stretch',
            flexWrap: 'wrap',
          }}
        >
          {([
            ['Healthy', '#1DD1A1', high],
            ['Building', '#F4A623', mid],
            ['Needs Work', '#FF6B6B', low],
          ] as const).map(([label, c, n]) => (
            <div
              key={label}
              style={{
                minWidth: 96,
                padding: '12px 14px',
                borderRadius: 14,
                background: 'transparent',
                border: '1px solid transparent',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  fontSize: 24,
                  fontWeight: 700,
                  color: c,
                  fontFamily: serif,
                  lineHeight: 1.1,
                }}
              >
                {n}
              </div>
              <div
                style={{
                  fontSize: 10,
                  color: 'var(--text3)',
                  fontFamily: 'monospace',
                  letterSpacing: 1,
                  marginTop: 5,
                  textTransform: 'uppercase',
                }}
              >
                {label}
              </div>
            </div>
          ))}
        </div>

        <div style={{ flex: 1, minWidth: 220 }}>
          <div
            style={{
              height: 9,
              borderRadius: 999,
              background: 'rgba(40,40,92,0.34)',
              overflow: 'hidden',
              display: 'flex',
              boxShadow: 'inset 0 1px 0 transparent',
            }}
          >
            {high > 0 && <div style={{ flex: high, background: '#1DD1A1' }} />}
            {mid > 0 && <div style={{ flex: mid, background: '#F4A623' }} />}
            {low > 0 && <div style={{ flex: low, background: '#FF6B6B' }} />}
          </div>

          <p style={{ fontSize: 12, color: 'var(--text3)', marginTop: 8 }}>
            {high} healthy · {mid} building · {low} needs attention
          </p>
        </div>
      </div>
    </div>
  )
}

// ── Premium stat card ─────────────────────────────────────────────────────────
function StatCard({
  label,
  value,
  icon: Icon,
  color,
  hint,
}: {
  label: string
  value: string | number
  icon: any
  color: string
  hint?: string
}) {
  return (
    <div
      style={{
        padding: '18px 18px 16px',
        minHeight: 116,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: 'rgba(255,255,255,0.82)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(255,255,255,0.95)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: `0 2px 12px rgba(0,0,0,0.05), 0 1px 0 rgba(255,255,255,0.9) inset`,
        position: 'relative',
        overflow: 'hidden',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLDivElement
        el.style.transform = 'translateY(-3px)'
        el.style.boxShadow = `0 12px 28px ${color}18, 0 1px 0 rgba(255,255,255,0.9) inset`
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLDivElement
        el.style.transform = 'translateY(0)'
        el.style.boxShadow = `0 2px 12px rgba(0,0,0,0.05), 0 1px 0 rgba(255,255,255,0.9) inset`
      }}
    >
      {/* Accent bar top */}
      <div style={{ position:'absolute', top:0, left:0, right:0, height:3, background:`linear-gradient(90deg,${color},${color}88,transparent)`, borderRadius:'var(--radius-lg) var(--radius-lg) 0 0' }}/>
      {/* Glow blob */}
      <div style={{ position:'absolute', top:-20, right:-20, width:80, height:80, borderRadius:'50%', background:`${color}0A`, pointerEvents:'none' }}/>

      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
        <span style={{ fontSize:10, color:'var(--text2)', letterSpacing:1.2, textTransform:'uppercase', fontFamily:'monospace' }}>
          {label}
        </span>
        <div style={{ width:28, height:28, borderRadius:9, display:'flex', alignItems:'center', justifyContent:'center', background:`${color}14`, border:`1px solid ${color}25` }}>
          <Icon size={13} color={color} />
        </div>
      </div>

      <div style={{ fontSize:26, fontWeight:700, color:'var(--text)', lineHeight:1.1 }}>
        {value}
      </div>

      {hint && (
        <div style={{ fontSize:11, color:'var(--text3)', marginTop:10 }}>
          {hint}
        </div>
      )}
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────
export function DashboardClient({ profile, initialProjects }: Props) {
  // ── All hooks must be declared before any conditional logic ──────────────
  const { identify } = useAnalytics()
  const router = useRouter()
  const [projects] = useState(initialProjects)
  const [creating, setCreating] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [form, setForm] = useState({ name: '', industry: '', customer: '' })
  const [view, setView] = useState<'cards' | 'list'>('cards')
  const [seedingRef, setSeedingRef] = useState(false)

  useEffect(() => {
    if (profile?.id) {
      identify(profile.id, {
        email:    profile.email,
        plan:     profile.plan_tier || 'trial',
        projects: profile.projects_count || 0,
      })
    }
  }, [profile?.id])

  // Auto-load demo/reference project from URL param or first visit
  // NOTE: seedDemoProject / seedReferenceProject are defined below but hoisted
  // via function declarations, so referencing them here is safe.
  useEffect(() => {
    if (typeof window === 'undefined') return
    const params = new URLSearchParams(window.location.search)
    const demo = params.get('demo')
    const isFirstVisit = projects.length === 0 && !sessionStorage.getItem('vesimy_seeded')

    if (demo === 'realestate') {
      sessionStorage.setItem('vesimy_seeded', '1')
      setTimeout(() => seedDemoProject('/api/projects/seed-realestate', 'Real Estate Transaction Flow'), 800)
    } else if (demo === 'healthcare') {
      sessionStorage.setItem('vesimy_seeded', '1')
      setTimeout(() => seedDemoProject('/api/projects/seed-healthcare', 'Urgent Care Patient Flow'), 800)
    } else if (demo === 'brewery') {
      sessionStorage.setItem('vesimy_seeded', '1')
      setTimeout(() => seedDemoProject('/api/projects/seed-brewery', 'Craft Brewery Batch Production'), 800)
    } else if (demo === 'winery') {
      sessionStorage.setItem('vesimy_seeded', '1')
      setTimeout(() => seedDemoProject('/api/projects/seed-winery', 'Boutique Winery Production'), 800)
    } else if (params.get('ref') === '1' || isFirstVisit) {
      sessionStorage.setItem('vesimy_seeded', '1')
      setTimeout(() => seedReferenceProject(), 800)  // seeds only this user's industry
    }
  }, [])

  const isPro = ['pro','lifetime','enterprise'].includes(profile.plan_tier)
  const isUnlimited = ['pro', 'lifetime', 'enterprise', 'trialing'].includes(profile.plan_tier)
  const atLimit = !isUnlimited && projects.length >= (profile.projects_limit || 3)

  async function createProject() {
    if (!form.name.trim()) {
      toast.error('Project name is required')
      return
    }

    setCreating(true)

    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      const data = await res.json()

      if (!res.ok) {
        if (data.code === 'LIMIT_REACHED') {
          toast.error('Upgrade to Pro — up to 10 projects')
          router.push('/pricing')
        } else {
          throw new Error(data.error)
        }
        return
      }

      toast.success('Project created!')
      router.push(`/project/${data.project.id}`)
    } catch (e: any) {
      toast.error(e.message)
    } finally {
      setCreating(false)
    }
  }

  async function seedDemoProject(endpoint: string, label: string) {
    setSeedingRef(true)
    try {
      const res = await fetch(endpoint, { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to create demo project')
      toast.success(data.already_exists ? `Opening your ${label}…` : `${label} created — exploring now!`)
      router.push(`/project/${data.id}`)
    } catch (e: any) {
      toast.error(e.message)
    } finally {
      setSeedingRef(false)
    }
  }

  async function seedReferenceProject() {
    setSeedingRef(true)
    try {
      const res = await fetch('/api/projects/seed-industry-reference', { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to create reference projects')
      if (data.already_exists) {
        toast.success('All reference projects already loaded — check your dashboard')
      } else {
        toast.success(data.message || 'Reference projects added!')
      }
      if (data.id) router.push(`/project/${data.id}`)
      else router.refresh()
    } catch (e: any) {
      toast.error(e.message)
    } finally {
      setSeedingRef(false)
    }
  }

  const totalSteps = projects.reduce((a, p) => a + (p.steps?.length || 0), 0)
  const sorted = [...projects].sort(
    (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
  )
  const recentProject = sorted[0]

  return (
    <>
      <Suspense fallback={null}>
        <UpgradeToast />
      </Suspense>

      <div style={{
        backgroundImage: 'url(/sensario-texture.jpg), linear-gradient(135deg, rgba(1,118,211,0.08), rgba(3,45,96,0.12))',
        backgroundSize: '600px auto',
        backgroundRepeat: 'repeat-y',
        backgroundPosition: 'right -100px top',
        backgroundAttachment: 'fixed',
        backgroundBlendMode: 'luminosity',
        opacity: 1,
        position: 'relative',
      }}>
        {/* Overlay to control texture opacity without affecting children */}
        <div style={{ position: 'absolute', inset: 0, background: 'var(--bg)', opacity: 0.92, pointerEvents: 'none', zIndex: 0 }}/>
        <div style={{ position: 'relative', zIndex: 1 }}>
        <BetaBanner
          userId={profile.id}
          isBeta={(profile as any).is_beta}
          isLifetime={(profile as any).lifetime_access}
          betaExpiresAt={(profile as any).beta_expires_at}
          onClaimed={() => window.location.reload()}
        />

        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: 30,
            flexWrap: 'wrap',
            gap: 16,
          }}
        >
          <div style={{ maxWidth: 720 }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '6px 10px',
                borderRadius: 999,
                background: 'rgba(1,118,211,0.08)',
                border: '1px solid rgba(1,118,211,0.14)',
                marginBottom: 14,
              }}
            >
              <CrownIcon size={12} color="#0176D3" />
              <span
                style={{
                  fontSize: 10,
                  letterSpacing: 1.2,
                  textTransform: 'uppercase',
                  color: '#0176D3',
                  fontWeight: 700,
                }}
              >
                {getIndustryLabel((profile as any).industry)
                  ? `${getIndustryLabel((profile as any).industry)} Workspace`
                  : 'Operations Intelligence Workspace'}
              </span>
            </div>

            <h1
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 26,
                fontWeight: 700,
                color: 'var(--text)',
                marginBottom: 8,
                letterSpacing: 0.2,
                lineHeight: 1.05,
              }}
            >
              Welcome back
              {profile.full_name ? `, ${profile.full_name.split(' ')[0]}` : ''}
            </h1>

            <p style={{ fontSize: 14, color: 'var(--text2)', maxWidth: 620 }}>
              {projects.length === 0
                ? (() => { const t = getIndustryTerms((profile as any).industry); const l = getIndustryLabel((profile as any).industry); return `Map your ${t.process}, find the ${t.waste}, and build a record of every ${t.improvement}${l ? ' in ' + l : ''}. Start with your first project.` })()
                : (() => { const t = getIndustryTerms((profile as any).industry); const l = getIndustryLabel((profile as any).industry); return `${projects.length} active project${projects.length !== 1 ? 's' : ''} · ${totalSteps} ${t.processSteps} mapped · ${l || 'your'} workspace.` })()}
            </p>
          </div>

          <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
            {projects.length > 0 && (
              <div
                style={{
                  display: 'flex',
                  background: 'rgba(248,247,245,0.97)',
                  border: '1px solid rgba(40,40,92,0.45)',
                  borderRadius: 12,
                  overflow: 'hidden',
                  boxShadow: 'inset 0 1px 0 transparent',
                }}
              >
                {(['cards', 'list'] as const).map((v) => (
                  <button
                    key={v}
                    onClick={() => setView(v)}
                    style={{
                      padding: '9px 14px',
                      fontSize: 12,
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                      background: view === v ? 'rgba(1,118,211,0.12)' : 'transparent',
                      color: view === v ? '#0176D3' : 'var(--text2)',
                      fontWeight: view === v ? 700 : 500,
                    }}
                  >
                    {v.charAt(0).toUpperCase() + v.slice(1)}
                  </button>
                ))}
              </div>
            )}

            <button
              onClick={() => (atLimit ? router.push('/pricing') : setShowNew(true))}
              className="btn-primary"
              style={{ gap: 8, paddingInline: 18 }}
            >
              <PlusIcon size={15} />
              {atLimit ? 'Upgrade for more' : 'New Project'}
            </button>
          </div>
        </div>

        {/* Upgrade banner */}
        {atLimit && (
          <div
            className="card"
            style={{
              marginBottom: 24,
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 16,
              flexWrap: 'wrap',
              background:
                'linear-gradient(135deg, rgba(1,118,211,0.06), rgba(1,118,211,0.02) 42%, rgba(248,247,245,0.97))',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 10,
                  background: 'rgba(1,118,211,0.12)',
                  border: '1px solid rgba(1,118,211,0.22)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <CrownIcon size={16} color="#0176D3" />
              </div>

              <div>
                <div style={{ fontSize: 13, color: '#0176D3', fontWeight: 700 }}>
                  You’ve reached your trial project limit
                </div>
                <div style={{ fontSize: 13, color: 'var(--text2)', marginTop: 2 }}>
                  Upgrade to Pro — up to 10 projects, advanced tools, and premium workflows.
                </div>
              </div>
            </div>

            <Link
              href="/pricing"
              className="btn-primary"
              style={{ padding: '8px 16px', fontSize: 12, whiteSpace: 'nowrap' }}
            >
              Upgrade — $29/mo
            </Link>
          </div>
        )}

        {/* Stats */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))',
            gap: 14,
            marginBottom: 28,
          }}
        >
          <StatCard
            label="Projects"
            value={projects.length}
            icon={BarChartIcon}
            color="#0176D3"
            hint="Active workspaces"
          />
          <StatCard
            label="Steps Mapped"
            value={totalSteps}
            icon={ActivityIcon}
            color="#8C44CC"
            hint="Across all projects"
          />
          <StatCard
            label="Plan"
            value={isPro ? (profile.plan_tier === 'lifetime' ? 'Lifetime' : profile.plan_tier === 'enterprise' ? 'Enterprise' : 'Pro') : (profile.plan_tier === 'trial_expired' ? 'Expired' : 'Trial')}
            icon={CrownIcon}
            color="#6CB9FC"
            hint={isPro ? 'Premium access active' : 'Starter tier'}
          />
          <StatCard
            label="Last Active"
            value={`${profile.projects_count} projects`}
            icon={ZapIcon}
            color="#F4A623"
            hint="Keep the momentum going"
          />
        </div>

        {/* ── Reference Project — industry-specific ── */}
        {(() => {
          const industryId = (profile as any).industry || ''
          const industryLabel = getIndustryLabel(industryId)
          const t = getIndustryTerms(industryId)
          const refNames = getIndustryReferenceNames(industryId)
          const hasRefs = projects.some(p => refNames.includes(p.name))

          // Only show this card if not all refs are already loaded
          if (hasRefs) return null

          return (
            <div style={{ background: '#FFFFFF', border: '1px solid rgba(1,118,211,0.2)', borderRadius: 14, padding: '18px 20px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, flexWrap: 'wrap' }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, flexShrink: 0, background: 'rgba(1,118,211,0.10)', border: '1px solid rgba(1,118,211,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 800, fontFamily: 'monospace', color: 'var(--brand)', letterSpacing: 0.5 }}>REF</div>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 3 }}>
                    {industryLabel ? `${industryLabel} Reference Project` : 'Reference Project'}
                  </div>
                  <p style={{ fontSize: 12, color: 'var(--text3)', margin: 0, lineHeight: 1.6 }}>
                    A fully built {industryLabel || 'industry'} {t.process} — every CI tool populated with real bottleneck data, root causes drilled to source, kaizen events and PDCA ready to explore. Load it to see what a complete {t.valueStream || 'value stream'} looks like.
                  </p>
                </div>
                <button
                  onClick={seedReferenceProject}
                  disabled={seedingRef}
                  style={{ padding: '9px 18px', borderRadius: 8, fontWeight: 700, fontSize: 12, cursor: seedingRef ? 'not-allowed' : 'pointer', whiteSpace: 'nowrap', background: seedingRef ? 'var(--sl-100)' : 'linear-gradient(135deg,#0a5eaa,#0176D3)', color: seedingRef ? 'var(--text3)' : '#FFFFFF', border: 'none', flexShrink: 0, opacity: seedingRef ? 0.7 : 1 }}
                >
                  {seedingRef ? 'Loading…' : `Load ${industryLabel || 'Industry'} Reference →`}
                </button>
              </div>
              {refNames.length > 0 && (
                <div style={{ marginTop: 12, paddingTop: 10, borderTop: '1px solid var(--border)', display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {refNames.map(name => (
                    <div key={name} style={{ fontSize: 11, color: 'var(--text3)', background: 'rgba(1,118,211,0.05)', border: '1px solid rgba(1,118,211,0.12)', borderRadius: 6, padding: '3px 9px' }}>
                      {name.replace('Reference — ', '')}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })()}

        {/* Health overview */}
        {projects.length > 0 && <HealthOverview projects={projects} />}

        {/* Spring 2026 promo nudge */}
        {!isPro && new Date() < new Date('2026-04-21T00:00:00') && (
          <div style={{ background: '#FFFFFF', border: '0.5px solid var(--border)', borderRadius: 10, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 16 }}>🌱</span>
            <span style={{ fontSize: 13, color: 'var(--text2)', flex: 1 }}>
              <strong style={{ color: 'var(--text)' }}>Spring offer:</strong>
              {' '}20% off Pro — use <code style={{ color: '#C49B2E', fontWeight: 700 }}>SPRING25</code>
              {' '}at checkout. Ends 20 April 2026.
            </span>
            <Link href="/pricing" style={{ fontSize: 12, fontWeight: 700, color: '#C49B2E', textDecoration: 'none', whiteSpace: 'nowrap' }}>View pricing →</Link>
          </div>
        )}

        {/* Projects */}
        {projects.length === 0 ? (
          <div
            className="card"
            style={{
              padding: 56,
              textAlign: 'center',
              background:
                '#FFFFFF',
            }}
          >
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: 22,
                margin: '0 auto 18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(1,118,211,0.08)',
                border: '1px solid rgba(1,118,211,0.16)',
                fontSize: 34,
                color: '#0176D3',
              }}
            >
              ⊚
            </div>

            <h3
              style={{
                fontSize: 20,
                fontWeight: 650,
                color: 'var(--text)',
                marginBottom: 10,
                fontFamily: serif,
              }}
            >
              Start your first cycle
            </h3>

            <p
              style={{
                fontSize: 14,
                color: 'var(--text2)',
                marginBottom: 26,
                maxWidth: 420,
                marginInline: 'auto',
              }}
            >
              Create a project to begin mapping your value stream, measuring cycle performance,
              and revealing improvement opportunities.
            </p>

            <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button onClick={() => setShowNew(true)} className="btn-primary" style={{ gap: 8 }}>
                <PlusIcon size={15} /> Create First Project
              </button>

              <Link href="/learn" style={{ textDecoration: 'none' }} className="btn-ghost">
                Learn Lean Basics
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 14,
                gap: 12,
                flexWrap: 'wrap',
              }}
            >
              <h2
                style={{
                  fontSize: 11,
                  color: 'var(--text2)',
                  fontFamily: 'monospace',
                  letterSpacing: 1.6,
                  textTransform: 'uppercase',
                }}
              >
                Your Projects
              </h2>

              {recentProject && (
                <Link
                  href={`/project/${recentProject.id}`}
                  style={{
                    fontSize: 12,
                    color: '#0176D3',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    fontWeight: 600,
                  }}
                >
                  Resume last <ArrowRightIcon size={12} />
                </Link>
              )}
            </div>

            {view === 'cards' ? (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill,minmax(330px,1fr))',
                  gap: 14,
                }}
              >
                {sorted.map((p) => (
                  <ProjectHealthCard key={p.id} project={p as Project} />
                ))}

                {!atLimit && (
                  <button
                    onClick={() => setShowNew(true)}
                    className="card"
                    style={{
                      border: '1.5px dashed rgba(62,62,112,0.7)',
                      borderRadius: 18,
                      padding: 26,
                      cursor: 'pointer',
                      background:
                        'linear-gradient(180deg, rgba(255,255,255,0.015), rgba(255,255,255,0.005)), transparent',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 10,
                      minHeight: 118,
                    }}
                  >
                    <div
                      style={{
                        width: 42,
                        height: 42,
                        borderRadius: 12,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'transparent',
                        border: '1px solid transparent',
                      }}
                    >
                      <PlusIcon size={20} color="#6A678F" />
                    </div>
                    <span style={{ fontSize: 13, color: 'var(--text2)', fontWeight: 600 }}>
                      New Project
                    </span>
                  </button>
                )}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {sorted.map((p) => (
                  <ProjectHealthCard key={p.id} project={p as Project} />
                ))}
              </div>
            )}
          </>
        )}

        {/* New project modal */}
        {showNew && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.78)',
              backdropFilter: 'blur(10px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 200,
              padding: 24,
            }}
            onClick={(e) => e.target === e.currentTarget && setShowNew(false)}
          >
            <div
              className="card"
              style={{
                width: '100%',
                maxWidth: 480,
                padding: 30,
                borderRadius: 20,
                background:
                  'linear-gradient(180deg, transparent, rgba(255,255,255,0.008)), var(--sl-50)',
              }}
            >
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '6px 10px',
                  borderRadius: 999,
                  background: 'rgba(1,118,211,0.08)',
                  border: '1px solid rgba(1,118,211,0.14)',
                  marginBottom: 14,
                }}
              >
                <PlusIcon size={11} color="#0176D3" />
                <span
                  style={{
                    fontSize: 10,
                    color: '#0176D3',
                    fontWeight: 700,
                    letterSpacing: 1.2,
                    textTransform: 'uppercase',
                  }}
                >
                  New Workspace
                </span>
              </div>

              <h2
                style={{
                  fontSize: 24,
                  fontWeight: 700,
                  color: 'var(--text)',
                  marginBottom: 8,
                  fontFamily: serif,
                }}
              >
                Create a new project
              </h2>

              <p style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 22 }}>
                Every strong improvement cycle starts with a clear scope and a sharp name.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label className="label">Project Name *</label>
                  <input
                    className="input"
                    placeholder="e.g. Assembly Line A — Current State"
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    onKeyDown={(e) => e.key === 'Enter' && createProject()}
                    autoFocus
                  />
                </div>

                <div>
                  <label className="label">Industry</label>
                  <select
                    className="input"
                    value={form.industry}
                    onChange={(e) => setForm((f) => ({ ...f, industry: e.target.value }))}
                  >
                    <option value="">Select industry…</option>
                    {INDUSTRY_SECTORS.map(sector => (
                      <optgroup key={sector} label={sector}>
                        {getIndustriesBySector(sector).map(ind => (
                          <option key={ind.id} value={ind.id}>{ind.label}</option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="label">Customer / End User</label>
                  <input
                    className="input"
                    placeholder="e.g. OEM Assembly Plant"
                    value={form.customer}
                    onChange={(e) => setForm((f) => ({ ...f, customer: e.target.value }))}
                  />
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  gap: 10,
                  marginTop: 24,
                  justifyContent: 'flex-end',
                  flexWrap: 'wrap',
                }}
              >
                <button onClick={() => setShowNew(false)} className="btn-ghost">
                  Cancel
                </button>

                <button onClick={createProject} disabled={creating} className="btn-primary">
                  {creating ? 'Creating…' : 'Create Project →'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>{/* /zIndex:1 wrapper */}
      </div>{/* /texture wrapper */}
    </>
  )
}