// ============================================================
// app/api/expenses/route.ts - GET all expenses, POST new expense
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { expenses } from "@/lib/data";
import { Expense, ExpenseCategory } from "@/types/expense";
import { isValidDate, ALL_CATEGORIES } from "@/lib/utils";

// -------------------- GET /api/expenses --------------------
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const category = searchParams.get("category");
  const month = searchParams.get("month");
  const search = searchParams.get("search");

  // Start with all expenses
  let result: Expense[] = [...expenses];

  // Filter by category if provided
  if (category && category !== "all") {
    result = result.filter((e) => e.category === category);
  }

  // Filter by month (YYYY-MM) - check if expense date starts with this month
  if (month) {
    result = result.filter((e) => e.date.startsWith(month));
  }

  // Filter by search keyword (case-insensitive on title and note)
  if (search) {
    const term = search.toLowerCase();
    result = result.filter(
      (e) =>
        e.title.toLowerCase().includes(term) ||
        (e.note && e.note.toLowerCase().includes(term))
    );
  }

  // Sort by date descending (most recent first)
  result.sort((a, b) => {
    if (b.date !== a.date) return b.date.localeCompare(a.date);
    // If same date, sort by createdAt descending
    return b.createdAt.localeCompare(a.createdAt);
  });

  return NextResponse.json(result);
}

// -------------------- POST /api/expenses --------------------
export async function POST(request: NextRequest) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  // Type guard: ensure body is a plain object
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const data = body as Record<string, unknown>;

  // --- Validation ---

  // title: must be a non-empty string
  if (!data.title || typeof data.title !== "string" || !data.title.trim()) {
    return NextResponse.json(
      { error: "Title is required and must be a non-empty string" },
      { status: 400 }
    );
  }

  // amount: must be a positive integer (cents)
  if (
    data.amount === undefined ||
    typeof data.amount !== "number" ||
    !Number.isInteger(data.amount) ||
    data.amount <= 0
  ) {
    return NextResponse.json(
      { error: "Amount must be a positive integer (in cents)" },
      { status: 400 }
    );
  }

  // date: must be a valid YYYY-MM-DD string
  if (
    !data.date ||
    typeof data.date !== "string" ||
    !isValidDate(data.date)
  ) {
    return NextResponse.json(
      { error: "Date must be a valid YYYY-MM-DD string" },
      { status: 400 }
    );
  }

  // category: must be one of the allowed values
  if (
    !data.category ||
    typeof data.category !== "string" ||
    !ALL_CATEGORIES.includes(data.category as ExpenseCategory)
  ) {
    return NextResponse.json(
      { error: `Category must be one of: ${ALL_CATEGORIES.join(", ")}` },
      { status: 400 }
    );
  }

  // note is optional - validate type if present
  if (data.note !== undefined && typeof data.note !== "string") {
    return NextResponse.json(
      { error: "Note must be a string" },
      { status: 400 }
    );
  }

  // --- Build new expense ---
  const newExpense: Expense = {
    id: crypto.randomUUID(),
    title: (data.title as string).trim(),
    amount: data.amount as number,
    category: data.category as ExpenseCategory,
    date: data.date as string,
    note: data.note ? (data.note as string).trim() : undefined,
    createdAt: new Date().toISOString(),
  };

  // Push to in-memory store
  expenses.push(newExpense);

  return NextResponse.json(newExpense, { status: 201 });
}
