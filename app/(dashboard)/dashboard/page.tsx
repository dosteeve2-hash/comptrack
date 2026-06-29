import { Suspense } from 'react'
import MonthlySummary from '@/components/MonthlySummary'
import DashboardClient from './DashboardClient'

// Fallback skeleton pendant le fetch Supabase
function MonthlySummarySkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="p-5 rounded-2xl border animate-pulse"
          style={{ background: 'var(--bg2)', borderColor: 'var(--border)', height: 100 }}
        />
      ))}
    </div>
  )
}

export default function DashboardPage() {
  return (
    <DashboardClient
      monthlySummary={
        <Suspense fallback={<MonthlySummarySkeleton />}>
          <MonthlySummary />
        </Suspense>
      }
    />
  )
}
