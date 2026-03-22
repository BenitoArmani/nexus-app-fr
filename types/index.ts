export interface User {
  id: string
  username: string
  full_name: string
  avatar_url: string | null
  bio: string | null
  is_verified: boolean
  is_creator: boolean
  monthly_goal: number
  followers_count: number
  following_count: number
  created_at: string
}

export interface Post {
  id: string
  user_id: string
  content: string
  media_url: string | null
  media_type: 'image' | 'video' | null
  likes_count: number
  comments_count: number
  views: number
  is_premium: boolean
  is_explicit?: boolean
  bets_disabled?: boolean
  created_at: string
  user?: User
  liked_by_me?: boolean
}

export interface Reel {
  id: string
  user_id: string
  video_url: string
  thumbnail_url: string | null
  caption: string
  views: number
  likes: number
  earnings: number
  is_explicit?: boolean
  created_at: string
  user?: User
  liked_by_me?: boolean
}

export interface Comment {
  id: string
  post_id: string
  user_id: string
  content: string
  gif_url?: string
  gif_preview_url?: string
  gif_source?: 'tenor' | 'upload'
  likes_count?: number
  created_at: string
  user?: User
}

export interface UserGif {
  id: string
  user_id: string
  url: string
  preview_url?: string
  title?: string
  source: 'tenor' | 'upload'
  category: string
  tenor_id?: string
  created_at: string
}

export interface Message {
  id: string
  sender_id: string
  receiver_id: string
  content: string
  media_url: string | null
  read: boolean
  created_at: string
  sender?: User
}

export interface Conversation {
  user: User
  last_message: Message | null
  unread_count: number
}

export interface Server {
  id: string
  name: string
  icon: string | null
  owner_id: string
  members_count: number
  created_at: string
}

export interface Channel {
  id: string
  server_id: string
  name: string
  type: 'text' | 'voice' | 'announcement'
  created_at: string
}

export interface Subscription {
  id: string
  creator_id: string
  subscriber_id: string
  plan: 'basic' | 'pro' | 'vip'
  amount: number
  status: 'active' | 'cancelled' | 'expired'
  created_at: string
}

export interface Earning {
  id: string
  user_id: string
  source: 'reels' | 'subscriptions' | 'tips' | 'shop'
  amount: number
  description: string
  created_at: string
}

export interface Story {
  id: string
  user_id: string
  media_url: string
  expires_at: string
  views: number
  created_at: string
  user?: User
}

export interface Tip {
  id: string
  sender_id: string
  receiver_id: string
  amount: number
  message: string | null
  created_at: string
  sender?: User
}

export type SubscriptionPlan = {
  id: 'basic' | 'pro' | 'vip'
  name: string
  price: number
  features: string[]
}

// BETTING
export interface BettingQuestion {
  id: string
  creator_id: string
  question: string
  options: BettingOption[]
  total_pool: number
  status: 'open' | 'closed' | 'resolved'
  winner_option?: string
  expires_at: string
  created_at: string
  creator?: User
}
export interface BettingOption {
  id: string
  label: string
  odds: number
  total_bets: number
}

// MARKETS
export interface StockQuote {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  volume: number
  marketCap?: number
  type: 'stock' | 'crypto'
}
export interface PortfolioHolding {
  symbol: string
  name: string
  quantity: number
  avgBuyPrice: number
  currentPrice: number
  type: 'stock' | 'crypto'
}

// GAMING
export interface GamePost {
  id: string
  user_id: string
  game: string
  title: string
  clip_url?: string
  thumbnail_url: string
  views: number
  likes: number
  type: 'clip' | 'stream'
  created_at: string
  user?: User
}
export interface Tournament {
  id: string
  game: string
  name: string
  prize_pool: number
  participants: number
  max_participants: number
  status: 'upcoming' | 'live' | 'ended'
  starts_at: string
}
export interface LFGPost {
  id: string
  user_id: string
  game: string
  rank: string
  looking_for: string
  language: string
  created_at: string
  user?: User
}

// EDUCATION
export interface Course {
  id: string
  title: string
  instructor: string
  instructor_avatar?: string
  category: string
  level: 'débutant' | 'intermédiaire' | 'avancé'
  duration_hours: number
  students: number
  rating: number
  price: number
  thumbnail: string
  is_free: boolean
}
export interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correct: number
  explanation: string
}

// GIF
export interface GifResult {
  id: string
  title: string
  url: string
  preview_url: string
  width: number
  height: number
}

// GLYPHS
export interface ScheduledPost {
  id: string
  content: string
  media_url: string | null
  scheduled_at: string
  status: 'pending' | 'published' | 'cancelled'
}

export interface GlyphTransaction {
  id: string
  amount: number
  event: string
  created_at: string
}

export interface AdWatch {
  id: string
  watched_at: string
  glyphs_earned: number
  is_brave: boolean
}

export interface BraveStatus {
  isBrave: boolean
  bonusMultiplier: number
}

export interface WatchParty {
  id: string
  title: string
  host: User
  participants: number
  reel_url: string
  thumbnail_url: string
  status: 'live' | 'upcoming' | 'ended'
  created_at: string
}

export interface PrometheMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  created_at: string
}
