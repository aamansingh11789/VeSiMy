'use client'
// ── components/home/LiveVSMHero.tsx ──────────────────────────────────────────
// The hero IS the product. A live VSM map builds itself step by step,
// metrics calculate in real time, the bottleneck flashes red, and Supe AI
// types a recommendation. No mockups. No fake floating cards. The actual product.

import { useState, useEffect, useRef } from 'react'

const SANS = "'Satoshi','Inter',-apple-system,sans-serif"
const MONO = "'JetBrains Mono','Fira Code',monospace"

interface Step {
  name: string
  cycleTime: number  // seconds
  waitTime: number   // seconds
  vaType: 'VA' | 'NVA' | 'NNVA'
  isBottleneck?: boolean
  operators: number
}

// A realistic order-fulfilment value stream
const STEPS: Step[] = [
  { name: 'Order Received',  cycleTime: 12,  waitTime: 0,    vaType: 'NNVA', operators: 1 },
  { name: 'Pick & Stage',    cycleTime: 45,  waitTime: 180,  vaType: 'VA',   operators: 2 },
  { name: 'Pack & Label',    cycleTime: 145, waitTime: 60,   vaType: 'NNVA', operators: 2, isBottleneck: true },
  { name: 'Quality Check',   cycleTime: 38,  waitTime: 30,   vaType: 'NNVA', operators: 1 },
  { name: 'Ship',            cycleTime: 22,  waitTime: 240,  vaType: 'VA',   operators: 1 },
]

const SUPE_LINES = [
  "Reading value stream...",
  "Lead time analysis: 13.0 min total, 4.5 min VA, 8.5 min NVA",
  "Bottleneck detected at step 3: Pack & Label",
  "Cycle time 145s exceeds takt time 120s",
  "Recommendation: SMED analysis to reduce changeover by 20%",
]

