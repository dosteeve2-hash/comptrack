import { Suspense } from 'react'
import MonthlySummary from '@/components/MonthlySummary'
import RevenueChart from '@/components/RevenueChart'
import DashboardKPIs from '@/components/DashboardKPIs'
import DashboardRecentActivity from '@/components/DashboardRecentActivity'
import { RevenusDepensesChart } from './components/RevenusDepensesChart'
import DashboardClient from './DashboardClient'

// ─── Skeletons ────────────────────────────────────────────────────────────────

function KPISkeleton() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className="p-5 rounded-2xl border animate-pulse"
          style={{ background: '#0d1117', borderColor: 'var(--border)', height: 100 }}
        />
      ))}
    </div>
  )
}

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

function ActivitySkeleton() {
  return (
    <div className="space-y-2 px-6 py-4">
      {[0, 1, 2, 3, 4].map((i) => (
        <div key={i} className="h-12 rounded-xl animate-pulse" style={{ background: 'var(--bg3)' }} />
      ))}
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  return (
    <DashboardClient
      kpiSummary={
        <Suspense fallback={<KPISkeleton />}>
          <DashboardKPIs />
        </Suspense>
      }
      revenusDepensesChart={<RevenusDepensesChart />}
      activityFeed={
        <Suspense fallback={<ActivitySkeleton />}>
          <DashboardRecentActivity />
        </Suspense>
      }
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
