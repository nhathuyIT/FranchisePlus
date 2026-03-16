import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PopoverSearchSelect } from "@/components/form-dialog";
import { searchProducts } from "@/api/product/product.api";
import { createProductFranchise } from "@/api/product-franchise/product-franchise.api";
import { Loader2 } from "lucide-react";

const createSchema = z.object({
  productId: z.string().min(1, "Product is required").transform((val) => val),
  size: z.string().optional(),
  priceBase: z.number().min(0, "Price must be 0 or greater"),
  isActive: z.boolean().optional(),
});

type CreateForm = z.infer<typeof createSchema>;

interface AddFranchiseProductModalProps {
  franchiseId: string;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AddFranchiseProductModal = ({
  franchiseId,
  open,
  onClose,
  onSuccess,
}: AddFranchiseProductModalProps) => {
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<CreateForm>({
    productId: "",
    size: "",
    priceBase: 0,
    isActive: true,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (!open) {
      setFormData({
        productId: "",
        size: "",
        priceBase: 0,
        isActive: true,
      });
      setErrors({});
    }
  }, [open]);

  // Fetch all active products
  const { data: products = [], isLoading: isLoadingProducts } = useQuery({
    queryKey: ["products", "active"],
    queryFn: () =>
      searchProducts({
        searchCondition: {
          keyword: "",
          min_price: "",
          max_price: "",
          is_active: true,
          is_deleted: false,
        },
        pageInfo: { pageNum: 1, pageSize: 100 },
      }),
    enabled: open,
  });

  const productOptions = products.map((product) => ({
    value: String(product.id),
    label: `${product.name} - ${product.sku} (${product.minPrice.toLocaleString()}₫ - ${product.maxPrice.toLocaleString()}₫)`,
  }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate
    const result = createSchema.safeParse(formData);
    if (!result.success) {
      const newErrors: Record<string, string> = {};
      result.error.issues.forEach((err) => {
        if (err.path[0]) {
          newErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      await createProductFranchise({
        franchise_id: franchiseId,
        product_id: formData.productId,
        size: formData.size || undefined,
        price_base: formData.priceBase,
        is_active: formData.isActive ?? true,
      });

      toast.success("Product added to franchise inventory");
      void queryClient.invalidateQueries({ queryKey: ["product-franchises"] });
      onSuccess();
    } catch (error) {
      console.error("Failed to add product:", error);
      toast.error("Failed to add product. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Product to Franchise</DialogTitle>
          <DialogDescription>
            Select a product and configure its price for this franchise.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Product Selection */}
          <div className="space-y-2">
            <Label htmlFor="product">
              Product <span className="text-red-500">*</span>
            </Label>
            <PopoverSearchSelect
              id="product"
              value={formData.productId}
              onValueChange={(value) => {
                setFormData({
                  ...formData,
                  productId: value,
                });
                setErrors({ ...errors, productId: "" });
              }}
              options={productOptions}
              placeholder={isLoadingProducts ? "Loading products..." : "Select a product"}
              searchPlaceholder="Search products..."
              emptyText="No product found."
              isLoading={isLoadingProducts}
              disabled={isLoadingProducts}
              minChars={0}
              resetSearchOnClose
            />
            {errors.productId && (
              <p className="text-sm text-red-500">{errors.productId}</p>
            )}
          </div>

          {/* Size */}
          <div className="space-y-2">
            <Label htmlFor="size">Size</Label>
            <Input
              id="size"
              type="text"
              placeholder="e.g., S, M, L, XL"
              value={formData.size}
              onChange={(e) =>
                setFormData({ ...formData, size: e.target.value })
              }
            />
          </div>

          {/* Price */}
          <div className="space-y-2">
            <Label htmlFor="price">
              Price <span className="text-red-500">*</span>
            </Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              min="0"
              placeholder="0"
              value={formData.priceBase || ""}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  priceBase: parseFloat(e.target.value) || 0,
                });
                setErrors({ ...errors, priceBase: "" });
              }}
            />
            {errors.priceBase && (
              <p className="text-sm text-red-500">{errors.priceBase}</p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || isLoadingProducts}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add Product
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
