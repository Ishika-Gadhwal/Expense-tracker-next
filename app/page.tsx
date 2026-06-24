// ============================================================
// app/page.tsx — Dashboard (Server Component)
// Imports expenses + budget directly from data layer.
// No HTTP fetch needed — data is in-memory (lib/data.ts).
// ============================================================

import { MonthlyBudget } from "@/types/expense";
import { DashboardClient } from "./DashboardClient";
import { expenses, findBudgetByMonth } from "@/lib/data";

/** Get the current month in YYYY-MM (server-side safe) */
function getCurrentMonth(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const currentMonth = getCurrentMonth();

  // ✅ Import directly from data layer — no HTTP fetch, works on Vercel
  const allExpenses = [...expenses].sort((a, b) => {
    if (b.date !== a.date) return b.date.localeCompare(a.date);
    return b.createdAt.localeCompare(a.createdAt);
  });

  const budgetData = findBudgetByMonth(currentMonth);
  const budget: MonthlyBudget = budgetData ?? { month: currentMonth, amount: 0 };

  const sessionError = params?.error === "session_required";

  return (
    <DashboardClient
      initialExpenses={allExpenses}
      initialBudget={budget}
      currentMonth={currentMonth}
      sessionError={sessionError}
    />
  );
}
