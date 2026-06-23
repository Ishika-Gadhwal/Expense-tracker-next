// ============================================================
// lib/utils.ts — Shared utility helpers
// ============================================================

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { ExpenseCategory } from "@/types/expense";

/** Merge Tailwind classes safely (used by shadcn pattern) */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Convert a YYYY-MM-DD date string to a human-readable format.
 * e.g. "2025-01-15" → "Jan 15, 2025"
 */
export function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/**
 * Get the current month in YYYY-MM format.
 * e.g. "2025-01"
 */
export function getCurrentMonth(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

/**
 * Validate that a string is a valid YYYY-MM-DD date.
 * Returns true if valid, false otherwise.
 */
export function isValidDate(dateStr: string): boolean {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateStr)) return false;
  const date = new Date(dateStr);
  return !isNaN(date.getTime());
}

/**
 * Get emoji icon for each expense category.
 */
export function getCategoryEmoji(category: ExpenseCategory): string {
  const map: Record<ExpenseCategory, string> = {
    food: "🍔",
    transport: "🚗",
    housing: "🏠",
    health: "💊",
    entertainment: "🎬",
    education: "📚",
    shopping: "🛍️",
    other: "📦",
  };
  return map[category];
}

/**
 * Get Tailwind border color class for each category.
 * Used by ExpenseCard for the left color border.
 */
export function getCategoryBorderColor(category: ExpenseCategory): string {
  const map: Record<ExpenseCategory, string> = {
    food: "border-l-orange-400",
    transport: "border-l-blue-400",
    housing: "border-l-purple-400",
    health: "border-l-red-400",
    entertainment: "border-l-pink-400",
    education: "border-l-yellow-400",
    shopping: "border-l-teal-400",
    other: "border-l-gray-400",
  };
  return map[category];
}

/**
 * Get Tailwind background color class for each category badge.
 */
export function getCategoryBadgeColor(category: ExpenseCategory): string {
  const map: Record<ExpenseCategory, string> = {
    food: "bg-orange-100 text-orange-700",
    transport: "bg-blue-100 text-blue-700",
    housing: "bg-purple-100 text-purple-700",
    health: "bg-red-100 text-red-700",
    entertainment: "bg-pink-100 text-pink-700",
    education: "bg-yellow-100 text-yellow-700",
    shopping: "bg-teal-100 text-teal-700",
    other: "bg-gray-100 text-gray-700",
  };
  return map[category];
}

/** All allowed categories as an array (useful for dropdowns) */
export const ALL_CATEGORIES: ExpenseCategory[] = [
  "food",
  "transport",
  "housing",
  "health",
  "entertainment",
  "education",
  "shopping",
  "other",
];

/** Capitalize the first letter of a string */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Get the number of days in a given YYYY-MM month.
 * Used by the dashboard to calculate average daily spending.
 */
export function getDaysInMonth(month: string): number {
  const [year, m] = month.split("-").map(Number);
  return new Date(year, m, 0).getDate();
}
