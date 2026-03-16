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
  baselineItems?: InventorySearchItem[];
  /**
   * Called once with all dirty rows when user clicks "Save Changes".
   * Replaces per-row onSaveRow to send a single bulk API request.
   */
  onSaveBulk: (
    changes: Array<{
      item: InventorySearchItem;
      newQuantity: number;
      newAlertThreshold: number;
    }>,
  ) => Promise<void>;
}

export function useInventoryInlineEdit({
  items,
  baselineItems,
  onSaveBulk,
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

  const baselineItemMap = useMemo<Record<string, InventorySearchItem>>(() => {
    const map: Record<string, InventorySearchItem> = {};
    (baselineItems ?? items).forEach((item) => {
      map[String(item.id)] = item;
    });
    return map;
  }, [baselineItems, items]);

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

      const currentItem = items[idx];
      const baselineItem = currentItem
        ? baselineItemMap[String(currentItem.id)]
        : undefined;
      if (
        currentItem &&
        baselineItem &&
        (currentItem.quantity !== baselineItem.quantity ||
          currentItem.alertThreshold !== baselineItem.alertThreshold)
      ) {
        return true;
      }

      const dirtyRows = methods.formState.dirtyFields.rows;
      if (!dirtyRows?.[idx]) return false;
      return !!(dirtyRows[idx].quantity || dirtyRows[idx].alertThreshold);
    },
    [items, baselineItemMap, methods.formState.dirtyFields.rows, fieldIndexMap],
  );

  const hasDirtyRows = useMemo((): boolean => {
    const hasImportedDiff = items.some((item) => {
      const baselineItem = baselineItemMap[String(item.id)];
      if (!baselineItem) return false;
      return (
        item.quantity !== baselineItem.quantity ||
        item.alertThreshold !== baselineItem.alertThreshold
      );
    });
    if (hasImportedDiff) return true;

    const dirtyRows = methods.formState.dirtyFields.rows;
    if (!dirtyRows?.length) return false;
    return dirtyRows.some((row) => row?.quantity || row?.alertThreshold);
  }, [items, baselineItemMap, methods.formState.dirtyFields.rows]);

  // ── Save all dirty rows (bulk) ──────────────────────────────────────────

  const saveAllChanges = useCallback(async (): Promise<boolean> => {
    const isValid = await methods.trigger();
    if (!isValid) return false;

    const values = methods.getValues();

    const changes: Array<{
      item: InventorySearchItem;
      newQuantity: number;
      newAlertThreshold: number;
    }> = [];

    values.rows.forEach((row, idx) => {
      const currentItem = items[idx];
      if (!currentItem) return;

      const baselineItem =
        baselineItemMap[String(currentItem.id)] ?? currentItem;
      const quantityChanged = row.quantity !== baselineItem.quantity;
      const thresholdChanged =
        row.alertThreshold !== baselineItem.alertThreshold;

      if (!quantityChanged && !thresholdChanged) return;

      changes.push({
        item: baselineItem,
        newQuantity: row.quantity,
        newAlertThreshold: row.alertThreshold,
      });
    });

    if (changes.length === 0) return true;

    await onSaveBulk(changes);
    return true;
  }, [methods, items, baselineItemMap, onSaveBulk]);

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
