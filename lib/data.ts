// ============================================================
// lib/data.ts — In-memory data store (no database needed)
// All amounts are in CENTS (integer). $1.00 = 100 cents.
// ============================================================

import { Expense, MonthlyBudget } from "@/types/expense";

// --------------- Expenses Store ---------------
// These are the "live" arrays that API routes read/write.
// They reset every time the Next.js dev server restarts.

export const expenses: Expense[] = [
  {
    id: "exp-001",
    title: "Grocery shopping",
    amount: 4750, // $47.50
    category: "food",
    date: "2025-01-05",
    note: "Weekly groceries from Walmart",
    createdAt: "2025-01-05T09:00:00.000Z",
  },
  {
    id: "exp-002",
    title: "Monthly rent",
    amount: 120000, // $1,200.00
    category: "housing",
    date: "2025-01-01",
    note: "January rent",
    createdAt: "2025-01-01T08:00:00.000Z",
  },
  {
    id: "exp-003",
    title: "Uber ride to airport",
    amount: 3200, // $32.00
    category: "transport",
    date: "2025-01-10",
    createdAt: "2025-01-10T14:30:00.000Z",
  },
  {
    id: "exp-004",
    title: "Netflix subscription",
    amount: 1599, // $15.99
    category: "entertainment",
    date: "2025-01-12",
    createdAt: "2025-01-12T10:00:00.000Z",
  },
  {
    id: "exp-005",
    title: "Online course — React Advanced",
    amount: 9999, // $99.99
    category: "education",
    date: "2025-01-15",
    note: "Udemy course",
    createdAt: "2025-01-15T11:00:00.000Z",
  },
  {
    id: "exp-006",
    title: "Doctor visit co-pay",
    amount: 2500, // $25.00
    category: "health",
    date: "2025-01-18",
    createdAt: "2025-01-18T15:00:00.000Z",
  },
  {
    id: "exp-007",
    title: "New running shoes",
    amount: 8999, // $89.99
    category: "shopping",
    date: "2025-01-20",
    note: "Nike Air Zoom",
    createdAt: "2025-01-20T13:00:00.000Z",
  },
  {
    id: "exp-008",
    title: "Coffee and lunch",
    amount: 1850, // $18.50
    category: "food",
    date: "2025-01-22",
    createdAt: "2025-01-22T12:30:00.000Z",
  },
  {
    id: "exp-009",
    title: "Bus pass",
    amount: 5500, // $55.00
    category: "transport",
    date: "2025-01-02",
    note: "Monthly bus pass",
    createdAt: "2025-01-02T08:00:00.000Z",
  },
  {
    id: "exp-010",
    title: "Electricity bill",
    amount: 8700, // $87.00
    category: "housing",
    date: "2025-01-25",
    createdAt: "2025-01-25T09:00:00.000Z",
  },
];

// --------------- Budgets Store ---------------
export const budgets: MonthlyBudget[] = [
  { month: "2025-01", amount: 300000 }, // $3,000.00 budget for January
  { month: "2024-12", amount: 280000 }, // $2,800.00 budget for December
];

// --------------- Helper Functions ---------------
// These are used by the API routes to read/write data.

/** Find a single expense by id */
export function findExpenseById(id: string): Expense | undefined {
  return expenses.find((e) => e.id === id);
}

/** Remove an expense by id. Returns true if found and removed. */
export function removeExpenseById(id: string): boolean {
  const index = expenses.findIndex((e) => e.id === id);
  if (index === -1) return false;
  expenses.splice(index, 1);
  return true;
}

/** Find budget for a specific month */
export function findBudgetByMonth(month: string): MonthlyBudget | undefined {
  return budgets.find((b) => b.month === month);
}

/** Upsert (create or replace) a budget for a month */
export function upsertBudget(month: string, amount: number): MonthlyBudget {
  const existing = budgets.findIndex((b) => b.month === month);
  const updated: MonthlyBudget = { month, amount };
  if (existing !== -1) {
    budgets[existing] = updated;
  } else {
    budgets.push(updated);
  }
  return updated;
}
