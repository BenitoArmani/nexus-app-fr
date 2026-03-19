'use client'
import { useState, useEffect } from 'react'

const STORAGE_SAFE = 'nexus_safe_mode'
const STORAGE_VERIFIED = 'nexus_adult_verified'

export function useSafeMode() {
  const [safeMode, setSafeMode] = useState(true)
  const [isAdultVerified, setIsAdultVerified] = useState(false)
  const [showAgeModal, setShowAgeModal] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const stored = localStorage.getItem(STORAGE_SAFE)
    const verified = localStorage.getItem(STORAGE_VERIFIED)
    if (stored !== null) setSafeMode(stored === 'true')
    if (verified === 'true') setIsAdultVerified(true)
  }, [])

  function requestDisable() {
    if (isAdultVerified) {
      setSafeMode(false)
      localStorage.setItem(STORAGE_SAFE, 'false')
    } else {
      setShowAgeModal(true)
    }
  }

  function confirmAge(year: number, month: number, day: number): boolean {
    const today = new Date()
    const birth = new Date(year, month - 1, day)
    let age = today.getFullYear() - birth.getFullYear()
    const m = today.getMonth() - birth.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--

    const isAdult = age >= 18
    setShowAgeModal(false)
    if (isAdult) {
      setIsAdultVerified(true)
      setSafeMode(false)
      localStorage.setItem(STORAGE_VERIFIED, 'true')
      localStorage.setItem(STORAGE_SAFE, 'false')
    }
    return isAdult
  }

  function enableSafeMode() {
    setSafeMode(true)
    localStorage.setItem(STORAGE_SAFE, 'true')
  }

  return { safeMode, isAdultVerified, showAgeModal, setShowAgeModal, requestDisable, confirmAge, enableSafeMode }
}
