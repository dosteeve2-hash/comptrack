'use client'

// app/(dashboard)/bilan/page.tsx
import { useState } from 'react'
import { CheckCircle, AlertCircle, FileText, ArrowLeftRight } from 'lucide-react'
import { actifN, passifN, somme, fmt } from './bilan.data'
import { BilanSectionCard } from './BilanSectionCard'

export default function BilanPage() {
  const [exercice, setExercice] = useState<'N' | 'N1'>('N')

  const totalActif  = somme(actifN,  exercice)
  const totalPassif = somme(passifN, exercice)
  const equilibre   = Math.abs(totalActif - totalPassif) < 1

  return (
    <div className="space-y-6 animate-fade-in">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(212,175,55,0.15)', border: '1px solid rgba(212,175,55,0.3)' }}>
            <FileText className="w-5 h-5" style={{ color: '#D4AF37' }} />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Bilan comptable</h1>
            <p className="text-sm mt-0.5" style={{ color: 'var(--text2)' }}>
              Situation patrimoniale — Exercice {exercice === 'N' ? 'en cours' : 'précédent'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Switch N / N-1 */}
          <div className="flex rounded-xl overflow-hidden border" style={{ borderColor: 'var(--border)' }}>
            {(['N', 'N1'] as const).map((ex) => (
              <button
                key={ex}
                onClick={() => setExercice(ex)}
                className="px-4 py-2 text-sm font-medium transition-colors"
                style={{
                  background: exercice === ex ? '#D4AF37' : 'var(--bg2)',
                  color:      exercice === ex ? '#0A1628'  : 'var(--text2)',
                }}>
                {ex === 'N' ? 'Exercice N' : 'Exercice N-1'}
              </button>
            ))}
          </div>

          {/* Badge équilibre */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium"
            style={{
              background: equilibre ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
              border:     `1px solid ${equilibre ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`,
              color:      equilibre ? '#22c55e' : '#ef4444',
            }}>
            {equilibre
              ? <><CheckCircle className="w-4 h-4" /> Bilan équilibré</>
              : <><AlertCircle className="w-4 h-4" /> Déséquilibre détecté</>}
          </div>

          {/* Bouton PDF (placeholder) */}
          <button
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all hover:opacity-80"
            style={{ background: 'var(--bg2)', border: '1px solid var(--border)', color: 'var(--text2)' }}>
            <ArrowLeftRight className="w-4 h-4" /> Exporter PDF
          </button>
        </div>
      </div>

      {/* Totaux rapides */}
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-2xl border p-5 flex flex-col gap-1"
          style={{ background: 'var(--bg2)', borderColor: 'var(--border)' }}>
          <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--text3)' }}>
            Total Actif
          </span>
          <span className="text-2xl font-bold tabular-nums" style={{ color: '#00BCD4' }}>
            {fmt(totalActif)}
          </span>
        </div>
        <div className="rounded-2xl border p-5 flex flex-col gap-1"
          style={{ background: 'var(--bg2)', borderColor: 'var(--border)' }}>
          <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--text3)' }}>
            Total Passif
          </span>
          <span className="text-2xl font-bold tabular-nums" style={{ color: '#D4AF37' }}>
            {fmt(totalPassif)}
          </span>
        </div>
      </div>

      {/* Corps : Actif | Passif */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Actif */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold px-1">Actif</h2>
          {actifN.map((section) => (
            <BilanSectionCard key={section.titre} section={section} exercice={exercice} />
          ))}
        </div>

        {/* Passif */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold px-1">Passif</h2>
          {passifN.map((section) => (
            <BilanSectionCard key={section.titre} section={section} exercice={exercice} />
          ))}
        </div>
      </div>

      {/* Note de bas de page */}
      <p className="text-xs text-center pb-2" style={{ color: 'var(--text3)' }}>
        Données illustratives — Mettez à jour les montants dans{' '}
        <code className="font-mono">bilan.data.ts</code> après validation comptable.
      </p>
    </div>
  )
}
