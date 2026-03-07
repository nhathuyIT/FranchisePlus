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

export interface MultiselectFieldProps<TFormData extends FieldValues> {
  config: FieldConfig<TFormData>;
  form: UseFormReturn<TFormData>;
  disabled?: boolean;
}

function MultiselectFieldComponent<TFormData extends FieldValues>({
  config,
  form,
  disabled = false,
}: MultiselectFieldProps<TFormData>) {
  const options = config.options ?? [];

  return (
    <FormField
      control={form.control}
      name={config.name as Path<TFormData>}
      render={({ field }) => {
        const selectedValues: (string | number | boolean)[] = field.value ?? [];

        const handleCheckedChange = (
          optionValue: string | number | boolean,
          checked: boolean
        ) => {
          if (checked) {
            field.onChange([...selectedValues, optionValue]);
          } else {
            field.onChange(
              selectedValues.filter((v) => v !== optionValue)
            );
          }
        };

        return (
          <FormItem className={config.className}>
            <FormLabel>
              {config.label}
              {config.required && (
                <span className="text-destructive ml-1">*</span>
              )}
            </FormLabel>
            <FormControl>
              <div className="space-y-2 rounded-md border p-4">
                {options.map((option) => {
                  const isChecked = selectedValues.includes(option.value);
                  return (
                    <div
                      key={String(option.value)}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={`${config.name}-${option.value}`}
                        checked={isChecked}
                        onCheckedChange={(checked) =>
                          handleCheckedChange(option.value, checked === true)
                        }
                        disabled={disabled || option.disabled}
                      />
                      <label
                        htmlFor={`${config.name}-${option.value}`}
                        className="text-sm cursor-pointer"
                      >
                        {option.label}
                      </label>
                    </div>
                  );
                })}
                {options.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    No options available
                  </p>
                )}
              </div>
            </FormControl>
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

export const MultiselectField = React.memo(
  MultiselectFieldComponent
) as typeof MultiselectFieldComponent;
