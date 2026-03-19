import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Prédictions — NEXUS',
  description: 'Pariez sur les événements du moment avec vos GLYPHS. Polymarket-style sur NEXUS.',
}

export default function PredictionsLayout({ children }: { children: React.ReactNode }) {
  return children
}
