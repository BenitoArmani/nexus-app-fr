import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json()
    // Demo mode: just acknowledge
    console.log('Account deletion requested for:', userId)
    return NextResponse.json({ success: true, message: 'Compte supprimé (mode démo)' })
  } catch {
    return NextResponse.json({ error: 'Erreur lors de la suppression' }, { status: 400 })
  }
}
