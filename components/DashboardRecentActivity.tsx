import { createClient } from '@/lib/supabase/server'
import { ArrowUpRight, ArrowDownRight } from 'lucide-react'

interface BaseRow {
  id: string | number
  libelle: string
  montant: number
  created_at: string
}

interface ActivityItem extends BaseRow {
  type: 'revenu' | 'depense'
}

export default async function DashboardRecentActivity() {
  let activities: ActivityItem[] = []

  try {
    const supabase = await createClient()

    const [{ data: dernRevenus }, { data: dernDepenses }] = await Promise.all([
      supabase
        .from('revenus')
        .select('id, libelle, montant, created_at')
        .order('created_at', { ascending: false })
        .limit(3),
      supabase
        .from('depenses')
        .select('id, libelle, montant, created_at')
        .order('created_at', { ascending: false })
        .limit(3),
    ])

    const rev: ActivityItem[] = ((dernRevenus as BaseRow[] | null) ?? []).map(r => ({
      ...r,
      type: 'revenu' as const,
    }))
    const dep: ActivityItem[] = ((dernDepenses as BaseRow[] | null) ?? []).map(d => ({
      ...d,
      type: 'depense' as const,
    }))

    activities = [...rev, ...dep]
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 5)
  } catch {
    // Supabase unavailable — liste vide
  }

  if (activities.length === 0) {
    return (
      <div className="py-10 text-center text-sm" style={{ color: 'var(--text3)' }}>
        Aucune activité récente
      </div>
    )
  }

  return (
    <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
      {activities.map((item) => {
        const isRevenu = item.type === 'revenu'
        const date = new Date(item.created_at).toLocaleDateString('fr-FR', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        })
        const montantFmt = new Intl.NumberFormat('fr-FR').format(Number(item.montant))

        return (
          <div
            key={`${item.type}-${item.id}`}
            className="flex items-center gap-4 px-6 py-4 hover:bg-white/[0.02] transition-colors"
          >
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: isRevenu ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)' }}
            >
              {isRevenu ? (
                <ArrowUpRight className="w-4 h-4" style={{ color: '#22c55e' }} />
              ) : (
                <ArrowDownRight className="w-4 h-4" style={{ color: '#ef4444' }} />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{item.libelle}</p>
              <p className="text-xs truncate" style={{ color: 'var(--text2)' }}>
                {isRevenu ? 'Revenu' : 'Dépense'} · {date}
              </p>
            </div>
            <p
              className="text-sm font-bold font-mono flex-shrink-0"
              style={{ color: isRevenu ? '#22c55e' : '#ef4444' }}
            >
              {isRevenu ? '+' : '-'}{montantFmt} FCFA
            </p>
          </div>
        )
      })}
    </div>
  )
}
