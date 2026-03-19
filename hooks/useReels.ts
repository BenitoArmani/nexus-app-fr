'use client'
import { useState, useCallback } from 'react'
import { MOCK_REELS } from '@/lib/mock-data'
import type { Reel } from '@/types'

export function useReels() {
  const [reels, setReels] = useState<Reel[]>(MOCK_REELS)
  const [currentIndex, setCurrentIndex] = useState(0)

  const toggleLike = useCallback((reelId: string) => {
    setReels(prev =>
      prev.map(r => {
        if (r.id !== reelId) return r
        const liked = !r.liked_by_me
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

  return { reels, currentIndex, toggleLike, nextReel, prevReel }
}
