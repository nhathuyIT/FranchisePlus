import * as React from "react";
import type { FieldValues, UseFormReturn, Path } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { ImageUpload } from "@/components/ui/image-upload";
import type { FieldConfig } from "@/lib/form/field-config";

export interface ImageUploadFieldProps<TFormData extends FieldValues> {
  config: FieldConfig<TFormData>;
  form: UseFormReturn<TFormData>;
  disabled?: boolean;
  /** Upload handler function - required for image upload to work */
  onUpload?: (file: File) => Promise<string>;
}

// Default upload handler that returns a data URL preview.
// Avoid blob URLs here because they can become invalid after page reloads.
const defaultUploadHandler = async (file: File): Promise<string> => {
  return await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const result = reader.result;
      if (typeof result !== "string") {
        reject(new Error("Failed to read image file"));
        return;
      }

      resolve(result);
    };

    reader.onerror = () => {
      reject(new Error("Failed to read image file"));
    };

    reader.readAsDataURL(file);
  });
};

function ImageUploadFieldComponent<TFormData extends FieldValues>({
  config,
  form,
  disabled = false,
  onUpload = defaultUploadHandler,
}: ImageUploadFieldProps<TFormData>) {
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
          <ImageUpload
            value={field.value ?? ""}
            onChange={field.onChange}
            onUpload={onUpload}
            disabled={disabled}
          />
          {config.description && (
            <FormDescription>{config.description}</FormDescription>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export const ImageUploadField = React.memo(
  ImageUploadFieldComponent
) as typeof ImageUploadFieldComponent;
