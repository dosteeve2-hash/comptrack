import { Suspense } from 'react'

import ConnexionFormulaire from './ConnexionFormulaire'

// Le formulaire lit ?suite= dans l'URL, donc useSearchParams(), qui impose une
// frontiere Suspense en Next 15 — sans elle `next build` refuse de prerendre la page.
export default function ConnexionPage() {
  return (
    <Suspense fallback={<div className="w-full max-w-md" />}>
      <ConnexionFormulaire />
    </Suspense>
  )
}
