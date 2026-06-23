// ============================================================
// app/expenses/loading.tsx — Skeleton loading state
// Shown by Next.js automatically while expenses/page.tsx loads.
// Must have at least 5 skeleton rows with animated shimmer.
// ============================================================

import { ExpenseListSkeleton } from "@/components/skeletons/ExpenseCardSkeleton";

export default function ExpensesLoading() {
  return (
    <div className="space-y-5">
      {/* Header skeleton */}
      <div className="flex items-center justify-between animate-pulse">
        <div className="space-y-2">
          <div className="h-7 bg-gray-200 rounded-lg w-40" />
          <div className="h-4 bg-gray-100 rounded w-24" />
        </div>
        <div className="h-9 bg-gray-200 rounded-xl w-28" />
      </div>

      {/* Filters skeleton */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-16 mb-3" />
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          <div className="sm:col-span-2 h-9 bg-gray-100 rounded-xl" />
          <div className="h-9 bg-gray-100 rounded-xl" />
          <div className="h-9 bg-gray-100 rounded-xl" />
          <div className="h-9 bg-gray-100 rounded-xl" />
        </div>
      </div>

      {/* 5 Expense card skeletons with shimmer */}
      <ExpenseListSkeleton />
    </div>
  );
}
