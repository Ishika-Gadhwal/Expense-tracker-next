"use client";

// ============================================================
// app/DashboardClient.tsx — Dashboard interactive layer
// Receives server-fetched data as props and renders:
// - Session error banner
// - 4 Summary Cards (Total Spent, Budget, Remaining, Avg/Day)
// - Pie Chart (by category)
// - Bar Chart (daily spending)
// - Budget Progress Bar
// - Last 5 expenses
// ============================================================

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { Expense, ExpenseCategory, MonthlyBudget } from "@/types/expense";
import { setExpenses } from "@/store/expenseSlice";
import { upsertBudget } from "@/store/budgetSlice";
import { AppDispatch } from "@/store";
import { useCurrency } from "@/context/CurrencyContext";
import { useExpenseSummary } from "@/hooks/useExpenseSummary";
import { SummaryCard } from "@/components/SummaryCard";
import { BudgetProgressBar } from "@/components/BudgetProgressBar";
import { ExpenseCard } from "@/components/ExpenseCard";
import { CategoryPieChart } from "@/components/charts/CategoryPieChart";
import { DailyBarChart } from "@/components/charts/DailyBarChart";
import { deleteExpense } from "@/store/expenseSlice";
import { getDaysInMonth, ALL_CATEGORIES } from "@/lib/utils";
import {
  Wallet,
  Target,
  TrendingDown,
  Calendar,
  AlertCircle,
  X,
} from "lucide-react";
import { useState } from "react";

interface DashboardClientProps {
  initialExpenses: Expense[];
  initialBudget: MonthlyBudget;
  currentMonth: string;
  sessionError: boolean;
}

export function DashboardClient({
  initialExpenses,
  initialBudget,
  currentMonth,
  sessionError,
}: DashboardClientProps) {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { formatAmount } = useCurrency();
  const [showError, setShowError] = useState(sessionError);

  // Hydrate Redux store with server-fetched data
  useEffect(() => {
    dispatch(setExpenses(initialExpenses));
    dispatch(upsertBudget(initialBudget));
  }, [dispatch, initialExpenses, initialBudget]);

  const summary = useExpenseSummary(currentMonth);

  // Build pie chart data from summary.byCategory
  const pieData = ALL_CATEGORIES.map((cat) => ({
    category: cat as ExpenseCategory,
    amount: summary.byCategory[cat],
  }));

  // Average daily spending for the current month
  const daysInMonth = getDaysInMonth(currentMonth);
  const avgPerDay = daysInMonth > 0 ? summary.totalSpent / daysInMonth : 0;

  // Last 5 expenses (already sorted by date desc from API)
  const recentExpenses = initialExpenses.slice(0, 5);

  function handleEdit(expense: Expense) {
    router.push(`/expenses/${expense.id}/edit`);
  }

  function handleDelete(id: string) {
    dispatch(deleteExpense(id));
  }

  return (
    <div className="space-y-6">
      {/* Session error banner */}
      {showError && (
        <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <p className="text-sm text-amber-700 flex-1">
            You need to be logged in to access that page. Please sign in first.
          </p>
          <button
            onClick={() => setShowError(false)}
            className="text-amber-500 hover:text-amber-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          {currentMonth} — Your spending at a glance
        </p>
      </div>

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <SummaryCard
          label="Total Spent"
          value={formatAmount(summary.totalSpent)}
          subLabel={`This month (${currentMonth})`}
          trend={summary.totalSpent > summary.totalBudget * 0.9 ? "up" : "neutral"}
          icon={<Wallet className="w-4 h-4" />}
          accentColor="border-l-indigo-500"
        />
        <SummaryCard
          label="Monthly Budget"
          value={
            summary.totalBudget > 0
              ? formatAmount(summary.totalBudget)
              : "Not set"
          }
          subLabel="Set in Budget page"
          trend="neutral"
          icon={<Target className="w-4 h-4" />}
          accentColor="border-l-purple-500"
        />
        <SummaryCard
          label="Remaining"
          value={
            summary.totalBudget > 0
              ? formatAmount(Math.max(summary.remaining, 0))
              : "—"
          }
          subLabel={
            summary.remaining < 0
              ? `Over budget by ${formatAmount(Math.abs(summary.remaining))}`
              : "Left to spend"
          }
          trend={summary.remaining < 0 ? "up" : "down"}
          icon={<TrendingDown className="w-4 h-4" />}
          accentColor={
            summary.remaining < 0 ? "border-l-red-500" : "border-l-emerald-500"
          }
        />
        <SummaryCard
          label="Avg per Day"
          value={formatAmount(Math.round(avgPerDay))}
          subLabel={`Across ${daysInMonth} days`}
          trend="neutral"
          icon={<Calendar className="w-4 h-4" />}
          accentColor="border-l-blue-500"
        />
      </div>

      {/* Budget Progress Bar */}
      {summary.totalBudget > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">
            Budget Progress
          </h2>
          <BudgetProgressBar
            spent={summary.totalSpent}
            budget={summary.totalBudget}
            month={currentMonth}
          />
        </div>
      )}

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Pie Chart: by category */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">
            Spending by Category
          </h2>
          <CategoryPieChart data={pieData} />
        </div>

        {/* Bar Chart: daily spending */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">
            Daily Spending — {currentMonth}
          </h2>
          <DailyBarChart expenses={initialExpenses} month={currentMonth} />
        </div>
      </div>

      {/* Recent Expenses */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-gray-700">
            Recent Expenses
          </h2>
          <a
            href="/expenses"
            className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
          >
            View all →
          </a>
        </div>

        {recentExpenses.length === 0 ? (
          <div className="text-center py-8 text-gray-400 text-sm">
            No expenses yet.{" "}
            <a href="/add" className="text-indigo-500 hover:underline">
              Add your first expense
            </a>
          </div>
        ) : (
          <div className="space-y-2">
            {recentExpenses.map((expense) => (
              <ExpenseCard
                key={expense.id}
                expense={expense}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
