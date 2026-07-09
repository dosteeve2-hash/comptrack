import { createClient } from '@/lib/supabase/server'
import ObjectifsClient from './ObjectifsClient'

export default async function ObjectifsPage() {
  let objectifs: Record<string, unknown>[] = []
  let revenus: { montant: number; date: string }[] = []
  let depenses: { montant: number; date: string }[] = []
  let user = null

  try {
    const supabase = await createClient()
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser()
    user = authUser

    if (user) {
      const [obj, rev, dep] = await Promise.all([
        supabase
          .from('objectifs')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false }),
        supabase
          .from('revenus')
          .select('montant, date')
          .eq('user_id', user.id),
        supabase
          .from('depenses')
          .select('montant, date')
          .eq('user_id', user.id),
      ])
      objectifs = obj.data ?? []
      revenus = (rev.data ?? []) as { montant: number; date: string }[]
      depenses = (dep.data ?? []) as { montant: number; date: string }[]
    }
  } catch {
    // Supabase non configuré — affichage de l'état vide
  }

  return (
    <ObjectifsClient
      objectifs={objectifs}
      revenus={revenus}
      depenses={depenses}
      user={user}
    />
  )
}
