'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TrendingUp, TrendingDown, Clock, Trophy, ExternalLink, RotateCcw, Zap, Crown, Medal, Shield, AlertTriangle, X, CheckCircle2 } from 'lucide-react'
import type { VirtualHolding, VirtualTransaction } from '@/hooks/useVirtualPortfolio'
import { MAX_WEEKLY_PRO_GLYPHS } from '@/hooks/useVirtualPortfolio'

interface PortfolioPanelProps {
  cash: number
  holdings: VirtualHolding[]
  transactions: VirtualTransaction[]
  portfolioTotal: number
  totalPnL: number
  totalPnLPercent: number
  allTimeReturn: number
  allTimeReturnPercent: number
  totalGlyphsEarned: number
  portfolioMode: 'beginner' | 'pro'
  weeklyGlyphsStaked: number
  remainingWeeklyGlyphs: number
  onReset: () => void
  onSelectHolding: (symbol: string) => void
  onSetMode: (mode: 'beginner' | 'pro') => void
}

const BROKERS = [
  {
    name: 'Trade Republic',
    desc: 'Actions + Crypto · 0% commission',
    flag: '🇪🇺',
    color: 'from-emerald-600/20 to-emerald-600/5',
    border: 'border-emerald-500/20',
    url: 'https://traderepublic.com',
    badge: 'Recommandé Europe',
    badgeColor: 'text-emerald-400 bg-emerald-500/10',
  },
  {
    name: 'Binance',
    desc: 'Crypto uniquement · Leader mondial',
    flag: '₿',
    color: 'from-yellow-600/20 to-yellow-600/5',
    border: 'border-yellow-500/20',
    url: 'https://binance.com',
    badge: 'Top crypto',
    badgeColor: 'text-yellow-400 bg-yellow-500/10',
  },
  {
    name: 'Boursorama Banque',
    desc: 'Actions françaises · Régulé AMF',
    flag: '🇫🇷',
    color: 'from-blue-600/20 to-blue-600/5',
    border: 'border-blue-500/20',
    url: 'https://boursorama.com',
    badge: 'France',
    badgeColor: 'text-blue-400 bg-blue-500/10',
  },
]

const MOCK_LEADERBOARD = [
  { name: 'Alex_T', return: 34.2, rank: 1 },
  { name: 'Sophie_M', return: 28.7, rank: 2 },
  { name: 'Toi', return: 0, rank: 3, isMe: true },
]

