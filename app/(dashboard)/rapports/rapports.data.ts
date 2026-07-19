// app/(dashboard)/rapports/rapports.data.ts
import { donneesMensuelles, factures, kpisMoisActuel } from '@/lib/data'

export type Periode    = 'mensuel' | 'trimestriel' | 'annuel'
export type VueRapport = 'apercu' | 'bilan' | 'resultat'

export interface LigneBilan {
  libelle: string
  montant: number
  info?: string
}

export interface LigneResultat {
  libelle: string
  montant: number
  type: 'produit' | 'charge' | 'resultat' | 'sous-total'
  info?: string
}

// ─── Bilan ────────────────────────────────────────────────────────────────────
const creancesClients = factures
  .filter((f) => f.statut === 'en_attente')
  .reduce((s, f) => s + f.montant, 0)

export const tresorerie      = kpisMoisActuel.solde
const immobilisations        = 850000 // mock
export const totalActif      = tresorerie + creancesClients + immobilisations

const detteFournisseurs      = 180000
const chargesConstater       = 45000
export const capitauxPropres = totalActif - detteFournisseurs - chargesConstater
export const totalPassif     = detteFournisseurs + chargesConstater + capitauxPropres

export const lignesActif: LigneBilan[] = [
  { libelle: 'Trésorerie (solde bancaire)', montant: tresorerie,       info: 'Argent disponible immédiatement sur vos comptes.' },
  { libelle: 'Créances clients',            montant: creancesClients,  info: "Factures émises mais pas encore payées par vos clients." },
  { libelle: 'Immobilisations',             montant: immobilisations,  info: 'Valeur de votre matériel, mobilier, équipements.' },
]

export const lignesPassif: LigneBilan[] = [
  { libelle: 'Dettes fournisseurs', montant: detteFournisseurs, info: 'Ce que vous devez encore à vos fournisseurs.' },
  { libelle: 'Charges à payer',     montant: chargesConstater,  info: 'Loyers, abonnements et autres charges dues.' },
  { libelle: 'Capitaux propres',    montant: capitauxPropres,  info: 'La valeur nette de votre entreprise (Actif − Dettes).' },
]

// ─── Résultat ─────────────────────────────────────────────────────────────────
export const totalRevenus6M   = donneesMensuelles.reduce((s, m) => s + m.revenus,  0)
export const totalDepenses6M  = donneesMensuelles.reduce((s, m) => s + m.depenses, 0)
const resultatExploit         = totalRevenus6M - totalDepenses6M
const chargesFinancieres      = 15000
export const resultatNet      = resultatExploit - chargesFinancieres
export const tauxMarge        = Math.round((resultatNet / totalRevenus6M) * 100)

export const lignesResultat: LigneResultat[] = [
  { libelle: 'Ventes et prestations',             montant: totalRevenus6M,          type: 'produit',     info: 'Total de tous vos revenus sur la période.' },
  { libelle: "Total Produits d'exploitation",     montant: totalRevenus6M,          type: 'sous-total' },
  { libelle: 'Achats et charges externes',        montant: totalDepenses6M * 0.6,   type: 'charge',      info: 'Achat stock, sous-traitance, loyer, télécoms…' },
  { libelle: 'Charges de personnel',              montant: totalDepenses6M * 0.36,  type: 'charge',      info: 'Salaires et charges sociales.' },
  { libelle: 'Autres charges',                    montant: totalDepenses6M * 0.04,  type: 'charge',      info: "Frais divers difficiles à catégoriser." },
  { libelle: "Total Charges d'exploitation",      montant: totalDepenses6M,         type: 'sous-total' },
  { libelle: "Résultat d'exploitation (EBIT)",   montant: resultatExploit,          type: 'resultat',    info: "Produits − Charges. C'est votre bénéfice opérationnel." },
  { libelle: 'Charges financières',               montant: chargesFinancieres,      type: 'charge',      info: "Intérêts d'emprunt, frais bancaires." },
  { libelle: 'Résultat net',                      montant: resultatNet,             type: 'resultat',    info: 'Le bénéfice final après toutes les charges.' },
]

// ─── Données pour Aperçu ─────────────────────────────────────────────────────
export const donneesMoisActuel = donneesMensuelles

export function getDonneesParPeriode(periode: Periode) {
  const totalRevenus  = totalRevenus6M
  const totalDepenses = totalDepenses6M
  const beneficeNet   = totalRevenus - totalDepenses

  if (periode === 'trimestriel') {
    return [
      {
        mois: 'T1 (Jan–Mar)',
        revenus:  donneesMensuelles.slice(0, 3).reduce((s, m) => s + m.revenus,  0),
        depenses: donneesMensuelles.slice(0, 3).reduce((s, m) => s + m.depenses, 0),
        benefice: donneesMensuelles.slice(0, 3).reduce((s, m) => s + m.benefice, 0),
      },
      {
        mois: 'T2 (Avr–Jun)',
        revenus:  donneesMensuelles.slice(3, 6).reduce((s, m) => s + m.revenus,  0),
        depenses: donneesMensuelles.slice(3, 6).reduce((s, m) => s + m.depenses, 0),
        benefice: donneesMensuelles.slice(3, 6).reduce((s, m) => s + m.benefice, 0),
      },
    ]
  }
  if (periode === 'annuel') {
    return [{ mois: 'Année 2026', revenus: totalRevenus, depenses: totalDepenses, benefice: beneficeNet }]
  }
  return donneesMensuelles
}
