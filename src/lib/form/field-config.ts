import type { UseFormReturn, FieldValues, Path } from "react-hook-form";

/**
 * Supported field types for FormDialog
 */
export type FieldType =
  | "text"
  | "textarea"
  | "number"
  | "select"
  | "async-select"
  | "multiselect"
  | "date"
  | "time"
  | "datetime"
  | "checkbox"
  | "switch"
  | "radio"
  | "image-upload"
  | "file-upload"
  | "custom";

/**
 * Select option type
 */
export interface SelectOption<TValue = string | number | boolean> {
  label: string;
  value: TValue;
  disabled?: boolean;
}

/**
 * Async options loader config for async-select field type
 */
export interface AsyncOptionsConfig<TFormData extends FieldValues> {
  /** Async function to load options */
  loader: (
    searchTerm: string,
    form: UseFormReturn<TFormData>
  ) => Promise<SelectOption[]>;
  /** Debounce delay in ms (default: 300) */
  debounceMs?: number;
  /** Minimum characters before loading (default: 0) */
  minChars?: number;
  /** Empty state text shown when async loader returns no options */
  emptyText?: string;
  /** Loading text shown while async loader is fetching options */
  loadingText?: string;
  /** Cache key for deduplication */
  cacheKey?: string;
}

/**
 * Props passed to custom field render function
 */
export interface CustomFieldRenderProps<TFormData extends FieldValues> {
  field: {
    value: unknown;
    onChange: (value: unknown) => void;
    onBlur: () => void;
    name: string;
    ref: React.Ref<unknown>;
  };
  form: UseFormReturn<TFormData>;
  fieldState: {
    error?: { message?: string };
    isTouched: boolean;
    isDirty: boolean;
  };
  disabled: boolean;
}

/**
 * Field configuration interface
 * Generic TFormData ensures type-safe field names
 */
export interface FieldConfig<TFormData extends FieldValues = FieldValues> {
  /** Field name - must be a valid path in TFormData */
  name: Path<TFormData>;
  /** Field type determines the rendered component */
  type: FieldType;
  /** Display label */
  label: string;
  /** Placeholder text */
  placeholder?: string;
  /** Help text below field */
  description?: string;
  /** Required indicator (visual only - validation via schema) */
  required?: boolean;
  /** Default value for this field */
  defaultValue?: TFormData[Path<TFormData>];

  /** Static disabled state or function of form state */
  disabled?: boolean | ((form: UseFormReturn<TFormData>) => boolean);
  /** Static hidden state or function of form state */
  hidden?: boolean | ((form: UseFormReturn<TFormData>) => boolean);

  // Type-specific options
  /** Options for select/radio/multiselect */
  options?: SelectOption[];
  /** Async options loader for async-select */
  asyncOptions?: AsyncOptionsConfig<TFormData>;
  /** File accept types */
  accept?: string;
  /** Number min value */
  min?: number;
  /** Number max value */
  max?: number;
  /** Number step */
  step?: number;
  /** Textarea rows */
  rows?: number;

  /** Custom render function for type="custom" */
  render?: (props: CustomFieldRenderProps<TFormData>) => React.ReactNode;

  /** Column span in grid layout (default: full) */
  colSpan?: 1 | 2;
  /** CSS class for field wrapper */
  className?: string;
}

/**
 * Helper type to extract form data type from a Zod schema
 */
export type InferFieldConfig<TFormData extends FieldValues> =
  FieldConfig<TFormData>;

/**
 * Helper to check if a value is a function (for disabled/hidden)
 */
export function isFieldFunction<TFormData extends FieldValues>(
  value: boolean | ((form: UseFormReturn<TFormData>) => boolean) | undefined
): value is (form: UseFormReturn<TFormData>) => boolean {
  return typeof value === "function";
}

/**
 * Evaluate disabled/hidden state
 */
export function evaluateFieldState<TFormData extends FieldValues>(
  value: boolean | ((form: UseFormReturn<TFormData>) => boolean) | undefined,
  form: UseFormReturn<TFormData>
): boolean {
  if (value === undefined) return false;
  if (isFieldFunction(value)) return value(form);
  return value;
}
