import * as React from "react";
import type { FieldValues, UseFormReturn, Path } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import type { FieldConfig } from "@/lib/form/field-config";

export interface TextareaFieldProps<TFormData extends FieldValues> {
  config: FieldConfig<TFormData>;
  form: UseFormReturn<TFormData>;
  disabled?: boolean;
}

function TextareaFieldComponent<TFormData extends FieldValues>({
  config,
  form,
  disabled = false,
}: TextareaFieldProps<TFormData>) {
  return (
    <FormField
      control={form.control}
      name={config.name as Path<TFormData>}
      render={({ field }) => (
        <FormItem className={config.className}>
          <FormLabel>
            {config.label}
            {config.required && <span className="text-destructive ml-1">*</span>}
          </FormLabel>
          <FormControl>
            <Textarea
              {...field}
              placeholder={config.placeholder}
              disabled={disabled}
              rows={config.rows ?? 3}
              value={field.value ?? ""}
            />
          </FormControl>
          {config.description && (
            <FormDescription>{config.description}</FormDescription>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export const TextareaField = React.memo(
  TextareaFieldComponent
) as typeof TextareaFieldComponent;
