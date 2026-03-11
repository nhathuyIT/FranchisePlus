import { z } from "zod";
import type { HeaderMapping, ReverseHeaderMapping } from "./types";

// ─── Export config ──────────────────────────────────────────────────────────
// Based on the flat InventorySearchItem returned by INVENTORY-02 search API.
// Only human-meaningful columns are exported (no internal IDs).

export const INVENTORY_REVERSE_HEADER_MAPPING: ReverseHeaderMapping = {
  productName: "Product Name",
  franchiseName: "Franchise",
  quantity: "Quantity",
  alertThreshold: "Alert Threshold",
  isActive: "Status",
};

// ─── Import config ──────────────────────────────────────────────────────────
// Matches the exported file headers exactly so users can export → edit → re-import.
// Rows are matched to existing inventory by productName + franchiseName.

export const INVENTORY_HEADER_MAPPING: HeaderMapping = {
  "Product Name": "productName",
  Franchise: "franchiseName",
  Quantity: "quantity",
  "Alert Threshold": "alertThreshold",
  Status: "isActive",
};

const numericIntField = (label: string) =>
  z
    .any()
    .superRefine((v, ctx) => {
      if (
        v === undefined ||
        v === null ||
        v === "" ||
        typeof v === "boolean" ||
        isNaN(Number(v))
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `${label} must be a number`,
        });
        return;
      }
      const n = Number(v);
      if (n < 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `${label} cannot be negative`,
        });
        return;
      }
      if (!Number.isInteger(n)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `${label} must be an integer`,
        });
      }
    })
    .transform(Number);

export const InventoryImportSchema = z.object({
  productName: z
    .string({ message: "Product Name is required" })
    .min(1, "Product Name is required"),
  franchiseName: z
    .string({ message: "Franchise is required" })
    .min(1, "Franchise is required"),
  quantity: numericIntField("Quantity"),
  alertThreshold: numericIntField("Alert Threshold"),
  isActive: z
    .any()
    .transform((v) => String(v ?? "").trim().toLowerCase() === "active"),
});

export type InventoryImportData = z.infer<typeof InventoryImportSchema>;
