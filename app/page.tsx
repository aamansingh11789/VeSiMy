// @ts-nocheck
// ── app/page.tsx — VeSiMy Landing Page ───────────────────────────────────────
'use client'

import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { VesimyLogo, VLogoMark } from '@/components/ui/Logo'
import { ThemeToggle } from '@/components/ui/ThemeProvider'
import { PLANS } from '@/lib/stripe'
import { CheckIcon, ArrowRightIcon } from '@/components/ui/Icons'

const serif = 'Palatino Linotype,Book Antiqua,Palatino,Georgia,serif'

function WatermarkBg() {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        background: 'linear-gradient(160deg, #04040F 0%, #080620 50%, #04040F 100%)',
      }}
    >
      <style>{`
        @keyframes vesimyGlowDriftA {
          0%   { transform: translate(-50%, 0px) scale(1); opacity: 0.75; }
          50%  { transform: translate(-50%, 18px) scale(1.04); opacity: 1; }
          100% { transform: translate(-50%, 0px) scale(1); opacity: 0.75; }
        }

        @keyframes vesimyGlowDriftB {
          0%   { transform: translate(0, 0) scale(1); opacity: 0.65; }
          50%  { transform: translate(-16px, -10px) scale(1.06); opacity: 0.95; }
          100% { transform: translate(0, 0) scale(1); opacity: 0.65; }
        }

        @keyframes vesimyPatternDrift {
          0%   { transform: translate3d(0, 0, 0); }
          50%  { transform: translate3d(-18px, -10px, 0); }
          100% { transform: translate3d(0, 0, 0); }
        }

        @keyframes vesimyHeroFloat {
          0%   { transform: translateY(0px); }
          50%  { transform: translateY(-6px); }
          100% { transform: translateY(0px); }
        }

        @keyframes vesimyShimmerSweep {
          0%   { transform: translateX(-170%) skewX(-18deg); opacity: 0; }
          8%   { opacity: 0.28; }
          18%  { transform: translateX(170%) skewX(-18deg); opacity: 0; }
          100% { transform: translateX(170%) skewX(-18deg); opacity: 0; }
        }

        @keyframes vesimyRevealUp {
          0%   { opacity: 0; transform: translateY(16px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        .vesimy-reveal-1 { opacity: 0; animation: vesimyRevealUp .75s ease forwards; animation-delay: .05s; }
        .vesimy-reveal-2 { opacity: 0; animation: vesimyRevealUp .75s ease forwards; animation-delay: .16s; }
        .vesimy-reveal-3 { opacity: 0; animation: vesimyRevealUp .75s ease forwards; animation-delay: .28s; }
        .vesimy-reveal-4 { opacity: 0; animation: vesimyRevealUp .75s ease forwards; animation-delay: .40s; }
        .vesimy-reveal-5 { opacity: 0; animation: vesimyRevealUp .75s ease forwards; animation-delay: .52s; }
      `}</style>

      <div
        style={{
          position: 'absolute',
          top: '8%',
          left: '50%',
          width: 920,
          height: 650,
          background: 'radial-gradient(ellipse, rgba(212,162,8,0.11) 0%, transparent 70%)',
          animation: 'vesimyGlowDriftA 16s ease-in-out infinite',
        }}
      />

      <div
        style={{
          position: 'absolute',
          bottom: '-10%',
          right: '-8%',
          width: 540,
          height: 540,
          background: 'radial-gradient(circle, rgba(100,38,160,0.10) 0%, transparent 70%)',
          animation: 'vesimyGlowDriftB 20s ease-in-out infinite',
        }}
      />

      <div
        style={{
          position: 'absolute',
          inset: '-5%',
          opacity: 0.15,
          animation: 'vesimyPatternDrift 32s ease-in-out infinite',
        }}
      >
        <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
          <defs>
            <pattern
              id="vesimy-watermark"
              x="0"
              y="0"
              width="260"
              height="120"
              patternUnits="userSpaceOnUse"
            >
              <text
                x="24"
                y="38"
                fontFamily="Palatino Linotype,serif"
                fontSize="16"
                fontWeight="700"
                fill="#D4A208"
                fillOpacity="0.22"
                letterSpacing="4"
              >
                VESIMY
              </text>

              <text
                x="122"
                y="88"
                textAnchor="middle"
                fontFamily="Palatino Linotype,serif"
                fontSize="34"
                fontWeight="700"
                fill="#D4A208"
                fillOpacity="0.14"
              >
                V
              </text>
            </pattern>
          </defs>

          <rect width="100%" height="100%" fill="url(#vesimy-watermark)" />
        </svg>
      </div>

      <div
        style={{
          position: 'absolute',
          top: '4%',
          left: '50%',
          transform: 'translateX(-50%)',
          opacity: 0.06,
          animation: 'vesimyHeroFloat 14s ease-in-out infinite',
        }}
      >
        <VLogoMark size={620} />
      </div>
    </div>
  )
}

