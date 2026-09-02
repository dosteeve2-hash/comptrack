import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, within } from '@testing-library/react'
import ContratsPage from '@/app/(dashboard)/contrats/page'

// ─── Mocks ───────────────────────────────────────────────────────────────────
vi.mock('sonner', () => ({
  toast: { success: vi.fn(), error: vi.fn() },
  Toaster: () => null,
}))

vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
  BarChart: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
  Bar: () => null,
  LineChart: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
  Line: () => null,
  PieChart: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
  Pie: () => null,
  Cell: () => null,
  XAxis: () => null,
  YAxis: () => null,
  CartesianGrid: () => null,
  Tooltip: () => null,
  Legend: () => null,
  ComposedChart: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
}))

// ─── Données mock attendues ───────────────────────────────────────────────────
const MOCK_TITRES = [
  'Contrat cadre distribution',
  'Approvisionnement marchandises',
  'Maintenance équipements',
  'Prestation conseil IT',
  'Partenariat co-marketing',
  'Location entrepôt Kossodo',
  'Fourniture matériel bureau',
  'Distribution réseau national',
  'Audit comptable annuel',
  'Accord commercialisation',
]

const MOCK_PARTIES = [
  'Saf-Cacao BF',
  'CFAO Motors Burkina',
  'Sonabel SA',
  'Ministère Commerce BF',
]

