import { TrendingUp, TrendingDown } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { formatMontant } from '@/lib/utils'

export default async function MonthlySummary() {
  const now = new Date()
  const debutMois = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()

  let recettes = 0
  let depenses = 0

  try {
    const supabase = await createClient()

    const { data: recettesData } = await supabase
      .from('transactions')
      .select('montant')
      .eq('type', 'recette')
      .gte('date', debutMois)

    const { data: depensesData } = await supabase
      .from('transactions')
      .select('montant')
      .eq('type', 'depense')
      .gte('date', debutMois)

    recettes = recettesData?.reduce((sum, t) => sum + (t.montant as number ?? 0), 0) ?? 0
    depenses = depensesData?.reduce((sum, t) => sum + (t.montant as number ?? 0), 0) ?? 0
  } catch {
    // Table inexistante ou connexion impossible — affichage à zéro
  }

  const solde = recettes - depenses
  const mois = now.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
  const soldePosatif = solde >= 0

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {/* Revenus */}
      <div
        className="p-5 rounded-2xl border transition-all hover:-translate-y-0.5"
        style={{ background: 'var(--bg2)', borderColor: 'var(--border)' }}
      >
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-medium" style={{ color: 'var(--text2)' }}>
            Revenus {mois}
          </p>
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'rgba(34,197,94,0.15)' }}
          >
            <TrendingUp className="w-4 h-4" style={{ color: '#22c55e' }} />
          </div>
        </div>
        <p className="text-xl font-bold font-mono" style={{ color: '#22c55e' }}>
          {formatMontant(recettes)}
        </p>
        <p className="text-xs mt-1" style={{ color: 'var(--text3)' }}>Données temps réel</p>
      </div>

      {/* Dépenses */}
      <div
        className="p-5 rounded-2xl border transition-all hover:-translate-y-0.5"
        style={{ background: 'var(--bg2)', borderColor: 'var(--border)' }}
      >
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-medium" style={{ color: 'var(--text2)' }}>
            Dépenses {mois}
          </p>
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'rgba(239,68,68,0.15)' }}
          >
            <TrendingDown className="w-4 h-4" style={{ color: '#ef4444' }} />
          </div>
        </div>
        <p className="text-xl font-bold font-mono" style={{ color: '#ef4444' }}>
          {formatMontant(depenses)}
        </p>
        <p className="text-xs mt-1" style={{ color: 'var(--text3)' }}>Données temps réel</p>
      </div>

      {/* Solde net */}
      <div
        className="p-5 rounded-2xl border transition-all hover:-translate-y-0.5"
        style={{ background: 'var(--bg2)', borderColor: 'var(--border)' }}
      >
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-medium" style={{ color: 'var(--text2)' }}>
            Solde net {mois}
          </p>
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: soldePosatif ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)' }}
          >
            {soldePosatif
              ? <TrendingUp className="w-4 h-4" style={{ color: '#22c55e' }} />
              : <TrendingDown className="w-4 h-4" style={{ color: '#ef4444' }} />
            }
          </div>
        </div>
        <p
          className="text-xl font-bold font-mono"
          style={{ color: soldePosatif ? '#22c55e' : '#ef4444' }}
        >
          {formatMontant(solde)}
        </p>
        <p className="text-xs mt-1" style={{ color: 'var(--text3)' }}>Données temps réel</p>
      </div>
    </div>
  )
}
