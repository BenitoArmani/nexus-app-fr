'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { User } from '@/types'
import { MOCK_CURRENT_USER } from '@/lib/mock-data'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [googleLoading, setGoogleLoading] = useState(false)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        await fetchProfile(session.user.id)
      } else {
        // Demo mode: use mock user
        setUser(MOCK_CURRENT_USER)
        setLoading(false)
      }
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        // For first-time OAuth users, ensure a profile row exists
        if (event === 'SIGNED_IN') {
          const meta = session.user.user_metadata ?? {}
          const fallbackName = meta.full_name ?? meta.name ?? session.user.email?.split('@')[0] ?? 'utilisateur'
          await supabase.from('users').upsert({
            id: session.user.id,
            username: (meta.username ?? fallbackName).toLowerCase().replace(/[^a-z0-9_]/g, '_').slice(0, 20),
            full_name: fallbackName,
            avatar_url: meta.avatar_url ?? meta.picture ?? null,
            is_verified: false,
            is_creator: false,
            monthly_goal: 500,
            followers_count: 0,
            following_count: 0,
          }, { onConflict: 'id', ignoreDuplicates: true })
        }
        await fetchProfile(session.user.id)
      } else {
        setUser(MOCK_CURRENT_USER)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  async function fetchProfile(userId: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()

    if (data && !error) {
      setUser({
        id: data.id,
        username: data.username,
        full_name: data.full_name,
        avatar_url: data.avatar_url,
        bio: data.bio,
        is_verified: data.is_verified,
        is_creator: data.is_creator,
        monthly_goal: data.monthly_goal ?? 500,
        followers_count: data.followers_count ?? 0,
        following_count: data.following_count ?? 0,
        created_at: data.created_at,
      })
    } else {
      // Profile not found yet (just registered or RLS delay) — build from auth session
      // NEVER fall back to MOCK_CURRENT_USER for an authenticated user
      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (authUser) {
        const meta = authUser.user_metadata ?? {}
        const fallbackName = meta.username ?? meta.full_name ?? authUser.email?.split('@')[0] ?? 'utilisateur'
        setUser({
          id: authUser.id,
          username: fallbackName,
          full_name: meta.full_name ?? fallbackName,
          avatar_url: meta.avatar_url ?? null,
          bio: null,
          is_verified: false,
          is_creator: false,
          monthly_goal: 500,
          followers_count: 0,
          following_count: 0,
          created_at: authUser.created_at,
        })
      } else {
        setUser(MOCK_CURRENT_USER)
      }
    }
    setLoading(false)
  }

  async function signIn(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
  }

  async function signUp(email: string, password: string, username: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { username, full_name: username } },
    })
    if (error) throw error
    if (data.user && data.session) {
      // Only upsert if we have an active session (autoconfirm ON)
      // Without session, the user must confirm email first → upsert would fail RLS
      await supabase.from('users').upsert({
        id: data.user.id,
        username,
        full_name: username,
        is_verified: false,
        is_creator: false,
        monthly_goal: 500,
        followers_count: 0,
        following_count: 0,
      }, { onConflict: 'id' })
      supabase.from('streaks').upsert({ user_id: data.user.id }, { onConflict: 'user_id' }).then(() => {})
      supabase.from('user_levels').upsert({ user_id: data.user.id, level: 1, total_glyphs_earned: 0 }, { onConflict: 'user_id' }).then(() => {})
    } else if (data.user && !data.session) {
      // Email confirmation required — throw so register page can show the right message
      throw new Error('Un email de confirmation a été envoyé. Vérifiez votre boîte mail.')
    }
  }

  async function signOut() {
    await supabase.auth.signOut()
    setUser(MOCK_CURRENT_USER) // back to demo mode
  }

  async function signInWithGoogle() {
    if (googleLoading) return
    setGoogleLoading(true)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: 'https://nexussociable.fr/auth/callback' },
    })
    if (error) {
      setGoogleLoading(false)
      console.error('[NEXUS] Google OAuth error:', error)
      throw error
    }
    // Pas de reset sur succès — le browser navigue vers Google
  }

  async function updateProfile(updates: Partial<Pick<User, 'full_name' | 'bio' | 'avatar_url'>>) {
    if (!user) return
    const { error } = await supabase.from('users').update(updates).eq('id', user.id)
    if (!error) setUser(prev => prev ? { ...prev, ...updates } : prev)
  }

  const isRealUser = user?.id !== MOCK_CURRENT_USER.id

  return { user, loading, isRealUser, googleLoading, signIn, signUp, signOut, signInWithGoogle, updateProfile }
}
