'use client'
import { useState, useCallback, useEffect } from 'react'
import toast from 'react-hot-toast'

const STORAGE_KEY = 'nexus_glyphs_balance'
const TX_KEY = 'nexus_glyphs_transactions'

export function useGlyphs() {
  const getBalance = () => {
    if (typeof window === 'undefined') return 2500
    return parseInt(localStorage.getItem(STORAGE_KEY) || '2500', 10)
  }

  // Start with 2500 on both server and client to avoid hydration mismatch,
  // then sync to real localStorage value after mount.
  const [balance, setBalance] = useState<number>(2500)

  useEffect(() => {
    setBalance(getBalance())
  }, [])

  const addGlyphs = useCallback((amount: number, label: string) => {
    const newBalance = getBalance() + amount
    localStorage.setItem(STORAGE_KEY, String(newBalance))
    setBalance(newBalance)
    const txs = JSON.parse(localStorage.getItem(TX_KEY) || '[]')
    txs.unshift({ id: Date.now().toString(), amount, event: label, created_at: new Date().toISOString() })
    localStorage.setItem(TX_KEY, JSON.stringify(txs.slice(0, 50)))
    toast.success(`⬡ +${amount} Glyphs — ${label}`, {
      style: { background: '#1a0a2e', color: '#c084fc', border: '1px solid rgba(139,92,246,0.3)', borderRadius: '12px' }
    })
  }, [])

  const spendGlyphs = useCallback((amount: number, label: string): boolean => {
    const current = getBalance()
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
    return true
  }, [])

  const getTransactions = () => {
    if (typeof window === 'undefined') return []
    return JSON.parse(localStorage.getItem(TX_KEY) || '[]')
  }

  return { balance, addGlyphs, spendGlyphs, getTransactions }
}
