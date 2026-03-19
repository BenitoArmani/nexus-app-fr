import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json()
    const apiKey = process.env.ANTHROPIC_API_KEY

    if (!apiKey) {
      return NextResponse.json({
        content: 'Bonjour ! Je suis Prométhée, l\'IA de NEXUS 🔥 En mode démo, je te répondrai avec des suggestions génériques. Configure `ANTHROPIC_API_KEY` pour activer le vrai Claude !'
      })
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1024,
        system: `Tu es Prométhée, l'IA de NEXUS — la super-app sociale créateur. Tu es expert en stratégie de contenu, croissance sur les réseaux sociaux, hashtags, tendances et monétisation créateur. Tu réponds toujours en français, de façon concise et actionnable. Tu connais le système GLYPHS (⬡) de NEXUS. Sois enthousiaste et motivant.`,
        messages: messages.slice(-10),
      }),
    })

    const data = await response.json()
    const content = data.content?.[0]?.text || 'Désolé, erreur de réponse.'
    return NextResponse.json({ content })
  } catch {
    return NextResponse.json({
      content: 'Mode démo actif — Je suis Prométhée ! 🔥 Voici quelques conseils : poste entre 18h-21h pour maximiser l\'engagement, utilise 5-8 hashtags ciblés, et engage avec ton audience dans les 30 premières minutes après publication.'
    })
  }
}
