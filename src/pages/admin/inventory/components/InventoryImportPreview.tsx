/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, CheckSquare2, Info, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { InventoryImportPreviewRow } from "../hooks/useUpdateInventoryFromExcel";

interface InventoryImportPreviewProps {
  rows: InventoryImportPreviewRow[];
  onAccept: (selectedRowNumbers: number[]) => void;
  onCancel: () => void;
}

const getFieldErrors = (
  row: InventoryImportPreviewRow,
  field: "productName" | "franchiseName" | "quantity" | "alertThreshold",
) =>
  row.errors.filter((error) => error.field === field || error.field === "_row");

const PreviewCell = ({
  value,
  helper,
  errors,
}: {
  value: string | number;
  helper?: string;
  errors: string[];
}) => {
  const hasError = errors.length > 0;

  return (
    <div
      className={[
        "rounded-lg border px-3 py-2",
        hasError ? "border-red-300 bg-red-50" : "border-[#E8DFD6] bg-white",
      ].join(" ")}
    >
      <div className="font-medium text-[#3E2723]">{value}</div>
      {helper ? <p className="mt-1 text-xs text-[#8D6E63]">{helper}</p> : null}
      {errors.map((error) => (
        <p key={error} className="mt-1 text-xs text-red-600">
          {error}
        </p>
      ))}
    </div>
  );
};

