"use client";

// ============================================================
// app/expenses/[id]/ExpenseDetailClient.tsx
// Renders full details of a single expense with edit/delete actions.
// ============================================================

import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { Expense } from "@/types/expense";
import { deleteExpense } from "@/store/expenseSlice";
import { AppDispatch } from "@/store";
import { useCurrency } from "@/context/CurrencyContext";
import { CategoryBadge } from "@/components/CategoryBadge";
import { formatDate } from "@/lib/utils";
import {
  ArrowLeft,
  Pencil,
  Trash2,
  Calendar,
  FileText,
  DollarSign,
  Clock,
} from "lucide-react";
import { useState } from "react";

interface ExpenseDetailClientProps {
  expense: Expense;
}

export function ExpenseDetailClient({ expense }: ExpenseDetailClientProps) {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { formatAmount } = useCurrency();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    setIsDeleting(true);
    await dispatch(deleteExpense(expense.id));
    router.push("/expenses");
  }

  return (
    <div className="max-w-xl mx-auto space-y-5">
      {/* Back button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to expenses
      </button>

      {/* Main card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Colored header bar */}
        <div className="h-2 bg-gradient-to-r from-indigo-500 to-purple-500" />

        <div className="p-6 space-y-5">
          {/* Title + category */}
          <div>
            <h1 className="text-xl font-bold text-gray-900">{expense.title}</h1>
            <div className="mt-2">
              <CategoryBadge category={expense.category} size="md" />
            </div>
          </div>

          {/* Amount — big display */}
          <div className="bg-gray-50 rounded-xl px-4 py-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">
                Amount
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {formatAmount(expense.amount)}
              </p>
            </div>
          </div>

          {/* Details grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-start gap-2.5">
              <Calendar className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-gray-400 font-medium">Date</p>
                <p className="text-sm font-semibold text-gray-700">
                  {formatDate(expense.date)}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <Clock className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-gray-400 font-medium">Added</p>
                <p className="text-sm font-semibold text-gray-700">
                  {formatDate(expense.createdAt.split("T")[0])}
                </p>
              </div>
            </div>
          </div>

          {/* Note */}
          {expense.note && (
            <div className="flex items-start gap-2.5 bg-amber-50 rounded-xl px-4 py-3">
              <FileText className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-amber-600 font-medium mb-0.5">Note</p>
                <p className="text-sm text-gray-700">{expense.note}</p>
              </div>
            </div>
          )}

          {/* ID (small, for reference) */}
          <p className="text-xs text-gray-300">ID: {expense.id}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={() => router.push(`/expenses/${expense.id}/edit`)}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700 transition-colors shadow-sm"
        >
          <Pencil className="w-4 h-4" />
          Edit Expense
        </button>
        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="flex items-center justify-center gap-2 py-2.5 px-4 bg-red-50 text-red-600 text-sm font-medium rounded-xl hover:bg-red-100 transition-colors border border-red-100"
        >
          <Trash2 className="w-4 h-4" />
          Delete
        </button>
      </div>

      {/* Delete confirmation modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full space-y-4">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6 text-red-500" />
            </div>
            <div className="text-center">
              <h3 className="font-bold text-gray-900">Delete this expense?</h3>
              <p className="text-sm text-gray-500 mt-1">
                &quot;{expense.title}&quot; will be permanently removed.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-2.5 text-sm font-medium bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 py-2.5 text-sm font-medium bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
