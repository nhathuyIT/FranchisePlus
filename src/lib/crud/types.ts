import { z } from "zod";
import type { UseFormReturn, FieldValues } from "react-hook-form";

/**
 * CRUD operation modes
 */
export type CrudMode = "create" | "update" | "view" | "delete";

/**
 * Field types supported by the CRUD template
 */
export type FieldType =
  | "text"
  | "textarea"
  | "number"
  | "select"
  | "multiselect"
  | "date"
  | "datetime"
  | "image-upload"
  | "file-upload"
  | "checkbox"
  | "radio"
  | "switch"
  | "custom";

/**
 * Field configuration for a single form field
 */
export interface FieldConfig<TFormData extends FieldValues = any> {
  name: keyof TFormData extends string ? keyof TFormData : string;
  type: FieldType;
  label: string;
  placeholder?: string;
  description?: string;
  required?: boolean;
  disabled?: boolean | ((form: UseFormReturn<TFormData>) => boolean);
  hidden?: boolean | ((form: UseFormReturn<TFormData>) => boolean);

  // Type-specific options
  options?: Array<{ label: string; value: string | number | boolean }>;
  accept?: string; // For file uploads
  min?: number;
  max?: number;
  rows?: number; // For textarea

  // Custom render function (for "custom" type)
  render?: (props: {
    field: any;
    form: UseFormReturn<TFormData>;
    error?: string;
  }) => React.ReactNode;

  // Async validation
  asyncValidation?: {
    validator: (value: any) => Promise<boolean>;
    errorMessage: string;
    debounceMs?: number;
  };
}

/**
 * CRUD configuration for an entity
 */
export interface CrudConfig<TEntity = any, TFormData extends FieldValues = any> {
  // Entity metadata
  entityName: string; // "Franchise", "Inventory"
  entityNamePlural: string; // "Franchises", "Inventory Items"

  // Form configuration
  fields: FieldConfig<TFormData>[];
  schema: z.ZodType<TFormData>;

  // API endpoints (can be functions for flexibility)
  api: {
    list?: () => Promise<TEntity[]>;
    get?: (id: string | number) => Promise<TEntity>;
    create?: (data: TFormData) => Promise<TEntity>;
    update?: (id: string | number, data: TFormData) => Promise<TEntity>;
    delete?: (id: string | number) => Promise<void>;
    bulkDelete?: (ids: (string | number)[]) => Promise<void>;
  };

  // Dialog behavior
  dialog?: {
    createTitle?: string; // Defaults to "Create {entityName}"
    updateTitle?: string; // Defaults to "Update {entityName}"
    viewTitle?: string; // Defaults to "View {entityName}"
    deleteTitle?: string; // Defaults to "Delete {entityName}"
    deleteMessage?: string | ((entity: TEntity) => string);
    size?: "sm" | "md" | "lg" | "xl" | "full";
    nestedDelete?: boolean; // Allow delete confirmation inside edit dialog?
  };

  // Callbacks
  onSuccess?: {
    create?: (entity: TEntity) => void;
    update?: (entity: TEntity) => void;
    delete?: (id: string | number) => void;
  };

  // Custom transformations
  transform?: {
    toForm?: (entity: TEntity) => TFormData; // DB → Form
    fromForm?: (formData: TFormData) => Partial<TEntity>; // Form → DB
  };

  // Feature flags
  features?: {
    create?: boolean;
    update?: boolean;
    delete?: boolean;
    view?: boolean;
    bulkDelete?: boolean;
  };
}

/**
 * Dialog state management
 */
export interface CrudDialogState<TEntity = any> {
  isOpen: boolean;
  mode: CrudMode | null;
  entity: TEntity | null;
}

/**
 * Hook return types
 */
export interface UseCrudDialogReturn<TEntity = any> {
  state: CrudDialogState<TEntity>;
  openCreate: () => void;
  openUpdate: (entity: TEntity) => void;
  openView: (entity: TEntity) => void;
  openDelete: (entity: TEntity) => void;
  close: () => void;
}

export interface UseCrudFormReturn<TFormData extends FieldValues = any> {
  form: UseFormReturn<TFormData>;
  isSubmitting: boolean;
  onSubmit: (data: TFormData) => Promise<void>;
}

export interface UseCrudMutationReturn {
  isSubmitting: boolean;
  handleSubmit: (data: any) => Promise<void>;
  handleDelete: () => Promise<void>;
}
