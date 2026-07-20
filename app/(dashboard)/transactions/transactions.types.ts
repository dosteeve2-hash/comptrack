// app/(dashboard)/transactions/transactions.types.ts
import type { Transaction } from '@/lib/data'

export interface NewTransactionForm {
  type: 'revenu' | 'depense'
  montant: string
  categorie: string
  description: string
  date: string
  client: string
}

export const defaultForm: NewTransactionForm = {
  type: 'revenu',
  montant: '',
  categorie: '',
  description: '',
  date: new Date().toISOString().split('T')[0],
  client: '',
}

export const statutLabels: Record<Transaction['statut'], { label: string; color: string }> = {
  validee:    { label: 'Validée',     color: 'var(--green)' },
  en_attente: { label: 'En attente',  color: 'var(--amber)' },
  annulee:    { label: 'Annulée',     color: 'var(--text2)' },
}

export type VueTx = 'simple' | 'journal'

// Plan SYSCOHADA simplifié
export const compteParCategorie: Record<string, { debit: string; credit: string }> = {
  'Ventes produits':      { debit: '5111 - Banque',              credit: '7011 - Ventes marchandes' },
  'Prestations services': { debit: '5111 - Banque',              credit: '7061 - Prestations services' },
  'Consultations':        { debit: '5111 - Banque',              credit: '7061 - Prestations services' },
  'Achat stock':          { debit: '3021 - Achats marchandises', credit: '5111 - Banque' },
  'Salaires':             { debit: '6611 - Salaires',            credit: '5111 - Banque' },
  'Loyer':                { debit: '6211 - Loyers',              credit: '5111 - Banque' },
  'Transport':            { debit: '6241 - Transport',           credit: '5111 - Banque' },
  'Télécommunications':   { debit: '6261 - Télécoms',            credit: '5111 - Banque' },
  'Électricité/Eau':      { debit: '6055 - Énergie/Eau',         credit: '5111 - Banque' },
  'Fournitures bureau':   { debit: '6011 - Fournitures',         credit: '5111 - Banque' },
  'Marketing':            { debit: '6631 - Publicité',           credit: '5111 - Banque' },
  'Maintenance':          { debit: '6051 - Entretien',           credit: '5111 - Banque' },
}
