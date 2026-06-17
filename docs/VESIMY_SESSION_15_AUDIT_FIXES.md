# VeSiMy Session 15 — Audit remediation (priority fixes)

Implemented the quick-win and high-priority items from the code audit.
All changes TypeScript-clean (0 errors).

## Security / abuse protection
- New lib/api-guard.ts: dependency-free helpers for HTML escaping, field
  validation, email validation, a per-IP/per-user in-memory rate limiter,
  and client-IP extraction.
- Contact route (app/api/contact): added input validation, a honeypot,
  per-IP rate limiting (5/min), and HTML escaping of every field before it
  reaches the notification email. This closes an email/HTML-injection hole
  where form fields were interpolated into email HTML unescaped.
- Beta apply route (app/api/beta/apply): added per-IP rate limiting (5/min),
  a honeypot, and email-format validation. Scoring logic left intact.
- v2/analyze (AI endpoint): added per-user rate limiting (10/min) to match
  the supe/analyze pattern. (Already authenticated and plan-gated.)
- Contact form UI: added a visually-hidden, out-of-tab-order honeypot input.

## Resilience
- Added app/error.tsx (route-level error boundary) and app/global-error.tsx
  (root layout boundary), each with a branded recovery UI and a console
  error log. Previously an unhandled render error showed a blank screen.

## Brand consistency
- Replaced the off-brand error red #FF6B6B (and its rgba 255,107,107 form)
  with the canonical danger color #C94F4F across 34 files (auth, beta,
  enterprise, signup, blog, industries, etc.).

## Not changed (and why)
- No schema-validation library added: zod is not installed and the
  environment may be offline; the guard helpers provide validation without a
  new dependency. A zod pass on every mutating route remains a good
  medium-term task.
- Performance, scalability, and full WCAG conformance still require a
  running instance and were not claimed.

## Deploy
cd ~/OneDrive/Documents/Max/vesimy-v3
git checkout develop
# extract zip, overwriting
git add -A
git commit -m "security: harden public forms (rate limit, honeypot, escape), AI rate limit, error boundaries, brand error color"
git push origin develop
