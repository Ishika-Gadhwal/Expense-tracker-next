// ============================================================
// store/expenseSlice.ts — Expense global state
// ============================================================

import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Expense, ExpenseFilters, ExpenseState } from "@/types/expense";

// Default filter values — all filters off
const defaultFilters: ExpenseFilters = {
  category: "all",
  month: "",
  search: "",
  minAmount: null,
  maxAmount: null,
};

const initialState: ExpenseState = {
  expenses: [],
  filters: defaultFilters,
  selectedExpense: null,
  status: "idle",
  error: null,
};

// -------------------- Async Thunks --------------------

/** Fetch all expenses from the API */
export const fetchExpenses = createAsyncThunk(
  "expenses/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch("/api/expenses", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch expenses");
      const data = (await res.json()) as Expense[];
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      return rejectWithValue(message);
    }
  }
);

/** Create a new expense via POST */
export const createExpense = createAsyncThunk(
  "expenses/create",
  async (
    payload: Omit<Expense, "id" | "createdAt">,
    { rejectWithValue }
  ) => {
    try {
      const res = await fetch("/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = (await res.json()) as { error: string };
        return rejectWithValue(err.error);
      }
      const data = (await res.json()) as Expense;
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      return rejectWithValue(message);
    }
  }
);

/** Update an existing expense via PUT */
export const editExpense = createAsyncThunk(
  "expenses/edit",
  async (
    payload: Partial<Expense> & { id: string },
    { rejectWithValue }
  ) => {
    try {
      const { id, ...rest } = payload;
      const res = await fetch(`/api/expenses/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(rest),
      });
      if (!res.ok) {
        const err = (await res.json()) as { error: string };
        return rejectWithValue(err.error);
      }
      const data = (await res.json()) as Expense;
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      return rejectWithValue(message);
    }
  }
);

/** Delete an expense by id via DELETE */
export const deleteExpense = createAsyncThunk(
  "expenses/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await fetch(`/api/expenses/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete expense");
      return id; // return the deleted id so we can remove it from state
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      return rejectWithValue(message);
    }
  }
);

// -------------------- Slice --------------------

const expenseSlice = createSlice({
  name: "expenses",
  initialState,
  reducers: {
    /** Replace the entire expenses array (e.g. after fetch) */
    setExpenses(state, action: PayloadAction<Expense[]>) {
      state.expenses = action.payload;
    },
    /** Add a single new expense to the front of the list */
    addExpense(state, action: PayloadAction<Expense>) {
      state.expenses.unshift(action.payload);
    },
    /** Update a single expense by id */
    updateExpense(state, action: PayloadAction<Expense>) {
      const index = state.expenses.findIndex((e) => e.id === action.payload.id);
      if (index !== -1) {
        state.expenses[index] = action.payload;
      }
    },
    /** Remove a single expense by id */
    removeExpense(state, action: PayloadAction<string>) {
      state.expenses = state.expenses.filter((e) => e.id !== action.payload);
    },
    /** Update one or more filter fields */
    setFilters(state, action: PayloadAction<Partial<ExpenseFilters>>) {
      state.filters = { ...state.filters, ...action.payload };
    },
    /** Reset all filters to their defaults */
    clearFilters(state) {
      state.filters = defaultFilters;
    },
    /** Set the currently viewed/selected expense */
    setSelectedExpense(state, action: PayloadAction<Expense | null>) {
      state.selectedExpense = action.payload;
    },
  },
  extraReducers: (builder) => {
    // fetchExpenses
    builder
      .addCase(fetchExpenses.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchExpenses.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.expenses = action.payload;
      })
      .addCase(fetchExpenses.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });

    // createExpense
    builder
      .addCase(createExpense.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createExpense.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.expenses.unshift(action.payload); // add new expense at top
      })
      .addCase(createExpense.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });

    // editExpense
    builder
      .addCase(editExpense.pending, (state) => {
        state.status = "loading";
      })
      .addCase(editExpense.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.expenses.findIndex(
          (e) => e.id === action.payload.id
        );
        if (index !== -1) {
          state.expenses[index] = action.payload;
        }
      })
      .addCase(editExpense.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });

    // deleteExpense
    builder
      .addCase(deleteExpense.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteExpense.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.expenses = state.expenses.filter((e) => e.id !== action.payload);
      })
      .addCase(deleteExpense.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export const {
  setExpenses,
  addExpense,
  updateExpense,
  removeExpense,
  setFilters,
  clearFilters,
  setSelectedExpense,
} = expenseSlice.actions;

export default expenseSlice.reducer;
