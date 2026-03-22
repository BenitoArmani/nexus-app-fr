import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'À propos — NEXUS',
  description: 'NEXUS est le premier réseau social français qui rémunère ses utilisateurs. Découvrez notre mission, notre équipe et notre vision.',
}

export default function AProposPage() {
  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-black text-white mb-3">À propos de NEXUS</h1>
        <p className="text-text-secondary text-lg leading-relaxed">
          NEXUS est le premier réseau social français conçu pour que chaque utilisateur soit récompensé pour son temps et son attention.
        </p>
      </div>

      <div className="bg-surface-2 border border-white/5 rounded-2xl p-6 space-y-4">
        <h2 className="text-xl font-black text-white">Notre mission</h2>
        <p className="text-text-secondary leading-relaxed">
          Dans l'économie numérique actuelle, les plateformes sociales monétisent l'attention de leurs utilisateurs sans les associer aux bénéfices générés. NEXUS renverse ce modèle :
          chaque vue, chaque interaction, chaque minute passée sur NEXUS génère des <span className="text-violet-400 font-bold">GLYPHS (⬡)</span> — notre monnaie interne convertible en euros réels.
        </p>
        <p className="text-text-secondary leading-relaxed">
          Notre objectif est de bâtir un écosystème où créateurs et spectateurs partagent équitablement la valeur créée par leurs échanges.
        </p>
      </div>

      <div className="bg-surface-2 border border-white/5 rounded-2xl p-6 space-y-4">
        <h2 className="text-xl font-black text-white">Le système GLYPHS</h2>
        <p className="text-text-secondary leading-relaxed">
          Les GLYPHS (⬡) sont la monnaie de NEXUS. Vous en gagnez en publiant du contenu, en interagissant avec des publications et en visionnant des publicités partenaires.
          Les GLYPHS accumulés peuvent être convertis en euros et virés directement sur votre compte bancaire via notre partenaire de paiement Stripe.
        </p>
        <div className="grid grid-cols-3 gap-3 mt-4">
          {[
            { label: 'Taux de conversion', value: '110 ⬡ = 1 €' },
            { label: 'Retrait minimum', value: '3 000 ⬡' },
            { label: 'Fréquence', value: '1 fois / mois' },
          ].map(item => (
            <div key={item.label} className="bg-white/[0.03] border border-white/5 rounded-xl p-3 text-center">
              <p className="text-xs text-text-muted mb-1">{item.label}</p>
              <p className="text-sm font-bold text-violet-400">{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-surface-2 border border-white/5 rounded-2xl p-6 space-y-4">
        <h2 className="text-xl font-black text-white">Nos valeurs</h2>
        <div className="space-y-3">
          {[
            { title: 'Transparence', desc: 'Nous publions clairement nos règles de monétisation et de rémunération. Pas de frais cachés, pas de conditions obscures.' },
            { title: 'Équité', desc: 'Créateurs et spectateurs contribuent tous deux à l\'écosystème. Les deux sont récompensés.' },
            { title: 'Sécurité', desc: 'Vos données et vos gains sont protégés. Les paiements sont gérés exclusivement via Stripe, leader mondial du paiement en ligne.' },
            { title: 'Communauté', desc: 'NEXUS est conçu pour des interactions authentiques, pas pour maximiser le temps d\'écran à tout prix.' },
          ].map(v => (
            <div key={v.title} className="flex gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-violet-500 mt-2 shrink-0" />
              <div>
                <p className="text-sm font-bold text-white">{v.title}</p>
                <p className="text-sm text-text-muted leading-relaxed">{v.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-surface-2 border border-white/5 rounded-2xl p-6">
        <h2 className="text-xl font-black text-white mb-3">Contact</h2>
        <p className="text-text-secondary">
          Pour toute question concernant NEXUS, notre équipe est disponible à l'adresse{' '}
          <a href="mailto:contact@nexussociable.fr" className="text-violet-400 hover:text-violet-300 transition-colors">
            contact@nexussociable.fr
          </a>
        </p>
      </div>
    </div>
  )
}
