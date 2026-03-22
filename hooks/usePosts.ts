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
    async function load() {
      const { data: { user } } = await supabase.auth.getUser().catch(() => ({ data: { user: null } }))

      const { data, error } = await supabase
        .from('posts')
        .select('*, users:user_id(id, username, full_name, avatar_url, is_verified)')
        .order('created_at', { ascending: false })
        .limit(30)

      if (data && data.length > 0) {
        // Charge les likes de l'utilisateur connecté
        let likedPostIds = new Set<string>()
        if (user) {
          const { data: likesData } = await supabase
            .from('post_likes')
            .select('post_id')
            .eq('user_id', user.id)
          if (likesData) likedPostIds = new Set(likesData.map((l: { post_id: string }) => l.post_id))
        }

        const mapped: Post[] = data.map((p: Record<string, unknown>) => ({
          id: p.id as string,
          user_id: p.user_id as string,
          content: p.content as string,
          media_url: (p.media_url as string) ?? null,
          media_type: (p.media_type as 'image' | 'video') ?? null,
          likes_count: (p.likes_count as number) ?? 0,
          comments_count: (p.comments_count as number) ?? 0,
          views: (p.views as number) ?? 0,
          is_premium: (p.is_premium as boolean) ?? false,
          is_explicit: (p.is_explicit as boolean) ?? false,
          bets_disabled: (p.bets_disabled as boolean) ?? false,
          created_at: p.created_at as string,
          liked_by_me: likedPostIds.has(p.id as string),
          user: (p.users as Post['user']) ?? undefined,
        }))
        setPosts(mapped)
      }
      setLoading(false)
    }
    load()
  }, [])

  const toggleLike = useCallback(async (postId: string) => {
    const { data: { user } } = await supabase.auth.getUser().catch(() => ({ data: { user: null } }))

    setPosts(prev => prev.map(post => {
      if (post.id !== postId) return post
      const liked = !post.liked_by_me

      if (user) {
        if (liked) {
          supabase.from('post_likes').insert({ post_id: postId, user_id: user.id }).then(() => {})
          supabase.from('posts').update({ likes_count: post.likes_count + 1 }).eq('id', postId).then(() => {})
        } else {
          supabase.from('post_likes').delete().eq('post_id', postId).eq('user_id', user.id).then(() => {})
          supabase.from('posts').update({ likes_count: Math.max(0, post.likes_count - 1) }).eq('id', postId).then(() => {})
        }
      }

      return {
        ...post,
        liked_by_me: liked,
        likes_count: liked ? post.likes_count + 1 : Math.max(0, post.likes_count - 1),
      }
    }))
  }, [])

  const addPost = useCallback(async (
    content: string,
    mediaUrl?: string,
    mediaType?: 'image' | 'video',
    betsDisabled?: boolean,
    isExplicit?: boolean,
  ) => {
    const { data: { user } } = await supabase.auth.getUser().catch(() => ({ data: { user: null } }))

    const newPost: Post = {
      id: `p${Date.now()}`,
      user_id: user?.id ?? '0',
      content,
      media_url: mediaUrl || null,
      media_type: mediaType || null,
      likes_count: 0,
      comments_count: 0,
      views: 0,
      is_premium: false,
      is_explicit: isExplicit ?? false,
      bets_disabled: betsDisabled ?? false,
      created_at: new Date().toISOString(),
      liked_by_me: false,
    }
    setPosts(prev => [newPost, ...prev])

    if (user) {
      supabase.from('posts').insert({
        user_id: user.id,
        content,
        media_url: mediaUrl ?? null,
        media_type: mediaType ?? null,
        is_explicit: isExplicit ?? false,
        bets_disabled: betsDisabled ?? false,
      }).then(() => {})
    }
  }, [])

  return { posts, loading, toggleLike, addPost }
}
