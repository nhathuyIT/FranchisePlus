import { useState, useCallback } from "react";
import type {
  ImportConfig,
  ImportResult,
  ImportRowError,
  PreviewResult,
  PreviewRow,
} from "./types";

interface UseExcelImportReturn<T> {
  /**
   * Step 1 — Parse the file and build a virtual preview table.
   * No Zod validation is performed here; the raw mapped rows are stored in `preview`.
   */
  parseFile: (file: File) => Promise<PreviewResult>;
  /**
   * Step 2 — Validate rows with the Zod schema.
   * Pass a subset of `preview.rows` to validate only selected rows,
   * or omit the argument to validate all rows in the current preview.
   */
  validateRows: (rows?: PreviewRow[]) => ImportResult<T>;
  /** True while the file is being parsed (Step 1) */
  isParsing: boolean;
  /** The virtual table produced by `parseFile`. Null until Step 1 completes. */
  preview: PreviewResult | null;
  /** The validation result produced by `validateRows`. Null until Step 2 runs. */
  result: ImportResult<T> | null;
  error: Error | null;
  reset: () => void;
}

/**
 * Two-step hook for importing Excel / CSV files.
 *
 * ### Flow
 * ```
 * 1. parseFile(file)          → builds `preview` (virtual table, no validation)
 * 2. validateRows(rows?)      → validates with Zod, returns `result`
 * ```
 *
 * @example
 * ```tsx
 * const { parseFile, validateRows, isParsing, preview, result } = useExcelImport({
 *   schema: FranchiseImportSchema,
 *   headerMapping: FRANCHISE_HEADER_MAPPING,
 * });
 *
 * // Step 1 — on file input change
 * const handleFile = async (e) => {
 *   const file = e.target.files?.[0];
 *   if (file) await parseFile(file); // `preview` is now populated
 * };
 *
 * // Step 2 — user confirms (optionally pass selected rows)
 * const handleConfirm = () => {
 *   const importResult = validateRows(); // validates all preview rows
 *   if (importResult.success) submitToAPI(importResult.data);
 * };
 * ```
 */
export function useExcelImport<T>(
  config: ImportConfig<T>,
): UseExcelImportReturn<T> {
  const [isParsing, setIsParsing] = useState(false);
  const [preview, setPreview] = useState<PreviewResult | null>(null);
  const [result, setResult] = useState<ImportResult<T> | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const reset = useCallback(() => {
    setPreview(null);
    setResult(null);
    setError(null);
  }, []);

  // ── Step 1: Parse & map headers — build the virtual preview table ──────────
  const parseFile = useCallback(
    async (file: File): Promise<PreviewResult> => {
      setIsParsing(true);
      setError(null);
      setPreview(null);
      setResult(null);

      try {
        // Read file as ArrayBuffer (async, non-blocking)
        const arrayBuffer = await file.arrayBuffer();
        await new Promise((resolve) => setTimeout(resolve, 0));

        // Parse workbook with SheetJS
        const XLSX = await import("xlsx");
        const workbook = XLSX.read(arrayBuffer, { type: "array" });
        const firstSheetName = workbook.SheetNames[0];

        if (!firstSheetName) {
          throw new Error("The Excel file contains no sheets");
        }

        const worksheet = workbook.Sheets[firstSheetName];
        const rawRows: Record<string, unknown>[] = XLSX.utils.sheet_to_json(
          worksheet,
          { defval: "" },
        );

        if (rawRows.length === 0) {
          const emptyPreview: PreviewResult = { keys: [], rows: [], totalRows: 0 };
          setPreview(emptyPreview);
          return emptyPreview;
        }

        // Map display headers → data keys and apply optional pre-transform
        const mappedRows: PreviewRow[] = rawRows.map((raw, i) => {
          const mapped: Record<string, unknown> = {};
          for (const [excelHeader, value] of Object.entries(raw)) {
            const trimmedHeader = excelHeader.trim();
            const dataKey = config.headerMapping[trimmedHeader] ?? trimmedHeader;
            mapped[dataKey] = value;
          }
          return {
            _rowNumber: i + 2, // row 1 is the header in Excel
            data: config.preTransform ? config.preTransform(mapped) : mapped,
          };
        });

        const keys = Object.keys(mappedRows[0]?.data ?? {});
        const previewResult: PreviewResult = {
          keys,
          rows: mappedRows,
          totalRows: mappedRows.length,
        };

        setPreview(previewResult);
        return previewResult;
      } catch (err) {
        const parseError = err instanceof Error ? err : new Error("Parse failed");
        setError(parseError);
        throw parseError;
      } finally {
        setIsParsing(false);
      }
    },
    [config],
  );

  // ── Step 2: Validate rows with Zod ────────────────────────────────────────
  const validateRows = useCallback(
    (rows?: PreviewRow[]): ImportResult<T> => {
      const targetRows = rows ?? preview?.rows ?? [];

      const validData: T[] = [];
      const allErrors: ImportRowError[] = [];

      for (const row of targetRows) {
        const parsed = config.schema.safeParse(row.data);
        if (parsed.success) {
          validData.push(parsed.data);
        } else {
          for (const issue of parsed.error.issues) {
            allErrors.push({
              row: row._rowNumber,
              field: issue.path.join(".") || "_row",
              message: issue.message,
              value: row.data[issue.path[0] as string] ?? null,
            });
          }
        }
      }

      const importResult: ImportResult<T> = {
        success: allErrors.length === 0,
        data: validData,
        errors: allErrors,
        totalRows: targetRows.length,
        validRows: validData.length,
        invalidRows: targetRows.length - validData.length,
      };

      setResult(importResult);
      return importResult;
    },
    [config, preview],
  );

  return { parseFile, validateRows, isParsing, preview, result, error, reset };
}

