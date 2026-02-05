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
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            {config.label}
            {config.required && (
              <span className="text-destructive ml-1">*</span>
            )}
          </FormLabel>
          <FormControl>
            {renderFieldControl(config, field, isDisabled)}
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

/**
 * Render appropriate input control based on field type
 */
function renderFieldControl<TFormData extends FieldValues>(
  config: FieldConfig<TFormData>,
  field: any,
  disabled: boolean
) {
  switch (config.type) {
    case "text":
      return (
        <Input
          {...field}
          type="text"
          placeholder={config.placeholder}
          disabled={disabled}
          className="border-[#E8DFD6] focus:border-[#6D4C41] focus:ring-[#6D4C41]"
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
          className="border-[#E8DFD6] focus:border-[#6D4C41] focus:ring-[#6D4C41]"
        />
      );

    case "textarea":
      return (
        <Textarea
          {...field}
          placeholder={config.placeholder}
          rows={config.rows || 3}
          disabled={disabled}
          className="border-[#E8DFD6] focus:border-[#6D4C41] focus:ring-[#6D4C41]"
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
          <SelectTrigger className="border-[#E8DFD6] focus:border-[#6D4C41] focus:ring-[#6D4C41]">
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
          className="border-[#E8DFD6] focus:border-[#6D4C41] focus:ring-[#6D4C41]"
        />
      );

    case "datetime":
      return (
        <Input
          {...field}
          type="datetime-local"
          disabled={disabled}
          className="border-[#E8DFD6] focus:border-[#6D4C41] focus:ring-[#6D4C41]"
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
      // Basic image upload field (can be enhanced later)
      return (
        <div className="space-y-2">
          <Input
            {...field}
            type="url"
            placeholder={config.placeholder || "Enter image URL"}
            disabled={disabled}
            className="border-[#E8DFD6] focus:border-[#6D4C41] focus:ring-[#6D4C41]"
          />
          {field.value && (
            <div className="mt-2">
              <img
                src={field.value}
                alt="Preview"
                className="h-24 w-24 object-cover rounded-lg border-2 border-[#E8DFD6]"
              />
            </div>
          )}
        </div>
      );

    case "custom":
      if (!config.render) return null;
      return null; // Placeholder - custom render needs proper implementation

    default:
      return (
        <Input
          {...field}
          disabled={disabled}
          className="border-[#E8DFD6] focus:border-[#6D4C41] focus:ring-[#6D4C41]"
        />
      );
  }
}
