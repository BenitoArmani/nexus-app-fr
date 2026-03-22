'use client'
import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Shield, ShieldCheck, ShieldAlert, Smartphone, Monitor, Laptop,
  Lock, Eye, EyeOff, Trash2, Download, AlertTriangle, CheckCircle2,
  XCircle, Clock, Globe, Wifi, UserX, Key, Bell, CreditCard,
  MessageSquareLock, Bot, Star, ChevronRight, X, Check,
} from 'lucide-react'
import Avatar from '@/components/ui/Avatar'
import PasswordStrength from '@/components/ui/PasswordStrength'
import toast from 'react-hot-toast'

// ─── Types ────────────────────────────────────────────────────────────────────

type Tab = 'compte' | 'confidentialite' | 'moderation' | 'paiements' | 'journal'

interface Session {
  id: string; device: string; location: string; ip: string
  lastActive: string; current: boolean; type: 'desktop'|'mobile'|'laptop'
  revoked: boolean
}

interface LogEntry {
  id: string; event: string; detail: string; date: string
  type: 'success'|'warning'|'danger'|'info'
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const INITIAL_SESSIONS: Session[] = [
  { id:'1', device:'Chrome 122 — Windows 11',  location:'Paris, France 🇫🇷',    ip:'82.245.xxx.12', lastActive:'Maintenant',    current:true,  type:'desktop', revoked:false },
  { id:'2', device:'Safari — iPhone 15 Pro',   location:'Lyon, France 🇫🇷',      ip:'90.112.xxx.44', lastActive:'il y a 3h',     current:false, type:'mobile',  revoked:false },
  { id:'3', device:'Firefox — macOS Sequoia',  location:'Bordeaux, France 🇫🇷',  ip:'79.136.xxx.89', lastActive:'il y a 2 jours', current:false, type:'laptop',  revoked:false },
]

const SECURITY_LOG: LogEntry[] = [
  { id:'1', event:'Connexion réussie',                  detail:'Chrome/Windows · Paris, France',          date:'2026-03-16 09:14', type:'success' },
  { id:'2', event:'Mot de passe modifié',               detail:'Via paramètres de sécurité',              date:'2026-03-15 18:30', type:'info'    },
  { id:'3', event:'Connexion depuis un nouvel appareil',detail:'iPhone 15 Pro · Lyon, France',            date:'2026-03-15 14:22', type:'warning' },
  { id:'4', event:'Double authentification activée',    detail:'Application d\'authentification (TOTP)', date:'2026-03-14 11:05', type:'success' },
  { id:'5', event:'Tentative de connexion échouée',     detail:'Mot de passe incorrect · Berlin 🇩🇪',     date:'2026-03-13 23:47', type:'danger'  },
  { id:'6', event:'Tentative de connexion échouée',     detail:'Mot de passe incorrect · Berlin 🇩🇪',     date:'2026-03-13 23:46', type:'danger'  },
  { id:'7', event:'Email de vérification envoyé',       detail:'moi_creator@nexus.app',                  date:'2026-03-12 16:15', type:'info'    },
  { id:'8', event:'Création du compte',                 detail:'Bienvenue sur NEXUS !',                  date:'2026-03-01 10:00', type:'success' },
]

const MOCK_REPORTS = [
  { id:'r1', content:'Contenu signalé : post de @alex_tech', verdict:'Validé ✓',  date:'2026-03-14', points:'+2' },
  { id:'r2', content:'Contenu signalé : reel de @nora_music', verdict:'Rejeté ✗', date:'2026-03-10', points:'-1' },
  { id:'r3', content:'Contenu signalé : spam en commentaire', verdict:'Validé ✓', date:'2026-03-08', points:'+2' },
]

// ─── Sub-components ────────────────────────────────────────────────────────────

function Toggle({ on, onToggle, disabled }: { on: boolean; onToggle: () => void; disabled?: boolean }) {
  return (
    <button
      onClick={onToggle}
      disabled={disabled}
      className={`relative flex-shrink-0 w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none disabled:opacity-40 ${on ? 'bg-violet-500' : 'bg-white/10'}`}
    >
      <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-all duration-200 ${on ? 'left-5' : 'left-0.5'}`} />
    </button>
  )
}

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-surface-2 border border-white/5 rounded-2xl p-5 ${className}`}>
      {children}
    </div>
  )
}

