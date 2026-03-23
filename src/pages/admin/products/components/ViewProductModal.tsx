import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { AdminProductRow } from "../columns/product.columns";

interface ViewProductModalProps {
  product: AdminProductRow | null;
  isOpen: boolean;
  onClose: () => void;
  isManagerView?: boolean;
}

export const ViewProductModal = ({ product, isOpen, onClose, isManagerView = false }: ViewProductModalProps) => {
  if (!product) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-white max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-[#3E2723]">
            Product Details
          </DialogTitle>
          <DialogDescription className="text-[#5D4037]">
            View complete product information
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {product.imageUrl && (
            <div className="flex justify-center">
              <img
                src={product.imageUrl || '/placeholder-coffee.jpg'}
                alt={product.name}
                className="w-48 h-48 object-cover rounded-lg border-2 border-[#E8DFD6] shadow-md"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-[#5D4037] mb-1">ID</h3>
              <p className="text-base font-mono text-[#3E2723]">{product.id}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-[#5D4037] mb-1">SKU</h3>
              <p className="text-base font-mono text-[#3E2723]">{product.sku}</p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-[#5D4037] mb-1">Name</h3>
            <p className="text-lg font-semibold text-[#3E2723]">{product.name}</p>
          </div>

          {isManagerView && (
            <div>
              <h3 className="text-sm font-medium text-[#5D4037] mb-1">Size</h3>
              <p className="text-base text-[#3E2723]">
                {product.size ? product.size : <span className="text-gray-400">—</span>}
              </p>
            </div>
          )}

          {product.description !== null && (
            <div>
              <h3 className="text-sm font-medium text-[#5D4037] mb-1">Description</h3>
              <p className="text-base text-[#3E2723]">
                {product.description || <span className="text-gray-400">No description provided</span>}
              </p>
            </div>
          )}

          {product.content !== null && (
            <div>
              <h3 className="text-sm font-medium text-[#5D4037] mb-1">Content/Ingredients</h3>
              <p className="text-base text-[#3E2723]">
                {product.content || <span className="text-gray-400">No content provided</span>}
              </p>
            </div>
          )}

          {isManagerView ? (
            <div>
              <h3 className="text-sm font-medium text-[#5D4037] mb-1">Price</h3>
              <p className="text-xl font-bold text-[#3E2723]">
                {product.minPrice.toLocaleString()}₫
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-[#5D4037] mb-1">Min Price</h3>
                <p className="text-xl font-bold text-[#3E2723]">
                  {product.minPrice.toLocaleString()}₫
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-[#5D4037] mb-1">Max Price</h3>
                <p className="text-xl font-bold text-[#3E2723]">
                  {product.maxPrice.toLocaleString()}₫
                </p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-[#5D4037] mb-1">Status</h3>
              <Badge
                variant={product.isActive ? "default" : "secondary"}
                className={
                  product.isActive
                    ? "bg-green-600 hover:bg-green-700 rounded-full"
                    : "bg-gray-500 hover:bg-gray-600 rounded-full"
                }
              >
                {product.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>
            <div>
              <h3 className="text-sm font-medium text-[#5D4037] mb-1">Has Topping</h3>
              {product.isHaveTopping === null || product.isHaveTopping === undefined ? (
                <span className="text-gray-400">—</span>
              ) : (
                <Badge
                  variant={product.isHaveTopping ? "default" : "secondary"}
                  className={
                    product.isHaveTopping
                      ? "bg-green-600 hover:bg-green-700 rounded-full"
                      : "bg-gray-500 hover:bg-gray-600 rounded-full"
                  }
                >
                  {product.isHaveTopping ? "Yes" : "No"}
                </Badge>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-[#5D4037] mb-1">Deleted</h3>
            <Badge
              variant={product.isDeleted ? "destructive" : "default"}
              className={
                product.isDeleted
                  ? "bg-red-600 hover:bg-red-700 rounded-full"
                  : "bg-green-600 hover:bg-green-700 rounded-full"
              }
            >
              {product.isDeleted ? "Yes" : "No"}
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-[#5D4037] mb-1">Created</h3>
              <p className="text-base text-[#3E2723]">
                {new Date(product.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-[#5D4037] mb-1">Last Updated</h3>
              <p className="text-base text-[#3E2723]">
                {new Date(product.updatedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
