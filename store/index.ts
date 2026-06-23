// ============================================================
// store/index.ts — Redux store setup
// ============================================================

import { configureStore } from "@reduxjs/toolkit";
import expenseReducer from "./expenseSlice";
import budgetReducer from "./budgetSlice";

export const store = configureStore({
  reducer: {
    expenses: expenseReducer,
    budgets: budgetReducer,
  },
});

// TypeScript types for the store — used throughout the app
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
