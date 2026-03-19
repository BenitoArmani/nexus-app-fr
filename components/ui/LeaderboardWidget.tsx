'use client'
import { useState, useEffect } from 'react'
import { Trophy, Crown, Medal } from 'lucide-react'
import { supabase } from '@/lib/supabase'

const DEMO_LEADERS = [
  { user_id: '1', username: 'PromethéeFan', avatar_url: null, glyphs_earned: 12500, rank_position: 1 },
  { user_id: '2', username: 'NexusLégende', avatar_url: null, glyphs_earned: 8200, rank_position: 2 },
  { user_id: '3', username: 'CréateurViral', avatar_url: null, glyphs_earned: 6100, rank_position: 3 },
  { user_id: '4', username: 'GlyphHunter', avatar_url: null, glyphs_earned: 4300, rank_position: 4 },
  { user_id: '5', username: 'StreamQueen', avatar_url: null, glyphs_earned: 3800, rank_position: 5 },
]

interface Leader { user_id: string; username: string; avatar_url: string | null; glyphs_earned: number; rank_position: number }

export function LeaderboardWidget() {
  const [leaders, setLeaders] = useState<Leader[]>(DEMO_LEADERS)

  useEffect(() => {
    const weekStart = getWeekStart()
    supabase.from('leaderboard_entries')
      .select('*, users:user_id(username, avatar_url)')
      .eq('week_start', weekStart)
      .order('glyphs_earned', { ascending: false })
      .limit(10)
      .then(({ data }) => {
        if (data && data.length > 0) {
          setLeaders(data.map((d: any, i: number) => ({
            user_id: d.user_id,
            username: d.users?.username ?? 'user',
            avatar_url: d.users?.avatar_url ?? null,
            glyphs_earned: d.glyphs_earned,
            rank_position: i + 1
          })))
        }
      })
  }, [])

  return (
    <div className="bg-surface-2 rounded-2xl p-4 border border-white/5">
      <div className="flex items-center gap-2 mb-3">
        <Trophy size={14} className="text-yellow-400" />
        <h3 className="text-sm font-semibold text-white">Top semaine</h3>
      </div>
      <div className="space-y-2">
        {leaders.map(e => (
          <div key={e.user_id} className={`flex items-center gap-2.5 p-1.5 rounded-xl ${e.rank_position <= 3 ? 'bg-white/5' : ''}`}>
            <div className="w-5 flex items-center justify-center">
              {e.rank_position === 1 ? <Crown size={14} className="text-yellow-400" /> :
               e.rank_position === 2 ? <Medal size={14} className="text-zinc-300" /> :
               e.rank_position === 3 ? <Medal size={14} className="text-amber-600" /> :
               <span className="text-xs text-zinc-500">{e.rank_position}</span>}
            </div>
            <div className="w-6 h-6 rounded-full bg-violet-500/30 flex items-center justify-center text-xs font-bold text-violet-300">
              {e.username[0]?.toUpperCase()}
            </div>
            <span className="flex-1 text-xs font-medium text-white truncate">{e.username}</span>
            <div className="text-right">
              <div className="text-xs font-bold text-violet-400">{e.glyphs_earned.toLocaleString()}G</div>
              {e.rank_position === 1 && <div className="text-[10px] text-yellow-400">5000G</div>}
              {e.rank_position === 2 && <div className="text-[10px] text-zinc-300">2000G</div>}
              {e.rank_position === 3 && <div className="text-[10px] text-amber-600">1000G</div>}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3 text-xs text-zinc-500 text-center">Reset chaque lundi</div>
    </div>
  )
}

function getWeekStart(): string {
  const d = new Date()
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  const monday = new Date(d)
  monday.setDate(diff)
  return monday.toISOString().split('T')[0]
}
