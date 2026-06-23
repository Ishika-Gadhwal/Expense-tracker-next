"use client";

// ============================================================
// components/ExpenseCard.tsx — Single expense display card
// Left border color-coded by category.
// Edit/Delete actions in a dropdown menu.
// ============================================================

import { useState, type KeyboardEvent, type MouseEvent } from "react";
import { Expense } from "@/types/expense";
import { useCurrency } from "@/context/CurrencyContext";
import { CategoryBadge } from "./CategoryBadge";
import {
  getCategoryBorderColor,
  formatDate,
  cn,
} from "@/lib/utils";
import { MoreVertical, Pencil, Trash2, FileText } from "lucide-react";

interface ExpenseCardProps {
  expense: Expense;
  onView?: (expense: Expense) => void;
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
  className?: string;
}

export function ExpenseCard({
  expense,
  onView,
  onEdit,
  onDelete,
  className,
}: ExpenseCardProps) {
  const { formatAmount } = useCurrency();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const borderColor = getCategoryBorderColor(expense.category);

  function handleDeleteClick() {
    setMenuOpen(false);
    setShowDeleteConfirm(true);
  }

  function handleConfirmDelete() {
    onDelete(expense.id);
    setShowDeleteConfirm(false);
  }

  function handleCardClick() {
    onView?.(expense);
  }

  function handleCardKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (!onView) return;
    if (event.target !== event.currentTarget) return;

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onView(expense);
    }
  }

  function stopCardNavigation(event: MouseEvent<HTMLElement>) {
    event.stopPropagation();
  }

  return (
    <div
      role={onView ? "link" : undefined}
      tabIndex={onView ? 0 : undefined}
      aria-label={onView ? `View details for ${expense.title}` : undefined}
      onClick={handleCardClick}
      onKeyDown={handleCardKeyDown}
      className={cn(
        "bg-white rounded-xl border border-gray-100 shadow-sm",
        "border-l-4",
        borderColor,
        "hover:shadow-md transition-all duration-200 group",
        onView && "cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2",
        className
      )}
    >
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          {/* Left side: title, category, note */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold text-gray-900 text-sm leading-tight">
                {expense.title}
              </h3>
            </div>
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              <CategoryBadge category={expense.category} size="sm" />
              <span className="text-xs text-gray-400">
                {formatDate(expense.date)}
              </span>
            </div>
            {expense.note && (
              <div className="flex items-start gap-1 mt-1.5">
                <FileText className="w-3 h-3 text-gray-400 mt-0.5 shrink-0" />
                <p className="text-xs text-gray-500 line-clamp-1">
                  {expense.note}
                </p>
              </div>
            )}
          </div>

          {/* Right side: amount + dropdown */}
          <div className="flex items-start gap-2 shrink-0">
            <span className="text-base font-bold text-gray-900">
              {formatAmount(expense.amount)}
            </span>

            {/* Dropdown menu */}
            <div className="relative">
              <button
                onClick={(event) => {
                  stopCardNavigation(event);
                  setMenuOpen((v) => !v);
                }}
                className={cn(
                  "p-1 rounded-lg text-gray-400 hover:text-gray-700",
                  "hover:bg-gray-100 transition-colors",
                  "opacity-0 group-hover:opacity-100 focus:opacity-100"
                )}
                aria-label="More actions"
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {menuOpen && (
                <>
                  {/* Click-outside overlay */}
                  <div
                    className="fixed inset-0 z-10"
                    onClick={(event) => {
                      stopCardNavigation(event);
                      setMenuOpen(false);
                    }}
                  />
                  <div
                    className="absolute right-0 top-7 z-20 bg-white border border-gray-200 rounded-xl shadow-lg py-1 min-w-[140px]"
                    onClick={stopCardNavigation}
                  >
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        onEdit(expense);
                      }}
                      className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                      Edit
                    </button>
                    <button
                      onClick={handleDeleteClick}
                      className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Inline delete confirmation */}
      {showDeleteConfirm && (
        <div
          className="px-4 pb-4 border-t border-gray-100 pt-3"
          onClick={stopCardNavigation}
        >
          <p className="text-xs text-gray-600 mb-2">
            Delete &quot;{expense.title}&quot;? This cannot be undone.
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleConfirmDelete}
              className="flex-1 py-1.5 text-xs font-medium bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Delete
            </button>
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="flex-1 py-1.5 text-xs font-medium bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
