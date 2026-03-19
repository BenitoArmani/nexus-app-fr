'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { Crown, Users, TrendingUp, Play, Zap, ArrowRight, Check, Star, ChevronDown } from 'lucide-react'
import { NexusHexIcon } from '@/components/ui/NexusLogo'

const MOCK_MEMBERS = 312
const MILESTONE    = 500     // fondateurs milestone
const AD_CPM       = 60      // € pour 1 000 vues rewarded video FR
const FOUNDER_PCT  = 50      // % reversé au lancement
const QUOTA_OPTIONS = [5, 10, 20, 30] as const

const TESTIMONIALS = [
  { name: 'Karim M.',  text: 'J\'ai gagné 12 € la première semaine juste en regardant des pubs pendant ma pause.',  avatar: '8'  },
  { name: 'Léa D.',    text: 'J\'ai parrainé 6 amis en 3 jours. Ça fait 3 000 ⬡ sans rien faire de spécial.',       avatar: '25' },
  { name: 'Hugo V.',   text: 'L\'offre Fondateur 50/50 c\'est du jamais vu. Je reste tant que ça dure.',             avatar: '20' },
]

const COMPARE = [
  { name: 'Instagram',  pays: false, partage: false, parrainage: false },
  { name: 'TikTok',     pays: false, partage: false, parrainage: false },
  { name: 'YouTube',    pays: true,  partage: false, parrainage: false, note: 'créateurs seulement' },
  { name: 'NEXUS',      pays: true,  partage: true,  parrainage: true,  highlight: true },
]

