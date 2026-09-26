'use client'
import { useEffect, useState, useCallback } from 'react'
import Image from 'next/image'
import { Star, ChevronLeft, ChevronRight } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { ScrollReveal } from '../ui/ScrollReveal'

const TESTIMONIALS = [
  {
    quote: "Avant CompTrack, je gérais mes 200+ transactions dans un cahier. Maintenant mes rapports OHADA sont prêts en 1 clic. C'est révolutionnaire pour mon cabinet.",
    name: 'Fatoumata Koné',
    role: 'Expert-comptable',
    city: "Abidjan, Côte d'Ivoire",
    photo: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=100&h=100&fit=crop&q=80',
    stars: 5,
  },
  {
    quote: "Grâce à CompTrack, j'ai enfin une vision claire de ma trésorerie. J'ai économisé 15 000 FCFA par mois en identifiant des dépenses inutiles. Le ROI est immédiat.",
    name: 'Moussa Traoré',
    role: 'Gérant, Traoré BTP',
    city: 'Ouagadougou, Burkina Faso',
    photo: 'https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=100&h=100&fit=crop&q=80',
    stars: 5,
  },
  {
    quote: 'La fonctionnalité de facturation en FCFA est parfaite. Mes clients reçoivent des factures professionnelles et les retards de paiement ont diminué de 60%.',
    name: 'Aminata Diallo',
    role: 'Fashion Dakar',
    city: 'Dakar, Sénégal',
    photo: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=100&h=100&fit=crop&q=80',
    stars: 5,
  },
]

const variants = {
  enter:  (d: number) => ({ opacity: 0, x: d > 0 ? 80 : -80 }),
  center: { opacity: 1, x: 0 },
  exit:   (d: number) => ({ opacity: 0, x: d > 0 ? -80 : 80 }),
}

export function TestimonialsSection() {
  const [idx, setIdx] = useState(0)
  const [paused, setPaused] = useState(false)
  const [dir, setDir] = useState(1)

  const next = useCallback(() => { setDir(1);  setIdx(i => (i + 1) % TESTIMONIALS.length) }, [])
  const prev = useCallback(() => { setDir(-1); setIdx(i => (i - 1 + TESTIMONIALS.length) % TESTIMONIALS.length) }, [])

  useEffect(() => {
    if (paused) return
    const id = setInterval(next, 4500)
    return () => clearInterval(id)
  }, [paused, next])

  const t = TESTIMONIALS[idx]

  return (
    <section id="temoignages" className="py-24 px-6" style={{ background: 'var(--bg2)' }}>
      <div className="max-w-4xl mx-auto">
        <ScrollReveal direction="up" className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ce que disent nos clients</h2>
          <p className="text-lg" style={{ color: 'var(--text2)' }}>500+ PME africaines font confiance à CompTrack</p>
        </ScrollReveal>

        <div
          className="relative rounded-2xl p-8 md:p-12 overflow-hidden"
          style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <AnimatePresence custom={dir} mode="wait">
            <motion.div key={idx} custom={dir} variants={variants}
              initial="enter" animate="center" exit="exit"
              transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}>
              <div className="flex gap-1 mb-6">
                {Array.from({ length: t.stars }).map((_, j) => (
                  <Star key={j} className="w-5 h-5 fill-current" style={{ color: 'var(--gold)' }} />
                ))}
              </div>
              <blockquote className="text-xl md:text-2xl font-medium leading-relaxed mb-8 italic"
                style={{ color: 'var(--text)' }}>
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <div className="flex items-center gap-4">
                <Image src={t.photo} alt={t.name} width={56} height={56}
                  className="rounded-full object-cover flex-shrink-0"
                  style={{ border: '2px solid var(--gold)' }} />
                <div>
                  <p className="font-semibold">{t.name}</p>
                  <p className="text-sm" style={{ color: 'var(--text2)' }}>{t.role} · {t.city}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Controls */}
          <div className="flex items-center gap-4 mt-8">
            <button onClick={prev}
              aria-label="Témoignage précédent"
              className="w-10 h-10 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity"
              style={{ background: 'var(--bg3)', border: '1px solid var(--border2)' }}>
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex gap-2 items-center">
              {TESTIMONIALS.map((_, i) => (
                <button key={i}
                  onClick={() => { setDir(i > idx ? 1 : -1); setIdx(i) }}
                  aria-label={`Aller au témoignage ${i + 1}`}
                  aria-current={i === idx ? 'true' : undefined}
                  className="rounded-full transition-all duration-300"
                  style={{ width: i === idx ? '24px' : '8px', height: '8px',
                    background: i === idx ? 'var(--gold)' : 'var(--border2)' }} />
              ))}
            </div>
            <button onClick={next}
              aria-label="Témoignage suivant"
              className="w-10 h-10 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity"
              style={{ background: 'var(--bg3)', border: '1px solid var(--border2)' }}>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