function HeroLogo() {
  return (
    <div
      className="vesimy-reveal-1"
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        animation: 'vesimyRevealUp .75s ease forwards, vesimyHeroFloat 9s ease-in-out 1.1s infinite',
        opacity: 0,
      }}
    >
      <div
        style={{
          position: 'absolute',
          width: 180,
          height: 180,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(212,162,8,0.12) 0%, transparent 70%)',
          filter: 'blur(16px)',
        }}
      />
      <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 20 }}>
        <VLogoMark size={122} />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            overflow: 'hidden',
            pointerEvents: 'none',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: -10,
              bottom: -10,
              width: 44,
              background:
                'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,244,214,0.28) 48%, rgba(255,255,255,0) 100%)',
              filter: 'blur(2px)',
              animation: 'vesimyShimmerSweep 8.5s ease-in-out infinite',
            }}
          />
        </div>
      </div>
    </div>
  )
}

function Stat({ value, label }: { value: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [display, setDisplay] = useState('0')
  const [fired, setFired] = useState(false)

  useEffect(() => {
    const raw = value.replace(/[^0-9.]/g, '')
    const num = parseFloat(raw)
    if (isNaN(num) || fired) return

    const observer = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return
        setFired(true)
        const suffix = value.replace(/[0-9.]/g, '')
        let start = 0
        const steps = 40
        const inc = num / steps

        const tick = () => {
          start += inc
          if (start >= num) {
            setDisplay(value)
            return
          }
          setDisplay(Math.round(start) + suffix)
          requestAnimationFrame(tick)
        }

        tick()
      },
      { threshold: 0.3 }
    )

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [value, fired])

  return (
    <div ref={ref} style={{ textAlign: 'center' }}>
      <div
        style={{
          fontFamily: serif,
          fontSize: 'clamp(28px,4vw,48px)',
          fontWeight: 800,
          color: '#D4A208',
          lineHeight: 1,
        }}
      >
        {display || value}
      </div>
      <div
        style={{
          fontSize: 10,
          color: '#7070A0',
          letterSpacing: 2.5,
          marginTop: 8,
          fontFamily: 'monospace',
        }}
      >
        {label}
      </div>
    </div>
  )
}

function SectionIntro({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string
  title: React.ReactNode
  subtitle: string
}) {
  return (
    <div style={{ textAlign: 'center', marginBottom: 56 }}>
      <p
        style={{
          fontSize: 11,
          color: '#D4A208',
          letterSpacing: 3,
          fontFamily: 'monospace',
          marginBottom: 12,
          textTransform: 'uppercase',
        }}
      >
        {eyebrow}
      </p>
      <h2
        style={{
          fontFamily: serif,
          fontSize: 'clamp(28px,4vw,52px)',
          fontWeight: 700,
          marginBottom: 14,
          color: '#F3F1FB',
          lineHeight: 1.12,
        }}
      >
        {title}
      </h2>
      <p
        style={{
          fontSize: 16,
          color: '#8B88B3',
          maxWidth: 560,
          margin: '0 auto',
          lineHeight: 1.75,
        }}
      >
        {subtitle}
      </p>
    </div>
  )
}

