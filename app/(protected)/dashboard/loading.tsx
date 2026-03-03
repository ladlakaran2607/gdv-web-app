export default function DashboardLoading() {
  return (
    <div className="animate-pulse">
      {/* Welcome banner skeleton */}
      <div className="skeleton rounded-2xl h-32 mb-6" />

      {/* KPI grid skeleton */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="skeleton rounded-2xl h-28" />
        ))}
      </div>

      {/* Main grid skeleton */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2 skeleton rounded-2xl h-80" />
        <div className="flex flex-col gap-4">
          <div className="skeleton rounded-2xl h-48" />
          <div className="skeleton rounded-2xl h-40" />
        </div>
      </div>
    </div>
  );
}
