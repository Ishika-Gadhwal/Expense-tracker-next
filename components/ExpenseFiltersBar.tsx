"use client";

// ============================================================
// components/ExpenseFiltersBar.tsx
// Filter controls: search, category, month, min/max amount.
// Dispatches all changes to Redux on every change.
// Shows count of active filters and a Reset button.
// ============================================================

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { clearFilters, setFilters } from "@/store/expenseSlice";
import { useCurrency } from "@/context/CurrencyContext";
import { ExpenseCategory } from "@/types/expense";
import { ALL_CATEGORIES, capitalize, cn } from "@/lib/utils";
import { Search, X, SlidersHorizontal } from "lucide-react";

interface ExpenseFiltersBarProps {
  className?: string;
}

export function ExpenseFiltersBar({ className }: ExpenseFiltersBarProps) {
  const dispatch = useDispatch<AppDispatch>();
  const filters = useSelector((state: RootState) => state.expenses.filters);
  const { currencySymbol } = useCurrency();

  // Count how many filters are active
  const activeCount = [
    filters.category !== "all",
    filters.month !== "",
    filters.search !== "",
    filters.minAmount !== null,
    filters.maxAmount !== null,
  ].filter(Boolean).length;

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    dispatch(setFilters({ search: e.target.value }));
  }

  function handleCategoryChange(e: React.ChangeEvent<HTMLSelectElement>) {
    dispatch(
      setFilters({ category: e.target.value as ExpenseCategory | "all" })
    );
  }

  function handleMonthChange(e: React.ChangeEvent<HTMLInputElement>) {
    dispatch(setFilters({ month: e.target.value }));
  }

  function handleMinAmountChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    // Convert from selected currency input to cents for the store
    dispatch(
      setFilters({
        minAmount: val ? Math.round(parseFloat(val) * 100) : null,
      })
    );
  }

  function handleMaxAmountChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    dispatch(
      setFilters({
        maxAmount: val ? Math.round(parseFloat(val) * 100) : null,
      })
    );
  }

  function handleReset() {
    dispatch(clearFilters());
  }

  // Convert cents back to decimal string for the input display
  const minDisplay =
    filters.minAmount !== null ? (filters.minAmount / 100).toString() : "";
  const maxDisplay =
    filters.maxAmount !== null ? (filters.maxAmount / 100).toString() : "";

  return (
    <div
      className={cn(
        "bg-white rounded-2xl border border-gray-100 shadow-sm p-4",
        className
      )}
    >
      <div className="flex items-center gap-2 mb-3">
        <SlidersHorizontal className="w-4 h-4 text-indigo-500" />
        <span className="text-sm font-semibold text-gray-700">Filters</span>
        {activeCount > 0 && (
          <span className="ml-1 px-2 py-0.5 bg-indigo-100 text-indigo-700 text-xs font-bold rounded-full">
            {activeCount} active
          </span>
        )}
        {activeCount > 0 && (
          <button
            onClick={handleReset}
            className="ml-auto flex items-center gap-1 text-xs text-gray-500 hover:text-red-500 transition-colors"
          >
            <X className="w-3 h-3" />
            Reset
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {/* Search */}
        <div className="lg:col-span-2 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search expenses..."
            value={filters.search}
            onChange={handleSearchChange}
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 bg-gray-50"
          />
        </div>

        {/* Category */}
        <select
          value={filters.category}
          onChange={handleCategoryChange}
          className="py-2 px-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 bg-gray-50 text-gray-700"
        >
          <option value="all">All Categories</option>
          {ALL_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {capitalize(cat)}
            </option>
          ))}
        </select>

        {/* Month picker */}
        <input
          type="month"
          value={filters.month}
          onChange={handleMonthChange}
          className="py-2 px-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 bg-gray-50 text-gray-700"
        />

        {/* Min/Max amount */}
        <div className="flex gap-2">
          <input
            type="number"
            placeholder={`Min ${currencySymbol}`}
            value={minDisplay}
            onChange={handleMinAmountChange}
            min="0"
            step="0.01"
            className="w-full py-2 px-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 bg-gray-50"
          />
          <input
            type="number"
            placeholder={`Max ${currencySymbol}`}
            value={maxDisplay}
            onChange={handleMaxAmountChange}
            min="0"
            step="0.01"
            className="w-full py-2 px-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 bg-gray-50"
          />
        </div>
      </div>
    </div>
  );
}
