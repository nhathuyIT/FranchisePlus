import * as React from "react";
import type { FieldValues } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import NormalLoadingLayout from "@/layouts/NormalLoadingLayout";
import { cn } from "@/lib/utils";
import { FormContent } from "./FormContent";
import type { FormDialogProps } from "./types";
import { dialogSizeClasses } from "./types";

/**
 * FormDialog - Dialog shell that wraps FormContent
 *
 * This component handles ONLY dialog-specific concerns:
 * - Dialog open/close state
 * - Dialog header (title, description)
 * - Dialog sizing
 * - Prevent close while submitting
 * - Close on successful submit
 *
 * All form logic (initialization, validation, field rendering, submission,
 * error handling, footer) is delegated to FormContent.
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
  // Dialog-specific props
  open,
  onOpenChange,
  title,
  description,
  size = "lg",
  preventCloseOnSubmit = true,
  closeOnSuccess = true,
  // Form props (passed through to FormContent)
  schema,
  fields,
  onImageUpload,
  defaultValues,
  values,
  mode = "create",
  onSubmit,
  onSuccess,
  submitText,
  cancelText = "Cancel",
  hideCancel = false,
  hideButtonLoading = false,
  useLoadingOverlay = false,
  renderFooter,
  columns = 1,
}: FormDialogProps<TFormData>) {
  // ── Dialog-specific state ───────────────────────────────────────────

  // Track submitting state from FormContent for preventCloseOnSubmit
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Reset key - increments when dialog opens to remount FormContent with fresh state
  // This handles: user opens dialog → types → closes → opens again → form is clean
  const [resetKey, setResetKey] = React.useState(0);
  React.useEffect(() => {
    if (open) {
      setResetKey((k) => k + 1);
    }
  }, [open]);

  // ── Dialog-specific handlers ────────────────────────────────────────

  // Wrap onSuccess with closeOnSuccess behavior
  const handleSuccess = React.useCallback(() => {
    onSuccess?.();
    if (closeOnSuccess) {
      onOpenChange(false);
    }
  }, [onSuccess, closeOnSuccess, onOpenChange]);

  // Prevent closing while submitting if configured
  const handleOpenChange = React.useCallback(
    (newOpen: boolean) => {
      if (!newOpen && isSubmitting && preventCloseOnSubmit) {
        return;
      }
      onOpenChange(newOpen);
    },
    [onOpenChange, isSubmitting, preventCloseOnSubmit],
  );

  // Cancel = close dialog (different from FormContent's default form.reset())
  const handleCancel = React.useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  // ── Render ──────────────────────────────────────────────────────────

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className={cn(dialogSizeClasses[size], "max-h-[90vh] overflow-y-auto")}
      >
        {useLoadingOverlay ? (
          <NormalLoadingLayout forceShow={isSubmitting} />
        ) : null}

        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        <FormContent<TFormData>
          key={resetKey}
          schema={schema}
          fields={fields}
          onImageUpload={onImageUpload}
          defaultValues={defaultValues}
          values={values}
          mode={mode}
          onSubmit={onSubmit}
          onSuccess={handleSuccess}
          columns={columns}
          submitText={submitText}
          cancelText={cancelText}
          hideCancel={hideCancel}
          hideButtonLoading={hideButtonLoading}
          useLoadingOverlay={useLoadingOverlay}
          onCancel={handleCancel}
          renderFooter={renderFooter}
          onSubmittingChange={setIsSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
}