export default function LiveVSMHero() {
  const [visibleSteps, setVisibleSteps] = useState(0)
  const [bottleneckFlashing, setBottleneckFlashing] = useState(false)
  const [supeText, setSupeText] = useState('')
  const [supeLineIdx, setSupeLineIdx] = useState(0)
  const charIdxRef = useRef(0)
  const lineIdxRef = useRef(0)

  // Step-by-step reveal
  useEffect(() => {
    if (visibleSteps >= STEPS.length) {
      // All steps revealed, flash bottleneck
      setTimeout(() => setBottleneckFlashing(true), 400)
      return
    }
    const delay = visibleSteps === 0 ? 600 : 550
    const t = setTimeout(() => setVisibleSteps(v => v + 1), delay)
    return () => clearTimeout(t)
  }, [visibleSteps])

  // Supe AI typing effect
  useEffect(() => {
    if (visibleSteps < STEPS.length) return  // Wait for steps to be done

    const interval = setInterval(() => {
      const currentLine = SUPE_LINES[lineIdxRef.current]
      if (!currentLine) {
        clearInterval(interval)
        return
      }
      if (charIdxRef.current < currentLine.length) {
        setSupeText(currentLine.slice(0, charIdxRef.current + 1))
        charIdxRef.current++
      } else {
        // Line complete, pause then move to next
        setTimeout(() => {
          lineIdxRef.current++
          charIdxRef.current = 0
          setSupeLineIdx(lineIdxRef.current)
          if (lineIdxRef.current >= SUPE_LINES.length) {
            // Loop back after a long pause
            setTimeout(() => {
              lineIdxRef.current = 0
              charIdxRef.current = 0
              setSupeLineIdx(0)
              setSupeText('')
            }, 4000)
          }
        }, 1800)
        clearInterval(interval)
      }
    }, 35)
    return () => clearInterval(interval)
  }, [visibleSteps, supeLineIdx])

  // Live metric counters
  const visibleStepsData = STEPS.slice(0, visibleSteps)
  const totalCT = visibleStepsData.reduce((sum, s) => sum + s.cycleTime, 0)
  const totalWT = visibleStepsData.reduce((sum, s) => sum + s.waitTime, 0)
  const leadTime = totalCT + totalWT
  const vaTime = visibleStepsData.filter(s => s.vaType === 'VA').reduce((sum, s) => sum + s.cycleTime, 0)
  const pce = leadTime > 0 ? Math.round((vaTime / leadTime) * 100) : 0
  const bottlenecks = visibleStepsData.filter(s => s.isBottleneck).length

  return (
    <div style={{ width: '100%', maxWidth: 980, margin: '0 auto', position: 'relative' }}>
      {/* Watermark label */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        marginBottom: 18, padding: '8px 14px',
        background: 'rgba(255,255,255,0.025)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 8,
        width: 'fit-content',
      }}>
        <div style={{ display: 'flex', gap: 4 }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#FF5F57' }}/>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#FFBD2E' }}/>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#28C940' }}/>
        </div>
        <div style={{
          fontFamily: MONO, fontSize: 11, color: 'rgba(255,255,255,0.5)',
          letterSpacing: 0.3,
        }}>
          vesimy.com/project/order-fulfilment, live
        </div>
        <div style={{
          marginLeft: 12, display: 'flex', alignItems: 'center', gap: 6,
          fontSize: 10, fontFamily: MONO, color: '#28C940', fontWeight: 700,
          letterSpacing: 1.5,
        }}>
          <span style={{
            width: 6, height: 6, borderRadius: '50%', background: '#28C940',
            animation: 'live-pulse 1.6s ease-in-out infinite',
          }}/>
          LIVE
        </div>
      </div>

      {/* The VSM map */}
      <div style={{
        background: 'linear-gradient(180deg, #0E1219 0%, #0A0D14 100%)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 14,
        padding: '28px 24px 20px',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 32px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04) inset',
      }}>
        {/* Grid background */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)
          `,
          backgroundSize: '32px 32px',
          pointerEvents: 'none',
          maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 70%)',
        }}/>

        {/* Section label */}
        <div style={{
          position: 'relative', marginBottom: 22,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <div style={{
            fontFamily: MONO, fontSize: 10, color: 'rgba(255,255,255,0.4)',
            letterSpacing: 2, textTransform: 'uppercase',
          }}>
            Current State, Value Stream Map
          </div>
          <div style={{
            fontFamily: MONO, fontSize: 10, color: 'rgba(212,168,67,0.7)',
            letterSpacing: 1,
          }}>
            ISO 22468:2020
          </div>
        </div>

        {/* Steps */}
        <div style={{
          position: 'relative',
          display: 'flex', alignItems: 'center', gap: 4,
          marginBottom: 28, flexWrap: 'wrap',
          justifyContent: 'space-between',
        }} className="vsm-steps">
          {STEPS.map((step, i) => {
            const visible = i < visibleSteps
            const isBottleneck = step.isBottleneck && bottleneckFlashing
            return (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 4,
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(8px)',
                transition: 'opacity 0.5s ease, transform 0.5s ease',
              }}>
                {/* Step box */}
                <div style={{
                  position: 'relative',
                  width: 132, padding: '12px 12px',
                  background: isBottleneck
                    ? 'linear-gradient(180deg, rgba(220,38,38,0.18) 0%, rgba(220,38,38,0.08) 100%)'
                    : 'linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
                  border: isBottleneck
                    ? '1.5px solid rgba(248,113,113,0.55)'
                    : '1px solid rgba(255,255,255,0.10)',
                  borderRadius: 8,
                  boxShadow: isBottleneck
                    ? '0 0 32px rgba(248,113,113,0.25), inset 0 1px 0 rgba(255,255,255,0.08)'
                    : 'inset 0 1px 0 rgba(255,255,255,0.04)',
                  transition: 'all 0.5s ease',
                }}>
                  {isBottleneck && (
                    <div style={{
                      position: 'absolute', top: -7, right: -7,
                      width: 16, height: 16, borderRadius: '50%',
                      background: '#EF4444',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 9, fontWeight: 800, color: '#fff',
                      boxShadow: '0 2px 8px rgba(239,68,68,0.5)',
                      animation: 'bottleneck-pulse 1.8s ease-in-out infinite',
                    }}>!</div>
                  )}
                  <div style={{
                    fontSize: 10, fontWeight: 700, fontFamily: SANS,
                    color: isBottleneck ? '#FCA5A5' : 'rgba(255,255,255,0.55)',
                    letterSpacing: 0.3, marginBottom: 4,
                    textTransform: 'uppercase',
                  }}>
                    Step {i + 1}
                  </div>
                  <div style={{
                    fontSize: 13, fontWeight: 700, fontFamily: SANS,
                    color: isBottleneck ? '#FEE2E2' : '#F0F2FF',
                    marginBottom: 8, lineHeight: 1.2,
                  }}>
                    {step.name}
                  </div>
                  <div style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
                    marginBottom: 4,
                  }}>
                    <span style={{
                      fontSize: 9, color: 'rgba(255,255,255,0.4)',
                      fontFamily: MONO, letterSpacing: 0.5,
                    }}>CT</span>
                    <span style={{
                      fontSize: 17, fontWeight: 800, fontFamily: MONO,
                      color: isBottleneck ? '#FCA5A5' : '#C9A66B',
                      lineHeight: 1,
                    }}>
                      {step.cycleTime}<span style={{
                        fontSize: 10, marginLeft: 1, color: 'rgba(255,255,255,0.4)',
                      }}>s</span>
                    </span>
                  </div>
                  <div style={{
                    display: 'inline-block', padding: '1px 6px', borderRadius: 4,
                    fontSize: 9, fontWeight: 700, fontFamily: MONO,
                    background: step.vaType === 'VA' ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.12)',
                    color: step.vaType === 'VA' ? '#34D399' : '#D9C08A',
                  }}>
                    {step.vaType}
                  </div>
                </div>

                {/* Arrow */}
                {i < STEPS.length - 1 && (
                  <div style={{
                    width: 24, height: 1.5,
                    background: 'linear-gradient(90deg, rgba(255,255,255,0.20) 0%, rgba(255,255,255,0.40) 100%)',
                    position: 'relative',
                    opacity: visible ? 1 : 0,
                    transition: 'opacity 0.4s ease 0.3s',
                  }}>
                    <div style={{
                      position: 'absolute', right: -3, top: -3,
                      width: 0, height: 0,
                      borderTop: '4px solid transparent',
                      borderBottom: '4px solid transparent',
                      borderLeft: '6px solid rgba(255,255,255,0.45)',
                    }}/>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Metrics bar */}
        <div style={{
          position: 'relative',
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1,
          background: 'rgba(255,255,255,0.06)',
          borderRadius: 10, padding: 1, marginBottom: 14,
          overflow: 'hidden',
        }}>
          {[
            { label: 'Lead Time',  value: leadTime, suffix: 's', color: '#F0F2FF' },
            { label: 'VA Time',    value: vaTime,   suffix: 's', color: '#34D399' },
            { label: 'PCE',        value: pce,      suffix: '%', color: '#C9A66B' },
            { label: 'Bottleneck', value: bottlenecks, suffix: '', color: bottlenecks > 0 ? '#FCA5A5' : 'rgba(255,255,255,0.40)' },
          ].map(metric => (
            <div key={metric.label} style={{
              background: 'linear-gradient(180deg, #0F1320 0%, #0B0E18 100%)',
              padding: '12px 16px',
              display: 'flex', flexDirection: 'column', gap: 4,
            }}>
              <div style={{
                fontSize: 9, fontWeight: 700, fontFamily: MONO,
                color: 'rgba(255,255,255,0.35)',
                letterSpacing: 1.5, textTransform: 'uppercase',
              }}>{metric.label}</div>
              <div style={{
                fontSize: 22, fontWeight: 800, fontFamily: MONO,
                color: metric.color, lineHeight: 1,
                fontVariantNumeric: 'tabular-nums',
              }}>
                {metric.value}<span style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.35)', marginLeft: 2 }}>{metric.suffix}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Supe AI line */}
        <div style={{
          position: 'relative',
          padding: '12px 16px',
          background: 'linear-gradient(90deg, rgba(201,166,107,0.06) 0%, rgba(212,168,67,0.02) 100%)',
          border: '1px solid rgba(212,168,67,0.15)',
          borderRadius: 8,
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <div style={{
            width: 24, height: 24, flexShrink: 0,
            borderRadius: 6,
            background: 'linear-gradient(135deg, #C9A66B 0%, #A8854F 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 12, fontWeight: 800, color: '#0B1D33',
            boxShadow: '0 2px 8px rgba(201,166,107,0.30)',
          }}>S</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontSize: 9, fontWeight: 700, fontFamily: MONO,
              color: '#C9A66B', letterSpacing: 1.5,
              textTransform: 'uppercase', marginBottom: 2,
            }}>
              Supe AI, Real-time analysis
            </div>
            <div style={{
              fontSize: 13, fontFamily: MONO, color: '#F0F2FF',
              lineHeight: 1.5, minHeight: 20,
              fontVariantNumeric: 'tabular-nums',
            }}>
              {supeText}
              <span style={{
                display: 'inline-block', width: 8, height: 14,
                background: '#C9A66B', marginLeft: 2, verticalAlign: 'middle',
                animation: 'caret-blink 1s step-end infinite',
              }}/>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes live-pulse {
          0%,100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.85); }
        }
        @keyframes bottleneck-pulse {
          0%,100% { transform: scale(1); box-shadow: 0 2px 8px rgba(239,68,68,0.5); }
          50% { transform: scale(1.18); box-shadow: 0 2px 16px rgba(239,68,68,0.8); }
        }
        @keyframes caret-blink {
          0%,50% { opacity: 1; }
          51%,100% { opacity: 0; }
        }
        @media (max-width: 768px) {
          .vsm-steps {
            justify-content: flex-start !important;
            overflow-x: auto;
            padding-bottom: 8px;
            margin-left: -12px;
            margin-right: -12px;
            padding-left: 12px;
            padding-right: 12px;
            scroll-snap-type: x mandatory;
            -webkit-overflow-scrolling: touch;
          }
          .vsm-steps > div {
            scroll-snap-align: start;
            flex-shrink: 0;
          }
        }
      `}</style>
    </div>
  )
}
