// Sanitize un string pour éviter XSS et injections
export function sanitize(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .trim()
    .slice(0, 10000) // limite de longueur
}

// Validation d'email
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254
}

// Validation mot de passe
export function isStrongPassword(pwd: string): { valid: boolean; message: string } {
  if (pwd.length < 8) return { valid: false, message: 'Minimum 8 caractères' }
  if (pwd.length > 128) return { valid: false, message: 'Maximum 128 caractères' }
  if (!/[A-Z]/.test(pwd)) return { valid: false, message: 'Au moins une majuscule' }
  if (!/[0-9]/.test(pwd)) return { valid: false, message: 'Au moins un chiffre' }
  return { valid: true, message: 'Mot de passe fort' }
}

// Validation username
export function isValidUsername(username: string): boolean {
  return /^[a-zA-Z0-9_]{3,30}$/.test(username)
}

// Logger sécurisé (masque les données sensibles)
export function safeLog(level: 'info' | 'warn' | 'error', message: string, meta?: Record<string, unknown>) {
  const SENSITIVE_KEYS = ['password', 'token', 'secret', 'key', 'card', 'cvv', 'ssn', 'email']
  const safeMeta = meta ? Object.fromEntries(
    Object.entries(meta).map(([k, v]) =>
      SENSITIVE_KEYS.some(s => k.toLowerCase().includes(s)) ? [k, '[REDACTED]'] : [k, v]
    )
  ) : undefined
  const entry = { timestamp: new Date().toISOString(), level, message, ...(safeMeta && { meta: safeMeta }) }
  if (level === 'error') console.error(JSON.stringify(entry))
  else if (level === 'warn') console.warn(JSON.stringify(entry))
  else console.log(JSON.stringify(entry))
}

// Détection de contenu malveillant simple
export function containsMaliciousContent(input: string): boolean {
  const patterns = [
    /<script/i, /javascript:/i, /on\w+\s*=/i, /eval\(/i,
    /union.*select/i, /drop\s+table/i, /insert\s+into/i, /delete\s+from/i,
  ]
  return patterns.some(p => p.test(input))
}

// Rate limit côté client (localStorage)
export function clientRateLimit(key: string, max: number, windowMs: number): boolean {
  if (typeof window === 'undefined') return true
  const now = Date.now()
  const data = JSON.parse(localStorage.getItem(`rl_${key}`) || '{"count":0,"resetAt":0}')
  if (now > data.resetAt) {
    localStorage.setItem(`rl_${key}`, JSON.stringify({ count: 1, resetAt: now + windowMs }))
    return true
  }
  if (data.count >= max) return false
  localStorage.setItem(`rl_${key}`, JSON.stringify({ count: data.count + 1, resetAt: data.resetAt }))
  return true
}

// ─── Password Strength ────────────────────────────────────────────────────────

export interface PasswordRequirements {
  length:    boolean  // ≥ 8 chars
  uppercase: boolean  // ≥ 1 uppercase
  digit:     boolean  // ≥ 1 digit
  special:   boolean  // ≥ 1 special char
  noCommon:  boolean  // not a trivial password
}
export interface PasswordStrengthResult {
  score:    number   // 0–5
  label:    string
  color:    string   // Tailwind text color
  barColor: string   // Tailwind bg color
  requirements: PasswordRequirements
  allMet:   boolean
}

const COMMON_PASSWORDS = new Set([
  'password','password1','password123','123456','12345678','123456789',
  'qwerty','azerty','admin','admin123','welcome','welcome1',
  'nexus','nexus123','iloveyou','sunshine','letmein','monkey','dragon',
])

export function checkPasswordStrength(password: string): PasswordStrengthResult {
  const r: PasswordRequirements = {
    length:    password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    digit:     /[0-9]/.test(password),
    special:   /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]/.test(password),
    noCommon:  password.length > 0 && !COMMON_PASSWORDS.has(password.toLowerCase()),
  }
  const score = Object.values(r).filter(Boolean).length
  const LEVELS = [
    { label: '',            color: 'text-text-muted',  barColor: 'bg-white/10' },
    { label: 'Très faible', color: 'text-rose-400',    barColor: 'bg-rose-500' },
    { label: 'Faible',      color: 'text-orange-400',  barColor: 'bg-orange-500' },
    { label: 'Moyen',       color: 'text-yellow-400',  barColor: 'bg-yellow-500' },
    { label: 'Fort',        color: 'text-emerald-400', barColor: 'bg-emerald-500' },
    { label: 'Excellent',   color: 'text-violet-400',  barColor: 'bg-violet-500' },
  ]
  return { score, ...LEVELS[score], requirements: r, allMet: score === 5 }
}

