'use client'
// @ts-nocheck
// ── app/page.tsx — VeSiMy Homepage ───────────────────────────────────────────

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { VLogoMark, VeSiMyWordmark, VesimyLogo } from '@/components/ui/Logo'
import { PLANS } from '@/lib/stripe'
import { CheckIcon, ArrowRightIcon } from '@/components/ui/Icons'

const serif = 'Palatino Linotype,Book Antiqua,Palatino,Georgia,serif'

// ── Inline 3D VSM step box ────────────────────────────────────────────────────
function IsoStep({ name, sub, ct, type, isBn = false }: any) {
  const colors: Record<string, { fill: string; top: string; side: string; text: string; badge: string; badgeText: string }> = {
    va:   { fill: '#EDF9F5', top: '#D4F0E8', side: '#7DCAB5', text: '#0A4535', badge: '#EDF9F5', badgeText: '#0F6E56' },
    nnva: { fill: '#FEF9EE', top: '#FEF0CC', side: '#DEB96A', text: '#5A3A00', badge: '#FEF9EE', badgeText: '#854F0B' },
    bn:   { fill: '#FEF2F0', top: '#FDDDD9', side: '#E8735A', text: '#7A1A0A', badge: '#FEF2F0', badgeText: '#A83222' },
  }
  const c = colors[isBn ? 'bn' : type] || colors.va
  return (
    <svg width="82" height="62" viewBox="0 0 82 62" fill="none" style={{ flexShrink: 0 }}>
      {/* depth */}
      <path d={`M14 16 H68 L74 10 H20 Z`} fill={c.side} opacity="0.42" />
      <path d={`M68 16 L74 10 L74 50 L68 56 Z`} fill={c.side} opacity="0.55" />
      {/* front */}
      <rect x="14" y="16" width="54" height="40" rx="2" fill={c.fill} stroke={isBn ? '#C0402A' : c.side} strokeWidth={isBn ? 1.5 : 1} />
      {/* top bevel */}
      <path d={`M14 16 L20 10 L74 10 L68 16 Z`} fill={c.top} stroke={c.side} strokeWidth="0.8" />
      {/* right face */}
      <path d={`M68 16 L74 10 L74 50 L68 56 Z`} fill={c.top} stroke={c.side} strokeWidth="0.8" opacity="0.7" />
      {/* burst on bottleneck */}
      {isBn && (
        <polygon points="12,8 13.4,12 18,12 14.2,14.6 15.4,19 12,16.4 8.6,19 9.8,14.6 6,12 10.6,12"
                 fill="#C0402A" opacity="0.9" />
      )}
      {/* name */}
      <text x="41" y="31" textAnchor="middle" fontSize="7.5" fontWeight="600" fill={c.text} fontFamily="sans-serif">{name}</text>
      {sub && <text x="41" y="40" textAnchor="middle" fontSize="7" fill={c.text} fontFamily="sans-serif">{sub}</text>}
      {/* ct badge */}
      <rect x="20" y="48" width="42" height="9" rx="2" fill={c.badge} stroke={isBn ? '#C0402A' : c.side} strokeWidth="0.6" />
      <text x="41" y="54.5" textAnchor="middle" fontSize="6.5" fontWeight="700" fill={isBn ? '#A83222' : c.badgeText} fontFamily="monospace">{ct}</text>
    </svg>
  )
}

function WipCoins({ n, color = '#DEB96A', bg = '#FEF9EE' }: any) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, flexShrink: 0 }}>
      {Array.from({ length: Math.min(n, 3) }).map((_, i) => (
        <div key={i} style={{ width: 16, height: 5, borderRadius: '50%', border: `1px solid ${color}`, background: bg, opacity: 1 - i * 0.25 }} />
      ))}
      <span style={{ fontSize: 6, color: '#8E8A82', fontFamily: 'monospace' }}>{n}</span>
    </div>
  )
}