export default function HomePage() {
  return (
    <div style={{ position: 'relative', color: '#EAE8F4', minHeight: '100vh' }}>
      <WatermarkBg />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <nav
          className="home-nav"
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 50,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 40px',
            height: 64,
            borderBottom: '1px solid rgba(26,26,64,0.45)',
            background: 'rgba(3,3,13,0.82)',
            backdropFilter: 'blur(16px)',
          }}
        >
          <VesimyLogo size={32} showText />

          <div
            className="home-nav-links"
            style={{ display: 'flex', gap: 28, fontSize: 13, color: '#8B88B3' }}
          >
            {[
              ['Why VeSiMy', '#why'],
              ['Tools', '#tools'],
              ['Compare', '#compare'],
              ['Pricing', '#pricing'],
            ].map(([l, h]) => (
              <a
                key={l}
                href={h}
                style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.18s' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#F3F1FB')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#8B88B3')}
              >
                {l}
              </a>
            ))}
          </div>

          <div
            className="home-nav-cta"
            style={{ display: 'flex', gap: 10, alignItems: 'center' }}
          >
            <ThemeToggle />
            <Link
              href="/demo"
              className="demo-link btn-ghost"
              style={{ padding: '8px 16px', textDecoration: 'none', fontSize: 13 }}
            >
              Live Demo
            </Link>
            <Link
              href="/auth/login"
              className="btn-ghost"
              style={{ padding: '8px 16px', textDecoration: 'none', fontSize: 13 }}
            >
              Sign In
            </Link>
            <Link
              href="/auth/signup"
              className="btn-primary"
              style={{ padding: '8px 18px', textDecoration: 'none', fontSize: 13 }}
            >
              Get Started
            </Link>
          </div>
        </nav>

        <section
          style={{
            minHeight: '92vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '88px 24px 64px',
            textAlign: 'center',
          }}
        >
          <div style={{ marginBottom: 26 }}>
            <HeroLogo />
          </div>

          <div className="vesimy-reveal-2" style={{ marginBottom: 10 }}>
            <span
              style={{
                fontFamily: serif,
                fontWeight: 800,
                fontSize: 'clamp(40px,6vw,76px)',
                lineHeight: 1,
                background: 'linear-gradient(135deg, #F7DF8A 0%, #D4A208 55%, #B87A06 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                letterSpacing: 4,
              }}
            >
              VeSiMy
            </span>
          </div>

          <div
            className="vesimy-reveal-3"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: 'rgba(3,3,13,0.82)',
              border: '1px solid rgba(212,162,8,0.28)',
              borderRadius: 999,
              padding: '7px 18px',
              marginBottom: 34,
              backdropFilter: 'blur(8px)',
              boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
            }}
          >
            <span
              style={{
                fontSize: 10,
                color: '#7070A0',
                letterSpacing: 2,
                fontFamily: 'monospace',
              }}
            >
              ©
            </span>
            <span
              style={{
                fontSize: 12,
                color: '#D4A208',
                fontWeight: 700,
                letterSpacing: 3,
                fontFamily: 'monospace',
                textTransform: 'uppercase',
              }}
            >
              AI Operations Intelligence Platform
            </span>
          </div>

          <h1
            className="vesimy-reveal-4"
            style={{
              fontFamily: serif,
              fontSize: 'clamp(42px,6.5vw,82px)',
              fontWeight: 700,
              lineHeight: 1.08,
              marginBottom: 24,
              maxWidth: 860,
              color: '#F3F1FB',
            }}
          >
            Manufacturing that watches itself.
            <br />
            <span style={{ color: '#D4A208' }}>Fixes itself. Gets better.</span>
          </h1>

          <p
            className="vesimy-reveal-4"
            style={{
              fontSize: 'clamp(16px,2vw,20px)',
              color: '#B8B5D1',
              maxWidth: 620,
              lineHeight: 1.78,
              marginBottom: 42,
            }}
          >
            VeSiMy is the AI platform that monitors your processes continuously,
            detects inefficiencies before they cost you money, and tells your team
            exactly what to fix — automatically.
          </p>

          <div
            className="hero-cta-row vesimy-reveal-5"
            style={{
              display: 'flex',
              gap: 14,
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            <Link
              href="/auth/signup"
              className="btn-primary"
              style={{
                padding: '14px 34px',
                fontSize: 16,
                fontWeight: 700,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                boxShadow: '0 10px 30px rgba(212,162,8,0.22)',
              }}
            >
              Start Free <ArrowRightIcon size={16} color="currentColor" />
            </Link>

            <Link
              href="/demo"
              className="btn-ghost"
              style={{
                padding: '14px 26px',
                fontSize: 15,
                fontWeight: 600,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              ▶ See Live Demo
            </Link>

            <Link
              href="/beta"
              className="btn-secondary"
              style={{
                padding: '14px 26px',
                fontSize: 15,
                fontWeight: 600,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              👑 Join Launch Week
            </Link>
          </div>

          <p className="vesimy-reveal-5" style={{ fontSize: 12, color: '#7070A0', marginTop: 16 }}>
            Free forever · No credit card · Works on any device
          </p>
        </section>

        <section
          style={{
            padding: '18px clamp(16px,5vw,40px)',
            borderTop: '1px solid rgba(26,26,64,0.35)',
            borderBottom: '1px solid rgba(26,26,64,0.35)',
            background: 'rgba(4,4,14,0.58)',
            backdropFilter: 'blur(8px)',
          }}
        >
          <div
            style={{
              maxWidth: 960,
              margin: '0 auto',
              display: 'flex',
              flexWrap: 'wrap',
              gap: 12,
              justifyContent: 'center',
            }}
          >
            {[
              'Automotive',
              'Electronics',
              'Aerospace',
              'Food & Beverage',
              'Healthcare',
              'Logistics',
              'Oil & Gas',
              'Industrial Mfg',
            ].map((ind) => (
              <span
                key={ind}
                style={{
                  fontSize: 12,
                  color: '#8B88B3',
                  border: '1px solid rgba(70,70,120,0.42)',
                  borderRadius: 999,
                  padding: '6px 14px',
                  letterSpacing: 0.4,
                  background: 'rgba(255,255,255,0.015)',
                }}
              >
                {ind}
              </span>
            ))}
          </div>
        </section>

        <section id="tools" style={{ padding: 'clamp(44px,8vw,98px) clamp(16px,5vw,40px)' }}>
          <div style={{ maxWidth: 1060, margin: '0 auto' }}>
            <SectionIntro
              eyebrow="Tools"
              title={
                <>
                  Eight tools.
                  <span style={{ color: '#D4A208' }}> One AI brain.</span>
                </>
              }
              subtitle="Every CI tool your team needs — connected to an AI that monitors, analyzes, and suggests improvements automatically."
            />

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))',
                gap: 20,
              }}
            >
              {[
                {
                  icon: '~→',
                  title: 'Value Stream Map',
                  desc: 'Visualize your entire process flow and identify waste at every step.',
                  color: '#D4A208',
                },
                {
                  icon: '⊞',
                  title: 'Kanban Board',
                  desc: 'Manage work in progress with visual WIP limits and drag-drop cards.',
                  color: '#6CB9FC',
                },
                {
                  icon: '◎',
                  title: 'Kaizen Events',
                  desc: 'Track improvement initiatives from idea to completion with full history.',
                  color: '#1DD1A1',
                },
                {
                  icon: '⏱',
                  title: 'Time Study',
                  desc: 'Measure cycle times with precision and calculate takt time automatically.',
                  color: '#F4A623',
                },
                {
                  icon: '◆',
                  title: '5 Why Analysis',
                  desc: 'Drill down to root causes with structured problem-solving methodology.',
                  color: '#FF6B6B',
                },
                {
                  icon: '⊳⊲',
                  title: 'Fishbone Diagram',
                  desc: 'Map cause-and-effect relationships visually with Ishikawa analysis.',
                  color: '#8C44CC',
                },
                {
                  icon: '⟳',
                  title: 'SMED Calculator',
                  desc: 'Analyze changeover steps, classify internal vs external, and calculate potential time savings instantly.',
                  color: '#1DD1A1',
                  badge: 'NEW',
                },
                {
                  icon: '📋',
                  title: 'Gemba Walk Checklist',
                  desc: 'Mobile-first floor inspection tool. Capture photos, flag issues, and auto-create kaizen events on the spot.',
                  color: '#6CB9FC',
                  badge: 'NEW',
                },
              ].map((tool) => (
                <div
                  key={tool.title}
                  className="card"
                  style={{
                    padding: '30px 26px',
                    borderRadius: 18,
                    minHeight: 220,
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  {tool.badge && (
                    <div style={{
                      position: 'absolute', top: 16, right: 16,
                      background: 'linear-gradient(135deg,#C49510,#D4A208)',
                      color: '#03030D', fontSize: 9, fontWeight: 800,
                      padding: '3px 10px', borderRadius: 999, letterSpacing: 1.5,
                    }}>
                      {tool.badge}
                    </div>
                  )}
                  <div
                    style={{
                      width: 50, height: 50, borderRadius: 14,
                      background: `${tool.color}1a`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      marginBottom: 18, fontSize: 20, color: tool.color,
                      border: `1px solid ${tool.color}26`,
                    }}
                  >
                    {tool.icon}
                  </div>
                  <div style={{ fontWeight: 700, fontSize: 17, color: '#F3F1FB', marginBottom: 10 }}>
                    {tool.title}
                  </div>
                  <div style={{ fontSize: 13, color: '#8B88B3', lineHeight: 1.7 }}>
                    {tool.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          id="why"
          style={{
            padding: 'clamp(44px,8vw,98px) clamp(16px,5vw,40px)',
            background: 'rgba(4,4,14,0.56)',
            backdropFilter: 'blur(8px)',
            borderTop: '1px solid rgba(26,26,64,0.35)',
          }}
        >
          <div style={{ maxWidth: 1060, margin: '0 auto' }}>
            <SectionIntro
              eyebrow="The Philosophy"
              title="Every letter means something."
              subtitle="VeSiMy is more than a name — it’s a framework for how modern operations teams think, measure, and improve."
            />

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))',
                gap: 20,
              }}
            >
              {[
                {
                  letter: 'V',
                  color: '#D4A208',
                  icon: '◆',
                  bg: 'rgba(212,162,8,0.1)',
                  title: 'Value Addition',
                  sub: 'V is for',
                  body: 'Every process step must add measurable value to the customer.',
                  note: "If it doesn't add value, it's waste — and waste is the enemy of excellence.",
                },
                {
                  letter: 'E',
                  color: '#1DD1A1',
                  icon: '↻',
                  bg: 'rgba(29,209,161,0.1)',
                  title: 'Efficiency Improvement',
                  sub: 'E is for',
                  body: 'Do more with less — time, energy, material, and motion.',
                  note: "Efficiency isn't about working harder; it's about working smarter, always.",
                },
                {
                  letter: 'S',
                  color: '#6CB9FC',
                  icon: '→',
                  bg: 'rgba(108,185,252,0.1)',
                  title: 'Streamlining Processes',
                  sub: 'S is for',
                  body: 'Remove bottlenecks, reduce handoffs, and eliminate unnecessary steps.',
                  note: 'A streamlined process flows like water — fast, smooth, and unstoppable.',
                },
                {
                  letter: 'I',
                  color: '#8C44CC',
                  icon: '⊞',
                  bg: 'rgba(140,68,204,0.1)',
                  title: 'Improvement Matrix',
                  sub: 'I is for',
                  body: 'Track every improvement initiative across impact, effort, and outcome.',
                  note: 'The matrix turns scattered ideas into a prioritized roadmap for action.',
                },
                {
                  letter: 'M',
                  color: '#FF6B6B',
                  icon: '⊡',
                  bg: 'rgba(255,107,107,0.1)',
                  title: 'Mapping Tools',
                  sub: 'M is for',
                  body: 'Visualize your entire value stream — from raw material to customer delivery.',
                  note: "You can't improve what you can't see. Maps make the invisible visible.",
                },
                {
                  letter: 'Y',
                  color: '#F4A623',
                  icon: '▲',
                  bg: 'rgba(244,166,35,0.1)',
                  title: 'Yield Optimization',
                  sub: 'Y is for',
                  body: 'Maximize output quality and quantity while minimizing defects and rework.',
                  note: 'True yield optimization means the right output, first time, every time.',
                },
              ].map((item) => (
                <div
                  key={item.letter}
                  className="card"
                  style={{ padding: '30px 26px', borderRadius: 18 }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
                    <div
                      style={{
                        width: 46,
                        height: 46,
                        borderRadius: 12,
                        background: item.bg,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 20,
                        color: item.color,
                        border: `1px solid ${item.color}22`,
                      }}
                    >
                      {item.icon}
                    </div>

                    <div>
                      <div style={{ fontSize: 12, color: '#8B88B3' }}>{item.sub}</div>
                      <div
                        style={{
                          fontSize: 30,
                          fontWeight: 800,
                          color: item.color,
                          fontFamily: serif,
                          lineHeight: 1,
                        }}
                      >
                        {item.letter}
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: 16,
                      color: '#F3F1FB',
                      marginBottom: 10,
                    }}
                  >
                    {item.title}
                  </div>

                  <p
                    style={{
                      fontSize: 13,
                      color: '#B8B5D1',
                      lineHeight: 1.7,
                      marginBottom: 10,
                    }}
                  >
                    {item.body}
                  </p>

                  <p
                    style={{
                      fontSize: 12,
                      color: '#8B88B3',
                      lineHeight: 1.6,
                      fontStyle: 'italic',
                    }}
                  >
                    {item.note}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          id="compare"
          style={{
            padding: 'clamp(44px,8vw,98px) clamp(16px,5vw,40px)',
            background: 'rgba(4,4,14,0.56)',
            backdropFilter: 'blur(8px)',
            borderTop: '1px solid rgba(26,26,64,0.35)',
            borderBottom: '1px solid rgba(26,26,64,0.35)',
          }}
        >
          <div style={{ maxWidth: 1060, margin: '0 auto' }}>
            <SectionIntro
              eyebrow="How we compare"
              title="Built for practitioners. Priced for reality."
              subtitle="VeSiMy replaces scattered tools, consultants, and static diagrams with one operator-ready platform."
            />

            <div
              style={{
                overflowX: 'auto',
                background: 'rgba(8,8,24,0.76)',
                border: '1px solid rgba(40,40,92,0.46)',
                borderRadius: 18,
                padding: 10,
                backdropFilter: 'blur(10px)',
                boxShadow: '0 18px 42px rgba(0,0,0,0.16)',
              }}
            >
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(212,162,8,0.16)' }}>
                    {[
                      'Feature',
                      'VeSiMy',
                      'eVSM / ValueStream Guru',
                      'iGrafx',
                      'Lucidchart / Visio',
                      'Excel + Consultant',
                    ].map((h, i) => (
                      <th
                        key={h}
                        style={{
                          padding: '14px 16px',
                          textAlign: i === 0 ? 'left' : 'center',
                          fontWeight: 700,
                          fontSize: 11,
                          letterSpacing: 1,
                          color: i === 1 ? '#D4A208' : '#52507A',
                          fontFamily: 'monospace',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {[
                    ['VSM Mapping', '✓', '✓', '✓', '✓', 'Manual'],
                    ['AI Process Monitor', '✓', '✗', '✗', '✗', '✗'],
                    ['Anomaly Detection', '✓', '✗', '✗', '✗', '✗'],
                    ['AI Analysis (Supe)', '✓', '✗', '✗', '✗', '✗'],
                    ['SOP → VSM in 60s', '✓', '✗', '✗', '✗', '✗'],
                    ['Kaizen Tracking', '✓', '✗', 'Addon', '✗', '✗'],
                    ['5 Why / Fishbone', '✓', '✗', '✗', 'Templates', '✗'],
                    ['Live Floor Metrics', '✓', '✗', '✗', '✗', '✗'],
                    ['Process Simulation', '✓', 'Addon', '✓', '✗', '✗'],
                    ['Price / user / mo', '$0–$29', '$200–500', '$150+', '$10+', '$150–500/hr'],
                    ['Setup time', '5 min', 'Days', 'Days', 'Hours', 'Weeks'],
                    ['Works on mobile', '✓', '✗', '✗', 'Partial', '✗'],
                  ].map((row) => (
                    <tr
                      key={row[0]}
                      style={{ borderBottom: '1px solid rgba(26,26,64,0.34)' }}
                    >
                      {row.map((cell, i) => (
                        <td
                          key={i}
                          style={{
                            padding: '14px 16px',
                            textAlign: i === 0 ? 'left' : 'center',
                            color:
                              i === 1
                                ? cell === '✓'
                                  ? '#1DD1A1'
                                  : cell === '✗'
                                    ? '#FF6B6B'
                                    : '#D4A208'
                                : cell === '✓'
                                  ? '#1DD1A1'
                                  : cell === '✗'
                                    ? '#52507A'
                                    : '#8B88B3',
                            fontWeight: i === 1 ? 700 : 400,
                          }}
                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section
          style={{
            padding: '74px 40px',
            background: 'rgba(4,4,14,0.48)',
            backdropFilter: 'blur(6px)',
            borderTop: '1px solid rgba(26,26,64,0.35)',
            borderBottom: '1px solid rgba(26,26,64,0.35)',
          }}
        >
          <div
            style={{
              maxWidth: 860,
              margin: '0 auto',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))',
              gap: 40,
              textAlign: 'center',
            }}
          >
            <Stat value="6" label="CI TOOLS BUILT IN" />
            <Stat value="∞" label="STEPS PER PROJECT" />
            <Stat value="100%" label="FREE TO START" />
            <Stat value="60s" label="SOP TO VSM MAP" />
            <Stat value="$0" label="SETUP REQUIRED" />
          </div>
        </section>

        <section id="pricing" style={{ padding: 'clamp(44px,8vw,98px) clamp(16px,5vw,40px)' }}>
          <div style={{ maxWidth: 1060, margin: '0 auto' }}>
            <SectionIntro
              eyebrow="Pricing"
              title="Upgrade when VeSiMy earns it."
              subtitle="No pressure. No artificial limits on the free experience. We would rather earn your upgrade than force it."
            />

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))',
                gap: 20,
              }}
            >
              {(Object.entries(PLANS) as [string, typeof PLANS[keyof typeof PLANS]][]).map(
                ([key, plan]) => {
                  const isPro = key === 'pro'
                  const isLife = key === 'lifetime'
                  const isEnt = key === 'enterprise'

                  return (
                    <div
                      key={key}
                      className="card"
                      style={{
                        background:
                          isPro || isLife
                            ? 'linear-gradient(180deg, rgba(212,162,8,0.05), rgba(8,8,24,0.82) 70%)'
                            : 'var(--glass)',
                        border:
                          isPro || isLife
                            ? '1px solid rgba(212,162,8,0.24)'
                            : '1px solid var(--border)',
                        borderRadius: 18,
                        padding: '30px 26px',
                        position: 'relative',
                        overflow: 'hidden',
                      }}
                    >
                      {isPro && (
                        <div
                          style={{
                            display: 'inline-flex',
                            background: 'linear-gradient(135deg,#C49510,#D4A208)',
                            color: '#03030D',
                            fontSize: 10,
                            fontWeight: 700,
                            padding: '4px 18px',
                            borderRadius: 999,
                            letterSpacing: 1.5,
                            whiteSpace: 'nowrap',
                            boxShadow: '0 8px 18px rgba(212,162,8,0.16)',
                            marginBottom: 14,
                          }}
                        >
                          MOST POPULAR
                        </div>
                      )}

                      {isLife && (
                        <div
                          style={{
                            display: 'inline-flex',
                            background: 'linear-gradient(135deg,#C49510,#D4A208)',
                            color: '#03030D',
                            fontSize: 10,
                            fontWeight: 700,
                            padding: '4px 18px',
                            borderRadius: 999,
                            letterSpacing: 1.5,
                            whiteSpace: 'nowrap',
                            boxShadow: '0 8px 18px rgba(212,162,8,0.16)',
                            marginBottom: 14,
                          }}
                        >
                          👑 LAUNCH WEEK
                        </div>
                      )}

                      <div style={{ fontSize: 11, color: '#D4A208', letterSpacing: 2, fontWeight: 700, marginBottom: 8, fontFamily: 'monospace', textTransform: 'uppercase' }}>
                        {plan.name}
                      </div>

                      <div style={{ fontSize: 40, fontWeight: 800, color: '#F3F1FB', marginBottom: 6, lineHeight: 1, fontFamily: serif }}>
                        {isEnt ? 'Custom' : plan.price === 0 ? 'Free' : `$${plan.price}`}
                        {!isEnt && plan.price !== null && Number(plan.price) > 0 && (
                          <span style={{ fontSize: 14, fontWeight: 400, color: '#8B88B3', marginLeft: 4, fontFamily: 'Inter, sans-serif' }}>
                            {isLife ? ' once' : '/mo'}
                          </span>
                        )}
                      </div>

                      <p style={{ fontSize: 13, color: '#8B88B3', marginBottom: 22, lineHeight: 1.65, minHeight: 42 }}>
                        {plan.description}
                      </p>

                      <ul
                        style={{
                          listStyle: 'none',
                          marginBottom: 24,
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 10,
                        }}
                      >
                        {plan.features.map((f) => (
                          <li
                            key={f}
                            style={{
                              display: 'flex',
                              alignItems: 'flex-start',
                              gap: 10,
                              fontSize: 13,
                              color: '#B8B5D1',
                              lineHeight: 1.6,
                            }}
                          >
                            <CheckIcon
                              size={13}
                              color="#D4A208"
                              style={{ marginTop: 3, flexShrink: 0 }}
                            />
                            {f}
                          </li>
                        ))}
                      </ul>

                      <Link
                        href={
                          isEnt
                            ? '/enterprise'
                            : isLife
                              ? '/beta'
                              : plan.price === 0
                                ? '/auth/signup'
                                : `/auth/signup?plan=${key}`
                        }
                        className={isPro || isLife ? 'btn-primary' : 'btn-ghost'}
                        style={{
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          padding: '12px 20px',
                          textDecoration: 'none',
                          fontWeight: 700,
                          fontSize: 14,
                        }}
                      >
                        {plan.cta}
                      </Link>

                      {isLife && (
                        <p
                          style={{
                            textAlign: 'center',
                            fontSize: 11,
                            color: '#D4A208',
                            marginTop: 12,
                            lineHeight: 1.5,
                          }}
                        >
                          Launch Week open now →{' '}
                          <Link href="/beta" style={{ color: '#D4A208' }}>
                            Claim Gold Standard
                          </Link>
                        </p>
                      )}
                    </div>
                  )
                }
              )}
            </div>

            <div style={{ textAlign: 'center', marginTop: 24 }}>
              <Link
                href="/pricing"
                style={{
                  fontSize: 13,
                  color: '#8B88B3',
                  textDecoration: 'none',
                  borderBottom: '1px solid rgba(40,40,92,0.6)',
                  paddingBottom: 2,
                }}
              >
                View full pricing details →
              </Link>
            </div>
          </div>
        </section>

        <section
          style={{
            padding: '104px 24px',
            textAlign: 'center',
            maxWidth: 720,
            margin: '0 auto',
          }}
        >
          <p
            style={{
              fontFamily: serif,
              fontSize: 'clamp(24px,3vw,42px)',
              fontWeight: 700,
              lineHeight: 1.35,
              marginBottom: 18,
              color: '#F3F1FB',
            }}
          >
            The factories that win the next decade
            <br />
            <span style={{ color: '#D4A208' }}>are optimizing with AI today.</span>
          </p>

          <p
            style={{
              fontSize: 15,
              color: '#8B88B3',
              marginBottom: 38,
              lineHeight: 1.8,
            }}
          >
            Join manufacturers who replaced spreadsheets, sticky notes, and
            consultants with one AI platform that never clocks out.
          </p>

          <Link
            href="/auth/signup"
            className="btn-primary"
            style={{
              fontSize: 16,
              fontWeight: 700,
              padding: '15px 34px',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              boxShadow: '0 10px 28px rgba(212,162,8,0.20)',
            }}
          >
            Start Free Today <ArrowRightIcon size={16} color="currentColor" />
          </Link>

          <p style={{ fontSize: 12, color: '#7070A0', marginTop: 16 }}>
            Free forever · No credit card · Works on any device
          </p>
        </section>

        <footer
          style={{
            borderTop: '1px solid rgba(26,26,64,0.45)',
            padding: '32px 40px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 16,
            background: 'rgba(3,3,13,0.88)',
            backdropFilter: 'blur(16px)',
          }}
        >
          <VesimyLogo size={28} showText />

          <div
            style={{
              display: 'flex',
              gap: 24,
              fontSize: 12,
              color: '#8B88B3',
              flexWrap: 'wrap',
            }}
          >
            {[
              ['About', '/about'],
              ['Blog', '/blog'],
              ['Changelog', '/changelog'],
              ['Pricing', '/pricing'],
              ['Privacy', '/privacy'],
              ['Terms', '/terms'],
              ['Contact', 'mailto:hello@vesimy.com'],
            ].map(([label, href]) => (
              <Link
                key={label}
                href={href}
                style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.18s' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#D4A208')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#8B88B3')}
              >
                {label}
              </Link>
            ))}
          </div>

          <span
            style={{
              fontSize: 11,
              color: '#7070A0',
              letterSpacing: 2,
              fontFamily: 'monospace',
              textTransform: 'uppercase',
            }}
          >
            © 2026 VeSiMy
          </span>
        </footer>
      </div>
    </div>
  )
}