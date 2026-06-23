// ============================================================
// app/expenses/[id]/page.tsx — Expense detail (Server Component)
// Fetches a single expense by id and renders its details.
// ============================================================

import { Expense } from "@/types/expense";
import { notFound } from "next/navigation";
import { ExpenseDetailClient } from "./ExpenseDetailClient";

interface ExpenseDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ExpenseDetailPage({
  params,
}: ExpenseDetailPageProps) {
  const { id } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  let expense: Expense | null = null;

  try {
    const res = await fetch(`${baseUrl}/api/expenses/${id}`, {
      cache: "no-store",
    });
    if (res.status === 404) {
      notFound();
    }
    if (res.ok) {
      expense = (await res.json()) as Expense;
    }
  } catch {
    notFound();
  }

  if (!expense) notFound();

  return <ExpenseDetailClient expense={expense} />;
}
