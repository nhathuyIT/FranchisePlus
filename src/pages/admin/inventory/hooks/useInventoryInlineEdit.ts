import { useCallback, useEffect, useMemo } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { InventorySearchItem } from "@/api/inventory/inventory.type";

// ─── Schema ──────────────────────────────────────────────────────────────────

const rowSchema = z.object({
  inventoryId: z.string(),
  productName: z.string(),
  productFranchiseId: z.string(),
  quantity: z
    .number({ error: "Quantity must be a number" })
    .min(0, "Quantity must be ≥ 0"),
  alertThreshold: z
    .number({ error: "Alert threshold must be a number" })
    .min(0, "Alert threshold must be ≥ 0"),
});

export const inlineFormSchema = z.object({ rows: z.array(rowSchema) });

export type InventoryInlineFormValues = z.infer<typeof inlineFormSchema>;

// ─── Error type ───────────────────────────────────────────────────────────────

export interface RowValidationError {
  /** 1-based row index for display */
  rowIndex: number;
  productName: string;
  field: "quantity" | "alertThreshold";
  message: string;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

interface UseInventoryInlineEditOptions {
  items: InventorySearchItem[];
  /**
   * Called once per dirty row when user clicks "Save Changes".
   * Quantity: caller computes delta and calls adjust API.
   * AlertThreshold: caller handles (API pending).
   */
  onSaveRow: (
    item: InventorySearchItem,
    newQuantity: number,
    newAlertThreshold: number,
  ) => Promise<void>;
}

export function useInventoryInlineEdit({
  items,
  onSaveRow,
}: UseInventoryInlineEditOptions) {
  // ── Default values ────────────────────────────────────────────────────────

  const buildDefaultValues = useCallback(
    (): InventoryInlineFormValues => ({
      rows: items.map((item) => ({
        inventoryId: String(item.id),
        productName: item.productName,
        productFranchiseId: String(item.productFranchiseId),
        quantity: item.quantity,
        alertThreshold: item.alertThreshold,
      })),
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    // Intentionally using JSON string to detect deep changes in items array
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      JSON.stringify(
        items.map((i) => ({ id: i.id, q: i.quantity, t: i.alertThreshold })),
      ),
    ],
  );

  // ── Form setup ────────────────────────────────────────────────────────────

  const methods = useForm<InventoryInlineFormValues>({
    resolver: zodResolver(inlineFormSchema),
    defaultValues: buildDefaultValues(),
    mode: "onChange",
  });

  const { fields } = useFieldArray({
    control: methods.control,
    name: "rows",
  });

  // Reset when server data changes (after refetch / after save)
  useEffect(() => {
    methods.reset(buildDefaultValues());
  }, [buildDefaultValues, methods]);

  // ── fieldIndexMap: inventoryId → index in fields array ───────────────────

  const fieldIndexMap = useMemo<Record<string, number>>(() => {
    const map: Record<string, number> = {};
    items.forEach((item, idx) => {
      map[String(item.id)] = idx;
    });
    return map;
  }, [items]);

  // ── Error collection: left-to-right per row, rows sorted by index ─────────

  const collectErrors = useCallback((): RowValidationError[] => {
    const formErrors = methods.formState.errors.rows;
    if (!Array.isArray(formErrors) || formErrors.length === 0) return [];

    const result: RowValidationError[] = [];

    Array.from(formErrors).forEach((rowErr, idx) => {
      if (!rowErr) return;
      const productName = items[idx]?.productName ?? `Row ${idx + 1}`;

      // quantity FIRST (left column), then alertThreshold (right column)
      if (rowErr.quantity?.message) {
        result.push({
          rowIndex: idx + 1,
          productName,
          field: "quantity",
          message: rowErr.quantity.message,
        });
      }
      if (rowErr.alertThreshold?.message) {
        result.push({
          rowIndex: idx + 1,
          productName,
          field: "alertThreshold",
          message: rowErr.alertThreshold.message,
        });
      }
    });

    return result;
  }, [methods.formState.errors.rows, items]);

  // ── Dirty row helpers ─────────────────────────────────────────────────────

  const isRowDirty = useCallback(
    (inventoryId: string): boolean => {
      const idx = fieldIndexMap[inventoryId];
      if (idx === undefined) return false;
      const dirtyRows = methods.formState.dirtyFields.rows;
      if (!dirtyRows?.[idx]) return false;
      return !!(dirtyRows[idx].quantity || dirtyRows[idx].alertThreshold);
    },
    [methods.formState.dirtyFields.rows, fieldIndexMap],
  );

  const hasDirtyRows = useMemo((): boolean => {
    const dirtyRows = methods.formState.dirtyFields.rows;
    if (!dirtyRows?.length) return false;
    return dirtyRows.some((row) => row?.quantity || row?.alertThreshold);
  }, [methods.formState.dirtyFields.rows]);

  // ── Save all dirty rows ───────────────────────────────────────────────────

  const saveAllChanges = useCallback(async (): Promise<boolean> => {
    const isValid = await methods.trigger();
    if (!isValid) return false;

    const dirtyRows = methods.formState.dirtyFields.rows ?? [];
    const values = methods.getValues();

    const savePromises = dirtyRows
      .map((dirtyRow, idx) => {
        if (!dirtyRow?.quantity && !dirtyRow?.alertThreshold) return null;
        const originalItem = items[idx];
        if (!originalItem) return null;
        const row = values.rows[idx];

        return onSaveRow(originalItem, row.quantity, row.alertThreshold);
      })
      .filter(Boolean) as Promise<void>[];

    await Promise.all(savePromises);
    return true;
  }, [methods, items, onSaveRow]);

  return {
    methods,
    fields,
    fieldIndexMap,
    collectErrors,
    isRowDirty,
    hasDirtyRows,
    saveAllChanges,
  };
}
