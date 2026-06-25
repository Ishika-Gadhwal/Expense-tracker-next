// ============================================================
// app/expenses/[id]/page.tsx — Expense detail (Server Component)
// Imports data directly — no HTTP fetch needed
// ============================================================

import { findExpenseById } from "@/lib/data";
import { notFound } from "next/navigation";
import { ExpenseDetailClient } from "./ExpenseDetailClient";

interface ExpenseDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ExpenseDetailPage({
  params,
}: ExpenseDetailPageProps) {
  const { id } = await params;

  const expense = findExpenseById(id);

  if (!expense) {
    notFound();
  }

  return <ExpenseDetailClient expense={expense} />;
}