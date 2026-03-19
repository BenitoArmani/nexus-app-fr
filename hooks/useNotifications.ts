'use client'
import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { soundSystem } from '@/lib/sounds'

export interface AppNotification {
  id: string
  type: string
  title: string
  body: string
  data: Record<string, any>
  read: boolean
  created_at: string
}

export function useNotifications(userId: string | null) {
  const [notifications, setNotifications] = useState<AppNotification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    if (!userId) return

    supabase.from('notifications').select('*').eq('user_id', userId)
      .order('created_at', { ascending: false }).limit(50)
      .then(({ data }) => {
        if (data) {
          setNotifications(data)
          setUnreadCount(data.filter((n: AppNotification) => !n.read).length)
        }
      })

    const channel = supabase.channel(`notif:${userId}`)
      .on('postgres_changes', {
        event: 'INSERT', schema: 'public', table: 'notifications',
        filter: `user_id=eq.${userId}`
      }, (payload) => {
        const n = payload.new as AppNotification
        setNotifications(prev => [n, ...prev])
        setUnreadCount(prev => prev + 1)
        soundSystem?.play('notification')
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [userId])

  const markAllRead = useCallback(async () => {
    if (!userId) return
    await supabase.from('notifications').update({ read: true }).eq('user_id', userId).eq('read', false)
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    setUnreadCount(0)
  }, [userId])

  return { notifications, unreadCount, markAllRead }
}
