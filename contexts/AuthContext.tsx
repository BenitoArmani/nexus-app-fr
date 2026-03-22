'use client'
import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import type { User } from '@/types'

// ─── Types ────────────────────────────────────────────────────────────────────

interface AuthContextValue {
  user:          User | null
  loading:       boolean
  signIn:        (email: string, password: string) => Promise<void>
  signUp:        (email: string, password: string, username: string) => Promise<void>
  signOut:       () => Promise<void>
  updateProfile: (updates: Partial<Pick<User, 'full_name' | 'bio' | 'avatar_url'>>) => Promise<void>
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | null>(null)

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser]       = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router                = useRouter()

  useEffect(() => {
    // Initial session check
    supabase.auth.getSession()
      .then(async ({ data: { session } }) => {
        if (session?.user) {
          await fetchProfile(session.user.id)
        } else {
          setUser(null)
          setLoading(false)
        }
      })
      .catch(() => {
        setUser(null)
        setLoading(false)
      })

    // Auth state changes (skip INITIAL_SESSION — already handled above)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'INITIAL_SESSION') return
      try {
        if (session?.user) {
          if (event === 'SIGNED_IN') {
            // Ensure profile row exists — fire-and-forget
            const meta         = session.user.user_metadata ?? {}
            const fallbackName = meta.full_name ?? meta.name ?? session.user.email?.split('@')[0] ?? 'utilisateur'
            supabase.from('users').upsert({
              id:              session.user.id,
              username:        (meta.username ?? fallbackName).toLowerCase().replace(/[^a-z0-9_]/g, '_').slice(0, 20),
              full_name:       fallbackName,
              avatar_url:      meta.avatar_url ?? meta.picture ?? null,
              is_verified:     false,
              is_creator:      false,
              monthly_goal:    500,
              followers_count: 0,
              following_count: 0,
            }, { onConflict: 'id', ignoreDuplicates: true }).then(() => {})
          }
          await fetchProfile(session.user.id)
        } else {
          setUser(null)
          setLoading(false)
        }
      } catch {
        setUser(null)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Profile fetch ────────────────────────────────────────────────────────────

  async function fetchProfile(userId: string) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()

      if (data && !error) {
        setUser({
          id:              data.id,
          username:        data.username,
          full_name:       data.full_name,
          avatar_url:      data.avatar_url,
          bio:             data.bio,
          is_verified:     data.is_verified,
          is_creator:      data.is_creator,
          monthly_goal:    data.monthly_goal    ?? 500,
          followers_count: data.followers_count ?? 0,
          following_count: data.following_count ?? 0,
          created_at:      data.created_at,
        })
      } else {
        // Profile row not yet created (RLS delay after signup) — build from auth session
        const { data: { user: authUser } } = await supabase.auth.getUser()
        if (authUser) {
          const meta         = authUser.user_metadata ?? {}
          const fallbackName = meta.username ?? meta.full_name ?? authUser.email?.split('@')[0] ?? 'utilisateur'
          setUser({
            id:              authUser.id,
            username:        fallbackName,
            full_name:       meta.full_name ?? fallbackName,
            avatar_url:      meta.avatar_url ?? null,
            bio:             null,
            is_verified:     false,
            is_creator:      false,
            monthly_goal:    500,
            followers_count: 0,
            following_count: 0,
            created_at:      authUser.created_at,
          })
        } else {
          setUser(null)
        }
      }
    } catch {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  // ── Auth actions ─────────────────────────────────────────────────────────────

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
    if (error) {
      if (error.status === 422 || error.message?.toLowerCase().includes('already registered')) {
        throw new Error('Un compte existe déjà avec cet email. Connectez-vous ou réinitialisez votre mot de passe.')
      }
      throw new Error(error.message)
    }
    if (data.user && data.session) {
      // Auto-confirm ON — create profile row immediately
      await supabase.from('users').upsert({
        id:              data.user.id,
        username,
        full_name:       username,
        is_verified:     false,
        is_creator:      false,
        monthly_goal:    500,
        followers_count: 0,
        following_count: 0,
      }, { onConflict: 'id' })
      supabase.from('streaks').upsert({ user_id: data.user.id }, { onConflict: 'user_id' }).then(() => {})
      supabase.from('user_levels').upsert({ user_id: data.user.id, level: 1, total_glyphs_earned: 0 }, { onConflict: 'user_id' }).then(() => {})
    } else if (data.user && !data.session) {
      // Email confirmation required
      throw new Error('Un email de confirmation a été envoyé. Vérifiez votre boîte mail.')
    }
  }

  async function signOut() {
    await supabase.auth.signOut()
    setUser(null)
    router.push('/login')
  }

  async function updateProfile(updates: Partial<Pick<User, 'full_name' | 'bio' | 'avatar_url'>>) {
    if (!user) return
    const { error } = await supabase.from('users').update(updates).eq('id', user.id)
    if (!error) setUser(prev => prev ? { ...prev, ...updates } : prev)
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, updateProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
