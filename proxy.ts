import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// ─── Rate Limiting ─────────────────────────────────────────────────────────────
// In-memory — replace with Redis/Upstash for multi-instance production use.

const rateMap = new Map<string, { count: number; resetAt: number }>()

function rateLimit(key: string, max: number, windowMs = 60_000): boolean {
  const now   = Date.now()
  const entry = rateMap.get(key)
  if (!entry || now > entry.resetAt) {
    rateMap.set(key, { count: 1, resetAt: now + windowMs })
    return true
  }
  if (entry.count >= max) return false
  entry.count++
  if (rateMap.size > 20_000) {
    for (const [k, v] of rateMap) { if (v.resetAt < now) rateMap.delete(k) }
  }
  return true
}

// ─── Security Headers ──────────────────────────────────────────────────────────

const SECURITY_HEADERS: Record<string, string> = {
  'X-Frame-Options':           'SAMEORIGIN',
  'X-Content-Type-Options':    'nosniff',
  'X-DNS-Prefetch-Control':    'on',
  'Referrer-Policy':           'strict-origin-when-cross-origin',
  'Permissions-Policy':        'camera=(), microphone=(), geolocation=()',
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://pagead2.googlesyndication.com https://partner.googleadservices.com https://tpc.googlesyndication.com https://js.stripe.com",
    "style-src 'self' 'unsafe-inline'",
    "style-src-elem 'self' 'unsafe-inline'",
    "font-src 'self' data:",
    "img-src 'self' data: blob: https: http:",
    "media-src 'self' https: blob:",
    "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.giphy.com https://api.cloudinary.com https://api.stripe.com https://api.anthropic.com https://*.googlesyndication.com https://adservice.google.com",
    "frame-src 'self' https://js.stripe.com https://hooks.stripe.com https://googleads.g.doubleclick.net https://tpc.googlesyndication.com",
    "object-src 'none'",
    "base-uri 'self'",
  ].join('; '),
}

// ─── Middleware ────────────────────────────────────────────────────────────────
// Note: auth gate is NOT implemented here because the session lives in
// localStorage (not cookies). Auth protection is handled client-side by
// AuthGuard in app/(main)/layout.tsx. Re-enable here once migrated to
// @supabase/ssr with cookie-based sessions.

export function proxy(request: NextRequest) {
  const ip         = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '127.0.0.1'
  const { pathname } = request.nextUrl

  // Rate limit API routes only
  if (pathname.startsWith('/api/')) {
    if (!rateLimit(`${ip}:api`, 120)) {
      return new NextResponse(
        JSON.stringify({ error: 'Trop de requêtes. Veuillez réessayer dans une minute.' }),
        { status: 429, headers: { 'Content-Type': 'application/json', 'Retry-After': '60' } },
      )
    }
  }

  const response = NextResponse.next()

  // CSRF protection on state-mutating requests
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(request.method)) {
    const origin = request.headers.get('origin')
    const host   = request.headers.get('host')
    if (origin && host && !origin.includes(host) && !pathname.startsWith('/api/webhook')) {
      return new NextResponse(
        JSON.stringify({ error: 'CSRF protection: origin mismatch' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } },
      )
    }
  }

  for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
    response.headers.set(key, value)
  }

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon\\.ico|icon\\.svg|icons|manifest\\.json|sw\\.js|opengraph-image).*)'],
}
