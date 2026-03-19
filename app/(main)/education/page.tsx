'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { BookOpen, Star, Users, Clock, Brain, CheckCircle, XCircle } from 'lucide-react'
import Image from 'next/image'
import Button from '@/components/ui/Button'
import { useEducation } from '@/hooks/useEducation'
import { formatNumber, formatEuro } from '@/lib/utils'

const AI_MESSAGES_INIT = [
  { role: 'assistant', content: "Bonjour ! Je suis ton tuteur IA NEXUS 🎓 Pose-moi n'importe quelle question sur n'importe quel sujet !" },
]

export default function EducationPage() {
  const { courses, categories, selectedCategory, setSelectedCategory, quiz, quizActive, setQuizActive, quizIndex, quizScore, quizAnswered, answerQuiz } = useEducation()
  const [aiInput, setAiInput] = useState('')
  const [aiMessages, setAiMessages] = useState(AI_MESSAGES_INIT)
  const [activeTab, setActiveTab] = useState<'courses' | 'quiz' | 'ai'>('courses')

  const sendAI = () => {
    if (!aiInput.trim()) return
    const userMsg = { role: 'user', content: aiInput }
    setAiMessages(prev => [...prev, userMsg])
    const question = aiInput
    setAiInput('')
    // Réponse IA simulée
    setTimeout(() => {
      setAiMessages(prev => [...prev, {
        role: 'assistant',
        content: `Excellente question sur "${question}" ! 🤔 Pour t'expliquer ça simplement : c'est un sujet fascinant qui mérite une exploration approfondie. Je te recommande de commencer par les bases, puis de progresser vers les concepts avancés. Tu peux aussi retrouver nos cours dédiés dans l'onglet Cours ! 📚`
      }])
    }, 800)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-text-primary flex items-center gap-2">
            <BookOpen size={22} className="text-cyan-400" /> Éducation
          </h1>
          <p className="text-text-muted text-sm mt-0.5">Cours, quiz interactifs & tuteur IA</p>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {[
          { id: 'courses', label: '📚 Cours' },
          { id: 'quiz', label: '🧠 Quiz' },
          { id: 'ai', label: '🤖 Tuteur IA' },
        ].map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id as 'courses' | 'quiz' | 'ai')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${activeTab === t.id ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'text-text-muted hover:bg-white/5'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === 'courses' && (
        <>
          <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-none">
            {categories.map(cat => (
              <button key={cat} onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors flex-shrink-0 ${selectedCategory === cat ? 'bg-cyan-500 text-white' : 'bg-surface-2 text-text-muted hover:bg-white/5 border border-white/5'}`}>
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.map((course, i) => (
              <motion.div key={course.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                className="bg-surface-2 border border-white/5 rounded-2xl overflow-hidden hover:border-cyan-500/30 transition-colors group cursor-pointer">
                <div className="relative aspect-video">
                  <Image src={course.thumbnail} alt={course.title} fill className="object-cover" unoptimized />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <span className={`absolute top-2 left-2 text-[10px] font-bold px-2 py-1 rounded-xl ${course.level === 'débutant' ? 'bg-emerald-500/80 text-white' : course.level === 'intermédiaire' ? 'bg-amber-500/80 text-white' : 'bg-rose-500/80 text-white'}`}>
                    {course.level}
                  </span>
                  {course.is_free && (
                    <span className="absolute top-2 right-2 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">GRATUIT</span>
                  )}
                </div>
                <div className="p-4">
                  <p className="text-xs text-cyan-400 font-medium mb-1">{course.category}</p>
                  <h3 className="text-sm font-bold text-text-primary line-clamp-2 mb-2 group-hover:text-cyan-400 transition-colors">{course.title}</h3>
                  <p className="text-xs text-text-muted mb-3">par {course.instructor}</p>
                  <div className="flex items-center gap-3 text-xs text-text-muted mb-3">
                    <span className="flex items-center gap-1"><Star size={10} className="text-amber-400" />{course.rating}</span>
                    <span className="flex items-center gap-1"><Users size={10} />{formatNumber(course.students)}</span>
                    <span className="flex items-center gap-1"><Clock size={10} />{course.duration_hours}h</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-black ${course.is_free ? 'text-emerald-400' : 'text-text-primary'}`}>
                      {course.is_free ? 'Gratuit' : formatEuro(course.price)}
                    </span>
                    <Button size="sm" variant={course.is_free ? 'primary' : 'outline'}>
                      {course.is_free ? 'Commencer' : 'Acheter'}
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </>
      )}

      {activeTab === 'quiz' && (
        <div className="max-w-lg mx-auto">
          {!quizActive ? (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="bg-surface-2 border border-white/5 rounded-2xl p-8 text-center">
              <Brain size={48} className="text-cyan-400 mx-auto mb-4" />
              <h2 className="text-xl font-black text-text-primary mb-2">Quiz interactif</h2>
              <p className="text-text-muted text-sm mb-6">{quiz.length} questions — Gagne des NEXUS Coins en jouant !</p>
              <div className="flex justify-center gap-4 text-sm text-text-muted mb-6">
                <span>🎯 {quiz.length} questions</span>
                <span>⏱️ ~2 min</span>
                <span>🪙 +100 coins</span>
              </div>
              <Button size="lg" onClick={() => setQuizActive(true)} className="w-full">
                Commencer le quiz
              </Button>
            </motion.div>
          ) : (
            <motion.div key={quizIndex} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
              className="bg-surface-2 border border-white/5 rounded-2xl p-6">
              <div className="flex justify-between text-xs text-text-muted mb-4">
                <span>Question {quizIndex + 1}/{quiz.length}</span>
                <span>Score: {quizScore}/{quizIndex}</span>
              </div>
              <div className="h-1 bg-white/5 rounded-full mb-6">
                <div className="h-full bg-cyan-500 rounded-full transition-all" style={{ width: `${((quizIndex + 1) / quiz.length) * 100}%` }} />
              </div>
              <h3 className="text-base font-bold text-text-primary mb-5">{quiz[quizIndex].question}</h3>
              <div className="space-y-2">
                {quiz[quizIndex].options.map((opt, i) => {
                  const isCorrect = i === quiz[quizIndex].correct
                  const isSelected = quizAnswered === i
                  return (
                    <motion.button key={i} whileTap={{ scale: 0.98 }}
                      onClick={() => quizAnswered === null && answerQuiz(i)}
                      disabled={quizAnswered !== null}
                      className={`w-full text-left px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                        quizAnswered === null ? 'border-white/10 hover:border-cyan-500/50 hover:bg-cyan-500/5 text-text-primary'
                        : isCorrect ? 'border-emerald-500 bg-emerald-500/20 text-emerald-400'
                        : isSelected ? 'border-rose-500 bg-rose-500/20 text-rose-400'
                        : 'border-white/5 text-text-muted'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{opt}</span>
                        {quizAnswered !== null && isCorrect && <CheckCircle size={16} className="text-emerald-400" />}
                        {quizAnswered !== null && isSelected && !isCorrect && <XCircle size={16} className="text-rose-400" />}
                      </div>
                    </motion.button>
                  )
                })}
              </div>
              {quizAnswered !== null && (
                <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                  className={`mt-4 p-3 rounded-xl text-xs ${quizAnswered === quiz[quizIndex].correct ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                  💡 {quiz[quizIndex].explanation}
                </motion.div>
              )}
            </motion.div>
          )}
        </div>
      )}

      {activeTab === 'ai' && (
        <div className="max-w-lg mx-auto">
          <div className="bg-surface-2 border border-white/5 rounded-2xl overflow-hidden" style={{ height: '500px', display: 'flex', flexDirection: 'column' }}>
            <div className="flex items-center gap-3 px-4 py-3 border-b border-white/5 bg-surface-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500 to-violet-500 flex items-center justify-center text-white text-sm">🤖</div>
              <div>
                <p className="text-sm font-bold text-text-primary">Tuteur IA NEXUS</p>
                <p className="text-xs text-emerald-400">En ligne • Répond instantanément</p>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {aiMessages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${msg.role === 'user' ? 'bg-cyan-500/20 text-cyan-100 border border-cyan-500/30' : 'bg-surface-3 text-text-secondary border border-white/5'}`}>
                    {msg.content}
                  </div>
                </div>
              ))}
            </div>
            <div className="px-4 py-3 border-t border-white/5">
              <div className="flex gap-2">
                <input value={aiInput} onChange={e => setAiInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendAI()}
                  placeholder="Pose une question..."
                  className="flex-1 bg-surface-3 border border-white/5 rounded-xl px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-cyan-500/50" />
                <Button size="sm" onClick={sendAI} disabled={!aiInput.trim()}>Envoyer</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
