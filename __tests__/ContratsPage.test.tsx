import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, within, waitFor } from '@testing-library/react'
import ContratsPage from '@/app/(dashboard)/contrats/page'

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

const STORAGE_KEY = 'comptrack_contrats'

interface Fixture {
  id: number; titre: string; partie: string; type: 'Client' | 'Fournisseur' | 'Partenaire'
  montant: number; dateDebut: string; dateFin: string
  statut: 'Actif' | 'Expiré' | 'En cours de renouvellement' | 'Suspendu'
}

// Données de test uniquement : l'application, elle, ne contient aucun contrat par défaut.
const FIXTURES: Fixture[] = [
  { id: 1, titre: 'Contrat test A', partie: 'Partie Alpha', type: 'Client', montant: 1000, dateDebut: '2020-01-01', dateFin: '2099-12-31', statut: 'Actif' },
  { id: 2, titre: 'Contrat test B', partie: 'Partie Beta', type: 'Fournisseur', montant: 2000, dateDebut: '2020-01-01', dateFin: '2020-06-30', statut: 'Expiré' },
  { id: 3, titre: 'Contrat test C', partie: 'Partie Gamma', type: 'Partenaire', montant: 3000, dateDebut: '2020-01-01', dateFin: '2099-12-31', statut: 'En cours de renouvellement' },
]

function seed(list: Fixture[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
}

describe('ContratsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  describe('sans aucune donnée', () => {
    it('affiche le titre et le sous-titre', () => {
      render(<ContratsPage />)
      expect(screen.getByRole('heading', { name: /contrats/i })).toBeInTheDocument()
      expect(screen.getByText(/suivi des contrats/i)).toBeInTheDocument()
    })

    it('affiche un état vide honnête avec une action', () => {
      render(<ContratsPage />)
      expect(screen.getByText(/aucun contrat enregistré pour le moment/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /ajouter un contrat/i })).toBeInTheDocument()
    })

    it("n'affiche aucun contrat ni aucune société inventés", () => {
      render(<ContratsPage />)
      for (const faux of ['Saf-Cacao BF', 'Sonabel SA', 'ONATEL SA', 'Brakina SA', 'Contrat cadre distribution']) {
        expect(screen.queryByText(faux)).not.toBeInTheDocument()
      }
    })

    it('affiche les quatre indicateurs à zéro', () => {
      render(<ContratsPage />)
      for (const label of ['Valeur contrats actifs', 'Contrats actifs', 'À renouveler', 'Expirés']) {
        expect(screen.getByText(label)).toBeInTheDocument()
      }
      expect(screen.getAllByText('0').length).toBe(3)
    })

    it('affiche les colonnes du tableau', () => {
      render(<ContratsPage />)
      for (const h of ['Contrat', 'Partie', 'Type', 'Montant', 'Période', 'Jours restants', 'Statut']) {
        expect(screen.getByText(h)).toBeInTheDocument()
      }
    })
  })

  describe('ajout', () => {
    it('ouvre puis ferme le formulaire', () => {
      render(<ContratsPage />)
      expect(screen.queryByText('Titre du contrat *')).not.toBeInTheDocument()
      fireEvent.click(screen.getByRole('button', { name: /nouveau contrat/i }))
      expect(screen.getByText('Titre du contrat *')).toBeInTheDocument()
      fireEvent.click(screen.getByRole('button', { name: /annuler/i }))
      expect(screen.queryByText('Titre du contrat *')).not.toBeInTheDocument()
    })

    it('refuse un formulaire incomplet', () => {
      render(<ContratsPage />)
      fireEvent.click(screen.getByRole('button', { name: /nouveau contrat/i }))
      fireEvent.click(screen.getByRole('button', { name: /créer le contrat/i }))
      expect(screen.getByText('Titre du contrat *')).toBeInTheDocument()
      expect(localStorage.getItem(STORAGE_KEY)).toBeNull()
    })

    it("enregistre le contrat, l'affiche et le garde après rechargement", async () => {
      const { unmount } = render(<ContratsPage />)
      fireEvent.click(screen.getByRole('button', { name: /nouveau contrat/i }))
      fireEvent.change(screen.getByPlaceholderText(/intitulé du contrat/i), { target: { value: 'Mon contrat' } })
      fireEvent.change(screen.getByPlaceholderText(/nom entreprise/i), { target: { value: 'Ma partie' } })
      fireEvent.change(screen.getByPlaceholderText(/montant en fcfa/i), { target: { value: '999000' } })
      fireEvent.click(screen.getByRole('button', { name: /créer le contrat/i }))

      expect(screen.getByText('Mon contrat')).toBeInTheDocument()
      expect(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')).toHaveLength(1)

      unmount()
      render(<ContratsPage />)
      expect(await screen.findByText('Mon contrat')).toBeInTheDocument()
    })
  })

  describe('avec des contrats saisis', () => {
    beforeEach(() => seed(FIXTURES))

    it('affiche les contrats et le compteur', async () => {
      render(<ContratsPage />)
      expect(await screen.findByText('Contrat test A')).toBeInTheDocument()
      expect(screen.getByText('Partie Beta')).toBeInTheDocument()
      expect(screen.getByText('3/3')).toBeInTheDocument()
    })

    it('calcule les indicateurs à partir des données', async () => {
      render(<ContratsPage />)
      await screen.findByText('Contrat test A')
      expect(screen.getByText('Contrats actifs').closest('div')?.parentElement).toHaveTextContent('1')
      expect(screen.getByText('Expirés').closest('div')?.parentElement).toHaveTextContent('1')
    })

    it('affiche les badges de statut', async () => {
      render(<ContratsPage />)
      await screen.findByText('Contrat test A')
      const table = within(screen.getByRole('table'))
      expect(table.getByText('Actif')).toBeInTheDocument()
      expect(table.getByText('Expiré')).toBeInTheDocument()
      expect(table.getByText('En cours de renouvellement')).toBeInTheDocument()
    })

    it('affiche les jours dépassés pour un contrat échu', async () => {
      render(<ContratsPage />)
      await screen.findByText('Contrat test A')
      expect(within(screen.getByRole('table')).getAllByText(/j dépassés/i).length).toBe(1)
    })

    it('filtre par recherche', async () => {
      render(<ContratsPage />)
      await screen.findByText('Contrat test A')
      fireEvent.change(screen.getByPlaceholderText(/rechercher titre ou partie/i), { target: { value: 'gamma' } })
      expect(screen.getByText('Contrat test C')).toBeInTheDocument()
      expect(screen.queryByText('Contrat test A')).not.toBeInTheDocument()
    })

    it('filtre par type', async () => {
      render(<ContratsPage />)
      await screen.findByText('Contrat test A')
      fireEvent.click(screen.getByRole('button', { name: /^fournisseur$/i }))
      expect(screen.getByText('Contrat test B')).toBeInTheDocument()
      expect(screen.queryByText('Contrat test A')).not.toBeInTheDocument()
    })

    it("indique qu'aucun résultat ne correspond à la recherche", async () => {
      render(<ContratsPage />)
      await screen.findByText('Contrat test A')
      fireEvent.change(screen.getByPlaceholderText(/rechercher titre ou partie/i), { target: { value: 'xyzinexistant999' } })
      await waitFor(() => expect(screen.getByText(/ne correspond à la recherche/i)).toBeInTheDocument())
    })
  })
})
