'use client'
import { useCallback, useRef } from 'react'

type SoundType = 'like' | 'comment' | 'gif_saved' | 'notification' | 'send'

function createSound(type: SoundType, ctx: AudioContext): void {
  const now = ctx.currentTime
  const gain = ctx.createGain()
  gain.connect(ctx.destination)

  if (type === 'like') {
    // Pop doux court
    const osc = ctx.createOscillator()
    osc.connect(gain)
    osc.frequency.setValueAtTime(660, now)
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.06)
    gain.gain.setValueAtTime(0.18, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15)
    osc.start(now)
    osc.stop(now + 0.15)
  } else if (type === 'comment') {
    // Pop léger
    const osc = ctx.createOscillator()
    osc.type = 'sine'
    osc.connect(gain)
    osc.frequency.setValueAtTime(440, now)
    osc.frequency.exponentialRampToValueAtTime(660, now + 0.08)
    gain.gain.setValueAtTime(0.12, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2)
    osc.start(now)
    osc.stop(now + 0.2)
  } else if (type === 'gif_saved') {
    // Petite montée joyeuse
    const notes = [523, 659, 784]
    notes.forEach((freq, i) => {
      const o = ctx.createOscillator()
      const g = ctx.createGain()
      o.connect(g)
      g.connect(ctx.destination)
      o.frequency.value = freq
      o.type = 'sine'
      const t = now + i * 0.08
      g.gain.setValueAtTime(0.1, t)
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.12)
      o.start(t)
      o.stop(t + 0.12)
    })
  } else if (type === 'notification') {
    const osc = ctx.createOscillator()
    osc.type = 'sine'
    osc.connect(gain)
    osc.frequency.setValueAtTime(800, now)
    osc.frequency.setValueAtTime(1000, now + 0.1)
    gain.gain.setValueAtTime(0.15, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3)
    osc.start(now)
    osc.stop(now + 0.3)
  } else if (type === 'send') {
    // Whoosh
    const bufferSize = ctx.sampleRate * 0.2
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize)
    const source = ctx.createBufferSource()
    source.buffer = buffer
    const filter = ctx.createBiquadFilter()
    filter.type = 'bandpass'
    filter.frequency.value = 1200
    source.connect(filter)
    filter.connect(gain)
    gain.gain.setValueAtTime(0.12, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2)
    source.start(now)
  }
}

let sharedCtx: AudioContext | null = null

function getCtx() {
  if (!sharedCtx || sharedCtx.state === 'closed') {
    sharedCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
  }
  return sharedCtx
}

export function useSounds() {
  const enabled = useRef(true)

  const play = useCallback((type: SoundType) => {
    if (!enabled.current || typeof window === 'undefined') return
    try {
      const ctx = getCtx()
      if (ctx.state === 'suspended') ctx.resume().then(() => createSound(type, ctx))
      else createSound(type, ctx)
    } catch {
      // Silently fail if audio not available
    }
  }, [])

  return { play }
}
