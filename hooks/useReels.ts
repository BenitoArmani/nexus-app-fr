'use client'
import { useState, useCallback, useEffect } from 'react'
import { MOCK_REELS } from '@/lib/mock-data'
import { supabase } from '@/lib/supabase'
import type { Reel } from '@/types'

export function useReels() {
  const [reels, setReels]           = useState<Reel[]>(MOCK_REELS)
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    supabase
      .from('reels')
      .select('*, users:user_id(id, username, full_name, avatar_url, is_verified)')
      .order('created_at', { ascending: false })
      .limit(50)
      .then(({ data }) => {
        if (data && data.length > 0) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const mapped: Reel[] = data.map((r: any) => ({
            id:             r.id,
            user_id:        r.user_id,
            video_url:      r.url ?? r.video_url ?? '',
            thumbnail_url:  r.thumbnail_url ?? null,
            caption:        r.caption ?? '',
            likes:          r.likes_count ?? 0,
            views:          r.views ?? 0,
            earnings:       r.earnings ?? 0,
            liked_by_me:    false,
            user:           r.users ?? undefined,
            created_at:     r.created_at,
          }))
          setReels(mapped)
        }
      })
  }, [])

  const toggleLike = useCallback((reelId: string) => {
    setReels(prev =>
      prev.map(r => {
        if (r.id !== reelId) return r
        const liked = !r.liked_by_me
        supabase
          .from('reels')
          .update({ likes_count: liked ? r.likes + 1 : r.likes - 1 })
          .eq('id', reelId)
          .then(() => {})
        return { ...r, liked_by_me: liked, likes: liked ? r.likes + 1 : r.likes - 1 }
      })
    )
  }, [])

  const nextReel = useCallback(() => {
    setCurrentIndex(i => Math.min(i + 1, reels.length - 1))
  }, [reels.length])

  const prevReel = useCallback(() => {
    setCurrentIndex(i => Math.max(i - 1, 0))
  }, [])

  const addReel = useCallback((reel: Reel) => {
    setReels(prev => [reel, ...prev])
  }, [])

  return { reels, currentIndex, toggleLike, nextReel, prevReel, addReel }
}
