'use client'

// app/(dashboard)/rapports/page.tsx
import { useState } from 'react'
import type { LucideIcon } from 'lucide-react'
import { Download, Scale, TrendingUp, BookOpen } from 'lucide-react'
import type { VueRapport } from './rapports.data'
import { RapportsBilan }   from './RapportsBilan'
import { RapportsResultat } from './RapportsResultat'
import { RapportsApercu }  from './RapportsApercu'

const TABS: Array<{ id: VueRapport; label: string; icon: LucideIcon }> = [
  { id: 'apercu',   label: 'Aperçu',              icon: TrendingUp },
  { id: 'bilan',    label: 'Bilan',               icon: Scale      },
  { id: 'resultat', label: 'Compte de résultat',  icon: BookOpen   },
]

export default function RapportsPage() {
  const [vueRapport, setVueRapport] = useState<VueRapport>('apercu')

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Rapports</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text2)' }}>
            Analyse de votre performance financière
          </p>
        </div>
        <button onClick={() => window.print()}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium hover:opacity-80 no-print"
          style={{ border: '1px solid var(--border2)', color: 'var(--text2)' }}>
          <Download className="w-4 h-4" /> Exporter
        </button>
      </div>

      {/* Onglets */}
      <div className="flex gap-1 p-1 rounded-xl w-fit" style={{ background: 'var(--bg2)', border: '1px solid var(--border)' }}>
        {TABS.map((tab) => (
          <button key={tab.id} onClick={() => setVueRapport(tab.id)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all"
            style={{
              background: vueRapport === tab.id ? 'var(--bg3)' : 'transparent',
              color:      vueRapport === tab.id ? 'var(--text)' : 'var(--text2)',
              border:     vueRapport === tab.id ? '1px solid var(--border2)' : '1px solid transparent',
            }}>
            <tab.icon className="w-3.5 h-3.5" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Vues */}
      {vueRapport === 'bilan'    && <RapportsBilan />}
      {vueRapport === 'resultat' && <RapportsResultat />}
      {vueRapport === 'apercu'   && <RapportsApercu />}
    </div>
  )
}
