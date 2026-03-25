import { useCallback, useEffect, useMemo, useState } from "react";
import type { InventorySearchItem } from "@/api/inventory/inventory.type";

type InventoryImportField =
  | "_row"
  | "productName"
  | "franchiseName"
  | "quantity"
  | "alertThreshold";

interface InventoryImportRowError {
  field: InventoryImportField;
  message: string;
}

export interface InventoryImportIssue {
  rowNumber: number;
  messages: string[];
}

interface InventoryImportRowResult {
  rowNumber: number;
  importKey: string;
  productName: string;
  franchiseName: string;
  quantityRaw: string;
  alertThresholdRaw: string;
  quantity: number | null;
  alertThreshold: number | null;
  matchedItem: InventorySearchItem | null;
  nextItem: InventorySearchItem | null;
  errors: InventoryImportRowError[];
  isValid: boolean;
  isChanged: boolean;
}

export interface InventoryImportRunResult {
  success: boolean;
  message: string;
  totalRows: number;
  validRows: number;
  invalidRows: number;
  appliedRows: number;
  unchangedRows: number;
  errors: InventoryImportIssue[];
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
  appliedRows: 0,
  unchangedRows: 0,
  errors: [],
};

const normalizeHeader = (value: unknown) =>
  String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

const normalizeValue = (value: unknown) => String(value ?? "").trim();

const buildInventoryKey = (productName: string, franchiseName: string) =>
  `${productName.trim().toLowerCase()}::${franchiseName.trim().toLowerCase()}`;

const groupInventoryItemsByKey = (items: InventorySearchItem[]) => {
  const groupedItems = new Map<string, InventorySearchItem[]>();

  items.forEach((item) => {
    const key = buildInventoryKey(item.productName, item.franchiseName);
    const existingItems = groupedItems.get(key);

    if (existingItems) {
      existingItems.push(item);
      return;
    }

    groupedItems.set(key, [item]);
  });

  return groupedItems;
};

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

const validateImportedRows = (
  parsedRows: ParsedExcelRow[],
  currentItems: InventorySearchItem[],
): InventoryImportRowResult[] => {
  const existingItemsByKey = groupInventoryItemsByKey(currentItems);
  const fileOccurrenceByKey = new Map<string, number>();

  return parsedRows.map<InventoryImportRowResult>((row) => {
    const errors: InventoryImportRowError[] = [];
    const importKey = buildInventoryKey(row.productName, row.franchiseName);
    const fileOccurrenceIndex =
      row.productName && row.franchiseName
        ? (fileOccurrenceByKey.get(importKey) ?? 0)
        : -1;
    const matchedItem =
      fileOccurrenceIndex >= 0
        ? (existingItemsByKey.get(importKey)?.[fileOccurrenceIndex] ?? null)
        : null;
    const quantity = parseInventoryNumber(row.quantityRaw);
    const alertThreshold = parseInventoryNumber(row.alertThresholdRaw);

    if (fileOccurrenceIndex >= 0) {
      fileOccurrenceByKey.set(importKey, fileOccurrenceIndex + 1);
    }

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

    const nextItem =
      matchedItem && quantity !== null && alertThreshold !== null
        ? quantity === matchedItem.quantity &&
          alertThreshold === matchedItem.alertThreshold
          ? matchedItem
          : {
              ...matchedItem,
              quantity,
              alertThreshold,
            }
        : null;

    const isValid = errors.length === 0 && nextItem !== null;
    const isChanged =
      isValid &&
      matchedItem !== null &&
      (nextItem.quantity !== matchedItem.quantity ||
        nextItem.alertThreshold !== matchedItem.alertThreshold);

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
      nextItem,
      errors,
      isValid,
      isChanged,
    };
  });
};

const mergeImportedRows = (
  currentItems: InventorySearchItem[],
  rowResults: InventoryImportRowResult[],
) => {
  const updatesById = new Map<string, InventorySearchItem>();

  rowResults.forEach((row) => {
    if (!row.isValid || !row.isChanged || row.nextItem === null) {
      return;
    }

    updatesById.set(String(row.nextItem.id), row.nextItem);
  });

  if (updatesById.size === 0) {
    return currentItems;
  }

  return currentItems.map(
    (item) => updatesById.get(String(item.id)) ?? item,
  );
};

const buildImportIssues = (
  rowResults: InventoryImportRowResult[],
): InventoryImportIssue[] =>
  rowResults
    .filter((row) => !row.isValid)
    .map((row) => ({
      rowNumber: row.rowNumber,
      messages: Array.from(new Set(row.errors.map((error) => error.message))),
    }));

export const useUpdateInventoryFromExcel = (
  sourceItems: InventorySearchItem[],
) => {
  const [mainTableData, setMainTableData] =
    useState<InventorySearchItem[]>(sourceItems);
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

  // Keep local edits/imported values until the actual server payload changes.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const syncedSourceItems = useMemo(() => sourceItems, [sourceSignature]);

  useEffect(() => {
    setMainTableData(syncedSourceItems);
  }, [syncedSourceItems]);

  const importFromExcel = useCallback(
    async (file: File): Promise<InventoryImportRunResult> => {
      setIsImporting(true);

      try {
        const parsedRows = await parseExcelRows(file);
        const rowResults = validateImportedRows(parsedRows, mainTableData);
        const validRows = rowResults.filter((row) => row.isValid).length;
        const invalidRows = rowResults.length - validRows;
        const appliedRows = rowResults.filter((row) => row.isChanged).length;
        const unchangedRows = validRows - appliedRows;
        const errors = buildImportIssues(rowResults);

        if (appliedRows > 0) {
          setMainTableData((currentItems) =>
            mergeImportedRows(currentItems, rowResults),
          );
        }

        if (validRows === 0) {
          return {
            success: false,
            message: `No valid rows were imported. ${invalidRows} row(s) contain errors.`,
            totalRows: rowResults.length,
            validRows,
            invalidRows,
            appliedRows,
            unchangedRows,
            errors,
          };
        }

        const messageParts = [
          `Processed ${validRows} valid row(s)`,
          appliedRows > 0
            ? `${appliedRows} updated`
            : "0 updated",
          unchangedRows > 0
            ? `${unchangedRows} unchanged`
            : "0 unchanged",
        ];

        if (invalidRows > 0) {
          messageParts.push(`${invalidRows} skipped`);
        }

        return {
          success: true,
          message: `${messageParts.join(", ")}.`,
          totalRows: rowResults.length,
          validRows,
          invalidRows,
          appliedRows,
          unchangedRows,
          errors,
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

  const resetMainTableData = useCallback(() => {
    setMainTableData(syncedSourceItems);
  }, [syncedSourceItems]);

  return {
    mainTableData,
    baselineTableData: syncedSourceItems,
    isImporting,
    importFromExcel,
    resetMainTableData,
  };
};
