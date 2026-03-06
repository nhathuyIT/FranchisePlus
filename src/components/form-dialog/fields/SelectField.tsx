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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { FieldConfig } from "@/lib/form/field-config";

export interface SelectFieldProps<TFormData extends FieldValues> {
  config: FieldConfig<TFormData>;
  form: UseFormReturn<TFormData>;
  disabled?: boolean;
}

function SelectFieldComponent<TFormData extends FieldValues>({
  config,
  form,
  disabled = false,
}: SelectFieldProps<TFormData>) {
  // Memoize options to prevent unnecessary re-renders in useCallback
  const options = React.useMemo(() => config.options ?? [], [config.options]);

  // Helper to convert string value back to original type
  const parseValue = React.useCallback(
    (stringValue: string) => {
      // Find the original option to get its typed value
      const option = options.find((opt) => String(opt.value) === stringValue);
      if (option) {
        return option.value;
      }
      // Fallback: try to parse boolean/number
      if (stringValue === "true") return true;
      if (stringValue === "false") return false;
      const num = Number(stringValue);
      if (!isNaN(num) && stringValue !== "") return num;
      return stringValue;
    },
    [options]
  );

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
          <Select
            onValueChange={(val) => field.onChange(parseValue(val))}
            value={field.value != null ? String(field.value) : ""}
            disabled={disabled}
          >
            <FormControl>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={config.placeholder ?? "Select..."} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.map((option) => (
                <SelectItem
                  key={String(option.value)}
                  value={String(option.value)}
                  disabled={option.disabled}
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {config.description && (
            <FormDescription>{config.description}</FormDescription>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export const SelectField = React.memo(
  SelectFieldComponent
) as typeof SelectFieldComponent;
