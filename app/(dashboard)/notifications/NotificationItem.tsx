// app/(dashboard)/notifications/NotificationItem.tsx
import { motion } from 'framer-motion'
import { CheckCircle } from 'lucide-react'
import type { Notification } from './page'
import { TYPE_CONFIG, CATEGORIE_LABELS, tempsRelatif } from './notifications.helpers'

export function NotificationItem({
  notif,
  index,
  isPending,
  onMarquerLue,
}: {
  notif: Notification
  index: number
  isPending: boolean
  onMarquerLue: (id: string) => void
}) {
  const cfg = TYPE_CONFIG[notif.type]
  const IconComponent = cfg.icon

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ type: 'spring' as const, stiffness: 300, damping: 28, delay: index * 0.04 }}
      className="flex items-start gap-4 px-5 py-4 border-b transition-colors hover:bg-white/[0.02] last:border-b-0"
      style={{
        borderColor: 'var(--border)',
        background:  !notif.lue ? 'rgba(212,175,55,0.03)' : 'transparent',
        borderLeft:  !notif.lue ? '3px solid rgba(212,175,55,0.4)' : '3px solid transparent',
      }}>
      {/* Icône */}
      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
        style={{ background: cfg.bg }}>
        <IconComponent style={{ color: cfg.color, width: 18, height: 18 }} />
      </div>

      {/* Contenu */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <div className="flex items-center gap-2 flex-wrap">
            <p className={`text-sm font-semibold ${!notif.lue ? '' : 'opacity-80'}`}>{notif.titre}</p>
            {!notif.lue && <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: '#D4AF37' }} />}
          </div>
          <span className="text-xs flex-shrink-0 font-mono" style={{ color: 'var(--text3)' }}>
            {tempsRelatif(notif.created_at)}
          </span>
        </div>

        <p className="text-sm mb-2" style={{ color: 'var(--text2)' }}>{notif.message}</p>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="px-2 py-0.5 rounded-full text-xs font-medium"
            style={{ background: 'var(--bg3)', color: 'var(--text2)', border: '1px solid var(--border)' }}>
            {CATEGORIE_LABELS[notif.categorie] ?? notif.categorie}
          </span>
          {!notif.lue && (
            <button onClick={() => onMarquerLue(notif.id)} disabled={isPending}
              className="inline-flex items-center gap-1 text-xs font-medium transition-all hover:opacity-70 disabled:opacity-40"
              style={{ color: '#D4AF37' }}>
              <CheckCircle className="w-3 h-3" /> Marquer lue
            </button>
          )}
        </div>
      </div>
    </motion.div>
  )
}
