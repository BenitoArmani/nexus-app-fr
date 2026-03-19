'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HelpCircle, MessageSquare, ChevronDown, Send, CheckCircle } from 'lucide-react'
import Button from '@/components/ui/Button'

const FAQ = [
  { q: 'Comment retirer mes gains ?', a: 'Rendez-vous dans l\'onglet "Gains" → "Retirer les fonds". Minimum 10€, frais de 0,50€. Délai : 3-5 jours ouvrés via Stripe.' },
  { q: 'Comment fonctionne le système de commission ?', a: 'NEXUS prélève 10% sur tous les revenus créateurs (abonnements, tips, ventes). Le taux diminue avec votre rang de fidélité (jusqu\'à -15% en rang Légende).' },
  { q: 'Les NEXUS Coins ont-ils une valeur légale ?', a: 'Non, les NEXUS Coins sont une monnaie virtuelle sans valeur légale. Ils ne peuvent pas être convertis en euros. Les achats sont définitifs.' },
  { q: 'Comment signaler un contenu inapproprié ?', a: 'Cliquez sur les 3 points "..." sur n\'importe quel post ou profil, puis "Signaler". Notre IA analyse et notre équipe de modération traite les signalements sous 24h.' },
  { q: 'Comment supprimer mon compte et mes données ?', a: 'Paramètres → Confidentialité → "Supprimer mon compte". Vos données sont effacées sous 30 jours conformément au RGPD. Un export est disponible avant suppression.' },
  { q: 'Comment devenir créateur vérifié ?', a: 'Le badge vérifié est attribué aux créateurs avec +1000 abonnés actifs, un profil complet, et aucune violation des CGU. Demandez-le via votre profil.' },
]

const BOT_RESPONSES: Record<string, string> = {
  retrait: 'Pour retirer vos gains : Onglet Gains → Retirer les fonds. Minimum 10€, délai 3-5 jours.',
  coins: 'Les NEXUS Coins s\'achètent dans l\'onglet "Coins". Packs : 500/1100/2500 coins.',
  abonnement: 'Les abonnements créateur sont disponibles sur chaque profil créateur. 3 formules : 4,99€, 9,99€ et 19,99€/mois.',
  signaler: 'Pour signaler un contenu : cliquez sur "..." → Signaler. Traitement sous 24h.',
  default: 'Je vais transmettre votre question à notre équipe. Temps de réponse habituel : 2-4h en semaine.',
}

interface Message { role: 'user' | 'bot'; content: string }

export default function SupportPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', content: '👋 Bonjour ! Je suis l\'assistant NEXUS. Comment puis-je vous aider ?' }
  ])
  const [input, setInput] = useState('')
  const [ticketSent, setTicketSent] = useState(false)
  const [ticket, setTicket] = useState({ subject: '', message: '' })

  const sendMessage = () => {
    if (!input.trim()) return
    const userMsg: Message = { role: 'user', content: input }
    setMessages(prev => [...prev, userMsg])
    const lowerInput = input.toLowerCase()
    const key = Object.keys(BOT_RESPONSES).find(k => lowerInput.includes(k)) || 'default'
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'bot', content: BOT_RESPONSES[key] }])
    }, 800)
    setInput('')
  }

  const sendTicket = () => {
    if (!ticket.subject || !ticket.message) return
    setTicketSent(true)
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl font-black text-text-primary flex items-center gap-2">
          <HelpCircle size={22} className="text-cyan-400" /> Centre d&apos;aide
        </h1>
        <p className="text-text-muted text-sm mt-0.5">FAQ, chat d&apos;aide et tickets de support</p>
      </motion.div>

      {/* FAQ */}
      <div className="space-y-2 mb-6">
        <h2 className="text-sm font-bold text-text-muted uppercase tracking-wider mb-3">Questions fréquentes</h2>
        {FAQ.map((item, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            className="bg-surface-2 border border-white/5 rounded-2xl overflow-hidden">
            <button className="w-full flex items-center justify-between px-4 py-3 text-left"
              onClick={() => setOpenFaq(openFaq === i ? null : i)}>
              <span className="text-sm font-medium text-text-primary">{item.q}</span>
              <motion.div animate={{ rotate: openFaq === i ? 180 : 0 }} transition={{ duration: 0.2 }}>
                <ChevronDown size={16} className="text-text-muted flex-shrink-0" />
              </motion.div>
            </button>
            <AnimatePresence>
              {openFaq === i && (
                <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                  <p className="px-4 pb-4 text-sm text-text-muted leading-relaxed">{item.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Chat bot */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
          <h2 className="text-sm font-bold text-text-muted uppercase tracking-wider mb-3">Chat instantané</h2>
          <div className="bg-surface-2 border border-white/5 rounded-2xl overflow-hidden" style={{ height: 320 }}>
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5">
              <div className="w-7 h-7 rounded-xl bg-cyan-500/20 flex items-center justify-center text-sm">🤖</div>
              <div>
                <p className="text-xs font-bold text-text-primary">Assistant NEXUS</p>
                <p className="text-[10px] text-emerald-400">Réponse immédiate</p>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-2" style={{ height: 210 }}>
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] px-3 py-2 rounded-2xl text-xs leading-relaxed ${msg.role === 'user' ? 'bg-violet-600 text-white' : 'bg-surface-3 text-text-secondary border border-white/5'}`}>
                    {msg.content}
                  </div>
                </div>
              ))}
            </div>
            <div className="px-3 py-2 border-t border-white/5 flex gap-2">
              <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendMessage()}
                placeholder="Tapez votre question..."
                className="flex-1 bg-surface-3 border border-white/5 rounded-xl px-3 py-1.5 text-xs text-text-primary placeholder:text-text-muted focus:outline-none" />
              <button onClick={sendMessage} className="w-7 h-7 bg-violet-600 rounded-xl flex items-center justify-center text-white">
                <Send size={11} />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Ticket */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
          <h2 className="text-sm font-bold text-text-muted uppercase tracking-wider mb-3">Ticket de support</h2>
          {ticketSent ? (
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6 text-center h-80 flex flex-col items-center justify-center">
              <CheckCircle size={32} className="text-emerald-400 mb-3" />
              <p className="text-sm font-bold text-text-primary">Ticket envoyé !</p>
              <p className="text-xs text-text-muted mt-1">Réponse sous 2-4h en semaine</p>
            </div>
          ) : (
            <div className="bg-surface-2 border border-white/5 rounded-2xl p-4 space-y-3">
              <input value={ticket.subject} onChange={e => setTicket(p => ({ ...p, subject: e.target.value }))}
                placeholder="Sujet du problème"
                className="w-full bg-surface-3 border border-white/5 rounded-xl px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-violet-500/50" />
              <textarea value={ticket.message} onChange={e => setTicket(p => ({ ...p, message: e.target.value }))}
                placeholder="Décrivez votre problème en détail..." rows={6}
                className="w-full bg-surface-3 border border-white/5 rounded-xl px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-violet-500/50 resize-none" />
              <Button className="w-full" onClick={sendTicket} disabled={!ticket.subject || !ticket.message}>
                <MessageSquare size={14} /> Envoyer le ticket
              </Button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