export const InventoryImportPreview = ({
  rows,
  onAccept,
  onCancel,
}: InventoryImportPreviewProps) => {
  const validRowNumbers = useMemo(
    () => rows.filter((row) => row.isValid).map((row) => row.rowNumber),
    [rows],
  );

  const [selectedRows, setSelectedRows] = useState<Set<number>>(
    () => new Set(validRowNumbers),
  );

  useEffect(() => {
    setSelectedRows(new Set(validRowNumbers));
  }, [validRowNumbers]);

  const validCount = validRowNumbers.length;
  const invalidCount = rows.length - validCount;
  const selectedCount = rows.filter(
    (row) => row.isValid && selectedRows.has(row.rowNumber),
  ).length;

  const allValidSelected =
    validCount > 0 &&
    validRowNumbers.every((rowNumber) => selectedRows.has(rowNumber));
  const someValidSelected = selectedCount > 0 && !allValidSelected;

  const toggleAll = () => {
    if (allValidSelected) {
      setSelectedRows(new Set());
      return;
    }

    setSelectedRows(new Set(validRowNumbers));
  };

  const toggleRow = (rowNumber: number) => {
    setSelectedRows((previous) => {
      const next = new Set(previous);
      if (next.has(rowNumber)) {
        next.delete(rowNumber);
      } else {
        next.add(rowNumber);
      }
      return next;
    });
  };

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-semibold text-blue-900">
              Import Preview
            </span>
            <Badge variant="outline" className="border-blue-300 text-blue-700">
              <Info className="mr-1 h-3 w-3" />
              {rows.length} row(s)
            </Badge>
            <Badge
              variant="outline"
              className="border-green-300 text-green-700"
            >
              {validCount} valid
            </Badge>
            <Badge variant="outline" className="border-red-300 text-red-600">
              {invalidCount} invalid
            </Badge>
            <Badge
              variant="outline"
              className="border-amber-300 text-amber-700"
            >
              {selectedCount} selected
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button
              type="button"
              onClick={() => onAccept(Array.from(selectedRows))}
              disabled={selectedCount === 0}
              className="bg-[#6D4C41] text-white hover:bg-[#3E2723]"
            >
              <Save className="mr-2 h-4 w-4" />
              Accept Changes
            </Button>
          </div>
        </div>

        <p className="mt-3 text-xs text-blue-800">
          This preview only updates the local table state. Reloading the page or
          refetching inventory will restore server data.
        </p>
      </div>

      <div className="flex-1 min-h-0 overflow-hidden rounded-2xl border-2 border-[#E8DFD6] bg-white shadow-sm">
        <div className="h-full overflow-auto scrollbar-hide scrollbar-invisible">
          <Table>
            <TableHeader>
              <TableRow className="border-b-2 border-[#E8DFD6] bg-gradient-to-r from-[#FAF8F5] to-[#F5F0EA]">
                <TableHead className="w-12">
                  <Checkbox
                    checked={
                      allValidSelected
                        ? true
                        : someValidSelected
                          ? "indeterminate"
                          : false
                    }
                    onCheckedChange={() => toggleAll()}
                    aria-label="Select all valid rows"
                  />
                </TableHead>
                <TableHead className="w-16">#</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Franchise</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Alert Threshold</TableHead>
                <TableHead>Result</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {rows.map((row) => {
                const productErrors = getFieldErrors(row, "productName").map(
                  (error) => error.message,
                );
                const franchiseErrors = getFieldErrors(
                  row,
                  "franchiseName",
                ).map((error) => error.message);
                const quantityErrors = getFieldErrors(row, "quantity").map(
                  (error) => error.message,
                );
                const thresholdErrors = getFieldErrors(
                  row,
                  "alertThreshold",
                ).map((error) => error.message);
                const isChanged =
                  row.isValid &&
                  !!row.previewItem &&
                  !!row.matchedItem &&
                  (row.previewItem.quantity !== row.matchedItem.quantity ||
                    row.previewItem.alertThreshold !==
                      row.matchedItem.alertThreshold);
                const isUnchanged =
                  row.isValid &&
                  !!row.previewItem &&
                  !!row.matchedItem &&
                  !isChanged;

                return (
                  <TableRow
                    key={row.rowNumber}
                    className={
                      row.isValid
                        ? "border-b border-[#E8DFD6] hover:bg-[#FAF8F5]"
                        : "border-b border-red-100 bg-red-50/60 hover:bg-red-50"
                    }
                  >
                    <TableCell>
                      <Checkbox
                        checked={selectedRows.has(row.rowNumber)}
                        disabled={!row.isValid}
                        onCheckedChange={() => toggleRow(row.rowNumber)}
                        aria-label={`Select row ${row.rowNumber}`}
                      />
                    </TableCell>
                    <TableCell className="text-xs text-[#8D6E63]">
                      {row.rowNumber}
                    </TableCell>
                    <TableCell className="align-top">
                      <PreviewCell
                        value={row.productName || "(empty)"}
                        errors={productErrors}
                      />
                    </TableCell>
                    <TableCell className="align-top">
                      <PreviewCell
                        value={row.franchiseName || "(empty)"}
                        errors={franchiseErrors}
                      />
                    </TableCell>
                    <TableCell className="align-top">
                      <PreviewCell
                        value={row.quantityRaw || "(empty)"}
                        helper={
                          row.matchedItem
                            ? `Current: ${row.matchedItem.quantity}`
                            : undefined
                        }
                        errors={quantityErrors}
                      />
                    </TableCell>
                    <TableCell className="align-top">
                      <PreviewCell
                        value={row.alertThresholdRaw || "(empty)"}
                        helper={
                          row.matchedItem
                            ? `Current: ${row.matchedItem.alertThreshold}`
                            : undefined
                        }
                        errors={thresholdErrors}
                      />
                    </TableCell>
                    <TableCell className="align-top">
                      <div className="flex min-w-[180px] flex-col gap-2">
                        <Badge
                          variant="outline"
                          className={
                            !row.isValid
                              ? "border-red-300 bg-red-50 text-red-600"
                              : isChanged
                                ? "border-amber-300 bg-amber-50 text-amber-700"
                                : "border-green-300 bg-green-50 text-green-700"
                          }
                        >
                          {!row.isValid ? (
                            <AlertTriangle className="mr-1 h-3 w-3" />
                          ) : isChanged ? (
                            <Info className="mr-1 h-3 w-3" />
                          ) : (
                            <CheckSquare2 className="mr-1 h-3 w-3" />
                          )}
                          {!row.isValid
                            ? "Needs attention"
                            : isChanged
                              ? "Changed"
                              : "Unchanged"}
                        </Badge>

                        {!row.isValid && (
                          <div className="space-y-1 text-xs text-red-600">
                            {row.errors.map((error, index) => (
                              <p
                                key={`${row.rowNumber}-${error.field}-${index}`}
                              >
                                {error.message}
                              </p>
                            ))}
                          </div>
                        )}

                        {isChanged && (
                          <p className="text-xs text-[#8D6E63]">
                            Will overwrite local row values.
                          </p>
                        )}

                        {isUnchanged && (
                          <p className="text-xs text-[#8D6E63]">
                            Matches the current local row values.
                          </p>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
        Invalid rows stay visible for review but cannot be selected. Accepting
        changes replaces the current inventory table with the selected valid
        rows only.
      </div>
    </div>
  );
};
