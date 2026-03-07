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
import { Checkbox } from "@/components/ui/checkbox";
import type { FieldConfig } from "@/lib/form/field-config";

export interface CheckboxFieldProps<TFormData extends FieldValues> {
  config: FieldConfig<TFormData>;
  form: UseFormReturn<TFormData>;
  disabled?: boolean;
}

function CheckboxFieldComponent<TFormData extends FieldValues>({
  config,
  form,
  disabled = false,
}: CheckboxFieldProps<TFormData>) {
  return (
    <FormField
      control={form.control}
      name={config.name as Path<TFormData>}
      render={({ field }) => (
        <FormItem
          className={`flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 ${config.className ?? ""}`}
        >
          <FormControl>
            <Checkbox
              checked={field.value ?? false}
              onCheckedChange={field.onChange}
              disabled={disabled}
            />
          </FormControl>
          <div className="space-y-1 leading-none">
            <FormLabel className="cursor-pointer">
              {config.label}
              {config.required && (
                <span className="text-destructive ml-1">*</span>
              )}
            </FormLabel>
            {config.description && (
              <FormDescription>{config.description}</FormDescription>
            )}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export const CheckboxField = React.memo(
  CheckboxFieldComponent
) as typeof CheckboxFieldComponent;
