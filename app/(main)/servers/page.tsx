'use client'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Hash, Volume2, Users, Shield, Crown, BookOpen, CheckCircle2, Circle, Lock, Play, FileText, ChevronDown } from 'lucide-react'
import ServerSidebar from '@/components/servers/ServerSidebar'
import ChannelList from '@/components/servers/ChannelList'
import Avatar from '@/components/ui/Avatar'
import Badge from '@/components/ui/Badge'
import { MOCK_SERVERS, MOCK_USERS } from '@/lib/mock-data'
import { timeAgo, formatNumber } from '@/lib/utils'
import type { Server, Channel } from '@/types'

/* ─── Mock messages ─── */
const MOCK_SERVER_MESSAGES = [
  { id: 1, user: MOCK_USERS[0], content: 'Bienvenue sur le serveur NEXUS ! 🚀', created_at: new Date(Date.now() - 3600000 * 5).toISOString(), role: 'admin' as const },
  { id: 2, user: MOCK_USERS[1], content: 'Merci ! Content d\'être là. Des tips pour bien démarrer ?', created_at: new Date(Date.now() - 3600000 * 4).toISOString(), role: 'member' as const },
  { id: 3, user: MOCK_USERS[2], content: 'Commencez par remplir votre profil et poster votre premier reel 🎵', created_at: new Date(Date.now() - 3600000 * 3).toISOString(), role: 'creator' as const },
  { id: 4, user: MOCK_USERS[3], content: 'J\'ai gagné mes premiers 50€ en une semaine ici !', created_at: new Date(Date.now() - 3600000 * 2).toISOString(), role: 'member' as const },
  { id: 5, user: MOCK_USERS[0], content: 'Incroyable ! Continue comme ça 💜 @lucas_photo', created_at: new Date(Date.now() - 3600000).toISOString(), role: 'admin' as const },
]

const ROLE_BADGES = {
  admin:   { label: 'Admin',    icon: Crown,  color: 'text-amber-400',  bg: 'bg-amber-500/20'  },
  creator: { label: 'Créateur', icon: Shield, color: 'text-violet-400', bg: 'bg-violet-500/20' },
  member:  { label: 'Membre',   icon: Users,  color: 'text-cyan-400',   bg: 'bg-cyan-500/20'   },
}

/* ─── Mock course data ─── */
interface Lesson {
  id: string
  title: string
  duration: string
  type: 'video' | 'text' | 'quiz'
  free: boolean
}

interface CourseModule {
  id: string
  title: string
  lessons: Lesson[]
}

const MOCK_COURSES: Record<string, { title: string; instructor: typeof MOCK_USERS[0]; enrolled: number; modules: CourseModule[] }> = {
  cours: {
    title: 'Créer et monétiser son contenu',
    instructor: MOCK_USERS[0],
    enrolled: 847,
    modules: [
      {
        id: 'm1',
        title: 'Module 1 — Les bases',
        lessons: [
          { id: 'l1', title: 'Introduction & objectifs du cours', duration: '8 min',  type: 'video', free: true  },
          { id: 'l2', title: 'Choisir sa niche et son audience',  duration: '12 min', type: 'video', free: true  },
          { id: 'l3', title: 'Définir sa ligne éditoriale',       duration: '10 min', type: 'text',  free: false },
        ],
      },
      {
        id: 'm2',
        title: 'Module 2 — Créer du contenu qui cartonne',
        lessons: [
          { id: 'l4', title: 'La structure d\'un post viral',     duration: '15 min', type: 'video', free: false },
          { id: 'l5', title: 'Scripts et accroches efficaces',    duration: '18 min', type: 'video', free: false },
          { id: 'l6', title: 'Quiz — Teste tes connaissances',    duration: '5 min',  type: 'quiz',  free: false },
        ],
      },
      {
        id: 'm3',
        title: 'Module 3 — Monétisation',
        lessons: [
          { id: 'l7', title: 'Abonnements et contenu premium',    duration: '20 min', type: 'video', free: false },
          { id: 'l8', title: 'Partenariats et sponsors',          duration: '14 min', type: 'video', free: false },
          { id: 'l9', title: 'GLYPHS et revenus pub',             duration: '11 min', type: 'video', free: false },
        ],
      },
    ],
  },
}

const LESSON_ICONS = { video: Play, text: FileText, quiz: BookOpen }

