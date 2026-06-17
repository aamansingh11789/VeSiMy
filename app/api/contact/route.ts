// TypeScript enabled
// ── app/api/contact/route.ts ──────────────────────────────────────────────────
// Handles contact form submissions. Validates and rate-limits input, escapes all
// user content before it reaches the notification email, then sends via Sender.net
// if configured (otherwise the client mailto fallback handles delivery).

import { NextResponse, type NextRequest } from 'next/server'
import { escapeHtml, validateString, validateEmail, firstError, rateLimit, clientIp } from '@/lib/api-guard'

export async function POST(request: NextRequest) {
  try {
    const ip = clientIp(request.headers)

    // Rate limit: 5 submissions per IP per minute.
    const rl = rateLimit(`contact:${ip}`, { limit: 5, windowMs: 60_000 })
    if (!rl.ok) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again shortly.' },
        { status: 429, headers: { 'Retry-After': String(rl.retryAfterSec) } }
      )
    }

    const body = await request.json().catch(() => null)
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }

    const { name, email, topic, message, website } = body as Record<string, unknown>

    // Honeypot: bots fill hidden fields. Pretend success, drop silently.
    if (typeof website === 'string' && website.trim() !== '') {
      return NextResponse.json({ success: true })
    }

    const err = firstError(
      validateString(name, 'Name', { min: 1, max: 120 }),
      validateEmail(email),
      validateString(topic, 'Topic', { max: 120, required: false }),
      validateString(message, 'Message', { min: 1, max: 5000 }),
    )
    if (err) return NextResponse.json({ error: err }, { status: 400 })

    // Escape every field before it is placed into HTML.
    const safe = {
      name: escapeHtml(name),
      email: escapeHtml(email),
      topic: escapeHtml(topic ?? 'General'),
      message: escapeHtml(message).replace(/\n/g, '<br>'),
    }

    if (process.env.SENDER_API_KEY) {
      await fetch('https://api.sender.net/v2/transactional/email', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.SENDER_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: [{ email: 'max@vesimy.com', name: 'Max Singh' }],
          from: { email: 'noreply@vesimy.com', name: 'VeSiMy Contact Form' },
          subject: `Contact Form: ${safe.topic} from ${safe.name}`,
          html: `
            <p><strong>Name:</strong> ${safe.name}</p>
            <p><strong>Email:</strong> ${safe.email}</p>
            <p><strong>Topic:</strong> ${safe.topic}</p>
            <p><strong>Message:</strong></p>
            <p>${safe.message}</p>
            <hr>
            <p><small>From VeSiMy contact form | IP: ${escapeHtml(ip)}</small></p>
          `,
        }),
      }).catch(err => console.error('[contact] Email send failed:', err))
    }

    console.log(`[contact] ${safe.topic} from a visitor (details redacted)`)
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[contact]', err)
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
  }
}
