'use client'
import { useState, useCallback, useEffect, useRef } from 'react'
import toast from 'react-hot-toast'
import { supabase } from '@/lib/supabase'

const STORAGE_KEY = 'nexus_glyphs_balance'
const TX_KEY      = 'nexus_glyphs_transactions'

export function useGlyphs() {
  const [balance, setBalance] = useState<number>(0)
  const balanceRef = useRef<number>(0) // source de vérité synchrone — NON modifiable depuis l'extérieur

  const updateBalance = (val: number) => {
    balanceRef.current = val
    setBalance(val)
    localStorage.setItem(STORAGE_KEY, String(val))
  }

  // On mount: charge depuis Supabase (source de vérité), localStorage = cache vitesse
  useEffect(() => {
    const cached = parseInt(localStorage.getItem(STORAGE_KEY) || '0', 10)
    if (cached > 0) { balanceRef.current = cached; setBalance(cached) }

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return
      supabase
        .from('users')
        .select('glyphs_balance')
        .eq('id', user.id)
        .single()
        .then(({ data }) => {
          if (data?.glyphs_balance != null) {
            updateBalance(data.glyphs_balance)
          }
        })
    })
  }, [])

  const addGlyphs = useCallback((amount: number, label: string) => {
    const newBalance = balanceRef.current + amount
    updateBalance(newBalance)
    const txs = JSON.parse(localStorage.getItem(TX_KEY) || '[]')
    txs.unshift({ id: Date.now().toString(), amount, event: label, created_at: new Date().toISOString() })
    localStorage.setItem(TX_KEY, JSON.stringify(txs.slice(0, 50)))
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return
      supabase.rpc('credit_glyphs', { p_user_id: user.id, p_amount: amount, p_label: label }).then(() => {})
    })
    toast.success(`⬡ +${amount} Glyphs — ${label}`, {
      style: { background: '#1a0a2e', color: '#c084fc', border: '1px solid rgba(139,92,246,0.3)', borderRadius: '12px' }
    })
  }, [])

  const spendGlyphs = useCallback((amount: number, label: string): boolean => {
    // Vérifie le ref (non modifiable depuis DevTools) — pas localStorage
    if (balanceRef.current < amount) {
      toast.error(`Solde insuffisant — il te faut ⬡ ${amount}`)
      return false
    }
    const newBalance = balanceRef.current - amount
    updateBalance(newBalance)
    const txs = JSON.parse(localStorage.getItem(TX_KEY) || '[]')
    txs.unshift({ id: Date.now().toString(), amount: -amount, event: label, created_at: new Date().toISOString() })
    localStorage.setItem(TX_KEY, JSON.stringify(txs.slice(0, 50)))
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
