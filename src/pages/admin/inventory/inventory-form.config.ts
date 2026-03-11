import {
  AdjustInventorySchema,
  AddInventoryItemSchema,
  type AdjustInventoryFormData,
  type AddInventoryItemFormData,
} from "@/lib/schemas/inventory.schema";
import type { FieldConfig } from "@/lib/form/field-config";

/**
 * Fields for adjusting inventory quantity (INVENTORY-06: Edit Quantity)
 * POST /api/inventories/adjust
 */
export const adjustInventoryFields: FieldConfig<AdjustInventoryFormData>[] = [
  {
    name: "change",
    type: "number",
    label: "Quantity Change",
    required: true,
    placeholder: "e.g. 50 to add, -20 to subtract",
    description:
      "Enter positive number to add stock, negative to subtract stock",
  },
  {
    name: "alertThreshold",
    type: "number",
    label: "Alert Threshold",
    required: true,
    placeholder: "Enter new alert threshold",
    description: "Minimum quantity before low stock alert (must be ≥ 0)",
    min: 0,
  },
  {
    name: "reason",
    type: "textarea",
    label: "Reason",
    required: false,
    placeholder: "Optional: reason for adjustment",
    description: "Describe why the quantity is being adjusted",
    rows: 3,
  },
];

/**
 * Fields for adding a new inventory item (INVENTORY-01: Create Item)
 * POST /api/inventories
 */
export const addInventoryFields: FieldConfig<AddInventoryItemFormData>[] = [
  {
    name: "productFranchiseId",
    type: "select",
    label: "Product Franchise",
    required: true,
    placeholder: "Select a product franchise",
    description: "Choose the product-franchise combination to add to inventory",
    // TODO: Replace with dynamic product-franchise list from API
    options: [
      { label: "Espresso - High Land 001", value: "698eab1b26ca2b18eb3534e3" },
      {
        label: "Americano - High Land 001",
        value: "698eab1626ca2b18eb353493",
      },
      {
        label: "Cà phê đen đá - High Land 001",
        value: "698eab1726ca2b18eb35349d",
      },
    ],
  },
  {
    name: "quantity",
    type: "number",
    label: "Initial Quantity",
    required: true,
    placeholder: "Enter quantity",
    description: "Starting stock quantity (should be above threshold)",
    min: 0,
  },
  {
    name: "alertThreshold",
    type: "number",
    label: "Alert Threshold",
    required: true,
    placeholder: "Enter threshold",
    description: "Minimum quantity before low stock alert",
    min: 0,
  },
];

/**
 * Re-export schemas for convenience
 */
export const adjustInventorySchema = AdjustInventorySchema;
export const addInventorySchema = AddInventoryItemSchema;
export type { AdjustInventoryFormData, AddInventoryItemFormData };
