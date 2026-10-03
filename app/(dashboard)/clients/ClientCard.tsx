// app/(dashboard)/clients/ClientCard.tsx
import { MapPin, Phone, Mail } from 'lucide-react'
import type { Client } from '@/lib/data'
import { formatMontant, formatDate } from '@/lib/utils'

export function ClientCard({ client }: { client: Client }) {
  const isClient = client.type === 'client'
  const initials = client.nom.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase()

  return (
    <div className="p-5 rounded-2xl border transition-all hover:-translate-y-0.5"
      style={{ background: 'var(--bg2)', borderColor: 'var(--border)' }}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0"
            style={{
              background: isClient ? 'rgba(34,197,94,0.15)' : 'rgba(59,130,246,0.15)',
              color: isClient ? 'var(--green)' : 'var(--blue)',
            }}>
            {initials}
          </div>
          <div>
            <p className="font-semibold text-sm leading-tight">{client.nom}</p>
            <span className="text-xs font-mono font-medium px-1.5 py-0.5 rounded-full"
              style={{
                background: isClient ? 'rgba(34,197,94,0.1)' : 'rgba(59,130,246,0.1)',
                color: isClient ? 'var(--green)' : 'var(--blue)',
              }}>
              {client.type}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text2)' }}>
          <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
          {client.ville}, {client.pays}
        </div>
        {client.telephone && (
          <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text2)' }}>
            <Phone className="w-3.5 h-3.5 flex-shrink-0" />
            {client.telephone}
          </div>
        )}
        {client.email && (
          <div className="flex items-center gap-2 text-xs truncate" style={{ color: 'var(--text2)' }}>
            <Mail className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="truncate">{client.email}</span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: 'var(--border)' }}>
        <div>
          <p className="text-xs" style={{ color: 'var(--text2)' }}>Volume total</p>
          <p className="text-sm font-bold font-mono" style={{ color: 'var(--green)' }}>
            {formatMontant(client.totalTransactions)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs" style={{ color: 'var(--text2)' }}>Dernier contact</p>
          <p className="text-xs font-mono">{formatDate(client.dernierContact)}</p>
        </div>
      </div>
    </div>
  )
}
