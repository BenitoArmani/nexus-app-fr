import Link from 'next/link'
import { Zap, ArrowLeft } from 'lucide-react'

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-bg-primary text-text-primary">
      <nav className="border-b border-white/5 px-6 py-4 flex items-center gap-4">
        <Link href="/" className="flex items-center gap-2 font-black text-lg">
          <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center">
            <Zap size={14} className="text-white" fill="white" />
          </div>
          NEXUS
        </Link>
        <Link href="/" className="ml-auto flex items-center gap-1 text-sm text-text-muted hover:text-text-primary transition-colors">
          <ArrowLeft size={14} /> Retour
        </Link>
      </nav>
      <div className="max-w-3xl mx-auto px-6 py-12">
        {children}
      </div>
    </div>
  )
}
