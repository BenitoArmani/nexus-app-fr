import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact — NEXUS',
  description: 'Contactez l\'équipe NEXUS pour toute question sur la plateforme, les paiements ou votre compte.',
}

export default function ContactPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-white mb-3">Nous contacter</h1>
        <p className="text-text-secondary text-lg leading-relaxed">
          L'équipe NEXUS est disponible pour répondre à toutes vos questions.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {[
          {
            title: 'Support général',
            desc: 'Questions sur votre compte, les GLYPHS, ou l\'utilisation de la plateforme.',
            email: 'support@nexussociable.fr',
            color: 'border-violet-500/20',
          },
          {
            title: 'Partenariats & Publicité',
            desc: 'Vous souhaitez diffuser vos publicités sur NEXUS ou proposer un partenariat.',
            email: 'partenaires@nexussociable.fr',
            color: 'border-cyan-500/20',
          },
          {
            title: 'Paiements & Retraits',
            desc: 'Problème avec un retrait, une transaction ou votre compte Stripe.',
            email: 'paiements@nexussociable.fr',
            color: 'border-emerald-500/20',
          },
          {
            title: 'Signalement & Sécurité',
            desc: 'Signaler un contenu inapproprié, une faille de sécurité ou une fraude.',
            email: 'securite@nexussociable.fr',
            color: 'border-rose-500/20',
          },
        ].map(item => (
          <div key={item.title} className={`bg-surface-2 border ${item.color} rounded-2xl p-5`}>
            <h2 className="text-base font-black text-white mb-1">{item.title}</h2>
            <p className="text-sm text-text-muted mb-3 leading-relaxed">{item.desc}</p>
            <a href={`mailto:${item.email}`} className="text-sm text-violet-400 hover:text-violet-300 transition-colors font-medium">
              {item.email}
            </a>
          </div>
        ))}
      </div>

      <div className="bg-surface-2 border border-white/5 rounded-2xl p-6">
        <h2 className="text-xl font-black text-white mb-3">Délais de réponse</h2>
        <p className="text-text-secondary leading-relaxed">
          Nous nous engageons à répondre à toutes les demandes dans un délai de <strong className="text-white">48 heures ouvrées</strong>.
          Pour les questions urgentes liées aux paiements, nous traitons ces demandes en priorité.
        </p>
        <p className="text-text-muted text-sm mt-3">
          NEXUS · nexussociable.fr · Disponible 7j/7 en ligne
        </p>
      </div>
    </div>
  )
}
