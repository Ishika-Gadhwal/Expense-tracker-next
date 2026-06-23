// ============================================================
// app/page.tsx — Dashboard (Server Component)
// Fetches expenses + current month budget from API.
// Passes data to Client Component charts.
// ============================================================

import { Expense, MonthlyBudget } from "@/types/expense";
import { DashboardClient } from "./DashboardClient";

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

  // Fetch all expenses (no-store = always fresh, no Next.js cache)
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  let expenses: Expense[] = [];
  let budget: MonthlyBudget = { month: currentMonth, amount: 0 };

  try {
    const [expensesRes, budgetRes] = await Promise.all([
      fetch(`${baseUrl}/api/expenses`, { cache: "no-store" }),
      fetch(`${baseUrl}/api/budget?month=${currentMonth}`, {
        cache: "no-store",
      }),
    ]);

    if (expensesRes.ok) {
      expenses = (await expensesRes.json()) as Expense[];
    }
    if (budgetRes.ok) {
      budget = (await budgetRes.json()) as MonthlyBudget;
    }
  } catch {
    // If API calls fail on cold start, client will fetch via Redux
  }

  const sessionError = params?.error === "session_required";

  return (
    <DashboardClient
      initialExpenses={expenses}
      initialBudget={budget}
      currentMonth={currentMonth}
      sessionError={sessionError}
    />
  );
}
