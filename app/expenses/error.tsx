"use client";

// ============================================================
// app/expenses/error.tsx — Error boundary for /expenses
// Client Component — receives error and reset() from Next.js.
// Shows a friendly message and a Retry button.
// ============================================================

import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ExpensesError({ error, reset }: ErrorPageProps) {
  // Log the error for debugging
  useEffect(() => {
    console.error("Expenses page error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center px-4">
      <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mb-4">
        <AlertTriangle className="w-8 h-8 text-red-500" />
      </div>
      <h2 className="text-lg font-bold text-gray-900 mb-2">
        Something went wrong
      </h2>
      <p className="text-sm text-gray-500 max-w-sm mb-6">
        We couldn&apos;t load your expenses. This might be a temporary issue.
        Please try again.
      </p>
      {/* Show error details in development */}
      {process.env.NODE_ENV === "development" && (
        <p className="text-xs text-red-400 bg-red-50 px-3 py-2 rounded-lg mb-4 max-w-sm break-all">
          {error.message}
        </p>
      )}
      <button
        onClick={reset}
        className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700 transition-colors shadow-sm"
      >
        <RefreshCw className="w-4 h-4" />
        Try again
      </button>
    </div>
  );
}
