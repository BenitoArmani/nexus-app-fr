import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const subscription = await req.json()
    // In demo mode, just acknowledge
    console.log('Push subscription received:', subscription)
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Invalid subscription' }, { status: 400 })
  }
}
