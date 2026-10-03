import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import EmployesPage from '@/app/(dashboard)/employes/page'

// ─── Mocks ───────────────────────────────────────────────────────────────────
vi.mock('sonner', () => ({
  toast: { success: vi.fn(), error: vi.fn() },
  Toaster: () => null,
}))

vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: any) => <div>{children}</div>,
  BarChart: ({ children }: any) => <div>{children}</div>,
  Bar: () => null,
  LineChart: ({ children }: any) => <div>{children}</div>,
  Line: () => null,
  PieChart: ({ children }: any) => <div>{children}</div>,
  Pie: () => null,
  Cell: () => null,
  XAxis: () => null,
  YAxis: () => null,
  CartesianGrid: () => null,
  Tooltip: () => null,
  Legend: () => null,
  ComposedChart: ({ children }: any) => <div>{children}</div>,
}))

// ─── Helpers ─────────────────────────────────────────────────────────────────
const MOCK_NOMS = [
  'Ouédraogo Issouf',
  'Compaoré Aminata',
  'Kaboré Rasmané',
  'Sawadogo Fatoumata',
  'Zongo Bienvenu',
  'Tiendrébeogo Alice',
  'Ouattara Mamadou',
  'Diallo Mariam',
  'Rouamba Théodore',
  'Nana Sylvie',
]

