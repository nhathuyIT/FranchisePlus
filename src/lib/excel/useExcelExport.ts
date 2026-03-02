import { useState, useCallback } from "react";
import type { ExportConfig } from "./types";

interface UseExcelExportReturn {
  exportToExcel: <T extends Record<string, unknown>>(data: T[]) => Promise<void>;
  isExporting: boolean;
  error: Error | null;
}

/**
 * Hook for exporting data to an Excel (.xlsx) file.
 *
 * - Processes the file asynchronously so the UI stays responsive.
 * - Maps data keys to human-friendly header labels via `headerMapping`.
 * - Supports include/exclude column filters.
 *
 * @example
 * ```tsx
 * const { exportToExcel, isExporting } = useExcelExport({
 *   headerMapping: { code: "Mã cửa hàng", name: "Tên chi nhánh" },
 *   fileName: "franchises",
 * });
 * <Button onClick={() => exportToExcel(data)} disabled={isExporting}>Export</Button>
 * ```
 */
export function useExcelExport(config: ExportConfig): UseExcelExportReturn {
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const exportToExcel = useCallback(
    async <T extends Record<string, unknown>>(data: T[]) => {
      setIsExporting(true);
      setError(null);

      try {
        // Dynamically import xlsx to reduce initial bundle size
        const XLSX = await import("xlsx");

        // Determine which columns to export
        let keys = Object.keys(config.headerMapping);

        if (config.includeColumns?.length) {
          keys = keys.filter((k) => config.includeColumns!.includes(k));
        }
        if (config.excludeColumns?.length) {
          keys = keys.filter((k) => !config.excludeColumns!.includes(k));
        }

        // Yield to the event loop so the UI can update the loading state
        await new Promise((resolve) => setTimeout(resolve, 0));

        // Map data rows to export-friendly objects with display headers
        const exportData = data.map((row) => {
          const mapped: Record<string, unknown> = {};
          for (const key of keys) {
            const header = config.headerMapping[key] || key;
            let value = row[key];

            // Format special values for readability
            if (typeof value === "boolean") {
              value = value ? "Active" : "Inactive";
            } else if (value === null || value === undefined) {
              value = "";
            }

            mapped[header] = value;
          }
          return mapped;
        });

        // Break into chunks for large datasets (yield between chunks)
        const CHUNK_SIZE = 500;
        if (exportData.length > CHUNK_SIZE) {
          for (let i = 0; i < exportData.length; i += CHUNK_SIZE) {
            await new Promise((resolve) => setTimeout(resolve, 0));
          }
        }

        // Create workbook & sheet
        const worksheet = XLSX.utils.json_to_sheet(exportData);

        // Auto-size columns based on content width
        const colWidths = Object.keys(exportData[0] || {}).map((header) => {
          const maxContentLen = Math.max(
            header.length,
            ...exportData.map((row) => String(row[header] ?? "").length)
          );
          return { wch: Math.min(maxContentLen + 4, 50) };
        });
        worksheet["!cols"] = colWidths;

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(
          workbook,
          worksheet,
          config.sheetName || "Sheet1"
        );

        // Write and download
        const fileName = `${config.fileName || "export"}_${new Date().toISOString().slice(0, 10)}.xlsx`;
        XLSX.writeFile(workbook, fileName);
      } catch (err) {
        const exportError =
          err instanceof Error ? err : new Error("Export failed");
        setError(exportError);
        throw exportError;
      } finally {
        setIsExporting(false);
      }
    },
    [config]
  );

  return { exportToExcel, isExporting, error };
}
