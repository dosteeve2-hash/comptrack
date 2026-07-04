import { createClient } from '@/lib/supabase/server'
import DepensesClient from './DepensesClient'
import type { DepenseRow } from './DepensesClient'

export default async function DepensesPage() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('depenses')
    .select('id, libelle, montant, categorie, date_depense, notes, created_at')
    .order('date_depense', { ascending: false })

  if (error) {
    // Log but don't crash — show empty state instead
    console.error('[DepensesPage] Supabase error:', error.message)
  }

  const depenses: DepenseRow[] = data ?? []

  return <DepensesClient initialDepenses={depenses} />
}
