import { AlertTriangle, X, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import type { RowValidationError } from "../hooks/useInventoryInlineEdit";

interface InventoryErrorBannerProps {
  errors: RowValidationError[];
}

const FIELD_LABEL: Record<RowValidationError["field"], string> = {
  quantity: "Quantity",
  alertThreshold: "Alert Threshold",
};

/**
 * Collapsible error banner rendered above the inventory table.
 *
 * Errors are shown in order:
 *   - Sorted by rowIndex (ascending)
 *   - Within same row: quantity BEFORE alertThreshold (left → right)
 *
 * Format: Row {N} [{ProductName}] — {Field}: {message}
 */
export const InventoryErrorBanner = ({ errors }: InventoryErrorBannerProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  // Re-show banner whenever errors change
  if (isDismissed && errors.length > 0) setIsDismissed(false);

  if (errors.length === 0 || isDismissed) return null;

  const errorCount = errors.length;
  const rowCount = new Set(errors.map((e) => e.rowIndex)).size;

  return (
    <div
      role="alert"
      aria-live="polite"
      className="mb-4 rounded-xl border-2 border-red-200 bg-linear-to-r from-red-50 to-rose-50 shadow-sm overflow-hidden"
    >
      {/* Header row */}
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-100">
          <AlertTriangle className="h-4 w-4 text-red-500" />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-red-700">
            {errorCount} validation error{errorCount > 1 ? "s" : ""} in{" "}
            {rowCount} row{rowCount > 1 ? "s" : ""}
          </p>
          <p className="text-xs text-red-500 mt-0.5">
            Fix all errors before saving changes.
          </p>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={() => setIsCollapsed((c) => !c)}
            aria-label={isCollapsed ? "Expand errors" : "Collapse errors"}
            className="rounded-md p-1 text-red-400 hover:bg-red-100 hover:text-red-600 transition-colors"
          >
            {isCollapsed ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronUp className="h-4 w-4" />
            )}
          </button>
          <button
            type="button"
            onClick={() => setIsDismissed(true)}
            aria-label="Dismiss error banner"
            className="rounded-md p-1 text-red-400 hover:bg-red-100 hover:text-red-600 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Error list */}
      {!isCollapsed && (
        <ul className="border-t border-red-100 divide-y divide-red-100/60">
          {errors.map((err, i) => (
            <li
              key={`${err.rowIndex}-${err.field}-${i}`}
              className="flex items-start gap-3 px-4 py-2 text-sm"
            >
              {/* Row badge */}
              <span className="mt-0.5 shrink-0 rounded-full bg-red-100 px-2 py-0.5 text-xs font-bold text-red-600 tabular-nums">
                #{err.rowIndex}
              </span>

              {/* Detail */}
              <span className="text-red-700">
                <span className="font-medium">[{err.productName}]</span>
                {" — "}
                <span className="font-medium text-red-500">
                  {FIELD_LABEL[err.field]}
                </span>
                {": "}
                {err.message}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
