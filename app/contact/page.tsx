// TypeScript enabled
import type { Metadata } from 'next'
import Link from 'next/link'
import { VLogoMark, VeSiMyWordmark } from '@/components/ui/Logo'

export const metadata: Metadata = {
  title: 'Contact VeSiMy',
  description: 'Get in touch with the VeSiMy team. Questions about pricing, enterprise plans, or the product.',
}

const SANS = "'Satoshi','Inter',-apple-system,sans-serif"
const MONO = "'JetBrains Mono',monospace"
const AMBER = '#D4A843'
const NAVY  = '#04111F'

export default function ContactPage() {
  return (
    <div style={{ minHeight:'100vh', background:'#F5F7FA', fontFamily:SANS,
      WebkitFontSmoothing:'antialiased' }}>
      {/* Nav */}
      <div style={{ background:NAVY, borderBottom:'1px solid rgba(255,255,255,0.08)',
        padding:'0 40px', height:56, display:'flex', alignItems:'center',
        justifyContent:'space-between' }}>
        <Link href="/" style={{ textDecoration:'none', display:'flex', alignItems:'center', gap:10 }}>
          <VLogoMark size={28} />
          <VeSiMyWordmark size={16} onDark />
        </Link>
        <Link href="/" style={{ fontSize:13, color:'rgba(255,255,255,0.5)', textDecoration:'none' }}>
          ← Back to home
        </Link>
      </div>

      <div style={{ maxWidth:860, margin:'0 auto', padding:'64px 40px' }}>
        {/* Header */}
        <div style={{ marginBottom:52 }}>
          <div style={{ fontSize:11, fontWeight:700, color:AMBER, letterSpacing:1.5,
            textTransform:'uppercase', fontFamily:MONO, marginBottom:12 }}>
            CONTACT
          </div>
          <h1 style={{ fontSize:42, fontWeight:800, color:NAVY, letterSpacing:-0.8,
            lineHeight:1.1, margin:'0 0 16px', fontFamily:SANS }}>
            Get in touch
          </h1>
          <p style={{ fontSize:16, color:'#5A6480', lineHeight:1.7, maxWidth:520, margin:0 }}>
            Questions about VeSiMy? Want to discuss an enterprise plan? Interested in
            partnering on Lean training? We read every message.
          </p>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:32,
          alignItems:'start' }}>
          {/* Left: contact options */}
          <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
            {[
              {
                title:'General questions',
                desc:'Product, pricing, how it works, which plan is right for you.',
                action:'max@vesimy.com',
                href:'mailto:max@vesimy.com',
                label:'Send an email',
              },
              {
                title:'Enterprise & consulting',
                desc:'Team plans, white-label, API access, custom integrations, or consultant partnerships.',
                action:'max@vesimy.com',
                href:'mailto:max@vesimy.com?subject=Enterprise inquiry',
                label:'Discuss enterprise',
              },
              {
                title:'Feature requests & feedback',
                desc:'Found something broken, or have an idea for a feature? Tell us directly.',
                action:'max@vesimy.com',
                href:'mailto:max@vesimy.com?subject=Feedback',
                label:'Send feedback',
              },
            ].map(item => (
              <div key={item.title} style={{ padding:'22px 24px', background:'#fff',
                borderRadius:12, border:'1px solid #E2E8F0',
                boxShadow:'0 1px 4px rgba(4,17,31,0.05)' }}>
                <div style={{ fontSize:15, fontWeight:700, color:NAVY, marginBottom:6 }}>
                  {item.title}
                </div>
                <p style={{ fontSize:13, color:'#5A6480', lineHeight:1.6, marginBottom:14, margin:'0 0 14px' }}>
                  {item.desc}
                </p>
                <a href={item.href} style={{ display:'inline-flex', alignItems:'center', gap:6,
                  fontSize:13, fontWeight:600, color:AMBER, textDecoration:'none' }}>
                  {item.label} →
                </a>
              </div>
            ))}
          </div>

          {/* Right: quick info */}
          <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
            <div style={{ padding:'28px', background:NAVY, borderRadius:12,
              border:`1px solid rgba(212,168,67,0.18)` }}>
              <div style={{ fontSize:11, fontWeight:700, color:AMBER, letterSpacing:1.5,
                textTransform:'uppercase', fontFamily:MONO, marginBottom:16 }}>
                ABOUT VESIMY
              </div>
              <p style={{ fontSize:14, color:'rgba(240,242,255,0.75)', lineHeight:1.7, margin:'0 0 16px' }}>
                VeSiMy is a solo-founder product built by Max Singh — a Lean Six Sigma
                Green Belt with 12+ years in manufacturing and operations. Every feature
                comes from real process improvement work on the floor.
              </p>
              <p style={{ fontSize:14, color:'rgba(240,242,255,0.75)', lineHeight:1.7, margin:0 }}>
                Based in California. Built for operations teams everywhere.
              </p>
            </div>

            <div style={{ padding:'22px 24px', background:'rgba(212,168,67,0.06)',
              borderRadius:12, border:`1px solid rgba(212,168,67,0.20)` }}>
              <div style={{ fontSize:13, fontWeight:700, color:NAVY, marginBottom:10 }}>
                Response time
              </div>
              <p style={{ fontSize:13, color:'#5A6480', lineHeight:1.6, margin:0 }}>
                Usually within 24 hours on business days. If you are a current Pro user,
                your email will be prioritized.
              </p>
            </div>

            <div style={{ padding:'22px 24px', background:'#fff', borderRadius:12,
              border:'1px solid #E2E8F0' }}>
              <div style={{ fontSize:13, fontWeight:700, color:NAVY, marginBottom:10 }}>
                Already a user?
              </div>
              <p style={{ fontSize:13, color:'#5A6480', lineHeight:1.6, margin:'0 0 14px' }}>
                Log in to access the Learning Center, or use the Supe AI feedback panel
                inside any project.
              </p>
              <Link href="/dashboard" style={{ display:'inline-flex', alignItems:'center', gap:6,
                fontSize:13, fontWeight:600, color:AMBER, textDecoration:'none' }}>
                Go to dashboard →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
