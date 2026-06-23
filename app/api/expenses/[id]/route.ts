// ============================================================
// app/api/expenses/[id]/route.ts — GET, PUT, DELETE single expense
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import {
  expenses,
  findExpenseById,
  removeExpenseById,
} from "@/lib/data";
import { ExpenseCategory } from "@/types/expense";
import { isValidDate, ALL_CATEGORIES } from "@/lib/utils";

// -------------------- GET /api/expenses/[id] --------------------
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const expense = findExpenseById(id);

  if (!expense) {
    return NextResponse.json({ error: "Expense not found" }, { status: 404 });
  }

  return NextResponse.json(expense);
}

// -------------------- PUT /api/expenses/[id] --------------------
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const existing = findExpenseById(id);

  if (!existing) {
    return NextResponse.json({ error: "Expense not found" }, { status: 404 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const data = body as Record<string, unknown>;

  // Validate fields only if they are present in the body (partial update)
  if (data.title !== undefined) {
    if (typeof data.title !== "string" || !data.title.trim()) {
      return NextResponse.json(
        { error: "Title must be a non-empty string" },
        { status: 400 }
      );
    }
  }

  if (data.amount !== undefined) {
    if (
      typeof data.amount !== "number" ||
      !Number.isInteger(data.amount) ||
      data.amount <= 0
    ) {
      return NextResponse.json(
        { error: "Amount must be a positive integer (in cents)" },
        { status: 400 }
      );
    }
  }

  if (data.date !== undefined) {
    if (typeof data.date !== "string" || !isValidDate(data.date)) {
      return NextResponse.json(
        { error: "Date must be a valid YYYY-MM-DD string" },
        { status: 400 }
      );
    }
  }

  if (data.category !== undefined) {
    if (
      typeof data.category !== "string" ||
      !ALL_CATEGORIES.includes(data.category as ExpenseCategory)
    ) {
      return NextResponse.json(
        { error: `Category must be one of: ${ALL_CATEGORIES.join(", ")}` },
        { status: 400 }
      );
    }
  }

  // Merge partial body with existing expense
  const updated = {
    ...existing,
    ...(data.title !== undefined && { title: (data.title as string).trim() }),
    ...(data.amount !== undefined && { amount: data.amount as number }),
    ...(data.category !== undefined && { category: data.category as ExpenseCategory }),
    ...(data.date !== undefined && { date: data.date as string }),
    ...(data.note !== undefined && { note: data.note as string }),
  };

  // Update in the in-memory array
  const index = expenses.findIndex((e) => e.id === id);
  if (index !== -1) {
    expenses[index] = updated;
  }

  return NextResponse.json(updated);
}

// -------------------- DELETE /api/expenses/[id] --------------------
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const removed = removeExpenseById(id);

  if (!removed) {
    return NextResponse.json({ error: "Expense not found" }, { status: 404 });
  }

  return NextResponse.json({ message: "Expense deleted" });
}
