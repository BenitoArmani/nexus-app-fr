import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
  },
  realtime: {
    params: { eventsPerSecond: 10 },
  },
})

export type Database = {
  public: {
    Tables: {
      users: { Row: import('@/types').User; Insert: Partial<import('@/types').User>; Update: Partial<import('@/types').User> }
      posts: { Row: import('@/types').Post; Insert: Partial<import('@/types').Post>; Update: Partial<import('@/types').Post> }
      reels: { Row: import('@/types').Reel; Insert: Partial<import('@/types').Reel>; Update: Partial<import('@/types').Reel> }
      messages: { Row: import('@/types').Message; Insert: Partial<import('@/types').Message>; Update: Partial<import('@/types').Message> }
      earnings: { Row: import('@/types').Earning; Insert: Partial<import('@/types').Earning>; Update: Partial<import('@/types').Earning> }
    }
  }
}
