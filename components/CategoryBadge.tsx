"use client";

// ============================================================
// components/CategoryBadge.tsx — Category pill badge
// ============================================================

import { ExpenseCategory } from "@/types/expense";
import { getCategoryBadgeColor, getCategoryEmoji, capitalize } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface CategoryBadgeProps {
  category: ExpenseCategory;
  size?: "sm" | "md";
  className?: string;
}

export function CategoryBadge({
  category,
  size = "md",
  className,
}: CategoryBadgeProps) {
  const colorClass = getCategoryBadgeColor(category);
  const emoji = getCategoryEmoji(category);

  const sizeClass =
    size === "sm"
      ? "text-xs px-2 py-0.5 gap-1"
      : "text-sm px-2.5 py-1 gap-1.5";

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-medium",
        colorClass,
        sizeClass,
        className
      )}
    >
      <span>{emoji}</span>
      <span>{capitalize(category)}</span>
    </span>
  );
}
