'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export interface Prediction {
  id: string
  creator_id?: string
  category: string
  categoryEmoji: string
  categoryColor: string
  question: string
  yesPercent: number
  noPercent: number
  totalStaked: number
  totalBettors: number
  endsAt: number
  source: string
  trending?: boolean
  resolved?: boolean
  resolvedTo?: 'yes' | 'no'
}

// Map category names to emoji + color
function categoryMeta(category: string): { categoryEmoji: string; categoryColor: string } {
  const map: Record<string, { categoryEmoji: string; categoryColor: string }> = {
    'Gaming':       { categoryEmoji: '🎮', categoryColor: 'text-red-400'    },
    'Crypto':       { categoryEmoji: '₿',  categoryColor: 'text-amber-400'  },
    'Tech & IA':    { categoryEmoji: '🤖', categoryColor: 'text-cyan-400'   },
    'Géopolitique': { categoryEmoji: '🌍', categoryColor: 'text-blue-400'   },
    'Sport':        { categoryEmoji: '🏆', categoryColor: 'text-yellow-400' },
    'Pop Culture':  { categoryEmoji: '🎬', categoryColor: 'text-pink-400'   },
    'France':       { categoryEmoji: '🇫🇷', categoryColor: 'text-blue-300'  },
    'Finance':      { categoryEmoji: '📈', categoryColor: 'text-emerald-400'},
  }
  return map[category] ?? { categoryEmoji: '🔮', categoryColor: 'text-violet-400' }
}

// Fallback data — shown until real predictions exist in DB
const FALLBACK: Prediction[] = [
  { id: '1', category: 'Gaming',      ...categoryMeta('Gaming'),      question: 'GTA 6 sortira avant fin 2025 ?',                      yesPercent: 78, noPercent: 22, totalStaked: 45230,  totalBettors: 1247, endsAt: new Date('2025-12-31').getTime(), source: 'rockstargames.com', trending: true  },
  { id: '2', category: 'Gaming',      ...categoryMeta('Gaming'),      question: 'GTA 6 sera disponible sur PC à la sortie ?',          yesPercent: 31, noPercent: 69, totalStaked: 18420,  totalBettors: 892,  endsAt: new Date('2025-12-31').getTime(), source: 'rockstargames.com'                 },
  { id: '3', category: 'Crypto',      ...categoryMeta('Crypto'),      question: 'Bitcoin dépassera 200 000$ avant 2026 ?',             yesPercent: 54, noPercent: 46, totalStaked: 128900, totalBettors: 3821, endsAt: new Date('2025-12-31').getTime(), source: 'coinmarketcap.com', trending: true  },
  { id: '4', category: 'Tech & IA',   ...categoryMeta('Tech & IA'),   question: 'OpenAI lancera GPT-5 avant juin 2025 ?',              yesPercent: 67, noPercent: 33, totalStaked: 34500,  totalBettors: 1456, endsAt: new Date('2025-06-01').getTime(), source: 'openai.com'                        },
  { id: '5', category: 'Tech & IA',   ...categoryMeta('Tech & IA'),   question: "Apple lancera ses lunettes AR en 2025 ?",             yesPercent: 42, noPercent: 58, totalStaked: 22100,  totalBettors: 987,  endsAt: new Date('2025-12-31').getTime(), source: 'apple.com'                         },
  { id: '6', category: 'Géopolitique',...categoryMeta('Géopolitique'), question: "La Russie et l'Ukraine signeront un accord en 2025 ?",yesPercent: 18, noPercent: 82, totalStaked: 87400,  totalBettors: 4201, endsAt: new Date('2025-12-31').getTime(), source: 'reuters.com', trending: true       },
  { id: '7', category: 'Sport',       ...categoryMeta('Sport'),       question: 'La France gagnera le Mondial 2026 ?',                 yesPercent: 23, noPercent: 77, totalStaked: 56700,  totalBettors: 2890, endsAt: new Date('2026-07-15').getTime(), source: 'fifa.com'                          },
  { id: '8', category: 'Sport',       ...categoryMeta('Sport'),       question: 'Mbappé marquera 30 buts cette saison ?',              yesPercent: 61, noPercent: 39, totalStaked: 31200,  totalBettors: 1543, endsAt: new Date('2025-06-01').getTime(), source: 'realmadrid.com'                    },
  { id: '9', category: 'Pop Culture', ...categoryMeta('Pop Culture'), question: "Qui gagnera l'Oscar du meilleur film 2026 ?",         yesPercent: 45, noPercent: 55, totalStaked: 14300,  totalBettors: 672,  endsAt: new Date('2026-03-01').getTime(), source: 'oscars.org'                        },
  { id: '10',category: 'France',      ...categoryMeta('France'),      question: 'Le prix du pain dépassera 2€ la baguette en 2025 ?',  yesPercent: 71, noPercent: 29, totalStaked: 9800,   totalBettors: 621,  endsAt: new Date('2025-12-31').getTime(), source: 'insee.fr'                          },
]

export function usePredictions() {
  const [predictions, setPredictions] = useState<Prediction[]>(FALLBACK)

  useEffect(() => {
    supabase
      .from('predictions')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (data && data.length > 0 && !error) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const mapped: Prediction[] = data.map((p: any) => {
            const meta = categoryMeta(p.category ?? 'Général')
            return {
            id:            p.id,
            creator_id:    p.creator_id,
            category:      p.category ?? 'Général',
            categoryEmoji: meta.categoryEmoji,
            categoryColor: meta.categoryColor,
            question:      p.question,
            yesPercent:   p.yes_percent ?? 50,
            noPercent:    p.no_percent  ?? 50,
            totalStaked:  p.total_staked   ?? 0,
            totalBettors: p.total_bettors  ?? 0,
            endsAt:       new Date(p.ends_at).getTime(),
            source:       p.source ?? '',
            trending:     p.trending ?? false,
            resolved:     p.status === 'resolved',
            resolvedTo:   p.resolved_to ?? undefined,
          }})
          setPredictions(mapped)
        }
        // Table not yet created or empty → keep fallback data
      })
  }, [])

  const placeBet = async (predictionId: string, side: 'yes' | 'no', amount: number) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    // Optimistic local update
    setPredictions(prev => prev.map(p => {
      if (p.id !== predictionId) return p
      const total = p.totalStaked + amount
      const yesPart = side === 'yes' ? p.yesPercent * p.totalStaked + amount : p.yesPercent * p.totalStaked
      const noPart  = side === 'no'  ? p.noPercent  * p.totalStaked + amount : p.noPercent  * p.totalStaked
      return {
        ...p,
        totalStaked:  total,
        totalBettors: p.totalBettors + 1,
        yesPercent: Math.round((yesPart / total) * 100),
        noPercent:  Math.round((noPart  / total) * 100),
      }
    }))

    // Persist — fire-and-forget
    supabase.from('prediction_bets').upsert(
      { prediction_id: predictionId, user_id: user.id, side, amount },
      { onConflict: 'prediction_id,user_id' }
    ).then(() => {})
  }

  return { predictions, placeBet }
}
