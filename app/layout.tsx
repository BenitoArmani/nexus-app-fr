import type { Metadata } from 'next'
import { Toaster } from 'react-hot-toast'
import CookieBanner from '@/components/ui/CookieBanner'
import GlyphGainToast from '@/components/ui/GlyphGainToast'
import './globals.css'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://nexus.app'

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: 'NEXUS — Gagne de l\'argent en scrollant',
    template: '%s · NEXUS',
  },
  description: 'Le premier réseau social qui te paie pour regarder des pubs. Jusqu\'à 54 €/mois. Offre Fondateur 50/50 au lancement.',
  keywords: ['réseau social', 'gagner argent', 'publicité récompensée', 'GLYPHS', 'créateur', 'parrainage'],
  authors: [{ name: 'NEXUS' }],
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: APP_URL,
    siteName: 'NEXUS',
    title: 'NEXUS — Tu scrolles. Tu gagnes.',
    description: 'Le premier réseau social qui te paie pour regarder des pubs. Jusqu\'à 54 €/mois. Offre Fondateur 50/50.',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'NEXUS — Gagne de l\'argent en scrollant' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NEXUS — Tu scrolles. Tu gagnes.',
    description: 'Le premier réseau social qui te paie pour regarder des pubs. Jusqu\'à 54 €/mois.',
    images: ['/opengraph-image'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  manifest: '/manifest.json',
  icons: {
    icon: '/icon.svg',
    apple: '/icons/icon-192.png',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <meta name="theme-color" content="#7c3aed" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className="antialiased">
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: { background: '#17171F', color: '#F1F0F9', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontFamily: 'Sora, sans-serif' },
          }}
        />
        <CookieBanner />
        <GlyphGainToast />
        {/* Google AdSense — actif quand NEXT_PUBLIC_ADSENSE_ID est défini */}
        {process.env.NEXT_PUBLIC_ADSENSE_ID && (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_ID}`}
            crossOrigin="anonymous"
          />
        )}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').catch(function() {});
                });
              }
            `,
          }}
        />
      </body>
    </html>
  )
}
