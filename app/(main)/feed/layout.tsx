import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Accueil — NEXUS',
  description: 'Votre fil d\'actualité personnalisé : posts, créateurs, paris et marchés.',
}

export default function FeedLayout({ children }: { children: React.ReactNode }) {
  return children
}
