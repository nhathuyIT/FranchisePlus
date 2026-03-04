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

// Default upload handler that uses URL.createObjectURL for preview
// In production, this should be replaced with actual upload to cloud storage
const defaultUploadHandler = async (file: File): Promise<string> => {
  return URL.createObjectURL(file);
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
