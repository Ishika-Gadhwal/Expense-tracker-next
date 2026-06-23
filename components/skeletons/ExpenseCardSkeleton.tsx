// ============================================================
// components/skeletons/ExpenseCardSkeleton.tsx
// Animated shimmer skeleton for expense card loading state
// ============================================================

export function ExpenseCardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm border-l-4 border-l-gray-200 p-4 animate-pulse">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 space-y-2">
          {/* Title skeleton */}
          <div className="h-4 bg-gray-200 rounded-lg w-3/5" />
          {/* Badge + date row */}
          <div className="flex items-center gap-2">
            <div className="h-5 bg-gray-200 rounded-full w-20" />
            <div className="h-3 bg-gray-100 rounded w-16" />
          </div>
          {/* Note skeleton (sometimes present) */}
          <div className="h-3 bg-gray-100 rounded w-2/5" />
        </div>
        {/* Amount skeleton */}
        <div className="h-5 bg-gray-200 rounded-lg w-16 shrink-0" />
      </div>
    </div>
  );
}

/** Render 5 skeleton cards stacked */
export function ExpenseListSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <ExpenseCardSkeleton key={i} />
      ))}
    </div>
  );
}
