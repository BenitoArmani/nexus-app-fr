export default function LegalPage() {
  return (
    <article>
      <h1 className="text-3xl font-black text-text-primary mb-8">Mentions légales</h1>
      <div className="space-y-6 text-text-secondary leading-relaxed">
        <section className="bg-surface-2 border border-white/5 rounded-2xl p-5">
          <h2 className="text-lg font-bold text-text-primary mb-3">Éditeur de la plateforme</h2>
          <p>NEXUS SAS — En cours d&apos;immatriculation</p>
          <p>Siège social : Paris, France</p>
          <p>Email : contact@nexus.app</p>
          <p>Directeur de la publication : Équipe NEXUS</p>
        </section>
        <section className="bg-surface-2 border border-white/5 rounded-2xl p-5">
          <h2 className="text-lg font-bold text-text-primary mb-3">Hébergement</h2>
          <p>Vercel Inc. — 340 Pine Street, San Francisco, CA 94104, USA</p>
          <p>Base de données : Supabase Inc.</p>
          <p>Paiements : Stripe Inc.</p>
          <p>Médias : Cloudinary Ltd.</p>
        </section>
        <section className="bg-surface-2 border border-white/5 rounded-2xl p-5">
          <h2 className="text-lg font-bold text-text-primary mb-3">Propriété intellectuelle</h2>
          <p>L&apos;ensemble des éléments de la plateforme NEXUS (logo, design, code) est protégé par le droit d&apos;auteur. Toute reproduction sans autorisation est interdite.</p>
        </section>
      </div>
    </article>
  )
}
