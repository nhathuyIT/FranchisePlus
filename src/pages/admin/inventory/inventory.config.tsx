import type { CrudConfig } from "@/lib/crud/types";
import type { InventoryItemView } from "@/types/inventory";
import type {
  UpdateStockFormData,
  AddInventoryItemFormData,
  AdjustThresholdFormData,
} from "@/lib/schemas/inventory.schema";
import {
  UpdateStockSchema,
  AddInventoryItemSchema,
  AdjustThresholdSchema,
} from "@/lib/schemas/inventory.schema";

/**
 * CRUD config for updating stock quantity
 * Used in main inventory list and low stock pages
 */
export const updateStockConfig: CrudConfig<
  InventoryItemView,
  UpdateStockFormData
> = {
  entityName: "Stock Level",
  entityNamePlural: "Stock Levels",

  fields: [
    // Read-only context fields
    {
      name: "productName",
      type: "text",
      label: "Product Name",
      disabled: true,
    },
    {
      name: "currentQuantity",
      type: "number",
      label: "Current Quantity (kg)",
      disabled: true,
    },
    {
      name: "alertThreshold",
      type: "number",
      label: "Alert Threshold (kg)",
      disabled: true,
    },
    // Editable field
    {
      name: "quantity",
      type: "number",
      label: "New Quantity (kg)",
      required: true,
      placeholder: "Enter new quantity",
      description: "Update the stock quantity for this product",
    },
  ],

  schema: UpdateStockSchema,

  api: {
    update: async (_id, data) => {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      console.log("Updating stock:", data);
      return data as any;
    },
  },

  dialog: {
    updateTitle: "Update Stock Quantity",
    size: "md",
  },

  transform: {
    toForm: (item) => ({
      productName: item.product.name,
      currentQuantity: item.inventory.quantity,
      alertThreshold: item.inventory.alertThreshold,
      quantity: item.inventory.quantity,
    }),
  },

  features: {
    create: false,
    update: true,
    delete: false,
    view: false,
    bulkDelete: false,
  },
};

/**
 * CRUD config for adding new inventory items
 * Allows adding a product to a franchise's inventory
 */
export const addInventoryItemConfig: CrudConfig<
  InventoryItemView,
  AddInventoryItemFormData
> = {
  entityName: "Inventory Item",
  entityNamePlural: "Inventory Items",

  fields: [
    {
      name: "productFranchiseId",
      type: "select",
      label: "Product",
      required: true,
      placeholder: "Select a product",
      description: "Choose the product to add to inventory",
      options: [
        // TODO: Replace with dynamic product list from API
        { label: "Arabica Coffee Beans", value: 1 },
        { label: "Robusta Coffee Beans", value: 2 },
        { label: "Whole Milk", value: 3 },
        { label: "White Sugar", value: 4 },
        { label: "Chocolate Syrup", value: 5 },
        { label: "Vanilla Syrup", value: 6 },
        { label: "Almond Milk", value: 7 },
        { label: "Caramel Syrup", value: 8 },
        { label: "Oat Milk", value: 9 },
        { label: "Hazelnut Syrup", value: 10 },
        { label: "Whipped Cream", value: 11 },
      ],
    },
    {
      name: "quantity",
      type: "number",
      label: "Initial Quantity (kg)",
      required: true,
      placeholder: "Enter quantity",
      description: "Starting stock quantity (should be above threshold)",
    },
    {
      name: "alertThreshold",
      type: "number",
      label: "Alert Threshold (kg)",
      required: true,
      placeholder: "Enter threshold",
      description: "Minimum quantity before low stock alert",
    },
  ],

  schema: AddInventoryItemSchema,

  api: {
    create: async (data) => {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 800));
      console.log("Creating inventory item:", data);

      const newItem: InventoryItemView = {
        inventory: {
          id: Date.now(),
          productFranchiseId: data.productFranchiseId,
          quantity: data.quantity,
          alertThreshold: data.alertThreshold,
          isActive: true,
          isDeleted: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        product: {
          id: 1,
          name: "New Product",
          sku: "TEMP-SKU",
          description: "Temporary product",
        },
        productFranchise: {
          id: data.productFranchiseId,
          franchiseId: 1,
          productId: 1,
          priceBase: 0,
          isActive: true,
          isDeleted: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        franchiseName: "Temp Franchise",
        franchiseCode: "TEMP",
      };

      return newItem;
    },
  },

  dialog: {
    createTitle: "Add Inventory Item",
    size: "md",
  },

  features: {
    create: true,
    update: false,
    delete: false,
    view: false,
    bulkDelete: false,
  },
};

/**
 * CRUD config for adjusting alert threshold
 * Allows updating the low stock alert threshold for an inventory item
 */
export const adjustThresholdConfig: CrudConfig<
  InventoryItemView,
  AdjustThresholdFormData
> = {
  entityName: "Alert Threshold",
  entityNamePlural: "Alert Thresholds",

  fields: [
    // Read-only context fields
    {
      name: "productName",
      type: "text",
      label: "Product Name",
      disabled: true,
    },
    {
      name: "currentThreshold",
      type: "number",
      label: "Current Threshold (kg)",
      disabled: true,
    },
    {
      name: "currentQuantity",
      type: "number",
      label: "Current Stock (kg)",
      disabled: true,
    },
    // Editable field
    {
      name: "alertThreshold",
      type: "number",
      label: "New Alert Threshold (kg)",
      required: true,
      placeholder: "Enter new threshold",
      description: "Set minimum stock level before alert triggers",
    },
  ],

  schema: AdjustThresholdSchema,

  api: {
    update: async (_id, data) => {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      console.log("Updating threshold:", data);
      return data as any;
    },
  },

  dialog: {
    updateTitle: "Adjust Alert Threshold",
    size: "md",
  },

  transform: {
    toForm: (item) => ({
      productName: item.product.name,
      currentThreshold: item.inventory.alertThreshold,
      currentQuantity: item.inventory.quantity,
      alertThreshold: item.inventory.alertThreshold,
    }),
  },

  features: {
    create: false,
    update: true,
    delete: false,
    view: false,
    bulkDelete: false,
  },
};
