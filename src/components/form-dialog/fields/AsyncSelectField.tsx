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
import { PopoverSearchSelect } from "@/components/form-dialog/PopoverSearchSelect";
import type { FieldConfig, SelectOption } from "@/lib/form/field-config";

export interface AsyncSelectFieldProps<TFormData extends FieldValues> {
  config: FieldConfig<TFormData>;
  form: UseFormReturn<TFormData>;
  disabled?: boolean;
}

function AsyncSelectFieldComponent<TFormData extends FieldValues>({
  config,
  form,
  disabled = false,
}: AsyncSelectFieldProps<TFormData>) {
  const [options, setOptions] = React.useState<SelectOption[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [isOpen, setIsOpen] = React.useState(false);
  const debounceRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortControllerRef = React.useRef<AbortController | null>(null);

  const asyncConfig = config.asyncOptions;
  const debounceMs = asyncConfig?.debounceMs ?? 300;
  const minChars = asyncConfig?.minChars ?? 0;

  const loadOptions = React.useCallback(
    async (search: string) => {
      if (!asyncConfig?.loader) return;

      // Check minimum characters
      if (search.length < minChars && minChars > 0) {
        setOptions([]);
        return;
      }

      // Cancel previous request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();

      setIsLoading(true);
      try {
        const result = await asyncConfig.loader(search, form);
        setOptions(result);
      } catch (error) {
        // Ignore abort errors
        if (error instanceof Error && error.name === "AbortError") {
          return;
        }
        console.error("Error loading options:", error);
        setOptions([]);
      } finally {
        setIsLoading(false);
      }
    },
    [asyncConfig, form, minChars]
  );

  // Load options on open or when search changes
  React.useEffect(() => {
    if (!isOpen) return;

    // Clear previous timeout
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Debounce the search
    debounceRef.current = setTimeout(() => {
      loadOptions(searchTerm);
    }, debounceMs);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [searchTerm, isOpen, loadOptions, debounceMs]);

  // Load initial options when opened
  React.useEffect(() => {
    if (isOpen && options.length === 0 && !isLoading) {
      loadOptions("");
    }
  }, [isOpen, options.length, isLoading, loadOptions]);

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

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
            <PopoverSearchSelect
              value={field.value?.toString() ?? ""}
              onValueChange={field.onChange}
              options={options.map((o) => ({
                value: String(o.value),
                label: o.label,
                disabled: o.disabled,
              }))}
              placeholder={config.placeholder ?? "Select..."}
              searchPlaceholder={"Search..."}
              emptyText={"No options found"}
              isLoading={isLoading}
              disabled={disabled}
              open={isOpen}
              onOpenChange={setIsOpen}
              searchValue={searchTerm}
              onSearchValueChange={setSearchTerm}
              minChars={minChars}
              resetSearchOnClose
            />
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

export const AsyncSelectField = React.memo(
  AsyncSelectFieldComponent
) as typeof AsyncSelectFieldComponent;
