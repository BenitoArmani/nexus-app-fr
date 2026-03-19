import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt     = 'NEXUS — Gagne de l\'argent en scrollant'
export const size    = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #0a0a12 0%, #1a0a2e 50%, #0a1228 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        {/* Glow circles */}
        <div style={{
          position: 'absolute', top: -100, left: '50%',
          width: 800, height: 400,
          background: 'radial-gradient(ellipse, rgba(139,92,246,0.15) 0%, transparent 70%)',
          transform: 'translateX(-50%)',
        }} />
        <div style={{
          position: 'absolute', bottom: 0, right: 0,
          width: 400, height: 400,
          background: 'radial-gradient(ellipse, rgba(6,182,212,0.08) 0%, transparent 70%)',
        }} />

        {/* Hexagon icon (simplified) */}
        <div style={{
          width: 80, height: 80,
          background: '#2d1060',
          border: '4px solid #8b5cf6',
          borderRadius: 20,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 24,
          fontSize: 40,
          fontWeight: 900,
          color: 'white',
        }}>
          N
        </div>

        {/* Title */}
        <div style={{
          fontSize: 72,
          fontWeight: 900,
          letterSpacing: '-2px',
          background: 'linear-gradient(135deg, #a78bfa, #38bdf8)',
          backgroundClip: 'text',
          color: 'transparent',
          marginBottom: 16,
          lineHeight: 1,
        }}>
          NEXUS
        </div>

        {/* Tagline */}
        <div style={{
          fontSize: 32,
          fontWeight: 700,
          color: 'white',
          marginBottom: 12,
        }}>
          Tu scrolles. Tu gagnes.
        </div>
        <div style={{
          fontSize: 22,
          color: 'rgba(161,161,170,0.9)',
          marginBottom: 40,
        }}>
          Le réseau social qui te paie pour regarder des pubs
        </div>

        {/* Stats row */}
        <div style={{
          display: 'flex',
          gap: 32,
        }}>
          {[
            { value: 'Jusqu\'à 54 €/mois', label: 'en revenus pub' },
            { value: 'Offre 50/50',         label: 'pour les fondateurs' },
            { value: '+500 ⬡',              label: 'par ami parrainé' },
          ].map(stat => (
            <div key={stat.label} style={{
              background: 'rgba(139,92,246,0.12)',
              border: '1px solid rgba(139,92,246,0.25)',
              borderRadius: 16,
              padding: '16px 28px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
            }}>
              <div style={{ fontSize: 24, fontWeight: 900, color: '#a78bfa' }}>{stat.value}</div>
              <div style={{ fontSize: 14, color: 'rgba(161,161,170,0.7)' }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* URL */}
        <div style={{
          position: 'absolute',
          bottom: 32,
          fontSize: 18,
          color: 'rgba(161,161,170,0.4)',
        }}>
          nexus.app
        </div>
      </div>
    ),
    { ...size }
  )
}
