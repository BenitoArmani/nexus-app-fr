import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Comment ça marche — NEXUS',
  description: 'Découvrez comment NEXUS rémunère ses utilisateurs : système de GLYPHS, publications, publicités et retraits en euros.',
}

export default function CommentCaMarchePage() {
  const steps = [
    {
      num: '01',
      title: 'Créez votre compte gratuitement',
      desc: 'Inscrivez-vous en moins de 2 minutes. Aucune carte bancaire requise. Choisissez votre nom d\'utilisateur et personnalisez votre profil.',
      color: 'text-violet-400',
    },
    {
      num: '02',
      title: 'Publiez, interagissez, regardez',
      desc: 'Chaque action sur NEXUS vous rapporte des GLYPHS (⬡) : publier du contenu, liker des posts, commenter, ou visionner des publicités partenaires.',
      color: 'text-cyan-400',
    },
    {
      num: '03',
      title: 'Accumulez vos GLYPHS',
      desc: 'Vos GLYPHS s\'accumulent dans votre portefeuille. Vous pouvez suivre vos gains en temps réel depuis votre tableau de bord.',
      color: 'text-emerald-400',
    },
    {
      num: '04',
      title: 'Retirez en euros',
      desc: 'Dès 3 000 GLYPHS (~27 €) et 30 jours d\'ancienneté, demandez un virement sur votre compte bancaire. Traitement sous 2 à 7 jours ouvrés via Stripe.',
      color: 'text-amber-400',
    },
  ]

  const gains = [
    { action: 'Publier un post', glyphs: '+5 ⬡', note: 'par publication' },
    { action: 'Recevoir un like', glyphs: '+1 ⬡', note: 'par like reçu' },
    { action: 'Visionner une pub', glyphs: '+10 ⬡', note: 'pub complète' },
    { action: 'Parrainer un ami', glyphs: '+500 ⬡', note: 'après 3 jours d\'activité' },
    { action: 'Publier un Reel', glyphs: '+15 ⬡', note: 'par publication vidéo' },
    { action: 'Tip reçu', glyphs: '100%', note: 'des GLYPHS envoyés' },
  ]

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-black text-white mb-3">Comment ça marche</h1>
        <p className="text-text-secondary text-lg leading-relaxed">
          NEXUS est simple : vous utilisez un réseau social comme d'habitude, et vous êtes rémunéré pour votre attention et votre créativité.
        </p>
      </div>

      {/* Steps */}
      <div className="space-y-4">
        {steps.map(step => (
          <div key={step.num} className="bg-surface-2 border border-white/5 rounded-2xl p-5 flex gap-4">
            <span className={`text-3xl font-black ${step.color} shrink-0 w-12`}>{step.num}</span>
            <div>
              <h2 className="text-base font-black text-white mb-1">{step.title}</h2>
              <p className="text-sm text-text-secondary leading-relaxed">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Gains table */}
      <div className="bg-surface-2 border border-white/5 rounded-2xl p-6">
        <h2 className="text-xl font-black text-white mb-4">Barème des gains</h2>
        <div className="space-y-2">
          {gains.map(g => (
            <div key={g.action} className="flex items-center justify-between py-2.5 border-b border-white/5 last:border-0">
              <span className="text-sm text-text-secondary">{g.action}</span>
              <div className="text-right">
                <span className="text-sm font-bold text-violet-400">{g.glyphs}</span>
                <span className="text-xs text-text-muted ml-2">{g.note}</span>
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-text-muted mt-4">
          Taux de conversion : 110 GLYPHS = 1 €. Les gains sont indicatifs et peuvent varier selon les campagnes publicitaires actives.
        </p>
      </div>

      {/* FAQ */}
      <div className="bg-surface-2 border border-white/5 rounded-2xl p-6 space-y-4">
        <h2 className="text-xl font-black text-white">Questions fréquentes</h2>
        {[
          { q: 'Est-ce vraiment gratuit ?', r: 'Oui, totalement. Aucune carte bancaire, aucun abonnement requis pour gagner des GLYPHS.' },
          { q: 'Comment NEXUS génère-t-il des revenus ?', r: 'NEXUS est rémunéré par les annonceurs qui diffusent leurs publicités sur la plateforme. Une partie de ces revenus est redistribuée aux utilisateurs sous forme de GLYPHS.' },
          { q: 'Y a-t-il une limite de gains ?', r: 'Il n\'y a pas de limite fixe. Les gains dépendent de votre activité et des campagnes publicitaires disponibles.' },
          { q: 'Mes données sont-elles sécurisées ?', r: 'Oui. NEXUS utilise Supabase pour le stockage sécurisé et Stripe pour les paiements. Vos données bancaires ne transitent jamais par nos serveurs.' },
        ].map(item => (
          <div key={item.q} className="border-b border-white/5 last:border-0 pb-4 last:pb-0">
            <p className="text-sm font-bold text-white mb-1">{item.q}</p>
            <p className="text-sm text-text-muted leading-relaxed">{item.r}</p>
          </div>
        ))}
      </div>

      <div className="text-center">
        <Link
          href="/auth/register"
          className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-violet-600 to-cyan-500 text-white font-bold rounded-2xl hover:opacity-90 transition-opacity"
        >
          Rejoindre NEXUS gratuitement →
        </Link>
      </div>
    </div>
  )
}
