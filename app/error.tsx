'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen bg-[#0d1117] flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="text-6xl">⚠️</div>
        <h2 className="text-2xl font-bold text-white">Une erreur s&apos;est produite</h2>
        <p className="text-white/60">{error.message}</p>
        <button
          onClick={reset}
          className="px-6 py-3 bg-[#22c55e] text-black font-semibold rounded-lg hover:bg-[#16a34a] transition"
        >
          Réessayer
        </button>
      </div>
    </div>
  )
}
