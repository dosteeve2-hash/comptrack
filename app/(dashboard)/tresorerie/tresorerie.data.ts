// app/(dashboard)/tresorerie/tresorerie.data.ts

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

export const comptesBancaires: CompteBancaire[] = [
  { id: 'coris',   banque: 'Coris Bank International', numero: 'BF062 01234 56789 0', solde:  6_800_000, couleur: 'var(--gold)'  },
  { id: 'uba',     banque: 'UBA Burkina Faso',         numero: 'BF062 09876 54321 0', solde:  2_150_000, couleur: 'var(--cyan)'  },
  { id: 'ecobank', banque: 'Ecobank Burkina',          numero: 'BF062 05555 11111 0', solde: -100_000,   couleur: 'var(--amber)' },
]

export const mouvementsRecents: MouvementTresorerie[] = [
  { date: '2025-06-30', libelle: 'Vente marchandises — Famille Sawadogo',        debit: 0,         credit: 1_250_000, soldeApres: 6_800_000, type: 'credit' },
  { date: '2025-06-29', libelle: 'Règlement fournisseur SCIMA-BF',               debit: 750_000,   credit: 0,         soldeApres: 5_550_000, type: 'debit'  },
  { date: '2025-06-27', libelle: 'Loyer mensuel — Quartier Gounghin',            debit: 320_000,   credit: 0,         soldeApres: 6_300_000, type: 'debit'  },
  { date: '2025-06-26', libelle: 'Virement client — Entreprise Kaboré',          debit: 0,         credit: 2_100_000, soldeApres: 6_620_000, type: 'credit' },
  { date: '2025-06-25', libelle: 'Salaires — Juin 2025',                         debit: 1_800_000, credit: 0,         soldeApres: 4_520_000, type: 'debit'  },
  { date: '2025-06-23', libelle: 'Vente comptoir — Clientèle diverse',           debit: 0,         credit: 680_000,   soldeApres: 6_320_000, type: 'credit' },
  { date: '2025-06-20', libelle: 'Cotisations CNSS/CNAMGS',                      debit: 420_000,   credit: 0,         soldeApres: 5_640_000, type: 'debit'  },
  { date: '2025-06-18', libelle: 'Encaissement facture FA-2025-089',             debit: 0,         credit: 950_000,   soldeApres: 6_060_000, type: 'credit' },
  { date: '2025-06-15', libelle: 'Remboursement emprunt BF — tranche mensuelle', debit: 350_000,   credit: 0,         soldeApres: 5_110_000, type: 'debit'  },
  { date: '2025-06-12', libelle: 'Facture téléphonie & internet',                debit: 85_000,    credit: 0,         soldeApres: 5_460_000, type: 'debit'  },
]

export function genererSoldeQuotidien(): DonneeJournaliere[] {
  const data: DonneeJournaliere[] = []
  let solde = 4_200_000
  const debut = new Date('2025-04-01')
  for (let i = 0; i < 90; i++) {
    const d = new Date(debut)
    d.setDate(debut.getDate() + i)
    const variation = (Math.random() - 0.42) * 600_000
    solde = Math.max(500_000, solde + variation)
    data.push({ date: d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }), solde: Math.round(solde) })
  }
  data[data.length - 1].solde = 8_850_000
  return data
}

export const previsionsEntrees: PrevisionMensuel[] = [
  { libelle: 'Ventes prévisionnelles juillet', montant: 9_500_000, type: 'entree' },
  { libelle: 'Règlement créances clients',     montant: 3_200_000, type: 'entree' },
  { libelle: 'Remboursement TVA',              montant: 450_000,   type: 'entree' },
]

export const previsionsSorties: PrevisionMensuel[] = [
  { libelle: 'Salaires juillet',               montant: 1_800_000, type: 'sortie' },
  { libelle: 'Fournisseurs SCIMA-BF & autres', montant: 4_100_000, type: 'sortie' },
  { libelle: 'Loyers & charges locatives',     montant: 320_000,   type: 'sortie' },
  { libelle: 'Remboursement emprunt',          montant: 350_000,   type: 'sortie' },
  { libelle: 'Charges fiscales & sociales',    montant: 780_000,   type: 'sortie' },
]

export function fmt(n: number): string {
  return new Intl.NumberFormat('fr-FR').format(n) + ' FCFA'
}

export function fmtDate(s: string): string {
  return new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: 'short' }).format(new Date(s))
}
