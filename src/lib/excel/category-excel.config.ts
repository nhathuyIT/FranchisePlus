import { z } from "zod";
import type { HeaderMapping, ReverseHeaderMapping } from "./types";

// ─── Category Import Zod Schema ───────────────────────────────────────────
export const CategoryImportSchema = z.object({
  code: z
    .string({ message: "Category code is required" })
    .min(1, "Code is required")
    .max(20, "Code must be at most 20 characters"),

  name: z
    .string({ message: "Category name is required" })
    .min(1, "Category name is required")
    .max(100, "Name must be at most 100 characters"),

  description: z
    .string()
    .nullish()
    .or(z.literal(""))
    .transform((v) => v || null),

  isActive: z
    .union([z.boolean(), z.string(), z.number()])
    .transform((v) => {
      if (typeof v === "boolean") return v;
      if (typeof v === "number") return v === 1;
      const s = String(v).toLowerCase().trim();
      return s === "true" || s === "1" || s === "yes" || s === "active" || s === "có";
    }),
});

export type CategoryImportData = z.infer<typeof CategoryImportSchema>;

// ─── Header Mappings ───────────────────────────────────────────────────────
export const CATEGORY_HEADER_MAPPING: HeaderMapping = {
  "Mã danh mục": "code",
  "Tên danh mục": "name",
  "Mô tả": "description",
  "Trạng thái": "isActive",
  Code: "code",
  Name: "name",
  Description: "description",
  Status: "isActive",
};

export const CATEGORY_REVERSE_HEADER_MAPPING: ReverseHeaderMapping = {
  code: "Mã danh mục",
  name: "Tên danh mục",
  description: "Mô tả",
  isActive: "Trạng thái",
};
