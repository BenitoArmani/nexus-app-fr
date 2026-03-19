'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, TrendingUp, TrendingDown, ShoppingCart, ArrowDownLeft, AlertCircle, Zap } from 'lucide-react'
import type { StockQuote } from '@/types'

interface BuyModalProps {
  quote: StockQuote | null
  onClose: () => void
  cash: number
  holding?: { quantity: number; avgBuyPrice: number; glyphsStaked?: number }
  onBuy: (symbol: string, name: string, price: number, quantity: number, type: 'stock' | 'crypto', glyphsStake?: number) => void
  onSell: (symbol: string, price: number, quantity: number) => void
  currency: string
  portfolioMode?: 'beginner' | 'pro'
  remainingWeeklyGlyphs?: number
  glyphsBalance?: number
}

export function BuyModal({
  quote, onClose, cash, holding, onBuy, onSell, currency,
  portfolioMode = 'beginner', remainingWeeklyGlyphs = 1000, glyphsBalance = 0,
}: BuyModalProps) {
  const [tradeMode, setTradeMode] = useState<'buy' | 'sell'>('buy')
  const [amount, setAmount] = useState('')
  const [glyphStakeInput, setGlyphStakeInput] = useState('10')
  const [done, setDone] = useState(false)

  if (!quote) return null

  const price = quote.price
  const qty = parseFloat(amount) || 0
  const total = qty * price
  const maxBuyQty = Math.floor(cash / price * 100) / 100
  const maxSellQty = holding?.quantity ?? 0
  const pnlIfSell = holding ? (price - holding.avgBuyPrice) * qty : 0
  const isUp = quote.changePercent >= 0
  const sym = quote.type === 'crypto' ? '$' : currency

  const isProMode = portfolioMode === 'pro'
  const glyphStake = isProMode && tradeMode === 'buy' ? (parseInt(glyphStakeInput) || 0) : 0
  const glyphStakeValid = !isProMode || tradeMode !== 'buy' ||
    (glyphStake >= 1 && glyphStake <= remainingWeeklyGlyphs && glyphStake <= glyphsBalance)

  // Estimated GLYPH gain/loss if selling in PRO mode
  const stakeForSell = holding?.glyphsStaked
    ? Math.floor(holding.glyphsStaked * (qty / (maxSellQty || 1)))
    : 0
  const proGlyphsIfSell = isProMode && holding
    ? (pnlIfSell > 0 ? stakeForSell + Math.floor(pnlIfSell / 10) : pnlIfSell < 0 ? -stakeForSell : stakeForSell)
    : 0

  const execute = () => {
    if (qty <= 0) return
    if (tradeMode === 'buy') {
      if (total > cash) return
      if (isProMode && !glyphStakeValid) return
      onBuy(quote.symbol, quote.name, price, qty, quote.type, isProMode ? glyphStake : 0)
    } else {
      if (qty > maxSellQty) return
      onSell(quote.symbol, price, qty)
    }
    setDone(true)
    setTimeout(() => { setDone(false); setAmount(''); setGlyphStakeInput('10'); onClose() }, 1500)
  }

  return (
    <AnimatePresence>
      {quote && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.8)' }}
          onClick={e => { if (e.target === e.currentTarget) onClose() }}
        >
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            className="bg-surface-2 border border-white/10 rounded-3xl w-full max-w-sm overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/20 to-cyan-500/20 flex items-center justify-center font-bold text-sm text-white">
                  {quote.symbol.slice(0, 2)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-white">{quote.symbol}</p>
                    {isProMode && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400">MODE PRO</span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-400">{quote.name}</p>
                </div>
              </div>
              <button onClick={onClose} className="w-7 h-7 rounded-lg hover:bg-white/5 flex items-center justify-center text-zinc-400">
                <X size={14} />
              </button>
            </div>

            <div className="p-5 space-y-4">
              {/* Price */}
              <div className="flex items-center justify-between">
                <span className="text-2xl font-black text-white">
                  {sym}{price >= 1000 ? price.toLocaleString('fr-FR', { maximumFractionDigits: 0 }) : price.toLocaleString('fr-FR', { maximumFractionDigits: 2 })}
                </span>
                <span className={`flex items-center gap-1 text-sm font-semibold ${isUp ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {isUp ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
                  {isUp ? '+' : ''}{quote.changePercent.toFixed(2)}%
                </span>
              </div>

              {/* Buy/Sell toggle */}
              <div className="flex bg-surface-3 rounded-xl p-1 gap-1">
                {(['buy', 'sell'] as const).map(m => (
                  <button
                    key={m}
                    onClick={() => { setTradeMode(m); setAmount('') }}
                    className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors ${tradeMode === m ? (m === 'buy' ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white') : 'text-zinc-400 hover:text-white'}`}
                  >
                    {m === 'buy' ? '📈 Acheter' : '📉 Vendre'}
                  </button>
                ))}
              </div>

              {/* Quantity input */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs text-zinc-400 font-medium">Quantité</label>
                  <span className="text-xs text-zinc-500">
                    {tradeMode === 'buy' ? `Max: ${maxBuyQty}` : `Détenu: ${maxSellQty}`}
                  </span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="number" min="0"
                    step={quote.type === 'crypto' ? '0.001' : '1'}
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    placeholder="0"
                    className="flex-1 bg-surface-3 border border-white/5 rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-violet-500/50"
                  />
                  <button
                    onClick={() => setAmount(String(tradeMode === 'buy' ? maxBuyQty : maxSellQty))}
                    className="px-3 py-2 bg-surface-3 border border-white/5 rounded-xl text-xs font-semibold text-violet-400 hover:bg-violet-500/10 transition-colors"
                  >
                    MAX
                  </button>
                </div>
              </div>

              {/* Quick amounts for buy */}
              {tradeMode === 'buy' && (
                <div className="flex gap-2">
                  {[100, 500, 1000].map(euros => {
                    const q = Math.floor((euros / price) * 1000) / 1000
                    return (
                      <button
                        key={euros}
                        onClick={() => setAmount(String(q))}
                        disabled={euros > cash}
                        className="flex-1 py-1.5 bg-surface-3 border border-white/5 rounded-xl text-xs text-zinc-400 hover:text-white hover:bg-white/5 disabled:opacity-30 transition-colors"
                      >
                        €{euros}
                      </button>
                    )
                  })}
                </div>
              )}

              {/* PRO mode GLYPH stake (buy only) */}
              {isProMode && tradeMode === 'buy' && (
                <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Zap size={12} className="text-amber-400" />
                      <span className="text-xs font-semibold text-amber-400">GLYPHS misés (MODE PRO)</span>
                    </div>
                    <span className="text-xs text-zinc-500">Restant : {remainingWeeklyGlyphs}G/sem.</span>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="number" min="1" max={Math.min(remainingWeeklyGlyphs, glyphsBalance)}
                      value={glyphStakeInput}
                      onChange={e => setGlyphStakeInput(e.target.value)}
                      className="flex-1 bg-surface-3 border border-white/5 rounded-xl px-3 py-2 text-sm text-amber-400 placeholder:text-zinc-600 focus:outline-none focus:border-amber-500/50"
                    />
                    <span className="flex items-center text-xs text-zinc-500 px-2">⬡ GLYPHS</span>
                  </div>
                  <p className="text-[10px] text-zinc-500 leading-relaxed">
                    Si profit → tu récupères {glyphStake}⬡ + gains. Si perte → tu perds {glyphStake}⬡.
                  </p>
                </div>
              )}

              {/* Summary */}
              {qty > 0 && (
                <div className="bg-surface-3 rounded-xl p-3 space-y-1.5">
                  <div className="flex justify-between text-xs text-zinc-400">
                    <span>Quantité</span>
                    <span className="text-white font-medium">{qty}</span>
                  </div>
                  <div className="flex justify-between text-xs text-zinc-400">
                    <span>Prix unitaire</span>
                    <span className="text-white font-medium">{sym}{price.toLocaleString('fr-FR', { maximumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between text-xs font-semibold border-t border-white/5 pt-1.5">
                    <span className="text-zinc-300">Total</span>
                    <span className="text-white">{sym}{total.toLocaleString('fr-FR', { maximumFractionDigits: 2 })}</span>
                  </div>
                  {isProMode && tradeMode === 'buy' && glyphStake > 0 && (
                    <div className="flex justify-between text-xs font-semibold text-amber-400">
                      <span>GLYPHS misés</span>
                      <span>-{glyphStake}⬡</span>
                    </div>
                  )}
                  {tradeMode === 'sell' && holding && qty > 0 && (
                    <div className={`flex justify-between text-xs font-semibold ${pnlIfSell >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      <span>P&L estimé</span>
                      <span>{pnlIfSell >= 0 ? '+' : ''}{sym}{pnlIfSell.toFixed(2)}</span>
                    </div>
                  )}
                  {isProMode && tradeMode === 'sell' && stakeForSell > 0 && (
                    <div className={`flex justify-between text-xs font-semibold ${proGlyphsIfSell >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      <span>GLYPHS estimés</span>
                      <span>{proGlyphsIfSell >= 0 ? '+' : ''}{proGlyphsIfSell}⬡</span>
                    </div>
                  )}
                </div>
              )}

              {/* Warnings */}
              {tradeMode === 'buy' && qty > 0 && total > cash && (
                <div className="flex items-center gap-2 text-rose-400 text-xs">
                  <AlertCircle size={12} />
                  Cash insuffisant (disponible: €{cash.toFixed(2)})
                </div>
              )}
              {tradeMode === 'sell' && qty > maxSellQty && (
                <div className="flex items-center gap-2 text-rose-400 text-xs">
                  <AlertCircle size={12} />
                  Quantité insuffisante en portefeuille
                </div>
              )}
              {isProMode && tradeMode === 'buy' && glyphStake > remainingWeeklyGlyphs && (
                <div className="flex items-center gap-2 text-amber-400 text-xs">
                  <AlertCircle size={12} />
                  Limite hebdomadaire atteinte ({remainingWeeklyGlyphs}G restants cette semaine)
                </div>
              )}
              {isProMode && tradeMode === 'buy' && glyphStake > glyphsBalance && (
                <div className="flex items-center gap-2 text-amber-400 text-xs">
                  <AlertCircle size={12} />
                  GLYPHS insuffisants (tu as {glyphsBalance}G)
                </div>
              )}

              {/* Execute button */}
              {!done ? (
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={execute}
                  disabled={
                    qty <= 0 ||
                    (tradeMode === 'buy' && total > cash) ||
                    (tradeMode === 'sell' && qty > maxSellQty) ||
                    (isProMode && tradeMode === 'buy' && !glyphStakeValid)
                  }
                  className={`w-full py-3.5 font-bold text-base rounded-2xl transition-all disabled:opacity-40 flex items-center justify-center gap-2 ${
                    tradeMode === 'buy'
                      ? 'bg-emerald-500 hover:bg-emerald-400 text-white'
                      : 'bg-rose-500 hover:bg-rose-400 text-white'
                  }`}
                >
                  {tradeMode === 'buy' ? <ShoppingCart size={16} /> : <ArrowDownLeft size={16} />}
                  {tradeMode === 'buy' ? "Confirmer l'achat" : 'Confirmer la vente'}
                  {isProMode && tradeMode === 'buy' && glyphStake > 0 && ` (−${glyphStake}⬡)`}
                </motion.button>
              ) : (
                <div className="w-full py-3.5 text-center font-bold text-base rounded-2xl bg-violet-500/20 text-violet-400">
                  ✓ Ordre {tradeMode === 'buy' ? 'acheté' : 'vendu'} !
                  {isProMode && tradeMode === 'buy' && glyphStake > 0 && ` · −${glyphStake}⬡ misés`}
                </div>
              )}

              <p className="text-center text-[10px] text-zinc-600">
                {isProMode
                  ? '⚠️ MODE PRO · Les GLYPHS misés sont réellement engagés'
                  : 'Portefeuille virtuel uniquement — pas d\'argent réel impliqué'}
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
