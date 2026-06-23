// ============================================================
// hooks/useExpenseSummary.ts
// Computes an ExpenseSummary for a given month from Redux state.
// ============================================================

import { useMemo } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { ExpenseCategory, ExpenseSummary } from "@/types/expense";
import { ALL_CATEGORIES } from "@/lib/utils";

/**
 * Given a month string (e.g. "2025-01"), return a summary object:
 * - totalSpent: sum of all expense amounts for that month
 * - totalBudget: the budget set for that month (0 if none)
 * - remaining: totalBudget - totalSpent
 * - byCategory: per-category totals
 */
export function useExpenseSummary(month: string): ExpenseSummary {
  const expenses = useSelector((state: RootState) => state.expenses.expenses);
  const budgets = useSelector((state: RootState) => state.budgets.budgets);

  return useMemo(() => {
    // Filter expenses that belong to the requested month
    const monthExpenses = month
      ? expenses.filter((e) => e.date.startsWith(month))
      : expenses;

    // Sum all amounts for the month
    const totalSpent = monthExpenses.reduce((sum, e) => sum + e.amount, 0);

    // Find the budget for this month (default 0 if not set)
    const budgetEntry = budgets.find((b) => b.month === month);
    const totalBudget = budgetEntry ? budgetEntry.amount : 0;

    // Compute per-category totals
    // Start with 0 for every category so the object is always complete
    const byCategory = ALL_CATEGORIES.reduce(
      (acc, cat) => {
        acc[cat] = 0;
        return acc;
      },
      {} as Record<ExpenseCategory, number>
    );

    for (const expense of monthExpenses) {
      byCategory[expense.category] += expense.amount;
    }

    return {
      totalSpent,
      totalBudget,
      remaining: totalBudget - totalSpent,
      byCategory,
    };
  }, [expenses, budgets, month]);
}
