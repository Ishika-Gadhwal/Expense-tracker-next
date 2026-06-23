"use client";

// ============================================================
// components/charts/CategoryPieChart.tsx
// Donut chart showing spending breakdown by category.
// Uses recharts PieChart.
// ============================================================

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { ExpenseCategory } from "@/types/expense";
import { useCurrency } from "@/context/CurrencyContext";
import { getCategoryEmoji, capitalize } from "@/lib/utils";

// One color per category — matches the badge colors
const CATEGORY_COLORS: Record<ExpenseCategory, string> = {
  food: "#fb923c",
  transport: "#60a5fa",
  housing: "#a78bfa",
  health: "#f87171",
  entertainment: "#f472b6",
  education: "#fbbf24",
  shopping: "#2dd4bf",
  other: "#9ca3af",
};

interface PieChartEntry {
  category: ExpenseCategory;
  amount: number; // in cents
}

interface CategoryPieChartProps {
  data: PieChartEntry[];
}

// Custom tooltip shown on hover
function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; payload: PieChartEntry }>;
}) {
  const { formatAmount } = useCurrency();
  if (!active || !payload?.length) return null;

  const entry = payload[0];
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-lg px-3 py-2">
      <p className="text-sm font-semibold text-gray-800">
        {getCategoryEmoji(entry.payload.category)}{" "}
        {capitalize(entry.payload.category)}
      </p>
      <p className="text-sm text-gray-600">{formatAmount(entry.value)}</p>
    </div>
  );
}

export function CategoryPieChart({ data }: CategoryPieChartProps) {
  const { formatAmount } = useCurrency();

  // Filter out categories with 0 spending so the pie looks clean
  const chartData = data.filter((d) => d.amount > 0);

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-400 text-sm">
        No expenses to display
      </div>
    );
  }

  const total = chartData.reduce((sum, d) => sum + d.amount, 0);

  return (
    <div>
      {/* Total in center-ish area */}
      <p className="text-center text-xs text-gray-400 mb-2">
        Total:{" "}
        <span className="font-semibold text-gray-700">{formatAmount(total)}</span>
      </p>
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={chartData}
            dataKey="amount"
            nameKey="category"
            cx="50%"
            cy="50%"
            innerRadius={60} // donut shape
            outerRadius={95}
            paddingAngle={3}
          >
            {chartData.map((entry) => (
              <Cell
                key={entry.category}
                fill={CATEGORY_COLORS[entry.category]}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            formatter={(value) => {
              const cat = value as ExpenseCategory;
              const entry = chartData.find((d) => d.category === cat);
              return (
                <span className="text-xs text-gray-600">
                  {getCategoryEmoji(cat)} {capitalize(cat)}
                  {entry
                    ? ` (${((entry.amount / total) * 100).toFixed(0)}%)`
                    : ""}
                </span>
              );
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
