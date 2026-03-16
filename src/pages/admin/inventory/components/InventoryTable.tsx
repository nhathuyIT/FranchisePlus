import { Edit, Trash2, Download, Save, RotateCcw, Loader2 } from "lucide-react";
import { useState, useCallback, useMemo } from "react";
import { FormProvider } from "react-hook-form";
import {
  DataTable,
  type ColumnFilter,
  type BulkAction,
} from "@/components/common/DataTable";
import { inventoryColumns } from "../columns/inventory.columns";
import { Button } from "@/components/ui/button";
import type { InventorySearchItem } from "@/api/inventory/inventory.type";
import { toast } from "sonner";
import {
  useExcelExport,
  INVENTORY_REVERSE_HEADER_MAPPING,
  flattenInventoryItem,
} from "@/lib/excel";
import {
  useInventoryInlineEdit,
  type RowValidationError,
} from "../hooks/useInventoryInlineEdit";
import { InventoryInlineEditContext } from "../context/InventoryInlineEditContext";
import { InventoryErrorBanner } from "./InventoryErrorBanner";

// ─── Props ────────────────────────────────────────────────────────────────────

interface InventoryTableProps {
  items: InventorySearchItem[];
  baselineItems?: InventorySearchItem[];
  isLoading?: boolean;
  error?: Error | null;
  onRetry?: () => void;
  onImport?: (file: File) => void;
  isImporting?: boolean;
  onDiscardChanges?: () => void;
  onEdit?: (item: InventorySearchItem) => void;
  onDelete?: (item: InventorySearchItem) => void;
  onBulkExport?: (items: InventorySearchItem[]) => void;
  /** When provided, enables inline editing for quantity + alertThreshold */
  onSaveRow?: (
    item: InventorySearchItem,
    newQuantity: number,
    newAlertThreshold: number,
  ) => Promise<void>;
  /** Whether the current user has edit permission */
  canEdit?: boolean;
}

// ─── SaveBar ─────────────────────────────────────────────────────────────────

interface SaveBarProps {
  hasDirtyRows: boolean;
  isSaving: boolean;
  onSave: () => void;
  onReset: () => void;
}

const SaveBar = ({ hasDirtyRows, isSaving, onSave, onReset }: SaveBarProps) => {
  if (!hasDirtyRows && !isSaving) return null;

  return (
    <div className="flex items-center justify-between gap-3 mb-4 rounded-xl border-2 border-amber-200 bg-gradient-to-r from-amber-50 to-yellow-50 px-4 py-3 shadow-sm animate-in slide-in-from-top-2 duration-200">
      <div className="flex items-center gap-2">
        <div className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
        <p className="text-sm font-medium text-amber-800">
          You have unsaved changes in the table.
        </p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onReset}
          disabled={isSaving}
          className="gap-1.5 border-amber-300 text-amber-700 hover:bg-amber-100"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Discard
        </Button>
        <Button
          type="button"
          size="sm"
          onClick={onSave}
          disabled={isSaving}
          className="gap-1.5 bg-[#6D4C41] hover:bg-[#3E2723] text-white"
        >
          {isSaving ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Save className="h-3.5 w-3.5" />
          )}
          Save Changes
        </Button>
      </div>
    </div>
  );
};

// ─── InventoryTable ──────────────────────────────────────────────────────────

