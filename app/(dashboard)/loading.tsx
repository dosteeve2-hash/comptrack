export default function DashboardLoading() {
  return (
    <div className="flex flex-col gap-6 p-2 animate-pulse">
      {/* KPI skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl p-4 h-24"
            style={{ background: "var(--bg3)", border: "1px solid var(--border)" }}
          />
        ))}
      </div>

      {/* Chart skeleton */}
      <div
        className="rounded-xl h-56"
        style={{ background: "var(--bg3)", border: "1px solid var(--border)" }}
      />

      {/* List skeleton */}
      <div
        className="rounded-xl p-4 flex flex-col gap-3"
        style={{ background: "var(--bg3)", border: "1px solid var(--border)" }}
      >
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full" style={{ background: "var(--border2)" }} />
            <div className="flex-1 h-4 rounded" style={{ background: "var(--border2)" }} />
            <div className="w-20 h-4 rounded" style={{ background: "var(--border2)" }} />
          </div>
        ))}
      </div>
    </div>
  );
}
