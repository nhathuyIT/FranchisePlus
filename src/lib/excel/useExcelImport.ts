import { useState, useCallback } from "react";
import type { ImportConfig, ImportResult, ImportRowError } from "./types";

interface UseExcelImportReturn<T> {
  importFromExcel: (file: File) => Promise<ImportResult<T>>;
  isImporting: boolean;
  result: ImportResult<T> | null;
  error: Error | null;
  reset: () => void;
}

/**
 * Hook for importing and validating Excel (.xlsx / .xls / .csv) files.
 *
 * - Reads the file asynchronously to keep the UI responsive.
 * - Maps headers via `headerMapping` (e.g. Vietnamese label → English key).
 * - Validates every row against the provided Zod `schema`.
 * - Returns a detailed error list per row on failure.
 *
 * @example
 * ```tsx
 * const { importFromExcel, isImporting, result } = useExcelImport({
 *   schema: FranchiseImportSchema,
 *   headerMapping: FRANCHISE_HEADER_MAPPING,
 * });
 *
 * const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
 *   const file = e.target.files?.[0];
 *   if (file) {
 *     const res = await importFromExcel(file);
 *     if (res.success) console.log("Valid data:", res.data);
 *     else console.log("Errors:", res.errors);
 *   }
 * };
 * ```
 */
export function useExcelImport<T>(
  config: ImportConfig<T>
): UseExcelImportReturn<T> {
  const [isImporting, setIsImporting] = useState(false);
  const [result, setResult] = useState<ImportResult<T> | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  const importFromExcel = useCallback(
    async (file: File): Promise<ImportResult<T>> => {
      setIsImporting(true);
      setError(null);
      setResult(null);

      try {
        // ── 1. Read file as ArrayBuffer (async) ────────────────────────
        const arrayBuffer = await file.arrayBuffer();

        // Yield to event loop
        await new Promise((resolve) => setTimeout(resolve, 0));

        // ── 2. Parse workbook ──────────────────────────────────────────
        const XLSX = await import("xlsx");
        const workbook = XLSX.read(arrayBuffer, { type: "array" });
        const firstSheetName = workbook.SheetNames[0];

        if (!firstSheetName) {
          throw new Error("The Excel file contains no sheets");
        }

        const worksheet = workbook.Sheets[firstSheetName];
        const rawRows: Record<string, unknown>[] = XLSX.utils.sheet_to_json(
          worksheet,
          { defval: "" }
        );

        if (rawRows.length === 0) {
          const emptyResult: ImportResult<T> = {
            success: false,
            data: [],
            errors: [
              {
                row: 0,
                field: "_file",
                message: "The file contains no data rows",
                value: null,
              },
            ],
            totalRows: 0,
            validRows: 0,
            invalidRows: 0,
          };
          setResult(emptyResult);
          return emptyResult;
        }

        // ── 3. Map headers ─────────────────────────────────────────────
        const mappedRows = rawRows.map((raw) => {
          const mapped: Record<string, unknown> = {};

          for (const [excelHeader, value] of Object.entries(raw)) {
            const trimmedHeader = excelHeader.trim();
            const dataKey =
              config.headerMapping[trimmedHeader] || trimmedHeader;
            mapped[dataKey] = value;
          }

          // Apply optional pre-transform
          return config.preTransform ? config.preTransform(mapped) : mapped;
        });

        // ── 4. Validate each row with Zod ──────────────────────────────
        const validData: T[] = [];
        const allErrors: ImportRowError[] = [];
        const CHUNK_SIZE = 100;

        for (let i = 0; i < mappedRows.length; i++) {
          // Yield between chunks so the UI stays responsive
          if (i > 0 && i % CHUNK_SIZE === 0) {
            await new Promise((resolve) => setTimeout(resolve, 0));
          }

          const rowNumber = i + 2; // +2 because row 1 is the header in Excel
          const row = mappedRows[i];
          const parsed = config.schema.safeParse(row);

          if (parsed.success) {
            validData.push(parsed.data);
          } else {
            // Extract detailed errors from ZodError
            for (const issue of parsed.error.issues) {
              allErrors.push({
                row: rowNumber,
                field: issue.path.join(".") || "_row",
                message: issue.message,
                value: row[issue.path[0] as string] ?? null,
              });
            }
          }
        }

        const importResult: ImportResult<T> = {
          success: allErrors.length === 0,
          data: validData,
          errors: allErrors,
          totalRows: mappedRows.length,
          validRows: validData.length,
          invalidRows: mappedRows.length - validData.length,
        };

        setResult(importResult);
        return importResult;
      } catch (err) {
        const importError =
          err instanceof Error ? err : new Error("Import failed");
        setError(importError);

        const failedResult: ImportResult<T> = {
          success: false,
          data: [],
          errors: [
            {
              row: 0,
              field: "_file",
              message: importError.message,
              value: null,
            },
          ],
          totalRows: 0,
          validRows: 0,
          invalidRows: 0,
        };
        setResult(failedResult);
        return failedResult;
      } finally {
        setIsImporting(false);
      }
    },
    [config]
  );

  return { importFromExcel, isImporting, result, error, reset };
}
