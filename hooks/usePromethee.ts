'use client'
import { useState, useCallback } from 'react'
import type { PrometheMessage } from '@/types'

const MSG_COUNT_KEY = 'nexus_promethee_count'
const MSG_DATE_KEY = 'nexus_promethee_date'
const FREE_LIMIT = 50
const EXTRA_COST = 100

export function usePromethee() {
  const [messages, setMessages] = useState<PrometheMessage[]>([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)

  const getDailyCount = () => {
    if (typeof window === 'undefined') return 0
    const today = new Date().toDateString()
    const savedDate = localStorage.getItem(MSG_DATE_KEY)
    if (savedDate !== today) {
      localStorage.setItem(MSG_DATE_KEY, today)
      localStorage.setItem(MSG_COUNT_KEY, '0')
      return 0
    }
    return parseInt(localStorage.getItem(MSG_COUNT_KEY) || '0', 10)
  }

  const incrementCount = () => {
    const count = getDailyCount() + 1
    localStorage.setItem(MSG_COUNT_KEY, String(count))
  }

  const sendMessage = useCallback(async (content: string, glyphBalance: number, spendGlyphs: (amount: number, label: string) => boolean) => {
    const count = getDailyCount()
    if (count >= FREE_LIMIT) {
      if (glyphBalance < EXTRA_COST) {
        return { error: `Mes flammes journalières sont épuisées. Offre-moi ⬡ ${EXTRA_COST} GLYPHS et je t'accorderai 10 nouvelles réponses.` }
      }
      const ok = spendGlyphs(EXTRA_COST, '+10 messages Prométhée')
      if (!ok) return { error: 'Solde insuffisant' }
      // Reset counter to allow 10 more
      const newCount = count - 10
      localStorage.setItem(MSG_COUNT_KEY, String(Math.max(0, newCount)))
    }

    const userMsg: PrometheMessage = {
      id: Date.now().toString(),
      role: 'user',
      content,
      created_at: new Date().toISOString(),
    }
    setMessages(prev => [...prev, userMsg])
    setLoading(true)
    incrementCount()

    try {
      const res = await fetch('/api/promethee', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMsg].map(m => ({ role: m.role, content: m.content })) }),
      })
      const data = await res.json()
      const assistantMsg: PrometheMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.content || 'Désolé, une erreur est survenue.',
        created_at: new Date().toISOString(),
      }
      setMessages(prev => [...prev, assistantMsg])
    } catch {
      const errorMsg: PrometheMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Mode démo — Je suis Prométhée, l\'IA de NEXUS ! En production, je serai connecté à Claude pour t\'aider à créer du contenu, analyser tes performances et bien plus encore. 🔥',
        created_at: new Date().toISOString(),
      }
      setMessages(prev => [...prev, errorMsg])
    }
    setLoading(false)
    return {}
  }, [messages])

  return { messages, loading, open, setOpen, sendMessage, getDailyCount, FREE_LIMIT }
}
