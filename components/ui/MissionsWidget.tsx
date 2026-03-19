'use client'
import { motion } from 'framer-motion'
import { CheckCircle2, Circle } from 'lucide-react'
import { useMissions, Mission } from '@/hooks/useMissions'

export function MissionsWidget({ userId }: { userId: string | null }) {
  const { dailyMissions, weeklyMissions } = useMissions(userId)

  return (
    <div className="bg-surface-2 rounded-2xl p-4 border border-white/5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-white">Missions du jour</h3>
        <span className="text-xs text-zinc-500">
          {dailyMissions.filter(m => m.completed).length}/{dailyMissions.length}
        </span>
      </div>
      <div className="space-y-2">
        {dailyMissions.slice(0, 3).map(m => <MissionRow key={m.id} mission={m} />)}
      </div>
      <div className="mt-3 mb-2">
        <h4 className="text-xs font-semibold text-zinc-400">Missions semaine</h4>
      </div>
      <div className="space-y-2">
        {weeklyMissions.map(m => <MissionRow key={m.id} mission={m} />)}
      </div>
    </div>
  )
}

function MissionRow({ mission }: { mission: Mission }) {
  const progress = Math.min(mission.progress / mission.target_count, 1)
  return (
    <div className="flex items-center gap-2.5">
      <div className="shrink-0">
        {mission.completed
          ? <CheckCircle2 size={16} className="text-emerald-400" />
          : <Circle size={16} className="text-zinc-600" />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <span className={`text-xs font-medium truncate ${mission.completed ? 'text-zinc-500 line-through' : 'text-white'}`}>
            {mission.emoji} {mission.title}
          </span>
          <span className="text-xs text-violet-400 shrink-0 ml-2">+{mission.reward_glyphs}G</span>
        </div>
        {!mission.completed && mission.target_count > 1 && (
          <div className="mt-1 h-1 bg-zinc-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-violet-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress * 100}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
        )}
      </div>
    </div>
  )
}
