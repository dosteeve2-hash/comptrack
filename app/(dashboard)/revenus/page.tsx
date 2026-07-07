import { createClient } from '@/lib/supabase/server'
import RevenusClient from './RevenusClient'
import type { RevenuRow } from './RevenusClient'

export default async function RevenusPage() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('revenus')
    .select('id, libelle, montant, categorie, date_revenu, notes, created_at')
    .order('date_revenu', { ascending: false })

  if (error) {
    // Log but don't crash — show empty state instead
    console.error('[RevenusPage] Supabase error:', error.message)
  }

  const revenus: RevenuRow[] = data ?? []

  return <RevenusClient initialRevenus={revenus} />
}