function CourseView({ channelName }: { channelName: string }) {
  const course    = MOCK_COURSES[channelName] ?? MOCK_COURSES['cours']
  const allLessons = course.modules.flatMap(m => m.lessons)
  const [completed, setCompleted] = useState<Set<string>>(new Set(['l1', 'l2']))
  const [openModules, setOpenModules] = useState<Set<string>>(new Set(['m1', 'm2']))
  const [subscribed] = useState(false)

  const toggleLesson  = (id: string) => setCompleted(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s })
  const toggleModule  = (id: string) => setOpenModules(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s })

  const progressPct = Math.round((completed.size / allLessons.length) * 100)

  return (
    <div className="flex-1 overflow-y-auto p-5 space-y-5">
      {/* Course header */}
      <div className="bg-gradient-to-r from-violet-600/15 to-cyan-600/10 border border-violet-500/20 rounded-2xl p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <p className="text-xs text-violet-400 font-bold uppercase tracking-wider mb-1">Cours en ligne</p>
            <h2 className="text-lg font-black text-white mb-2">{course.title}</h2>
            <div className="flex items-center gap-3">
              <Avatar src={course.instructor.avatar_url} name={course.instructor.full_name} size="xs" />
              <span className="text-xs text-zinc-400">{course.instructor.full_name}</span>
              <span className="text-xs text-zinc-600">·</span>
              <span className="text-xs text-zinc-400">{formatNumber(course.enrolled)} élèves</span>
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-2xl font-black text-white">{progressPct}%</p>
            <p className="text-xs text-zinc-500">complété</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4 h-2 bg-zinc-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-violet-500 to-cyan-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>
        <p className="text-xs text-zinc-600 mt-1">{completed.size}/{allLessons.length} leçons</p>
      </div>

      {/* Modules */}
      {course.modules.map((mod, mi) => (
        <div key={mod.id} className="border border-white/5 rounded-2xl overflow-hidden">
          <button
            onClick={() => toggleModule(mod.id)}
            className="w-full flex items-center justify-between px-4 py-3 bg-zinc-900/50 hover:bg-zinc-900/80 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${
                mod.lessons.every(l => completed.has(l.id)) ? 'bg-emerald-500/20 text-emerald-400' : 'bg-zinc-700 text-zinc-400'
              }`}>
                {mod.lessons.every(l => completed.has(l.id)) ? '✓' : mi + 1}
              </div>
              <span className="text-sm font-semibold text-white">{mod.title}</span>
              <span className="text-xs text-zinc-600">{mod.lessons.length} leçons</span>
            </div>
            <ChevronDown size={16} className={`text-zinc-500 transition-transform ${openModules.has(mod.id) ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence initial={false}>
            {openModules.has(mod.id) && (
              <motion.div
                initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="divide-y divide-white/5">
                  {mod.lessons.map(lesson => {
                    const Icon = LESSON_ICONS[lesson.type]
                    const done = completed.has(lesson.id)
                    const locked = !lesson.free && !subscribed && !done && lesson.id !== 'l1' && lesson.id !== 'l2'

                    return (
                      <motion.div
                        key={lesson.id}
                        className={`flex items-center gap-3 px-4 py-3 transition-colors ${
                          locked ? 'opacity-50' : 'hover:bg-white/[0.02] cursor-pointer'
                        }`}
                        onClick={() => !locked && toggleLesson(lesson.id)}
                      >
                        <button className="flex-shrink-0">
                          {done
                            ? <CheckCircle2 size={18} className="text-emerald-400" />
                            : locked
                            ? <Lock size={18} className="text-zinc-600" />
                            : <Circle size={18} className="text-zinc-600" />
                          }
                        </button>
                        <div className={`w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 ${
                          lesson.type === 'video' ? 'bg-violet-500/15 text-violet-400'
                          : lesson.type === 'quiz' ? 'bg-amber-500/15 text-amber-400'
                          : 'bg-cyan-500/15 text-cyan-400'
                        }`}>
                          <Icon size={13} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium truncate ${done ? 'text-zinc-500 line-through' : 'text-white'}`}>
                            {lesson.title}
                          </p>
                          <p className="text-xs text-zinc-600">{lesson.duration}</p>
                        </div>
                        {lesson.free && (
                          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full flex-shrink-0">
                            Gratuit
                          </span>
                        )}
                        {locked && (
                          <span className="text-[10px] font-bold text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded-full flex-shrink-0">
                            Abonné
                          </span>
                        )}
                      </motion.div>
                    )
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}

      {/* Subscribe CTA if not subscribed */}
      {!subscribed && (
        <div className="border border-violet-500/20 bg-violet-500/5 rounded-2xl p-5 text-center">
          <Lock size={24} className="text-violet-400 mx-auto mb-2" />
          <p className="text-sm font-bold text-white mb-1">Débloquer tout le cours</p>
          <p className="text-xs text-zinc-400 mb-4">Abonne-toi à {course.instructor.full_name} pour accéder aux {allLessons.filter(l => !l.free).length} leçons restantes</p>
          <button className="px-6 py-2.5 bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-xl text-sm transition-colors">
            S'abonner — 4,99 €/mois
          </button>
        </div>
      )}
    </div>
  )
}

/* ─── Main page ─── */
export default function ServersPage() {
  const [activeServer,  setActiveServer]  = useState<Server>(MOCK_SERVERS[0])
  const [activeChannel, setActiveChannel] = useState<Channel | null>(null)
  const [input,  setInput]   = useState('')
  const [messages, setMessages] = useState(MOCK_SERVER_MESSAGES)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  const sendMessage = () => {
    if (!input.trim()) return
    setMessages(prev => [...prev, { id: Date.now(), user: MOCK_USERS[4], content: input, created_at: new Date().toISOString(), role: 'member' as const }])
    setInput('')
  }

  const isCourse = activeChannel?.name === 'cours' || activeChannel?.name?.startsWith('📚')

  return (
    <div className="flex h-[calc(100vh-56px)]">
      <ServerSidebar activeServer={activeServer} onSelect={setActiveServer} />
      <ChannelList server={activeServer} activeChannel={activeChannel} onSelect={setActiveChannel} />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Channel header */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-surface-2 flex-shrink-0">
          {isCourse
            ? <BookOpen size={16} className="text-violet-400" />
            : activeChannel?.type === 'voice'
            ? <Volume2 size={16} className="text-text-muted" />
            : <Hash size={16} className="text-text-muted" />
          }
          <span className="text-sm font-semibold text-text-primary">{activeChannel?.name || 'général'}</span>
          {isCourse && <span className="text-xs bg-violet-500/15 text-violet-400 px-2 py-0.5 rounded-full font-medium">Cours</span>}
          <div className="ml-auto flex items-center gap-2 text-xs text-text-muted">
            <Users size={13} />
            <span>{activeServer.members_count.toLocaleString('fr-FR')} membres</span>
          </div>
        </div>

        {/* Content — course view OR chat */}
        {isCourse ? (
          <CourseView channelName={activeChannel?.name ?? 'cours'} />
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map(msg => {
                const roleInfo = ROLE_BADGES[msg.role]
                const RoleIcon = roleInfo.icon
                return (
                  <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex gap-3">
                    <Avatar src={msg.user.avatar_url} name={msg.user.full_name} size="md" />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-semibold text-text-primary">{msg.user.full_name}</span>
                        <span className={`inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full ${roleInfo.bg} ${roleInfo.color}`}>
                          <RoleIcon size={9} />{roleInfo.label}
                        </span>
                        <span className="text-[11px] text-text-muted">{timeAgo(msg.created_at)}</span>
                      </div>
                      <p className="text-sm text-text-secondary leading-relaxed">{msg.content}</p>
                    </div>
                  </motion.div>
                )
              })}
              <div ref={bottomRef} />
            </div>

            <div className="px-4 py-3 border-t border-white/5 flex-shrink-0">
              <div className="flex items-center gap-2 bg-surface-2 border border-white/5 rounded-2xl px-4 py-2.5">
                <input type="text" value={input} onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendMessage()}
                  placeholder={`Message #${activeChannel?.name || 'général'}`}
                  className="flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-muted focus:outline-none"
                />
                <motion.button whileTap={{ scale: 0.85 }} onClick={sendMessage} disabled={!input.trim()}
                  className="w-8 h-8 bg-violet-600 hover:bg-violet-500 disabled:opacity-40 rounded-xl flex items-center justify-center text-white transition-colors">
                  <Send size={14} />
                </motion.button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Members panel */}
      <div className="hidden xl:flex flex-col w-52 border-l border-white/5 bg-surface-2 py-4 flex-shrink-0">
        <p className="px-4 text-[10px] font-bold text-text-muted uppercase tracking-wider mb-3">En ligne — 24</p>
        <div className="space-y-1 px-2">
          {MOCK_USERS.map(user => (
            <div key={user.id} className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-white/5 cursor-pointer">
              <Avatar src={user.avatar_url} name={user.full_name} size="xs" online />
              <span className="text-xs text-text-secondary truncate">{user.username}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
