import Stripe from 'stripe'

// Guard: only instantiate Stripe if the key is available (not needed in demo mode)
export const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2026-02-25.clover',
    })
  : null

export const SUBSCRIPTION_PLANS = [
  {
    id: 'basic' as const,
    name: 'Supporter',
    price: 4.99,
    priceId: 'price_basic_monthly',
    color: '#8b5cf6',
    badge: '⭐',
    features: [
      'Badge Supporter exclusif sur le profil',
      'Accès aux posts réservés abonnés',
      'Salons privés du créateur',
      '⬡ 500 GLYPHS offerts / mois',
    ],
    comingSoon: [] as string[],
  },
  {
    id: 'pro' as const,
    name: 'Fan Pro',
    price: 9.99,
    priceId: 'price_pro_monthly',
    color: '#06b6d4',
    badge: '💎',
    features: [
      'Tout Supporter',
      'Badge Fan Pro animé',
      'Réponses prioritaires du créateur',
      '⬡ 1 500 GLYPHS offerts / mois',
      'Mention dans le post mensuel du créateur',
    ],
    comingSoon: ['Streaming HD en avant-première (débloqué à 2 000 membres)'] as string[],
  },
  {
    id: 'vip' as const,
    name: 'VIP',
    price: 19.99,
    priceId: 'price_vip_monthly',
    color: '#f59e0b',
    badge: '👑',
    features: [
      'Tout Fan Pro',
      'Badge VIP doré animé',
      '⬡ 5 000 GLYPHS offerts / mois',
      'Accès bêta à toutes les nouvelles fonctionnalités',
      'Salon VIP ultra-privé',
      'Vote sur les prochaines fonctionnalités',
    ],
    comingSoon: [
      'Stream privé 1-to-1 mensuel (débloqué à 2 000 membres)',
      'Marketplace prioritaire (débloqué à 10 000 membres)',
    ] as string[],
  },
]
