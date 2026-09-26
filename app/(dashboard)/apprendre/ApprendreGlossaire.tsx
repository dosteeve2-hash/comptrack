'use client'

// app/(dashboard)/apprendre/ApprendreGlossaire.tsx
import { Scale, ChevronDown, ChevronUp } from 'lucide-react'
import type { Concept } from './apprendre.data'

export function ApprendreGlossaire({
  concepts,
  conceptOuvert,
  onToggle,
}: {
  concepts: Concept[]
  conceptOuvert: string | null
  onToggle: (terme: string) => void
}) {
  return (
    <div>
      <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
        <Scale className="w-5 h-5" style={{ color: 'var(--green)' }} />
        Glossaire comptable
        <span className="text-sm font-normal" style={{ color: 'var(--text2)' }}>
          ({concepts.length} termes) · Cliquez pour l&apos;exemple
        </span>
      </h2>
      <div className="rounded-2xl border overflow-hidden" style={{ background: 'var(--bg2)', borderColor: 'var(--border)' }}>
        {concepts.map((concept, i) => (
          <div key={concept.terme} className="border-b last:border-b-0" style={{ borderColor: 'var(--border)' }}>
            <button
              onClick={() => onToggle(concept.terme)}
              className="w-full flex items-center justify-between px-6 py-4 hover:bg-white/[0.02] transition-colors text-left">
              <div className="flex items-start gap-3 flex-1">
                <span className="text-xs font-mono px-2 py-0.5 rounded-full flex-shrink-0 mt-0.5"
                  style={{ background: 'rgba(34,197,94,0.1)', color: 'var(--green)' }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm">{concept.terme}</p>
                  <p className="text-xs mt-0.5 line-clamp-1" style={{ color: 'var(--text2)' }}>{concept.definition}</p>
                </div>
              </div>
              {conceptOuvert === concept.terme
                ? <ChevronUp className="w-4 h-4 flex-shrink-0 ml-4" style={{ color: 'var(--text2)' }} />
                : <ChevronDown className="w-4 h-4 flex-shrink-0 ml-4" style={{ color: 'var(--text2)' }} />}
            </button>
            {conceptOuvert === concept.terme && (
              <div className="px-6 pb-5">
                <div className="p-4 rounded-xl space-y-3" style={{ background: 'var(--bg3)', border: '1px solid var(--border)' }}>
                  <div>
                    <p className="text-xs font-semibold mb-1 uppercase tracking-wider" style={{ color: 'var(--text2)' }}>Définition</p>
                    <p className="text-sm leading-relaxed">{concept.definition}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold mb-1 uppercase tracking-wider" style={{ color: 'var(--amber)' }}>💡 Exemple concret</p>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--text2)' }}>{concept.exemple}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
