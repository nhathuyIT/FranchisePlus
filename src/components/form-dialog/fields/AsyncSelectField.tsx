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
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
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
          <Select
            onValueChange={field.onChange}
            value={field.value?.toString() ?? ""}
            disabled={disabled}
            onOpenChange={setIsOpen}
            open={isOpen}
          >
            <FormControl>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={config.placeholder ?? "Select..."} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {/* Search input */}
              <div className="p-2">
                <Input
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="h-8"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>

              {/* Loading state */}
              {isLoading && (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="ml-2 text-sm text-muted-foreground">
                    Loading...
                  </span>
                </div>
              )}

              {/* Options */}
              {!isLoading && options.length === 0 && (
                <div className="py-4 text-center text-sm text-muted-foreground">
                  {searchTerm.length < minChars
                    ? `Type at least ${minChars} characters to search`
                    : "No options found"}
                </div>
              )}

              {!isLoading &&
                options.map((option) => (
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

export const AsyncSelectField = React.memo(
  AsyncSelectFieldComponent
) as typeof AsyncSelectFieldComponent;