function SecurityScoreGauge({ score }: { score: number }) {
  const r = 38
  const circ = 2 * Math.PI * r
  const offset = circ - (score / 100) * circ
  const color = score >= 80 ? '#34d399' : score >= 60 ? '#a78bfa' : score >= 40 ? '#fbbf24' : '#f87171'
  const label = score >= 80 ? 'Excellent' : score >= 60 ? 'Bon' : score >= 40 ? 'Moyen' : 'Faible'

  return (
    <div className="flex flex-col items-center">
      <svg width="100" height="100" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="7" />
        <motion.circle
          cx="50" cy="50" r={r} fill="none"
          stroke={color} strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          transform="rotate(-90 50 50)"
        />
        <text x="50" y="54" textAnchor="middle" fill="white" fontSize="18" fontWeight="800">{score}</text>
      </svg>
      <p className="text-xs font-semibold mt-1" style={{ color }}>{label}</p>
    </div>
  )
}

const SESSION_ICON = { desktop: Monitor, mobile: Smartphone, laptop: Laptop }
const LOG_ICON     = { success: CheckCircle2, warning: AlertTriangle, danger: XCircle, info: Clock }
const LOG_COLOR    = { success: 'text-emerald-400', warning: 'text-amber-400', danger: 'text-rose-400', info: 'text-cyan-400' }

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SecurityPage() {
  const [activeTab, setActiveTab]       = useState<Tab>('compte')

  // Compte
  const [twoFAEnabled, setTwoFAEnabled] = useState(false)
  const [show2FA, setShow2FA]           = useState(false)
  const [step2FA, setStep2FA]           = useState(1)
  const [method2FA, setMethod2FA]       = useState<'sms'|'app'>('app')
  const [phone, setPhone]               = useState('')
  const [otp, setOtp]                   = useState(['','','','','',''])
  const [suspiciousAlerts, setSuspiciousAlerts] = useState(true)
  const [autoBlock, setAutoBlock]       = useState(true)
  const [sessions, setSessions]         = useState<Session[]>(INITIAL_SESSIONS)

  // Confidentialité
  const [anonymousMode, setAnonymousMode]       = useState(false)
  const [ephemeral, setEphemeral]               = useState('jamais')
  const [vpn, setVpn]                           = useState(false)
  const [showDeleteModal, setShowDeleteModal]   = useState(false)
  const [deleteInput, setDeleteInput]           = useState('')

  // Modération
  const [autoScan, setAutoScan]         = useState(true)
  const [urlCheck, setUrlCheck]         = useState(true)
  const [spamDetect, setSpamDetect]     = useState(true)
  const reportScore = 87

  // Paiements
  const [kycStatus, setKycStatus]       = useState<'not_started'|'pending'|'verified'>('not_started')
  const [fraudAlerts, setFraudAlerts]   = useState(true)
  const [fakeSubDetect, setFakeSubDetect] = useState(true)

  // Journal
  const [logFilter, setLogFilter] = useState<'all'|'success'|'warning'|'danger'>('all')

  // Password change
  const [newPassword, setNewPassword]   = useState('')
  const [showNewPass, setShowNewPass]   = useState(false)

  // Security score
  const securityScore = useMemo(() => {
    let s = 15 // E2E always on
    if (twoFAEnabled)      s += 30
    if (suspiciousAlerts)  s += 15
    if (autoBlock)         s += 10
    if (fraudAlerts)       s += 10
    if (kycStatus === 'verified') s += 10
    if (vpn)               s += 5
    if (anonymousMode)     s += 5
    return Math.min(s, 100)
  }, [twoFAEnabled, suspiciousAlerts, autoBlock, fraudAlerts, kycStatus, vpn, anonymousMode])

  // ── 2FA Handlers ──
  const confirm2FA = () => {
    setTwoFAEnabled(true); setShow2FA(false); setStep2FA(1); setOtp(['','','','','',''])
    toast.success('Double authentification activée ✓')
  }
  const otpChange = (i: number, v: string) => {
    if (!/^\d?$/.test(v)) return
    const next = [...otp]; next[i] = v; setOtp(next)
    if (v && i < 5) document.getElementById(`otp-${i+1}`)?.focus()
  }

  // ── Session Handlers ──
  const revokeSession = (id: string) => {
    setSessions(prev => prev.map(s => s.id === id ? { ...s, revoked: true } : s))
    toast.success('Session révoquée')
  }
  const revokeAll = () => {
    setSessions(prev => prev.map(s => s.current ? s : { ...s, revoked: true }))
    toast.success('Toutes les autres sessions ont été déconnectées')
  }

  // ── KYC Handlers ──
  const startKYC = () => { setKycStatus('pending'); toast.success('Vérification d\'identité lancée') }

  const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: 'compte',          label: 'Compte',         icon: Shield       },
    { id: 'confidentialite', label: 'Confidentialité', icon: Lock         },
    { id: 'moderation',      label: 'Modération IA',  icon: Bot          },
    { id: 'paiements',       label: 'Paiements',      icon: CreditCard   },
    { id: 'journal',         label: 'Journal',        icon: Clock        },
  ]

  const filteredLog = logFilter === 'all'
    ? SECURITY_LOG
    : SECURITY_LOG.filter(e => e.type === logFilter)

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">

      {/* ── Header ── */}
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <h1 className="text-xl font-black text-text-primary flex items-center gap-2">
            <ShieldCheck size={22} className="text-violet-400" /> Sécurité & Confidentialité
          </h1>
          <p className="text-sm text-text-muted mt-0.5">Protégez votre compte NEXUS</p>
        </div>
        <SecurityScoreGauge score={securityScore} />
      </div>

      {/* ── Score suggestions ── */}
      {securityScore < 80 && (
        <motion.div
          initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          className="bg-amber-500/10 border border-amber-500/20 rounded-2xl px-4 py-3 flex items-start gap-3"
        >
          <ShieldAlert size={16} className="text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-amber-400">Score de sécurité : {securityScore}/100</p>
            <p className="text-xs text-text-muted mt-0.5">
              {!twoFAEnabled && '→ Activez la 2FA (+30 pts) '}
              {kycStatus !== 'verified' && '→ Vérifiez votre identité (+10 pts)'}
            </p>
          </div>
        </motion.div>
      )}

      {/* ── Tabs ── */}
      <div className="flex gap-1 overflow-x-auto pb-1 [scrollbar-width:none]">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === id
                ? 'bg-violet-500/20 text-violet-400 border border-violet-500/30'
                : 'text-text-muted hover:bg-white/5 hover:text-text-primary'
            }`}
          >
            <Icon size={13} /> {label}
          </button>
        ))}
      </div>

      {/* ═══════════════════════════════════════════════ TAB: COMPTE */}
      <AnimatePresence mode="wait">
        {activeTab === 'compte' && (
          <motion.div key="compte" initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }} className="space-y-4">

            {/* 2FA */}
            <Card>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${twoFAEnabled ? 'bg-emerald-500/15' : 'bg-white/5'}`}>
                    <Smartphone size={18} className={twoFAEnabled ? 'text-emerald-400' : 'text-text-muted'} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-text-primary">Double authentification (2FA)</p>
                    <p className="text-xs text-text-muted">SMS ou application TOTP (Authy, Google Authenticator)</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {twoFAEnabled
                    ? <span className="text-xs bg-emerald-500/15 text-emerald-400 px-2 py-1 rounded-lg font-semibold">Activé</span>
                    : <span className="text-xs bg-rose-500/10 text-rose-400 px-2 py-1 rounded-lg font-semibold">Désactivé</span>
                  }
                  {!twoFAEnabled && (
                    <button
                      onClick={() => setShow2FA(true)}
                      className="text-xs font-semibold text-violet-400 hover:text-violet-300 bg-violet-500/10 hover:bg-violet-500/20 px-3 py-1.5 rounded-xl transition-all"
                    >
                      Configurer
                    </button>
                  )}
                  {twoFAEnabled && (
                    <button onClick={() => { setTwoFAEnabled(false); toast('2FA désactivée') }}
                      className="text-xs font-semibold text-rose-400 hover:text-rose-300 transition-colors">
                      Désactiver
                    </button>
                  )}
                </div>
              </div>
            </Card>

            {/* Suspicious alerts */}
            <Card>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                    <Bell size={18} className="text-text-muted" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-text-primary">Alertes de connexion</p>
                    <p className="text-xs text-text-muted">Email si connexion depuis un nouveau pays/appareil</p>
                  </div>
                </div>
                <Toggle on={suspiciousAlerts} onToggle={() => setSuspiciousAlerts(v => !v)} />
              </div>
            </Card>

            {/* Auto-block */}
            <Card>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                    <Lock size={18} className="text-text-muted" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-text-primary">Blocage automatique</p>
                    <p className="text-xs text-text-muted">Verrouillage 15 min après 5 tentatives échouées</p>
                  </div>
                </div>
                <Toggle on={autoBlock} onToggle={() => setAutoBlock(v => !v)} />
              </div>
            </Card>

            {/* Sessions */}
            <Card>
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-bold text-text-primary">Sessions actives</p>
                <button onClick={revokeAll} className="text-xs text-rose-400 hover:text-rose-300 font-semibold transition-colors">
                  Déconnecter partout
                </button>
              </div>
              <div className="space-y-3">
                {sessions.filter(s => !s.revoked).map(session => {
                  const Icon = SESSION_ICON[session.type]
                  return (
                    <div key={session.id} className={`flex items-center gap-3 p-3 rounded-xl ${session.current ? 'bg-violet-500/8 border border-violet-500/15' : 'bg-white/3'}`}>
                      <Icon size={18} className={session.current ? 'text-violet-400' : 'text-text-muted'} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-xs font-semibold text-text-primary truncate">{session.device}</p>
                          {session.current && <span className="text-[10px] bg-violet-500/20 text-violet-400 px-1.5 py-0.5 rounded font-bold">Actuel</span>}
                        </div>
                        <p className="text-[11px] text-text-muted">{session.location} · {session.ip} · {session.lastActive}</p>
                      </div>
                      {!session.current && (
                        <button onClick={() => revokeSession(session.id)} className="text-[11px] text-rose-400 hover:text-rose-300 font-semibold flex-shrink-0 transition-colors">
                          Révoquer
                        </button>
                      )}
                    </div>
                  )
                })}
                {sessions.filter(s => !s.revoked).length === 0 && (
                  <p className="text-xs text-text-muted text-center py-2">Toutes les autres sessions ont été révoquées</p>
                )}
              </div>
            </Card>

            {/* Change password */}
            <Card>
              <p className="text-sm font-bold text-text-primary mb-3">Modifier le mot de passe</p>
              <div className="relative">
                <Key size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  type={showNewPass ? 'text' : 'password'} value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  placeholder="Nouveau mot de passe"
                  className="w-full bg-surface-3 border border-white/5 rounded-xl pl-9 pr-10 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-violet-500/50"
                />
                <button type="button" onClick={() => setShowNewPass(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary">
                  {showNewPass ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              <PasswordStrength password={newPassword} className="mt-3" />
              {newPassword && (
                <button
                  onClick={() => { setNewPassword(''); toast.success('Mot de passe mis à jour') }}
                  disabled={!newPassword || newPassword.length < 8}
                  className="mt-3 w-full py-2 bg-violet-600 hover:bg-violet-500 disabled:opacity-40 text-white text-sm font-semibold rounded-xl transition-colors"
                >
                  Mettre à jour
                </button>
              )}
            </Card>
          </motion.div>
        )}

        {/* ═══════════════════════════════════════ TAB: CONFIDENTIALITÉ */}
        {activeTab === 'confidentialite' && (
          <motion.div key="confidentialite" initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }} className="space-y-4">

            {/* E2E — always on */}
            <Card className="border-emerald-500/20 bg-gradient-to-r from-emerald-500/8 to-transparent">
              <div className="flex items-center gap-3">
                <MessageSquareLock size={20} className="text-emerald-400 flex-shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-text-primary">Chiffrement bout en bout</p>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-bold">Toujours actif</span>
                  </div>
                  <p className="text-xs text-text-muted mt-0.5">Tous vos messages privés sont chiffrés. Même NEXUS ne peut pas les lire.</p>
                </div>
              </div>
            </Card>

            {/* Anonymous mode */}
            <Card>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                    <UserX size={18} className="text-text-muted" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-text-primary">Mode anonyme</p>
                    <p className="text-xs text-text-muted">Pseudo et avatar générés automatiquement</p>
                  </div>
                </div>
                <Toggle on={anonymousMode} onToggle={() => { setAnonymousMode(v => !v); toast(anonymousMode ? 'Mode anonyme désactivé' : 'Mode anonyme activé 🕵️') }} />
              </div>
              <AnimatePresence>
                {anonymousMode && (
                  <motion.div initial={{ height:0, opacity:0 }} animate={{ height:'auto', opacity:1 }} exit={{ height:0, opacity:0 }}
                    className="overflow-hidden">
                    <div className="mt-3 pt-3 border-t border-white/5 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm">
                        {String.fromCharCode(65 + Math.floor(Math.random() * 26))}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-text-primary">Fantôme{Math.floor(Math.random() * 9000 + 1000)}</p>
                        <p className="text-xs text-text-muted">@anon_{Math.random().toString(36).slice(2,8)}</p>
                      </div>
                      <span className="ml-auto text-xs text-violet-400 bg-violet-500/10 px-2 py-1 rounded-lg">Identité active</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>

            {/* Ephemeral messages */}
            <Card>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                    <Clock size={18} className="text-text-muted" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-text-primary">Messages éphémères</p>
                    <p className="text-xs text-text-muted">Suppression automatique de vos messages</p>
                  </div>
                </div>
                <select
                  value={ephemeral}
                  onChange={e => { setEphemeral(e.target.value); toast(`Messages éphémères : ${e.target.value}`) }}
                  className="bg-surface-3 border border-white/5 rounded-xl px-3 py-1.5 text-xs text-text-primary focus:outline-none focus:border-violet-500/50 cursor-pointer"
                >
                  <option value="jamais">Jamais</option>
                  <option value="24h">24 heures</option>
                  <option value="7j">7 jours</option>
                  <option value="30j">30 jours</option>
                </select>
              </div>
            </Card>

            {/* VPN */}
            <Card>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                    <Wifi size={18} className="text-text-muted" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-text-primary">VPN intégré</p>
                    <p className="text-xs text-text-muted">Chiffre et masque votre trafic pour les messages sensibles</p>
                  </div>
                </div>
                <Toggle on={vpn} onToggle={() => { setVpn(v => !v); toast(vpn ? 'VPN désactivé' : 'VPN activé 🔒') }} />
              </div>
            </Card>

            {/* RGPD */}
            <Card>
              <p className="text-sm font-bold text-text-primary mb-1">Vos données (RGPD)</p>
              <p className="text-xs text-text-muted mb-4">Conformément au RGPD, vous avez le droit d&apos;accéder, modifier et supprimer vos données.</p>
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  onClick={async () => {
                    try {
                      const res = await fetch('/api/account/export', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId: 'demo' }) })
                      const data = await res.json()
                      const blob = new Blob([JSON.stringify(data.data, null, 2)], { type: 'application/json' })
                      const url = URL.createObjectURL(blob)
                      const a = document.createElement('a'); a.href = url; a.download = data.filename || 'nexus-export.json'; a.click()
                      URL.revokeObjectURL(url)
                      toast.success('Export téléchargé !')
                    } catch {
                      toast.success('Export de données lancé — vous recevrez un email')
                    }
                  }}
                  className="flex items-center justify-center gap-2 flex-1 py-2.5 bg-white/5 hover:bg-white/8 border border-white/5 rounded-xl text-sm font-semibold text-text-primary transition-colors"
                >
                  <Download size={15} /> Télécharger mes données
                </button>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="flex items-center justify-center gap-2 flex-1 py-2.5 bg-rose-500/10 hover:bg-rose-500/15 border border-rose-500/20 rounded-xl text-sm font-semibold text-rose-400 transition-colors"
                >
                  <Trash2 size={15} /> Supprimer mon compte
                </button>
              </div>
            </Card>
          </motion.div>
        )}

        {/* ════════════════════════════════════════════ TAB: MODÉRATION */}
        {activeTab === 'moderation' && (
          <motion.div key="moderation" initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }} className="space-y-4">

            {/* Credibility score */}
            <Card className="bg-gradient-to-br from-violet-600/10 to-cyan-600/5 border-violet-500/20">
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16 flex-shrink-0">
                  <svg width="64" height="64" viewBox="0 0 64 64">
                    <circle cx="32" cy="32" r="26" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="5" />
                    <motion.circle cx="32" cy="32" r="26" fill="none"
                      stroke="#a78bfa" strokeWidth="5" strokeLinecap="round"
                      strokeDasharray={2 * Math.PI * 26}
                      initial={{ strokeDashoffset: 2 * Math.PI * 26 }}
                      animate={{ strokeDashoffset: 2 * Math.PI * 26 * (1 - reportScore / 100) }}
                      transition={{ duration: 1.2, ease: 'easeOut' }}
                      transform="rotate(-90 32 32)" />
                    <text x="32" y="36" textAnchor="middle" fill="white" fontSize="13" fontWeight="800">{reportScore}</text>
                  </svg>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-text-primary">Score de crédibilité</p>
                    <Star size={14} className="text-violet-400" />
                  </div>
                  <p className="text-xs text-text-muted mt-0.5">Vos signalements corrects augmentent votre score. Les faux signalements le réduisent.</p>
                  <div className="flex gap-3 mt-2">
                    <span className="text-[11px] text-emerald-400">✓ Signalement valide → +2 pts</span>
                    <span className="text-[11px] text-rose-400">✗ Faux signalement → -1 pt</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* AI moderation settings */}
            <Card>
              <p className="text-sm font-bold text-text-primary mb-4">Paramètres de modération IA</p>
              <div className="space-y-4">
                {[
                  { label: 'Scan automatique des fichiers uploadés', sub: 'Antivirus + détection contenu adulte/violence', on: autoScan, set: setAutoScan },
                  { label: 'Vérification des URLs', sub: 'Détection liens malveillants avant publication', on: urlCheck, set: setUrlCheck },
                  { label: 'Détection spam & bots', sub: 'Filtre automatique, signalement à 3 reports', on: spamDetect, set: setSpamDetect },
                ].map(({ label, sub, on, set }) => (
                  <div key={label} className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-text-primary">{label}</p>
                      <p className="text-[11px] text-text-muted">{sub}</p>
                    </div>
                    <Toggle on={on} onToggle={() => set((v: boolean) => !v)} />
                  </div>
                ))}
              </div>
            </Card>

            {/* Report history */}
            <Card>
              <p className="text-sm font-bold text-text-primary mb-3">Mes signalements récents</p>
              <div className="space-y-2">
                {MOCK_REPORTS.map(r => (
                  <div key={r.id} className="flex items-center justify-between text-xs py-2 border-b border-white/5 last:border-0">
                    <div>
                      <p className="text-text-primary">{r.content}</p>
                      <p className="text-text-muted mt-0.5">{r.date}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className={r.verdict.startsWith('Validé') ? 'text-emerald-400' : 'text-rose-400'}>
                        {r.verdict}
                      </span>
                      <span className={`font-bold ${r.points.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {r.points}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        )}

        {/* ══════════════════════════════════════════════ TAB: PAIEMENTS */}
        {activeTab === 'paiements' && (
          <motion.div key="paiements" initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }} className="space-y-4">

            {/* KYC */}
            <Card className={kycStatus === 'verified' ? 'border-emerald-500/20' : 'border-amber-500/20'}>
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  kycStatus === 'verified' ? 'bg-emerald-500/15' : kycStatus === 'pending' ? 'bg-amber-500/15' : 'bg-white/5'
                }`}>
                  <CreditCard size={18} className={kycStatus === 'verified' ? 'text-emerald-400' : kycStatus === 'pending' ? 'text-amber-400' : 'text-text-muted'} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-text-primary">Vérification d&apos;identité (KYC)</p>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      kycStatus === 'verified' ? 'bg-emerald-500/20 text-emerald-400' :
                      kycStatus === 'pending'  ? 'bg-amber-500/20 text-amber-400' :
                                                 'bg-white/5 text-text-muted'
                    }`}>
                      {kycStatus === 'verified' ? 'Vérifié ✓' : kycStatus === 'pending' ? 'En cours…' : 'Non vérifié'}
                    </span>
                  </div>
                  <p className="text-xs text-text-muted mt-0.5">Requis pour retirer plus de 100 €/mois. Pièce d&apos;identité + selfie.</p>
                  {kycStatus === 'not_started' && (
                    <button onClick={startKYC}
                      className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-violet-400 hover:text-violet-300 transition-colors">
                      Démarrer la vérification <ChevronRight size={13} />
                    </button>
                  )}
                  {kycStatus === 'pending' && (
                    <p className="mt-2 text-xs text-amber-400">⏳ Vérification en cours (24–48h)</p>
                  )}
                </div>
              </div>
            </Card>

            {/* Limits */}
            <Card>
              <p className="text-sm font-bold text-text-primary mb-3">Limites de sécurité</p>
              <div className="space-y-3">
                {[
                  { icon: Clock,        label: 'Délai premier retrait',        value: '7 jours après inscription' },
                  { icon: CreditCard,   label: 'Limite de retrait',             value: '500 €/jour' },
                  { icon: Globe,        label: 'Données bancaires',             value: 'Gérées par Stripe — jamais stockées chez NEXUS' },
                  { icon: ShieldCheck,  label: 'Backups automatiques',          value: 'Toutes les 24h — chiffrés AES-256' },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-start gap-3">
                    <Icon size={15} className="text-text-muted flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-text-primary">{label}</p>
                      <p className="text-[11px] text-text-muted">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Fraud detection */}
            <Card>
              <p className="text-sm font-bold text-text-primary mb-4">Détection de fraude</p>
              <div className="space-y-4">
                {[
                  { label: 'Alertes gains anormaux', sub: 'Notification si gains inhabituellement élevés', on: fraudAlerts, set: setFraudAlerts },
                  { label: 'Détection faux abonnements', sub: 'Repère les comptes qui s\'abonnent entre eux', on: fakeSubDetect, set: setFakeSubDetect },
                ].map(({ label, sub, on, set }) => (
                  <div key={label} className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-text-primary">{label}</p>
                      <p className="text-[11px] text-text-muted">{sub}</p>
                    </div>
                    <Toggle on={on} onToggle={() => set((v: boolean) => !v)} />
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        )}

        {/* ══════════════════════════════════════════════ TAB: JOURNAL */}
        {activeTab === 'journal' && (
          <motion.div key="journal" initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }} className="space-y-4">
            <Card>
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-bold text-text-primary">Journal de sécurité</p>
                <div className="flex gap-1">
                  {(['all','success','warning','danger'] as const).map(f => (
                    <button key={f} onClick={() => setLogFilter(f)}
                      className={`text-[10px] px-2 py-1 rounded-lg font-semibold transition-colors ${
                        logFilter === f ? 'bg-violet-500/20 text-violet-400' : 'text-text-muted hover:bg-white/5'
                      }`}>
                      {f === 'all' ? 'Tout' : f === 'success' ? '✓' : f === 'warning' ? '⚠' : '✗'}
                    </button>
                  ))}
                </div>
              </div>
              <div className="relative space-y-0">
                {filteredLog.map((entry, i) => {
                  const Icon  = LOG_ICON[entry.type]
                  const color = LOG_COLOR[entry.type]
                  return (
                    <div key={entry.id} className="flex gap-3 pb-4 last:pb-0">
                      <div className="flex flex-col items-center">
                        <Icon size={16} className={`${color} flex-shrink-0`} />
                        {i < filteredLog.length - 1 && <div className="w-px flex-1 bg-white/5 mt-1" />}
                      </div>
                      <div className="flex-1 min-w-0 pb-0">
                        <p className="text-xs font-semibold text-text-primary">{entry.event}</p>
                        {entry.detail && <p className="text-[11px] text-text-muted">{entry.detail}</p>}
                        <p className="text-[10px] text-text-muted/60 mt-0.5">{entry.date}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════════════════════════════════ MODAL: 2FA Setup */}
      <AnimatePresence>
        {show2FA && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShow2FA(false)} />
            <motion.div initial={{ opacity:0, scale:0.95, y:10 }} animate={{ opacity:1, scale:1, y:0 }} exit={{ opacity:0, scale:0.95 }}
              transition={{ type:'spring', stiffness:400, damping:30 }}
              className="relative w-full max-w-sm bg-surface-2 border border-white/10 rounded-2xl shadow-2xl p-6">

              <button onClick={() => { setShow2FA(false); setStep2FA(1) }} className="absolute top-4 right-4 text-text-muted hover:text-text-primary">
                <X size={18} />
              </button>

              {/* Step 1: Choose method */}
              {step2FA === 1 && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-base font-bold text-text-primary">Activer la 2FA</h3>
                    <p className="text-xs text-text-muted mt-1">Choisissez votre méthode de vérification</p>
                  </div>
                  {[
                    { id: 'app', icon: Smartphone, title: 'Application TOTP', sub: 'Authy, Google Authenticator, 1Password…', recommended: true },
                    { id: 'sms', icon: MessageSquareLock, title: 'SMS', sub: 'Code envoyé par SMS à votre numéro', recommended: false },
                  ].map(({ id, icon: Icon, title, sub, recommended }) => (
                    <button key={id} onClick={() => setMethod2FA(id as 'sms'|'app')}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${
                        method2FA === id ? 'border-violet-500/50 bg-violet-500/10' : 'border-white/5 hover:bg-white/5'
                      }`}>
                      <Icon size={20} className={method2FA === id ? 'text-violet-400' : 'text-text-muted'} />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-text-primary">{title}</p>
                          {recommended && <span className="text-[10px] bg-violet-500/20 text-violet-400 px-1.5 rounded font-bold">Recommandé</span>}
                        </div>
                        <p className="text-xs text-text-muted">{sub}</p>
                      </div>
                      {method2FA === id && <Check size={16} className="text-violet-400 flex-shrink-0" />}
                    </button>
                  ))}
                  <button onClick={() => setStep2FA(2)} className="w-full py-2.5 bg-gradient-to-r from-violet-600 to-cyan-500 text-white text-sm font-bold rounded-xl hover:opacity-90 transition-opacity">
                    Continuer →
                  </button>
                </div>
              )}

              {/* Step 2: Configure */}
              {step2FA === 2 && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-base font-bold text-text-primary">
                      {method2FA === 'app' ? 'Scannez le QR code' : 'Entrez votre numéro'}
                    </h3>
                    <p className="text-xs text-text-muted mt-1">
                      {method2FA === 'app' ? 'Avec votre application d\'authentification' : 'Un code SMS vous sera envoyé'}
                    </p>
                  </div>

                  {method2FA === 'app' ? (
                    <div className="space-y-3">
                      {/* Fake QR placeholder */}
                      <div className="w-36 h-36 mx-auto bg-white rounded-xl p-2 grid grid-cols-7 gap-px">
                        {Array.from({ length: 49 }).map((_, i) => (
                          <div key={i} className={`rounded-[1px] ${
                            [0,1,2,3,4,5,7,13,14,21,28,35,42,43,44,45,46,47,8,15,22,29,36,
                             10,11,17,18,24,25,31,32,38,39,48].includes(i)
                              ? 'bg-gray-900' : 'bg-white'
                          }`} />
                        ))}
                      </div>
                      <div className="bg-surface-3 rounded-xl p-3 text-center">
                        <p className="text-[10px] text-text-muted mb-1">Code manuel</p>
                        <p className="text-xs font-mono font-bold text-violet-400 tracking-widest">NEXU-S2FA-DEMO-1234</p>
                      </div>
                    </div>
                  ) : (
                    <input type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                      placeholder="+33 6 12 34 56 78"
                      className="w-full bg-surface-3 border border-white/5 rounded-xl px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-violet-500/50"
                    />
                  )}

                  <div className="flex gap-2">
                    <button onClick={() => setStep2FA(1)} className="flex-1 py-2.5 border border-white/10 text-text-muted text-sm rounded-xl hover:bg-white/5 transition-colors">
                      Retour
                    </button>
                    <button onClick={() => setStep2FA(3)} className="flex-1 py-2.5 bg-violet-600 text-white text-sm font-bold rounded-xl hover:bg-violet-500 transition-colors">
                      {method2FA === 'sms' ? 'Envoyer le code' : 'Suivant'}
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Verify OTP */}
              {step2FA === 3 && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-base font-bold text-text-primary">Code de vérification</h3>
                    <p className="text-xs text-text-muted mt-1">
                      {method2FA === 'sms' ? `SMS envoyé au ${phone || '+33 6 xx xx xx xx'}` : 'Code à 6 chiffres depuis votre app'}
                    </p>
                  </div>
                  <div className="flex gap-2 justify-center">
                    {otp.map((digit, i) => (
                      <input key={i} id={`otp-${i}`} type="text" inputMode="numeric"
                        maxLength={1} value={digit} onChange={e => otpChange(i, e.target.value)}
                        className="w-10 h-12 text-center text-lg font-bold bg-surface-3 border border-white/5 rounded-xl text-text-primary focus:outline-none focus:border-violet-500/50 transition-colors"
                      />
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setStep2FA(2)} className="flex-1 py-2.5 border border-white/10 text-text-muted text-sm rounded-xl hover:bg-white/5 transition-colors">
                      Retour
                    </button>
                    <button
                      onClick={confirm2FA}
                      disabled={otp.join('').length < 6}
                      className="flex-1 py-2.5 bg-gradient-to-r from-violet-600 to-cyan-500 text-white text-sm font-bold rounded-xl hover:opacity-90 disabled:opacity-40 transition-opacity"
                    >
                      Confirmer
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ═══════════════════════════════════ MODAL: Delete Account */}
      <AnimatePresence>
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowDeleteModal(false)} />
            <motion.div initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0, scale:0.95 }}
              className="relative w-full max-w-sm bg-surface-2 border border-rose-500/20 rounded-2xl p-6 space-y-4">
              <button onClick={() => setShowDeleteModal(false)} className="absolute top-4 right-4 text-text-muted hover:text-text-primary">
                <X size={18} />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-500/15 flex items-center justify-center">
                  <Trash2 size={18} className="text-rose-400" />
                </div>
                <div>
                  <p className="text-sm font-bold text-text-primary">Supprimer mon compte</p>
                  <p className="text-xs text-text-muted">Action irréversible — conformité RGPD</p>
                </div>
              </div>
              <p className="text-xs text-text-muted">
                Toutes vos données (posts, messages, gains) seront supprimées définitivement sous 30 jours.
                Tapez <span className="text-rose-400 font-mono font-bold">SUPPRIMER</span> pour confirmer.
              </p>
              <input value={deleteInput} onChange={e => setDeleteInput(e.target.value)}
                placeholder="SUPPRIMER"
                className="w-full bg-surface-3 border border-rose-500/20 rounded-xl px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-rose-500/50"
              />
              <button
                disabled={deleteInput !== 'SUPPRIMER'}
                onClick={() => { setShowDeleteModal(false); toast.error('Compte marqué pour suppression — email de confirmation envoyé') }}
                className="w-full py-2.5 bg-rose-500 hover:bg-rose-600 disabled:opacity-30 text-white text-sm font-bold rounded-xl transition-colors"
              >
                Supprimer définitivement
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
