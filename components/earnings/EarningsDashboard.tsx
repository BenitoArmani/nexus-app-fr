'use client'
import { motion } from 'framer-motion'
import { Play, Users, Heart, ShoppingBag, TrendingUp, Target, ArrowUpRight } from 'lucide-react'
import { formatEuro } from '@/lib/utils'
import { useEarnings } from '@/hooks/useEarnings'

const SOURCE_CONFIG = {
  reels: { icon: Play, label: 'Reels', color: 'violet', bg: 'bg-violet-500/20', text: 'text-violet-400', border: 'border-violet-500/30' },
  subscriptions: { icon: Users, label: 'Abonnements', color: 'cyan', bg: 'bg-cyan-500/20', text: 'text-cyan-400', border: 'border-cyan-500/30' },
  tips: { icon: Heart, label: 'Tips', color: 'rose', bg: 'bg-rose-500/20', text: 'text-rose-400', border: 'border-rose-500/30' },
  shop: { icon: ShoppingBag, label: 'Boutique', color: 'amber', bg: 'bg-amber-500/20', text: 'text-amber-400', border: 'border-amber-500/30' },
}

export default function EarningsDashboard() {
  const { totalMonth, monthlyGoal, bySource, monthlyData } = useEarnings()
  const progress = Math.min((totalMonth / monthlyGoal) * 100, 100)
  const maxBar = Math.max(...monthlyData.map(d => d.amount))

  return (
    <div className="space-y-6">
      {/* Total + Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-violet-600/20 to-cyan-600/10 border border-violet-500/20 rounded-2xl p-6"
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-sm text-text-muted mb-1">Gains du mois</p>
            <p className="text-4xl font-black text-text-primary">{formatEuro(totalMonth)}</p>
            <div className="flex items-center gap-1 mt-1">
              <ArrowUpRight size={14} className="text-emerald-400" />
              <span className="text-xs text-emerald-400 font-semibold">+18% vs mois dernier</span>
            </div>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-violet-500/20 flex items-center justify-center">
            <TrendingUp size={24} className="text-violet-400" />
          </div>
        </div>

        {/* Progress bar */}
        <div>
          <div className="flex justify-between text-xs text-text-muted mb-2">
            <span className="flex items-center gap-1"><Target size={11} /> Objectif mensuel</span>
            <span className="font-semibold text-text-primary">{formatEuro(totalMonth)} / {formatEuro(monthlyGoal)}</span>
          </div>
          <div className="h-2 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-violet-500 to-cyan-500 rounded-full"
            />
          </div>
          <p className="text-xs text-text-muted mt-1.5">{progress.toFixed(0)}% de l'objectif atteint</p>
        </div>
      </motion.div>

      {/* Sources */}
      <div className="grid grid-cols-2 gap-3">
        {Object.entries(SOURCE_CONFIG).map(([key, config], i) => {
          const amount = bySource[key as keyof typeof bySource]
          const Icon = config.icon
          return (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`${config.bg} border ${config.border} rounded-2xl p-4`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-9 h-9 rounded-xl ${config.bg} border ${config.border} flex items-center justify-center`}>
                  <Icon size={16} className={config.text} />
                </div>
                <ArrowUpRight size={14} className={config.text} />
              </div>
              <p className={`text-xl font-black ${config.text}`}>{formatEuro(amount)}</p>
              <p className="text-xs text-text-muted mt-0.5">{config.label}</p>
            </motion.div>
          )
        })}
      </div>

      {/* Monthly chart */}
      <div className="bg-surface-2 border border-white/5 rounded-2xl p-5">
        <h3 className="text-sm font-bold text-text-primary mb-4">Évolution mensuelle</h3>
        <div className="flex items-end gap-2 h-28">
          {monthlyData.map((d, i) => (
            <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${(d.amount / maxBar) * 100}%` }}
                transition={{ delay: i * 0.1, duration: 0.6, ease: 'easeOut' }}
                className="w-full bg-gradient-to-t from-violet-600 to-violet-400 rounded-t-lg min-h-[4px]"
              />
              <span className="text-[10px] text-text-muted">{d.month}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Subscription plans */}
      <div className="bg-surface-2 border border-white/5 rounded-2xl p-5">
        <h3 className="text-sm font-bold text-text-primary mb-4">Mes offres d'abonnement</h3>
        <div className="space-y-3">
          {[
            { name: 'Supporter', price: 4.99, subs: 8, color: 'text-cyan-400' },
            { name: 'Fan Pro', price: 9.99, subs: 5, color: 'text-violet-400' },
            { name: 'VIP', price: 19.99, subs: 2, color: 'text-amber-400' },
          ].map(plan => (
            <div key={plan.name} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center">
                  <Users size={14} className={plan.color} />
                </div>
                <div>
                  <p className="text-sm font-medium text-text-primary">{plan.name}</p>
                  <p className="text-xs text-text-muted">{plan.subs} abonnés</p>
                </div>
              </div>
              <p className={`text-sm font-bold ${plan.color}`}>{formatEuro(plan.price * plan.subs)}/mois</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
