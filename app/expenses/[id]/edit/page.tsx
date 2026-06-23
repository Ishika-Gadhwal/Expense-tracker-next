"use client";

// ============================================================
// app/expenses/[id]/edit/page.tsx — Edit expense (Client Component)
// Pre-fills the form with existing expense data from the API.
// ============================================================

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { Expense } from "@/types/expense";
import { editExpense } from "@/store/expenseSlice";
import { AppDispatch } from "@/store";
import { useExpenseForm } from "@/hooks/useExpenseForm";
import { ALL_CATEGORIES, capitalize } from "@/lib/utils";
import { ArrowLeft, Save, Loader2 } from "lucide-react";

export default function EditExpensePage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expense, setExpense] = useState<Expense | null>(null);

  // Fetch the existing expense to pre-fill the form
  useEffect(() => {
    async function fetchExpense() {
      try {
        const res = await fetch(`/api/expenses/${params.id}`);
        if (res.status === 404) {
          setFetchError("Expense not found.");
          return;
        }
        if (!res.ok) throw new Error("Failed to fetch expense");
        const data = (await res.json()) as Expense;
        setExpense(data);
      } catch {
        setFetchError("Could not load expense. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    fetchExpense();
  }, [params.id]);

  // Initialize form with existing expense data
  const { values, errors, handleChange, handleSubmit, setFieldValue } =
    useExpenseForm(expense ?? undefined);

  // When expense loads, the hook re-initialises — but since hooks run at render
  // time with a stable initial, we must manually set field values once expense arrives.
  useEffect(() => {
    if (expense) {
      setFieldValue("title", expense.title);
      setFieldValue("amount", (expense.amount / 100).toFixed(2));
      setFieldValue("category", expense.category);
      setFieldValue("date", expense.date);
      setFieldValue("note", expense.note ?? "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expense]);

  async function onSubmit(data: Omit<Expense, "id" | "createdAt">) {
    setIsSubmitting(true);
    setSubmitError(null);
    const result = await dispatch(editExpense({ id: params.id, ...data }));
    if (editExpense.fulfilled.match(result)) {
      router.push(`/expenses/${params.id}`);
    } else {
      setSubmitError(
        typeof result.payload === "string"
          ? result.payload
          : "Failed to update expense."
      );
    }
    setIsSubmitting(false);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <Loader2 className="w-6 h-6 text-indigo-500 animate-spin" />
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="max-w-xl mx-auto text-center py-16">
        <p className="text-red-500 font-medium">{fetchError}</p>
        <button
          onClick={() => router.back()}
          className="mt-4 text-sm text-indigo-600 hover:underline"
        >
          Go back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto space-y-5">
      {/* Back */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
        <h1 className="text-xl font-bold text-gray-900">Edit Expense</h1>

        {submitError && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">
            {submitError}
          </div>
        )}

        <div className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
              Title *
            </label>
            <input
              type="text"
              name="title"
              value={values.title}
              onChange={handleChange}
              placeholder="e.g. Grocery shopping"
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 bg-gray-50"
            />
            {errors.title && (
              <p className="mt-1 text-xs text-red-500">{errors.title}</p>
            )}
          </div>

          {/* Amount */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
              Amount ($) *
            </label>
            <input
              type="number"
              name="amount"
              value={values.amount}
              onChange={handleChange}
              placeholder="0.00"
              min="0.01"
              step="0.01"
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 bg-gray-50"
            />
            {errors.amount && (
              <p className="mt-1 text-xs text-red-500">{errors.amount}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
              Category *
            </label>
            <select
              name="category"
              value={values.category}
              onChange={handleChange}
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 bg-gray-50"
            >
              {ALL_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {capitalize(cat)}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="mt-1 text-xs text-red-500">{errors.category}</p>
            )}
          </div>

          {/* Date */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
              Date *
            </label>
            <input
              type="date"
              name="date"
              value={values.date}
              onChange={handleChange}
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 bg-gray-50"
            />
            {errors.date && (
              <p className="mt-1 text-xs text-red-500">{errors.date}</p>
            )}
          </div>

          {/* Note */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
              Note (optional)
            </label>
            <textarea
              name="note"
              value={values.note}
              onChange={handleChange}
              placeholder="Any additional details..."
              rows={3}
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 bg-gray-50 resize-none"
            />
          </div>
        </div>

        {/* Submit */}
        <button
          onClick={() => handleSubmit(onSubmit)}
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-2 py-3 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {isSubmitting ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
