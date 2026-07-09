import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import FacturesClient from './FacturesClient'

export type Facture = {
  id: string
  numero: string
  client_nom: string
  client_email: string | null
  montant_ht: number
  tva_percent: number
  statut: 'brouillon' | 'envoyee' | 'payee' | 'en_retard' | 'annulee'
  date_emission: string
  date_echeance: string | null
  notes: string | null
}

const mockFactures: Facture[] = [
  {
    id: '1',
    numero: 'FAC-2026-001',
    client_nom: 'Coopérative Bagrépôle',
    client_email: 'contact@bagrepole.bf',
    montant_ht: 450000,
    tva_percent: 18,
    statut: 'payee',
    date_emission: '2026-06-01',
    date_echeance: '2026-06-30',
    notes: null,
  },
  {
    id: '2',
    numero: 'FAC-2026-002',
    client_nom: 'SOFITEX',
    client_email: 'info@sofitex.bf',
    montant_ht: 780000,
    tva_percent: 18,
    statut: 'envoyee',
    date_emission: '2026-06-15',
    date_echeance: '2026-07-15',
    notes: 'Relance envoyée',
  },
  {
    id: '3',
    numero: 'FAC-2026-003',
    client_nom: 'Union des producteurs de Dédougou',
    client_email: null,
    montant_ht: 320000,
    tva_percent: 18,
    statut: 'en_retard',
    date_emission: '2026-05-01',
    date_echeance: '2026-05-31',
    notes: null,
  },
  {
    id: '4',
    numero: 'FAC-2026-004',
    client_nom: 'Agro-industrie de Bobo',
    client_email: 'abi@gmail.com',
    montant_ht: 1200000,
    tva_percent: 18,
    statut: 'brouillon',
    date_emission: '2026-07-01',
    date_echeance: '2026-07-31',
    notes: 'Devis en attente',
  },
  {
    id: '5',
    numero: 'FAC-2026-005',
    client_nom: 'OCP Burkina',
    client_email: null,
    montant_ht: 95000,
    tva_percent: 18,
    statut: 'annulee',
    date_emission: '2026-04-10',
    date_echeance: null,
    notes: 'Commande annulée',
  },
]

export default async function FacturesPage() {
  const supabase = await createClient()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  // Redirect uniquement si Supabase est configuré et l'utilisateur n'est pas connecté
  if (!authError && !user) {
    redirect('/connexion')
  }

  let factures: Facture[] = mockFactures

  if (user) {
    const { data } = await supabase
      .from('factures')
      .select('*')
      .order('created_at', { ascending: false })

    if (data && data.length > 0) {
      factures = data as Facture[]
    }
  }

  return <FacturesClient factures={factures} />
}
