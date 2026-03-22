import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { safeLog } from '@/lib/security'

export async function POST(req: NextRequest) {
  try {
    // Vérification JWT — on ne fait pas confiance au body pour l'identité de l'expéditeur
    const token = req.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    const { data: { user: authUser } } = await supabase.auth.getUser(token)
    if (!authUser) return NextResponse.json({ error: 'Token invalide' }, { status: 401 })

    const { toUserId, amount, context, contextId } = await req.json()
    const fromUserId = authUser.id // toujours l'utilisateur connecté, jamais le body

    if (!toUserId || !amount) {
      return NextResponse.json({ error: 'Paramètres manquants' }, { status: 400 })
    }
    if (fromUserId === toUserId) {
      return NextResponse.json({ error: 'Tu ne peux pas te tipper toi-même' }, { status: 400 })
    }
    if (amount < 1 || amount > 100000) {
      return NextResponse.json({ error: 'Montant invalide' }, { status: 400 })
    }

    const { data: receiver } = await supabase
      .from('users')
      .select('full_name, username')
      .eq('id', toUserId)
      .single()

    const label = `Tip à @${receiver?.username ?? 'utilisateur'}`

    const { error } = await supabase.rpc('transfer_glyphs', {
      p_from: fromUserId,
      p_to: toUserId,
      p_amount: amount,
      p_label: label,
      p_context: context ?? 'post',
      p_context_id: contextId ?? '',
    })

    if (error) {
      if (error.message.includes('insuffisant')) {
        return NextResponse.json({ error: 'Solde GLYPHS insuffisant' }, { status: 400 })
      }
      throw error
    }

    // Send notification to receiver
    await supabase.from('notifications').insert({
      user_id: toUserId,
      type: 'tip',
      title: `Tu as reçu ${amount} GLYPHS ⬡`,
      body: `Quelqu'un t'a envoyé ${amount} GLYPHS !`,
      read: false,
    }).then(() => {})

    safeLog('info', 'Tip sent', { fromUserId, toUserId, amount })
    return NextResponse.json({ success: true })
  } catch (err) {
    safeLog('error', 'Tip error', { error: String(err) })
    return NextResponse.json({ error: 'Erreur lors du transfert' }, { status: 500 })
  }
}