function ProRiskModal({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) {
  const [checked18, setChecked18] = useState(false)
  const [checkedRisk, setCheckedRisk] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.85)' }}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-surface-2 border border-amber-500/30 rounded-3xl w-full max-w-sm overflow-hidden"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/5 bg-amber-500/5">
          <div className="flex items-center gap-2">
            <AlertTriangle size={16} className="text-amber-400" />
            <span className="text-sm font-bold text-amber-400">⚠️ MODE PRO — Avertissement</span>
          </div>
          <button onClick={onCancel} className="text-zinc-400 hover:text-white">
            <X size={14} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 space-y-2">
            <p className="text-xs text-amber-300 font-semibold">En MODE PRO, tu mises de vrais GLYPHS :</p>
            <ul className="text-xs text-zinc-300 space-y-1 leading-relaxed">
              <li>• Si ton trade est <span className="text-emerald-400 font-semibold">profitable</span> → tu récupères tes GLYPHS + des gains</li>
              <li>• Si ton trade est <span className="text-rose-400 font-semibold">perdant</span> → tu <strong>perds</strong> les GLYPHS misés</li>
              <li>• Limite : <span className="text-amber-400 font-semibold">{MAX_WEEKLY_PRO_GLYPHS} GLYPHS misés par semaine</span></li>
              <li>• Réservé aux utilisateurs <span className="text-violet-400 font-semibold">+18 ans</span></li>
            </ul>
          </div>

          <div className="space-y-3">
            <label className="flex items-start gap-3 cursor-pointer">
              <div
                onClick={() => setChecked18(!checked18)}
                className={`mt-0.5 w-5 h-5 rounded-lg border-2 flex items-center justify-center shrink-0 transition-colors ${checked18 ? 'bg-violet-500 border-violet-500' : 'border-white/20'}`}
              >
                {checked18 && <CheckCircle2 size={12} className="text-white" />}
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Je confirme avoir <strong>+18 ans</strong> et être conscient que ce mode implique des gains et pertes réels en GLYPHS.
              </p>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <div
                onClick={() => setCheckedRisk(!checkedRisk)}
                className={`mt-0.5 w-5 h-5 rounded-lg border-2 flex items-center justify-center shrink-0 transition-colors ${checkedRisk ? 'bg-violet-500 border-violet-500' : 'border-white/20'}`}
              >
                {checkedRisk && <CheckCircle2 size={12} className="text-white" />}
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Je comprends les <strong>risques de perte</strong> et j&apos;accepte les conditions du MODE PRO.
              </p>
            </label>
          </div>

          <div className="flex gap-2">
            <button
              onClick={onCancel}
              className="flex-1 py-2.5 rounded-xl border border-white/10 text-sm font-semibold text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              Annuler
            </button>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={onConfirm}
              disabled={!checked18 || !checkedRisk}
              className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-sm font-bold text-white transition-colors"
            >
              Activer MODE PRO
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export function PortfolioPanel({
  cash, holdings, transactions, portfolioTotal, totalPnL, totalPnLPercent,
  allTimeReturn, allTimeReturnPercent, totalGlyphsEarned,
  portfolioMode, weeklyGlyphsStaked, remainingWeeklyGlyphs,
  onReset, onSelectHolding, onSetMode,
}: PortfolioPanelProps) {
  const [activeTab, setActiveTab] = useState<'portfolio' | 'history' | 'compete' | 'invest'>('portfolio')
  const [showProModal, setShowProModal] = useState(false)

  const tabs = [
    { key: 'portfolio', label: 'Portefeuille' },
    { key: 'history', label: 'Historique' },
    { key: 'compete', label: '🏆 Classement' },
    { key: 'invest', label: '💰 Investir' },
  ]

  const handleModeClick = (mode: 'beginner' | 'pro') => {
    if (mode === 'pro' && portfolioMode !== 'pro') {
      setShowProModal(true)
    } else if (mode === 'beginner') {
      onSetMode('beginner')
    }
  }

  return (
    <div className="space-y-4">
      {/* Risk warning modal */}
      <AnimatePresence>
        {showProModal && (
          <ProRiskModal
            onConfirm={() => { onSetMode('pro'); setShowProModal(false) }}
            onCancel={() => setShowProModal(false)}
          />
        )}
      </AnimatePresence>

      {/* Mode selector */}
      <div className="flex bg-surface-2 border border-white/5 rounded-xl p-1 gap-1">
        <button
          onClick={() => handleModeClick('beginner')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-colors ${
            portfolioMode === 'beginner'
              ? 'bg-violet-500/20 text-violet-400 border border-violet-500/20'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <Shield size={11} />
          MODE DÉBUTANT
        </button>
        <button
          onClick={() => handleModeClick('pro')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-colors ${
            portfolioMode === 'pro'
              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/20'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <Zap size={11} />
          MODE PRO
        </button>
      </div>

      {/* Mode info banner */}
      {portfolioMode === 'pro' && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-amber-500/5 border border-amber-500/20 rounded-xl px-3 py-2"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Zap size={11} className="text-amber-400" />
              <span className="text-xs font-semibold text-amber-400">MODE PRO activé</span>
            </div>
            <span className="text-xs text-zinc-500">{weeklyGlyphsStaked}/{MAX_WEEKLY_PRO_GLYPHS}⬡ misés cette sem.</span>
          </div>
          <div className="mt-1.5 h-1 bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-500 rounded-full transition-all"
              style={{ width: `${(weeklyGlyphsStaked / MAX_WEEKLY_PRO_GLYPHS) * 100}%` }}
            />
          </div>
        </motion.div>
      )}

      {portfolioMode === 'beginner' && (
        <div className="bg-violet-500/5 border border-violet-500/10 rounded-xl px-3 py-2 text-xs text-zinc-400 leading-relaxed">
          <span className="text-violet-400 font-semibold">MODE DÉBUTANT</span> · Argent fictif uniquement, aucun GLYPH misé. Gagne des GLYPHS si tu atteins le top classement !
        </div>
      )}

      {/* Total card */}
      <motion.div
        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
        className="bg-gradient-to-br from-violet-600/20 to-cyan-600/10 border border-violet-500/20 rounded-2xl p-5"
      >
        <p className="text-xs text-zinc-400 mb-1">Valeur totale</p>
        <p className="text-3xl font-black text-white mb-1">
          €{portfolioTotal.toLocaleString('fr-FR', { maximumFractionDigits: 0 })}
        </p>
        <div className={`flex items-center gap-1.5 text-sm font-semibold mb-3 ${allTimeReturn >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
          {allTimeReturn >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
          {allTimeReturn >= 0 ? '+' : ''}€{allTimeReturn.toFixed(2)} ({allTimeReturnPercent.toFixed(2)}% depuis le début)
        </div>
        <div className="grid grid-cols-3 gap-2 pt-3 border-t border-white/10 text-center">
          <div>
            <p className="text-xs text-zinc-500">Cash dispo</p>
            <p className="text-sm font-bold text-white">€{cash.toFixed(0)}</p>
          </div>
          <div>
            <p className="text-xs text-zinc-500">Investi</p>
            <p className="text-sm font-bold text-white">€{(portfolioTotal - cash).toFixed(0)}</p>
          </div>
          <div>
            <p className="text-xs text-zinc-500">GLYPHS gagnés</p>
            <p className="text-sm font-bold text-violet-400">{totalGlyphsEarned}⬡</p>
          </div>
        </div>
      </motion.div>

      {/* Prométhée comment */}
      {(allTimeReturn !== 0 || holdings.length > 0) && (
        <div className="bg-surface-2 border border-violet-500/20 rounded-2xl p-3 flex gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center shrink-0">
            <Zap size={14} className="text-white" />
          </div>
          <div>
            <p className="text-xs font-semibold text-violet-400 mb-0.5">Prométhée</p>
            <p className="text-xs text-zinc-300 leading-relaxed">
              {allTimeReturn > 500
                ? '🔥 Performance exceptionnelle ! Tu bats la majorité des traders. Continue sur cette lancée.'
                : allTimeReturn > 0
                ? '📈 Bon début ! Ton portefeuille est en territoire positif. Reste diversifié.'
                : allTimeReturn < -500
                ? '⚠️ Attention, tes positions perdent du terrain. Envisage de couper les pertes.'
                : holdings.length === 0
                ? '💡 Tu as €10 000 virtuels à investir. Commence par acheter 1-2 actifs que tu connais bien.'
                : '⏳ Patience, les marchés fluctuent. Une bonne stratégie porte ses fruits sur le long terme.'}
            </p>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex bg-surface-2 border border-white/5 rounded-xl p-1 gap-1 overflow-x-auto">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key as typeof activeTab)}
            className={`flex-1 min-w-fit px-2 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
              activeTab === t.key ? 'bg-violet-500/20 text-violet-400' : 'text-zinc-400 hover:text-white'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        {activeTab === 'portfolio' && (
          <motion.div key="portfolio" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="bg-surface-2 border border-white/5 rounded-2xl overflow-hidden">
            {holdings.length === 0 ? (
              <div className="p-8 text-center">
                <TrendingUp size={28} className="text-zinc-700 mx-auto mb-2" />
                <p className="text-sm text-zinc-400">Aucune position ouverte</p>
                <p className="text-xs text-zinc-600 mt-1">Clique sur un actif pour acheter</p>
              </div>
            ) : (
              <div>
                {holdings.map(h => {
                  const value = h.quantity * h.currentPrice
                  const pnl = (h.currentPrice - h.avgBuyPrice) * h.quantity
                  const pct = ((h.currentPrice - h.avgBuyPrice) / h.avgBuyPrice) * 100
                  return (
                    <div
                      key={h.symbol}
                      onClick={() => onSelectHolding(h.symbol)}
                      className="flex items-center gap-3 px-4 py-3 border-b border-white/5 last:border-0 hover:bg-white/3 cursor-pointer transition-colors"
                    >
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500/20 to-cyan-500/20 flex items-center justify-center text-xs font-bold text-white shrink-0">
                        {h.symbol.slice(0, 2)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-white">{h.symbol}</p>
                        <div className="flex items-center gap-1.5">
                          <p className="text-xs text-zinc-500">{h.quantity} × €{h.currentPrice.toLocaleString('fr-FR', { maximumFractionDigits: 2 })}</p>
                          {portfolioMode === 'pro' && (h.glyphsStaked ?? 0) > 0 && (
                            <span className="text-[9px] font-semibold text-amber-400 bg-amber-500/10 rounded-full px-1.5 py-0.5">
                              {h.glyphsStaked}⬡ misés
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-white">€{value.toFixed(0)}</p>
                        <p className={`text-xs font-semibold ${pnl >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {pnl >= 0 ? '+' : ''}€{pnl.toFixed(2)} ({pct >= 0 ? '+' : ''}{pct.toFixed(1)}%)
                        </p>
                      </div>
                    </div>
                  )
                })}
                <div className="px-4 py-2.5 border-t border-white/5 flex items-center justify-between">
                  <span className="text-xs text-zinc-500">P&L total</span>
                  <span className={`text-sm font-black ${totalPnL >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {totalPnL >= 0 ? '+' : ''}€{totalPnL.toFixed(2)} ({totalPnLPercent.toFixed(1)}%)
                  </span>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'history' && (
          <motion.div key="history" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="bg-surface-2 border border-white/5 rounded-2xl overflow-hidden">
            {transactions.length === 0 ? (
              <div className="p-8 text-center">
                <Clock size={28} className="text-zinc-700 mx-auto mb-2" />
                <p className="text-sm text-zinc-400">Aucune transaction</p>
              </div>
            ) : transactions.map(tx => (
              <div key={tx.id} className="flex items-center gap-3 px-4 py-3 border-b border-white/5 last:border-0">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${tx.type === 'buy' ? 'bg-emerald-500/20' : 'bg-rose-500/20'}`}>
                  {tx.type === 'buy' ? <TrendingUp size={13} className="text-emerald-400" /> : <TrendingDown size={13} className="text-rose-400" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-bold text-white">{tx.type === 'buy' ? 'Achat' : 'Vente'} {tx.symbol}</p>
                  </div>
                  <p className="text-xs text-zinc-500">{tx.quantity} × €{tx.price.toFixed(2)} · {new Date(tx.timestamp).toLocaleDateString('fr-FR')}</p>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-bold ${tx.type === 'buy' ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {tx.type === 'buy' ? '-' : '+'}€{tx.total.toFixed(2)}
                  </p>
                  {tx.pnl !== undefined && (
                    <p className={`text-xs font-semibold ${tx.pnl >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      P&L: {tx.pnl >= 0 ? '+' : ''}€{tx.pnl.toFixed(2)}
                    </p>
                  )}
                  {tx.glyphsDelta !== undefined && tx.glyphsDelta !== 0 && (
                    <p className={`text-xs font-semibold ${tx.glyphsDelta >= 0 ? 'text-amber-400' : 'text-rose-400'}`}>
                      {tx.glyphsDelta >= 0 ? '+' : ''}{tx.glyphsDelta}⬡
                    </p>
                  )}
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {activeTab === 'compete' && (
          <motion.div key="compete" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
            <div className="bg-surface-2 border border-white/5 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <Trophy size={14} className="text-yellow-400" />
                <h3 className="text-sm font-bold text-white">Meilleurs traders ce mois</h3>
              </div>
              {portfolioMode === 'beginner' && (
                <div className="mb-3 bg-violet-500/5 border border-violet-500/10 rounded-xl px-3 py-2 text-xs text-zinc-400">
                  🏆 En MODE DÉBUTANT, les <span className="text-violet-400 font-semibold">top 3 gagnent des GLYPHS</span> chaque semaine : 1er = 500⬡, 2e = 200⬡, 3e = 100⬡
                </div>
              )}
              {MOCK_LEADERBOARD.map((p, i) => (
                <div key={p.name} className={`flex items-center gap-3 py-2.5 border-b border-white/5 last:border-0 ${p.isMe ? 'bg-violet-500/5 -mx-4 px-4 rounded-xl' : ''}`}>
                  <div className="w-6 flex items-center justify-center">
                    {i === 0 ? <Crown size={14} className="text-yellow-400" /> : i === 1 ? <Medal size={14} className="text-zinc-300" /> : <Medal size={14} className="text-amber-600" />}
                  </div>
                  <p className={`flex-1 text-sm font-semibold ${p.isMe ? 'text-violet-400' : 'text-white'}`}>
                    {p.name} {p.isMe && '(toi)'}
                  </p>
                  <p className={`text-sm font-bold ${(p.isMe ? allTimeReturnPercent : p.return) >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    +{p.isMe ? allTimeReturnPercent.toFixed(1) : p.return}%
                  </p>
                </div>
              ))}
            </div>
            <button
              onClick={onReset}
              className="w-full flex items-center justify-center gap-2 py-2.5 border border-white/10 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              <RotateCcw size={12} /> Recommencer avec €10 000
            </button>
          </motion.div>
        )}

        {activeTab === 'invest' && (
          <motion.div key="invest" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
            <div className="bg-surface-2 border border-amber-500/20 rounded-2xl p-3 text-xs text-amber-400/80 leading-relaxed">
              ⚠️ Le portefeuille NEXUS est <strong>100% virtuel</strong>. Pour investir avec de l&apos;argent réel, utilise un broker régulé ci-dessous.
            </div>
            {BROKERS.map(b => (
              <a key={b.name} href={b.url} target="_blank" rel="noopener noreferrer" className="block">
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className={`bg-gradient-to-br ${b.color} border ${b.border} rounded-2xl p-4 flex items-center gap-4 cursor-pointer`}
                >
                  <div className="text-2xl w-10 text-center">{b.flag}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-sm font-bold text-white">{b.name}</p>
                      <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${b.badgeColor}`}>{b.badge}</span>
                    </div>
                    <p className="text-xs text-zinc-400">{b.desc}</p>
                  </div>
                  <ExternalLink size={14} className="text-zinc-500 shrink-0" />
                </motion.div>
              </a>
            ))}
            <p className="text-center text-[10px] text-zinc-600 px-4">
              NEXUS ne perçoit aucune commission. Ces liens sont fournis à titre informatif.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
