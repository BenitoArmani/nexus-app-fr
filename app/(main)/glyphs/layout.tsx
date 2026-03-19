import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'GLYPHS — NEXUS',
  description: 'Gérez vos GLYPHS : gains, missions, historique et retraits.',
}

export default function GlyphsLayout({ children }: { children: React.ReactNode }) {
  return children
}
