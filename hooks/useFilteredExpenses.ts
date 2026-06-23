// ============================================================
// hooks/useFilteredExpenses.ts
// Reads expenses + active filters from Redux and returns
// the filtered subset.
// ============================================================

import { useMemo } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { Expense } from "@/types/expense";

interface FilteredResult {
  filteredExpenses: Expense[];
  count: number;
}

/**
 * Applies all active filters (from Redux) to the expense list.
 * Filters: category, month, search (title/note), min/max amount.
 */
export function useFilteredExpenses(): FilteredResult {
  const expenses = useSelector((state: RootState) => state.expenses.expenses);
  const filters = useSelector((state: RootState) => state.expenses.filters);

  return useMemo(() => {
    let result = [...expenses];

    // Filter by category (skip if "all")
    if (filters.category !== "all") {
      result = result.filter((e) => e.category === filters.category);
    }

    // Filter by month — check if expense date starts with "YYYY-MM"
    if (filters.month) {
      result = result.filter((e) => e.date.startsWith(filters.month));
    }

    // Filter by search term (case-insensitive match on title or note)
    if (filters.search.trim()) {
      const term = filters.search.trim().toLowerCase();
      result = result.filter(
        (e) =>
          e.title.toLowerCase().includes(term) ||
          (e.note && e.note.toLowerCase().includes(term))
      );
    }

    // Filter by minimum amount (in cents)
    if (filters.minAmount !== null) {
      result = result.filter((e) => e.amount >= filters.minAmount!);
    }

    // Filter by maximum amount (in cents)
    if (filters.maxAmount !== null) {
      result = result.filter((e) => e.amount <= filters.maxAmount!);
    }

    return { filteredExpenses: result, count: result.length };
  }, [expenses, filters]);
}
