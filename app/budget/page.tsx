"use client";

// ============================================================
// app/budget/page.tsx — Budget management (Client Component)
// Lists all months with set budgets.
// Allows setting/updating budgets via a form.
// Shows spending vs budget summary for each listed month.
// ============================================================

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { fetchBudget, setBudget } from "@/store/budgetSlice";
import { fetchExpenses } from "@/store/expenseSlice";
import { useCurrency } from "@/context/CurrencyContext";
import { BudgetProgressBar } from "@/components/BudgetProgressBar";
import { MonthlyBudget } from "@/types/expense";
import { getCurrentMonth } from "@/lib/utils";
import {
  PiggyBank,
  PlusCircle,
  Loader2,
  CheckCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

// Hard-coded list of months to show (last 6 months + current)
function getRecentMonths(): string[] {
  const months: string[] = [];
  const now = new Date();
  for (let i = 0; i < 6; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const month = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    months.push(month);
  }
  return months;
}

export default function BudgetPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { formatAmount } = useCurrency();

  const budgets = useSelector((state: RootState) => state.budgets.budgets);
  const budgetStatus = useSelector((state: RootState) => state.budgets.status);
  const expenses = useSelector((state: RootState) => state.expenses.expenses);

  // Form state
  const [formMonth, setFormMonth] = useState(getCurrentMonth());
  const [formAmount, setFormAmount] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Which month row is "expanded" to show full details
  const [expandedMonth, setExpandedMonth] = useState<string | null>(null);

  const recentMonths = getRecentMonths();

  // On mount, load expenses and budgets for recent months
  useEffect(() => {
    dispatch(fetchExpenses());
    recentMonths.forEach((month) => {
      dispatch(fetchBudget(month));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  async function handleSetBudget(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(false);

    // Validate amount
    const parsed = parseFloat(formAmount);
    if (!formAmount || isNaN(parsed) || parsed < 0) {
      setFormError("Please enter a valid amount (0 or more).");
      return;
    }

    const cents = Math.round(parsed * 100);
    setIsSubmitting(true);

    const result = await dispatch(setBudget({ month: formMonth, amount: cents }));

    if (setBudget.fulfilled.match(result)) {
      setFormSuccess(true);
      setFormAmount("");
      setTimeout(() => setFormSuccess(false), 3000);
    } else {
      setFormError("Failed to set budget. Please try again.");
    }

    setIsSubmitting(false);
  }

  // Get spending total for a given month from Redux expenses
  function getSpentForMonth(month: string): number {
    return expenses
      .filter((e) => e.date.startsWith(month))
      .reduce((sum, e) => sum + e.amount, 0);
  }

  // Get budget amount for a month (0 if not set)
  function getBudgetForMonth(month: string): number {
    const b = budgets.find((b: MonthlyBudget) => b.month === month);
    return b ? b.amount : 0;
  }

  // All months that have a budget set
  const budgetedMonths = budgets
    .slice()
    .sort((a, b) => b.month.localeCompare(a.month));

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <PiggyBank className="w-6 h-6 text-indigo-500" />
          Monthly Budget
        </h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Set spending limits and track your progress each month
        </p>
      </div>

      {/* Set / Update Budget Form */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
          <PlusCircle className="w-4 h-4 text-indigo-500" />
          Set Budget for a Month
        </h2>

        <form onSubmit={handleSetBudget} className="space-y-4">
          {formSuccess && (
            <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <p className="text-sm text-emerald-700">Budget saved!</p>
            </div>
          )}
          {formError && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">
              {formError}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Month picker */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                Month
              </label>
              <input
                type="month"
                value={formMonth}
                onChange={(e) => setFormMonth(e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 bg-gray-50"
              />
            </div>

            {/* Amount */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                Budget Amount ($)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                  $
                </span>
                <input
                  type="number"
                  value={formAmount}
                  onChange={(e) => setFormAmount(e.target.value)}
                  placeholder="e.g. 3000.00"
                  min="0"
                  step="0.01"
                  className="w-full pl-7 pr-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 bg-gray-50"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-50"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <CheckCircle className="w-4 h-4" />
            )}
            {isSubmitting ? "Saving..." : "Save Budget"}
          </button>
        </form>
      </div>

      {/* Budget list */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
        <h2 className="text-sm font-semibold text-gray-700">
          Budget Overview{" "}
          <span className="text-gray-400 font-normal">
            ({budgetedMonths.length} months)
          </span>
        </h2>

        {budgetStatus === "loading" && budgetedMonths.length === 0 && (
          <div className="flex justify-center py-8">
            <Loader2 className="w-5 h-5 text-indigo-400 animate-spin" />
          </div>
        )}

        {budgetedMonths.length === 0 && budgetStatus !== "loading" && (
          <div className="text-center py-8 text-gray-400 text-sm">
            No budgets set yet. Use the form above to get started.
          </div>
        )}

        <div className="space-y-3">
          {budgetedMonths.map((b: MonthlyBudget) => {
            const spent = getSpentForMonth(b.month);
            const isExpanded = expandedMonth === b.month;

            return (
              <div
                key={b.month}
                className="border border-gray-100 rounded-xl overflow-hidden"
              >
                {/* Row header */}
                <button
                  onClick={() =>
                    setExpandedMonth(isExpanded ? null : b.month)
                  }
                  className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-gray-700">
                      {b.month}
                    </span>
                    <span className="text-xs text-gray-400">
                      {formatAmount(spent)} of {formatAmount(b.amount)}
                    </span>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  )}
                </button>

                {/* Expanded details */}
                {isExpanded && (
                  <div className="px-4 pb-4 border-t border-gray-50">
                    <div className="pt-3">
                      <BudgetProgressBar
                        spent={spent}
                        budget={b.amount}
                        month={b.month}
                      />
                    </div>
                    {/* Quick stats */}
                    <div className="mt-3 grid grid-cols-3 gap-3">
                      {[
                        { label: "Budget", value: formatAmount(b.amount) },
                        { label: "Spent", value: formatAmount(spent) },
                        {
                          label: "Remaining",
                          value: formatAmount(Math.max(b.amount - spent, 0)),
                        },
                      ].map((stat) => (
                        <div
                          key={stat.label}
                          className="bg-gray-50 rounded-lg px-3 py-2 text-center"
                        >
                          <p className="text-xs text-gray-400">{stat.label}</p>
                          <p className="text-sm font-bold text-gray-700">
                            {stat.value}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent months preview (even if no budget set) */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
        <h2 className="text-sm font-semibold text-gray-700">
          Recent Month Spending
        </h2>
        <div className="space-y-4">
          {recentMonths.map((month) => {
            const spent = getSpentForMonth(month);
            const budget = getBudgetForMonth(month);
            return (
              <BudgetProgressBar
                key={month}
                spent={spent}
                budget={budget}
                month={month}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
