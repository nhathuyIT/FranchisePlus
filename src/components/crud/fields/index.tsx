import type { UseFormReturn, FieldValues } from "react-hook-form";
import type { FieldConfig } from "@/lib/crud/types";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle2, Upload, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { uploadFileToCloudinary } from "@/stores/cloudinary";
import { useState } from "react";
import { toast } from "sonner";

/**
 * Image Upload Field Component
 * Handles file upload to Cloudinary with preview
 */
function ImageUploadField<TFormData extends FieldValues>({
  field,
  config,
  disabled,
  inputClassName,
}: {
  field: any;
  config: FieldConfig<TFormData>;
  disabled: boolean;
  inputClassName: string;
}) {
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Invalid file type", {
        description: "Please upload an image file (JPG, PNG, GIF, etc.)",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File too large", {
        description: "Maximum file size is 5MB. Please compress your image.",
      });
      return;
    }

    setIsUploading(true);
    try {
      const imageUrl = await uploadFileToCloudinary(file);
      field.onChange(imageUrl);
      toast.success("Image uploaded successfully");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Upload failed", {
        description: error instanceof Error ? error.message : "Please try again",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleRemove = () => {
    field.onChange("");
  };

  return (
    <div className="space-y-3">
      {/* Current Image Preview */}
      {field.value && (
        <div className="relative inline-block">
          <img
            src={field.value}
            alt="Preview"
            className="h-32 w-32 object-cover rounded-lg border-2 border-[#E8DFD6] shadow-sm"
          />
          {!disabled && (
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full shadow-md"
              onClick={handleRemove}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
      )}

      {/* Upload Area */}
      {!disabled && (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={cn(
            "relative border-2 border-dashed rounded-lg p-6 transition-colors",
            dragActive ? "border-[#6D4C41] bg-[#FAF8F5]" : "border-[#E8DFD6]",
            isUploading && "opacity-50 pointer-events-none"
          )}
        >
          {isUploading ? (
            <div className="flex flex-col items-center justify-center space-y-2">
              <Loader2 className="h-8 w-8 text-[#6D4C41] animate-spin" />
              <p className="text-sm text-[#5D4037]">Uploading image...</p>
            </div>
          ) : (
            <>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={disabled}
              />
              <div className="flex flex-col items-center justify-center space-y-2 text-center">
                <Upload className="h-8 w-8 text-[#6D4C41]" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-[#3E2723]">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-[#5D4037]">
                    PNG, JPG, GIF up to 5MB
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Manual URL Input (Fallback) */}
      {!disabled && (
        <div className="space-y-1">
          <p className="text-xs text-[#5D4037]">Or enter image URL:</p>
          <Input
            type="url"
            placeholder={config.placeholder || "https://example.com/image.jpg"}
            value={field.value || ""}
            onChange={(e) => field.onChange(e.target.value)}
            disabled={disabled || isUploading}
            className={inputClassName}
          />
        </div>
      )}
    </div>
  );
}

/**
 * Main field renderer
 * Maps field config to appropriate form component
 */
export function renderField<TFormData extends FieldValues>(
  config: FieldConfig<TFormData>,
  form: UseFormReturn<TFormData>,
  disabled: boolean = false
) {
  const isDisabled =
    disabled ||
    (typeof config.disabled === "function"
      ? config.disabled(form)
      : config.disabled || false);

  return (
    <FormField
      key={String(config.name)}
      control={form.control as any}
      name={config.name as any}
      render={({ field, fieldState }) => {
        const hasError = !!fieldState.error;
        const isTouched = fieldState.isTouched;
        const isValid = isTouched && !hasError && field.value;

        return (
          <FormItem>
            <FormLabel>
              {config.label}
              {config.required && (
                <span className="text-destructive ml-1">*</span>
              )}
            </FormLabel>
            <div className="relative">
              <FormControl>
                {renderFieldControl(config, field, isDisabled, hasError)}
              </FormControl>
              {/* Validation status indicator */}
              {!isDisabled && isTouched && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  {hasError ? (
                    <AlertCircle className="h-4 w-4 text-destructive" />
                  ) : isValid ? (
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  ) : null}
                </div>
              )}
            </div>
            {config.description && !hasError && (
              <FormDescription>{config.description}</FormDescription>
            )}
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}

/**
 * Render appropriate input control based on field type
 */
function renderFieldControl<TFormData extends FieldValues>(
  config: FieldConfig<TFormData>,
  field: any,
  disabled: boolean,
  hasError: boolean = false
) {
  const inputClassName = cn(
    "border-[#E8DFD6] focus:border-[#6D4C41] focus:ring-[#6D4C41] pr-10",
    hasError && "border-destructive focus:border-destructive focus:ring-destructive"
  );

  switch (config.type) {
    case "text":
      return (
        <Input
          {...field}
          type="text"
          placeholder={config.placeholder}
          disabled={disabled}
          className={inputClassName}
        />
      );

    case "number":
      return (
        <Input
          {...field}
          type="number"
          placeholder={config.placeholder}
          disabled={disabled}
          min={config.min}
          max={config.max}
          onChange={(e) => field.onChange(parseFloat(e.target.value))}
          className={inputClassName}
        />
      );

    case "textarea":
      return (
        <Textarea
          {...field}
          placeholder={config.placeholder}
          rows={config.rows || 3}
          disabled={disabled}
          className={cn(
            "border-[#E8DFD6] focus:border-[#6D4C41] focus:ring-[#6D4C41]",
            hasError && "border-destructive focus:border-destructive focus:ring-destructive"
          )}
        />
      );

    case "select":
      return (
        <Select
          onValueChange={(value) => {
            // Handle boolean values
            if (value === "true") field.onChange(true);
            else if (value === "false") field.onChange(false);
            else field.onChange(value);
          }}
          defaultValue={String(field.value)}
          disabled={disabled}
        >
          <SelectTrigger className={cn(
            "border-[#E8DFD6] focus:border-[#6D4C41] focus:ring-[#6D4C41] pr-10",
            hasError && "border-destructive"
          )}>
            <SelectValue placeholder={config.placeholder} />
          </SelectTrigger>
          <SelectContent>
            {config.options?.map((opt) => (
              <SelectItem key={String(opt.value)} value={String(opt.value)}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );

    case "date":
      return (
        <Input
          {...field}
          type="date"
          disabled={disabled}
          className={inputClassName}
        />
      );

    case "datetime":
      return (
        <Input
          {...field}
          type="datetime-local"
          disabled={disabled}
          className={inputClassName}
        />
      );

    case "checkbox":
      return (
        <div className="flex items-center space-x-2">
          <Checkbox
            checked={field.value}
            onCheckedChange={field.onChange}
            disabled={disabled}
          />
          {config.description && (
            <label className="text-sm text-muted-foreground">
              {config.description}
            </label>
          )}
        </div>
      );

    case "image-upload":
      return <ImageUploadField field={field} config={config} disabled={disabled} inputClassName={inputClassName} />;

    case "custom":
      if (!config.render) return null;
      return null; // Placeholder - custom render needs proper implementation

    default:
      return (
        <Input
          {...field}
          disabled={disabled}
          className={inputClassName}
        />
      );
  }
}
