import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { FieldValues, DefaultValues } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { getDefaultValues, mergeWithDefaults, buildFieldLabelMap } from "@/lib/form/form-utils";
import { renderField, getFieldColSpanClass } from "./fields";
import { FormErrorBanner } from "./FormErrorBanner";
import { FormFooter } from "./FormFooter";
import { useFormSubmit } from "./hooks/useFormSubmit";
import type { FormContentProps } from "./types";
import { defaultSubmitText } from "./types";

/**
 * FormContent - Standalone form component
 *
 * Can be used without FormDialog wrapper for inline forms
 *
 * @example
 * ```tsx
 * <FormContent
 *   schema={userSchema}
 *   fields={userFields}
 *   defaultValues={{ role: "user" }}
 *   onSubmit={handleCreateUser}
 *   onSuccess={handleSuccess}
 * />
 * ```
 */
export function FormContent<TFormData extends FieldValues>({
  schema,
  fields,
  defaultValues,
  values,
  mode = "create",
  onSubmit,
  onSuccess,
  columns = 1,
  formRef,
  children,
}: FormContentProps<TFormData>) {
  // Calculate default values from field configs and provided defaults
  const fieldDefaults = getDefaultValues(fields);
  const mergedDefaults = mergeWithDefaults(
    values ?? defaultValues,
    fieldDefaults
  ) as DefaultValues<TFormData>;

  // Initialize form with zodResolver
  // Note: `any` cast required due to TypeScript limitation with generic Zod schemas
  // See FormDialogProps documentation for rationale
  const form = useForm<TFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(schema as any) as any,
    defaultValues: mergedDefaults,
  });

  // Expose form instance to parent if requested
  React.useEffect(() => {
    if (formRef) {
      formRef.current = form;
    }
    return () => {
      if (formRef) {
        formRef.current = null;
      }
    };
  }, [form, formRef]);

  // Reset form when values change (for edit mode)
  React.useEffect(() => {
    if (values) {
      const resetValues = mergeWithDefaults(
        values,
        fieldDefaults
      ) as DefaultValues<TFormData>;
      form.reset(resetValues);
    }
  }, [values, form, fieldDefaults]);

  // Build field label map for error messages
  const fieldLabelMap = React.useMemo(
    () => buildFieldLabelMap(fields),
    [fields]
  );

  // Use form submit hook
  const { isSubmitting, generalError, handleSubmit, clearGeneralError } =
    useFormSubmit({
      form,
      onSubmit,
      onSuccess,
      fieldLabelMap,
    });

  const isViewMode = mode === "view";

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* General error banner */}
        <FormErrorBanner error={generalError} onDismiss={clearGeneralError} />

        {/* Form fields */}
        <div
          className={cn(
            "space-y-4",
            columns === 2 && "grid grid-cols-2 gap-4 space-y-0"
          )}
        >
          {fields.map((fieldConfig) => (
            <div
              key={fieldConfig.name}
              className={getFieldColSpanClass(fieldConfig.colSpan, columns)}
            >
              {renderField({
                config: fieldConfig,
                form,
                disabled: isViewMode,
              })}
            </div>
          ))}
        </div>

        {/* Custom children */}
        {children}

        {/* Form footer */}
        <FormFooter
          isViewMode={isViewMode}
          isSubmitting={isSubmitting}
          submitText={defaultSubmitText[mode]}
          cancelText="Cancel"
          onCancel={() => form.reset()}
        />
      </form>
    </Form>
  );
}
