'use client'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { ExternalLink } from 'lucide-react'

const SPONSORED_ADS = [
  { id: 's1', brand: 'TechCorp Pro', avatar: 'https://picsum.photos/seed/brand1/40/40', content: '🚀 Découvrez TechCorp Pro — L\'outil n°1 des créateurs de contenu. +50 000 créateurs nous font confiance !', image: 'https://picsum.photos/seed/sponsored1/800/400', cta: 'En savoir plus' },
  { id: 's2', brand: 'CreativStudio', avatar: 'https://picsum.photos/seed/brand2/40/40', content: '🎨 CreativStudio — Éditeur vidéo professionnel gratuit pour NEXUS creators. Commence aujourd\'hui !', image: 'https://picsum.photos/seed/sponsored2/800/400', cta: 'Essayer gratuitement' },
  { id: 's3', brand: 'NexusPay', avatar: 'https://picsum.photos/seed/brand3/40/40', content: '⬡ Gagnez 2x plus de Glyphs avec NexusPay — La solution de paiement des créateurs NEXUS.', image: 'https://picsum.photos/seed/sponsored3/800/400', cta: 'Découvrir' },
]

interface SponsoredPostCardProps {
  index?: number
}

export default function SponsoredPostCard({ index = 0 }: SponsoredPostCardProps) {
  const ad = SPONSORED_ADS[index % SPONSORED_ADS.length]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-surface-2 border border-white/5 rounded-2xl overflow-hidden relative"
    >
      <span className="absolute top-3 right-3 text-[10px] text-text-muted bg-surface-3 border border-white/5 px-2 py-0.5 rounded-full z-10">
        Sponsorisé
      </span>
      <div className="p-4 pb-3 flex items-center gap-3">
        <img src={ad.avatar} alt={ad.brand} className="w-10 h-10 rounded-xl object-cover" />
        <div>
          <p className="text-sm font-semibold text-text-primary">{ad.brand}</p>
          <p className="text-xs text-text-muted">Contenu sponsorisé</p>
        </div>
      </div>
      <div className="px-4 pb-3">
        <p className="text-sm text-text-secondary">{ad.content}</p>
      </div>
      {ad.image && (
        <div className="relative aspect-video overflow-hidden mx-4 mb-3 rounded-xl">
          <Image src={ad.image} alt={ad.brand} fill className="object-cover" unoptimized />
        </div>
      )}
      <div className="px-4 pb-4">
        <button className="flex items-center gap-1.5 text-xs font-semibold text-violet-400 hover:text-violet-300 transition-colors">
          <ExternalLink size={12} /> {ad.cta}
        </button>
      </div>
    </motion.div>
  )
}
