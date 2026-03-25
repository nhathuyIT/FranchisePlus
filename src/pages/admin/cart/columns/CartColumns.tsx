import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import type { CartItemResponse, CartResponse } from "@/types/cart";
import { CartProductImage } from "../components/CartProductImage";
import {
  formatCartDateTime,
  formatCartMoney,
  getCartDiscountLabels,
  getCartStatusClassName,
} from "../utils/cartDisplay";

export const createCartColumns = (): ColumnDef<CartResponse>[] => {
  const columns: ColumnDef<CartResponse>[] = [
    {
      accessorKey: "customerName",
      header: "Customer",
      cell: ({ row }) => (
        <div className="min-w-[160px]">
          <p className="font-medium text-[#3E2723]">
            {row.original.customerName || "Unknown customer"}
          </p>
        </div>
      ),
    },
    {
      accessorKey: "franchiseName",
      header: "Franchise",
      cell: ({ row }) => (
        <span className="text-[#5D4037]">
          {row.original.franchiseName || "N/A"}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge
          variant="outline"
          className={getCartStatusClassName(row.original.status)}
        >
          {row.original.status}
        </Badge>
      ),
    },
    {
      id: "itemsCount",
      header: "Items",
      meta: { align: "center" as const },
      cell: ({ row }) => (
        <span className="font-medium text-[#5D4037]">
          {row.original.cartItems.length} item(s)
        </span>
      ),
    },
    {
      accessorKey: "finalAmount",
      header: "Final Amount",
      meta: { align: "right" as const },
      cell: ({ row }) => {
        const discountLabels = getCartDiscountLabels(row.original);

        return (
          <div className="space-y-1 text-right">
            <p className="font-semibold text-[#3E2723]">
              {formatCartMoney(row.original.finalAmount)}
            </p>

            {discountLabels.length > 0 ? (
              <div className="space-y-0.5 text-[11px] text-[#A65A00]">
                {discountLabels.map((label) => (
                  <p key={label}>{label}</p>
                ))}
              </div>
            ) : null}
          </div>
        );
      },
    },
    {
      accessorKey: "updatedAt",
      header: "Updated At",
      cell: ({ row }) => (
        <span className="text-sm text-[#5D4037]">
          {formatCartDateTime(row.original.updatedAt)}
        </span>
      ),
    },
  ];

  return columns;
};

export const cartItemColumns: ColumnDef<CartItemResponse>[] = [
  {
    accessorKey: "productName",
    header: "Product",
    cell: ({ row }) => (
      <div className="flex min-w-[220px] items-center gap-3">
        <CartProductImage
          src={row.original.productImageUrl}
          alt={row.original.productName || "Cart product"}
          className="h-12 w-12 shrink-0 rounded-lg"
        />
        <div className="min-w-0">
          <p className="font-medium text-[#3E2723]">
            {row.original.productName || "Unknown product"}
          </p>
          <p className="text-xs text-[#8D6E63]">
            {row.original.productFranchiseId}
          </p>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "quantity",
    header: "Qty",
    meta: { align: "center" as const },
    cell: ({ row }) => (
      <span className="font-medium text-[#3E2723]">
        {row.original.quantity}
      </span>
    ),
  },
  {
    accessorKey: "productCartPrice",
    header: "Unit Price",
    meta: { align: "right" as const },
    cell: ({ row }) => (
      <span className="text-[#5D4037]">
        {formatCartMoney(row.original.productCartPrice)}
      </span>
    ),
  },
  {
    id: "options",
    header: "Options",
    meta: { align: "center" as const },
    cell: ({ row }) => (
      <span className="text-[#5D4037]">{row.original.options.length}</span>
    ),
  },
  {
    accessorKey: "discountAmount",
    header: "Discount",
    meta: { align: "right" as const },
    cell: ({ row }) => (
      <span className="text-[#5D4037]">
        {formatCartMoney(row.original.discountAmount)}
      </span>
    ),
  },
  {
    accessorKey: "finalLineTotal",
    header: "Final Total",
    meta: { align: "right" as const },
    cell: ({ row }) => (
      <span className="font-semibold text-[#3E2723]">
        {formatCartMoney(row.original.finalLineTotal)}
      </span>
    ),
  },
  {
    accessorKey: "note",
    header: "Note",
    cell: ({ row }) => (
      <span className="text-[#5D4037]">{row.original.note || "N/A"}</span>
    ),
  },
];
