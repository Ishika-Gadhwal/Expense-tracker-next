"use client";

// ============================================================
// app/add/page.tsx — Add new expense (Client Component)
// Form to create a new expense. Dispatches createExpense thunk.
// ============================================================

import { useState } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { Expense } from "@/types/expense";
import { createExpense } from "@/store/expenseSlice";
import { AppDispatch } from "@/store";
import { useExpenseForm } from "@/hooks/useExpenseForm";
import { ALL_CATEGORIES, capitalize, getCategoryEmoji } from "@/lib/utils";
import { PlusCircle, Loader2, CheckCircle } from "lucide-react";

export default function AddExpensePage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const { values, errors, handleChange, handleSubmit, reset } =
    useExpenseForm();

  async function onSubmit(data: Omit<Expense, "id" | "createdAt">) {
    setIsSubmitting(true);
    setSubmitError(null);

    const result = await dispatch(createExpense(data));

    if (createExpense.fulfilled.match(result)) {
      setSuccess(true);
      reset();
      // Brief success flash before redirecting
      setTimeout(() => {
        router.push("/expenses");
      }, 1000);
    } else {
      setSubmitError(
        typeof result.payload === "string"
          ? result.payload
          : "Failed to add expense. Please try again."
      );
    }
    setIsSubmitting(false);
  }

  return (
    <div className="max-w-xl mx-auto space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <PlusCircle className="w-6 h-6 text-indigo-500" />
          Add Expense
        </h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Log a new expense to your tracker
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
        {/* Success message */}
        {success && (
          <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <p className="text-sm text-emerald-700 font-medium">
              Expense added! Redirecting...
            </p>
          </div>
        )}

        {/* Error message */}
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
              placeholder="e.g. Grocery shopping, Netflix, Rent..."
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 bg-gray-50 transition-colors"
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
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">
                $
              </span>
              <input
                type="number"
                name="amount"
                value={values.amount}
                onChange={handleChange}
                placeholder="0.00"
                min="0.01"
                step="0.01"
                className="w-full pl-7 pr-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 bg-gray-50 transition-colors"
              />
            </div>
            {errors.amount && (
              <p className="mt-1 text-xs text-red-500">{errors.amount}</p>
            )}
            <p className="mt-1 text-xs text-gray-400">
              Enter in dollars (e.g. 47.50)
            </p>
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
              Category *
            </label>
            <div className="grid grid-cols-4 gap-2">
              {ALL_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    // Simulate a change event for the handleChange flow
                    const syntheticEvent = {
                      target: { name: "category", value: cat },
                    } as React.ChangeEvent<HTMLSelectElement>;
                    handleChange(syntheticEvent);
                  }}
                  className={`flex flex-col items-center gap-1 p-2 rounded-xl border text-xs font-medium transition-all ${
                    values.category === cat
                      ? "border-indigo-400 bg-indigo-50 text-indigo-700 ring-1 ring-indigo-300"
                      : "border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300 hover:bg-gray-100"
                  }`}
                >
                  <span className="text-lg">{getCategoryEmoji(cat)}</span>
                  <span className="text-xs capitalize">{cat}</span>
                </button>
              ))}
            </div>
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
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 bg-gray-50 transition-colors"
            />
            {errors.date && (
              <p className="mt-1 text-xs text-red-500">{errors.date}</p>
            )}
          </div>

          {/* Note */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
              Note{" "}
              <span className="text-gray-400 normal-case font-normal">
                (optional)
              </span>
            </label>
            <textarea
              name="note"
              value={values.note}
              onChange={handleChange}
              placeholder="Any additional details about this expense..."
              rows={3}
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 bg-gray-50 resize-none transition-colors"
            />
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 pt-1">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 py-3 text-sm font-semibold text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => handleSubmit(onSubmit)}
            disabled={isSubmitting || success}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <PlusCircle className="w-4 h-4" />
            )}
            {isSubmitting ? "Adding..." : "Add Expense"}
          </button>
        </div>
      </div>

      {/* Quick-add tip */}
      <div className="bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-3">
        <p className="text-xs text-indigo-600">
          💡 <strong>Tip:</strong> Enter the dollar amount (e.g. 47.50). It will
          be stored accurately as cents internally.
        </p>
      </div>
    </div>
  );
}
