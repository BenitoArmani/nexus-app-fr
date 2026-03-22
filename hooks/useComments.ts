'use client'
import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { Comment } from '@/types'

export function useComments(postId: string | null) {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(false)

  const fetchComments = useCallback(async () => {
    if (!postId) return
    setLoading(true)
    try {
      const res = await fetch(`/api/comments?post_id=${postId}`)
      if (res.ok) {
        const data = await res.json()
        setComments(data)
      }
    } finally {
      setLoading(false)
    }
  }, [postId])

  useEffect(() => {
    fetchComments()
  }, [fetchComments])

  // Realtime subscription
  useEffect(() => {
    if (!postId) return
    const channel = supabase
      .channel(`comments:${postId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'comments', filter: `post_id=eq.${postId}` }, async (payload) => {
        // Fetch the full comment with user data
        const res = await fetch(`/api/comments?post_id=${postId}`)
        if (res.ok) {
          const data = await res.json()
          setComments(data)
        }
        void payload
      })
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [postId])

  const addComment = useCallback(async (userId: string, content: string, gif?: { url: string; preview_url: string; source: 'tenor' | 'upload'; title?: string }) => {
    const res = await fetch('/api/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        post_id: postId,
        user_id: userId,
        content,
        gif_url: gif?.url ?? null,
        gif_preview_url: gif?.preview_url ?? null,
        gif_source: gif?.source ?? null,
      }),
    })
    if (!res.ok) throw new Error('Erreur envoi commentaire')
    const newComment: Comment = await res.json()
    setComments(prev => [newComment, ...prev])
    return newComment
  }, [postId])

  return { comments, loading, addComment, refetch: fetchComments }
}
