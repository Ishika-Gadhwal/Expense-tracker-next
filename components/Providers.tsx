"use client";

// ============================================================
// components/Providers.tsx
// Client-side wrapper that provides Redux store + CurrencyContext.
// This is needed because app/layout.tsx is a Server Component,
// but providers need to be client components.
// ============================================================

import { Provider } from "react-redux";
import { store } from "@/store";
import { CurrencyProvider } from "@/context/CurrencyContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <CurrencyProvider>{children}</CurrencyProvider>
    </Provider>
  );
}
