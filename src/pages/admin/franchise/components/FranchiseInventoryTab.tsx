import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Eye, Edit, Trash2 } from "lucide-react";
import { DeleteDialog } from "@/components/form-dialog/DeleteDialog";
import { 
  useProductFranchisesQuery,
  useDeleteProductFranchiseMutation 
} from "@/hooks/product-franchise/useProductFranchiseQuery";
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

      <div className="flex-1 min-h-0 overflow-auto">
        {isLoading ? (
          <div className="text-center py-8 text-gray-500">
            Loading inventory...
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">
            Failed to load inventory. Please try again.
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow className="bg-[#FAF9F6]">
                  <TableHead className="font-semibold text-[#4A3B2A]">Product</TableHead>
                  <TableHead className="font-semibold text-[#4A3B2A]">Size</TableHead>
                  <TableHead className="font-semibold text-[#4A3B2A]">Price</TableHead>
                  <TableHead className="font-semibold text-[#4A3B2A]">Status</TableHead>
                  <TableHead className="font-semibold text-[#4A3B2A]">Last Updated</TableHead>
                  <TableHead className="font-semibold text-[#4A3B2A] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {productFranchises?.map((pf) => (
                  <TableRow key={pf.id} className="hover:bg-[#FAF9F6]">
                    <TableCell className="font-medium text-[#4A3B2A]">
                      {pf.productName || "N/A"}
                    </TableCell>
                    <TableCell className="text-gray-700">
                      {pf.size || "DEFAULT"}
                    </TableCell>
                    <TableCell className="text-gray-700 font-semibold">
                      {pf.priceBase.toLocaleString('vi-VN')}₫
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={pf.isActive ? "default" : "secondary"}
                        className={
                          pf.isActive
                            ? "bg-green-600 hover:bg-green-700"
                            : "bg-gray-500 hover:bg-gray-600"
                        }
                      >
                        {pf.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-700">
                      {new Date(pf.updatedAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
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
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {(!productFranchises || productFranchises.length === 0) && (
              <div className="text-center py-8 text-gray-500">
                No inventory items found for this franchise.
              </div>
            )}
          </>
        )}
      </div>
    </div>
    </>
  );
};