// ─── Suite ───────────────────────────────────────────────────────────────────
describe('EmployesPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // 1 — Rendu de base
  it('affiche le titre "Employés"', () => {
    render(<EmployesPage />)
    expect(screen.getByRole('heading', { name: /employés/i })).toBeInTheDocument()
  })

  // 2 — Bouton principal
  it('affiche le bouton "Nouvel employé"', () => {
    render(<EmployesPage />)
    expect(screen.getByRole('button', { name: /nouvel employé/i })).toBeInTheDocument()
  })

  // 3 — KPI : Total employés
  it('KPI Total employés = 10', () => {
    render(<EmployesPage />)
    expect(screen.getByText('10')).toBeInTheDocument()
  })

  // 4 — KPI : Actifs (9 actifs dans le mock)
  it('KPI Actifs = 9', () => {
    render(<EmployesPage />)
    // label "Actifs" présent
    expect(screen.getByText('Actifs')).toBeInTheDocument()
    // valeur 9 présente
    expect(screen.getByText('9')).toBeInTheDocument()
  })

  // 5 — KPI : Masse salariale label
  it('affiche le label "Masse salariale"', () => {
    render(<EmployesPage />)
    expect(screen.getByText('Masse salariale')).toBeInTheDocument()
  })

  // 6 — KPI : Masse salariale valeur formatée (somme = 1 850 000)
  it('affiche la masse salariale formatée en FCFA', () => {
    render(<EmployesPage />)
    expect(screen.getByText(/1.*850.*000.*FCFA/i)).toBeInTheDocument()
  })

  // 7 — KPI : Fourchette label
  it('affiche le label "Fourchette"', () => {
    render(<EmployesPage />)
    expect(screen.getByText('Fourchette')).toBeInTheDocument()
  })

  // 8 — KPI : Fourchette valeur (min 75k, max 350k)
  it('affiche la fourchette salariale min–max', () => {
    render(<EmployesPage />)
    expect(screen.getByText(/75k.*350k.*FCFA/i)).toBeInTheDocument()
  })

  // 9 — Tableau : colonnes en-têtes
  it('affiche les colonnes du tableau', () => {
    render(<EmployesPage />)
    for (const h of ['Employé', 'Département', 'Poste', 'Salaire', 'Contrat', 'Statut', 'Entrée']) {
      expect(screen.getByText(h)).toBeInTheDocument()
    }
  })

  // 10 — Tableau : noms mock présents
  it('affiche tous les noms des employés mock', () => {
    render(<EmployesPage />)
    for (const nom of MOCK_NOMS) {
      expect(screen.getByText(nom)).toBeInTheDocument()
    }
  })

  // 11 — Tableau : département "Commercial" visible
  it('affiche le département Commercial', () => {
    render(<EmployesPage />)
    const cells = screen.getAllByText('Commercial')
    expect(cells.length).toBeGreaterThan(0)
  })

  // 12 — Tableau : badge statut Actif
  it('affiche des badges "Actif"', () => {
    render(<EmployesPage />)
    const badges = screen.getAllByText('Actif')
    expect(badges.length).toBeGreaterThanOrEqual(9)
  })

  // 13 — Tableau : badge statut Congé
  it('affiche le badge "Congé" pour Tiendrébeogo Alice', () => {
    render(<EmployesPage />)
    expect(screen.getByText('Congé')).toBeInTheDocument()
  })

  // 14 — Tableau : badge contrat CDI
  it('affiche des badges contrat "CDI"', () => {
    render(<EmployesPage />)
    const cdi = screen.getAllByText('CDI')
    expect(cdi.length).toBeGreaterThanOrEqual(7)
  })

  // 15 — Tableau : badge contrat Stage
  it('affiche le badge contrat "Stage"', () => {
    render(<EmployesPage />)
    expect(screen.getByText('Stage')).toBeInTheDocument()
  })

  // 16 — Recherche : filtre par nom
  it('filtre les employés par recherche (nom)', () => {
    render(<EmployesPage />)
    const input = screen.getByPlaceholderText(/rechercher un employé/i)
    fireEvent.change(input, { target: { value: 'Diallo' } })
    expect(screen.getByText('Diallo Mariam')).toBeInTheDocument()
    expect(screen.queryByText('Ouédraogo Issouf')).not.toBeInTheDocument()
  })

  // 17 — Recherche : filtre par poste
  it('filtre par poste', () => {
    render(<EmployesPage />)
    const input = screen.getByPlaceholderText(/rechercher un employé/i)
    fireEvent.change(input, { target: { value: 'comptable' } })
    expect(screen.getByText('Compaoré Aminata')).toBeInTheDocument()
    expect(screen.queryByText('Zongo Bienvenu')).not.toBeInTheDocument()
  })

  // 18 — Recherche : aucun résultat
  it('affiche "Aucun employé trouvé" si recherche vide', () => {
    render(<EmployesPage />)
    const input = screen.getByPlaceholderText(/rechercher un employé/i)
    fireEvent.change(input, { target: { value: 'xyzXYZinexistant' } })
    expect(screen.getByText(/aucun employé trouvé/i)).toBeInTheDocument()
  })

  // 19 — Filtre département : bouton "Tous" actif par défaut
  it('affiche le filtre "Tous" sélectionné par défaut', () => {
    render(<EmployesPage />)
    const btn = screen.getAllByRole('button', { name: /tous/i })[0]
    expect(btn).toBeInTheDocument()
  })

  // 20 — Filtre département : filtrage Finance
  it('filtre par département Finance', () => {
    render(<EmployesPage />)
    const btnFinance = screen.getByRole('button', { name: 'Finance' })
    fireEvent.click(btnFinance)
    expect(screen.getByText('Compaoré Aminata')).toBeInTheDocument()
    expect(screen.queryByText('Ouédraogo Issouf')).not.toBeInTheDocument()
  })

  // 21 — Filtre département : filtrage Logistique
  it('filtre par département Logistique', () => {
    render(<EmployesPage />)
    const btn = screen.getByRole('button', { name: 'Logistique' })
    fireEvent.click(btn)
    expect(screen.getByText('Rouamba Théodore')).toBeInTheDocument()
    expect(screen.getByText('Ouattara Mamadou')).toBeInTheDocument()
    expect(screen.queryByText('Diallo Mariam')).not.toBeInTheDocument()
  })

  // 22 — Résumé filtre: affiche le compte
  it('affiche le résumé "X / Y employés affichés"', () => {
    render(<EmployesPage />)
    expect(screen.getByText(/10 \/ 10 employés affichés/i)).toBeInTheDocument()
  })

  // 23 — Modal : fermé par défaut
  it('le modal "Nouvel employé" est fermé par défaut', () => {
    render(<EmployesPage />)
    expect(screen.queryByText('Nom complet *')).not.toBeInTheDocument()
  })

  // 24 — Modal : s'ouvre au clic
  it('ouvre le modal au clic sur "Nouvel employé"', () => {
    render(<EmployesPage />)
    fireEvent.click(screen.getByRole('button', { name: /nouvel employé/i }))
    expect(screen.getByText('Nom complet *')).toBeInTheDocument()
  })

  // 25 — Modal : champs présents
  it('le modal contient tous les champs du formulaire', () => {
    render(<EmployesPage />)
    fireEvent.click(screen.getByRole('button', { name: /nouvel employé/i }))
    expect(screen.getByPlaceholderText(/Koné Bakary/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/Comptable/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/180000/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/\+226/i)).toBeInTheDocument()
  })

  // 26 — Modal : fermeture via bouton Annuler
  it('ferme le modal via Annuler', () => {
    render(<EmployesPage />)
    fireEvent.click(screen.getByRole('button', { name: /nouvel employé/i }))
    fireEvent.click(screen.getByRole('button', { name: /annuler/i }))
    expect(screen.queryByText('Nom complet *')).not.toBeInTheDocument()
  })

  // 27 — Modal : fermeture via bouton X
  it('ferme le modal via le bouton X', () => {
    render(<EmployesPage />)
    fireEvent.click(screen.getByRole('button', { name: /nouvel employé/i }))
    // Le bouton X est le bouton sans libellé texte qui contient l'icône X
    const buttons = screen.getAllByRole('button')
    const closeBtn = buttons.find(b => b.querySelector('svg') && !b.textContent?.match(/employé|annuler/i))
    if (closeBtn) fireEvent.click(closeBtn)
    expect(screen.queryByText('Nom complet *')).not.toBeInTheDocument()
  })

  // 28 — Modal : ajout d'un employé
  it('ajoute un nouvel employé et le montre dans la liste', async () => {
    render(<EmployesPage />)
    fireEvent.click(screen.getByRole('button', { name: /nouvel employé/i }))

    fireEvent.change(screen.getByPlaceholderText(/Koné Bakary/i), { target: { value: 'Test Employé' } })
    fireEvent.change(screen.getByPlaceholderText(/Comptable/i), { target: { value: 'Analyste' } })
    fireEvent.change(screen.getByPlaceholderText(/180000/i), { target: { value: '200000' } })

    fireEvent.click(screen.getByRole('button', { name: /ajouter/i }))

    expect(screen.getByText('Test Employé')).toBeInTheDocument()
  })

  // 29 — Initiales dans l'avatar
  it('affiche les initiales dans l\'avatar (ex: OI pour Ouédraogo Issouf)', () => {
    render(<EmployesPage />)
    expect(screen.getByText('OI')).toBeInTheDocument()
  })

  // 30 — Compteur d'employés dans le sous-titre
  it('affiche le compteur d\'employés dans le sous-titre', () => {
    render(<EmployesPage />)
    expect(screen.getByText(/10 employés/i)).toBeInTheDocument()
  })
})
