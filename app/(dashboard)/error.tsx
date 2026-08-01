'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function DashboardError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('[CompTrack] Dashboard error:', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 px-4">
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center"
        style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)' }}
      >
        <AlertTriangle className="w-8 h-8" style={{ color: '#ef4444' }} />
      </div>

      <div className="text-center max-w-md">
        <h2 className="text-xl font-bold mb-2" style={{ color: '#F0F4FF' }}>
          Une erreur est survenue
        </h2>
        <p className="text-sm leading-relaxed" style={{ color: '#A8B8D8' }}>
          {error.message || 'Impossible de charger cette section. Veuillez réessayer.'}
        </p>
        {error.digest && (
          <p className="text-xs mt-2 font-mono" style={{ color: '#5A7099' }}>
            Code : {error.digest}
          </p>
        )}
      </div>

      <button
        onClick={reset}
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold"
        style={{ background: '#D4AF37', color: '#0A1628' }}
      >
        <RefreshCw className="w-4 h-4" />
        Réessayer
      </button>
    </div>
  );
}
