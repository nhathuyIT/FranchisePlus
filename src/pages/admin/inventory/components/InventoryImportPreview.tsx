import { useState, useMemo } from "react";
import {
  CheckSquare,
  Square,
  X,
  Save,
  AlertTriangle,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { PreviewRow } from "@/lib/excel/types";
import type { InventoryImportData } from "@/lib/excel";
import type { InventorySearchItem } from "@/api/inventory/inventory.type";

// ─── Props ─────────────────────────────────────────────────────────────────

interface InventoryImportPreviewProps {
  /** Rows produced by parseFile() — raw mapped data, not yet validated */
  previewRows: PreviewRow[];
  /** Existing inventory items from API — used for diff comparison (keyed by productFranchiseId) */
  existingItems: InventorySearchItem[];
  /** Called when user cancels — parent should clear preview state */
  onCancel: () => void;
  /** Called with validated data of selected rows when user confirms */
  onConfirm: (data: InventoryImportData[]) => Promise<void>;
  /** True while the confirm API call is in flight */
  isSaving?: boolean;
  /** Validation errors from validateRows() — keyed by row number */
  rowErrors: Record<number, string[]>;
}

// ─── Diff helpers ──────────────────────────────────────────────────────────

const COMPARABLE_FIELDS: (keyof InventoryImportData)[] = [
  "quantity",
  "alertThreshold",
];

/** Returns which fields changed compared to the existing item */
function getDiffFields(
  row: InventoryImportData,
  existing: InventorySearchItem | undefined,
): Set<keyof InventoryImportData> {
  if (!existing) return new Set(COMPARABLE_FIELDS);
  const changed = new Set<keyof InventoryImportData>();
  if (row.quantity !== existing.quantity) changed.add("quantity");
  if (row.alertThreshold !== existing.alertThreshold)
    changed.add("alertThreshold");
  return changed;
}

// ─── Column header labels ──────────────────────────────────────────────────
// isActive is rendered separately as an Active/Inactive badge column.
type DisplayColumn =
  | "productName"
  | "franchiseName"
  | "quantity"
  | "alertThreshold";

const COLUMN_LABELS: Record<DisplayColumn, string> = {
  productName: "Product Name",
  franchiseName: "Franchise",
  quantity: "Quantity",
  alertThreshold: "Alert Threshold",
};

// ─── Component ─────────────────────────────────────────────────────────────

export const InventoryImportPreview = ({
  previewRows,
  existingItems,
  onCancel,
  onConfirm,
  isSaving = false,
  rowErrors,
}: InventoryImportPreviewProps) => {
  // ── State ─────────────────────────────────────────────────────────────────

  /** Which row indices (0-based) are currently checked.
   * Initialised with only valid (non-error, non-duplicate) rows pre-checked.
   * Error determination is inlined here so it runs once on mount without
   * depending on useMemo hooks that haven't been computed yet.
   */
  const [checkedIndices, setCheckedIndices] = useState<Set<number>>(() => {
    // Minimal parse — only productName/franchiseName needed for duplicate check
    const names = previewRows.map((r) => ({
      productName: String(r.data.productName ?? ""),
      franchiseName: String(r.data.franchiseName ?? ""),
    }));

    // Compute duplicate row numbers
    const counts = new Map<string, number>();
    for (const { productName, franchiseName } of names) {
      const k = `${productName}|${franchiseName}`;
      counts.set(k, (counts.get(k) ?? 0) + 1);
    }
    const errorRowNums = new Set<number>(Object.keys(rowErrors).map(Number));
    previewRows.forEach((pRow, i) => {
      if (
        (counts.get(`${names[i].productName}|${names[i].franchiseName}`) ?? 0) >
        1
      ) {
        errorRowNums.add(pRow._rowNumber);
      }
    });

    // Only pre-check rows that have no errors
    return new Set(
      previewRows
        .map((pRow, i) => ({ i, rn: pRow._rowNumber }))
        .filter(({ rn }) => !errorRowNums.has(rn))
        .map(({ i }) => i),
    );
  });

  // ── Derived data ──────────────────────────────────────────────────────────

  /** Parse each preview row into InventoryImportData (coerce numbers from strings) */
  const parsedRows: InventoryImportData[] = useMemo(
    () =>
      previewRows.map((r) => ({
        productName: String(r.data.productName ?? ""),
        franchiseName: String(r.data.franchiseName ?? ""),
        quantity: Number(r.data.quantity ?? 0),
        alertThreshold: Number(r.data.alertThreshold ?? 0),
        isActive:
          String(r.data.isActive ?? "")
            .trim()
            .toLowerCase() === "active",
      })),
    [previewRows],
  );

  /** Existing items indexed by "productName|franchiseName" for O(1) lookup */
  const existingByKey = useMemo(() => {
    const map = new Map<string, InventorySearchItem>();
    for (const item of existingItems) {
      map.set(`${item.productName}|${item.franchiseName}`, item);
    }
    return map;
  }, [existingItems]);

  /** Keys that appear more than once within the import file itself */
  const duplicateKeys = useMemo(() => {
    const counts = new Map<string, number>();
    for (const row of parsedRows) {
      const key = `${row.productName}|${row.franchiseName}`;
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
    const dupes = new Set<string>();
    for (const [key, count] of counts.entries()) {
      if (count > 1) dupes.add(key);
    }
    return dupes;
  }, [parsedRows]);

  const effectiveRowErrors = useMemo(() => {
    const merged: Record<number, string[]> = {};
    for (const [rn, msgs] of Object.entries(rowErrors)) {
      merged[Number(rn)] = [...msgs];
    }
    previewRows.forEach((pRow, i) => {
      const row = parsedRows[i];
      if (duplicateKeys.has(`${row.productName}|${row.franchiseName}`)) {
        const rn = pRow._rowNumber;
        merged[rn] = [...(merged[rn] ?? []), "Duplicate row in file"];
      }
    });
    return merged;
  }, [rowErrors, previewRows, parsedRows, duplicateKeys]);

  const errorRowCount = previewRows.filter(
    (r) => !!effectiveRowErrors[r._rowNumber]?.length,
  ).length;

  /** 0-based indices that have errors — checkboxes are disabled for these */
  const errorIndices = useMemo(() => {
    const s = new Set<number>();
    previewRows.forEach((pRow, i) => {
      if (effectiveRowErrors[pRow._rowNumber]?.length) s.add(i);
    });
    return s;
  }, [previewRows, effectiveRowErrors]);

  /** 0-based indices of valid (non-error) rows */
  const validIndices = useMemo(
    () =>
      new Set(previewRows.map((_, i) => i).filter((i) => !errorIndices.has(i))),
    [previewRows, errorIndices],
  );

  const allValidChecked =
    validIndices.size > 0 &&
    [...validIndices].every((i) => checkedIndices.has(i));
  const someChecked = checkedIndices.size > 0 && !allValidChecked;

  // ── Checkbox handlers ─────────────────────────────────────────────────────

  const toggleAll = () => {
    if (allValidChecked) {
      setCheckedIndices(new Set());
    } else {
      setCheckedIndices(new Set(validIndices));
    }
  };

  const toggleRow = (index: number) => {
    if (errorIndices.has(index)) return;
    setCheckedIndices((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  // ── Confirm handler ───────────────────────────────────────────────────────

  const handleConfirm = async () => {
    const selectedData = parsedRows.filter((_, i) => checkedIndices.has(i));
    await onConfirm(selectedData);
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="h-full flex flex-col gap-4">
      {/* Header bar */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="font-semibold text-[#6D4C41]">
            Xem trước dữ liệu import
          </span>
          <Badge
            variant="outline"
            className="text-xs border-blue-300 text-blue-700"
          >
            <Info className="w-3 h-3 mr-1" />
            {previewRows.length} dòng tổng
          </Badge>
          {errorRowCount > 0 && (
            <Badge
              variant="outline"
              className="text-xs border-red-300 text-red-600"
            >
              <AlertTriangle className="w-3 h-3 mr-1" />
              {errorRowCount} dòng lỗi
            </Badge>
          )}

          <Badge
            variant="outline"
            className="text-xs border-green-300 text-green-700"
          >
            {checkedIndices.size} dòng được chọn
          </Badge>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onCancel}
            disabled={isSaving}
            className="border-gray-300 text-gray-600 hover:bg-gray-100 rounded-lg cursor-pointer"
          >
            <X className="w-4 h-4 mr-1" />
            Hủy
          </Button>
          <Button
            size="sm"
            onClick={handleConfirm}
            disabled={isSaving || checkedIndices.size === 0}
            className="bg-[#6D4C41] hover:bg-[#3E2723] text-white rounded-lg cursor-pointer"
          >
            <Save className="w-4 h-4 mr-1" />
            {isSaving
              ? "Saving..."
              : `Confirm (${checkedIndices.size} valid rows)`}
          </Button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <span className="inline-block w-3 h-3 rounded-sm bg-pink-100 border border-pink-300" />
          Dòng mới
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block font-bold text-red-600">A</span>
          Trường thay đổi
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block w-3 h-3 rounded-sm bg-red-100 border border-red-300" />
          Lỗi / Duplicate
        </span>
      </div>

      {/* Table */}
      <div className="flex-1 min-h-0 overflow-auto rounded-xl border border-pink-200 bg-pink-50">
        <table className="w-full text-sm">
          <thead className="sticky top-0 z-10">
            <tr className="border-b border-pink-200 bg-pink-100">
              {/* Select-all checkbox */}
              <th className="w-10 px-3 py-3 text-center">
                <button
                  type="button"
                  onClick={toggleAll}
                  className="text-[#6D4C41] hover:text-[#3E2723] transition-colors cursor-pointer"
                  aria-label="Chọn tất cả"
                >
                  {allValidChecked ? (
                    <CheckSquare className="w-4 h-4" />
                  ) : someChecked ? (
                    /* indeterminate — show filled square with dash via opacity trick */
                    <CheckSquare className="w-4 h-4 opacity-50" />
                  ) : (
                    <Square className="w-4 h-4" />
                  )}
                </button>
              </th>

              {/* Row number */}
              <th className="px-3 py-3 text-left font-medium text-gray-500 w-14">
                #
              </th>

              {/* Data columns */}
              {(Object.keys(COLUMN_LABELS) as DisplayColumn[]).map((key) => (
                <th
                  key={key}
                  className="px-3 py-3 text-left font-medium text-gray-700"
                >
                  {COLUMN_LABELS[key]}
                </th>
              ))}

              {/* Active/Inactive status column */}
              <th className="px-3 py-3 text-left font-medium text-gray-700 w-24">
                Status
              </th>

              {/* Diff/change column */}
              <th className="px-3 py-3 text-left font-medium text-gray-700 w-28">
                Change
              </th>
            </tr>
          </thead>

          <tbody>
            {previewRows.map((previewRow, index) => {
              const row = parsedRows[index];
              const existing = existingByKey.get(
                `${row.productName}|${row.franchiseName}`,
              );
              const isNew = !existing;
              const diffFields = getDiffFields(row, existing);
              const errors = effectiveRowErrors[previewRow._rowNumber] ?? [];
              const hasError = errors.length > 0;
              const isDuplicate = duplicateKeys.has(
                `${row.productName}|${row.franchiseName}`,
              );
              const isChecked = checkedIndices.has(index);

              const rowBg = hasError
                ? "bg-red-50"
                : isNew
                  ? "bg-pink-100"
                  : "bg-white";

              return (
                <tr
                  key={index}
                  className={`border-b border-pink-100 transition-colors ${rowBg} ${
                    isChecked ? "opacity-100" : "opacity-50"
                  }`}
                >
                  {/* Row checkbox */}
                  <td className="px-3 py-2.5 text-center">
                    <button
                      type="button"
                      onClick={() => toggleRow(index)}
                      disabled={errorIndices.has(index)}
                      className={`transition-colors ${
                        errorIndices.has(index)
                          ? "text-gray-300 cursor-not-allowed"
                          : "text-[#6D4C41] hover:text-[#3E2723] cursor-pointer"
                      }`}
                      aria-label={`Chọn dòng ${index + 1}`}
                    >
                      {isChecked ? (
                        <CheckSquare className="w-4 h-4" />
                      ) : (
                        <Square className="w-4 h-4" />
                      )}
                    </button>
                  </td>

                  {/* Row number (Excel row) */}
                  <td className="px-3 py-2.5 text-gray-400 text-xs">
                    {previewRow._rowNumber}
                  </td>

                  {/* productName */}
                  <td className="px-3 py-2.5 text-gray-800 font-medium">
                    {row.productName || (
                      <span className="text-red-400 italic">trống</span>
                    )}
                  </td>

                  {/* franchiseName */}
                  <td className="px-3 py-2.5 text-gray-600">
                    {row.franchiseName || (
                      <span className="text-red-400 italic">trống</span>
                    )}
                  </td>

                  {/* quantity */}
                  <td
                    className={`px-3 py-2.5 ${
                      diffFields.has("quantity")
                        ? "font-bold text-red-600"
                        : "text-gray-700"
                    }`}
                  >
                    {row.quantity}
                    {diffFields.has("quantity") && existing && (
                      <span className="ml-1 text-xs font-normal text-gray-400">
                        (cũ: {existing.quantity})
                      </span>
                    )}
                  </td>

                  {/* alertThreshold */}
                  <td
                    className={`px-3 py-2.5 ${
                      diffFields.has("alertThreshold")
                        ? "font-bold text-red-600"
                        : "text-gray-700"
                    }`}
                  >
                    {row.alertThreshold}
                    {diffFields.has("alertThreshold") && existing && (
                      <span className="ml-1 text-xs font-normal text-gray-400">
                        (cũ: {existing.alertThreshold})
                      </span>
                    )}
                  </td>

                  {/* Active / Inactive status */}
                  <td className="px-3 py-2.5">
                    {row.isActive ? (
                      <Badge
                        variant="outline"
                        className="text-xs border-green-300 text-green-700 bg-green-50"
                      >
                        Active
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="text-xs border-gray-300 text-gray-500 bg-gray-50"
                      >
                        Inactive
                      </Badge>
                    )}
                  </td>

                  {/* Change badge */}
                  <td className="px-3 py-2.5">
                    {hasError ? (
                      <Badge
                        variant="outline"
                        className="text-xs border-red-300 text-red-600 bg-red-50"
                        title={errors.join(" | ")}
                      >
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        {isDuplicate ? "Duplicate" : "Error"}
                      </Badge>
                    ) : isNew ? (
                      <Badge
                        variant="outline"
                        className="text-xs border-blue-300 text-blue-600 bg-blue-50"
                      >
                        Mới
                      </Badge>
                    ) : diffFields.size > 0 ? (
                      <Badge
                        variant="outline"
                        className="text-xs border-orange-300 text-orange-600 bg-orange-50"
                      >
                        Cập nhật
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="text-xs border-gray-300 text-gray-500"
                      >
                        Không đổi
                      </Badge>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Per-row error list */}
      {Object.keys(effectiveRowErrors).length > 0 && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm">
          <p className="font-medium text-red-700 mb-2 flex items-center gap-1">
            <AlertTriangle className="w-4 h-4" />
            Error details
          </p>
          <ul className="space-y-1 text-red-600 text-xs">
            {Object.entries(effectiveRowErrors).map(([rowNum, msgs]) =>
              msgs.map((msg, i) => (
                <li key={`${rowNum}-${i}`}>
                  Row {rowNum}: {msg}
                </li>
              )),
            )}
          </ul>
        </div>
      )}
    </div>
  );
};
