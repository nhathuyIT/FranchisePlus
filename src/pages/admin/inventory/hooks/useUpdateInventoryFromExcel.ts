import { useCallback, useEffect, useMemo, useState } from "react";
import type { InventorySearchItem } from "@/api/inventory/inventory.type";

type InventoryImportField =
  | "_row"
  | "productName"
  | "franchiseName"
  | "quantity"
  | "alertThreshold";

export interface InventoryImportPreviewError {
  field: InventoryImportField;
  message: string;
}

export interface InventoryImportPreviewRow {
  rowNumber: number;
  importKey: string;
  productName: string;
  franchiseName: string;
  quantityRaw: string;
  alertThresholdRaw: string;
  quantity: number | null;
  alertThreshold: number | null;
  matchedItem: InventorySearchItem | null;
  previewItem: InventorySearchItem | null;
  errors: InventoryImportPreviewError[];
  isValid: boolean;
}

interface InventoryImportRunResult {
  success: boolean;
  message: string;
  totalRows: number;
  validRows: number;
  invalidRows: number;
}

interface ParsedExcelRow {
  rowNumber: number;
  productName: string;
  franchiseName: string;
  quantityRaw: string;
  alertThresholdRaw: string;
}

const REQUIRED_HEADER_SEQUENCE = [
  "productName",
  "franchiseName",
  "quantity",
  "alertThreshold",
] as const;

type CanonicalHeader = (typeof REQUIRED_HEADER_SEQUENCE)[number];

const HEADER_ALIASES: Record<string, CanonicalHeader> = {
  product: "productName",
  productname: "productName",
  producttitle: "productName",
  productsku: "productName",
  franchise: "franchiseName",
  franchisename: "franchiseName",
  quantity: "quantity",
  current: "quantity",
  qty: "quantity",
  threshold: "alertThreshold",
  alertthreshold: "alertThreshold",
};

const EMPTY_IMPORT_RESULT: InventoryImportRunResult = {
  success: false,
  message: "",
  totalRows: 0,
  validRows: 0,
  invalidRows: 0,
};

const normalizeHeader = (value: unknown) =>
  String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

const normalizeValue = (value: unknown) => String(value ?? "").trim();

const buildInventoryKey = (productName: string, franchiseName: string) =>
  `${productName.trim().toLowerCase()}::${franchiseName.trim().toLowerCase()}`;

const parseInventoryNumber = (value: string): number | null => {
  if (!value) return null;
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0) return null;
  return parsed;
};

const getSchemaErrorMessage = () =>
  "Wrong index/schema. Expected columns in order: Product, Franchise, Quantity, Alert Threshold.";

const isSameHeaderSequence = (headers: Array<CanonicalHeader | null>) =>
  REQUIRED_HEADER_SEQUENCE.every((header, index) => headers[index] === header);

const resolveHeaderSequence = (
  headerCells: unknown[],
): Array<CanonicalHeader | null> =>
  headerCells.map((header) => HEADER_ALIASES[normalizeHeader(header)] ?? null);

const hasRowContent = (row: unknown[]) =>
  row.some((cell) => normalizeValue(cell).length > 0);

const parseExcelRows = async (file: File): Promise<ParsedExcelRow[]> => {
  const XLSX = await import("xlsx");
  const arrayBuffer = await file.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer, { type: "array" });
  const firstSheetName = workbook.SheetNames[0];

  if (!firstSheetName) {
    throw new Error("The Excel file contains no sheets.");
  }

  const worksheet = workbook.Sheets[firstSheetName];
  const rows = XLSX.utils.sheet_to_json<unknown[]>(worksheet, {
    header: 1,
    defval: "",
    blankrows: false,
  });

  if (rows.length === 0) {
    throw new Error("The file contains no data rows.");
  }

  const headerRow = Array.isArray(rows[0]) ? rows[0] : [];
  const resolvedHeaders = resolveHeaderSequence(headerRow);

  if (!isSameHeaderSequence(resolvedHeaders)) {
    throw new Error(getSchemaErrorMessage());
  }

  const dataRows = rows
    .slice(1)
    .filter((row): row is unknown[] => Array.isArray(row) && hasRowContent(row));

  if (dataRows.length === 0) {
    throw new Error("The file contains no data rows.");
  }

  const columnIndexes = REQUIRED_HEADER_SEQUENCE.reduce(
    (acc, header) => {
      acc[header] = resolvedHeaders.indexOf(header);
      return acc;
    },
    {} as Record<CanonicalHeader, number>,
  );

  return dataRows.map((row, index) => ({
    rowNumber: index + 2,
    productName: normalizeValue(row[columnIndexes.productName]),
    franchiseName: normalizeValue(row[columnIndexes.franchiseName]),
    quantityRaw: normalizeValue(row[columnIndexes.quantity]),
    alertThresholdRaw: normalizeValue(row[columnIndexes.alertThreshold]),
  }));
};

