import type { z } from "zod";

/**
 * Maps a display header label (e.g. Vietnamese) to the actual data key.
 * Example: { "Mã cửa hàng": "code", "Tên chi nhánh": "name" }
 */
export type HeaderMapping = Record<string, string>;

/**
 * Reverse mapping: data key → display header label.
 * Used for export to produce human-friendly column headers.
 */
export type ReverseHeaderMapping = Record<string, string>;

/** A single validation error attached to a specific row + field */
export interface ImportRowError {
  row: number; // 1-based row number (matching the Excel file)
  field: string;
  message: string;
  value: unknown;
}

/** Result returned by the import process */
export interface ImportResult<T> {
  success: boolean;
  data: T[];
  errors: ImportRowError[];
  totalRows: number;
  validRows: number;
  invalidRows: number;
}

/** Configuration for the import hook */
export interface ImportConfig<T> {
  /** Zod schema used to validate each row */
  schema: z.ZodType<T>;
  /** Map from display header → data key (e.g. Vietnamese → English) */
  headerMapping: HeaderMapping;
  /** Optional transform applied to each raw row before validation */
  preTransform?: (raw: Record<string, unknown>) => Record<string, unknown>;
}

/** A raw parsed row before Zod validation — represents one row in the virtual preview table */
export interface PreviewRow {
  /** 1-based row number in the Excel file (header = row 1, data starts at row 2) */
  _rowNumber: number;
  /** Mapped field values (keys are data keys after headerMapping translation) */
  data: Record<string, unknown>;
}

/** Virtual table produced by parsing a file — no validation performed yet */
export interface PreviewResult {
  /** Data keys (column identifiers) after header mapping */
  keys: string[];
  /** All parsed rows ready for preview / selection */
  rows: PreviewRow[];
  totalRows: number;
}

/** Configuration for the export hook */
export interface ExportConfig {
  /** Map from data key → display header label */
  headerMapping: ReverseHeaderMapping;
  /** Columns to include in the export (data keys). If omitted, all mapped keys are exported. */
  includeColumns?: string[];
  /** Columns to exclude from the export */
  excludeColumns?: string[];
  /** Sheet name (defaults to "Sheet1") */
  sheetName?: string;
  /** Filename without extension (defaults to "export") */
  fileName?: string;
}