function EarningsCalc() {
  const [quota, setQuota] = useState<number>(10)
  const perAd    = (AD_CPM / 1000) * (FOUNDER_PCT / 100)   // 0.03 €
  const perDay   = +(quota * perAd).toFixed(2)
  const perWeek  = +(perDay * 7).toFixed(2)
  const perMonth = +(perDay * 30).toFixed(2)

  return (
    <div className="bg-zinc-900/80 border border-violet-500/20 rounded-3xl p-6">
      <p className="text-sm font-bold text-white mb-1">Calcule tes gains</p>
      <p className="text-xs text-zinc-500 mb-4">Offre Fondateur — tu gardes 50% des revenus pub</p>

      <p className="text-xs text-zinc-400 mb-2">Pubs par jour que tu veux regarder :</p>
      <div className="flex gap-2 mb-5">
        {QUOTA_OPTIONS.map(q => (
          <button
            key={q}
            onClick={() => setQuota(q)}
            className={`flex-1 py-2.5 rounded-2xl text-sm font-bold transition-all ${
              quota === q
                ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/25'
                : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
            }`}
          >
            {q}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Par jour',   value: perDay   },
          { label: 'Par semaine', value: perWeek  },
          { label: 'Par mois',   value: perMonth },
        ].map(({ label, value }) => (
          <div key={label} className="bg-zinc-800/60 rounded-2xl p-3 text-center">
            <p className="text-lg font-black text-emerald-400">{value.toFixed(2)} €</p>
            <p className="text-[11px] text-zinc-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      <p className="text-[10px] text-zinc-600 mt-3 text-center">
        Basé sur CPM 60 €/1 000 vues · rewarded video · taux France · offre Fondateur
      </p>
    </div>
  )
}

export default function LandingPage() {
  const [membersDisplay, setMembersDisplay] = useState(MOCK_MEMBERS)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  /* Fake live counter — gives impression of real-time growth */
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) setMembersDisplay(n => n + 1)
    }, 8000)
    return () => clearInterval(interval)
  }, [])

  const progress = Math.round((membersDisplay / MILESTONE) * 100)

  return (
    <div className="min-h-screen bg-[#0a0a12] text-white overflow-x-hidden">

      {/* Background glows */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-violet-700/8 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-0 w-80 h-80 bg-cyan-600/6 rounded-full blur-3xl" />
        <div className="absolute top-2/3 left-0 w-64 h-64 bg-emerald-600/5 rounded-full blur-3xl" />
      </div>

      {/* ── NAV ── */}
      <nav className="relative flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
        <div className="flex items-center gap-2.5">
          <NexusHexIcon size={36} />
          <span className="font-black text-xl tracking-tight"
            style={{ background: 'linear-gradient(135deg,#a78bfa 0%,#38bdf8 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            NEXUS
          </span>
        </div>
        <div className="flex gap-3 items-center">
          <Link href="/login" className="text-sm text-zinc-400 hover:text-white transition-colors hidden sm:block">
            Connexion
          </Link>
          <Link href="/register">
            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              className="px-5 py-2 bg-violet-600 hover:bg-violet-500 text-white text-sm font-bold rounded-xl transition-colors shadow-lg shadow-violet-600/25">
              Rejoindre gratuitement
            </motion.button>
          </Link>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative px-6 pt-12 pb-16 max-w-5xl mx-auto text-center">

        {/* Founder badge */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/25 rounded-full px-4 py-1.5 mb-6">
          <Crown size={13} className="text-amber-400" />
          <span className="text-xs font-bold text-amber-300">
            Offre Fondateur 50/50 · {MILESTONE - membersDisplay} places restantes
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="text-5xl sm:text-7xl font-black leading-[1.05] mb-5"
        >
          <span className="text-white">Tu scrolles.</span>
          <br />
          <span style={{ background: 'linear-gradient(135deg,#a78bfa,#34d399)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            Tu gagnes.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="text-lg text-zinc-400 max-w-xl mx-auto mb-8 leading-relaxed"
        >
          NEXUS est le premier réseau social qui te paie pour regarder des pubs.
          Jusqu'à <span className="text-white font-bold">54 €/mois</span> en faisant ce que tu fais déjà sur Instagram.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-3 justify-center mb-6"
        >
          <Link href="/register">
            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              className="px-8 py-4 bg-gradient-to-r from-violet-600 to-cyan-500 text-white font-bold rounded-2xl text-base shadow-xl shadow-violet-600/25 flex items-center gap-2">
              Rejoindre gratuitement <ArrowRight size={18} />
            </motion.button>
          </Link>
          <Link href="/feed">
            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold rounded-2xl text-base flex items-center gap-2">
              <Play size={16} /> Voir la démo
            </motion.button>
          </Link>
        </motion.div>

        {/* Social proof micro */}
        <p className="text-xs text-zinc-600">Gratuit pour toujours · Aucune carte requise · Paiement chaque semaine</p>
      </section>

      {/* ── LIVE MEMBER COUNTER ── */}
      <section className="relative px-6 pb-16 max-w-xl mx-auto">
        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }}
          className="bg-zinc-900/80 border border-white/8 rounded-3xl p-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="relative flex w-2.5 h-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full w-2.5 h-2.5 bg-emerald-500" />
            </span>
            <p className="text-sm text-zinc-400">Membres fondateurs en ligne</p>
          </div>

          <motion.p
            key={membersDisplay}
            initial={{ scale: 1.15, color: '#a78bfa' }}
            animate={{ scale: 1, color: '#ffffff' }}
            transition={{ duration: 0.4 }}
            className="text-5xl font-black text-white mb-2"
          >
            {membersDisplay.toLocaleString('fr-FR')}
          </motion.p>

          <p className="text-xs text-zinc-500 mb-4">
            Objectif fondateurs : <span className="text-amber-400 font-bold">{MILESTONE}</span> — débloque le streaming
          </p>

          {/* Progress */}
          <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1.2, ease: 'easeOut', delay: 0.5 }}
              className="h-full bg-gradient-to-r from-violet-500 to-amber-400 rounded-full"
            />
          </div>
          <p className="text-xs text-zinc-600 mt-2">{progress}% · encore {MILESTONE - membersDisplay} places</p>

          <Link href="/roadmap">
            <p className="text-xs text-violet-400 hover:text-violet-300 mt-3 transition-colors">Voir ce qui se débloque →</p>
          </Link>
        </motion.div>
      </section>

      {/* ── EARNINGS CALCULATOR ── */}
      <section className="relative px-6 pb-20 max-w-xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <p className="text-center text-xs text-zinc-600 uppercase tracking-widest mb-4">Calcule ce que tu gagnes</p>
          <EarningsCalc />
        </motion.div>
      </section>

      {/* ── FOR WHOM ── */}
      <section className="relative px-6 pb-20 max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <p className="text-center text-xs text-zinc-600 uppercase tracking-widest mb-3">Pour qui ?</p>
          <h2 className="text-2xl font-black text-center mb-8">
            Un outil pour chacun
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">

            {/* Créateurs */}
            <div className="bg-zinc-900/60 border border-violet-500/20 rounded-3xl p-6">
              <div className="text-3xl mb-3">🎨</div>
              <h3 className="text-lg font-black text-white mb-1">Créateurs & Influenceurs</h3>
              <p className="text-sm text-zinc-400 mb-4 leading-relaxed">Posts, Reels, stories, abonnements. Tu publies, tu gagnes — en GLYPHS et en vraie monnaie.</p>
              <ul className="space-y-2">
                {['Monétisation dès le 1er abonné', 'Pub récompensée 50/50 au lancement', 'Parrainage multi-paliers', 'Prédictions & paris'].map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm text-zinc-300">
                    <Check size={13} className="text-violet-400 flex-shrink-0" /> {f}
                  </li>
                ))}
              </ul>
            </div>

            {/* Enseignants */}
            <div className="bg-zinc-900/60 border border-cyan-500/20 rounded-3xl p-6 relative">
              <div className="absolute top-4 right-4 text-[10px] font-bold bg-cyan-500/15 text-cyan-400 border border-cyan-500/20 px-2 py-1 rounded-full">
                Nouveau ✨
              </div>
              <div className="text-3xl mb-3">🎓</div>
              <h3 className="text-lg font-black text-white mb-1">Enseignants & Formateurs</h3>
              <p className="text-sm text-zinc-400 mb-4 leading-relaxed">Crée ta communauté d'élèves, publie tes cours en modules, monétise ton savoir sans intermédiaire.</p>
              <ul className="space-y-2">
                {['Cours structurés avec progression', 'Serveur privé pour ta classe', 'Abonnements élèves (4,99 → 19,99 €/mois)', 'Live dès 500 membres sur NEXUS'].map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm text-zinc-300">
                    <Check size={13} className="text-cyan-400 flex-shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              <div className="mt-4 p-3 bg-cyan-500/5 border border-cyan-500/10 rounded-xl">
                <p className="text-xs text-cyan-400 font-semibold">💡 Exemple concret</p>
                <p className="text-xs text-zinc-400 mt-0.5">Un prof avec 30 élèves à 9,99 €/mois = <span className="text-white font-bold">299 €/mois</span> de revenus récurrents.</p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── COMPARISON ── */}
      <section className="relative px-6 pb-20 max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-2xl font-black text-center mb-8">
            Les autres te volent ton attention.<br />
            <span style={{ background: 'linear-gradient(135deg,#a78bfa,#34d399)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Nous te la payons.
            </span>
          </h2>

          <div className="bg-zinc-900/60 border border-white/8 rounded-3xl overflow-hidden">
            <div className="grid grid-cols-4 text-xs text-zinc-500 px-4 py-3 border-b border-white/5">
              <span>Plateforme</span>
              <span className="text-center">Te paie</span>
              <span className="text-center">50% revenus</span>
              <span className="text-center">Parrainage</span>
            </div>
            {COMPARE.map((row, i) => (
              <motion.div
                key={row.name}
                initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className={`grid grid-cols-4 px-4 py-3.5 border-b border-white/5 last:border-0 ${row.highlight ? 'bg-violet-500/8' : ''}`}
              >
                <span className={`text-sm font-bold ${row.highlight ? 'text-violet-400' : 'text-zinc-300'}`}>
                  {row.highlight && '⬡ '}{row.name}
                  {row.note && <span className="text-[10px] text-zinc-600 block">{row.note}</span>}
                </span>
                {[row.pays, row.partage, row.parrainage].map((v, j) => (
                  <div key={j} className="flex justify-center items-center">
                    {v
                      ? <Check size={16} className={row.highlight ? 'text-emerald-400' : 'text-zinc-500'} />
                      : <span className="text-zinc-700 text-sm">✗</span>
                    }
                  </div>
                ))}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── REFERRAL SECTION ── */}
      <section className="relative px-6 pb-20 max-w-xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="bg-gradient-to-br from-violet-600/15 to-cyan-600/10 border border-violet-500/20 rounded-3xl p-7 text-center">
          <div className="text-4xl mb-4">🎁</div>
          <h2 className="text-xl font-black mb-2">Invite tes amis, gagne plus</h2>
          <p className="text-sm text-zinc-400 mb-5 leading-relaxed">
            Pour chaque ami qui rejoint NEXUS via ton lien :<br />
            toi <span className="text-violet-400 font-bold">+500 ⬡</span> · lui <span className="text-cyan-400 font-bold">+200 ⬡</span> offerts à l'inscription
          </p>

          <div className="grid grid-cols-3 gap-3 mb-5">
            {[
              { friends: 3,  reward: '1 500 ⬡', bonus: '' },
              { friends: 10, reward: '5 000 ⬡', bonus: '+ Badge Ambassadeur' },
              { friends: 25, reward: '15 000 ⬡', bonus: '+ Accès VIP' },
            ].map(tier => (
              <div key={tier.friends} className="bg-zinc-900/60 rounded-2xl p-3 border border-white/5">
                <p className="text-xl font-black text-white">{tier.friends}</p>
                <p className="text-[10px] text-zinc-500 mb-1">amis</p>
                <p className="text-xs font-bold text-violet-400">{tier.reward}</p>
                {tier.bonus && <p className="text-[9px] text-cyan-400 mt-0.5">{tier.bonus}</p>}
              </div>
            ))}
          </div>

          <Link href="/register">
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              className="w-full py-3.5 bg-gradient-to-r from-violet-600 to-cyan-500 text-white font-bold rounded-2xl text-sm shadow-lg shadow-violet-600/25 flex items-center justify-center gap-2">
              <Users size={16} /> Rejoindre et partager mon lien
            </motion.button>
          </Link>
        </motion.div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="relative px-6 pb-20 max-w-3xl mx-auto">
        <p className="text-center text-xs text-zinc-600 uppercase tracking-widest mb-6">Ce qu'ils disent</p>
        <div className="grid sm:grid-cols-3 gap-4">
          {TESTIMONIALS.map((t, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="bg-zinc-900/60 border border-white/5 rounded-2xl p-4">
              <p className="text-sm text-zinc-300 leading-relaxed mb-3">"{t.text}"</p>
              <div className="flex items-center gap-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`https://i.pravatar.cc/32?img=${t.avatar}`} alt={t.name} className="w-7 h-7 rounded-full" />
                <p className="text-xs font-semibold text-zinc-400">{t.name}</p>
                <div className="flex ml-auto">
                  {[...Array(5)].map((_, s) => <Star key={s} size={10} className="text-amber-400" fill="currentColor" />)}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="relative px-6 pb-20 max-w-xl mx-auto">
        <h2 className="text-xl font-black text-center mb-6">Questions fréquentes</h2>
        <div className="space-y-2">
          {[
            { q: "C'est vraiment gratuit ?",      a: "Oui, à 100%. Tu ne paies rien. NEXUS se rémunère sur les pubs que tu regardes, et te reverse 50% au lancement." },
            { q: "Quand est-ce que je suis payé ?", a: "Chaque semaine, les gains en GLYPHS sont convertibles en euros dès ⬡5 000 (5 €). Virement sous 48h." },
            { q: "C'est quoi les GLYPHS ?",        a: "Les GLYPHS sont la monnaie de NEXUS. 1 000 ⬡ = 1 €. Tu en gagnes en regardant des pubs, en parrainant des amis, en faisant des missions." },
            { q: "Le 50/50 c'est pour toujours ?", a: "Non, c'est l'offre Fondateur tant que la communauté est sous 500 membres actifs. Après, le taux passe à 40% (toujours le meilleur du marché)." },
            { q: "Comment marchent les pubs ?",    a: "Tu regardes une courte vidéo (15-30 s). Tu peux choisir ton quota journalier (5 à 30 pubs). Rien n'est forcé. Tu es payé en GLYPHS instantanément." },
          ].map((faq, i) => (
            <motion.div key={i} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
              className="border border-white/8 rounded-2xl overflow-hidden">
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-white/3 transition-colors">
                <span className="text-sm font-semibold text-white">{faq.q}</span>
                <ChevronDown size={16} className={`text-zinc-500 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {openFaq === i && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}
                    className="overflow-hidden">
                    <p className="px-5 pb-4 text-sm text-zinc-400 leading-relaxed">{faq.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="relative px-6 pb-24 max-w-xl mx-auto text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="bg-gradient-to-br from-violet-600/20 to-cyan-600/10 border border-violet-500/20 rounded-3xl p-10">
          <Crown size={28} className="text-amber-400 mx-auto mb-4" />
          <h2 className="text-2xl font-black mb-2">L'offre Fondateur ferme à 500 membres</h2>
          <p className="text-sm text-zinc-400 mb-6">Après ça, le taux passe à 40%. Rejoins maintenant et garde le 50% pour toujours.</p>

          <Link href="/register">
            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              className="px-10 py-4 bg-gradient-to-r from-violet-600 to-cyan-500 text-white font-bold rounded-2xl text-base shadow-xl shadow-violet-600/25 w-full flex items-center justify-center gap-2">
              Rejoindre maintenant → <Zap size={18} fill="white" />
            </motion.button>
          </Link>

          <p className="text-xs text-zinc-600 mt-3">Gratuit · Sans carte · Résiliable à tout moment</p>
        </motion.div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-white/5 px-6 py-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <NexusHexIcon size={24} />
          <span className="font-black text-sm" style={{ background: 'linear-gradient(135deg,#a78bfa,#38bdf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>NEXUS</span>
        </div>
        <div className="flex flex-wrap justify-center gap-4 text-xs text-zinc-600 mb-3">
          <Link href="/terms" className="hover:text-zinc-400 transition-colors">CGU</Link>
          <Link href="/privacy" className="hover:text-zinc-400 transition-colors">Confidentialité</Link>
          <Link href="/roadmap" className="hover:text-zinc-400 transition-colors">Roadmap</Link>
          <Link href="/support" className="hover:text-zinc-400 transition-colors">Support</Link>
        </div>
        <p className="text-xs text-zinc-700">© 2025 NEXUS · Tous droits réservés</p>
      </footer>
    </div>
  )
}
