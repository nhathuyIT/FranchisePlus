import { z } from "zod";

/**
 * Update Stock schema
 * For updating inventory quantity
 */
export const UpdateStockSchema = z.object({
  product_name: z.string().optional(), // Read-only display
  current_quantity: z.number().optional(), // Read-only display
  alert_threshold: z.number().optional(), // Read-only display
  quantity: z
    .number()
    .min(0, "Stock quantity cannot be negative - enter 0 or more")
    .max(999999, "Quantity too high - maximum is 999,999 kg"),
});

/**
 * Add Inventory Item schema
 * For adding new products to inventory
 */
export const AddInventoryItemSchema = z
  .object({
    product_franchise_id: z
      .number()
      .min(1, "Select a product from the list"),
    quantity: z
      .number()
      .min(0, "Stock quantity cannot be negative - enter 0 or more"),
    alert_threshold: z
      .number()
      .min(0, "Alert threshold cannot be negative"),
  })
  .refine((data) => data.quantity >= data.alert_threshold * 1.2, {
    message: "Initial stock should be at least 20% above the alert threshold to avoid immediate alerts",
    path: ["quantity"],
  });

/**
 * Adjust Alert Threshold schema
 * For changing low stock alert threshold
 */
export const AdjustThresholdSchema = z.object({
  product_name: z.string().optional(), // Read-only display
  current_threshold: z.number().optional(), // Read-only display
  current_quantity: z.number().optional(), // Read-only display
  alert_threshold: z
    .number()
    .min(1, "Alert threshold must be at least 1 kg")
    .max(10000, "Threshold too high - maximum is 10,000 kg"),
});

export type UpdateStockFormData = z.infer<typeof UpdateStockSchema>;
export type AddInventoryItemFormData = z.infer<typeof AddInventoryItemSchema>;
export type AdjustThresholdFormData = z.infer<typeof AdjustThresholdSchema>;
