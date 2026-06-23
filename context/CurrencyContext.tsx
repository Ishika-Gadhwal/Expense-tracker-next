"use client";

// ============================================================
// context/CurrencyContext.tsx — Currency & display preferences
// Persists selected currency to localStorage.
// All amounts must be passed in CENTS; formatAmount divides by 100.
// ============================================================

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { CurrencyContextValue, SupportedCurrency } from "@/types/expense";

// Map each currency to its locale for Intl.NumberFormat
const CURRENCY_LOCALE_MAP: Record<SupportedCurrency, string> = {
  USD: "en-US",
  EUR: "de-DE",
  GBP: "en-GB",
  INR: "en-IN",
};

const STORAGE_KEY = "expense_tracker_currency";

// Create the context with a default value (will be overridden by provider)
const CurrencyContext = createContext<CurrencyContextValue>({
  currency: "USD",
  currencySymbol: "$",
  setCurrency: () => {},
  formatAmount: (cents: number) => `$${(cents / 100).toFixed(2)}`,
  locale: "en-US",
});

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  // Read saved currency from localStorage on mount; default to USD
  const [currency, setCurrencyState] = useState<SupportedCurrency>("USD");

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as SupportedCurrency | null;
    if (saved && CURRENCY_LOCALE_MAP[saved]) {
      setCurrencyState(saved);
    }
  }, []);

  /** Update currency and persist to localStorage */
  const setCurrency = useCallback((c: SupportedCurrency) => {
    setCurrencyState(c);
    localStorage.setItem(STORAGE_KEY, c);
  }, []);

  const locale = CURRENCY_LOCALE_MAP[currency];
  const currencySymbol =
    new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      currencyDisplay: "narrowSymbol",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
      .formatToParts(0)
      .find((part) => part.type === "currency")?.value ?? currency;

  /**
   * Format a cents integer to a currency string.
   * e.g. formatAmount(4750) with USD → "$47.50"
   * e.g. formatAmount(4750) with INR → "₹47.50"
   */
  const formatAmount = useCallback(
    (cents: number): string => {
      const amount = cents / 100; // convert cents to decimal amount
      return new Intl.NumberFormat(locale, {
        style: "currency",
        currency: currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount);
    },
    [currency, locale]
  );

  return (
    <CurrencyContext.Provider
      value={{ currency, currencySymbol, setCurrency, formatAmount, locale }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

/** Hook to use currency context anywhere in the app */
export function useCurrency(): CurrencyContextValue {
  const ctx = useContext(CurrencyContext);
  if (!ctx) {
    throw new Error("useCurrency must be used inside CurrencyProvider");
  }
  return ctx;
}
