import { z } from "zod";
import type { HeaderMapping, ReverseHeaderMapping } from "./types";

// ─── Customer Import Zod Schema ───────────────────────────────────────────
// Validates each row coming from an Excel file. Looser than the form schema
// because imported data may have empty optional fields represented as "".

export const CustomerImportSchema = z.object({
  name: z
    .string({ message: "Customer name is required" })
    .min(1, "Customer name is required")
    .max(100, "Name must be at most 100 characters"),

  phone: z
    .string({ message: "Phone number is required" })
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number must be at most 15 digits")
    .regex(
      /^[0-9+\-\s()]+$/,
      "Phone number can only contain digits, spaces, +, -, and parentheses",
    ),

  email: z
    .string()
    .email("Email must be a valid email address")
    .nullish()
    .or(z.literal(""))
    .transform((v) => v || null),

  avatarUrl: z
    .string()
    .url("Avatar URL must be a valid URL")
    .nullish()
    .or(z.literal(""))
    .transform((v) => v || null),

  isActive: z.union([z.boolean(), z.string(), z.number()]).transform((v) => {
    if (typeof v === "boolean") return v;
    if (typeof v === "number") return v === 1;
    const s = String(v).toLowerCase().trim();
    return (
      s === "true" || s === "1" || s === "yes" || s === "active" || s === "có"
    );
  }),
});

export type CustomerImportData = z.infer<typeof CustomerImportSchema>;

// ─── Header Mappings ───────────────────────────────────────────────────────
// Vietnamese label → data key
export const CUSTOMER_HEADER_MAPPING: HeaderMapping = {
  Name: "name",
  Phone: "phone",
  Email: "email",
  "Avatar URL": "avatarUrl",
  Status: "isActive",
};

// data key → English label (for export)
export const CUSTOMER_REVERSE_HEADER_MAPPING: ReverseHeaderMapping = {
  name: "Name",
  phone: "Phone",
  email: "Email",
  avatarUrl: "Avatar URL",
  isActive: "Status",
};
