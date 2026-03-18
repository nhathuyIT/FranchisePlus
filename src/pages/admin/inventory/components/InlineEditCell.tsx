import { Controller } from "react-hook-form";
import { AlertCircle } from "lucide-react";
import type { InventorySearchItem } from "@/api/inventory/inventory.type";
import { useInventoryInlineEditContext } from "../context/InventoryInlineEditContext";

interface InlineEditCellProps {
  item: InventorySearchItem;
  fieldName: "quantity" | "alertThreshold";
}

/**
 * Inline editable number input cell for the Inventory table.
 *
 * Reads react-hook-form control from InventoryInlineEditContext so this
 * component can be used inside a static column definition (no prop-drilling).
 *
 * Validation is driven by the parent useForm + zod schema:
 *   - Must be a number
 *   - Must be >= 0
 * Errors render as:
 *   - Red border + red background on the input
 *   - Animated AlertCircle icon inside the input (right side), hover = tooltip
 */
export const InlineEditCell = ({ item, fieldName }: InlineEditCellProps) => {
  const { control, fieldIndexMap, errors, isEditable } =
    useInventoryInlineEditContext();

  const fieldIndex = fieldIndexMap[String(item.id)];

  // Fallback for items not yet registered (shouldn't happen in normal flow)
  if (fieldIndex === undefined) {
    return (
      <span className="text-sm font-semibold text-[#3E2723]">
        {item[fieldName]}
      </span>
    );
  }

  if (!isEditable) {
    return (
      <span className="text-sm font-semibold text-[#3E2723]">
        {item[fieldName]}
      </span>
    );
  }

  const fieldError = errors.rows?.[fieldIndex]?.[fieldName];
  const hasError = !!fieldError;

  const label = fieldName === "quantity" ? "Quantity" : "Alert threshold";

  return (
    <Controller
      control={control}
      name={`rows.${fieldIndex}.${fieldName}`}
      render={({ field }) => (
        <div className="relative group inline-flex items-center justify-end">
          <input
            id={`inventory-inline-${fieldName}-${String(item.id)}`}
            type="number"
            min={0}
            aria-label={`${label} for ${item.productName}`}
            aria-invalid={hasError}
            aria-describedby={
              hasError
                ? `inventory-inline-error-${fieldName}-${String(item.id)}`
                : undefined
            }
            value={
              field.value === undefined || field.value === null
                ? ""
                : field.value
            }
            onChange={(e) => {
              const raw = e.target.value;
              // Keep empty string as NaN so zod correctly reports type error
              field.onChange(raw === "" ? NaN : Number(raw));
            }}
            onBlur={field.onBlur}
            className={[
              "w-24 px-2 py-1 text-sm text-right rounded-md border-2 transition-all duration-200",
              "focus:outline-none focus:ring-2 focus:ring-offset-0",
              "[-moz-appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
              hasError
                ? "border-red-400 bg-red-50 text-red-700 focus:ring-red-300 pr-7"
                : "border-[#D4B5A0] bg-white text-[#3E2723] hover:border-[#6D4C41] focus:border-[#6D4C41] focus:ring-[#6D4C41]/20",
            ].join(" ")}
          />

          {/* Error icon — AlertCircle inside input on the right, hover = tooltip */}
          {hasError && fieldError?.message && (
            <span className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center">
              <span className="relative flex">
                <AlertCircle
                  id={`inventory-inline-error-${fieldName}-${String(item.id)}`}
                  role="img"
                  aria-label={fieldError.message}
                  className="h-4 w-4 text-red-500 cursor-help animate-in zoom-in-50 duration-150"
                />
                {/* Tooltip — appears on group hover */}
                <span
                  role="tooltip"
                  className={[
                    "pointer-events-none absolute bottom-full right-0 mb-2 z-50",
                    "w-max max-w-[200px] rounded-lg bg-red-600 px-2.5 py-1.5",
                    "text-[11px] font-medium leading-tight text-white shadow-lg",
                    "opacity-0 group-hover:opacity-100 scale-95 group-hover:scale-100",
                    "transition-all duration-150 origin-bottom-right",
                    "whitespace-normal wrap-break-word",
                  ].join(" ")}
                >
                  {fieldError.message}
                  {/* Tooltip arrow */}
                  <span className="absolute -bottom-1 right-2 h-2 w-2 rotate-45 bg-red-600" />
                </span>
              </span>
            </span>
          )}

          {/* Dirty indicator dot (only when no error) */}
          {!hasError && (
            <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-amber-400 ring-1 ring-white opacity-0 group-focus-within:opacity-100 transition-opacity duration-200" />
          )}
        </div>
      )}
    />
  );
};
