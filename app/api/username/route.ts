import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const RESERVED = ['nexus', 'admin', 'promethee', 'support', 'official', 'staff', 'moderator', 'mod', 'bot', 'system', 'null', 'undefined']
const USERNAME_REGEX = /^[a-z0-9_]{3,20}$/

function generateSuggestions(base: string): string[] {
  const clean = base.toLowerCase().replace(/[^a-z0-9_]/g, '').slice(0, 15)
  return [
    `${clean}_`,
    `${clean}2026`,
    `${clean}_nexus`,
    `_${clean}`,
  ].filter(s => USERNAME_REGEX.test(s)).slice(0, 4)
}

export async function GET(req: NextRequest) {
  const username = req.nextUrl.searchParams.get('username')?.toLowerCase().trim()

  if (!username) return NextResponse.json({ available: false, error: 'Username required' })

  // Validate format
  if (!USERNAME_REGEX.test(username)) {
    return NextResponse.json({
      available: false,
      error: 'Entre 3 et 20 caractères. Lettres, chiffres et _ uniquement.',
    })
  }

  // Check reserved
  if (RESERVED.includes(username)) {
    return NextResponse.json({
      available: false,
      error: 'Ce pseudo est réservé.',
      suggestions: generateSuggestions(username),
    })
  }

  // Check Supabase if credentials available
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (supabaseUrl && supabaseKey) {
    try {
      const supabase = createClient(supabaseUrl, supabaseKey)
      const { data } = await supabase
        .from('users')
        .select('id')
        .ilike('username', username)
        .maybeSingle()

      if (data) {
        return NextResponse.json({
          available: false,
          error: `@${username} est déjà pris.`,
          suggestions: generateSuggestions(username),
        })
      }
      return NextResponse.json({ available: true, message: `@${username} est disponible !` })
    } catch {
      // fallback: assume available in demo
    }
  }

  // Demo mode: pretend 'testuser' is taken
  if (username === 'testuser' || username === 'demo') {
    return NextResponse.json({
      available: false,
      error: `@${username} est déjà pris.`,
      suggestions: generateSuggestions(username),
    })
  }

  return NextResponse.json({ available: true, message: `@${username} est disponible !` })
}
