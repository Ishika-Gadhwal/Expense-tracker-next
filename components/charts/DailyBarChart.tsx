"use client";

// ============================================================
// components/charts/DailyBarChart.tsx
// Bar chart showing daily spending for a given month.
// Uses recharts BarChart.
// ============================================================

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Expense } from "@/types/expense";
import { useCurrency } from "@/context/CurrencyContext";
import { getDaysInMonth } from "@/lib/utils";

interface DailyBarChartProps {
  expenses: Expense[];
  month: string; // YYYY-MM
}

// Custom tooltip
function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}) {
  const { formatAmount } = useCurrency();
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-lg px-3 py-2">
      <p className="text-xs font-semibold text-gray-700">Day {label}</p>
      <p className="text-sm font-bold text-indigo-600">
        {formatAmount(payload[0].value)}
      </p>
    </div>
  );
}

export function DailyBarChart({ expenses, month }: DailyBarChartProps) {
  const daysInMonth = getDaysInMonth(month);

  // Build an array of { day, amount } for every day in the month
  const dailyData = Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;
    const dayStr = `${month}-${String(day).padStart(2, "0")}`;

    // Sum all expenses on this day
    const total = expenses
      .filter((e) => e.date === dayStr)
      .reduce((sum, e) => sum + e.amount, 0);

    return { day: String(day), amount: total };
  });

  // Only show days that have actual spending (plus a few surrounding days)
  // For display we show all days but make the chart scrollable if needed
  const hasData = dailyData.some((d) => d.amount > 0);

  if (!hasData) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-400 text-sm">
        No expenses this month
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart
        data={dailyData}
        margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
        <XAxis
          dataKey="day"
          tick={{ fontSize: 10, fill: "#9ca3af" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tickFormatter={(v: number) => `$${(v / 100).toFixed(0)}`}
          tick={{ fontSize: 10, fill: "#9ca3af" }}
          axisLine={false}
          tickLine={false}
          width={40}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar
          dataKey="amount"
          fill="#818cf8"
          radius={[4, 4, 0, 0]}
          maxBarSize={20}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
