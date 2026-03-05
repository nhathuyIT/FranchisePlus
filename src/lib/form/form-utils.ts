import type { FieldValues, DefaultValues } from "react-hook-form";
import type { FieldConfig } from "./field-config";

/**
 * Extract default values from field configurations
 * Returns an object with field names as keys and their defaultValue as values
 */
export function getDefaultValues<TFormData extends FieldValues>(
  fields: FieldConfig<TFormData>[]
): DefaultValues<TFormData> {
  const defaults: Record<string, unknown> = {};

  fields.forEach((field) => {
    if (field.defaultValue !== undefined) {
      defaults[field.name] = field.defaultValue;
    } else {
      // Set sensible defaults based on field type
      switch (field.type) {
        case "checkbox":
        case "switch":
          defaults[field.name] = false;
          break;
        case "multiselect":
          defaults[field.name] = [];
          break;
        case "number":
          defaults[field.name] = undefined;
          break;
        default:
          defaults[field.name] = "";
          break;
      }
    }
  });

  return defaults as DefaultValues<TFormData>;
}

/**
 * Merge provided values with default values
 * Useful for edit mode where some fields might be missing
 */
export function mergeWithDefaults<TFormData extends FieldValues>(
  values: Partial<TFormData> | undefined,
  defaults: DefaultValues<TFormData>
): DefaultValues<TFormData> {
  if (!values) return defaults;

  const merged: Record<string, unknown> = { ...defaults };

  Object.entries(values).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      merged[key] = value;
    }
  });

  return merged as DefaultValues<TFormData>;
}

/**
 * Build a map of field names to their labels
 * Useful for displaying user-friendly field names in error messages
 */
export function buildFieldLabelMap<TFormData extends FieldValues>(
  fields: FieldConfig<TFormData>[]
): Record<string, string> {
  const labelMap: Record<string, string> = {};

  fields.forEach((field) => {
    labelMap[field.name] = field.label;
  });

  return labelMap;
}

/**
 * Filter fields based on visibility
 * Returns only fields that should be visible
 */
export function getVisibleFields<TFormData extends FieldValues>(
  fields: FieldConfig<TFormData>[],
  evaluateHidden: (
    hidden: FieldConfig<TFormData>["hidden"]
  ) => boolean
): FieldConfig<TFormData>[] {
  return fields.filter((field) => !evaluateHidden(field.hidden));
}

/**
 * Get required field names from field configs
 * Note: This is for UI indication only - actual validation is done by Zod schema
 */
export function getRequiredFieldNames<TFormData extends FieldValues>(
  fields: FieldConfig<TFormData>[]
): string[] {
  return fields
    .filter((field) => field.required)
    .map((field) => field.name);
}

/**
 * Transform form data using a transform function if provided
 */
export function transformFormData<TInput, TOutput>(
  data: TInput,
  transform?: (data: TInput) => TOutput
): TOutput {
  if (transform) {
    return transform(data);
  }
  return data as unknown as TOutput;
}

/**
 * Check if form has any changes compared to initial values
 */
export function hasFormChanges<TFormData extends FieldValues>(
  currentValues: TFormData,
  initialValues: DefaultValues<TFormData>
): boolean {
  const currentKeys = Object.keys(currentValues);

  return currentKeys.some((key) => {
    const current = currentValues[key];
    const initial = initialValues[key as keyof typeof initialValues];

    // Handle arrays
    if (Array.isArray(current) && Array.isArray(initial)) {
      if (current.length !== initial.length) return true;
      return current.some((item, index) => item !== initial[index]);
    }

    // Handle objects (shallow comparison)
    if (
      typeof current === "object" &&
      current !== null &&
      typeof initial === "object" &&
      initial !== null
    ) {
      return JSON.stringify(current) !== JSON.stringify(initial);
    }

    return current !== initial;
  });
}
