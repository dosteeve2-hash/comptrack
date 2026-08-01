import { SkeletonCard, SkeletonLigneCompta } from '@/components/ui/Skeleton';

export default function DashboardLoading() {
  return (
    <div className="flex flex-col gap-6 p-1">
      {/* Stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>

      {/* Graphique placeholder */}
      <div className="rounded-2xl h-52 bg-white/5 border border-white/5 animate-pulse" />

      {/* Liste transactions */}
      <div className="rounded-2xl p-4 bg-white/5 border border-white/5">
        <div className="h-5 w-40 rounded-lg bg-white/10 mb-4 animate-pulse" />
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonLigneCompta key={i} />
        ))}
      </div>
    </div>
  );
}
