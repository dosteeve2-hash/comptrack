import { createClient } from '@/lib/supabase/server'
import FournisseursClient from './FournisseursClient'
import type { FournisseurRow } from './FournisseursClient'

export default async function FournisseursPage() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('fournisseurs')
    .select('id, nom, email, telephone, adresse, ville, pays, categorie, created_at')
    .order('created_at', { ascending: false })

  if (error) {
    // Log but don't crash — show empty state instead
    console.error('[FournisseursPage] Supabase error:', error.message)
  }

  const fournisseurs: FournisseurRow[] = data ?? []

  return <FournisseursClient initialFournisseurs={fournisseurs} />
}
