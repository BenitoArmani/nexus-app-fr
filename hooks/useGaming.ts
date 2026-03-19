'use client'
import { useState } from 'react'
import { MOCK_GAME_POSTS, MOCK_TOURNAMENTS, MOCK_LFG } from '@/lib/mock-data'

export function useGaming() {
  const [gamePosts, setGamePosts] = useState(MOCK_GAME_POSTS)
  const [tournaments] = useState(MOCK_TOURNAMENTS)
  const [lfgPosts] = useState(MOCK_LFG)
  const [activeTab, setActiveTab] = useState<'clips' | 'tournaments' | 'lfg'>('clips')
  const [selectedGame, setSelectedGame] = useState<string>('all')

  const games = ['all', 'Valorant', 'League of Legends', 'CS2', 'Minecraft', 'FIFA 25']
  const filteredPosts = selectedGame === 'all' ? gamePosts : gamePosts.filter(p => p.game === selectedGame)

  const toggleLike = (id: string) => {
    setGamePosts(prev => prev.map(p => p.id !== id ? p : { ...p, likes: p.likes + 1 }))
  }

  return { gamePosts: filteredPosts, tournaments, lfgPosts, activeTab, setActiveTab, selectedGame, setSelectedGame, games, toggleLike }
}
