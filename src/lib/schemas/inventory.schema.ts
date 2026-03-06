import { z } from "zod";

/**
 * Adjust Inventory schema (INVENTORY-06)
 * POST /api/inventories/adjust
 * For adjusting quantity via change delta (positive to add, negative to subtract)
 */
export const AdjustInventorySchema = z.object({
  change: z
    .number()
    .refine((val) => val !== 0, "Change amount cannot be zero"),
  reason: z.string().optional(),
});

/**
 * Add Inventory Item schema (INVENTORY-01)
 * POST /api/inventories
 * For adding new products to inventory
 */
export const AddInventoryItemSchema = z
  .object({
    productFranchiseId: z
      .string()
      .min(1, "Select a product from the list"),
    quantity: z
      .number()
      .min(0, "Stock quantity cannot be negative - enter 0 or more"),
    alertThreshold: z.number().min(0, "Alert threshold cannot be negative"),
  })
  .refine((data) => data.quantity >= data.alertThreshold * 1.2, {
    message:
      "Initial stock should be at least 20% above the alert threshold to avoid immediate alerts",
    path: ["quantity"],
  });

export type AdjustInventoryFormData = z.infer<typeof AdjustInventorySchema>;
export type AddInventoryItemFormData = z.infer<typeof AddInventoryItemSchema>;
