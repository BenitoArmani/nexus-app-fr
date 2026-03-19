'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { BarChart2, TrendingUp, Eye, Heart, Users, ArrowUpRight } from 'lucide-react'
import { formatNumber, formatEuro } from '@/lib/utils'

const VIEWS_DATA = [
  { day: 'Lun', views: 1200 }, { day: 'Mar', views: 2400 }, { day: 'Mer', views: 1800 },
  { day: 'Jeu', views: 3600 }, { day: 'Ven', views: 4200 }, { day: 'Sam', views: 5800 }, { day: 'Dim', views: 3200 },
]
const maxViews = Math.max(...VIEWS_DATA.map(d => d.views))

const TOP_POSTS = [
  { title: 'Morning routine...', views: 12400, likes: 1842, engagement: 14.9, revenue: 62.0 },
  { title: 'Mon setup dev...', views: 28900, likes: 3210, engagement: 11.1, revenue: 144.5 },
  { title: 'Nouveau single...', views: 45200, likes: 5680, engagement: 12.6, revenue: 226.0 },
]

const TRAFFIC_SOURCES = [
  { label: 'Recommandation', pct: 45, color: 'bg-violet-500' },
  { label: 'Recherche', pct: 28, color: 'bg-cyan-500' },
  { label: 'Partage externe', pct: 17, color: 'bg-rose-500' },
  { label: 'Direct', pct: 10, color: 'bg-amber-500' },
]

const BEST_HOURS = [
  { hour: '06h', score: 20 }, { hour: '09h', score: 55 }, { hour: '12h', score: 80 },
  { hour: '15h', score: 60 }, { hour: '18h', score: 95 }, { hour: '21h', score: 70 }, { hour: '23h', score: 30 },
]

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<'7j' | '30j' | '90j'>('7j')

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-text-primary flex items-center gap-2">
            <BarChart2 size={22} className="text-cyan-400" /> Analytics
          </h1>
          <p className="text-text-muted text-sm mt-0.5">Performances détaillées de ton contenu</p>
        </div>
        <div className="flex gap-2">
          {(['7j', '30j', '90j'] as const).map(p => (
            <button key={p} onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-colors ${period === p ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'text-text-muted hover:bg-white/5'}`}>
              {p}
            </button>
          ))}
        </div>
      </motion.div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { icon: Eye, label: 'Vues totales', value: '94.2K', change: '+23%', color: 'text-cyan-400', bg: 'bg-cyan-500/20' },
          { icon: Heart, label: 'Likes', value: '10.7K', change: '+18%', color: 'text-rose-400', bg: 'bg-rose-500/20' },
          { icon: Users, label: 'Nouveaux abonnés', value: '284', change: '+12%', color: 'text-violet-400', bg: 'bg-violet-500/20' },
          { icon: TrendingUp, label: 'Revenus', value: '292€', change: '+18%', color: 'text-emerald-400', bg: 'bg-emerald-500/20' },
        ].map((kpi, i) => (
          <motion.div key={kpi.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className="bg-surface-2 border border-white/5 rounded-2xl p-4">
            <div className={`w-9 h-9 rounded-xl ${kpi.bg} flex items-center justify-center mb-3`}>
              <kpi.icon size={16} className={kpi.color} />
            </div>
            <p className="text-xl font-black text-text-primary">{kpi.value}</p>
            <p className="text-xs text-text-muted">{kpi.label}</p>
            <div className="flex items-center gap-1 mt-1">
              <ArrowUpRight size={11} className="text-emerald-400" />
              <span className="text-xs text-emerald-400 font-semibold">{kpi.change}</span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Views chart */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
          className="bg-surface-2 border border-white/5 rounded-2xl p-5">
          <h3 className="text-sm font-bold text-text-primary mb-4">Vues par jour</h3>
          <div className="flex items-end gap-2 h-28">
            {VIEWS_DATA.map((d, i) => (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(d.views / maxViews) * 100}%` }}
                  transition={{ delay: 0.4 + i * 0.08, duration: 0.5, ease: 'easeOut' }}
                  className="w-full bg-gradient-to-t from-cyan-600 to-cyan-400 rounded-t-lg min-h-[4px]"
                />
                <span className="text-[10px] text-text-muted">{d.day}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Traffic sources */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
          className="bg-surface-2 border border-white/5 rounded-2xl p-5">
          <h3 className="text-sm font-bold text-text-primary mb-4">Sources de trafic</h3>
          <div className="space-y-3">
            {TRAFFIC_SOURCES.map((src, i) => (
              <div key={src.label}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-text-secondary">{src.label}</span>
                  <span className="text-text-primary font-semibold">{src.pct}%</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${src.pct}%` }}
                    transition={{ delay: 0.5 + i * 0.1, duration: 0.6, ease: 'easeOut' }}
                    className={`h-full ${src.color} rounded-full`}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Best hour */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
        className="bg-surface-2 border border-white/5 rounded-2xl p-5 mb-6">
        <h3 className="text-sm font-bold text-text-primary mb-1">Meilleure heure pour poster</h3>
        <p className="text-xs text-text-muted mb-4">Basé sur l&apos;engagement de ton audience</p>
        <div className="flex items-end gap-2 h-16">
          {BEST_HOURS.map((h, i) => (
            <div key={h.hour} className="flex-1 flex flex-col items-center gap-1">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${h.score}%` }}
                transition={{ delay: 0.7 + i * 0.07, duration: 0.5 }}
                className={`w-full rounded-t-lg min-h-[3px] ${h.score === 95 ? 'bg-amber-500' : 'bg-violet-500/50'}`}
              />
              <span className="text-[9px] text-text-muted">{h.hour}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-amber-400 font-semibold mt-2">⭐ Meilleur créneau : 18h00</p>
      </motion.div>

      {/* Top posts */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
        className="bg-surface-2 border border-white/5 rounded-2xl overflow-hidden">
        <div className="px-5 py-3 border-b border-white/5">
          <h3 className="text-sm font-bold text-text-primary">Top posts</h3>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-text-muted border-b border-white/5">
              <th className="text-left px-5 py-2">Post</th>
              <th className="px-3 py-2">Vues</th>
              <th className="px-3 py-2">Likes</th>
              <th className="px-3 py-2">Engage.</th>
              <th className="px-3 py-2 text-right">Revenus</th>
            </tr>
          </thead>
          <tbody>
            {TOP_POSTS.map((post, i) => (
              <tr key={i} className="border-b border-white/5 last:border-0 hover:bg-white/[0.03]">
                <td className="px-5 py-3 text-text-primary font-medium truncate max-w-[150px]">{post.title}</td>
                <td className="px-3 py-3 text-center text-text-secondary">{formatNumber(post.views)}</td>
                <td className="px-3 py-3 text-center text-text-secondary">{formatNumber(post.likes)}</td>
                <td className="px-3 py-3 text-center">
                  <span className={`text-xs font-bold ${post.engagement > 12 ? 'text-emerald-400' : 'text-amber-400'}`}>{post.engagement}%</span>
                </td>
                <td className="px-3 py-3 text-right text-emerald-400 font-bold">{formatEuro(post.revenue)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </div>
  )
}
