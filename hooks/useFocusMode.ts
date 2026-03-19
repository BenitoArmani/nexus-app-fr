'use client'
import { useState, useCallback } from 'react'

const KEY = 'nexus_focus_mode'

export function useFocusMode() {
  const [focusMode, setFocusModeState] = useState(() => {
    if (typeof window === 'undefined') return false
    return localStorage.getItem(KEY) === 'true'
  })

  const toggleFocusMode = useCallback(() => {
    setFocusModeState(prev => {
      const next = !prev
      localStorage.setItem(KEY, String(next))
      return next
    })
  }, [])

  return { focusMode, toggleFocusMode }
}
