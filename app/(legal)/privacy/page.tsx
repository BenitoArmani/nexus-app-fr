export default function PrivacyPage() {
  return (
    <article className="prose prose-invert max-w-none">
      <h1 className="text-3xl font-black text-text-primary mb-2">Politique de confidentialité</h1>
      <p className="text-text-muted text-sm mb-8">Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}</p>

      <div className="space-y-8 text-text-secondary leading-relaxed">
        <section>
          <h2 className="text-xl font-bold text-text-primary mb-3">1. Collecte des données</h2>
          <p>NEXUS collecte uniquement les données nécessaires au fonctionnement de la plateforme : adresse email, nom d&apos;utilisateur, contenu publié, et données d&apos;utilisation anonymisées.</p>
        </section>
        <section>
          <h2 className="text-xl font-bold text-text-primary mb-3">2. Utilisation des données</h2>
          <p>Vos données sont utilisées pour : fournir le service, personnaliser votre expérience, traiter les paiements via Stripe (données bancaires jamais stockées sur nos serveurs), et améliorer la plateforme.</p>
        </section>
        <section>
          <h2 className="text-xl font-bold text-text-primary mb-3">3. Vos droits (RGPD)</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Droit d&apos;accès à vos données</li>
            <li>Droit de rectification</li>
            <li>Droit à l&apos;effacement (&quot;droit à l&apos;oubli&quot;)</li>
            <li>Droit à la portabilité des données</li>
            <li>Droit d&apos;opposition au traitement</li>
          </ul>
          <p className="mt-3">Pour exercer ces droits : <strong className="text-text-primary">privacy@nexus.app</strong></p>
        </section>
        <section>
          <h2 className="text-xl font-bold text-text-primary mb-3">4. Cookies</h2>
          <p>NEXUS utilise des cookies essentiels pour l&apos;authentification et des cookies analytiques anonymisés. Vous pouvez refuser les cookies non essentiels via notre bannière de consentement.</p>
        </section>
        <section>
          <h2 className="text-xl font-bold text-text-primary mb-3">5. Conservation des données</h2>
          <p>Vos données sont conservées pendant la durée de votre compte. Après suppression du compte, les données sont effacées sous 30 jours.</p>
        </section>
        <section>
          <h2 className="text-xl font-bold text-text-primary mb-3">6. Contact DPO</h2>
          <p>Délégué à la Protection des Données : <strong className="text-text-primary">dpo@nexus.app</strong></p>
        </section>
      </div>
    </article>
  )
}
