import { createClient } from '@/lib/supabase/server'
import ClientsClient from './ClientsClient'
import type { ClientRow } from './ClientsClient'

export default async function ClientsPage() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('clients')
    .select('id, nom, email, telephone, adresse, ville, pays, created_at')
    .order('created_at', { ascending: false })

  if (error) {
    // Log but don't crash — show empty state instead
    console.error('[ClientsPage] Supabase error:', error.message)
  }

  const clients: ClientRow[] = data ?? []

  return <ClientsClient initialClients={clients} />
}
