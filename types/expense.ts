// ============================================================
// types/expense.ts — All TypeScript types for Expense Tracker
// ============================================================

export type ExpenseCategory =
  | "food"
  | "transport"
  | "housing"
  | "health"
  | "entertainment"
  | "education"
  | "shopping"
  | "other";

export interface Expense {
  id: string;
  title: string;
  amount: number; // stored in cents (e.g. $12.50 = 1250)
  category: ExpenseCategory;
  date: string; // ISO date string YYYY-MM-DD
  note?: string;
  createdAt: string; // full ISO timestamp
}

export interface MonthlyBudget {
  month: string; // "YYYY-MM"
  amount: number; // in cents
}

export interface ExpenseFilters {
  category: ExpenseCategory | "all";
  month: string; // "YYYY-MM" or "" for all months
  search: string;
  minAmount: number | null; // in cents
  maxAmount: number | null; // in cents
}

export interface ExpenseSummary {
  totalSpent: number; // sum of all expense amounts for a month (cents)
  totalBudget: number; // budget set for that month (cents)
  remaining: number; // totalBudget - totalSpent (cents)
  byCategory: Record<ExpenseCategory, number>; // per-category totals (cents)
}

// Redux state shapes — used in store slices
export interface ExpenseState {
  expenses: Expense[];
  filters: ExpenseFilters;
  selectedExpense: Expense | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

export interface BudgetState {
  budgets: MonthlyBudget[];
  status: "idle" | "loading" | "succeeded" | "failed";
}

// Currency context shape
export type SupportedCurrency = "USD" | "EUR" | "GBP" | "INR";

export interface CurrencyContextValue {
  currency: SupportedCurrency;
  currencySymbol: string;
  setCurrency: (c: SupportedCurrency) => void;
  formatAmount: (cents: number) => string; // divides by 100, formats with Intl
  locale: string;
}
