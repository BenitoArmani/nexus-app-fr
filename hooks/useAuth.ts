'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { User } from '@/types'
import { MOCK_CURRENT_USER } from '@/lib/mock-data'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

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
      // Profile not found yet (just registered), use auth data
      setUser(MOCK_CURRENT_USER)
    }
    setLoading(false)
  }

  async function signIn(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
  }

  async function signUp(email: string, password: string, username: string) {
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) throw error
    if (data.user) {
      await supabase.from('users').insert({
        id: data.user.id,
        username,
        full_name: username,
        is_verified: false,
        is_creator: false,
        monthly_goal: 500,
        followers_count: 0,
        following_count: 0,
      })
      // Init streak & level (ignore errors if already exists)
      supabase.from('streaks').insert({ user_id: data.user.id }).then(() => {})
      supabase.from('user_levels').insert({ user_id: data.user.id, level: 1, total_glyphs_earned: 0 }).then(() => {})
    }
  }

  async function signOut() {
    await supabase.auth.signOut()
    setUser(MOCK_CURRENT_USER) // back to demo mode
  }

  async function signInWithGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/feed` },
    })
  }

  async function updateProfile(updates: Partial<Pick<User, 'full_name' | 'bio' | 'avatar_url'>>) {
    if (!user) return
    const { error } = await supabase.from('users').update(updates).eq('id', user.id)
    if (!error) setUser(prev => prev ? { ...prev, ...updates } : prev)
  }

  const isRealUser = user?.id !== MOCK_CURRENT_USER.id

  return { user, loading, isRealUser, signIn, signUp, signOut, signInWithGoogle, updateProfile }
}