export const useUpdateInventoryFromExcel = (
  sourceItems: InventorySearchItem[],
) => {
  const [mainTableData, setMainTableData] =
    useState<InventorySearchItem[]>(sourceItems);
  const [previewTableData, setPreviewTableData] = useState<
    InventoryImportPreviewRow[]
  >([]);
  const [isImportPreviewMode, setIsImportPreviewMode] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  const sourceSignature = useMemo(
    () =>
      JSON.stringify(
        sourceItems.map((item) => ({
          id: item.id,
          productName: item.productName,
          franchiseName: item.franchiseName,
          quantity: item.quantity,
          alertThreshold: item.alertThreshold,
          updatedAt: item.updatedAt,
        })),
      ),
    [sourceItems],
  );

  const syncedSourceItems = useMemo(() => sourceItems, [sourceSignature]);

  useEffect(() => {
    setMainTableData(syncedSourceItems);
    setPreviewTableData([]);
    setIsImportPreviewMode(false);
  }, [syncedSourceItems]);

  const importFromExcel = useCallback(
    async (file: File): Promise<InventoryImportRunResult> => {
      setIsImporting(true);
      setIsImportPreviewMode(false);
      setPreviewTableData([]);

      try {
        const parsedRows = await parseExcelRows(file);
        const existingCounts = new Map<string, number>();
        const existingItemsByKey = new Map<string, InventorySearchItem>();
        const fileCounts = new Map<string, number>();

        mainTableData.forEach((item) => {
          const key = buildInventoryKey(item.productName, item.franchiseName);
          existingCounts.set(key, (existingCounts.get(key) ?? 0) + 1);
          if (!existingItemsByKey.has(key)) {
            existingItemsByKey.set(key, item);
          }
        });

        parsedRows.forEach((row) => {
          const key = buildInventoryKey(row.productName, row.franchiseName);
          if (!key || !row.productName || !row.franchiseName) return;
          fileCounts.set(key, (fileCounts.get(key) ?? 0) + 1);
        });

        const now = new Date().toISOString();
        const previewRows = parsedRows.map<InventoryImportPreviewRow>((row) => {
          const errors: InventoryImportPreviewError[] = [];
          const importKey = buildInventoryKey(row.productName, row.franchiseName);
          const matchedItem = existingItemsByKey.get(importKey) ?? null;
          const quantity = parseInventoryNumber(row.quantityRaw);
          const alertThreshold = parseInventoryNumber(row.alertThresholdRaw);

          if (!row.productName || !row.franchiseName) {
            errors.push({
              field: "productName",
              message: "Wrong format.",
            });
          }

          if (row.quantityRaw && quantity === null) {
            errors.push({
              field: "quantity",
              message: "Wrong format.",
            });
          }

          if (row.alertThresholdRaw && alertThreshold === null) {
            errors.push({
              field: "alertThreshold",
              message: "Wrong format.",
            });
          }

          if (!row.quantityRaw) {
            errors.push({
              field: "quantity",
              message: "Wrong format.",
            });
          }

          if (!row.alertThresholdRaw) {
            errors.push({
              field: "alertThreshold",
              message: "Wrong format.",
            });
          }

          if (!matchedItem) {
            errors.push({
              field: "productName",
              message: "New data detected.",
            });
          }

          if (importKey && (fileCounts.get(importKey) ?? 0) > 1) {
            errors.push({
              field: "productName",
              message: "Duplicate data detected.",
            });
          }

          if (importKey && (existingCounts.get(importKey) ?? 0) > 1) {
            errors.push({
              field: "productName",
              message: "Duplicate data detected.",
            });
          }

          const previewItem =
            matchedItem && quantity !== null && alertThreshold !== null
              ? {
                  ...matchedItem,
                  quantity,
                  alertThreshold,
                  updatedAt: now,
                }
              : null;

          return {
            rowNumber: row.rowNumber,
            importKey,
            productName: row.productName,
            franchiseName: row.franchiseName,
            quantityRaw: row.quantityRaw,
            alertThresholdRaw: row.alertThresholdRaw,
            quantity,
            alertThreshold,
            matchedItem,
            previewItem,
            errors,
            isValid: errors.length === 0 && previewItem !== null,
          };
        });

        const validRows = previewRows.filter((row) => row.isValid).length;
        const invalidRows = previewRows.length - validRows;

        setPreviewTableData(previewRows);
        setIsImportPreviewMode(true);

        return {
          success: true,
          message:
            invalidRows > 0
              ? `Preview ready. ${invalidRows} row(s) need fixes before accepting.`
              : `Preview ready. ${validRows} row(s) are ready to apply.`,
          totalRows: previewRows.length,
          validRows,
          invalidRows,
        };
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Import failed.";
        return {
          ...EMPTY_IMPORT_RESULT,
          message,
        };
      } finally {
        setIsImporting(false);
      }
    },
    [mainTableData],
  );

  const acceptImportedRows = useCallback(
    (selectedRowNumbers: number[]) => {
      const selectedRows = previewTableData.filter(
        (row) => selectedRowNumbers.includes(row.rowNumber) && row.isValid,
      );
      const acceptedItems = selectedRows
        .map((row) => row.previewItem)
        .filter((row): row is InventorySearchItem => row !== null);

      setMainTableData(acceptedItems);
      setPreviewTableData([]);
      setIsImportPreviewMode(false);

      return acceptedItems;
    },
    [previewTableData],
  );

  const cancelImportPreview = useCallback(() => {
    setPreviewTableData([]);
    setIsImportPreviewMode(false);
  }, []);

  const resetMainTableData = useCallback(() => {
    setMainTableData(syncedSourceItems);
  }, [syncedSourceItems]);

  return {
    mainTableData,
    baselineTableData: syncedSourceItems,
    previewTableData,
    isImportPreviewMode,
    isImporting,
    importFromExcel,
    acceptImportedRows,
    cancelImportPreview,
    resetMainTableData,
  };
};
