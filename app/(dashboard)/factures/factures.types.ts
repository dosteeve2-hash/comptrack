// app/(dashboard)/factures/factures.types.ts
import type { Facture, FactureArticle } from '@/lib/data'

export const statutConfig: Record<Facture['statut'], { label: string; bg: string; color: string }> = {
  brouillon:  { label: 'Brouillon',  bg: 'rgba(139,148,158,0.1)', color: 'var(--text2)' },
  envoyee:    { label: 'Envoyée',    bg: 'rgba(59,130,246,0.1)',  color: 'var(--blue)'  },
  en_attente: { label: 'En attente', bg: 'rgba(245,158,11,0.1)',  color: 'var(--amber)' },
  payee:      { label: 'Payée',      bg: 'rgba(34,197,94,0.1)',   color: 'var(--green)' },
  retard:     { label: 'En retard',  bg: 'rgba(239,68,68,0.1)',   color: 'var(--red)'   },
  annulee:    { label: 'Annulée',    bg: 'rgba(75,85,99,0.12)',   color: 'var(--text3)' },
}

export const TVA_RATE = 0.18
export const tvaAmt = (ht: number) => Math.round(ht * TVA_RATE)
export const tvaTTC = (ht: number) => ht + Math.round(ht * TVA_RATE)

export const statutSuivant: Partial<Record<Facture['statut'], Facture['statut']>> = {
  brouillon:  'envoyee',
  envoyee:    'en_attente',
  en_attente: 'payee',
}

export interface NewFactureForm {
  client: string
  dateEcheance: string
  articles: FactureArticle[]
}

export const defaultArticle = (): FactureArticle => ({
  description: '',
  quantite: 1,
  prixUnitaire: 0,
  total: 0,
})
