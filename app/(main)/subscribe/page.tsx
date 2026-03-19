'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, Lock, Map, Zap, Users } from 'lucide-react'
import Link from 'next/link'
import { SUBSCRIPTION_PLANS } from '@/lib/stripe'

const MOCK_MEMBERS = 312

export default function SubscribePage() {
  const [selected, setSelected] = useState<string | null>(null)
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly')

  const discount = billing === 'yearly' ? 0.8 : 1

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 rounded-full px-4 py-1.5 mb-4"
        >
          <Zap size={13} className="text-violet-400" />
          <span className="text-xs font-semibold text-violet-400">Abonnements Créateur</span>
        </motion.div>
        <h1 className="text-3xl font-black text-white mb-2">Soutiens tes créateurs</h1>
        <p className="text-zinc-400 text-sm max-w-md mx-auto">
          Accède à du contenu exclusif, des salons privés et des GLYPHS mensuels.
          De nouvelles fonctionnalités s'ouvrent au fur et à mesure que la communauté grandit.
        </p>

        {/* Member progress teaser */}
        <Link href="/roadmap">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="mt-4 inline-flex items-center gap-2 bg-zinc-800/60 border border-white/5 rounded-2xl px-4 py-2 cursor-pointer hover:bg-zinc-800 transition-colors"
          >
            <Users size={13} className="text-cyan-400" />
            <span className="text-xs text-zinc-400">
              <span className="text-white font-bold">{MOCK_MEMBERS}</span> membres ·{' '}
              <span className="text-cyan-400">500 membres</span> pour débloquer le streaming
            </span>
            <Map size={12} className="text-zinc-500" />
          </motion.div>
        </Link>
      </div>

      {/* Billing toggle */}
      <div className="flex justify-center mb-8">
        <div className="flex bg-zinc-800/60 rounded-2xl p-1 gap-1">
          {(['monthly', 'yearly'] as const).map(b => (
            <button
              key={b}
              onClick={() => setBilling(b)}
              className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all ${
                billing === b
                  ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/20'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              {b === 'monthly' ? 'Mensuel' : 'Annuel'}
              {b === 'yearly' && (
                <span className="ml-1.5 text-[10px] bg-emerald-500/20 text-emerald-400 rounded-full px-1.5 py-0.5">
                  -20%
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Plans */}
      <div className="space-y-4">
        {SUBSCRIPTION_PLANS.map((plan, i) => {
          const isSelected = selected === plan.id
          const price = (plan.price * discount).toFixed(2)

          return (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              onClick={() => setSelected(plan.id)}
              className={`relative rounded-2xl border p-5 cursor-pointer transition-all ${
                isSelected
                  ? 'border-violet-500/60 bg-violet-500/8'
                  : 'border-white/8 bg-zinc-900/50 hover:border-white/15'
              }`}
            >
              {plan.id === 'pro' && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-violet-600 to-cyan-500 text-white text-[10px] font-black px-3 py-1 rounded-full">
                  POPULAIRE
                </div>
              )}

              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl">{plan.badge}</span>
                    <h2 className="text-lg font-black text-white">{plan.name}</h2>
                  </div>

                  {/* Included features */}
                  <ul className="space-y-1.5 mt-3">
                    {plan.features.map(f => (
                      <li key={f} className="flex items-start gap-2 text-sm text-zinc-300">
                        <Check size={14} className="mt-0.5 flex-shrink-0" style={{ color: plan.color }} />
                        {f}
                      </li>
                    ))}
                  </ul>

                  {/* Coming soon */}
                  {plan.comingSoon.length > 0 && (
                    <ul className="space-y-1.5 mt-3 pt-3 border-t border-white/5">
                      {plan.comingSoon.map(f => (
                        <li key={f} className="flex items-start gap-2 text-sm text-zinc-500">
                          <Lock size={13} className="mt-0.5 flex-shrink-0 text-zinc-600" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="text-right flex-shrink-0">
                  <p className="text-2xl font-black text-white">{price}€</p>
                  <p className="text-xs text-zinc-500">/ mois</p>
                  {billing === 'yearly' && (
                    <p className="text-[10px] text-zinc-600 line-through mt-0.5">{plan.price.toFixed(2)}€</p>
                  )}
                </div>
              </div>

              {/* Selected indicator */}
              {isSelected && (
                <motion.div
                  layoutId="plan-selected"
                  className="absolute inset-0 rounded-2xl border-2 pointer-events-none"
                  style={{ borderColor: plan.color + '60' }}
                />
              )}
            </motion.div>
          )
        })}
      </div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-6 space-y-3"
      >
        <button
          disabled={!selected}
          className={`w-full py-4 rounded-2xl font-bold text-white text-base transition-all ${
            selected
              ? 'bg-gradient-to-r from-violet-600 to-cyan-500 hover:opacity-90 shadow-lg shadow-violet-500/20'
              : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
          }`}
        >
          {selected
            ? `Continuer avec ${SUBSCRIPTION_PLANS.find(p => p.id === selected)?.name}`
            : 'Choisir un plan'}
        </button>

        <p className="text-center text-xs text-zinc-600">
          Annulation à tout moment · Pas d'engagement · Paiement sécurisé
        </p>
      </motion.div>

      {/* Roadmap callout */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-8 p-4 rounded-2xl bg-gradient-to-r from-violet-500/10 to-cyan-500/10 border border-white/5"
      >
        <div className="flex items-center gap-3">
          <Map size={20} className="text-violet-400 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-white">Les fonctionnalités arrivent avec la croissance</p>
            <p className="text-xs text-zinc-400 mt-0.5">
              Le streaming, la marketplace et bien plus se débloquent selon le nombre de membres.{' '}
              <Link href="/roadmap" className="text-violet-400 hover:underline">Voir la roadmap →</Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
