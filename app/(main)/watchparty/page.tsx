'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Tv2, Users, PlusCircle, Link as LinkIcon, Copy } from 'lucide-react'
import Button from '@/components/ui/Button'
import WatchPartyRoom from '@/components/watchparty/WatchPartyRoom'
import { MOCK_REELS } from '@/lib/mock-data'

const MOCK_PARTIES = [
  { id: 'wp1', title: 'Morning Routine de Sophia', host: 'sophia_create', viewers: 7, reel_url: MOCK_REELS[0].video_url, thumbnail: MOCK_REELS[0].thumbnail_url || '' },
  { id: 'wp2', title: 'Tech Setup 2025 d\'Alex', host: 'alex_tech', viewers: 4, reel_url: MOCK_REELS[1].video_url, thumbnail: MOCK_REELS[1].thumbnail_url || '' },
  { id: 'wp3', title: 'Session acoustique de Nora', host: 'nora_music', viewers: 12, reel_url: MOCK_REELS[2].video_url, thumbnail: MOCK_REELS[2].thumbnail_url || '' },
]

export default function WatchPartyPage() {
  const [activeRoom, setActiveRoom] = useState<typeof MOCK_PARTIES[0] | null>(null)
  const [inviteCode] = useState(`nexus-wp-${Math.random().toString(36).slice(2, 8)}`)
  const [copied, setCopied] = useState(false)

  const copyInvite = () => {
    navigator.clipboard.writeText(`https://nexus.app/watchparty?invite=${inviteCode}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (activeRoom) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => setActiveRoom(null)} className="text-text-muted hover:text-text-primary transition-colors text-sm">← Retour</button>
          <h1 className="text-lg font-black text-text-primary">{activeRoom.title}</h1>
        </div>
        <WatchPartyRoom roomId={activeRoom.id} title={activeRoom.title} videoUrl={activeRoom.reel_url} onLeave={() => setActiveRoom(null)} />
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl font-black text-text-primary flex items-center gap-2">
          <Tv2 size={24} className="text-violet-400" /> Watch Party 🎬
        </h1>
        <p className="text-text-muted text-sm mt-0.5">Regardez des contenus ensemble en temps réel</p>
      </motion.div>

      {/* Create room */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="bg-gradient-to-br from-violet-500/10 to-cyan-500/5 border border-violet-500/20 rounded-2xl p-5 mb-6">
        <h2 className="text-sm font-bold text-text-primary mb-3">Créer une room</h2>
        <div className="flex items-center gap-2 mb-3 bg-surface-2 border border-white/5 rounded-xl px-3 py-2">
          <LinkIcon size={14} className="text-text-muted flex-shrink-0" />
          <span className="text-xs text-text-muted flex-1 truncate">{`nexus.app/watchparty?invite=${inviteCode}`}</span>
          <button onClick={copyInvite} className="text-xs text-violet-400 hover:text-violet-300 font-semibold flex items-center gap-1">
            <Copy size={12} /> {copied ? 'Copié !' : 'Copier'}
          </button>
        </div>
        <Button className="w-full" size="sm">
          <PlusCircle size={14} /> Créer ma Watch Party
        </Button>
      </motion.div>

      {/* Live rooms */}
      <h2 className="text-base font-bold text-text-primary mb-3 flex items-center gap-2">
        <span className="w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
        Rooms actives
      </h2>
      <div className="space-y-3">
        {MOCK_PARTIES.map((party, i) => (
          <motion.div key={party.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
            className="bg-surface-2 border border-white/5 rounded-2xl overflow-hidden flex gap-3 p-3 hover:border-violet-500/20 transition-colors">
            <img src={party.thumbnail} alt={party.title} className="w-24 h-16 object-cover rounded-xl flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-text-primary truncate">{party.title}</p>
              <p className="text-xs text-text-muted">@{party.host}</p>
              <div className="flex items-center gap-3 mt-1">
                <span className="flex items-center gap-1 text-xs text-rose-400">
                  <span className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse" />
                  LIVE
                </span>
                <span className="flex items-center gap-1 text-xs text-text-muted">
                  <Users size={10} /> {party.viewers} spectateurs
                </span>
              </div>
            </div>
            <Button size="sm" variant="outline" onClick={() => setActiveRoom(party)}>Rejoindre</Button>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
