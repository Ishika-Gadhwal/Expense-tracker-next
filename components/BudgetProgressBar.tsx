"use client";

// ============================================================
// components/BudgetProgressBar.tsx
// Green < 70%, Yellow 70–90%, Red > 90% of budget spent
// ============================================================

import { useCurrency } from "@/context/CurrencyContext";
import { cn } from "@/lib/utils";

interface BudgetProgressBarProps {
  spent: number; // in cents
  budget: number; // in cents
  month: string; // e.g. "2025-01" (used for label)
  className?: string;
}

export function BudgetProgressBar({
  spent,
  budget,
  month,
  className,
}: BudgetProgressBarProps) {
  const { formatAmount } = useCurrency();

  // If no budget is set, show a placeholder message
  if (budget === 0) {
    return (
      <div className={cn("space-y-2", className)}>
        <div className="flex justify-between text-sm text-gray-500">
          <span className="font-medium">{month}</span>
          <span>No budget set</span>
        </div>
        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full w-0 bg-gray-300 rounded-full" />
        </div>
        <p className="text-xs text-gray-400">
          Spent: {formatAmount(spent)} — Set a budget to track progress
        </p>
      </div>
    );
  }

  // Calculate percentage used (capped at 100 for the visual bar)
  const percentage = Math.min((spent / budget) * 100, 100);
  const rawPercentage = (spent / budget) * 100;

  // Color thresholds: green < 70%, yellow 70–90%, red > 90%
  const barColor =
    rawPercentage < 70
      ? "bg-emerald-500"
      : rawPercentage < 90
      ? "bg-yellow-400"
      : "bg-red-500";

  const textColor =
    rawPercentage < 70
      ? "text-emerald-600"
      : rawPercentage < 90
      ? "text-yellow-600"
      : "text-red-600";

  const remaining = budget - spent;
  const isOverBudget = spent > budget;

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex justify-between items-center text-sm">
        <span className="font-semibold text-gray-700">{month}</span>
        <span className={cn("font-bold text-sm", textColor)}>
          {rawPercentage.toFixed(0)}% used
        </span>
      </div>

      {/* Progress bar track */}
      <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all duration-500", barColor)}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Amounts row */}
      <div className="flex justify-between text-xs text-gray-500">
        <span>
          Spent:{" "}
          <span className="font-semibold text-gray-700">
            {formatAmount(spent)}
          </span>
        </span>
        <span>
          {isOverBudget ? (
            <span className="font-semibold text-red-600">
              Over by {formatAmount(Math.abs(remaining))}
            </span>
          ) : (
            <>
              Left:{" "}
              <span className="font-semibold text-gray-700">
                {formatAmount(remaining)}
              </span>
            </>
          )}
        </span>
        <span>
          Budget:{" "}
          <span className="font-semibold text-gray-700">
            {formatAmount(budget)}
          </span>
        </span>
      </div>
    </div>
  );
}
