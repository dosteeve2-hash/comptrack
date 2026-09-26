'use client'

// app/(dashboard)/apprendre/ApprendreCours.tsx
import { BookOpen, CheckCircle2, Lightbulb } from 'lucide-react'
import type { MiniCours } from './apprendre.data'

export function CourseReader({
  cours,
  etapeActuelle,
  etapesTerminees,
  onEtape,
  onNext,
  onPrev,
  onQuit,
}: {
  cours: MiniCours
  etapeActuelle: number
  etapesTerminees: Set<number>
  onEtape: (i: number) => void
  onNext: () => void
  onPrev: () => void
  onQuit: () => void
}) {
  return (
    <div className="rounded-2xl border overflow-hidden"
      style={{ background: 'var(--bg2)', borderColor: 'var(--border)' }}>
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b"
        style={{ borderColor: 'var(--border)', background: 'rgba(34,197,94,0.05)' }}>
        <div>
          <p className="text-xs font-mono mb-0.5" style={{ color: 'var(--green)' }}>MINI-COURS EN COURS</p>
          <h3 className="font-bold">{cours.titre}</h3>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs" style={{ color: 'var(--text2)' }}>
            {etapeActuelle + 1} / {cours.etapes.length}
          </span>
          <button onClick={onQuit}
            className="text-xs px-3 py-1.5 rounded-lg transition-all hover:opacity-70"
            style={{ border: '1px solid var(--border2)', color: 'var(--text2)' }}>
            Quitter
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1.5" style={{ background: 'var(--bg3)' }}>
        <div className="h-full transition-all duration-500"
          style={{ width: `${((etapeActuelle + 1) / cours.etapes.length) * 100}%`, background: 'var(--green)' }} />
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Step tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          {cours.etapes.map((etape, i) => (
            <button key={i} onClick={() => onEtape(i)}
              className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={{
                background: etapeActuelle === i ? 'rgba(34,197,94,0.15)' : etapesTerminees.has(i) ? 'rgba(34,197,94,0.08)' : 'var(--bg3)',
                border: etapeActuelle === i ? '1px solid rgba(34,197,94,0.4)' : '1px solid var(--border)',
                color: etapeActuelle === i || etapesTerminees.has(i) ? 'var(--green)' : 'var(--text2)',
              }}>
              {etapesTerminees.has(i) && <CheckCircle2 className="w-3 h-3" />}
              {i + 1}. {etape.titre}
            </button>
          ))}
        </div>

        {/* Step content */}
        <div className="p-5 rounded-xl mb-6" style={{ background: 'var(--bg3)', border: '1px solid var(--border)' }}>
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--amber)' }} />
            <h4 className="font-semibold text-sm">{cours.etapes[etapeActuelle].titre}</h4>
          </div>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text2)' }}>
            {cours.etapes[etapeActuelle].contenu}
          </p>
        </div>

        {/* Nav */}
        <div className="flex items-center justify-between">
          <button onClick={onPrev} disabled={etapeActuelle === 0}
            className="px-4 py-2 rounded-xl text-sm font-medium transition-all hover:opacity-70 disabled:opacity-30"
            style={{ border: '1px solid var(--border2)', color: 'var(--text2)' }}>
            ← Précédent
          </button>
          <button onClick={onNext}
            className="px-5 py-2 rounded-xl text-sm font-semibold transition-all hover:brightness-110"
            style={{ background: 'var(--green)', color: '#000' }}>
            {etapeActuelle < cours.etapes.length - 1 ? 'Suivant →' : '✓ Terminer le cours'}
          </button>
        </div>
      </div>
    </div>
  )
}

export function CourseCards({
  cours,
  etapesTerminees,
  onStart,
}: {
  cours: MiniCours[]
  etapesTerminees: Record<string, Set<number>>
  onStart: (id: string) => void
}) {
  return (
    <div>
      <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
        <BookOpen className="w-5 h-5" style={{ color: 'var(--blue)' }} />
        Mini-cours
      </h2>
      <div className="grid md:grid-cols-3 gap-4">
        {cours.map((c) => {
          const done = etapesTerminees[c.id]?.size ?? 0
          const pct  = Math.round((done / c.etapes.length) * 100)
          return (
            <div key={c.id}
              className="p-5 rounded-2xl border transition-all hover:-translate-y-0.5 cursor-pointer"
              style={{ background: 'var(--bg2)', borderColor: 'var(--border)' }}
              onClick={() => onStart(c.id)}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono px-2 py-0.5 rounded-full"
                  style={{ background: 'rgba(59,130,246,0.1)', color: 'var(--blue)' }}>
                  {c.module}
                </span>
                <span className="text-xs font-mono" style={{ color: 'var(--text2)' }}>{c.etapes.length} étapes</span>
              </div>
              <h3 className="font-semibold text-sm mb-3">{c.titre}</h3>
              <div className="h-1.5 rounded-full mb-1.5" style={{ background: 'var(--bg3)' }}>
                <div className="h-full rounded-full transition-all"
                  style={{ width: `${pct}%`, background: pct === 100 ? 'var(--green)' : 'var(--blue)' }} />
              </div>
              <div className="flex items-center justify-between text-xs" style={{ color: 'var(--text2)' }}>
                <span>{pct}% complété</span>
                <span style={{ color: pct === 100 ? 'var(--green)' : 'var(--blue)' }}>
                  {pct === 100 ? '✓ Terminé' : pct > 0 ? 'Continuer →' : 'Commencer →'}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
