import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { FieldValues, DefaultValues } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { getDefaultValues, mergeWithDefaults, buildFieldLabelMap } from "@/lib/form/form-utils";
import { renderField, getFieldColSpanClass } from "./fields";
import { FormErrorBanner } from "./FormErrorBanner";
import { FormFooter } from "./FormFooter";
import { useFormSubmit } from "./hooks/useFormSubmit";
import type { FormDialogProps } from "./types";
import { dialogSizeClasses, defaultSubmitText } from "./types";

/**
 * FormDialog - Reusable form dialog component
 *
 * Features:
 * - Generic type support for form data
 * - Zod schema validation via zodResolver
 * - Dynamic field rendering from config
 * - API error mapping to form fields
 * - Create/Edit/View mode support
 * - Loading states and error handling
 *
 * @example
 * ```tsx
 * const dialog = useFormDialog<User>();
 *
 * <FormDialog
 *   open={dialog.isOpen}
 *   onOpenChange={(open) => !open && dialog.close()}
 *   title={dialog.mode === "create" ? "Create User" : "Edit User"}
 *   schema={userSchema}
 *   fields={userFields}
 *   values={dialog.data}
 *   mode={dialog.mode}
 *   onSubmit={async (data) => {
 *     if (dialog.mode === "create") {
 *       await createUser(data);
 *     } else {
 *       await updateUser(dialog.data.id, data);
 *     }
 *   }}
 *   onSuccess={() => {
 *     dialog.close();
 *     queryClient.invalidateQueries(["users"]);
 *   }}
 * />
 * ```
 */
export function FormDialog<TFormData extends FieldValues>({
  open,
  onOpenChange,
  title,
  description,
  size = "lg",
  schema,
  fields,
  defaultValues,
  values,
  mode = "create",
  onSubmit,
  onSuccess,
  submitText,
  cancelText = "Cancel",
  hideCancel = false,
  preventCloseOnSubmit = true,
  closeOnSuccess = true,
  renderFooter,
  columns = 1,
}: FormDialogProps<TFormData>) {
  // Memoize field defaults to prevent infinite loops
  const fieldDefaults = React.useMemo(
    () => getDefaultValues(fields),
    [fields]
  );

  const mergedDefaults = React.useMemo(
    () => mergeWithDefaults(values ?? defaultValues, fieldDefaults) as DefaultValues<TFormData>,
    [values, defaultValues, fieldDefaults]
  );

  // Initialize form
  const form = useForm<TFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(schema as any) as any,
    defaultValues: mergedDefaults,
  });

  // Reset form when dialog opens with new values
  React.useEffect(() => {
    if (open) {
      form.reset(mergedDefaults);
    }
    // Only reset when dialog opens or values change, not on every render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, values]);

  // Build field label map for error messages
  const fieldLabelMap = React.useMemo(
    () => buildFieldLabelMap(fields),
    [fields]
  );

  // Handle successful submission
  const handleSuccess = React.useCallback(() => {
    onSuccess?.();
    if (closeOnSuccess) {
      onOpenChange(false);
    }
  }, [onSuccess, closeOnSuccess, onOpenChange]);

  // Use form submit hook
  const { isSubmitting, generalError, handleSubmit, clearGeneralError } =
    useFormSubmit({
      form,
      onSubmit,
      onSuccess: handleSuccess,
      fieldLabelMap,
    });

  // Handle dialog close
  const handleOpenChange = React.useCallback(
    (newOpen: boolean) => {
      // Prevent closing while submitting if configured
      if (!newOpen && isSubmitting && preventCloseOnSubmit) {
        return;
      }
      onOpenChange(newOpen);
    },
    [onOpenChange, isSubmitting, preventCloseOnSubmit]
  );

  const handleCancel = React.useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  const isViewMode = mode === "view";
  const finalSubmitText = submitText ?? defaultSubmitText[mode];

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className={cn(dialogSizeClasses[size], "max-h-[90vh] overflow-y-auto")}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

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

            {/* Form footer */}
            {renderFooter ? (
              renderFooter({
                form,
                isSubmitting,
                onCancel: handleCancel,
              })
            ) : (
              <FormFooter
                isViewMode={isViewMode}
                isSubmitting={isSubmitting}
                submitText={finalSubmitText}
                cancelText={cancelText}
                hideCancel={hideCancel}
                onCancel={handleCancel}
              />
            )}
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
