'use client'
import { useState, useCallback, useEffect } from 'react'
import { MOCK_POSTS } from '@/lib/mock-data'
import { supabase } from '@/lib/supabase'
import type { Post } from '@/types'

export function usePosts() {
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    supabase
      .from('posts')
      .select('*, users:user_id(id, username, full_name, avatar_url, is_verified)')
      .order('created_at', { ascending: false })
      .limit(30)
      .then(({ data, error }) => {
        if (data && data.length > 0) {
          const mapped: Post[] = data.map((p: any) => ({
            id: p.id,
            user_id: p.user_id,
            content: p.content,
            media_url: p.media_url ?? null,
            media_type: p.media_type ?? null,
            likes_count: p.likes_count ?? 0,
            comments_count: p.comments_count ?? 0,
            views: p.views ?? 0,
            is_premium: p.is_premium ?? false,
            created_at: p.created_at,
            liked_by_me: false,
            user: p.users ?? undefined,
          }))
          setPosts(mapped)
        }
        // If no data or error, keep mock data already set
        setLoading(false)
      })
  }, [])

  const toggleLike = useCallback((postId: string) => {
    setPosts(prev =>
      prev.map(post => {
        if (post.id !== postId) return post
        const liked = !post.liked_by_me
        // Optimistically update; fire-and-forget to Supabase
        supabase
          .from('posts')
          .update({ likes_count: liked ? post.likes_count + 1 : post.likes_count - 1 })
          .eq('id', postId)
          .then(() => {})
        return {
          ...post,
          liked_by_me: liked,
          likes_count: liked ? post.likes_count + 1 : post.likes_count - 1,
        }
      })
    )
  }, [])

  const addPost = useCallback(async (content: string, mediaUrl?: string, mediaType?: 'image' | 'video') => {
    const newPost: Post = {
      id: `p${Date.now()}`,
      user_id: '0',
      content,
      media_url: mediaUrl || null,
      media_type: mediaType || null,
      likes_count: 0,
      comments_count: 0,
      views: 0,
      is_premium: false,
      created_at: new Date().toISOString(),
      liked_by_me: false,
    }
    // Optimistically add to state
    setPosts(prev => [newPost, ...prev])

    // Try to persist to Supabase
    const { data: { user } } = await supabase.auth.getUser().catch(() => ({ data: { user: null } }))
    if (user) {
      supabase.from('posts').insert({
        user_id: user.id,
        content,
        media_url: mediaUrl ?? null,
        media_type: mediaType ?? null,
      }).then(() => {})
    }
  }, [])

  return { posts, loading, toggleLike, addPost }
}
