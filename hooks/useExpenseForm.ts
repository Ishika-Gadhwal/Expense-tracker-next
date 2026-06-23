// ============================================================
// hooks/useExpenseForm.ts
// Manages form state for creating/editing an expense.
// Returns values, errors, handlers, and reset function.
// ============================================================

import { ChangeEvent, useCallback, useState } from "react";
import { Expense, ExpenseCategory } from "@/types/expense";
import { ALL_CATEGORIES, isValidDate } from "@/lib/utils";

// The shape of form values (all strings so inputs stay controlled)
interface FormValues {
  title: string;
  amount: string; // user types in dollars, we convert to cents on submit
  category: ExpenseCategory;
  date: string; // YYYY-MM-DD
  note: string;
}

// Error messages for each field
interface FormErrors {
  title?: string;
  amount?: string;
  category?: string;
  date?: string;
}

interface UseExpenseFormReturn {
  values: FormValues;
  errors: FormErrors;
  handleChange: (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => void;
  handleSubmit: (
    onSubmit: (data: Omit<Expense, "id" | "createdAt">) => void
  ) => void;
  reset: () => void;
  setFieldValue: (field: keyof FormValues, value: string) => void;
}

const DEFAULT_VALUES: FormValues = {
  title: "",
  amount: "",
  category: "food",
  date: new Date().toISOString().split("T")[0], // today in YYYY-MM-DD
  note: "",
};

/**
 * @param initialValues — pre-fill form when editing an existing expense.
 *   Amount should be passed in CENTS; this hook converts to display dollars.
 */
export function useExpenseForm(
  initialValues?: Partial<Expense>
): UseExpenseFormReturn {
  // Convert initial amount from cents to a dollar string for display
  const getInitialValues = (): FormValues => {
    if (!initialValues) return DEFAULT_VALUES;
    return {
      title: initialValues.title ?? "",
      // Convert cents to decimal string (e.g. 4750 → "47.50")
      amount: initialValues.amount
        ? (initialValues.amount / 100).toFixed(2)
        : "",
      category: initialValues.category ?? "food",
      date: initialValues.date ?? DEFAULT_VALUES.date,
      note: initialValues.note ?? "",
    };
  };

  const [values, setValues] = useState<FormValues>(getInitialValues());
  const [errors, setErrors] = useState<FormErrors>({});

  /** Handle any input/select/textarea change */
  const handleChange = useCallback(
    (
      e: ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >
    ) => {
      const { name, value } = e.target;
      setValues((prev) => ({ ...prev, [name]: value }));
      // Clear the error for this field as user types
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    },
    []
  );

  /** Set a single field value programmatically */
  const setFieldValue = useCallback((field: keyof FormValues, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  }, []);

  /** Validate all fields. Returns true if valid. */
  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!values.title.trim()) {
      newErrors.title = "Title is required";
    }

    const parsedAmount = parseFloat(values.amount);
    if (!values.amount || isNaN(parsedAmount) || parsedAmount <= 0) {
      newErrors.amount = "Amount must be a positive number";
    }

    if (!isValidDate(values.date)) {
      newErrors.date = "Please enter a valid date (YYYY-MM-DD)";
    }

    if (!ALL_CATEGORIES.includes(values.category)) {
      newErrors.category = "Please select a valid category";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle form submission with validation.
   * Calls onSubmit with the validated data (amount converted to cents).
   */
  const handleSubmit = useCallback(
    (onSubmit: (data: Omit<Expense, "id" | "createdAt">) => void) => {
      if (!validate()) return;

      // Convert dollar amount string to integer cents
      // e.g. "47.50" → 4750, "47" → 4700
      const cents = Math.round(parseFloat(values.amount) * 100);

      onSubmit({
        title: values.title.trim(),
        amount: cents,
        category: values.category,
        date: values.date,
        note: values.note.trim() || undefined,
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [values]
  );

  /** Reset form to default (empty) state */
  const reset = useCallback(() => {
    setValues(DEFAULT_VALUES);
    setErrors({});
  }, []);

  return { values, errors, handleChange, handleSubmit, reset, setFieldValue };
}
