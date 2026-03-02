import { z } from "zod";
import type { HeaderMapping, ReverseHeaderMapping } from "./types";

// ─── Product Import Zod Schema ────────────────────────────────────────────
export const ProductImportSchema = z.object({
  sku: z
    .string({ message: "SKU is required" })
    .min(1, "SKU is required")
    .max(50, "SKU must be at most 50 characters"),

  name: z
    .string({ message: "Product name is required" })
    .min(1, "Product name is required")
    .max(200, "Name must be at most 200 characters"),

  description: z
    .string()
    .nullish()
    .or(z.literal(""))
    .transform((v) => v || null),

  content: z
    .string()
    .nullish()
    .or(z.literal(""))
    .transform((v) => v || null),

  imageUrl: z
    .string()
    .url("Image URL must be a valid URL")
    .nullish()
    .or(z.literal(""))
    .transform((v) => v || null),

  minPrice: z
    .union([z.number(), z.string()])
    .transform((v) => Number(v))
    .pipe(z.number().min(0, "Min price must be >= 0")),

  maxPrice: z
    .union([z.number(), z.string()])
    .transform((v) => Number(v))
    .pipe(z.number().min(0, "Max price must be >= 0")),

  isActive: z
    .union([z.boolean(), z.string(), z.number()])
    .transform((v) => {
      if (typeof v === "boolean") return v;
      if (typeof v === "number") return v === 1;
      const s = String(v).toLowerCase().trim();
      return s === "true" || s === "1" || s === "yes" || s === "active" || s === "có";
    }),
});

export type ProductImportData = z.infer<typeof ProductImportSchema>;

// ─── Header Mappings ───────────────────────────────────────────────────────
export const PRODUCT_HEADER_MAPPING: HeaderMapping = {
  "Mã sản phẩm": "sku",
  "Tên sản phẩm": "name",
  "Mô tả": "description",
  "Nội dung": "content",
  "Hình ảnh": "imageUrl",
  "Giá thấp nhất": "minPrice",
  "Giá cao nhất": "maxPrice",
  "Trạng thái": "isActive",
  SKU: "sku",
  Name: "name",
  Description: "description",
  Content: "content",
  "Image URL": "imageUrl",
  "Min Price": "minPrice",
  "Max Price": "maxPrice",
  Status: "isActive",
};

export const PRODUCT_REVERSE_HEADER_MAPPING: ReverseHeaderMapping = {
  sku: "Mã sản phẩm",
  name: "Tên sản phẩm",
  description: "Mô tả",
  content: "Nội dung",
  imageUrl: "Hình ảnh",
  minPrice: "Giá thấp nhất",
  maxPrice: "Giá cao nhất",
  isActive: "Trạng thái",
};
