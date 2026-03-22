'use client'
import { useState, useCallback, useEffect } from 'react'
import toast from 'react-hot-toast'
import { supabase } from '@/lib/supabase'

const STORAGE_KEY = 'nexus_glyphs_balance'
const TX_KEY      = 'nexus_glyphs_transactions'

export function useGlyphs() {
  const [balance, setBalance] = useState<number>(2500)

  // On mount: load from localStorage, then sync from Supabase if logged in
  useEffect(() => {
    const local = parseInt(localStorage.getItem(STORAGE_KEY) || '2500', 10)
    setBalance(local)

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return
      supabase
        .from('users')
        .select('glyphs_balance')
        .eq('id', user.id)
        .single()
        .then(({ data }) => {
          if (data?.glyphs_balance != null) {
            setBalance(data.glyphs_balance)
            localStorage.setItem(STORAGE_KEY, String(data.glyphs_balance))
          }
        })
    })
  }, [])

  const getLocal = () => parseInt(localStorage.getItem(STORAGE_KEY) || '2500', 10)

  const addGlyphs = useCallback((amount: number, label: string) => {
    const newBalance = getLocal() + amount
    localStorage.setItem(STORAGE_KEY, String(newBalance))
    setBalance(newBalance)
    const txs = JSON.parse(localStorage.getItem(TX_KEY) || '[]')
    txs.unshift({ id: Date.now().toString(), amount, event: label, created_at: new Date().toISOString() })
    localStorage.setItem(TX_KEY, JSON.stringify(txs.slice(0, 50)))
    // Persist to Supabase
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return
      supabase.rpc('credit_glyphs', { p_user_id: user.id, p_amount: amount, p_label: label }).then(() => {})
    })
    toast.success(`⬡ +${amount} Glyphs — ${label}`, {
      style: { background: '#1a0a2e', color: '#c084fc', border: '1px solid rgba(139,92,246,0.3)', borderRadius: '12px' }
    })
  }, [])

  const spendGlyphs = useCallback((amount: number, label: string): boolean => {
    const current = getLocal()
    if (current < amount) {
      toast.error(`Solde insuffisant — il te faut ⬡ ${amount}`)
      return false
    }
    const newBalance = current - amount
    localStorage.setItem(STORAGE_KEY, String(newBalance))
    setBalance(newBalance)
    const txs = JSON.parse(localStorage.getItem(TX_KEY) || '[]')
    txs.unshift({ id: Date.now().toString(), amount: -amount, event: label, created_at: new Date().toISOString() })
    localStorage.setItem(TX_KEY, JSON.stringify(txs.slice(0, 50)))
    // Persist to Supabase (deduct)
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return
      supabase.rpc('credit_glyphs', { p_user_id: user.id, p_amount: -amount, p_label: label }).then(() => {})
    })
    return true
  }, [])

  const getTransactions = () => {
    if (typeof window === 'undefined') return []
    return JSON.parse(localStorage.getItem(TX_KEY) || '[]')
  }

  return { balance, addGlyphs, spendGlyphs, getTransactions }
}
