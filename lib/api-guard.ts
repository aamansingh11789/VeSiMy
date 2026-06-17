// ── lib/api-guard.ts ──────────────────────────────────────────────────────────
// Lightweight, dependency-free guards for public API routes:
// HTML escaping (prevents injection into notification emails), field validation,
// and a per-IP in-memory rate limiter (first-layer abuse protection).

/** Escape HTML so user input can never inject markup into emails or pages. */
export function escapeHtml(input: unknown): string {
  const s = String(input ?? '')
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** Validate a required string within length bounds. Returns an error string or null. */
export function validateString(
  value: unknown,
  field: string,
  { min = 1, max = 2000, required = true }: { min?: number; max?: number; required?: boolean } = {}
): string | null {
  if (value === undefined || value === null || value === '') {
    return required ? `${field} is required` : null
  }
  if (typeof value !== 'string') return `${field} must be text`
  const len = value.trim().length
  if (len < min) return `${field} is too short`
  if (len > max) return `${field} is too long`
  return null
}

/** Validate an email address. Returns an error string or null. */
export function validateEmail(value: unknown, field = 'Email'): string | null {
  const base = validateString(value, field, { max: 254 })
  if (base) return base
  if (!EMAIL_RE.test(String(value).trim())) return `${field} is not valid`
  return null
}

/** Run several validators; return the first error, or null if all pass. */
export function firstError(...errors: (string | null)[]): string | null {
  for (const e of errors) if (e) return e
  return null
}

// ── In-memory per-IP rate limiter ─────────────────────────────────────────────
// Note: state is per serverless instance, so this is a first layer, not a hard
// guarantee. For public forms it meaningfully raises the cost of spam/abuse.
const buckets = new Map<string, { count: number; resetAt: number }>()

export function rateLimit(
  key: string,
  { limit = 5, windowMs = 60_000 }: { limit?: number; windowMs?: number } = {}
): { ok: boolean; retryAfterSec: number } {
  const now = Date.now()
  const b = buckets.get(key)
  if (!b || now > b.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs })
    return { ok: true, retryAfterSec: 0 }
  }
  b.count += 1
  if (b.count > limit) {
    return { ok: false, retryAfterSec: Math.ceil((b.resetAt - now) / 1000) }
  }
  return { ok: true, retryAfterSec: 0 }
}

/** Extract a best-effort client IP from request headers. */
export function clientIp(headers: Headers): string {
  return (
    headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    headers.get('x-real-ip') ||
    'unknown'
  )
}
