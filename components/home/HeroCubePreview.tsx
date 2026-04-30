'use client'
// ── components/home/HeroCubePreview.tsx ─────────────────────────────────────
// Premium 3D product cube — CSS perspective, 3 visible faces
// Front: Current State process map (white/light)
// Right: Target State flow (dark glass)
// Bottom: KPI strip (dark command-center)
// No Three.js. No external assets. Pure CSS 3D + React.

import React from 'react'
import { useState, useEffect } from 'react'

// ── Tokens (scoped, not importing C from page.tsx) ────────────────────────
const T = {
  blue:   '#2563EB',
  blueL:  '#3B82F6',
  blueGlow:'rgba(37,99,235,0.35)',
  cyan:   '#22D3EE',
  gold:   '#F6C453',
  goldD:  '#D4AF37',
  green:  '#10B981',
  amber:  '#F59E0B',
  red:    '#EF4444',
  // Front face (light)
  fBg:    '#FFFFFF',
  fBord:  '#E2E8F0',
  fText:  '#0F172A',
  fSub:   '#475569',
  fMono:  '"JetBrains Mono","Fira Code",monospace',
  // Right / Bottom (dark)
  dBg:    '#07111F',
  dBord:  'rgba(37,99,235,0.2)',
  dText:  '#EEF2FF',
  dSub:   '#8B9CC8',
}

// ── Process steps for front face ──────────────────────────────────────────
const STEPS = [
  { name: 'Intake',    ct: '12s', va: 'VA',   bot: false },
  { name: 'Process',   ct: '45s', va: 'VA',   bot: false },
  { name: 'Inspect',   ct: '62s', va: 'NNVA', bot: true  },
  { name: 'Dispatch',  ct: '22s', va: 'VA',   bot: false },
]

// ── Target nodes for right face ───────────────────────────────────────────
const TARGETS = [
  { label: 'Reduce CT',     delta: '−27%', color: T.green  },
  { label: 'Eliminate Wait',delta: '−44%', color: T.blueL  },
  { label: 'PCE Target',    delta: '+18%', color: T.gold   },
  { label: 'WIP Limit',     delta: '−30%', color: T.cyan   },
]

// ── KPI data for bottom face ──────────────────────────────────────────────
const KPIS = [
  { label: 'Lead Time',  value: '18.2m', sub: '−2.4m vs target', color: T.blueL },
  { label: 'VA Time',    value: '4.8m',  sub: '68% of CT',       color: T.green },
  { label: 'PCE',        value: '26.4%', sub: 'Target: 38%',     color: T.amber },
  { label: 'WIP',        value: '31',    sub: 'Limit: 24',       color: T.red   },
]

// ── Box dimensions ────────────────────────────────────────────────────────
// Width × Height × Depth = 360 × 240 × 148
const W = 360, H = 240, D = 148
const W2 = W / 2, H2 = H / 2, D2 = D / 2

