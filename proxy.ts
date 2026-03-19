import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// ─── Rate Limiting ────────────────────────────────────────────────────────────
// In-memory store — replace with Redis/Upstash in production for distributed use.

const rateMap = new Map<string, { count: number; resetAt: number }>()

function rateLimit(ip: string, max: number, windowMs = 60_000): boolean {
  const now   = Date.now()
  const entry = rateMap.get(ip)
  if (!entry || now > entry.resetAt) {
    rateMap.set(ip, { count: 1, resetAt: now + windowMs })
    return true
  }
  if (entry.count >= max) return false
  entry.count++

  // Prevent unbounded memory growth
  if (rateMap.size > 20_000) {
    for (const [k, v] of rateMap) {
      if (v.resetAt < now) rateMap.delete(k)
    }
  }
  return true
}

// ─── Security Headers ─────────────────────────────────────────────────────────

const SECURITY_HEADERS: Record<string, string> = {
  'X-Frame-Options':           'DENY',
  'X-Content-Type-Options':    'nosniff',
  'X-DNS-Prefetch-Control':    'off',
  'Referrer-Policy':           'strict-origin-when-cross-origin',
  'Permissions-Policy':        'camera=(), microphone=(), geolocation=(), payment=()',
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https: blob:",
    "media-src 'self' https: blob:",
    "connect-src 'self' https: wss:",
    "frame-src https://js.stripe.com https://hooks.stripe.com",
    "font-src 'self' data:",
    "object-src 'none'",
    "base-uri 'self'",
  ].join('; '),
}

// ─── Auth gate — routes publiques ─────────────────────────────────────────────

const PUBLIC_PATHS = ['/', '/login', '/register', '/legal', '/privacy', '/terms']

function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some(p => pathname === p || pathname.startsWith(p + '/'))
}

// ─── Proxy (Next.js 16 middleware equivalent) ─────────────────────────────────

export function proxy(request: NextRequest) {
  const ip       = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '127.0.0.1'
  const { pathname } = request.nextUrl

  // ── Auth gate: redirect to /login if no session ───────────────────────────
  if (!isPublicPath(pathname)) {
    const demoSession     = request.cookies.get('nexus-demo')
    const hasSupabaseSession = request.cookies.getAll().some(
      c => c.name.startsWith('sb-') && c.name.endsWith('-auth-token')
    )
    if (!demoSession && !hasSupabaseSession) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('from', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  // Strict rate limiting on auth + API routes
  const isAuth = pathname.startsWith('/login') || pathname.startsWith('/register')
  const isApi  = pathname.startsWith('/api/')

  if (isAuth || isApi) {
    const limit = isAuth ? 10 : 100  // 10 req/min on auth, 100 on API
    if (!rateLimit(`${ip}:${pathname.split('/')[1]}`, limit)) {
      return new NextResponse(
        JSON.stringify({ error: 'Trop de requêtes. Veuillez réessayer dans une minute.' }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After':  '60',
          },
        }
      )
    }
  }

  const response = NextResponse.next()

  // CSRF protection — verify origin on state-mutating requests
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(request.method)) {
    const origin = request.headers.get('origin')
    const host   = request.headers.get('host')
    if (origin && host && !origin.includes(host) && !pathname.startsWith('/api/webhook')) {
      return new NextResponse(
        JSON.stringify({ error: 'CSRF protection: origin mismatch' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      )
    }
  }

  // Apply security headers to every response
  for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
    response.headers.set(key, value)
  }

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon\\.ico|icons|manifest\\.json).*)'],
}
