'use client'
import { motion } from 'framer-motion'
import { CreditCard, Zap, ExternalLink } from 'lucide-react'
import EarningsDashboard from '@/components/earnings/EarningsDashboard'
import Button from '@/components/ui/Button'
import { SUBSCRIPTION_PLANS } from '@/lib/stripe'
import { formatEuro } from '@/lib/utils'

export default function EarningsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-text-primary">Mes Gains</h1>
          <p className="text-text-muted text-sm mt-0.5">Suivez vos revenus et gérez vos abonnements</p>
        </div>
        <Button variant="outline" size="sm">
          <CreditCard size={14} /> Retirer les fonds
        </Button>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Dashboard */}
        <div className="lg:col-span-2">
          <EarningsDashboard />
        </div>

        {/* Subscription plans */}
        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
            className="bg-surface-2 border border-white/5 rounded-2xl p-5"
          >
            <div className="flex items-center gap-2 mb-4">
              <Zap size={16} className="text-violet-400" fill="currentColor" />
              <h3 className="text-sm font-bold text-text-primary">Offres créateur</h3>
            </div>
            <p className="text-xs text-text-muted mb-4">Proposez des abonnements à votre communauté</p>

            <div className="space-y-3">
              {SUBSCRIPTION_PLANS.map((plan, i) => (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * i }}
                  className={`relative border rounded-2xl p-4 cursor-pointer transition-all hover:border-violet-500/50 ${
                    plan.id === 'pro'
                      ? 'border-violet-500/50 bg-violet-500/10'
                      : 'border-white/10 hover:bg-white/3'
                  }`}
                >
                  {plan.id === 'pro' && (
                    <span className="absolute -top-2 left-4 bg-violet-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      POPULAIRE
                    </span>
                  )}
                  <div className="flex items-start justify-between mb-2">
                    <p className="text-sm font-bold text-text-primary">{plan.name}</p>
                    <p className="text-sm font-black text-violet-400">{formatEuro(plan.price)}<span className="text-[10px] text-text-muted font-normal">/mois</span></p>
                  </div>
                  <ul className="space-y-1">
                    {plan.features.map(f => (
                      <li key={f} className="text-xs text-text-muted flex items-center gap-1.5">
                        <span className="text-violet-400">✓</span> {f}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>

            <Button className="w-full mt-4" size="sm">
              Configurer avec Stripe <ExternalLink size={12} />
            </Button>
          </motion.div>

          {/* Stripe payout */}
          <motion.div
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}
            className="bg-surface-2 border border-white/5 rounded-2xl p-5"
          >
            <h3 className="text-sm font-bold text-text-primary mb-2">Virement bancaire</h3>
            <p className="text-xs text-text-muted mb-4">Connectez votre compte bancaire via Stripe Connect pour recevoir vos paiements automatiquement.</p>
            <Button variant="secondary" size="sm" className="w-full">
              Connecter Stripe <ExternalLink size={12} />
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