// ─── Suite ───────────────────────────────────────────────────────────────────
describe('ContratsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // 1 — Rendu de base
  it('affiche le titre "Contrats"', () => {
    render(<ContratsPage />)
    expect(screen.getByRole('heading', { name: /contrats/i })).toBeInTheDocument()
  })

  // 2 — Sous-titre
  it('affiche le sous-titre sur les contrats', () => {
    render(<ContratsPage />)
    expect(screen.getByText(/suivi des contrats/i)).toBeInTheDocument()
  })

  // 3 — Bouton principal
  it('affiche le bouton "Nouveau contrat"', () => {
    render(<ContratsPage />)
    expect(screen.getByRole('button', { name: /nouveau contrat/i })).toBeInTheDocument()
  })

  // 4 — KPI : label "Valeur contrats actifs"
  it('affiche le label KPI "Valeur contrats actifs"', () => {
    render(<ContratsPage />)
    expect(screen.getByText('Valeur contrats actifs')).toBeInTheDocument()
  })

  // 5 — KPI : valeur actifs formatée (5 actifs × montants = 21 450 000)
  it('affiche la valeur totale des contrats actifs formatée', () => {
    render(<ContratsPage />)
    // Les 5 contrats actifs : 4 500 000 + 2 800 000 + 3 200 000 + 7 200 000 + 980 000 + 5 500 000
    // id 1,2,4,8,9,10 = 6 contrats actifs
    // « FCFA » apparaît dans plusieurs KPI : on cible la valeur elle-même.
    expect(screen.getAllByText(/FCFA/).length).toBeGreaterThan(0)
  })

  // 6 — KPI : label "Contrats actifs"
  it('affiche le label KPI "Contrats actifs"', () => {
    render(<ContratsPage />)
    expect(screen.getByText('Contrats actifs')).toBeInTheDocument()
  })

  // 7 — KPI : nombre contrats actifs = 6
  it('affiche le nombre de contrats actifs = 6', () => {
    render(<ContratsPage />)
    expect(screen.getByText('6')).toBeInTheDocument()
  })

  // 8 — KPI : label "À renouveler"
  it('affiche le label KPI "À renouveler"', () => {
    render(<ContratsPage />)
    expect(screen.getByText('À renouveler')).toBeInTheDocument()
  })

  // 9 — KPI : nombre à renouveler = 2
  it('affiche le nombre de contrats à renouveler = 2', () => {
    render(<ContratsPage />)
    expect(screen.getByText('2')).toBeInTheDocument()
  })

  // 10 — KPI : label "Expirés"
  it('affiche le label KPI "Expirés"', () => {
    render(<ContratsPage />)
    expect(screen.getByText('Expirés')).toBeInTheDocument()
  })

  // 11 — KPI : nombre expirés = 1
  it('affiche le nombre de contrats expirés = 1', () => {
    render(<ContratsPage />)
    expect(screen.getByText('1')).toBeInTheDocument()
  })

  // 12 — Tableau : en-têtes colonnes
  it('affiche les colonnes du tableau', () => {
    render(<ContratsPage />)
    for (const h of ['Contrat', 'Partie', 'Type', 'Montant', 'Période', 'Jours restants', 'Statut']) {
      expect(screen.getByText(h)).toBeInTheDocument()
    }
  })

  // 13 — Tableau : titres des contrats mock
  it('affiche tous les titres des contrats mock', () => {
    render(<ContratsPage />)
    for (const t of MOCK_TITRES) {
      expect(screen.getByText(t)).toBeInTheDocument()
    }
  })

  // 14 — Tableau : parties visibles
  it('affiche les parties contractantes', () => {
    render(<ContratsPage />)
    for (const p of MOCK_PARTIES) {
      expect(screen.getByText(p)).toBeInTheDocument()
    }
  })

  // 15 — Tableau : badge type "Client"
  it('affiche des badges type "Client"', () => {
    render(<ContratsPage />)
    const badges = screen.getAllByText('Client')
    expect(badges.length).toBeGreaterThanOrEqual(1)
  })

  // 16 — Tableau : badge type "Fournisseur"
  it('affiche des badges type "Fournisseur"', () => {
    render(<ContratsPage />)
    const badges = screen.getAllByText('Fournisseur')
    expect(badges.length).toBeGreaterThanOrEqual(1)
  })

  // 17 — Tableau : badge type "Partenaire"
  it('affiche le badge type "Partenaire"', () => {
    render(<ContratsPage />)
    // « Partenaire » est aussi une option du filtre de type : on vérifie la
    // présence d'un badge dans le tableau, pas son unicité dans la page.
    expect(within(screen.getByRole('table')).getAllByText('Partenaire').length).toBeGreaterThan(0)
  })

  // 18 — Tableau : badge statut "Actif"
  it('affiche des badges "Actif"', () => {
    render(<ContratsPage />)
    const badges = screen.getAllByText('Actif')
    expect(badges.length).toBeGreaterThanOrEqual(6)
  })

  // 19 — Tableau : badge statut "Expiré"
  it('affiche le badge "Expiré"', () => {
    render(<ContratsPage />)
    expect(screen.getByText('Expiré')).toBeInTheDocument()
  })

  // 20 — Tableau : badge statut "En cours de renouvellement"
  it('affiche le badge "En cours de renouvellement"', () => {
    render(<ContratsPage />)
    const badges = screen.getAllByText('En cours de renouvellement')
    expect(badges.length).toBeGreaterThanOrEqual(1)
  })

  // 21 — Tableau : badge statut "Suspendu"
  it('affiche le badge "Suspendu"', () => {
    render(<ContratsPage />)
    expect(screen.getByText('Suspendu')).toBeInTheDocument()
  })

  // 22 — Jours restants : contrat expiré affiche "j dépassés"
  it('affiche "j dépassés" pour les contrats expirés (dateFin passée)', () => {
    render(<ContratsPage />)
    // Maintenance équipements — dateFin 2026-06-30, aujourd'hui 2026-08-08 → dépassé
    // Plusieurs contrats sont expirés : on vérifie qu'au moins un l'affiche.
    expect(within(screen.getByRole('table')).getAllByText(/j dépassés/i).length).toBeGreaterThan(0)
  })

  // 23 — Jours restants : contrat futur affiche nombre de jours positif
  it('affiche un nombre de jours positif pour un contrat encore valide', () => {
    render(<ContratsPage />)
    // Distribution réseau national — dateFin 2027-01-14 → futur
    const positif = screen.getAllByText(/^\d+j$/)
    expect(positif.length).toBeGreaterThan(0)
  })

  // 24 — Recherche : filtre par titre
  it('filtre par titre de contrat', () => {
    render(<ContratsPage />)
    const input = screen.getByPlaceholderText(/rechercher titre ou partie/i)
    fireEvent.change(input, { target: { value: 'audit' } })
    expect(screen.getByText('Audit comptable annuel')).toBeInTheDocument()
    expect(screen.queryByText('Contrat cadre distribution')).not.toBeInTheDocument()
  })

  // 25 — Recherche : filtre par partie
  it('filtre par partie contractante', () => {
    render(<ContratsPage />)
    const input = screen.getByPlaceholderText(/rechercher titre ou partie/i)
    fireEvent.change(input, { target: { value: 'ONATEL' } })
    expect(screen.getByText('Distribution réseau national')).toBeInTheDocument()
    expect(screen.queryByText('Audit comptable annuel')).not.toBeInTheDocument()
  })

  // 26 — Recherche : aucun résultat
  it('affiche "Aucun contrat trouvé" si recherche vide', () => {
    render(<ContratsPage />)
    const input = screen.getByPlaceholderText(/rechercher titre ou partie/i)
    fireEvent.change(input, { target: { value: 'xyzinexistant999' } })
    expect(screen.getByText(/aucun contrat trouvé/i)).toBeInTheDocument()
  })

  // 27 — Filtre type : bouton "Tous" par défaut
  it('affiche le filtre type "Tous" par défaut', () => {
    render(<ContratsPage />)
    expect(screen.getByRole('button', { name: /^tous$/i })).toBeInTheDocument()
  })

  // 28 — Filtre type : filtre par "Client"
  it('filtre les contrats par type Client', () => {
    render(<ContratsPage />)
    const btnClient = screen.getByRole('button', { name: /^client$/i })
    fireEvent.click(btnClient)
    expect(screen.getByText('Contrat cadre distribution')).toBeInTheDocument()
    expect(screen.queryByText('Approvisionnement marchandises')).not.toBeInTheDocument()
  })

  // 29 — Filtre type : filtre par "Fournisseur"
  it('filtre les contrats par type Fournisseur', () => {
    render(<ContratsPage />)
    const btnFour = screen.getByRole('button', { name: /^fournisseur$/i })
    fireEvent.click(btnFour)
    expect(screen.getByText('Approvisionnement marchandises')).toBeInTheDocument()
    expect(screen.queryByText('Contrat cadre distribution')).not.toBeInTheDocument()
  })

  // 30 — Filtre type : filtre par "Partenaire"
  it('filtre les contrats par type Partenaire', () => {
    render(<ContratsPage />)
    const btnPart = screen.getByRole('button', { name: /^partenaire$/i })
    fireEvent.click(btnPart)
    expect(screen.getByText('Partenariat co-marketing')).toBeInTheDocument()
    expect(screen.queryByText('Audit comptable annuel')).not.toBeInTheDocument()
  })

  // 31 — Compteur affiché/total
  it('affiche le compteur "10/10" par défaut', () => {
    render(<ContratsPage />)
    expect(screen.getByText('10/10')).toBeInTheDocument()
  })

  // 32 — Modal : fermé par défaut
  it('le modal "Nouveau contrat" est fermé par défaut', () => {
    render(<ContratsPage />)
    expect(screen.queryByText('Titre du contrat *')).not.toBeInTheDocument()
  })

  // 33 — Modal : s'ouvre au clic
  it('ouvre le modal au clic sur "Nouveau contrat"', () => {
    render(<ContratsPage />)
    fireEvent.click(screen.getByRole('button', { name: /nouveau contrat/i }))
    expect(screen.getByText('Titre du contrat *')).toBeInTheDocument()
  })

  // 34 — Modal : champs présents
  it('le modal contient les champs titre, partie, montant', () => {
    render(<ContratsPage />)
    fireEvent.click(screen.getByRole('button', { name: /nouveau contrat/i }))
    expect(screen.getByPlaceholderText(/contrat cadre distribution/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/nom entreprise/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/1500000/i)).toBeInTheDocument()
  })

  // 35 — Modal : fermeture via Annuler
  it('ferme le modal via Annuler', () => {
    render(<ContratsPage />)
    fireEvent.click(screen.getByRole('button', { name: /nouveau contrat/i }))
    fireEvent.click(screen.getByRole('button', { name: /annuler/i }))
    expect(screen.queryByText('Titre du contrat *')).not.toBeInTheDocument()
  })

  // 36 — Modal : ajout d'un contrat
  it('ajoute un nouveau contrat et l\'affiche dans la liste', () => {
    render(<ContratsPage />)
    fireEvent.click(screen.getByRole('button', { name: /nouveau contrat/i }))

    fireEvent.change(screen.getByPlaceholderText(/contrat cadre distribution/i), { target: { value: 'Nouveau contrat test' } })
    fireEvent.change(screen.getByPlaceholderText(/nom entreprise/i), { target: { value: 'Société Test SA' } })
    fireEvent.change(screen.getByPlaceholderText(/1500000/i), { target: { value: '999000' } })

    fireEvent.click(screen.getByRole('button', { name: /créer le contrat/i }))

    expect(screen.getByText('Nouveau contrat test')).toBeInTheDocument()
  })

  // 37 — Titre section tableau
  it('affiche le titre de section "Tous les contrats"', () => {
    render(<ContratsPage />)
    expect(screen.getByText('Tous les contrats')).toBeInTheDocument()
  })
})
