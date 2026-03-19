export default function TermsPage() {
  return (
    <article>
      <h1 className="text-3xl font-black text-text-primary mb-2">Conditions Générales d&apos;Utilisation</h1>
      <p className="text-text-muted text-sm mb-8">En vigueur au {new Date().toLocaleDateString('fr-FR')}</p>
      <div className="space-y-8 text-text-secondary leading-relaxed">
        <section><h2 className="text-xl font-bold text-text-primary mb-3">1. Objet</h2><p>Les présentes CGU régissent l&apos;utilisation de la plateforme NEXUS, accessible à l&apos;adresse nexus.app. En créant un compte, vous acceptez ces conditions.</p></section>
        <section><h2 className="text-xl font-bold text-text-primary mb-3">2. Compte utilisateur</h2><p>Vous devez avoir au moins 13 ans pour utiliser NEXUS. Vous êtes responsable de la sécurité de votre compte. Tout contenu illégal, haineux ou trompeur est interdit.</p></section>
        <section><h2 className="text-xl font-bold text-text-primary mb-3">3. Contenu créateur</h2><p>Vous conservez tous les droits sur votre contenu. En publiant, vous accordez à NEXUS une licence non-exclusive pour l&apos;afficher sur la plateforme. NEXUS ne revendique aucune propriété sur vos créations.</p></section>
        <section><h2 className="text-xl font-bold text-text-primary mb-3">4. Monétisation &amp; Paiements</h2><p>NEXUS prélève une commission de 10% sur les revenus créateurs. Les paiements sont traités par Stripe. Les retraits sont soumis à un minimum de 10€ et des frais de 0,50€.</p></section>
        <section><h2 className="text-xl font-bold text-text-primary mb-3">5. NEXUS Coins</h2><p>Les NEXUS Coins sont une monnaie virtuelle sans valeur légale. Ils ne peuvent pas être convertis en euros. Les achats de coins sont définitifs.</p></section>
        <section><h2 className="text-xl font-bold text-text-primary mb-3">6. Résiliation</h2><p>NEXUS se réserve le droit de suspendre tout compte violant ces CGU. Vous pouvez supprimer votre compte à tout moment depuis les paramètres.</p></section>
        <section><h2 className="text-xl font-bold text-text-primary mb-3">7. Droit applicable</h2><p>Ces CGU sont soumises au droit français. Tout litige relève des tribunaux compétents de Paris.</p></section>
      </div>
    </article>
  )
}
