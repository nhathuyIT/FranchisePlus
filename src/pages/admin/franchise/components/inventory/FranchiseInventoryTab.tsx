import { useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/common/DataTable";
import { Badge } from "@/components/ui/badge";
import { Eye, Edit, Trash2 } from "lucide-react";
import { DeleteDialog } from "@/components/form-dialog/DeleteDialog";
import { 
  useProductFranchisesQuery,
  useDeleteProductFranchiseMutation 
} from "@/hooks/product-franchise/useProductFranchiseQuery";
import { useInventorySearch } from "@/hooks/inventory/useInventory.hooks";
import type { InventorySearchItem } from "@/api/inventory/inventory.type";
import { AddFranchiseProductModal } from "./AddFranchiseProductModal";
import { EditFranchiseProductModal } from "./EditFranchiseProductModal";
import { ViewFranchiseProductModal } from "./ViewFranchiseProductModal";

interface FranchiseInventoryTabProps {
  franchiseId: string;
  createOpen?: boolean;
  onCreateOpenChange?: (open: boolean) => void;
}

interface ProductFranchise {
  id: number | string;
  productName?: string;
  size?: string;
  priceBase: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  quantity?: number;
  inventoryId?: string;
  alertThreshold?: number;
}

export const FranchiseInventoryTab = ({ 
  franchiseId, 
  createOpen = false, 
  onCreateOpenChange 
}: FranchiseInventoryTabProps) => {
  const [selectedProduct, setSelectedProduct] = useState<ProductFranchise | null>(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState<ProductFranchise | null>(null);

  const { data: productFranchises, isLoading, error } = useProductFranchisesQuery({
    searchCondition: {
      keyword: "",
      product_id: "",
      franchise_id: franchiseId,
      min_price: "",
      max_price: "",
      is_active: "",
      is_deleted: false,
    },
    pageInfo: {
      pageNum: 1,
      pageSize: 100,
    },
  });

  const { data: inventorySearch, isLoading: isLoadingInventory } = useInventorySearch(
    {
      searchCondition: { franchiseId },
      pageInfo: { pageNum: 1, pageSize: 1000 },
    },
    { enabled: !!franchiseId },
  );

  const inventoryByProductFranchiseId = useMemo(() => {
    const map = new Map<string, InventorySearchItem>();
    for (const item of inventorySearch?.pageData ?? []) {
      map.set(String(item.productFranchiseId), item);
    }
    return map;
  }, [inventorySearch?.pageData]);

  const rows = useMemo<ProductFranchise[]>(() => {
    return (productFranchises ?? []).map((pf) => {
      const inv = inventoryByProductFranchiseId.get(String(pf.id));
      return {
        ...pf,
        quantity: inv?.quantity ?? 0,
        inventoryId: inv ? String(inv.id) : undefined,
        alertThreshold: inv?.alertThreshold ?? 0,
      };
    });
  }, [productFranchises, inventoryByProductFranchiseId]);

  const deleteMutation = useDeleteProductFranchiseMutation();

  const handleView = (pf: ProductFranchise) => {
    setSelectedProduct(pf);
    setViewOpen(true);
  };

  const handleEdit = (pf: ProductFranchise) => {
    setSelectedProduct(pf);
    setEditOpen(true);
  };

  const handleDeleteClick = (pf: ProductFranchise) => {
    setDeletingProduct(pf);
    setDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!deletingProduct) return;
    
    try {
      await deleteMutation.mutateAsync(deletingProduct.id);
      setDeleteOpen(false);
      setDeletingProduct(null);
    } catch (error) {
      console.error("Failed to delete product franchise:", error);
    }
  };

  const columns = useMemo<ColumnDef<ProductFranchise>[]>(
    () => [
      {
        accessorKey: "productName",
        header: "Product",
        cell: ({ row }) => (
          <span className="font-medium text-[#4A3B2A]">
            {row.original.productName || "N/A"}
          </span>
        ),
      },
      {
        accessorKey: "size",
        header: "Size",
        cell: ({ row }) => (
          <span className="text-gray-700">{row.original.size || "DEFAULT"}</span>
        ),
      },
      {
        accessorKey: "priceBase",
        header: "Price",
        cell: ({ row }) => (
          <span className="text-gray-700 font-semibold">
            {row.original.priceBase.toLocaleString("vi-VN")}₫
          </span>
        ),
      },
      {
        accessorKey: "quantity",
        header: "Quantity",
        cell: ({ row }) => (
          <span className="text-gray-700 font-semibold tabular-nums">
            {(row.original.quantity ?? 0).toLocaleString("en-US")}
          </span>
        ),
      },
      {
        accessorKey: "isActive",
        header: "Status",
        cell: ({ row }) => (
          <Badge
            variant={row.original.isActive ? "default" : "secondary"}
            className={
              row.original.isActive
                ? "bg-green-600 hover:bg-green-700"
                : "bg-gray-500 hover:bg-gray-600"
            }
          >
            {row.original.isActive ? "Active" : "Inactive"}
          </Badge>
        ),
      },
      {
        accessorKey: "updatedAt",
        header: "Last Updated",
        cell: ({ row }) => (
          <span className="text-gray-700">
            {new Date(row.original.updatedAt).toLocaleDateString()}
          </span>
        ),
      },
    ],
    []
  );

  return (
    <>
      <AddFranchiseProductModal
        franchiseId={franchiseId}
        open={createOpen}
        onClose={() => onCreateOpenChange?.(false)}
        onSuccess={() => onCreateOpenChange?.(false)}
      />

      <EditFranchiseProductModal
        productFranchise={selectedProduct}
        open={editOpen}
        onClose={() => {
          setEditOpen(false);
          setSelectedProduct(null);
        }}
        onSuccess={() => {
          setEditOpen(false);
          setSelectedProduct(null);
        }}
      />

      <ViewFranchiseProductModal
        productFranchise={selectedProduct}
        open={viewOpen}
        onClose={() => {
          setViewOpen(false);
          setSelectedProduct(null);
        }}
      />

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        entity={deletingProduct}
        entityName="Product"
        onConfirm={confirmDelete}
        isDeleting={deleteMutation.isPending}
        getDisplayName={(pf) => pf.productName || "this product"}
        deleteMessage={(pf) => 
          `Remove the "${pf.productName || 'this product'}" from this franchise's inventory? This action cannot be undone.`
        }
      />
      
      <div className="h-full flex flex-col bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-[#4A3B2A] mb-4 shrink-0">
          Inventory Stock
        </h2>

        <div className="flex-1 min-h-0">
          <DataTable<ProductFranchise>
            columns={columns}
            data={rows}
            searchable
            searchPlaceholder="Search products..."
            emptyMessage="No inventory items found for this franchise."
            initialPageSize={10}
            isLoading={isLoading || isLoadingInventory}
            error={
              error
                ? error instanceof Error
                  ? error
                  : new Error("Failed to load inventory")
                : null
            }
            renderActions={(pf) => (
              <div className="flex gap-3 justify-end">
                <Eye
                  className="h-5 w-5 text-gray-600 hover:text-blue-600 cursor-pointer transition-colors"
                  onClick={() => handleView(pf)}
                />
                <Edit
                  className="h-5 w-5 text-blue-600 hover:text-blue-700 cursor-pointer transition-colors"
                  onClick={() => handleEdit(pf)}
                />
                <Trash2
                  className="h-5 w-5 text-red-600 hover:text-red-700 cursor-pointer transition-colors"
                  onClick={() => handleDeleteClick(pf)}
                />
              </div>
            )}
          />
        </div>
    </div>
    </>
  );
};
