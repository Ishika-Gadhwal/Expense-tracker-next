// ============================================================
// store/budgetSlice.ts — Monthly budget global state
// ============================================================

import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BudgetState, MonthlyBudget } from "@/types/expense";

const initialState: BudgetState = {
  budgets: [],
  status: "idle",
};

// -------------------- Async Thunks --------------------

/** Fetch the budget for a specific month (YYYY-MM) */
export const fetchBudget = createAsyncThunk(
  "budgets/fetchBudget",
  async (month: string, { rejectWithValue }) => {
    try {
      const res = await fetch(`/api/budget?month=${month}`, {
        cache: "no-store",
      });
      if (!res.ok) throw new Error("Failed to fetch budget");
      const data = (await res.json()) as MonthlyBudget;
      return { month, amount: data.amount };
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      return rejectWithValue(message);
    }
  }
);

/** Set or update the budget for a specific month */
export const setBudget = createAsyncThunk(
  "budgets/setBudget",
  async (
    payload: { month: string; amount: number },
    { rejectWithValue }
  ) => {
    try {
      const res = await fetch("/api/budget", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to set budget");
      const data = (await res.json()) as MonthlyBudget;
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      return rejectWithValue(message);
    }
  }
);

// -------------------- Slice --------------------

const budgetSlice = createSlice({
  name: "budgets",
  initialState,
  reducers: {
    /** Directly set budgets (used when loading from API) */
    setBudgets(state, action: PayloadAction<MonthlyBudget[]>) {
      state.budgets = action.payload;
    },
    /** Upsert a single budget entry */
    upsertBudget(state, action: PayloadAction<MonthlyBudget>) {
      const index = state.budgets.findIndex(
        (b) => b.month === action.payload.month
      );
      if (index !== -1) {
        state.budgets[index] = action.payload;
      } else {
        state.budgets.push(action.payload);
      }
    },
  },
  extraReducers: (builder) => {
    // fetchBudget
    builder
      .addCase(fetchBudget.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchBudget.fulfilled, (state, action) => {
        state.status = "succeeded";
        // Upsert the fetched budget into the list
        const index = state.budgets.findIndex(
          (b) => b.month === action.payload.month
        );
        if (index !== -1) {
          state.budgets[index] = action.payload;
        } else {
          state.budgets.push(action.payload);
        }
      })
      .addCase(fetchBudget.rejected, (state) => {
        state.status = "failed";
      });

    // setBudget
    builder
      .addCase(setBudget.pending, (state) => {
        state.status = "loading";
      })
      .addCase(setBudget.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.budgets.findIndex(
          (b) => b.month === action.payload.month
        );
        if (index !== -1) {
          state.budgets[index] = action.payload;
        } else {
          state.budgets.push(action.payload);
        }
      })
      .addCase(setBudget.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export const { setBudgets, upsertBudget } = budgetSlice.actions;
export default budgetSlice.reducer;
