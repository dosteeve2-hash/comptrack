// app/(dashboard)/bilan/bilan.data.ts

export interface PosteBilan {
  label: string
}

export type ValeursBilan = Record<string, { n: number; n1: number }>

export const BILAN_KEY = 'comptrack_bilan'

export function clePoste(section: SectionBilan, poste: PosteBilan): string {
  return `${section.titre}|${poste.label}`
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
      { label: 'Terrains & constructions' },
      { label: 'Matériels & équipements' },
      { label: 'Véhicules' },
    ],
  },
  {
    titre: 'Immobilisations incorporelles', couleur: 'var(--blue)',
    postes: [
      { label: 'Fonds de commerce' },
      { label: 'Licences & brevets' },
    ],
  },
  {
    titre: 'Immobilisations financières', couleur: 'var(--amber)',
    postes: [
      { label: 'Titres de participation' },
      { label: 'Dépôts & cautionnements' },
    ],
  },
  {
    titre: 'Actif circulant', couleur: 'var(--green)',
    postes: [
      { label: 'Stocks de marchandises' },
      { label: 'Créances clients' },
      { label: 'Autres créances' },
      { label: 'Disponibilités (banque)' },
      { label: 'Caisse' },
    ],
  },
]

export const passifN: SectionBilan[] = [
  {
    titre: 'Capitaux propres', couleur: 'var(--gold)',
    postes: [
      { label: 'Capital social' },
      { label: 'Réserves légales' },
      { label: "Résultat de l'exercice N" },
      { label: 'Report à nouveau' },
    ],
  },
  {
    titre: 'Dettes financières', couleur: 'var(--red)',
    postes: [
      { label: 'Emprunts bancaires LT' },
      { label: 'Emprunts bancaires CT' },
      { label: 'Découverts bancaires' },
    ],
  },
  {
    titre: "Dettes d'exploitation", couleur: 'var(--amber)',
    postes: [
      { label: 'Fournisseurs' },
      { label: 'Dettes fiscales & sociales' },
      { label: 'Avances clients' },
      { label: 'Autres dettes' },
    ],
  },
]

export function montantPoste(valeurs: ValeursBilan, section: SectionBilan, poste: PosteBilan, ex: 'N' | 'N1'): number {
  const v = valeurs[clePoste(section, poste)]
  if (!v) return 0
  return ex === 'N' ? v.n : v.n1
}

export function somme(sections: SectionBilan[], valeurs: ValeursBilan, exercice: 'N' | 'N1'): number {
  return sections.reduce((a, s) => a + sommeSec(s, valeurs, exercice), 0)
}

export function sommeSec(s: SectionBilan, valeurs: ValeursBilan, ex: 'N' | 'N1'): number {
  return s.postes.reduce((a, p) => a + montantPoste(valeurs, s, p, ex), 0)
}

export function fmt(n: number): string {
  return new Intl.NumberFormat('fr-FR').format(n) + ' FCFA'
}
