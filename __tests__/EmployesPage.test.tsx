import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import EmployesPage from '@/app/(dashboard)/employes/page'

vi.mock('sonner', () => ({
  toast: { success: vi.fn(), error: vi.fn() },
  Toaster: () => null,
}))

vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
  BarChart: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
  Bar: () => null,
  Cell: () => null,
  XAxis: () => null,
  YAxis: () => null,
  CartesianGrid: () => null,
  Tooltip: () => null,
}))

const STORAGE_KEY = 'comptrack_employes'

// Données de test uniquement : l'application ne contient aucun employé par défaut.
const FIXTURES = [
  { id: 1, nom: 'Employé Alpha', poste: 'Poste un', dept: 'Finance', salaire: 100000, contrat: 'CDI', statut: 'Actif', dateEntree: '2020-01-01', telephone: '' },
  { id: 2, nom: 'Employé Beta', poste: 'Poste deux', dept: 'Logistique', salaire: 200000, contrat: 'CDD', statut: 'Congé', dateEntree: '2021-01-01', telephone: '' },
  { id: 3, nom: 'Employé Gamma', poste: 'Poste trois', dept: 'Finance', salaire: 300000, contrat: 'Stage', statut: 'Actif', dateEntree: '2022-01-01', telephone: '' },
]

describe('EmployesPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  describe('sans aucune donnée', () => {
    it('affiche le titre et le bouton principal', () => {
      render(<EmployesPage />)
      expect(screen.getByRole('heading', { name: /employés/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /nouvel employé/i })).toBeInTheDocument()
    })

    it('affiche un état vide honnête avec une action', () => {
      render(<EmployesPage />)
      expect(screen.getByText(/aucun employé enregistré pour le moment/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /ajouter un employé/i })).toBeInTheDocument()
    })

    it("n'affiche aucun nom de personne inventé", () => {
      render(<EmployesPage />)
      for (const faux of ['Ouédraogo Issouf', 'Compaoré Aminata', 'Kaboré Rasmané', 'Nana Sylvie']) {
        expect(screen.queryByText(faux)).not.toBeInTheDocument()
      }
    })

    it('affiche les indicateurs à zéro et pas de fourchette inventée', () => {
      render(<EmployesPage />)
      expect(screen.getByText('Total employés')).toBeInTheDocument()
      expect(screen.getByText('Masse salariale')).toBeInTheDocument()
      expect(screen.getByText('Fourchette').closest('div')?.parentElement).toHaveTextContent('—')
    })

    it('affiche les colonnes du tableau', () => {
      render(<EmployesPage />)
      for (const h of ['Employé', 'Département', 'Poste', 'Salaire', 'Contrat', 'Statut', 'Entrée']) {
        expect(screen.getAllByText(h).length).toBeGreaterThan(0)
      }
    })
  })

  describe('ajout', () => {
    it('ouvre puis ferme le formulaire', () => {
      render(<EmployesPage />)
      expect(screen.queryByText('Nom complet *')).not.toBeInTheDocument()
      fireEvent.click(screen.getByRole('button', { name: /nouvel employé/i }))
      expect(screen.getByText('Nom complet *')).toBeInTheDocument()
      fireEvent.click(screen.getByRole('button', { name: /annuler/i }))
      expect(screen.queryByText('Nom complet *')).not.toBeInTheDocument()
    })

    it('contient les champs du formulaire', () => {
      render(<EmployesPage />)
      fireEvent.click(screen.getByRole('button', { name: /nouvel employé/i }))
      for (const p of [/prénom et nom/i, /fonction/i, /salaire mensuel/i, /numéro de téléphone/i]) {
        expect(screen.getByPlaceholderText(p)).toBeInTheDocument()
      }
    })

    it("enregistre l'employé, l'affiche et le garde après rechargement", async () => {
      const { unmount } = render(<EmployesPage />)
      fireEvent.click(screen.getByRole('button', { name: /nouvel employé/i }))
      fireEvent.change(screen.getByPlaceholderText(/prénom et nom/i), { target: { value: 'Test Employé' } })
      fireEvent.change(screen.getByPlaceholderText(/fonction/i), { target: { value: 'Analyste' } })
      fireEvent.change(screen.getByPlaceholderText(/salaire mensuel/i), { target: { value: '200000' } })
      fireEvent.click(screen.getByRole('button', { name: /^ajouter$/i }))

      expect(screen.getByText('Test Employé')).toBeInTheDocument()
      expect(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')).toHaveLength(1)

      unmount()
      render(<EmployesPage />)
      expect(await screen.findByText('Test Employé')).toBeInTheDocument()
    })
  })

  describe('avec des employés saisis', () => {
    beforeEach(() => localStorage.setItem(STORAGE_KEY, JSON.stringify(FIXTURES)))

    it('affiche les employés, les initiales et le compteur', async () => {
      render(<EmployesPage />)
      expect(await screen.findByText('Employé Alpha')).toBeInTheDocument()
      expect(screen.getByText('EA')).toBeInTheDocument()
      expect(screen.getAllByText(/3 employés/i).length).toBeGreaterThan(0)
    })

    it('calcule la masse salariale et la fourchette', async () => {
      render(<EmployesPage />)
      await screen.findByText('Employé Alpha')
      expect(screen.getByText('Masse salariale').closest('div')?.parentElement).toHaveTextContent(/600\s*000/)
      expect(screen.getByText('Fourchette').closest('div')?.parentElement).toHaveTextContent('100k–300k')
    })

    it('filtre par recherche sur le nom ou le poste', async () => {
      render(<EmployesPage />)
      await screen.findByText('Employé Alpha')
      fireEvent.change(screen.getByPlaceholderText(/rechercher un employé/i), { target: { value: 'beta' } })
      expect(screen.getByText('Employé Beta')).toBeInTheDocument()
      expect(screen.queryByText('Employé Alpha')).not.toBeInTheDocument()
      fireEvent.change(screen.getByPlaceholderText(/rechercher un employé/i), { target: { value: 'poste trois' } })
      expect(screen.getByText('Employé Gamma')).toBeInTheDocument()
    })

    it('filtre par département', async () => {
      render(<EmployesPage />)
      await screen.findByText('Employé Alpha')
      fireEvent.click(screen.getByRole('button', { name: 'Logistique' }))
      expect(screen.getByText('Employé Beta')).toBeInTheDocument()
      expect(screen.queryByText('Employé Alpha')).not.toBeInTheDocument()
    })

    it("indique qu'aucun résultat ne correspond à la recherche", async () => {
      render(<EmployesPage />)
      await screen.findByText('Employé Alpha')
      fireEvent.change(screen.getByPlaceholderText(/rechercher un employé/i), { target: { value: 'xyzinexistant999' } })
      await waitFor(() => expect(screen.getByText(/ne correspond à la recherche/i)).toBeInTheDocument())
    })
  })
})
