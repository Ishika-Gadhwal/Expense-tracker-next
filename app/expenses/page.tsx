// ============================================================
// app/expenses/page.tsx — Full expense list (Server Component)
// Imports data directly — no HTTP fetch needed
// ============================================================

import { expenses } from "@/lib/data";
import { Expense } from "@/types/expense";
import { ExpensesListClient } from "./ExpensesListClient";

export default async function ExpensesPage() {
  const allExpenses: Expense[] = [...expenses];

  return <ExpensesListClient initialExpenses={allExpenses} />;
}