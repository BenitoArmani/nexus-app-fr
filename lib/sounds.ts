'use client'

type SoundKey =
  | 'like'
  | 'glyphs'
  | 'big_win'
  | 'message'
  | 'notification'
  | 'bet_win'
  | 'level_up'
  | 'streak'
  | 'mission_complete'
  | 'bubble_pop'
  | 'error'
  | 'success'

interface SoundSettings {
  enabled: boolean
  volume: number
}

class SoundSystem {
  private ctx: AudioContext | null = null
  private settings: SoundSettings = { enabled: true, volume: 0.5 }

  constructor() {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('nexus_sound_settings')
      if (saved) {
        try { this.settings = JSON.parse(saved) } catch {}
      }
    }
  }

  private getCtx(): AudioContext {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
    }
    return this.ctx
  }

  updateSettings(settings: Partial<SoundSettings>) {
    this.settings = { ...this.settings, ...settings }
    if (typeof window !== 'undefined') {
      localStorage.setItem('nexus_sound_settings', JSON.stringify(this.settings))
    }
  }

  getSettings(): SoundSettings {
    return this.settings
  }

  play(key: SoundKey) {
    if (!this.settings.enabled || typeof window === 'undefined') return
    try {
      const ctx = this.getCtx()
      const vol = this.settings.volume
      switch (key) {
        case 'like': this.playTone(ctx, [880, 1100], [0.08, 0.1], 'sine', vol * 0.3); break
        case 'glyphs': this.playChime(ctx, [1047, 1319, 1568], vol * 0.4); break
        case 'big_win': this.playCascade(ctx, vol * 0.6); break
        case 'message': this.playTone(ctx, [600, 800], [0.08, 0.12], 'sine', vol * 0.25); break
        case 'notification': this.playTone(ctx, [880, 990], [0.08, 0.1], 'sine', vol * 0.3); break
        case 'bet_win': this.playFanfare(ctx, vol * 0.5); break
        case 'level_up': this.playLevelUp(ctx, vol * 0.6); break
        case 'streak': this.playChime(ctx, [440, 550, 660], vol * 0.3); break
        case 'mission_complete': this.playChime(ctx, [784, 988, 1175], vol * 0.4); break
        case 'bubble_pop': this.playPop(ctx, vol * 0.3); break
        case 'error': this.playTone(ctx, [200, 180], [0.1, 0.15], 'sawtooth', vol * 0.2); break
        case 'success': this.playChime(ctx, [523, 659, 784], vol * 0.35); break
      }
    } catch {}
  }

  private playTone(ctx: AudioContext, freqs: number[], durations: number[], type: OscillatorType, vol: number) {
    let time = ctx.currentTime
    freqs.forEach((freq, i) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain); gain.connect(ctx.destination)
      osc.type = type
      osc.frequency.setValueAtTime(freq, time)
      gain.gain.setValueAtTime(vol, time)
      gain.gain.exponentialRampToValueAtTime(0.001, time + durations[i])
      osc.start(time); osc.stop(time + durations[i])
      time += durations[i]
    })
  }

  private playChime(ctx: AudioContext, freqs: number[], vol: number) {
    freqs.forEach((freq, i) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain); gain.connect(ctx.destination)
      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.1)
      gain.gain.setValueAtTime(vol, ctx.currentTime + i * 0.1)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.1 + 0.4)
      osc.start(ctx.currentTime + i * 0.1); osc.stop(ctx.currentTime + i * 0.1 + 0.4)
    })
  }

  private playCascade(ctx: AudioContext, vol: number) {
    for (let i = 0; i < 12; i++) {
      const freq = 400 + Math.random() * 800
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain); gain.connect(ctx.destination)
      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.05)
      gain.gain.setValueAtTime(vol * 0.3, ctx.currentTime + i * 0.05)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.05 + 0.3)
      osc.start(ctx.currentTime + i * 0.05); osc.stop(ctx.currentTime + i * 0.05 + 0.3)
    }
  }

  private playFanfare(ctx: AudioContext, vol: number) {
    const notes = [523, 659, 784, 1047]
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain); gain.connect(ctx.destination)
      osc.type = 'square'
      osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.12)
      gain.gain.setValueAtTime(vol * 0.3, ctx.currentTime + i * 0.12)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.12 + 0.25)
      osc.start(ctx.currentTime + i * 0.12); osc.stop(ctx.currentTime + i * 0.12 + 0.25)
    })
  }

  private playLevelUp(ctx: AudioContext, vol: number) {
    const notes = [392, 523, 659, 784, 1047]
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain); gain.connect(ctx.destination)
      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.1)
      gain.gain.setValueAtTime(vol * 0.4, ctx.currentTime + i * 0.1)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.1 + 0.3)
      osc.start(ctx.currentTime + i * 0.1); osc.stop(ctx.currentTime + i * 0.1 + 0.3)
    })
  }

  private playPop(ctx: AudioContext, vol: number) {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain); gain.connect(ctx.destination)
    osc.type = 'sine'
    osc.frequency.setValueAtTime(800, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.1)
    gain.gain.setValueAtTime(vol, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1)
    osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.1)
  }
}

export const soundSystem = typeof window !== 'undefined' ? new SoundSystem() : null
export type { SoundKey, SoundSettings }
