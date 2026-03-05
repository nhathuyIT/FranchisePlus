import * as React from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { FormFooterProps } from "./types";

/**
 * Footer component for FormDialog
 * Contains submit and cancel buttons with loading state
 */
function FormFooterComponent({
  isViewMode,
  isSubmitting,
  submitText,
  cancelText,
  hideCancel = false,
  onCancel,
}: FormFooterProps) {
  // In view mode, only show close button
  if (isViewMode) {
    return (
      <div className="flex justify-end">
        <Button type="button" variant="outline" onClick={onCancel}>
          Close
        </Button>
      </div>
    );
  }

  return (
    <div className="flex justify-end gap-3">
      {!hideCancel && (
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          {cancelText}
        </Button>
      )}
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {submitText}
      </Button>
    </div>
  );
}

export const FormFooter = React.memo(FormFooterComponent);
