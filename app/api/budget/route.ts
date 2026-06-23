// ============================================================
// app/api/budget/route.ts — GET and POST monthly budget
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { findBudgetByMonth, upsertBudget } from "@/lib/data";

// -------------------- GET /api/budget --------------------
// Query param: ?month=YYYY-MM
// Returns the budget for that month, or { month, amount: 0 } if not set.
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const month = searchParams.get("month");

  if (!month) {
    return NextResponse.json(
      { error: "month query parameter is required (YYYY-MM)" },
      { status: 400 }
    );
  }

  // Validate YYYY-MM format
  if (!/^\d{4}-\d{2}$/.test(month)) {
    return NextResponse.json(
      { error: "month must be in YYYY-MM format" },
      { status: 400 }
    );
  }

  const budget = findBudgetByMonth(month);

  // If no budget set for this month, return 0
  return NextResponse.json(budget ?? { month, amount: 0 });
}

// -------------------- POST /api/budget --------------------
// Body: { month: string, amount: number }
// Creates or replaces the budget for that month.
export async function POST(request: NextRequest) {
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

  // Validate month
  if (
    !data.month ||
    typeof data.month !== "string" ||
    !/^\d{4}-\d{2}$/.test(data.month)
  ) {
    return NextResponse.json(
      { error: "month is required and must be in YYYY-MM format" },
      { status: 400 }
    );
  }

  // Validate amount: must be a non-negative integer (cents)
  if (
    data.amount === undefined ||
    typeof data.amount !== "number" ||
    !Number.isInteger(data.amount) ||
    data.amount < 0
  ) {
    return NextResponse.json(
      { error: "amount must be a non-negative integer (in cents)" },
      { status: 400 }
    );
  }

  const updated = upsertBudget(data.month as string, data.amount as number);

  return NextResponse.json(updated, { status: 200 });
}
