import type {
  FieldValues,
  DefaultValues,
  UseFormReturn,
} from "react-hook-form";
import type { z } from "zod";
import type { FieldConfig } from "@/lib/form/field-config";

/**
 * Dialog mode - affects UI labels and behavior
 */
export type FormDialogMode = "create" | "edit" | "view" | "custom";

/**
 * Dialog size options
 */
export type DialogSize = "sm" | "md" | "lg" | "xl" | "full";

/**
 * Submit handler result
 */
export interface SubmitResult {
  success: boolean;
  /** Field-level errors to display */
  fieldErrors?: Record<string, string>;
  /** General error message */
  error?: string;
}

/**
 * FormDialog component props
 */
export interface FormDialogProps<TFormData extends FieldValues> {
  /** Dialog open state */
  open: boolean;
  /** Callback when dialog should close */
  onOpenChange: (open: boolean) => void;

  /** Dialog title */
  title: string;
  /** Optional description below title */
  description?: string;
  /** Dialog size (default: lg) */
  size?: DialogSize;

  /** Zod schema for validation */
  schema: z.ZodType<TFormData>;
  /** Field configurations */
  fields: FieldConfig<TFormData>[];

  /** Initial/default values */
  defaultValues?: DefaultValues<TFormData>;
  /** Values to reset to (for edit mode) */
  values?: TFormData;

  /** Current mode - affects submit button text and field states */
  mode?: FormDialogMode;

  /** Async submit handler */
  onSubmit: (data: TFormData) => Promise<SubmitResult | void>;
  /** Called after successful submit and dialog close */
  onSuccess?: () => void;

  /** Custom submit button text (overrides mode default) */
  submitText?: string;
  /** Custom cancel button text (default: "Cancel") */
  cancelText?: string;
  /** Hide cancel button */
  hideCancel?: boolean;

  /** Prevent closing on overlay click while submitting */
  preventCloseOnSubmit?: boolean;
  /** Close dialog on successful submit (default: true) */
  closeOnSuccess?: boolean;

  /** Render custom footer (replaces default buttons) */
  renderFooter?: (props: {
    form: UseFormReturn<TFormData>;
    isSubmitting: boolean;
    onCancel: () => void;
  }) => React.ReactNode;

  /** Grid columns for field layout (default: 1) */
  columns?: 1 | 2;
}

/**
 * Standalone form content props (for use without dialog)
 */
export interface FormContentProps<TFormData extends FieldValues> {
  /** Zod schema for validation */
  schema: z.ZodType<TFormData>;
  /** Field configurations */
  fields: FieldConfig<TFormData>[];
  /** Initial/default values */
  defaultValues?: DefaultValues<TFormData>;
  /** Values for edit mode */
  values?: TFormData;
  /** Current mode */
  mode?: FormDialogMode;
  /** Submit handler */
  onSubmit: (data: TFormData) => Promise<SubmitResult | void>;
  /** Grid columns (default: 1) */
  columns?: 1 | 2;
  /** Expose form instance to parent */
  formRef?: React.MutableRefObject<UseFormReturn<TFormData> | null>;
  /** Called when submit succeeds */
  onSuccess?: () => void;
  /** Children to render after fields */
  children?: React.ReactNode;
}

/**
 * useFormDialog hook return type
 */
export interface UseFormDialogReturn<TData = unknown> {
  /** Whether dialog is open */
  isOpen: boolean;
  /** Current dialog mode */
  mode: FormDialogMode;
  /** Data being edited (null for create mode) */
  data: TData | null;
  /** Open dialog in specified mode with optional data */
  open: (mode: FormDialogMode, data?: TData) => void;
  /** Shorthand to open in create mode */
  openCreate: () => void;
  /** Shorthand to open in edit mode */
  openEdit: (data: TData) => void;
  /** Shorthand to open in view mode */
  openView: (data: TData) => void;
  /** Close the dialog */
  close: () => void;
}

/**
 * useFormSubmit hook props
 */
export interface UseFormSubmitProps<TFormData extends FieldValues> {
  /** Form instance from useForm */
  form: UseFormReturn<TFormData>;
  /** Submit handler */
  onSubmit: (data: TFormData) => Promise<SubmitResult | void>;
  /** Called on successful submit */
  onSuccess?: () => void;
  /** Field label map for better error messages */
  fieldLabelMap?: Record<string, string>;
}

/**
 * useFormSubmit hook return type
 */
export interface UseFormSubmitReturn {
  /** Whether form is submitting */
  isSubmitting: boolean;
  /** General error message (not field-specific) */
  generalError: string | null;
  /** Submit handler to pass to form */
  handleSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  /** Clear general error */
  clearGeneralError: () => void;
}

/**
 * Form footer props
 */
export interface FormFooterProps {
  /** Whether form is in view mode */
  isViewMode: boolean;
  /** Whether form is submitting */
  isSubmitting: boolean;
  /** Submit button text */
  submitText: string;
  /** Cancel button text */
  cancelText: string;
  /** Hide cancel button */
  hideCancel?: boolean;
  /** Cancel handler */
  onCancel: () => void;
}

/**
 * Form error banner props
 */
export interface FormErrorBannerProps {
  /** General error message */
  error: string | null;
  /** Callback to dismiss error */
  onDismiss?: () => void;
}

/**
 * Dialog size to CSS class mapping
 */
export const dialogSizeClasses: Record<DialogSize, string> = {
  sm: "sm:max-w-sm",
  md: "sm:max-w-md",
  lg: "sm:max-w-lg",
  xl: "sm:max-w-xl",
  full: "sm:max-w-[90vw]",
};

/**
 * Default submit button text by mode
 */
export const defaultSubmitText: Record<FormDialogMode, string> = {
  create: "Create",
  edit: "Save Changes",
  view: "Close",
  custom: "Submit",
};
