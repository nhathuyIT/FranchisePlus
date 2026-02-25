import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PRODUCT_CATEGORY_MAP } from "@/const/product.const";
import { CATEGORIES } from "@/const/category.const";
import type { Product } from "@/types/product.type";

interface ViewProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

const getCategoryName = (productId: number) => {
  const categoryId = PRODUCT_CATEGORY_MAP[productId];
  return CATEGORIES.find((cat) => cat.id === categoryId)?.name || "Uncategorized";
};

export const ViewProductModal = ({ product, isOpen, onClose }: ViewProductModalProps) => {
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
                src={product.imageUrl}
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

          <div>
            <h3 className="text-sm font-medium text-[#5D4037] mb-1">Category</h3>
            <p className="text-base text-[#3E2723]">{getCategoryName(Number(product.id))}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-[#5D4037] mb-1">Description</h3>
            <p className="text-base text-[#3E2723]">
              {product.description || <span className="text-gray-400">No description provided</span>}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-[#5D4037] mb-1">Content/Ingredients</h3>
            <p className="text-base text-[#3E2723]">
              {product.content || <span className="text-gray-400">No content provided</span>}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-[#5D4037] mb-1">Min Price</h3>
              <p className="text-xl font-bold text-[#3E2723]">
                ${product.minPrice.toFixed(2)}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-[#5D4037] mb-1">Max Price</h3>
              <p className="text-xl font-bold text-[#3E2723]">
                ${product.maxPrice.toFixed(2)}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-[#5D4037] mb-1">Status</h3>
              <Badge
                variant={product.is_active ? "default" : "secondary"}
                className={
                  product.is_active
                    ? "bg-green-600 hover:bg-green-700 rounded-full"
                    : "bg-gray-500 hover:bg-gray-600 rounded-full"
                }
              >
                {product.is_active ? "Active" : "Inactive"}
              </Badge>
            </div>
            <div>
              <h3 className="text-sm font-medium text-[#5D4037] mb-1">Deleted</h3>
              <Badge
                variant={product.is_deleted ? "destructive" : "default"}
                className={
                  product.is_deleted
                    ? "bg-red-600 hover:bg-red-700 rounded-full"
                    : "bg-green-600 hover:bg-green-700 rounded-full"
                }
              >
                {product.is_deleted ? "Yes" : "No"}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-[#5D4037] mb-1">Created</h3>
              <p className="text-base text-[#3E2723]">
                {new Date(product.created_at).toLocaleDateString()}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-[#5D4037] mb-1">Last Updated</h3>
              <p className="text-base text-[#3E2723]">
                {new Date(product.updated_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
