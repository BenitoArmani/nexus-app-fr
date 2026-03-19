'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Ticket, Users, Clock, Plus, Star } from 'lucide-react'
import Avatar from '@/components/ui/Avatar'
import Button from '@/components/ui/Button'
import { MOCK_USERS } from '@/lib/mock-data'
import { formatEuro } from '@/lib/utils'

const MOCK_EVENTS = [
  { id: 'ev1', creator: MOCK_USERS[2], title: 'Concert Acoustique Live', description: 'Session exclusive acoustique avec Q&A', date: new Date(Date.now() + 86400000 * 3), type: 'concert', price: 9.99, tickets: 450, maxTickets: 500, registered: false },
  { id: 'ev2', creator: MOCK_USERS[1], title: 'Masterclass Next.js 2025', description: '3h de formation intensive avec projets pratiques', date: new Date(Date.now() + 86400000 * 7), type: 'masterclass', price: 29.99, tickets: 120, maxTickets: 200, registered: true },
  { id: 'ev3', creator: MOCK_USERS[0], title: 'Behind the Scenes — Mode', description: 'Découvrez les coulisses de ma collection capsule', date: new Date(Date.now() + 86400000 * 14), type: 'conference', price: 4.99, tickets: 800, maxTickets: 1000, registered: false },
  { id: 'ev4', creator: MOCK_USERS[3], title: 'Workshop Photo Nature', description: '2h de workshop photo en forêt + post-traitement', date: new Date(Date.now() + 86400000 * 21), type: 'workshop', price: 19.99, tickets: 25, maxTickets: 30, registered: false },
]

const TYPE_CONFIG: Record<string, { emoji: string; color: string }> = {
  concert: { emoji: '🎵', color: 'text-rose-400' },
  masterclass: { emoji: '🎓', color: 'text-cyan-400' },
  conference: { emoji: '🎤', color: 'text-violet-400' },
  workshop: { emoji: '🛠️', color: 'text-amber-400' },
}

export default function EventsPage() {
  const [events, setEvents] = useState(MOCK_EVENTS)

  const register = (id: string) => {
    setEvents(prev => prev.map(e => e.id === id ? { ...e, registered: !e.registered, tickets: e.registered ? e.tickets - 1 : e.tickets + 1 } : e))
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-text-primary flex items-center gap-2">
            <Calendar size={22} className="text-violet-400" /> Événements virtuels
          </h1>
          <p className="text-text-muted text-sm mt-0.5">Concerts, masterclass, workshops — tout en direct</p>
        </div>
        <Button size="sm" variant="outline">
          <Plus size={13} /> Créer un événement
        </Button>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {events.map((event, i) => {
          const cfg = TYPE_CONFIG[event.type]
          const spotsLeft = event.maxTickets - event.tickets
          const pct = (event.tickets / event.maxTickets) * 100
          return (
            <motion.div key={event.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className={`bg-surface-2 border rounded-2xl overflow-hidden transition-colors ${event.registered ? 'border-violet-500/30' : 'border-white/5 hover:border-white/10'}`}>
              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-2xl">{cfg.emoji}</span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full capitalize ${cfg.color} bg-violet-500/10`}>
                    {event.type}
                  </span>
                </div>
                <h3 className="text-base font-bold text-text-primary mb-1">{event.title}</h3>
                <p className="text-xs text-text-muted mb-3 leading-relaxed">{event.description}</p>
                <div className="flex items-center gap-2 mb-3">
                  <Avatar src={event.creator.avatar_url} name={event.creator.full_name} size="xs" />
                  <span className="text-xs text-text-muted">par {event.creator.username}</span>
                </div>
                <div className="flex items-center gap-4 text-xs text-text-muted mb-3">
                  <span className="flex items-center gap-1"><Clock size={10} /> {event.date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                  <span className="flex items-center gap-1"><Users size={10} /> {event.tickets}/{event.maxTickets}</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full mb-3">
                  <div className={`h-full rounded-full transition-all ${pct > 80 ? 'bg-rose-500' : 'bg-violet-500'}`} style={{ width: `${pct}%` }} />
                </div>
                {spotsLeft <= 10 && <p className="text-xs text-rose-400 font-semibold mb-2">⚡ Plus que {spotsLeft} places !</p>}
                <div className="flex items-center justify-between">
                  <span className="text-lg font-black text-text-primary">{formatEuro(event.price)}</span>
                  <Button size="sm" onClick={() => register(event.id)} variant={event.registered ? 'danger' : 'primary'}>
                    {event.registered ? <><Star size={12} fill="currentColor" /> Inscrit</> : <><Ticket size={12} /> S&apos;inscrire</>}
                  </Button>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
