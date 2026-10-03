// app/(dashboard)/notifications/notifications.helpers.ts
import { CheckCircle, AlertTriangle, XCircle, Info } from 'lucide-react'

export function tempsRelatif(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return 'À l\'instant'
  if (minutes < 60) return `Il y a ${minutes} min`
  const heures = Math.floor(minutes / 60)
  if (heures < 24) return `Il y a ${heures}h`
  const jours = Math.floor(heures / 24)
  return `Il y a ${jours}j`
}

export const TYPE_CONFIG = {
  succes: { icon: CheckCircle,   color: '#22c55e', bg: 'rgba(34,197,94,0.12)'  },
  alerte: { icon: AlertTriangle, color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
  erreur: { icon: XCircle,       color: '#ef4444', bg: 'rgba(239,68,68,0.12)'  },
  info:   { icon: Info,          color: '#00BCD4', bg: 'rgba(0,188,212,0.12)'  },
} as const

export type NotifType = keyof typeof TYPE_CONFIG

export const CATEGORIE_LABELS: Record<string, string> = {
  facture:     'Facture',
  depense:     'Dépense',
  objectif:    'Objectif',
  client:      'Client',
  fournisseur: 'Fournisseur',
  general:     'Général',
}

export type Filtre = 'toutes' | 'non-lues' | 'alertes'
