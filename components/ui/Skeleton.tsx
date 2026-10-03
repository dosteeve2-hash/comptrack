import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn('animate-pulse rounded-xl bg-white/5 border border-white/5', className)}
      aria-hidden="true"
    />
  );
}

export function SkeletonText({ lines = 3, className }: { lines?: number; className?: string }) {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className={cn('h-4', i === lines - 1 ? 'w-2/3' : 'w-full')} />
      ))}
    </div>
  );
}

export function SkeletonCard({ className }: SkeletonProps) {
  return (
    <div
      className={cn('rounded-2xl p-5 flex flex-col gap-4 border border-white/5', className)}
      style={{ background: '#0D1E38' }}
    >
      <div className="flex items-center gap-3">
        <Skeleton className="w-10 h-10 rounded-xl flex-shrink-0" />
        <div className="flex-1 flex flex-col gap-2">
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-3 w-1/3" />
        </div>
      </div>
      <Skeleton className="h-8 w-2/3" />
      <Skeleton className="h-3 w-full" />
    </div>
  );
}

export function SkeletonTableRow() {
  return (
    <div className="flex items-center gap-3 animate-pulse py-2">
      <Skeleton className="w-8 h-8 rounded-full flex-shrink-0" />
      <Skeleton className="flex-1 h-4" />
      <Skeleton className="w-24 h-4" />
      <Skeleton className="w-16 h-6 rounded-full" />
    </div>
  );
}

/** Skeleton pour liste factures/dépenses/revenus CompTrack */
export function SkeletonLigneCompta() {
  return (
    <div className="flex items-center gap-4 animate-pulse py-3 border-b border-white/5">
      <Skeleton className="w-9 h-9 rounded-xl flex-shrink-0" />
      <div className="flex-1 flex flex-col gap-1.5">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-3 w-1/4" />
      </div>
      <Skeleton className="w-20 h-6 rounded-full" />
      <Skeleton className="w-28 h-4" />
    </div>
  );
}
