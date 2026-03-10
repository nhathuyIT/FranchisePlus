import * as React from "react";
import type { FieldValues, UseFormReturn, Path } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import type { FieldConfig, CustomFieldRenderProps } from "@/lib/form/field-config";

export interface CustomFieldProps<TFormData extends FieldValues> {
  config: FieldConfig<TFormData>;
  form: UseFormReturn<TFormData>;
  disabled?: boolean;
}

function CustomFieldComponent<TFormData extends FieldValues>({
  config,
  form,
  disabled = false,
}: CustomFieldProps<TFormData>) {
  if (!config.render) {
    console.warn(
      `CustomField "${config.name}" has type="custom" but no render function provided`
    );
    return null;
  }

  return (
    <FormField
      control={form.control}
      name={config.name as Path<TFormData>}
      render={({ field, fieldState }) => {
        const renderProps: CustomFieldRenderProps<TFormData> = {
          field: {
            value: field.value,
            onChange: field.onChange,
            onBlur: field.onBlur,
            name: field.name,
            ref: field.ref,
          },
          form,
          fieldState: {
            error: fieldState.error,
            isTouched: fieldState.isTouched,
            isDirty: fieldState.isDirty,
          },
          disabled,
        };

        return (
          <FormItem className={config.className}>
            {config.label && (
              <FormLabel>
                {config.label}
                {config.required && (
                  <span className="text-destructive ml-1">*</span>
                )}
              </FormLabel>
            )}
            {config.render!(renderProps)}
            {config.description && (
              <FormDescription>{config.description}</FormDescription>
            )}
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}

export const CustomField = React.memo(
  CustomFieldComponent
) as typeof CustomFieldComponent;
