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
    .min(0, "Quantity cannot be negative")
    .max(999999, "Quantity exceeds maximum limit"),
});

/**
 * Add Inventory Item schema
 * For adding new products to inventory
 */
export const AddInventoryItemSchema = z
  .object({
    product_franchise_id: z.number().min(1, "Please select a product"),
    quantity: z.number().min(0, "Quantity cannot be negative"),
    alert_threshold: z.number().min(0, "Threshold cannot be negative"),
  })
  .refine((data) => data.quantity >= data.alert_threshold * 0.2, {
    message: "Initial quantity should be at least 20% above alert threshold",
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
    .min(1, "Threshold must be at least 1")
    .max(10000, "Threshold exceeds maximum limit"),
});

export type UpdateStockFormData = z.infer<typeof UpdateStockSchema>;
export type AddInventoryItemFormData = z.infer<typeof AddInventoryItemSchema>;
export type AdjustThresholdFormData = z.infer<typeof AdjustThresholdSchema>;
