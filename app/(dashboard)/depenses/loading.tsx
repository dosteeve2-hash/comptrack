export default function DepensesLoading() {
  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <div className="h-8 w-32 bg-white/10 animate-pulse rounded" />
        <div className="h-10 w-28 bg-white/10 animate-pulse rounded-lg" />
      </div>
      <div className="h-10 w-64 bg-white/10 animate-pulse rounded-lg" />
      <div className="rounded-lg overflow-hidden border border-white/10">
        <div className="h-12 bg-white/20 animate-pulse" />
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-14 bg-white/5 animate-pulse border-t border-white/10" />
        ))}
      </div>
    </div>
  )
}