// ─── File Upload Validation ───────────────────────────────────────────────────

export interface FileValidationResult { valid: boolean; error?: string }

const ALLOWED_IMG  = new Set(['image/jpeg','image/jpg','image/png','image/gif','image/webp'])
const ALLOWED_VID  = new Set(['video/mp4','video/webm','video/quicktime'])
const DANGER_EXT   = /\.(exe|bat|cmd|sh|ps1|vbs|jar|dmg|apk|scr|msi|dll|php|py|rb)$/i
const MAX_IMG_BYTES = 10  * 1024 * 1024   //  10 MB
const MAX_VID_BYTES = 100 * 1024 * 1024   // 100 MB

export function validateFileUpload(filename: string, size: number, type: string): FileValidationResult {
  if ((filename.match(/\./g) ?? []).length > 1 && DANGER_EXT.test(filename))
    return { valid: false, error: 'Nom de fichier suspect (double extension)' }
  const ext = filename.split('.').pop()?.toLowerCase() ?? ''
  if (!ALLOWED_IMG.has(type) && !ALLOWED_VID.has(type))
    return { valid: false, error: `Format .${ext} non autorisé. Acceptés : jpg, png, gif, webp, mp4, webm` }
  if (ALLOWED_IMG.has(type) && size > MAX_IMG_BYTES)
    return { valid: false, error: `Image trop volumineuse (${(size/1e6).toFixed(1)} MB). Max : 10 MB` }
  if (ALLOWED_VID.has(type) && size > MAX_VID_BYTES)
    return { valid: false, error: `Vidéo trop volumineuse (${(size/1e6).toFixed(0)} MB). Max : 100 MB` }
  return { valid: true }
}

// ─── Suspicious URL Detection ─────────────────────────────────────────────────

const MALICIOUS_URL_PATTERNS = [
  /javascript:/i, /data:text\/html/i, /vbscript:/i, /<script/i,
  /on\w+\s*=/i, /\.(exe|bat|cmd|sh|ps1|apk|dmg|scr)(\?|#|$)/i,
  /\/(wp-admin|phpmyadmin|\.env|\.git\/config)/i,
  /(%3C|%3E|%22|%27|%3B)/i,
]

export function isSuspiciousUrl(url: string): boolean {
  try {
    return MALICIOUS_URL_PATTERNS.some(p => p.test(decodeURIComponent(url)))
  } catch { return true }
}

// ─── Login Attempt Tracking (client-side) ────────────────────────────────────

const LOGIN_KEY    = 'nx_login_attempts'
const MAX_LOGIN    = 50              // BETA: relaxed from 5 — restore to 10 before launch
const LOCKOUT_DUR  = 60 * 1000      // BETA: 1 min lockout — restore to 15 * 60 * 1000 before launch

interface AttemptData { count: number; lockedUntil: number | null }
export interface LoginAttemptResult { allowed: boolean; remaining: number; lockedUntil: number | null }

function readAttempts(email: string): AttemptData {
  if (typeof window === 'undefined') return { count: 0, lockedUntil: null }
  const raw = localStorage.getItem(`${LOGIN_KEY}:${email}`)
  return raw ? (JSON.parse(raw) as AttemptData) : { count: 0, lockedUntil: null }
}

export function checkLoginAttempts(email: string): LoginAttemptResult {
  const d = readAttempts(email)
  if (d.lockedUntil && Date.now() < d.lockedUntil)
    return { allowed: false, remaining: 0, lockedUntil: d.lockedUntil }
  if (d.lockedUntil && Date.now() >= d.lockedUntil) {
    localStorage.removeItem(`${LOGIN_KEY}:${email}`)
    return { allowed: true, remaining: MAX_LOGIN, lockedUntil: null }
  }
  return { allowed: d.count < MAX_LOGIN, remaining: MAX_LOGIN - d.count, lockedUntil: null }
}

export function recordFailedLogin(email: string): LoginAttemptResult {
  const d = readAttempts(email)
  const newCount = d.count + 1
  const lockedUntil = newCount >= MAX_LOGIN ? Date.now() + LOCKOUT_DUR : null
  if (typeof window !== 'undefined')
    localStorage.setItem(`${LOGIN_KEY}:${email}`, JSON.stringify({ count: newCount, lockedUntil }))
  return { allowed: newCount < MAX_LOGIN, remaining: Math.max(0, MAX_LOGIN - newCount), lockedUntil }
}

export function recordSuccessfulLogin(email: string) {
  if (typeof window !== 'undefined') localStorage.removeItem(`${LOGIN_KEY}:${email}`)
}
