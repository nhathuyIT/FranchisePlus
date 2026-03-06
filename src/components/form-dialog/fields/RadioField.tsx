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
import { Label } from "@/components/ui/label";
import type { FieldConfig } from "@/lib/form/field-config";

export interface RadioFieldProps<TFormData extends FieldValues> {
  config: FieldConfig<TFormData>;
  form: UseFormReturn<TFormData>;
  disabled?: boolean;
}

function RadioFieldComponent<TFormData extends FieldValues>({
  config,
  form,
  disabled = false,
}: RadioFieldProps<TFormData>) {
  const options = config.options ?? [];

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
            <div className="space-y-2">
              {options.map((option) => (
                <div
                  key={String(option.value)}
                  className="flex items-center space-x-2"
                >
                  <input
                    type="radio"
                    id={`${config.name}-${option.value}`}
                    value={String(option.value)}
                    checked={String(field.value) === String(option.value)}
                    onChange={() => field.onChange(option.value)}
                    disabled={disabled || option.disabled}
                    className="h-4 w-4 border-gray-300 text-primary focus:ring-primary"
                  />
                  <Label
                    htmlFor={`${config.name}-${option.value}`}
                    className="cursor-pointer"
                  >
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
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

export const RadioField = React.memo(
  RadioFieldComponent
) as typeof RadioFieldComponent;
