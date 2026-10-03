'use client'

// app/(dashboard)/tresorerie/page.tsx
import { useState, useEffect, useMemo } from 'react'
import { Wallet, AlertTriangle, Settings2 } from 'lucide-react'
import { comptesBancaires, mouvementsRecents, previsionsEntrees, previsionsSorties, genererSoldeQuotidien, fmt } from './tresorerie.data'
import { ComptesBancairesRow, TresorerieAreaChart } from './TresorerieChart'
import { MouvementsTable, PrevisionnelSection } from './TresoreriePrevisionnel'

export default function TresoreriePage() {
  const [mounted, setMounted]         = useState(false)
  const [seuilAlerte, setSeuilAlerte] = useState(1_000_000)
  const [editSeuil, setEditSeuil]     = useState(false)
  const [seuilInput, setSeuilInput]   = useState('1000000')

  useEffect(() => { setMounted(true) }, [])

  // Générer une seule fois (côté client uniquement)
  const soldesQuotidiens = useMemo(() => (mounted ? genererSoldeQuotidien() : []), [mounted])

  const soldeTotal   = comptesBancaires.reduce((a, c) => a + c.solde, 0)
  const alerteActive = soldeTotal < seuilAlerte

  const handleSeuil = () => {
    const v = parseInt(seuilInput.replace(/\D/g, ''), 10)
    if (!isNaN(v) && v > 0) setSeuilAlerte(v)
    setEditSeuil(false)
  }

  return (
    <div className="space-y-6 animate-fade-in">

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Wallet className="w-5 h-5" style={{ color: 'var(--cyan)' }} />
            <h1 className="text-2xl font-bold">Trésorerie</h1>
          </div>
          <p className="text-sm" style={{ color: 'var(--text2)' }}>
            Suivi temps réel · 3 comptes bancaires · Juillet 2025
          </p>
        </div>
        <button onClick={() => setEditSeuil(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all hover:opacity-80"
          style={{ borderColor: 'var(--border2)', color: 'var(--text2)', background: 'var(--bg2)' }}>
          <Settings2 className="w-4 h-4" />
          Seuil d&apos;alerte : {fmt(seuilAlerte)}
        </button>
      </div>

      {/* Alerte solde bas */}
      {alerteActive && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-semibold"
          style={{ background: 'rgba(245,158,11,0.1)', borderColor: 'rgba(245,158,11,0.35)', color: 'var(--amber)' }}>
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          Attention : solde global ({fmt(soldeTotal)}) est en dessous du seuil d&apos;alerte ({fmt(seuilAlerte)})
        </div>
      )}

      {/* Modal seuil */}
      {editSeuil && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.7)' }}>
          <div className="w-full max-w-sm rounded-2xl p-6 space-y-4"
            style={{ background: 'var(--bg2)', border: '1px solid var(--border2)' }}>
            <h3 className="font-bold">Modifier le seuil d&apos;alerte</h3>
            <input type="number" value={seuilInput}
              onChange={(e) => setSeuilInput(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl text-sm outline-none font-mono"
              style={{ background: 'var(--bg3)', border: '1px solid var(--border2)', color: 'var(--text)' }} />
            <div className="flex gap-3">
              <button onClick={() => setEditSeuil(false)}
                className="flex-1 py-2 rounded-xl text-sm border"
                style={{ borderColor: 'var(--border2)', color: 'var(--text2)' }}>
                Annuler
              </button>
              <button onClick={handleSeuil}
                className="flex-1 py-2 rounded-xl text-sm font-semibold"
                style={{ background: 'var(--gold)', color: 'var(--navy)' }}>
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Comptes */}
      <ComptesBancairesRow soldeTotal={soldeTotal} comptes={comptesBancaires} />

      {/* Graphe 90 jours */}
      <TresorerieAreaChart mounted={mounted} data={soldesQuotidiens} />

      {/* Mouvements */}
      <MouvementsTable mouvements={mouvementsRecents} />

      {/* Prévisionnel */}
      <PrevisionnelSection
        entrees={previsionsEntrees}
        sorties={previsionsSorties}
        soldeTotal={soldeTotal}
      />
    </div>
  )
}
