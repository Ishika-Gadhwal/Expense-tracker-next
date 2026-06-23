"use client";

// ============================================================
// components/SummaryCard.tsx — Metric summary card
// trend: "up" = red (more spending), "down" = green (less spending)
// ============================================================

import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface SummaryCardProps {
  label: string;
  value: string;
  subLabel?: string;
  trend?: "up" | "down" | "neutral";
  className?: string;
  icon?: React.ReactNode;
  accentColor?: string; // tailwind border color class e.g. "border-blue-500"
}

export function SummaryCard({
  label,
  value,
  subLabel,
  trend,
  className,
  icon,
  accentColor = "border-indigo-500",
}: SummaryCardProps) {
  // trend arrow colors: spending going up = red (bad), down = green (good)
  const trendIcon =
    trend === "up" ? (
      <TrendingUp className="w-4 h-4 text-red-500" />
    ) : trend === "down" ? (
      <TrendingDown className="w-4 h-4 text-emerald-500" />
    ) : trend === "neutral" ? (
      <Minus className="w-4 h-4 text-gray-400" />
    ) : null;

  return (
    <div
      className={cn(
        "bg-white rounded-2xl p-5 border border-gray-100 shadow-sm",
        "border-l-4",
        accentColor,
        "hover:shadow-md transition-shadow duration-200",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">
            {label}
          </p>
          <p className="text-2xl font-bold text-gray-900 leading-none mt-1">
            {value}
          </p>
          {subLabel && (
            <p className="text-xs text-gray-500 mt-1.5">{subLabel}</p>
          )}
        </div>
        <div className="flex flex-col items-end gap-1">
          {icon && (
            <div className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center text-gray-500">
              {icon}
            </div>
          )}
          {trendIcon && <div className="mt-1">{trendIcon}</div>}
        </div>
      </div>
    </div>
  );
}
