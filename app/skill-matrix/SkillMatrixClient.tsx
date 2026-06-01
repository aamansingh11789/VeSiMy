// TypeScript enabled
// ── app/skill-matrix/SkillMatrixClient.tsx ────────────────────────────────────
'use client'

import { useState } from 'react'
import Link from 'next/link'

const BRAND = '#0176D3'
const serif = 'Palatino Linotype,Book Antiqua,Palatino,serif'
const mono  = '"JetBrains Mono","IBM Plex Mono",monospace'

const MATURITY_CONFIG = {
  beginner: {
    label: 'Beginner',
    color: '#F4A623',
    desc: 'Building foundational mapping habits. AI provides full guidance with detailed explanations.',
    badge: '🌱',
    next: 'Complete 3+ projects with at least 3 CT laps per step to progress to Intermediate.',
  },
  intermediate: {
    label: 'Intermediate',
    color: '#0176D3',
    desc: 'Consistent data quality developing. AI provides standard recommendations with lean terminology.',
    badge: '⚡',
    next: 'Use 4+ different CI tools and achieve 80%+ CT consistency to progress to Advanced.',
  },
  advanced: {
    label: 'Advanced',
    color: '#2E844A',
    desc: 'Strong practitioner habits. AI gives data-only recommendations. Explanations available on request.',
    badge: '🎯',
    next: 'You are operating at the advanced level. Maintain data quality and tool depth.',
  },
}

function DimensionBar({ label, value, max = 100, color }: { label: string; value: number; max?: number; color: string }) {
  const pct = Math.min(100, Math.round((value / max) * 100))
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{label}</span>
        <span style={{ fontSize: 12, fontFamily: mono, color }}>{pct}%</span>
      </div>
      <div style={{ height: 8, background: 'var(--bg4)', borderRadius: 4, overflow: 'hidden' }}>
        <div style={{
          height: '100%', width: `${pct}%`,
          background: `linear-gradient(90deg, ${color}, ${color}99)`,
          borderRadius: 4,
          transition: 'width 1s cubic-bezier(0.25,0.46,0.45,0.94)',
        }} />
      </div>
      <div style={{ height: 4 }} />
    </div>
  )
}

interface Props {
  profile: any
  skillData: any
  events: any[]
  projectCount: number
}

