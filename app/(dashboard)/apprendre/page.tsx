'use client'

// app/(dashboard)/apprendre/page.tsx
import { useState } from 'react'
import { Lightbulb, GraduationCap } from 'lucide-react'
import { concepts, miniCours, tips } from './apprendre.data'
import { CourseReader, CourseCards } from './ApprendreCours'
import { ApprendreGlossaire } from './ApprendreGlossaire'

export default function ApprendrePage() {
  const [conceptOuvert, setConceptOuvert]     = useState<string | null>(null)
  const [coursActif, setCoursActif]           = useState<string | null>(null)
  const [etapeActuelle, setEtapeActuelle]     = useState(0)
  const [etapesTerminees, setEtapesTerminees] = useState<Record<string, Set<number>>>({})

  const marquerEtape = (id: string, idx: number) => {
    setEtapesTerminees((prev) => {
      const s = new Set(prev[id] ?? [])
      s.add(idx)
      return { ...prev, [id]: s }
    })
  }

  const handleNext = () => {
    const cours = miniCours.find((c) => c.id === coursActif)
    if (!cours || !coursActif) return
    marquerEtape(coursActif, etapeActuelle)
    if (etapeActuelle < cours.etapes.length - 1) setEtapeActuelle((p) => p + 1)
    else setCoursActif(null)
  }

  const cours = miniCours.find((c) => c.id === coursActif)

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Apprendre la comptabilité</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text2)' }}>
            Concepts clés, tips pratiques et mini-cours guidés
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium"
          style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)', color: 'var(--green)' }}>
          <GraduationCap className="w-4 h-4" />
          Module d&apos;auto-formation
        </div>
      </div>

      {/* Mini-cours actif */}
      {coursActif && cours ? (
        <CourseReader
          cours={cours}
          etapeActuelle={etapeActuelle}
          etapesTerminees={etapesTerminees[coursActif] ?? new Set()}
          onEtape={setEtapeActuelle}
          onNext={handleNext}
          onPrev={() => setEtapeActuelle((p) => Math.max(0, p - 1))}
          onQuit={() => setCoursActif(null)}
        />
      ) : (
        <CourseCards
          cours={miniCours}
          etapesTerminees={etapesTerminees}
          onStart={(id) => { setCoursActif(id); setEtapeActuelle(0) }}
        />
      )}

      {/* Astuces pratiques */}
      <div>
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Lightbulb className="w-5 h-5" style={{ color: 'var(--amber)' }} />
          Astuces pratiques
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          {tips.map((t) => (
            <div key={t.module} className="p-5 rounded-2xl border"
              style={{ background: 'var(--bg2)', borderColor: 'var(--border)' }}>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: `${t.couleur}18` }}>
                  <t.icon className="w-4 h-4" style={{ color: t.couleur }} />
                </div>
                <h3 className="font-semibold text-sm">{t.module}</h3>
              </div>
              <ul className="space-y-3">
                {t.astuces.map((astuce, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full flex-shrink-0 mt-0.5 flex items-center justify-center text-xs font-bold"
                      style={{ background: `${t.couleur}20`, color: t.couleur }}>
                      {i + 1}
                    </span>
                    <p className="text-xs leading-relaxed" style={{ color: 'var(--text2)' }}>{astuce}</p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Glossaire */}
      <ApprendreGlossaire
        concepts={concepts}
        conceptOuvert={conceptOuvert}
        onToggle={(terme) => setConceptOuvert((p) => (p === terme ? null : terme))}
      />
    </div>
  )
}
