// ============================================================
// app/expenses/page.tsx — Full expense list (Server Component)
// Fetches expenses server-side, passes to client for interactivity.
// ============================================================

import { Expense } from "@/types/expense";
import { ExpensesListClient } from "./ExpensesListClient";

export default async function ExpensesPage() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  let expenses: Expense[] = [];

  try {
    const res = await fetch(`${baseUrl}/api/expenses`, { cache: "no-store" });
    if (res.ok) {
      expenses = (await res.json()) as Expense[];
    }
  } catch {
    // Render with empty data; client can refetch
  }

  return <ExpensesListClient initialExpenses={expenses} />;
}
