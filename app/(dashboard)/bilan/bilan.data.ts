// app/(dashboard)/bilan/bilan.data.ts

export interface PosteBilan {
  label: string
  montantN: number
  montantN1: number
}

export interface SectionBilan {
  titre: string
  couleur: string
  postes: PosteBilan[]
}

export const actifN: SectionBilan[] = [
  {
    titre: 'Immobilisations corporelles', couleur: 'var(--cyan)',
    postes: [
      { label: 'Terrains & constructions', montantN: 8_500_000, montantN1: 8_500_000 },
      { label: 'Matériels & équipements',  montantN: 4_200_000, montantN1: 3_800_000 },
      { label: 'Véhicules',                montantN: 2_100_000, montantN1: 2_450_000 },
    ],
  },
  {
    titre: 'Immobilisations incorporelles', couleur: 'var(--blue)',
    postes: [
      { label: 'Fonds de commerce',  montantN: 3_000_000, montantN1: 3_000_000 },
      { label: 'Licences & brevets', montantN: 450_000,   montantN1: 600_000   },
    ],
  },
  {
    titre: 'Immobilisations financières', couleur: 'var(--amber)',
    postes: [
      { label: 'Titres de participation', montantN: 1_200_000, montantN1: 1_200_000 },
      { label: 'Dépôts & cautionnements', montantN: 350_000,   montantN1: 300_000   },
    ],
  },
  {
    titre: 'Actif circulant', couleur: 'var(--green)',
    postes: [
      { label: 'Stocks de marchandises', montantN: 12_300_000, montantN1: 9_800_000 },
      { label: 'Créances clients',       montantN: 7_450_000,  montantN1: 6_200_000 },
      { label: 'Autres créances',        montantN: 1_100_000,  montantN1: 950_000   },
      { label: 'Disponibilités (banque)',montantN: 6_800_000,  montantN1: 5_400_000 },
      { label: 'Caisse',                 montantN: 1_250_000,  montantN1: 980_000   },
    ],
  },
]

export const passifN: SectionBilan[] = [
  {
    titre: 'Capitaux propres', couleur: 'var(--gold)',
    postes: [
      { label: 'Capital social',           montantN: 15_000_000, montantN1: 15_000_000 },
      { label: 'Réserves légales',         montantN:  3_200_000, montantN1:  2_500_000 },
      { label: "Résultat de l'exercice N", montantN:  4_350_000, montantN1:  3_820_000 },
      { label: 'Report à nouveau',         montantN:  5_450_000, montantN1:  3_980_000 },
    ],
  },
  {
    titre: 'Dettes financières', couleur: 'var(--red)',
    postes: [
      { label: 'Emprunts bancaires LT', montantN: 8_200_000, montantN1: 9_500_000 },
      { label: 'Emprunts bancaires CT', montantN: 2_500_000, montantN1: 1_800_000 },
      { label: 'Découverts bancaires',  montantN:   850_000, montantN1: 1_200_000 },
    ],
  },
  {
    titre: "Dettes d'exploitation", couleur: 'var(--amber)',
    postes: [
      { label: 'Fournisseurs',               montantN: 5_700_000, montantN1: 4_900_000 },
      { label: 'Dettes fiscales & sociales', montantN: 2_100_000, montantN1: 1_750_000 },
      { label: 'Avances clients',            montantN: 1_050_000, montantN1:   730_000 },
      { label: 'Autres dettes',              montantN:   300_000, montantN1:   500_000 },
    ],
  },
]

export function somme(sections: SectionBilan[], exercice: 'N' | 'N1'): number {
  return sections.flatMap((s) => s.postes).reduce((a, p) => a + (exercice === 'N' ? p.montantN : p.montantN1), 0)
}

export function sommeSec(s: SectionBilan, ex: 'N' | 'N1'): number {
  return s.postes.reduce((a, p) => a + (ex === 'N' ? p.montantN : p.montantN1), 0)
}

export function fmt(n: number): string {
  return new Intl.NumberFormat('fr-FR').format(n) + ' FCFA'
}
