// app/(dashboard)/tresorerie/tresorerie.data.ts
// Aucune donnée d'exemple : tout est calculé à partir de ce que l'utilisateur a saisi
// (comptes, transactions, factures, dépenses).

import type { Facture, Transaction } from '@/lib/data'

export interface CompteBancaire {
  id: string
  banque: string
  numero: string
  solde: number
  couleur: string
}

export interface MouvementTresorerie {
  date: string
  libelle: string
  debit: number
  credit: number
  soldeApres: number
  type: 'credit' | 'debit'
}

export interface DonneeJournaliere {
  date: string
  solde: number
}

export interface PrevisionMensuel {
  libelle: string
  montant: number
  type: 'entree' | 'sortie'
}

export interface DepenseAPayer {
  description: string
  montant: number
  statut: string
}

export const COMPTES_KEY = 'comptrack_comptes'
export const SEUIL_KEY = 'comptrack_seuil_alerte'

export const COULEURS_COMPTES = ['var(--gold)', 'var(--cyan)', 'var(--amber)', 'var(--green)']

function transactionsValides(transactions: Transaction[]): Transaction[] {
  return transactions
    .filter((t) => t.statut === 'validee')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
}

function signe(t: Transaction): number {
  return t.type === 'revenu' ? t.montant : -t.montant
}

/** Solde cumulé après chaque transaction validée, les 10 plus récentes en premier. */
export function construireMouvements(transactions: Transaction[]): MouvementTresorerie[] {
  let cumul = 0
  const tous = transactionsValides(transactions).map((t) => {
    cumul += signe(t)
    return {
      date: t.date,
      libelle: t.description || t.categorie,
      debit: t.type === 'depense' ? t.montant : 0,
      credit: t.type === 'revenu' ? t.montant : 0,
      soldeApres: cumul,
      type: t.type === 'revenu' ? ('credit' as const) : ('debit' as const),
    }
  })
  return tous.slice(-10).reverse()
}

/** Solde cumulé des transactions validées, jour par jour sur les `jours` derniers jours. */
export function soldeQuotidien(transactions: Transaction[], jours = 90): DonneeJournaliere[] {
  const valides = transactionsValides(transactions)
  if (valides.length === 0) return []
  const fin = new Date()
  fin.setHours(0, 0, 0, 0)
  const debut = new Date(fin)
  debut.setDate(fin.getDate() - (jours - 1))

  let cumul = valides
    .filter((t) => new Date(t.date).getTime() < debut.getTime())
    .reduce((s, t) => s + signe(t), 0)

  const data: DonneeJournaliere[] = []
  for (let i = 0; i < jours; i++) {
    const d = new Date(debut)
    d.setDate(debut.getDate() + i)
    const cle = d.toDateString()
    cumul += valides.filter((t) => new Date(t.date).toDateString() === cle).reduce((s, t) => s + signe(t), 0)
    data.push({ date: d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }), solde: Math.round(cumul) })
  }
  return data
}

/** Entrées attendues : factures émises et pas encore payées. */
export function previsionsEntrees(factures: Facture[]): PrevisionMensuel[] {
  return factures
    .filter((f) => f.statut === 'envoyee' || f.statut === 'en_attente' || f.statut === 'retard')
    .map((f) => ({ libelle: `Facture ${f.numero} — ${f.client}`, montant: f.montant, type: 'entree' as const }))
}

/** Sorties attendues : dépenses saisies comme « en attente » ou « en retard ». */
export function previsionsSorties(depenses: DepenseAPayer[]): PrevisionMensuel[] {
  return depenses
    .filter((d) => d.statut === 'En attente' || d.statut === 'En retard')
    .map((d) => ({ libelle: d.description, montant: d.montant, type: 'sortie' as const }))
}

export function fmt(n: number): string {
  return new Intl.NumberFormat('fr-FR').format(n) + ' FCFA'
}

export function fmtDate(s: string): string {
  return new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: 'short' }).format(new Date(s))
}
