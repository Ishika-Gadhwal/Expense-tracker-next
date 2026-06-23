# 💸 Expense Tracker — Next.js 14 Exam Project

A full-stack expense tracking application built with Next.js App Router, TypeScript, Redux Toolkit, Context API, Tailwind CSS, and Recharts.

## 🚀 Tech Stack

- **Next.js 14+** with App Router
- **TypeScript** strict mode (no `any`)
- **Redux Toolkit** + React-Redux
- **Context API** (CurrencyContext)
- **Tailwind CSS** with custom design
- **Recharts** (Pie chart + Bar chart)
- **In-memory data store** (no database needed)

## 📦 Setup

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

> **Note:** The middleware requires a `user_session` cookie to access `/expenses`, `/add`, and `/budget`. 
> In your browser DevTools → Application → Cookies, add:
> - Name: `user_session`  
> - Value: `demo-session`  
> - Domain: `localhost`

## 🗂 Project Structure

```
app/              # Next.js App Router pages + API routes
components/       # Reusable UI components (ExpenseCard, SummaryCard, etc.)
context/          # CurrencyContext (USD/EUR/GBP/INR + localStorage)
hooks/            # Custom hooks (useExpenseSummary, useFilteredExpenses, useExpenseForm)
lib/              # In-memory data store + utilities
store/            # Redux slices (expenseSlice, budgetSlice)
types/            # All TypeScript types/interfaces
middleware.ts     # Session cookie check + request logging
```

## ✅ Features

- **Dashboard** — 4 summary cards, category pie chart, daily bar chart, budget progress, recent expenses
- **Expense List** — full CRUD, filters (search/category/month/min-max amount), Redux-powered
- **Add/Edit Expense** — form validation, category picker, cents-based storage
- **Budget Management** — set monthly budgets, track spending vs budget with color-coded progress bars
- **Currency Switcher** — USD, EUR, GBP, INR (persisted to localStorage)
- **Middleware** — session cookie protection on /expenses, /add, /budget
- **Skeleton Loading** — shimmer skeletons on expenses list
- **Error Boundary** — friendly error + Retry on expenses page

## 🚀 Deployment (Vercel)

```bash
# Set environment variable in Vercel:
NEXT_PUBLIC_BASE_URL=https://your-app.vercel.app

# Deploy
vercel --prod
```

## 📋 API Routes

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/expenses` | Get all expenses (supports ?category, ?month, ?search) |
| POST | `/api/expenses` | Create new expense |
| GET | `/api/expenses/[id]` | Get single expense |
| PUT | `/api/expenses/[id]` | Update expense |
| DELETE | `/api/expenses/[id]` | Delete expense |
| GET | `/api/budget` | Get budget for month (?month=YYYY-MM) |
| POST | `/api/budget` | Set/update monthly budget |
