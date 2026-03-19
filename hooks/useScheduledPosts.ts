'use client'
import { useState, useCallback } from 'react'
import type { ScheduledPost } from '@/types'

const KEY = 'nexus_scheduled_posts'

export function useScheduledPosts() {
  const load = (): ScheduledPost[] => {
    if (typeof window === 'undefined') return []
    return JSON.parse(localStorage.getItem(KEY) || '[]')
  }

  const [posts, setPosts] = useState<ScheduledPost[]>(load)

  const schedulePost = useCallback((content: string, scheduledAt: string) => {
    const newPost: ScheduledPost = {
      id: Date.now().toString(),
      content,
      media_url: null,
      scheduled_at: scheduledAt,
      status: 'pending',
    }
    const updated = [...load(), newPost].sort((a, b) => new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime())
    localStorage.setItem(KEY, JSON.stringify(updated))
    setPosts(updated)
    return newPost
  }, [])

  const cancelPost = useCallback((id: string) => {
    const updated = load().map(p => p.id === id ? { ...p, status: 'cancelled' as const } : p)
    localStorage.setItem(KEY, JSON.stringify(updated))
    setPosts(updated)
  }, [])

  const refresh = useCallback(() => setPosts(load()), [])

  return { posts, schedulePost, cancelPost, refresh }
}