export default function SkillMatrixClient({ profile, skillData, events, projectCount }: Props) {
  const [tab, setTab] = useState<'overview' | 'breakdown' | 'coaching' | 'history'>('overview')

  const maturity = (skillData?.maturity_level as keyof typeof MATURITY_CONFIG) || 'beginner'
  const mc       = MATURITY_CONFIG[maturity]

  const tools    = Array.isArray(skillData?.tools_used) ? skillData.tools_used : []
  const hasData  = !!skillData

  return (
    <div style={{ padding: 'clamp(20px,4vw,40px)', maxWidth: 860, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 10, fontFamily: mono, color: BRAND, letterSpacing: 2, marginBottom: 6 }}>TEAM SKILL MATRIX</div>
        <h1 style={{ fontFamily: serif, fontSize: 'clamp(22px,3vw,32px)', fontWeight: 700, color: 'var(--text)', margin: '0 0 8px' }}>
          Your Lean Improvement Profile
        </h1>
        <p style={{ color: 'var(--text2)', fontSize: 15, lineHeight: 1.6, margin: 0 }}>
          Tracked automatically across your projects. No self-assessment. The numbers come from how you work.
        </p>
      </div>

      {/* Maturity level card */}
      <div style={{
        background: `linear-gradient(135deg, ${mc.color}10, ${mc.color}05)`,
        border: `1px solid ${mc.color}30`,
        borderRadius: 16, padding: '24px 28px', marginBottom: 28,
        display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap',
      }}>
        <div style={{ fontSize: 48 }}>{mc.badge}</div>
        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ fontSize: 10, fontFamily: mono, letterSpacing: 2, color: mc.color, marginBottom: 4 }}>MATURITY LEVEL</div>
          <div style={{ fontFamily: serif, fontSize: 28, fontWeight: 700, color: 'var(--text)', marginBottom: 6 }}>{mc.label}</div>
          <p style={{ color: 'var(--text2)', fontSize: 14, lineHeight: 1.65, margin: 0 }}>{mc.desc}</p>
        </div>
        <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 12, padding: '16px 20px', textAlign: 'center', flexShrink: 0 }}>
          <div style={{ fontSize: 36, fontWeight: 700, fontFamily: serif, color: BRAND }}>{projectCount}</div>
          <div style={{ fontSize: 11, color: 'var(--text3)', fontFamily: mono }}>PROJECTS</div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', marginBottom: 24, gap: 2 }}>
        {(['overview', 'breakdown', 'coaching', 'history'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: '9px 16px', border: 'none', cursor: 'pointer', fontFamily: 'inherit',
            borderBottom: `2px solid ${tab === t ? BRAND : 'transparent'}`,
            background: 'none',
            color: tab === t ? BRAND : 'var(--text3)',
            fontSize: 13, fontWeight: 700,
            textTransform: 'capitalize' as const,
          }}>{t}</button>
        ))}
      </div>

      {/* OVERVIEW */}
      {tab === 'overview' && (
        <div>
          {!hasData ? (
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>📊</div>
              <h2 style={{ fontFamily: serif, fontSize: 22, color: 'var(--text)', marginBottom: 10 }}>No data yet</h2>
              <p style={{ color: 'var(--text2)', fontSize: 14, maxWidth: 400, margin: '0 auto 24px', lineHeight: 1.7 }}>
                Your skill matrix builds automatically as you work. Complete projects, use CI tools, and measure with the stopwatch. The profile appears after your first project.
              </p>
              <Link href="/dashboard" style={{ padding: '10px 24px', background: BRAND, color: '#fff', borderRadius: 8, textDecoration: 'none', fontSize: 14, fontWeight: 700 }}>
                Start a project →
              </Link>
            </div>
          ) : (
            <div>
              <DimensionBar label="Cycle time data quality" value={skillData?.ct_consistency_score ?? 0} color={BRAND} />
              <DimensionBar label="WIP capture completeness" value={skillData?.wip_completeness_score ?? 0} color="#A8854F" />
              <DimensionBar label="Defect format consistency" value={skillData?.defect_format_consistency_score ?? 0} color="#2E844A" />
              <DimensionBar label="AI recommendation acceptance" value={Math.round((skillData?.ai_acceptance_rate ?? 0) * 100)} color="#1DD1A1" />
              <DimensionBar label="Tool usage breadth" value={(tools.length / 7) * 100} color="#F4A623" />

              <div style={{ background: `${mc.color}08`, border: `1px solid ${mc.color}20`, borderRadius: 10, padding: '14px 18px', marginTop: 24 }}>
                <div style={{ fontSize: 11, fontWeight: 700, fontFamily: mono, color: mc.color, marginBottom: 6 }}>NEXT LEVEL</div>
                <p style={{ color: 'var(--text2)', fontSize: 13, lineHeight: 1.65, margin: 0 }}>{mc.next}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* BREAKDOWN */}
      {tab === 'breakdown' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 16 }}>
            {[
              { label: 'Avg CT laps per step',    value: skillData?.ct_consistency_score ? `${Math.round(skillData.ct_consistency_score)}%` : ',', sub: '% steps with 3+ laps',    icon: '⏱' },
              { label: 'Steps mapped total',       value: skillData?.total_steps_mapped ?? ',',                                                   sub: 'across all projects',       icon: '📋' },
              { label: 'Avg efficiency improvement', value: skillData?.avg_efficiency_improvement ? `+${skillData.avg_efficiency_improvement.toFixed(1)}%` : ',', sub: 'PCE gain per project', icon: '📈' },
              { label: 'Lead time reduction',      value: skillData?.avg_lead_time_reduction ? `${skillData.avg_lead_time_reduction.toFixed(0)}%` : ',', sub: 'average across projects', icon: '⚡' },
            ].map(m => (
              <div key={m.label} style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 12, padding: '18px 20px', textAlign: 'center' }}>
                <div style={{ fontSize: 24, marginBottom: 8 }}>{m.icon}</div>
                <div style={{ fontFamily: serif, fontSize: 26, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>{m.value}</div>
                <div style={{ fontSize: 11, color: 'var(--text3)', fontFamily: mono }}>{m.label.toUpperCase()}</div>
                <div style={{ fontSize: 11, color: 'var(--text4)' }}>{m.sub}</div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 24 }}>
            <div style={{ fontSize: 11, fontFamily: mono, color: 'var(--text3)', marginBottom: 12 }}>TOOLS USED</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {['stopwatch', 'fivewhy', 'ishikawa', 'waste', 'kaizen', 'smed', 'ooda', 'eightd', 'dmaic'].map(tool => {
                const used = tools.includes(tool)
                return (
                  <div key={tool} style={{
                    padding: '6px 12px', borderRadius: 6, fontSize: 12, fontWeight: 700,
                    background: used ? 'rgba(1,118,211,0.1)' : 'var(--bg3)',
                    border: `1px solid ${used ? 'rgba(1,118,211,0.3)' : 'var(--border)'}`,
                    color: used ? BRAND : 'var(--text4)',
                  }}>{used ? '✓ ' : ''}{tool.toUpperCase()}</div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* COACHING */}
      {tab === 'coaching' && (
        <div>
          {skillData?.last_coaching_note ? (
            <div>
              <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 14, padding: '24px 28px', marginBottom: 20 }}>
                <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
                  <span style={{ fontSize: 24 }}>🤖</span>
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--text)', fontSize: 15 }}>AI Coaching Note</div>
                    <div style={{ fontSize: 12, color: 'var(--text3)' }}>
                      Generated {skillData.last_coaching_generated_at ? new Date(skillData.last_coaching_generated_at).toLocaleDateString() : 'recently'}
                    </div>
                  </div>
                </div>
                <p style={{ color: 'var(--text2)', fontSize: 15, lineHeight: 1.8, margin: 0, fontFamily: serif }}>
                  {skillData.last_coaching_note}
                </p>
              </div>
              <div style={{ background: 'rgba(1,118,211,0.05)', border: '1px solid rgba(1,118,211,0.15)', borderRadius: 10, padding: '12px 16px' }}>
                <p style={{ color: 'var(--text3)', fontSize: 12, lineHeight: 1.65, margin: 0 }}>
                  Coaching notes are generated at project completion. They are based entirely on your project data, mapping speed, data quality, and tool usage. They are constructive prompts, not performance evaluations.
                </p>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🤖</div>
              <h2 style={{ fontFamily: serif, fontSize: 22, color: 'var(--text)', marginBottom: 10 }}>No coaching note yet</h2>
              <p style={{ color: 'var(--text2)', fontSize: 14, maxWidth: 360, margin: '0 auto', lineHeight: 1.7 }}>
                A coaching note is generated after your first project completion. It will tell you what went well, what took longer than expected, and what to focus on next time.
              </p>
            </div>
          )}
        </div>
      )}

      {/* HISTORY */}
      {tab === 'history' && (
        <div>
          {events.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text3)', fontSize: 14 }}>
              No activity recorded yet. Events appear as you work on projects.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {events.map((ev: any) => (
                <div key={ev.id} style={{ display: 'flex', gap: 14, padding: '10px 14px', background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 8 }}>
                  <div style={{ fontSize: 20, flexShrink: 0 }}>
                    {ev.event_type === 'project_completed' ? '✅' : ev.event_type === 'tool_used' ? '🔧' : ev.event_type === 'analysis_run' ? '📊' : '⚡'}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', textTransform: 'capitalize' as const }}>
                      {ev.event_type.replace(/_/g, ' ')}
                    </div>
                    {ev.data?.tool && <div style={{ fontSize: 12, color: 'var(--text3)' }}>Tool: {ev.data.tool}</div>}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text4)', fontFamily: mono, flexShrink: 0 }}>
                    {new Date(ev.created_at).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
