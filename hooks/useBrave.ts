'use client'
import { useState, useEffect } from 'react'

export function useBrave() {
  const [isBrave, setIsBrave] = useState(false)

  useEffect(() => {
    const check = async () => {
      try {
        const result = await (navigator as any).brave?.isBrave?.()
        setIsBrave(!!result)
      } catch {
        setIsBrave(false)
      }
    }
    check()
  }, [])

  return { isBrave, bonusMultiplier: isBrave ? 2 : 1 }
}
