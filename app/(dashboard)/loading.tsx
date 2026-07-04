export default function DashboardLoading() {
  return (
    <div className="p-6 space-y-4">
      <div className="h-8 w-48 bg-white/10 animate-pulse rounded" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-32 bg-white/10 animate-pulse rounded-lg" />
        ))}
      </div>
      <div className="h-64 bg-white/10 animate-pulse rounded-lg" />
    </div>
  )
}
