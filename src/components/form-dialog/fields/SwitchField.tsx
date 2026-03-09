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
import { Switch } from "@/components/ui/switch";
import type { FieldConfig } from "@/lib/form/field-config";

export interface SwitchFieldProps<TFormData extends FieldValues> {
  config: FieldConfig<TFormData>;
  form: UseFormReturn<TFormData>;
  disabled?: boolean;
}

function SwitchFieldComponent<TFormData extends FieldValues>({
  config,
  form,
  disabled = false,
}: SwitchFieldProps<TFormData>) {
  return (
    <FormField
      control={form.control}
      name={config.name as Path<TFormData>}
      render={({ field }) => (
        <FormItem
          className={`flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm ${config.className ?? ""}`}
        >
          <div className="space-y-0.5">
            <FormLabel>
              {config.label}
              {config.required && (
                <span className="text-destructive ml-1">*</span>
              )}
            </FormLabel>
            {config.description && (
              <FormDescription>{config.description}</FormDescription>
            )}
          </div>
          <FormControl>
            <Switch
              checked={field.value ?? false}
              onCheckedChange={field.onChange}
              disabled={disabled}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export const SwitchField = React.memo(
  SwitchFieldComponent
) as typeof SwitchFieldComponent;
