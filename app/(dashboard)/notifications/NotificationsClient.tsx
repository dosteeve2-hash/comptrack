'use client'

// app/(dashboard)/notifications/NotificationsClient.tsx
import { useState, useTransition } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCheck, Bell, CheckCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { Notification } from './page'
import type { Filtre } from './notifications.helpers'
import { NotificationItem } from './NotificationItem'

interface Props {
  notifications: Notification[]
  userId: string
  nonLues: number
}

export default function NotificationsClient({ notifications: initial }: Props) {
  const [notifications, setNotifications] = useState<Notification[]>(initial)
  const [filtre, setFiltre]               = useState<Filtre>('toutes')
  const [isPending, startTransition]      = useTransition()

  const nonLues = notifications.filter((n) => !n.lue).length

  const visible = notifications.filter((n) => {
    if (filtre === 'non-lues') return !n.lue
    if (filtre === 'alertes')  return n.type === 'alerte' || n.type === 'erreur'
    return true
  })

  const marquerLue = (id: string) => {
    startTransition(async () => {
      setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, lue: true } : n))
      if (!id.startsWith('mock-')) {
        const supabase = createClient()
        await supabase.from('notifications').update({ lue: true }).eq('id', id)
      }
    })
  }

  const toutMarquerLu = () => {
    startTransition(async () => {
      setNotifications((prev) => prev.map((n) => ({ ...n, lue: true })))
      const realIds = notifications.filter((n) => !n.lue && !n.id.startsWith('mock-')).map((n) => n.id)
      if (realIds.length > 0) {
        const supabase = createClient()
        await supabase.from('notifications').update({ lue: true }).in('id', realIds)
      }
    })
  }

  const filtres: { key: Filtre; label: string; count: number }[] = [
    { key: 'toutes',    label: 'Toutes',   count: notifications.length },
    { key: 'non-lues',  label: 'Non lues', count: nonLues },
    { key: 'alertes',   label: 'Alertes',  count: notifications.filter((n) => n.type === 'alerte' || n.type === 'erreur').length },
  ]

  return (
    <div className="space-y-6 animate-fade-in">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(212,175,55,0.15)', border: '1px solid rgba(212,175,55,0.3)' }}>
            <Bell className="w-5 h-5" style={{ color: '#D4AF37' }} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">Notifications</h1>
              {nonLues > 0 && (
                <span className="px-2 py-0.5 rounded-full text-xs font-bold"
                  style={{ background: '#D4AF37', color: '#0A1628' }}>
                  {nonLues} non lues
                </span>
              )}
            </div>
            <p className="text-sm mt-0.5" style={{ color: 'var(--text2)' }}>Activité et alertes de votre compte</p>
          </div>
        </div>
        {nonLues > 0 && (
          <button onClick={toutMarquerLu} disabled={isPending}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all hover:opacity-80 disabled:opacity-40"
            style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.3)', color: '#D4AF37' }}>
            <CheckCheck className="w-4 h-4" /> Tout marquer comme lu
          </button>
        )}
      </div>

      {/* Pills */}
      <div className="flex items-center gap-2 flex-wrap">
        {filtres.map((f) => (
          <button key={f.key} onClick={() => setFiltre(f.key)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all"
            style={{
              background: filtre === f.key ? '#D4AF37' : 'var(--bg2)',
              color:      filtre === f.key ? '#0A1628'  : 'var(--text2)',
              border:     filtre === f.key ? '1px solid #D4AF37' : '1px solid var(--border)',
            }}>
            {f.label}
            {f.count > 0 && (
              <span className="px-1.5 py-0.5 rounded-full text-xs font-bold"
                style={{
                  background: filtre === f.key ? 'rgba(10,22,40,0.2)' : 'var(--bg3)',
                  color:      filtre === f.key ? '#0A1628' : 'var(--text2)',
                }}>
                {f.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Feed */}
      <div className="rounded-2xl border overflow-hidden" style={{ background: 'var(--bg2)', borderColor: 'var(--border)' }}>
        <AnimatePresence mode="popLayout">
          {visible.length === 0 ? (
            <motion.div key="empty"
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring' as const, stiffness: 300, damping: 25 }}
              className="flex flex-col items-center justify-center py-20 px-6 text-center">
              <div className="w-20 h-20 rounded-full flex items-center justify-center mb-4"
                style={{ background: 'rgba(212,175,55,0.1)', border: '2px solid rgba(212,175,55,0.3)' }}>
                <CheckCircle className="w-10 h-10" style={{ color: '#D4AF37' }} />
              </div>
              <h3 className="text-lg font-semibold mb-1">Tout est à jour !</h3>
              <p className="text-sm" style={{ color: 'var(--text2)' }}>
                Aucune notification à afficher dans cette catégorie.
              </p>
            </motion.div>
          ) : visible.map((notif, index) => (
            <NotificationItem
              key={notif.id}
              notif={notif}
              index={index}
              isPending={isPending}
              onMarquerLue={marquerLue}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
