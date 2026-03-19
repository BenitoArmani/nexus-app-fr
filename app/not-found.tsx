'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { NexusHexIcon } from '@/components/ui/NexusLogo'
import { Home, Search, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-bg-primary flex flex-col items-center justify-center px-4 text-center">
      {/* Background blur */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-violet-600/8 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/3 w-64 h-64 bg-cyan-600/8 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative flex flex-col items-center"
      >
        <motion.div
          animate={{ rotate: [0, -8, 8, -4, 0] }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <NexusHexIcon size={72} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-6"
        >
          <p className="text-7xl font-black text-white/10 leading-none mb-2">404</p>
          <h1 className="text-xl font-black text-white mb-2">Page introuvable</h1>
          <p className="text-sm text-zinc-500 mb-8 max-w-xs">
            Cette page n&apos;existe pas ou a été déplacée. Retourne sur NEXUS !
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-3 w-full max-w-xs"
        >
          <Link href="/feed" className="flex-1 flex items-center justify-center gap-2 py-3 bg-violet-600 hover:bg-violet-500 text-white font-bold text-sm rounded-2xl transition-colors">
            <Home size={16} />
            Accueil
          </Link>
          <Link href="/feed" onClick={() => history.back()} className="flex-1 flex items-center justify-center gap-2 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-sm rounded-2xl transition-colors">
            <ArrowLeft size={16} />
            Retour
          </Link>
        </motion.div>
      </motion.div>
    </div>
  )
}
