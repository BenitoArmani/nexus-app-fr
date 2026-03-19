import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json()
    const exportData = {
      exported_at: new Date().toISOString(),
      user_id: userId,
      account: { username: 'moi_creator', email: 'demo@nexus.app' },
      posts: [],
      messages: [],
      transactions: [],
      preferences: {},
      note: 'Export de données NEXUS — Mode démo',
    }
    return NextResponse.json({ data: exportData, filename: `nexus-export-${Date.now()}.json` })
  } catch {
    return NextResponse.json({ error: 'Erreur lors de l\'export' }, { status: 400 })
  }
}
