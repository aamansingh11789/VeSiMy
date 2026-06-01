'use client'
import React from 'react'
// ── app/contact/page.tsx ──────────────────────────────────────────────────────
import { useState } from 'react'
import Link from 'next/link'
import type { Metadata } from 'next'
import { VLogoMark, VeSiMyWordmark } from '@/components/ui/Logo'

const SANS  = "'Satoshi','Inter',-apple-system,sans-serif"
const MONO  = "'JetBrains Mono',monospace"
const AMBER = '#C9A66B'
const NAVY  = '#04111F'
const GRAY  = '#5A6480'
const BORD  = '#E2E8F0'

const TOPICS = [
  'General question',
  'Enterprise / team plan',
  'Consulting services',
  'Partnership or integration',
  'Bug report',
  'Feature request',
  'Press or media',
  'Other',
]

export default function ContactPage() {
  const [name,    setName]    = useState('')
  const [email,   setEmail]   = useState('')
  const [topic,   setTopic]   = useState(TOPICS[0])
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent,    setSent]    = useState(false)
  const [error,   setError]   = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!name.trim())    { setError('Please enter your name.'); return }
    if (!email.trim())   { setError('Please enter your email.'); return }
    if (!message.trim()) { setError('Please enter a message.'); return }
    setLoading(true)

    try {
      // Send via Sender.net API or fallback to mailto
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, topic, message }),
      })
      if (!res.ok) throw new Error('Failed')
      setSent(true)
    } catch {
      // Fallback: open mailto link
      const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nTopic: ${topic}\n\n${message}`)
      window.location.href = `mailto:max@vesimy.com?subject=VeSiMy Contact: ${encodeURIComponent(topic)}&body=${body}`
      setSent(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F5F7FA', fontFamily: SANS,
      WebkitFontSmoothing: 'antialiased' }}>

      {/* Nav */}
      <div style={{ background: NAVY, borderBottom: '1px solid rgba(255,255,255,0.08)',
        padding: '0 24px', height: 56, display: 'flex', alignItems: 'center',
        justifyContent: 'space-between' }}>
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
          <VLogoMark size={28} />
          <VeSiMyWordmark size={16} onDark />
        </Link>
        <Link href="/" style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', textDecoration: 'none' }}>
          Back to home
        </Link>
      </div>

      <div style={{ maxWidth: 680, margin: '0 auto', padding: '52px 24px 80px' }}>

        {/* Header */}
        <div style={{ marginBottom: 36 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: AMBER, letterSpacing: 1.5,
            textTransform: 'uppercase', fontFamily: MONO, marginBottom: 10 }}>
            Get in Touch
          </div>
          <h1 style={{ fontSize: 34, fontWeight: 800, color: NAVY, letterSpacing: -0.6,
            marginBottom: 12, fontFamily: SANS }}>Contact VeSiMy</h1>
          <p style={{ fontSize: 15, color: GRAY, lineHeight: 1.7, margin: 0, fontFamily: SANS }}>
            Questions about the platform, consulting services, enterprise plans, or partnerships.
            Max Singh (founder) reads every message personally.
          </p>
        </div>

        {sent ? (
          <div style={{ padding: '32px 28px', background: '#fff', borderRadius: 12,
            border: '1px solid rgba(22,128,60,0.20)', textAlign: 'center' }}>
            <div style={{ fontSize: 28, marginBottom: 12 }}>✓</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#16803C', marginBottom: 8, fontFamily: SANS }}>
              Message received
            </div>
            <p style={{ fontSize: 14, color: GRAY, lineHeight: 1.6, maxWidth: 360,
              marginInline: 'auto', fontFamily: SANS }}>
              Thanks for reaching out. You will hear back within 1 to 2 business days.
              For faster responses, connect on{' '}
              <a href="https://www.linkedin.com/in/max-singh" target="_blank" rel="noopener noreferrer"
                style={{ color: AMBER, fontWeight: 600 }}>LinkedIn</a>.
            </p>
            <button onClick={() => setSent(false)}
              style={{ marginTop: 20, padding: '9px 20px', borderRadius: 8, fontSize: 13,
                fontWeight: 600, cursor: 'pointer', background: '#F5F7FA',
                border: `1px solid ${BORD}`, color: NAVY, fontFamily: SANS }}>
              Send another message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}
            style={{ background: '#fff', borderRadius: 12, border: `1px solid ${BORD}`,
              padding: '28px', boxShadow: '0 2px 8px rgba(4,17,31,0.06)' }}>

            {/* Name + Email */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: GRAY,
                  letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 6, fontFamily: SANS }}>
                  Your name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Jane Smith"
                  required
                  style={{ width: '100%', padding: '9px 12px', borderRadius: 8, fontSize: 14,
                    border: `1px solid ${BORD}`, fontFamily: SANS, color: NAVY,
                    outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: GRAY,
                  letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 6, fontFamily: SANS }}>
                  Email address *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="jane@company.com"
                  required
                  style={{ width: '100%', padding: '9px 12px', borderRadius: 8, fontSize: 14,
                    border: `1px solid ${BORD}`, fontFamily: SANS, color: NAVY,
                    outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
            </div>

            {/* Topic */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: GRAY,
                letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 6, fontFamily: SANS }}>
                Topic
              </label>
              <select
                value={topic}
                onChange={e => setTopic(e.target.value)}
                style={{ width: '100%', padding: '9px 12px', borderRadius: 8, fontSize: 14,
                  border: `1px solid ${BORD}`, fontFamily: SANS, color: NAVY,
                  outline: 'none', background: '#fff', appearance: 'none',
                  backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%235A6480' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E\")",
                  backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center',
                  paddingRight: 36, cursor: 'pointer' }}>
                {TOPICS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            {/* Message */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: GRAY,
                letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 6, fontFamily: SANS }}>
                Message *
              </label>
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Tell me about your process, your team size, what you are trying to improve, or anything else relevant."
                required
                rows={6}
                style={{ width: '100%', padding: '10px 12px', borderRadius: 8, fontSize: 14,
                  border: `1px solid ${BORD}`, fontFamily: SANS, color: NAVY,
                  outline: 'none', resize: 'vertical', lineHeight: 1.6,
                  boxSizing: 'border-box' }}
              />
              <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 4, fontFamily: SANS }}>
                {message.length} / 2000 characters
              </div>
            </div>

            {error && (
              <div style={{ padding: '10px 14px', background: 'rgba(192,24,12,0.06)',
                border: '1px solid rgba(192,24,12,0.20)', borderRadius: 8,
                fontSize: 13, color: '#C0180C', marginBottom: 16, fontFamily: SANS }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{ width: '100%', padding: '12px', borderRadius: 8, fontSize: 14,
                fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
                background: loading ? '#A8854F' : 'linear-gradient(135deg,#C9A66B,#A8854F)',
                color: '#0B1D33', border: 'none', fontFamily: SANS,
                opacity: loading ? 0.75 : 1, transition: 'opacity 0.15s' }}>
              {loading ? 'Sending...' : 'Send message'}
            </button>

            <p style={{ fontSize: 12, color: '#94A3B8', textAlign: 'center',
              marginTop: 14, fontFamily: SANS }}>
              Your message goes directly to Max Singh. No support bots, no ticket queues.
            </p>
          </form>
        )}

        {/* Alternative contact */}
        <div style={{ marginTop: 32, padding: '20px 24px', background: '#fff',
          borderRadius: 10, border: `1px solid ${BORD}` }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: GRAY, letterSpacing: 1,
            textTransform: 'uppercase', fontFamily: MONO, marginBottom: 12 }}>
            Other ways to reach us
          </div>
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
            <a href="mailto:max@vesimy.com"
              style={{ fontSize: 13, color: AMBER, fontWeight: 600,
                textDecoration: 'none', fontFamily: SANS }}>
              max@vesimy.com
            </a>
            <a href="https://www.linkedin.com/in/max-singh"
              target="_blank" rel="noopener noreferrer"
              style={{ fontSize: 13, color: AMBER, fontWeight: 600,
                textDecoration: 'none', fontFamily: SANS }}>
              LinkedIn
            </a>
            <a href="https://vesimy.com"
              style={{ fontSize: 13, color: AMBER, fontWeight: 600,
                textDecoration: 'none', fontFamily: SANS }}>
              vesimy.com
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
