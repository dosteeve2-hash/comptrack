'use client'

import { usePathname } from 'next/navigation'
import { Info } from 'lucide-react'

const EXAMPLE_ROUTES = [
  '/bilan', '/budget', '/contrats', '/declarations', '/depenses', '/employes', '/fournisseurs',
  '/objectifs', '/paie', '/previsions', '/revenus', '/tresorerie',
]

export default function ExampleDataBanner() {
  const pathname = usePathname()
  if (!EXAMPLE_ROUTES.some((route) => pathname.startsWith(route))) return null

  return (
    <div
      role="note"
      className="mb-4 flex items-start gap-2 rounded-xl px-4 py-3 text-xs"
      style={{ background: 'var(--bg3)', border: '1px solid var(--border2)', color: 'var(--text2)' }}
    >
      <Info size={14} className="mt-0.5 shrink-0" style={{ color: 'var(--gold)' }} />
      <span>
        <strong style={{ color: 'var(--text)' }}>Données d&apos;exemple.</strong>{' '}
        Les noms, montants et échéances affichés sur cette page sont fictifs et illustrent le module.
        Ils ne proviennent d&apos;aucune entreprise réelle.
      </span>
    </div>
  )
}
