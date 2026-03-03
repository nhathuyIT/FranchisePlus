import { z } from "zod";
import type { HeaderMapping, ReverseHeaderMapping } from "./types";

// ─── Franchise Import Zod Schema ───────────────────────────────────────────
// Validates each row coming from an Excel file. Looser than the form schema
// because imported data may have empty optional fields represented as "".

export const FranchiseImportSchema = z
  .object({
    code: z
      .string({ message: "Franchise code is required" })
      .min(3, "Code must be at least 3 characters")
      .max(20, "Code must be at most 20 characters")
      .regex(
        /^[A-Z0-9-]+$/,
        "Code must contain only uppercase letters, numbers, and hyphens (e.g., CF-D1-001)"
      ),

    name: z
      .string({ message: "Franchise name is required" })
      .min(1, "Franchise name is required")
      .max(100, "Name must be at most 100 characters"),

    logoUrl: z
      .string()
      .url("Logo URL must be a valid URL")
      .nullish()
      .or(z.literal(""))
      .transform((v) => v || null),

    address: z
      .string({ message: "Address is required" })
      .min(1, "Address is required")
      .max(500, "Address must be at most 500 characters"),

    openedAt: z
      .string()
      .refine((d) => !d || !isNaN(Date.parse(d)), {
        message: "Opening date must be a valid date",
      })
      .nullish()
      .or(z.literal(""))
      .transform((v) => v || null),

    closedAt: z
      .string()
      .refine((d) => !d || !isNaN(Date.parse(d)), {
        message: "Closing date must be a valid date",
      })
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

    lat: z
      .union([z.number(), z.string()])
      .optional()
      .transform((v) => {
        if (v === undefined || v === null || v === "") return undefined;
        const n = Number(v);
        return isNaN(n) ? undefined : n;
      }),

    lng: z
      .union([z.number(), z.string()])
      .optional()
      .transform((v) => {
        if (v === undefined || v === null || v === "") return undefined;
        const n = Number(v);
        return isNaN(n) ? undefined : n;
      }),
  })
  .refine(
    (data) => {
      if (data.closedAt && data.openedAt) {
        return new Date(data.closedAt) > new Date(data.openedAt);
      }
      return true;
    },
    {
      message: "Closing date must be later than the opening date",
      path: ["closedAt"],
    }
  );

export type FranchiseImportData = z.infer<typeof FranchiseImportSchema>;

// ─── Header Mappings ───────────────────────────────────────────────────────
// Vietnamese label → data key
export const FRANCHISE_HEADER_MAPPING: HeaderMapping = {
  "Mã cửa hàng": "code",
  "Tên chi nhánh": "name",
  "Logo URL": "logoUrl",
  "Địa chỉ": "address",
  "Ngày mở cửa": "openedAt",
  "Ngày đóng cửa": "closedAt",
  "Trạng thái": "isActive",
  "Vĩ độ": "lat",
  "Kinh độ": "lng",
  // Also accept English headers as-is
  Code: "code",
  Name: "name",
  "Logo": "logoUrl",
  Address: "address",
  "Opened Date": "openedAt",
  "Closed Date": "closedAt",
  Status: "isActive",
  Latitude: "lat",
  Longitude: "lng",
};

// data key → Vietnamese label (for export)
export const FRANCHISE_REVERSE_HEADER_MAPPING: ReverseHeaderMapping = {
  code: "Mã cửa hàng",
  name: "Tên chi nhánh",
  logoUrl: "Logo URL",
  address: "Địa chỉ",
  openedAt: "Ngày mở cửa",
  closedAt: "Ngày đóng cửa",
  isActive: "Trạng thái",
  lat: "Vĩ độ",
  lng: "Kinh độ",
};
