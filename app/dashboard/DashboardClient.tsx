// @ts-nocheck
// ── app/dashboard/DashboardClient.tsx ────────────────────────────────────────
'use client'

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
import Link from 'next/link'
import { BetaBanner } from '@/components/beta/BetaBanner'
import { useAnalytics } from '@/hooks/useAnalytics'

interface Props {
  profile: Profile
  initialProjects: Project[]
}

function UpgradeToast() {
  const params = useSearchParams()

  useEffect(() => {
    if (params.get('upgraded') === 'true') {
      const plan = params.get('plan') || 'pro'
      toast.success(
        `🎉 Welcome to VeSiMy ${plan.charAt(0).toUpperCase() + plan.slice(1)}! Your plan is now active.`,
        { duration: 6000 }
      )
      window.history.replaceState({}, '', '/dashboard')
    }
  }, [params])

  return null
}

const INDUSTRIES = [
  'Manufacturing',
  'Healthcare',
  'Logistics',
  'Retail',
  'Food & Beverage',
  'Construction',
  'Domestic',
  'Other',
]

const serif = 'Palatino Linotype,Book Antiqua,Palatino,serif'

function getProjectScore(project: Project) {
  const count = project.steps?.length || 0
  return Math.min(
    100,
    (count > 0 ? 25 : 0) +
      (count > 3 ? 20 : 0) +
      (count > 6 ? 15 : 0) +
      (project.industry ? 20 : 0) +
      (new Date(project.updated_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) ? 20 : 0)
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
function ProjectHealthCard({ project }: { project: Project }) {
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
        background:
          'rgba(248,247,245,0.97)',
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
            PORTFOLIO HEALTH
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
      className="card"
      style={{
        padding: '18px 18px 16px',
        minHeight: 116,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 12,
        }}
      >
        <span
          style={{
            fontSize: 10,
            color: 'var(--text2)',
            letterSpacing: 1.2,
            textTransform: 'uppercase',
            fontFamily: 'monospace',
          }}
        >
          {label}
        </span>

        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: 9,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: `${color}14`,
            border: `1px solid ${color}25`,
          }}
        >
          <Icon size={13} color={color} />
        </div>
      </div>

      <div style={{ fontSize: 26, fontWeight: 700, color: 'var(--text)', lineHeight: 1.1 }}>
        {value}
      </div>

      {hint && (
        <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 10 }}>
          {hint}
        </div>
      )}
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────
export function DashboardClient({ profile, initialProjects }: Props) {
  const { identify, track } = useAnalytics()

  useEffect(() => {
    if (profile?.id) {
      identify(profile.id, {
        email:    profile.email,
        plan:     profile.plan_tier || 'free',
        projects: profile.projects_count || 0,
      })
    }
  }, [profile?.id])

  // Auto-load demo/reference project from URL param or first visit
  useEffect(() => {
    if (typeof window === 'undefined') return
    const params = new URLSearchParams(window.location.search)
    const demo = params.get('demo')
    const isFirstVisit = projects.length === 0 && !sessionStorage.getItem('vesimy_seeded')

    if (demo === 'realestate') {
      sessionStorage.setItem('vesimy_seeded', '1')
      setTimeout(() => seedDemoProject('/api/projects/seed-realestate', 'Real Estate demo'), 800)
    } else if (demo === 'healthcare') {
      sessionStorage.setItem('vesimy_seeded', '1')
      setTimeout(() => seedDemoProject('/api/projects/seed-healthcare', 'Healthcare demo'), 800)
    } else if (demo === 'brewery') {
      sessionStorage.setItem('vesimy_seeded', '1')
      setTimeout(() => seedDemoProject('/api/projects/seed-brewery', 'Craft Brewery demo'), 800)
    } else if (demo === 'winery') {
      sessionStorage.setItem('vesimy_seeded', '1')
      setTimeout(() => seedDemoProject('/api/projects/seed-winery', 'Winery demo'), 800)
    } else if (params.get('ref') === '1' || isFirstVisit) {
      sessionStorage.setItem('vesimy_seeded', '1')
      setTimeout(() => seedReferenceProject(), 800)  // seeds all 5 industries
    }
  }, [])

  const router = useRouter()
  const [projects] = useState(initialProjects)
  const [creating, setCreating] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [form, setForm] = useState({ name: '', industry: '', customer: '' })
  const [view, setView] = useState<'cards' | 'list'>('cards')
  const [seedingRef, setSeedingRef] = useState(false)

  const isPro = ['pro','lifetime','enterprise'].includes(profile.plan_tier)
  const atLimit = false // Free tier unlimited

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
      const res = await fetch('/api/projects/seed-all-references', { method: 'POST' })
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

      <div>
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
                background: 'rgba(212,162,8,0.08)',
                border: '1px solid rgba(212,162,8,0.14)',
                marginBottom: 14,
              }}
            >
              <CrownIcon size={12} color="#D4A208" />
              <span
                style={{
                  fontSize: 10,
                  letterSpacing: 1.2,
                  textTransform: 'uppercase',
                  color: '#D4A208',
                  fontWeight: 700,
                }}
              >
                Operations Intelligence Workspace
              </span>
            </div>

            <h1
              style={{
                fontFamily: serif,
                fontSize: 34,
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
                ? 'Create your first project to start mapping your current state and uncovering improvement opportunities.'
                : `${projects.length} active project${projects.length !== 1 ? 's' : ''} · ${totalSteps} total steps mapped across your workspace.`}
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
                      background: view === v ? 'rgba(212,162,8,0.12)' : 'transparent',
                      color: view === v ? '#D4A208' : 'var(--text2)',
                      fontWeight: view === v ? 700 : 500,
                    }}
                  >
                    {v === 'cards' ? '⊞' : '☰'} {v.charAt(0).toUpperCase() + v.slice(1)}
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
                'linear-gradient(135deg, rgba(212,162,8,0.06), rgba(212,162,8,0.02) 42%, rgba(248,247,245,0.97))',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 10,
                  background: 'rgba(212,162,8,0.12)',
                  border: '1px solid rgba(212,162,8,0.22)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <CrownIcon size={16} color="#D4A208" />
              </div>

              <div>
                <div style={{ fontSize: 13, color: '#D4A208', fontWeight: 700 }}>
                  You’ve reached your free project limit
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
            color="#D4A208"
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
            value={isPro ? 'Pro' : 'Free'}
            icon={CrownIcon}
            color="#6CB9FC"
            hint={isPro ? 'Premium access active' : 'Starter tier'}
          />
          <StatCard
            label="Slots Used"
            value={`${profile.projects_count} projects`}
            icon={ZapIcon}
            color="#F4A623"
            hint="Project capacity"
          />
        </div>

        {/* ── Reference Projects — all 5 industries ── */}
        <div style={{ background: '#FFFFFF', border: '1px solid var(--border)', borderRadius: 14, padding: '18px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 14, flexWrap: 'wrap' }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, flexShrink: 0, background: 'rgba(196,155,46,0.10)', border: '1px solid rgba(196,155,46,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>⭐</div>
            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 3 }}>Reference Projects — 5 Industries</div>
              <p style={{ fontSize: 12, color: 'var(--text3)', margin: 0, lineHeight: 1.6 }}>
                Load fully-built reference projects across every supported industry. Every CI tool populated, real bottlenecks, root causes drilled to source. Use them as guides when building your own process maps.
              </p>
            </div>
            <button
              onClick={seedReferenceProject}
              disabled={seedingRef}
              style={{ padding: '9px 18px', borderRadius: 8, fontWeight: 700, fontSize: 12, cursor: seedingRef ? 'not-allowed' : 'pointer', whiteSpace: 'nowrap', background: seedingRef ? 'var(--sl-100)' : 'linear-gradient(135deg,#C49510,#D4A208)', color: seedingRef ? 'var(--text3)' : '#FFFFFF', border: 'none', flexShrink: 0, opacity: seedingRef ? 0.7 : 1 }}
            >
              {seedingRef ? 'Loading…' : 'Load All Reference Projects →'}
            </button>
          </div>
          {/* Industry chips */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {([
              { icon: '🏭', label: 'Manufacturing', color: '#3070B8', desc: 'Seat Assembly — VSM, Time Study, 5 Why, Fishbone, Waste, Kaizen, Yamazumi, PDCA, A3' },
              { icon: '🏥', label: 'Healthcare', color: '#2A9E82', desc: 'Urgent Care — Patient flow, 3.2hr lead time, treatment bottleneck, Supe analysis' },
              { icon: '🏠', label: 'Real Estate', color: '#C49B2E', desc: 'Transactions — Lead to close, 28% doc kickback, 5 Why to standard work gap' },
              { icon: '🍺', label: 'Craft Brewery', color: '#C0402A', desc: 'Batch Production — Fermenter constraint, stuck sparge root cause, canning line' },
              { icon: '🍷', label: 'Winery', color: '#6426A0', desc: 'Boutique Wine — 80 barrels at capacity, 6% barrel defect, no tracking system' },
            ] as any[]).map((ind: any) => (
              <div key={ind.label} title={ind.desc} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '4px 10px', borderRadius: 100, background: `${ind.color}0F`, border: `1px solid ${ind.color}30`, fontSize: 11 }}>
                <span style={{ fontSize: 13 }}>{ind.icon}</span>
                <span style={{ fontWeight: 600, color: ind.color }}>{ind.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Health overview */}
        {projects.length > 0 && <HealthOverview projects={projects} />}

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
                background: 'rgba(212,162,8,0.08)',
                border: '1px solid rgba(212,162,8,0.16)',
                fontSize: 34,
                color: '#D4A208',
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
                📖 Learn Lean Basics
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
                    color: '#D4A208',
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
                  <ProjectHealthCard key={p.id} project={p} />
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
                  <ProjectHealthCard key={p.id} project={p} />
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
                  background: 'rgba(212,162,8,0.08)',
                  border: '1px solid rgba(212,162,8,0.14)',
                  marginBottom: 14,
                }}
              >
                <PlusIcon size={11} color="#D4A208" />
                <span
                  style={{
                    fontSize: 10,
                    color: '#D4A208',
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
                    {INDUSTRIES.map((i) => (
                      <option key={i}>{i}</option>
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
      </div>
    </>
  )
}