export const InventoryTable = ({
  items,
  baselineItems,
  isLoading = false,
  error = null,
  onRetry,
  onImport,
  isImporting = false,
  onDiscardChanges,
  onEdit,
  onDelete,
  onBulkExport,
  onSaveRow,
  canEdit = false,
}: InventoryTableProps) => {
  const [isSaving, setIsSaving] = useState(false);

  // ── Excel export ──────────────────────────────────────────────────────────

  const { exportToExcel, isExporting } = useExcelExport({
    headerMapping: INVENTORY_REVERSE_HEADER_MAPPING,
    fileName: "inventory",
    sheetName: "Inventory",
  });

  const handleExport = () => {
    const flatData = items.map((item) =>
      flattenInventoryItem(item as unknown as Record<string, unknown>),
    );
    exportToExcel(flatData)
      .then(() => toast.success("Inventory exported successfully!"))
      .catch(() => toast.error("Inventory export failed!"));
  };

  // ── Inline edit hook ──────────────────────────────────────────────────────

  const safeOnSaveRow = useCallback(
    async (
      item: InventorySearchItem,
      newQuantity: number,
      newAlertThreshold: number,
    ) => {
      if (onSaveRow) {
        await onSaveRow(item, newQuantity, newAlertThreshold);
      }
    },
    [onSaveRow],
  );

  const {
    methods,
    fieldIndexMap,
    collectErrors,
    isRowDirty,
    hasDirtyRows,
    saveAllChanges,
  } = useInventoryInlineEdit({
    items,
    baselineItems,
    onSaveRow: safeOnSaveRow,
  });

  // ── Derived validation errors (live, onChange) ────────────────────────────

  const validationErrors: RowValidationError[] = collectErrors();

  // ── Save handler ──────────────────────────────────────────────────────────

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const success = await saveAllChanges();
      if (!success) {
        toast.error("Please fix validation errors before saving.");
      }
    } catch {
      toast.error("Failed to save changes. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // ── Discard handler ───────────────────────────────────────────────────────

  const handleDiscard = () => {
    methods.reset();
    onDiscardChanges?.();
  };

  // ── Row style for stock status highlighting ─────────────────────────────

  const getRowStyle = useMemo(
    () =>
      (item: InventorySearchItem): React.CSSProperties | undefined => {
        // Out of stock → strong red
        if (item.quantity === 0) {
          return { backgroundColor: "#fee2e2" };
        }
        // Low stock → visible amber
        if (item.quantity <= item.alertThreshold) {
          return { backgroundColor: "#fef3c7" };
        }
        return undefined;
      },
    [],
  );

  // ── DataTable config ──────────────────────────────────────────────────────

  const columnFilters: ColumnFilter[] = [
    {
      id: "status",
      type: "select",
      label: "Stock Status",
      options: [
        { label: "In Stock", value: "in_stock" },
        { label: "Low Stock", value: "low_stock" },
        { label: "Out of Stock", value: "out_of_stock" },
      ],
    },
  ];

  const bulkActions: BulkAction<InventorySearchItem>[] = [];

  if (onBulkExport) {
    bulkActions.push({
      label: "Export Selected",
      icon: Download,
      onClick: onBulkExport,
    });
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    // FormProvider makes react-hook-form methods available to any descendant
    // (though InlineEditCell reads from our dedicated Context for type safety)
    <FormProvider {...methods}>
      <InventoryInlineEditContext.Provider
        value={{
          control: methods.control,
          errors: methods.formState.errors,
          fieldIndexMap,
          isRowDirty,
          isEditable: canEdit && !!onSaveRow,
        }}
      >
        {/* Error banner */}
        <InventoryErrorBanner errors={validationErrors} />

        {/* Save / Discard bar — visible when there are pending changes */}
        <SaveBar
          hasDirtyRows={hasDirtyRows}
          isSaving={isSaving}
          onSave={handleSave}
          onReset={handleDiscard}
        />

        <DataTable
          columns={inventoryColumns}
          data={items}
          isLoading={isLoading || isSaving}
          error={error}
          onRetry={onRetry}
          emptyMessage="No inventory items found matching your criteria."
          initialPageSize={10}
          enableRowSelection={!!onBulkExport}
          enableColumnVisibility
          columnFilters={columnFilters}
          bulkActions={bulkActions}
          getRowStyle={getRowStyle}
          onImport={onImport}
          isImporting={isImporting}
          onExport={handleExport}
          isExporting={isExporting}
          importLabel="Import Excel"
          exportLabel="Export Excel"
          renderActions={
            onEdit || onDelete
              ? (item) => (
                  <div className="flex gap-2">
                    {onEdit && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-2 border-[#6D4C41] text-[#6D4C41] hover:bg-[#6D4C41] hover:text-white rounded-lg transition-all duration-200"
                        onClick={() => onEdit(item)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
                    {onDelete && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-all duration-200"
                        onClick={() => onDelete(item)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                )
              : undefined
          }
        />
      </InventoryInlineEditContext.Provider>
    </FormProvider>
  );
};
