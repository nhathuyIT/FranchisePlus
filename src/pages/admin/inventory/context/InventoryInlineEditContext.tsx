import { createContext, useContext } from "react";
import type { Control, FieldErrors } from "react-hook-form";
import type { InventoryInlineFormValues } from "../hooks/useInventoryInlineEdit";

type InventoryEditableField = "quantity" | "alertThreshold";

export interface InventoryInlineEditContextValue {
  control: Control<InventoryInlineFormValues>;
  errors: FieldErrors<InventoryInlineFormValues>;
  /** inventoryId (string) → index in the fields array */
  fieldIndexMap: Record<string, number>;
  isRowDirty: (inventoryId: string) => boolean;
  isFieldChanged: (
    inventoryId: string,
    fieldName: InventoryEditableField,
    value: number,
  ) => boolean;
  /** Whether inline editing is enabled (permission guard) */
  isEditable: boolean;
}

const InventoryInlineEditContext =
  createContext<InventoryInlineEditContextValue | null>(null);

export const useInventoryInlineEditContext =
  (): InventoryInlineEditContextValue => {
    const ctx = useContext(InventoryInlineEditContext);
    if (!ctx) {
      throw new Error(
        "useInventoryInlineEditContext must be used inside InventoryInlineEditContext.Provider",
      );
    }
    return ctx;
  };

export { InventoryInlineEditContext };
