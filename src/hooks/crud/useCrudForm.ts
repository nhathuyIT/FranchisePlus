import { useForm, type UseFormReturn, type FieldValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import type { CrudConfig, CrudMode } from "@/lib/crud/types";

/**
 * Hook for managing form state with React Hook Form + Zod
 * Automatically resets form when mode or entity changes
 */
export function useCrudForm<TEntity, TFormData extends FieldValues>(
  config: CrudConfig<TEntity, TFormData>,
  mode: CrudMode | null,
  entity: TEntity | null
): UseFormReturn<TFormData> {
  const form = useForm<TFormData>({
    resolver: zodResolver(config.schema as any) as any,
    mode: "onTouched", // Validate after first interaction
    reValidateMode: "onChange", // Real-time validation after first error shows
    criteriaMode: "all", // Show all errors, not just first one
  });

  // Reset form when entity changes
  useEffect(() => {
    if (mode === "create") {
      // Reset to empty form for create mode
      form.reset({} as TFormData);
    } else if ((mode === "update" || mode === "view") && entity) {
      // Transform entity to form data if transformer exists
      const formData = config.transform?.toForm
        ? config.transform.toForm(entity)
        : (entity as unknown as TFormData);
      form.reset(formData);
    }
  }, [mode, entity, config, form]);

  return form;
}
