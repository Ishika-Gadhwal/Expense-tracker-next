"use client";

// ============================================================
// components/Navbar.tsx
// Persistent top navigation: App name, page links, currency
// switcher dropdown on the right.
// ============================================================

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCurrency } from "@/context/CurrencyContext";
import { SupportedCurrency } from "@/types/expense";
import { cn } from "@/lib/utils";
import { Wallet, LayoutDashboard, List, PlusCircle, PiggyBank } from "lucide-react";

const NAV_LINKS = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/expenses", label: "Expenses", icon: List },
  { href: "/add", label: "Add Expense", icon: PlusCircle },
  { href: "/budget", label: "Budget", icon: PiggyBank },
];

const CURRENCIES: SupportedCurrency[] = ["USD", "EUR", "GBP", "INR"];

export function Navbar() {
  const pathname = usePathname();
  const { currency, setCurrency } = useCurrency();

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center h-14">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-2 mr-6">
            <div className="w-7 h-7 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Wallet className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-gray-900 text-sm hidden sm:inline">
              ExpenseTracker
            </span>
          </Link>

          {/* Nav links */}
          <nav className="flex items-center gap-1 flex-1">
            {NAV_LINKS.map(({ href, label, icon: Icon }) => {
              // Active if exact match for "/" or startsWith for sub-routes
              const isActive =
                href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(href);

              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-indigo-50 text-indigo-700"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  )}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Currency switcher */}
          <div className="ml-auto">
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value as SupportedCurrency)}
              className="text-sm border border-gray-200 rounded-lg px-2 py-1.5 bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 cursor-pointer"
              aria-label="Select currency"
            >
              {CURRENCIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </header>
  );
}
