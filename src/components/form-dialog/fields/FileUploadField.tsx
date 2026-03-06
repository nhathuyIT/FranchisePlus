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
import { Input } from "@/components/ui/input";
import type { FieldConfig } from "@/lib/form/field-config";

export interface FileUploadFieldProps<TFormData extends FieldValues> {
  config: FieldConfig<TFormData>;
  form: UseFormReturn<TFormData>;
  disabled?: boolean;
}

function FileUploadFieldComponent<TFormData extends FieldValues>({
  config,
  form,
  disabled = false,
}: FileUploadFieldProps<TFormData>) {
  const inputRef = React.useRef<HTMLInputElement>(null);

  return (
    <FormField
      control={form.control}
      name={config.name as Path<TFormData>}
      render={({ field: { onChange, value, ...fieldProps } }) => (
        <FormItem className={config.className}>
          <FormLabel>
            {config.label}
            {config.required && <span className="text-destructive ml-1">*</span>}
          </FormLabel>
          <FormControl>
            <Input
              {...fieldProps}
              ref={inputRef}
              type="file"
              accept={config.accept}
              disabled={disabled}
              onChange={(e) => {
                const files = e.target.files;
                if (files && files.length > 0) {
                  // Store the file object or file list
                  onChange(files[0]);
                }
              }}
            />
          </FormControl>
          {value && typeof value === "object" && "name" in value && (
            <p className="text-sm text-muted-foreground">
              Selected: {(value as File).name}
            </p>
          )}
          {config.description && (
            <FormDescription>{config.description}</FormDescription>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export const FileUploadField = React.memo(
  FileUploadFieldComponent
) as typeof FileUploadFieldComponent;
