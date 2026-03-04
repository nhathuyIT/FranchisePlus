import * as React from "react";
import type { FieldValues, UseFormReturn } from "react-hook-form";
import type { FieldConfig, FieldType } from "@/lib/form/field-config";
import { evaluateFieldState } from "@/lib/form/field-config";

// Field components
import { TextField } from "./TextField";
import { TextareaField } from "./TextareaField";
import { NumberField } from "./NumberField";
import { SelectField } from "./SelectField";
import { AsyncSelectField } from "./AsyncSelectField";
import { MultiselectField } from "./MultiselectField";
import { CheckboxField } from "./CheckboxField";
import { SwitchField } from "./SwitchField";
import { RadioField } from "./RadioField";
import { DateField } from "./DateField";
import { TimeField } from "./TimeField";
import { DateTimeField } from "./DateTimeField";
import { ImageUploadField } from "./ImageUploadField";
import { FileUploadField } from "./FileUploadField";
import { CustomField } from "./CustomField";

// Re-export all field components
export { TextField } from "./TextField";
export { TextareaField } from "./TextareaField";
export { NumberField } from "./NumberField";
export { SelectField } from "./SelectField";
export { AsyncSelectField } from "./AsyncSelectField";
export { MultiselectField } from "./MultiselectField";
export { CheckboxField } from "./CheckboxField";
export { SwitchField } from "./SwitchField";
export { RadioField } from "./RadioField";
export { DateField } from "./DateField";
export { TimeField } from "./TimeField";
export { DateTimeField } from "./DateTimeField";
export { ImageUploadField } from "./ImageUploadField";
export { FileUploadField } from "./FileUploadField";
export { CustomField } from "./CustomField";

/**
 * Props for renderField function
 */
export interface RenderFieldProps<TFormData extends FieldValues> {
  config: FieldConfig<TFormData>;
  form: UseFormReturn<TFormData>;
  disabled?: boolean;
  /** Upload handler for image-upload fields */
  onImageUpload?: (file: File) => Promise<string>;
}

/**
 * Field component mapping by type
 */
const fieldComponentMap: Record<
  FieldType,
  React.ComponentType<{
    config: FieldConfig<FieldValues>;
    form: UseFormReturn<FieldValues>;
    disabled?: boolean;
    onUpload?: (file: File) => Promise<string>;
  }>
> = {
  text: TextField,
  textarea: TextareaField,
  number: NumberField,
  select: SelectField,
  "async-select": AsyncSelectField,
  multiselect: MultiselectField,
  checkbox: CheckboxField,
  switch: SwitchField,
  radio: RadioField,
  date: DateField,
  time: TimeField,
  datetime: DateTimeField,
  "image-upload": ImageUploadField,
  "file-upload": FileUploadField,
  custom: CustomField,
};

/**
 * Render a single form field based on its configuration
 *
 * @example
 * ```tsx
 * {fields.map((fieldConfig) => (
 *   <React.Fragment key={fieldConfig.name}>
 *     {renderField({
 *       config: fieldConfig,
 *       form,
 *       disabled: isViewMode,
 *     })}
 *   </React.Fragment>
 * ))}
 * ```
 */
export function renderField<TFormData extends FieldValues>({
  config,
  form,
  disabled = false,
  onImageUpload,
}: RenderFieldProps<TFormData>): React.ReactNode {
  // Check if field should be hidden
  const isHidden = evaluateFieldState(config.hidden, form);
  if (isHidden) {
    return null;
  }

  // Calculate disabled state
  const isFieldDisabled =
    disabled || evaluateFieldState(config.disabled, form);

  // Get the component for this field type
  const FieldComponent = fieldComponentMap[config.type];

  if (!FieldComponent) {
    console.warn(`Unknown field type: ${config.type}`);
    return null;
  }

  // Handle image-upload specially to pass onUpload prop
  if (config.type === "image-upload" && onImageUpload) {
    return (
      <ImageUploadField
        config={config as FieldConfig<FieldValues>}
        form={form as UseFormReturn<FieldValues>}
        disabled={isFieldDisabled}
        onUpload={onImageUpload}
      />
    );
  }

  return (
    <FieldComponent
      config={config as FieldConfig<FieldValues>}
      form={form as UseFormReturn<FieldValues>}
      disabled={isFieldDisabled}
    />
  );
}

/**
 * Helper to get column span class for grid layout
 */
export function getFieldColSpanClass(
  colSpan: 1 | 2 | undefined,
  columns: 1 | 2
): string {
  if (columns === 1) return "";
  if (colSpan === 2) return "col-span-2";
  return "";
}
