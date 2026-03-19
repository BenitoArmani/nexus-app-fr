import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Marchés — NEXUS',
  description: 'Portfolio virtuel : actions, crypto, ETF. Mode Débutant et Mode Pro disponibles.',
}

export default function MarketsLayout({ children }: { children: React.ReactNode }) {
  return children
}
