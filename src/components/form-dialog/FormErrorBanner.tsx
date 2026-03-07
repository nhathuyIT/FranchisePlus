import * as React from "react";
import { AlertCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { FormErrorBannerProps } from "./types";

/**
 * Banner component to display general form errors (not field-specific)
 * Shows API errors, server errors, or any general submission errors
 */
function FormErrorBannerComponent({
  error,
  onDismiss,
}: FormErrorBannerProps) {
  if (!error) return null;

  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-lg border border-destructive/50 bg-destructive/10 p-4",
        "animate-in fade-in-0 slide-in-from-top-1 duration-200"
      )}
      role="alert"
    >
      <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="text-sm font-medium text-destructive">Error</p>
        <p className="text-sm text-destructive/90 mt-1">{error}</p>
      </div>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="flex-shrink-0 text-destructive/70 hover:text-destructive transition-colors"
          aria-label="Dismiss error"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

export const FormErrorBanner = React.memo(FormErrorBannerComponent);
