import { z } from "zod";
import type { FieldConfig, SelectOption } from "@/lib/form/field-config";
import * as productFranchiseApi from "@/api/product-franchise/product-franchise.api";
import type { AddProductToCartByStaffRequest } from "@/types/cart";
import { CartOptionArrayField } from "./components/CartOptionArrayField";

const cartItemOptionSchema = z.object({
  productFranchiseId: z.string().min(1, "Option product is required"),
  quantity: z.number().int().min(1, "Option quantity must be at least 1"),
});

export const addCartSchema = z.object({
  customerId: z.string().min(1, "Customer is required"),
  franchiseId: z.string().min(1, "Franchise is required"),
  productFranchiseId: z.string().min(1, "Product is required"),
  quantity: z.number().int().min(1, "Quantity must be at least 1"),
  address: z.string().min(1, "Address is required"),
  phone: z.string().min(1, "Phone is required"),
  note: z.string().optional(),
  message: z.string().optional(),
  options: z.array(cartItemOptionSchema).optional().default([]),
});

export type AddCartFormData = z.infer<typeof addCartSchema>;

export const buildAddCartFields = (
  franchiseOptions: SelectOption<string>[],
): FieldConfig<AddCartFormData>[] => [
  {
    name: "franchiseId",
    type: "select",
    label: "Franchise",
    placeholder: "Select franchise",
    required: true,
    options: franchiseOptions,
  },
  {
    name: "productFranchiseId",
    type: "async-select",
    label: "Main Product",
    placeholder: "Select product",
    required: true,
    description: "Search active product-franchise items inside the selected franchise.",
    disabled: (form) => !form.watch("franchiseId"),
    asyncOptions: {
      loader: async (searchTerm, form) => {
        const franchiseId = form.watch("franchiseId");
        if (!franchiseId) return [];

        const result = await productFranchiseApi.searchProductFranchises({
          searchCondition: {
            keyword: searchTerm,
            franchise_id: franchiseId,
            product_id: "",
            min_price: "",
            max_price: "",
            is_active: true,
            is_deleted: false,
          },
          pageInfo: {
            pageNum: 1,
            pageSize: 20,
          },
        });

        return result.map((item) => ({
          label: `${item.productName ?? "Unknown Product"}${item.size ? ` (${item.size})` : ""} - ${item.priceBase.toLocaleString("vi-VN")} VND`,
          value: String(item.id),
        }));
      },
      debounceMs: 300,
      minChars: 0,
      emptyText: "Khong co san pham",
      loadingText: "Dang tai san pham...",
    },
  },
  {
    name: "quantity",
    type: "number",
    label: "Quantity",
    required: true,
    placeholder: "Enter quantity",
    min: 1,
  },
  {
    name: "phone",
    type: "text",
    label: "Phone",
    required: true,
    placeholder: "Enter phone number",
  },
  {
    name: "address",
    type: "textarea",
    label: "Address",
    required: true,
    placeholder: "Enter delivery address",
    rows: 3,
    colSpan: 2,
  },
  {
    name: "note",
    type: "textarea",
    label: "Note",
    placeholder: "Optional: product note",
    rows: 3,
  },
  {
    name: "message",
    type: "textarea",
    label: "Message",
    placeholder: "Optional: delivery message",
    rows: 3,
  },
  {
    name: "options",
    type: "custom",
    label: "Options",
    description: "Optional extra products for the selected franchise.",
    colSpan: 2,
    render: ({ field, form, disabled }) => (
      <CartOptionArrayField
        value={
          Array.isArray(field.value)
            ? (field.value as AddProductToCartByStaffRequest["options"]) ?? []
            : []
        }
        onChange={(value) => field.onChange(value)}
        franchiseId={form.watch("franchiseId")}
        disabled={disabled}
      />
    ),
  },
];
