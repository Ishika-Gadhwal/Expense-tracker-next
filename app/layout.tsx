// ============================================================
// app/layout.tsx — Root layout (Server Component)
// Wraps the entire app in Redux + CurrencyContext providers
// and renders the persistent Navbar.
// ============================================================

import type { Metadata } from "next";

import { Providers } from "@/components/Providers";
import { Navbar } from "@/components/Navbar";
import "./globals.css";



export const metadata: Metadata = {
  title: "ExpenseTracker — Personal Finance",
  description: "Log, categorize, and analyze your personal expenses",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`bg-gray-50 min-h-screen`}>
        <Providers>
          {/* Persistent top navigation */}
          <Navbar />
          {/* Page content */}
          <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