export default function HomePage() {
  const [pce, setPce] = useState(36)
  const [bnVis, setBnVis] = useState(true)
  const dir = useRef(1)

  useEffect(() => {
    const t1 = setInterval(() => {
      setPce(p => {
        const next = p + dir.current * 0.4
        if (next > 40 || next < 33) dir.current *= -1
        return next
      })
    }, 100)
    const t2 = setInterval(() => setBnVis(v => !v), 950)
    return () => { clearInterval(t1); clearInterval(t2) }
  }, [])

  return (
    <div style={{ background: '#F8F7F5', color: '#242220', fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, sans-serif', overflowX: 'hidden' }}>
      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @keyframes mq { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        .reveal { opacity:0; animation: fadeUp 0.7s ease forwards; }
        .r1 { animation-delay:0.05s } .r2 { animation-delay:0.18s }
        .r3 { animation-delay:0.30s } .r4 { animation-delay:0.44s }
        .r5 { animation-delay:0.56s }
        .nav-link { color:#6B6760; text-decoration:none; font-size:13px; transition:color 0.15s; }
        .nav-link:hover { color:#242220; }
        @media(max-width:768px){
          .hero-grid{grid-template-columns:1fr!important;padding:40px 20px 0!important;}
          .hero-text{padding-right:0!important;}
          .vsm-card{display:none!important;}
          .feat-grid{grid-template-columns:1fr!important;}
          .tools-grid{grid-template-columns:1fr 1fr!important;}
          .plan-grid{grid-template-columns:1fr!important;}
          .hide-mobile{display:none!important;}
          .nav-pad{padding:0 20px!important;}
          .sec-pad{padding:40px 20px!important;}
        }
      `}</style>

      {/* ── NAV ─────────────────────────────────────────────────────────────── */}
      <nav className="nav-pad" style={{ position: 'sticky', top: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 48px', height: 60, background: '#FFFFFF', borderBottom: '0.5px solid #D8D5CE' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <VLogoMark size={30} />
          <VeSiMyWordmark size={19} />
        </div>
        <div className="hide-mobile" style={{ display: 'flex', gap: 28 }}>
          {[['Tools', '#tools'], ['Pricing', '#pricing'], ['Blog', '/blog'], ['Learn', '/learn']].map(([l, h]) => (
            <a key={l} href={h} className="nav-link">{l}</a>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <Link href="/auth/login" style={{ padding: '7px 16px', background: 'transparent', border: '1px solid #D8D5CE', borderRadius: 8, fontSize: 13, color: '#4E4B45', textDecoration: 'none' }}>
            Sign in
          </Link>
          <Link href="/auth/signup" style={{ padding: '7px 18px', background: '#C49B2E', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 700, color: '#fff', textDecoration: 'none' }}>
            Start free
          </Link>
        </div>
      </nav>

      {/* ── HERO ────────────────────────────────────────────────────────────── */}
      <section className="hero-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1.12fr', minHeight: 620, alignItems: 'center', padding: '56px 48px 0', gap: 32, background: '#F8F7F5', overflow: 'hidden' }}>

        <div className="hero-text" style={{ paddingRight: 24 }}>

          {/* Eyebrow */}
          <div className="reveal r1" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 11, fontWeight: 600, letterSpacing: 1.4, textTransform: 'uppercase', color: '#C49B2E', border: '1px solid rgba(196,155,46,0.3)', borderRadius: 999, padding: '5px 14px', marginBottom: 22, background: 'rgba(196,155,46,0.06)' }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#C49B2E', animation: 'blink 2s infinite' }} />
            Lean CI Platform · ISO 22468:2020
          </div>

          {/* Headline */}
          <h1 className="reveal r2" style={{ fontSize: 'clamp(36px,4vw,54px)', lineHeight: 1.08, fontWeight: 700, color: '#242220', marginBottom: 18, letterSpacing: -0.5, fontFamily: serif }}>
            Map the waste.<br /><span style={{ color: '#C49B2E' }}>Kill</span> the waste.<br />Repeat.
          </h1>

          {/* V Trade Statement */}
          <div className="reveal r3" style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 24, padding: '14px 16px', background: '#FFFFFF', border: '1px solid #D8D5CE', borderLeft: '3px solid #C49B2E', borderRadius: '0 10px 10px 0' }}>
            <span style={{ fontSize: 32, fontWeight: 800, color: '#C49B2E', fontFamily: serif, lineHeight: 1 }}>V</span>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#242220', lineHeight: 1.3 }}>Add Value to your process and yourself</div>
              <div style={{ fontSize: 12, color: '#8E8A82', marginTop: 3, lineHeight: 1.5 }}>Value Stream · Value Add · Value for your team</div>
            </div>
          </div>

          <p className="reveal r3" style={{ fontSize: 15, color: '#6B6760', lineHeight: 1.8, marginBottom: 30, maxWidth: 420 }}>
            A complete lean CI toolkit — VSM, time study, fishbone, 5&nbsp;Why, kaizen, PDCA — all connected, all free.
          </p>

          <div className="reveal r4" style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <Link href="/auth/signup" style={{ padding: '13px 28px', background: '#C49B2E', color: '#fff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              Start your 14-day free trial <ArrowRightIcon size={14} color="#fff" />
            </Link>
            <Link href="/auth/signup" style={{ padding: '13px 20px', background: '#fff', color: '#4E4B45', border: '1px solid #D8D5CE', borderRadius: 10, fontSize: 14, textDecoration: 'none' }}>
              See reference project →
            </Link>
          </div>

          <p className="reveal r5" style={{ fontSize: 11, color: '#8E8A82', marginTop: 14 }}>
            14-day free trial · No credit card · Cancel anytime
          </p>
        </div>

        {/* ── VSM PREVIEW CARD ── */}
        <div className="vsm-card" style={{ background: '#fff', borderRadius: '16px 16px 0 0', border: '1px solid #D8D5CE', borderBottom: 'none', padding: '16px 16px 0', boxShadow: '0 -4px 32px rgba(0,0,0,0.08)', transform: 'perspective(900px) rotateX(2deg)', transformOrigin: 'bottom center' }}>

          {/* Card top bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 12, paddingBottom: 11, borderBottom: '0.5px solid #ECEAE6' }}>
            <div style={{ display: 'flex', gap: 5 }}>
              {['#E8A49A', '#DEB96A', '#7DCAB5'].map(c => <div key={c} style={{ width: 9, height: 9, borderRadius: '50%', background: c }} />)}
            </div>
            <span style={{ fontSize: 10, color: '#8E8A82', flex: 1, marginLeft: 5 }}>Seat Assembly Line 4 — Current State VSM</span>
            <span style={{ fontSize: 8, padding: '2px 7px', borderRadius: 999, fontWeight: 700, background: '#EEF4FB', color: '#1A4F8A' }}>ISO 22468:2020</span>
          </div>

          {/* KPIs */}
          <div style={{ display: 'flex', border: '0.5px solid #D8D5CE', borderRadius: 7, overflow: 'hidden', marginBottom: 12 }}>
            {[
              { label: 'Total CT', val: '8m 20s', color: '#C49B2E' },
              { label: 'Takt', val: '2m 00s', color: '#C49B2E' },
              { label: 'PCE', val: `${Math.round(pce)}%`, color: '#C0402A' },
              { label: 'WIP', val: '47', color: '#C49B2E' },
              { label: 'Open KZ', val: '4', color: '#C49B2E' },
            ].map((k, i) => (
              <div key={i} style={{ flex: 1, padding: '6px 8px', textAlign: 'center', borderRight: i < 4 ? '0.5px solid #D8D5CE' : 'none' }}>
                <div style={{ fontSize: 7, color: '#8E8A82', letterSpacing: 1.2, textTransform: 'uppercase' }}>{k.label}</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: k.color, marginTop: 1 }}>{k.val}</div>
              </div>
            ))}
          </div>

          {/* 3D ISO Steps */}
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, overflowX: 'auto', paddingBottom: 2 }}>
            <IsoStep name="Material" sub="Staging" ct="NNVA · 45s" type="nnva" />
            <span style={{ fontSize: 11, color: '#B8B4AC', flexShrink: 0 }}>→</span>
            <WipCoins n={12} />
            <span style={{ fontSize: 11, color: '#B8B4AC', flexShrink: 0 }}>→</span>
            <IsoStep name="Frame" sub="Sub-Asm" ct="VA · 98s" type="va" />
            <span style={{ fontSize: 11, color: '#B8B4AC', flexShrink: 0 }}>→</span>
            <WipCoins n={6} />
            <span style={{ fontSize: 11, color: '#B8B4AC', flexShrink: 0 }}>→</span>
            <div style={{ opacity: bnVis ? 1 : 0.7, transition: 'opacity 0.4s' }}>
              <IsoStep name="Foam &amp; Fabric" sub="" ct="NVA · 145s" type="va" isBn />
            </div>
            <span style={{ fontSize: 11, color: '#B8B4AC', flexShrink: 0 }}>→</span>
            <WipCoins n={8} color="#E8A49A" bg="#FEF2F0" />
            <span style={{ fontSize: 11, color: '#B8B4AC', flexShrink: 0 }}>→</span>
            <IsoStep name="Electrical" sub="Integr." ct="VA · 88s" type="va" />
            <span style={{ fontSize: 11, color: '#B8B4AC', flexShrink: 0 }}>→</span>
            <IsoStep name="Final" sub="QC" ct="NNVA · 72s" type="nnva" />
          </div>

          {/* Sawtooth timeline */}
          <div style={{ marginTop: 10 }}>
            <div style={{ display: 'flex', gap: 14, fontSize: 7, color: '#8E8A82', marginBottom: 4, fontFamily: 'monospace' }}>
              <span style={{ color: '#2A9E82' }}>▲ value-add</span>
              <span style={{ color: '#E8A49A' }}>▼ wait/queue</span>
              <span style={{ color: '#C0402A' }}>— — takt 120s</span>
            </div>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'flex-end', height: 40, gap: 2, borderBottom: '1px solid #D8D5CE' }}>
              <div style={{ position: 'absolute', left: 0, right: 0, bottom: 20, borderTop: '1.5px dashed #C0402A' }}>
                <span style={{ position: 'absolute', right: 0, fontSize: 7, color: '#C0402A', fontWeight: 700, fontFamily: 'monospace', bottom: 2 }}>TAKT</span>
              </div>
              {[
                { h: 9,  bg: '#DEB96A' }, { h: 20, bg: '#E8A49A', top: true }, { h: 18, bg: '#7DCAB5' },
                { h: 11, bg: '#E8A49A', top: true }, { h: 34, bg: '#C0402A' },
                { h: 16, bg: '#E8A49A', top: true }, { h: 16, bg: '#7DCAB5' },
                { h: 9,  bg: '#E8A49A', top: true }, { h: 13, bg: '#DEB96A' },
              ].map((b, i) => (
                <div key={i} style={{ width: 18, height: b.h, background: b.bg, opacity: b.top ? 0.45 : 0.82, borderRadius: '2px 2px 0 0', alignSelf: b.top ? 'flex-start' : 'flex-end', flexShrink: 0 }} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── INDUSTRY MARQUEE ─────────────────────────────────────────────────── */}
      <div style={{ padding: '22px 48px', background: '#FFFFFF', borderTop: '0.5px solid #D8D5CE', borderBottom: '0.5px solid #D8D5CE', overflow: 'hidden' }}>
        <div style={{ fontSize: 10, color: '#8E8A82', textAlign: 'center', letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 14 }}>
          Built for lean teams across manufacturing industries
        </div>
        <div style={{ overflow: 'hidden' }}>
          <div style={{ display: 'flex', gap: 56, alignItems: 'center', animation: 'mq 22s linear infinite', width: 'max-content' }}>
            {['Automotive', 'Aerospace', 'Food & Beverage', 'Medical Devices', 'Logistics', 'Electronics', 'Pharmaceuticals', 'Industrial', 'Automotive', 'Aerospace', 'Food & Beverage', 'Medical Devices', 'Logistics', 'Electronics', 'Pharmaceuticals', 'Industrial'].map((n, i) => (
              <span key={i} style={{ fontSize: 12, fontWeight: 700, color: '#C8C5BC', whiteSpace: 'nowrap', letterSpacing: 0.5, textTransform: 'uppercase' }}>{n}</span>
            ))}
          </div>
        </div>
      </div>

      {/* ── FEATURES ────────────────────────────────────────────────────────── */}
      <div className="feat-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 1, background: '#D8D5CE' }}>
        {[
          { icon: '📊', bg: '#EDF9F5', title: 'Value Stream Mapping', body: 'ISO 22468:2020 notation. Bottlenecks flagged automatically. Export A3 maps and full ISO improvement reports in one click.' },
          { icon: '🔗', bg: '#FAEEDA', title: 'Every CI tool connected', body: 'Time Study, Fishbone, 5 Why, Waste ID, Kaizen, PDCA, Yamazumi, Standard Work — all linked to your steps, all feeding one report.' },
          { icon: '🛡', bg: '#EEEDFE', title: '14-day free trial.', body: 'Start today — no credit card required. Get full access to every tool for 14 days with up to 3 projects. Then choose the plan that fits.' },
        ].map(f => (
          <div key={f.title} style={{ background: '#FFFFFF', padding: '28px 24px' }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: f.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, marginBottom: 12 }}>{f.icon}</div>
            <div style={{ fontSize: 15, fontWeight: 600, color: '#242220', marginBottom: 7 }}>{f.title}</div>
            <div style={{ fontSize: 13, color: '#6B6760', lineHeight: 1.7 }}>{f.body}</div>
          </div>
        ))}
      </div>

      {/* ── TOOLS ───────────────────────────────────────────────────────────── */}
      <section id="tools" className="sec-pad" style={{ padding: '64px 48px', background: '#F8F7F5' }}>
        <div style={{ maxWidth: 1060, margin: '0 auto' }}>
          <div style={{ fontSize: 11, color: '#8E8A82', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 8, fontFamily: 'monospace' }}>What's inside</div>
          <h2 style={{ fontSize: 'clamp(24px,3vw,34px)', fontWeight: 700, color: '#242220', marginBottom: 10, fontFamily: serif }}>Every tool a lean engineer needs</h2>
          <p style={{ fontSize: 15, color: '#6B6760', marginBottom: 36, maxWidth: 520, lineHeight: 1.75 }}>All your CI tools connected to your value stream — the work you do feeds the reports you need.</p>

          <div className="tools-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 12 }}>
            {[
              { icon: '⏱', name: 'Time Study',       desc: '10-lap stopwatch, outlier exclusion, baseline vs target',              badge: 'Trial',       bc: '#EDF9F5', btc: '#0F6E56' },
              { icon: '🐟', name: 'Fishbone',         desc: '6M, 8P, 4S frameworks — structured cause-and-effect mapping',          badge: 'Trial',       bc: '#EDF9F5', btc: '#0F6E56' },
              { icon: '❓', name: '5 Why',            desc: 'Root cause to countermeasure, linked to PDCA action',                  badge: 'Trial',       bc: '#EDF9F5', btc: '#0F6E56' },
              { icon: '⚠️', name: 'Waste ID',         desc: 'DOWNTIME 8-waste identification per step with notes',                  badge: 'Trial',       bc: '#EDF9F5', btc: '#0F6E56' },
              { icon: '⚡', name: 'Kaizen Events',   desc: 'Track events with owners, due dates, status and VSM burst markers',    badge: 'Trial',       bc: '#EDF9F5', btc: '#0F6E56' },
              { icon: '🔄', name: 'PDCA',             desc: 'Export as PDCA, A3, 8D, DMAIC or OODA — one dataset, five formats',   badge: 'ISO 9001',   bc: '#EEF4FB', btc: '#1A4F8A' },
              { icon: '📊', name: 'Yamazumi Chart',  desc: 'Operator balance — VA / NNVA / NVA stacked vs takt time',              badge: 'ISO 22468',  bc: '#EEF4FB', btc: '#1A4F8A' },
              { icon: '📋', name: 'Standard Work',   desc: 'Task-level breakdown with VA classification and ISO export',           badge: 'ISO 22468',  bc: '#EEF4FB', btc: '#1A4F8A' },
              { icon: '🗺', name: 'VSM Export',      desc: 'A3 landscape map — auto-paginates, nothing truncated',                 badge: 'ISO 22468',  bc: '#EEF4FB', btc: '#1A4F8A' },
              { icon: '🎯', name: 'Gap Analysis',    desc: 'Finds every gap between your VSM and world-class lean flow',           badge: 'AI',         bc: '#EEEDFE', btc: '#534AB7' },
              { icon: '🗺️', name: 'Kaizen Roadmap', desc: 'Current → future state PCE journey with phase tracking',               badge: 'Trial',       bc: '#EDF9F5', btc: '#0F6E56' },
              { icon: '📈', name: 'Improvement',     desc: 'Before/after measurement goals per step feeding the report',           badge: 'Trial',       bc: '#EDF9F5', btc: '#0F6E56' },
            ].map(t => (
              <div key={t.name} style={{ background: '#FFFFFF', border: '0.5px solid #D8D5CE', borderRadius: 12, padding: '16px 15px' }}>
                <span style={{ fontSize: 20, display: 'block', marginBottom: 8 }}>{t.icon}</span>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#242220', marginBottom: 4 }}>{t.name}</div>
                <div style={{ fontSize: 11, color: '#8E8A82', lineHeight: 1.6 }}>{t.desc}</div>
                <span style={{ display: 'inline-block', fontSize: 8, fontWeight: 700, padding: '2px 6px', borderRadius: 4, marginTop: 8, background: t.bc, color: t.btc, letterSpacing: 0.5 }}>{t.badge}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── QUOTE ───────────────────────────────────────────────────────────── */}
      <div style={{ padding: '60px 48px', textAlign: 'center', background: '#FFFFFF', borderTop: '0.5px solid #D8D5CE' }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <p style={{ fontSize: 'clamp(18px,2.5vw,24px)', fontWeight: 500, color: '#242220', lineHeight: 1.55, marginBottom: 14, fontFamily: serif }}>
            "This could serve as <em style={{ color: '#C49B2E', fontStyle: 'italic' }}>Mission Control</em> — to drive progress and allow for correction and modification along the way."
          </p>
          <p style={{ fontSize: 13, color: '#8E8A82' }}>Max Singh · Creator of VeSiMy</p>
        </div>
      </div>

      {/* ── PRICING ─────────────────────────────────────────────────────────── */}
      <section id="pricing" className="sec-pad" style={{ padding: '64px 48px', background: '#F8F7F5' }}>
        <div style={{ maxWidth: 1060, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <div style={{ fontSize: 11, color: '#8E8A82', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 8, fontFamily: 'monospace' }}>Pricing</div>
            <h2 style={{ fontSize: 'clamp(24px,3vw,34px)', fontWeight: 700, color: '#242220', marginBottom: 10, fontFamily: serif }}>Simple, honest pricing.</h2>
            <p style={{ fontSize: 15, color: '#6B6760', maxWidth: 480, margin: '0 auto' }}>Try everything free for 14 days — no credit card required. Upgrade when you're ready.</p>
          </div>

          <div className="plan-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 16 }}>
            {(Object.entries(PLANS) as any[]).map(([key, plan]) => {
              const isPro = key === 'pro'
              const isLife = key === 'lifetime'
              const isEnt = key === 'enterprise'
              return (
                <div key={key} style={{ background: '#FFFFFF', border: isPro || isLife ? '1.5px solid rgba(196,155,46,0.4)' : '0.5px solid #D8D5CE', borderRadius: 16, padding: '26px 22px', position: 'relative' }}>
                  {(isPro || isLife) && (
                    <div style={{ display: 'inline-flex', background: '#C49B2E', color: '#fff', fontSize: 9, fontWeight: 700, padding: '3px 14px', borderRadius: 999, letterSpacing: 1.5, marginBottom: 12 }}>
                      {isLife ? '👑 LAUNCH WEEK' : 'MOST POPULAR'}
                    </div>
                  )}
                  <div style={{ fontSize: 11, color: '#C49B2E', letterSpacing: 2, fontWeight: 700, marginBottom: 6, fontFamily: 'monospace', textTransform: 'uppercase' }}>{plan.name}</div>
                  <div style={{ fontSize: 36, fontWeight: 800, color: '#242220', marginBottom: 6, lineHeight: 1, fontFamily: serif }}>
                    {isEnt ? 'Custom' : plan.price === 0 ? 'Free' : `$${plan.price}`}
                    {!isEnt && plan.price !== null && Number(plan.price) > 0 && (
                      <span style={{ fontSize: 13, fontWeight: 400, color: '#8E8A82', marginLeft: 4 }}>{isLife ? ' once' : '/mo'}</span>
                    )}
                  </div>
                  <p style={{ fontSize: 13, color: '#6B6760', marginBottom: 18, lineHeight: 1.65, minHeight: 40 }}>{plan.description}</p>
                  <ul style={{ listStyle: 'none', marginBottom: 22, display: 'flex', flexDirection: 'column', gap: 9 }}>
                    {plan.features.map((f: string) => (
                      <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 9, fontSize: 13, color: '#4E4B45', lineHeight: 1.5 }}>
                        <CheckIcon size={13} color="#C49B2E" style={{ marginTop: 3, flexShrink: 0 }} /> {f}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={isEnt ? '/enterprise' : isLife ? '/beta' : plan.price === 0 ? '/auth/signup' : `/auth/signup?plan=${key}`}
                    style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '11px 20px', borderRadius: 10, fontWeight: 700, fontSize: 14, textDecoration: 'none', background: isPro || isLife ? '#C49B2E' : 'transparent', color: isPro || isLife ? '#fff' : '#4E4B45', border: isPro || isLife ? 'none' : '1px solid #D8D5CE' }}
                  >
                    {plan.cta}
                  </Link>
                  {isLife && (
                    <p style={{ textAlign: 'center', fontSize: 11, color: '#C49B2E', marginTop: 10 }}>
                      Launch Week open → <Link href="/beta" style={{ color: '#C49B2E' }}>Claim Gold Standard</Link>
                    </p>
                  )}
                </div>
              )
            })}
          </div>

          <div style={{ textAlign: 'center', marginTop: 20 }}>
            <Link href="/pricing" style={{ fontSize: 13, color: '#8E8A82', textDecoration: 'none', borderBottom: '1px solid #D8D5CE', paddingBottom: 2 }}>
              View full pricing details →
            </Link>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ───────────────────────────────────────────────────────── */}
      <div style={{ background: '#242220', padding: '72px 48px', textAlign: 'center' }}>
        <h2 style={{ fontSize: 'clamp(26px,3vw,38px)', fontWeight: 700, color: '#F8F7F5', marginBottom: 10, fontFamily: serif }}>
          Stop describing waste.<br />Start <span style={{ color: '#C49B2E' }}>eliminating</span> it.
        </h2>
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.38)', marginBottom: 28 }}>Start your 14-day free trial today. No credit card. Cancel anytime.</p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/auth/signup" style={{ padding: '14px 38px', background: '#C49B2E', color: '#fff', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 700, textDecoration: 'none' }}>
            Start free trial
          </Link>
          <Link href="/auth/signup" style={{ padding: '14px 24px', background: 'transparent', color: 'rgba(255,255,255,0.55)', border: '1px solid rgba(255,255,255,0.14)', borderRadius: 10, fontSize: 15, textDecoration: 'none' }}>
            Load reference project →
          </Link>
        </div>
        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.18)', marginTop: 16 }}>
          ISO 9001:2015 · ISO 22468:2020 · IATF 16949 aligned
        </p>
      </div>

      {/* ── FOOTER ──────────────────────────────────────────────────────────── */}
      <footer style={{ borderTop: '0.5px solid #D8D5CE', padding: '28px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16, background: '#FFFFFF' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <VLogoMark size={28} />
          <VeSiMyWordmark size={16} />
        </div>
        <div style={{ display: 'flex', gap: 22, fontSize: 12, color: '#8E8A82', flexWrap: 'wrap' }}>
          {[['About', '/about'], ['Blog', '/blog'], ['Changelog', '/changelog'], ['Pricing', '/pricing'], ['Privacy', '/privacy'], ['Terms', '/terms'], ['Contact', 'mailto:founder@vesimy.com']].map(([l, h]) => (
            <Link key={l} href={h} style={{ color: 'inherit', textDecoration: 'none' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#C49B2E')}
              onMouseLeave={e => (e.currentTarget.style.color = '#8E8A82')}>
              {l}
            </Link>
          ))}
        </div>
        <span style={{ fontSize: 11, color: '#B8B4AC', letterSpacing: 1.5, fontFamily: 'monospace', textTransform: 'uppercase' }}>© 2026 VeSiMy</span>
      </footer>
    </div>
  )
}