export function HeroCubePreview() {
  const [hovered, setHovered] = useState(false)
  const [reduced, setReduced]  = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mq.matches)
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  // CSS 3D cube transform
  const baseTransform  = 'rotateX(18deg) rotateY(-24deg) rotateZ(1deg)'
  const hoverTransform = 'rotateX(12deg) rotateY(-16deg) rotateZ(0deg) translateY(-10px)'
  const cubeTransform  = hovered ? hoverTransform : baseTransform

  // Outer scene style
  const sceneStyle: React.CSSProperties = {
    perspective: '1400px',
    perspectiveOrigin: '50% 45%',
    width: W + D,
    height: H + D + 40,
    position: 'relative',
    flexShrink: 0,
  }

  const cubeStyle: React.CSSProperties = {
    width: W,
    height: H,
    position: 'absolute',
    top: 20,
    left: D2,
    transformStyle: 'preserve-3d',
    transform: cubeTransform,
    transition: reduced ? 'none' : 'transform 0.55s cubic-bezier(0.23,1,0.32,1)',
    animation: reduced ? 'none' : 'cubeFloat 7s ease-in-out infinite',
  }

  // Shared face base
  const faceBase: React.CSSProperties = {
    position: 'absolute',
    overflow: 'hidden',
    backfaceVisibility: 'hidden',
    WebkitBackfaceVisibility: 'hidden',
  }

  // ── Face styles ──────────────────────────────────────────────────────────
  const frontStyle: React.CSSProperties = {
    ...faceBase,
    width: W, height: H,
    background: T.fBg,
    border: `1px solid ${T.fBord}`,
    borderRadius: 10,
    transform: `translateZ(${D2}px)`,
    boxShadow: `0 0 0 1px ${T.fBord}, 0 0 40px ${T.blueGlow}`,
  }

  const rightStyle: React.CSSProperties = {
    ...faceBase,
    width: D, height: H,
    background: `linear-gradient(160deg, #0B1829 0%, ${T.dBg} 100%)`,
    border: `1px solid ${T.dBord}`,
    borderLeft: 'none',
    borderRadius: '0 8px 8px 0',
    transform: `rotateY(90deg) translateZ(${W2}px)`,
    boxShadow: `inset 0 1px 0 rgba(255,255,255,0.05)`,
  }

  const bottomStyle: React.CSSProperties = {
    ...faceBase,
    width: W, height: D,
    background: `linear-gradient(180deg, #0A1628, ${T.dBg})`,
    border: `1px solid rgba(37,99,235,0.15)`,
    borderTop: 'none',
    borderRadius: '0 0 10px 10px',
    transform: `rotateX(-90deg) translateZ(${H2}px)`,
    boxShadow: `inset 0 -1px 0 rgba(0,0,0,0.5)`,
  }

  return (
    <>
      <style>{`
        @keyframes cubeFloat {
          0%,100% { transform: ${baseTransform} translateY(0px); }
          33%      { transform: ${baseTransform} translateY(-8px); }
          66%      { transform: ${baseTransform} translateY(-3px); }
        }
        @media (prefers-reduced-motion: reduce) {
          [data-cube] { animation: none !important; }
        }
        @media (max-width: 768px) {
          [data-cube-scene] {
            transform: scale(0.62);
            transform-origin: top center;
          }
        }
      `}</style>

      {/* Edge glow ring (decorative) */}
      <div style={{
        position: 'absolute',
        inset: -24,
        borderRadius: 24,
        background: 'transparent',
        border: `1px solid rgba(37,99,235,0.12)`,
        pointerEvents: 'none',
      }}/>

      <div style={sceneStyle} data-cube-scene
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* ── The cube ──────────────────────────────────────────────── */}
        <div style={cubeStyle} data-cube>

          {/* ── FRONT FACE — Current State process map (white) ── */}
          <div style={frontStyle}>
            {/* Top bar */}
            <div style={{
              height: 36, background: '#F1F5F9', borderBottom: `1px solid ${T.fBord}`,
              display: 'flex', alignItems: 'center', padding: '0 12px', gap: 8,
            }}>
              {/* Traffic lights */}
              {['#FF6B6B','#FFD93D','#6BCB77'].map(c =>
                <div key={c} style={{ width: 8, height: 8, borderRadius: '50%', background: c, opacity: 0.8 }}/>
              )}
              <div style={{ flex: 1 }}/>
              <div style={{
                fontSize: 8, fontFamily: T.fMono, color: '#64748B',
                background: '#E2E8F0', borderRadius: 4, padding: '2px 8px', letterSpacing: 0.5,
              }}>CURRENT STATE · Assembly Line A</div>
              <div style={{
                fontSize: 7, fontFamily: T.fMono, color: T.green,
                background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)',
                borderRadius: 3, padding: '2px 6px',
              }}>● LIVE</div>
            </div>

            {/* Metrics strip */}
            <div style={{
              padding: '6px 12px', background: '#F8FAFC', borderBottom: `1px solid ${T.fBord}`,
              display: 'flex', gap: 16,
            }}>
              {[['Lead Time','18.2m', T.amber],['PCE','26%',T.red],['Takt','32s',T.blueL],['WIP','31',T.blue]].map(([l,v,c]) => (
                <div key={l}>
                  <div style={{ fontSize: 6, fontFamily: T.fMono, color: '#94A3B8', letterSpacing: 0.8 }}>{l}</div>
                  <div style={{ fontSize: 11, fontWeight: 700, fontFamily: T.fMono, color: c as string }}>{v}</div>
                </div>
              ))}
            </div>

            {/* Process flow */}
            <div style={{
              padding: '10px 10px 6px', display: 'flex', alignItems: 'center',
              gap: 0, overflow: 'hidden',
            }}>
              {/* Supplier */}
              <div style={{
                width: 28, height: 28, borderRadius: '50%', background: '#E2E8F0',
                border: '1.5px solid #CBD5E1', display: 'flex', alignItems: 'center',
                justifyContent: 'center', flexShrink: 0,
              }}>
                <span style={{ fontSize: 5.5, fontFamily: T.fMono, color: '#475569', fontWeight: 700, textAlign: 'center', lineHeight: 1.2 }}>SUP</span>
              </div>

              {STEPS.map((st, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                  {/* Arrow */}
                  <div style={{ flex: 1, height: 1, background: st.bot ? 'rgba(239,68,68,0.4)' : '#CBD5E1', position: 'relative' }}>
                    <div style={{ position: 'absolute', right: -1, top: '50%', transform: 'translateY(-50%)', width: 0, height: 0, borderTop: '3px solid transparent', borderBottom: '3px solid transparent', borderLeft: `4px solid ${st.bot ? 'rgba(239,68,68,0.4)' : '#CBD5E1'}` }}/>
                  </div>
                  {/* Step card */}
                  <div style={{
                    position: 'relative', flexShrink: 0,
                    width: 62, background: st.bot ? '#FFF1F2' : '#FFFFFF',
                    border: `1.5px solid ${st.bot ? '#FCA5A5' : '#E2E8F0'}`,
                    borderTop: `2.5px solid ${st.bot ? T.red : T.blue}`,
                    borderRadius: 5, padding: '5px 6px',
                    boxShadow: st.bot ? '0 0 0 2px rgba(239,68,68,0.1),0 2px 6px rgba(0,0,0,0.06)' : '0 1px 3px rgba(0,0,0,0.06)',
                  }}>
                    {st.bot && (
                      <div style={{
                        position: 'absolute', top: -5, right: -5, width: 12, height: 12,
                        borderRadius: '50%', background: T.red, display: 'flex', alignItems: 'center',
                        justifyContent: 'center', boxShadow: `0 0 6px ${T.red}80`,
                      }}>
                        <span style={{ color: '#fff', fontSize: 7, fontWeight: 800, lineHeight: 1 }}>!</span>
                      </div>
                    )}
                    <div style={{ fontSize: 7.5, fontWeight: 700, color: st.bot ? '#BE123C' : T.fText, marginBottom: 3, whiteSpace: 'nowrap' as const }}>{st.name}</div>
                    <div style={{ fontFamily: T.fMono, fontSize: 10, fontWeight: 700, color: st.bot ? T.red : T.blue }}>{st.ct}</div>
                    <div style={{ marginTop: 2, display: 'inline-block', fontSize: 6, fontWeight: 700, fontFamily: T.fMono, color: st.va === 'VA' ? T.green : T.amber, background: st.va === 'VA' ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)', padding: '1px 3px', borderRadius: 2 }}>{st.va}</div>
                  </div>
                </div>
              ))}

              {/* Arrow to customer */}
              <div style={{ flex: '0 0 16px', height: 1, background: '#CBD5E1', position: 'relative' }}>
                <div style={{ position: 'absolute', right: -1, top: '50%', transform: 'translateY(-50%)', width: 0, height: 0, borderTop: '3px solid transparent', borderBottom: '3px solid transparent', borderLeft: '4px solid #CBD5E1' }}/>
              </div>
              {/* Customer */}
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#E2E8F0', border: '1.5px solid #CBD5E1', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ fontSize: 5.5, fontFamily: T.fMono, color: '#475569', fontWeight: 700, textAlign: 'center', lineHeight: 1.2 }}>CUS</span>
              </div>
            </div>

            {/* Supe AI insight */}
            <div style={{
              margin: '0 10px 8px', padding: '8px 10px',
              background: 'linear-gradient(135deg,rgba(37,99,235,0.06),rgba(34,211,238,0.03))',
              border: '1px solid rgba(37,99,235,0.15)', borderRadius: 7,
            }}>
              <div style={{ fontSize: 6.5, fontFamily: T.fMono, color: T.blue, letterSpacing: 1, marginBottom: 4 }}>SUPE AI · ROOT CAUSE</div>
              <div style={{ fontSize: 9, color: '#334155', lineHeight: 1.55 }}>
                <span style={{ fontWeight: 700, color: '#1E293B' }}>Inspect</span> is your bottleneck — CT 62s vs Takt 32s. Fishbone suggests tooling changeover &amp; missing standard work. SMED analysis recommended.
              </div>
            </div>

            {/* Gold accent line at bottom */}
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,transparent,${T.goldD},transparent)` }}/>
          </div>

          {/* ── RIGHT FACE — Target State (dark glass) ── */}
          <div style={rightStyle}>
            <div style={{ padding: '12px 10px', height: '100%', display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontSize: 7, fontFamily: T.fMono, color: T.gold, letterSpacing: 1.5, marginBottom: 10, textTransform: 'uppercase' as const }}>Target State</div>

              {TARGETS.map((t, i) => (
                <div key={i} style={{
                  marginBottom: 8, padding: '7px 8px',
                  background: 'rgba(255,255,255,0.04)', border: `1px solid ${t.color}25`,
                  borderLeft: `2.5px solid ${t.color}`, borderRadius: 5,
                }}>
                  <div style={{ fontSize: 8, color: T.dSub, fontFamily: T.fMono, marginBottom: 2 }}>{t.label}</div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: t.color, fontFamily: T.fMono, letterSpacing: -0.3 }}>{t.delta}</div>
                </div>
              ))}

              {/* Progress bar */}
              <div style={{ marginTop: 'auto' }}>
                <div style={{ fontSize: 7, fontFamily: T.fMono, color: T.dSub, marginBottom: 5 }}>Q3 PROGRESS</div>
                <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{ width: '63%', height: '100%', background: `linear-gradient(90deg,${T.blue},${T.cyan})`, borderRadius: 2 }}/>
                </div>
                <div style={{ fontSize: 7, color: T.dSub, marginTop: 3, fontFamily: T.fMono }}>63% of quarterly goal</div>
              </div>
            </div>

            {/* Blue edge glow */}
            <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 1, background: `linear-gradient(180deg,transparent,${T.blue},transparent)` }}/>
          </div>

          {/* ── BOTTOM FACE — KPI command center (dark) ── */}
          <div style={bottomStyle}>
            <div style={{ padding: '10px 14px', display: 'flex', gap: 0, height: '100%', alignItems: 'center' }}>
              {KPIS.map((k, i) => (
                <div key={k.label} style={{
                  flex: 1, textAlign: 'center',
                  borderLeft: i > 0 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                  padding: '0 6px',
                }}>
                  <div style={{ fontSize: 6, fontFamily: T.fMono, color: 'rgba(255,255,255,0.3)', letterSpacing: 0.8, marginBottom: 4, textTransform: 'uppercase' as const }}>{k.label}</div>
                  <div style={{ fontSize: 15, fontWeight: 800, fontFamily: T.fMono, color: k.color, letterSpacing: -0.5 }}>{k.value}</div>
                  <div style={{ fontSize: 6.5, color: 'rgba(255,255,255,0.25)', fontFamily: T.fMono, marginTop: 2 }}>{k.sub}</div>
                </div>
              ))}
            </div>
            {/* Gold accent line */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg,transparent,${T.gold}60,transparent)` }}/>
          </div>

        </div>{/* end cube */}

        {/* ── Shadow below the cube ──────────────────────────────────── */}
        <div style={{
          position: 'absolute',
          bottom: 0, left: '50%',
          transform: 'translateX(-50%)',
          width: W * 0.85,
          height: 24,
          background: 'radial-gradient(ellipse,rgba(37,99,235,0.3) 0%,transparent 70%)',
          filter: 'blur(8px)',
          borderRadius: '50%',
          transition: reduced ? 'none' : 'opacity 0.3s',
          opacity: hovered ? 0.7 : 0.5,
        }}/>

        {/* ── Blue corner glow ──────────────────────────────────────────── */}
        <div style={{
          position: 'absolute', top: 0, right: 0,
          width: 120, height: 120,
          background: `radial-gradient(circle,${T.blueGlow},transparent 70%)`,
          pointerEvents: 'none',
        }}/>

        {/* ── Gold accent dot ───────────────────────────────────────────── */}
        <div style={{
          position: 'absolute', top: 16, right: D2 + 12,
          width: 8, height: 8, borderRadius: '50%',
          background: T.gold,
          boxShadow: `0 0 12px ${T.gold}80`,
          animation: reduced ? 'none' : 'cubeFloat 3.5s ease-in-out infinite',
        }}/>

      </div>{/* end scene */}
    </>
  )
}

export default HeroCubePreview
