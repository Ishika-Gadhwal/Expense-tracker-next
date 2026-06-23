"use client";

// ============================================================
// app/expenses/ExpensesListClient.tsx
// Client-side interactive layer for the expenses list page.
// Receives server-fetched expenses, syncs to Redux,
// then renders filters + expense cards.
// ============================================================

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { Expense } from "@/types/expense";
import { setExpenses, deleteExpense } from "@/store/expenseSlice";
import { AppDispatch } from "@/store";
import { useFilteredExpenses } from "@/hooks/useFilteredExpenses";
import { ExpenseCard } from "@/components/ExpenseCard";
import { ExpenseFiltersBar } from "@/components/ExpenseFiltersBar";
import { List, PlusCircle } from "lucide-react";
import Link from "next/link";

interface ExpensesListClientProps {
  initialExpenses: Expense[];
}

export function ExpensesListClient({ initialExpenses }: ExpensesListClientProps) {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  // Sync server-fetched expenses into Redux store
  useEffect(() => {
    dispatch(setExpenses(initialExpenses));
  }, [dispatch, initialExpenses]);

  // Get filtered results from Redux (reactive to filter changes)
  const { filteredExpenses, count } = useFilteredExpenses();

  function handleEdit(expense: Expense) {
    router.push(`/expenses/${expense.id}/edit`);
  }

  function handleDelete(id: string) {
    dispatch(deleteExpense(id));
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <List className="w-5 h-5 text-indigo-500" />
            All Expenses
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {count} expense{count !== 1 ? "s" : ""} found
          </p>
        </div>
        <Link
          href="/add"
          className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700 transition-colors shadow-sm"
        >
          <PlusCircle className="w-4 h-4" />
          Add New
        </Link>
      </div>

      {/* Filters */}
      <ExpenseFiltersBar />

      {/* Expense list */}
      {filteredExpenses.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
          <div className="text-4xl mb-3">🔍</div>
          <h3 className="font-semibold text-gray-700 mb-1">No expenses found</h3>
          <p className="text-sm text-gray-500">
            Try adjusting your filters or{" "}
            <Link href="/add" className="text-indigo-500 hover:underline">
              add a new expense
            </Link>
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredExpenses.map((expense) => (
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
  );
}
