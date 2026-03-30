export function OrderDetailSkeleton() {
  return (
    <div className="space-y-6 pb-10">
      <div className="h-72 animate-pulse rounded-[28px] border border-[#E8DDD2] bg-[#FCF7F1]" />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.55fr)_minmax(320px,0.95fr)]">
        <div className="space-y-6">
          <div className="h-60 animate-pulse rounded-3xl border border-[#E8DDD2] bg-white" />
          <div className="h-[480px] animate-pulse rounded-3xl border border-[#E8DDD2] bg-white" />
        </div>

        <div className="space-y-6">
          <div className="h-80 animate-pulse rounded-3xl border border-[#E8DDD2] bg-white" />
          <div className="h-80 animate-pulse rounded-3xl border border-[#E8DDD2] bg-white" />
          <div className="h-96 animate-pulse rounded-3xl border border-[#E8DDD2] bg-white" />
        </div>
      </div>
    </div>
  );
}
