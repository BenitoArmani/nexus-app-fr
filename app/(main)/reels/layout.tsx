import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Reels — NEXUS',
  description: 'Découvrez les meilleurs Reels des créateurs NEXUS.',
}

export default function ReelsLayout({ children }: { children: React.ReactNode }) {
  return children
}
