import { Suspense } from 'react'
import MonthlySummary from '@/components/MonthlySummary'
import RevenueChart from '@/components/RevenueChart'
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

function RevenueChartSkeleton() {
  return (
    <div
      className="h-60 rounded-xl animate-pulse"
      style={{ background: 'var(--bg3)' }}
    />
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
      revenueChart={
        <Suspense fallback={<RevenueChartSkeleton />}>
          <RevenueChart />
        </Suspense>
      }
    />
  )
}
