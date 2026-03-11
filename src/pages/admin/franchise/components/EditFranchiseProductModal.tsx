import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useUpdateProductFranchiseMutation } from "@/hooks/product-franchise/useProductFranchiseQuery";

interface ProductFranchise {
  id: number | string;
  productName?: string;
  size?: string;
  priceBase: number;
  isActive: boolean;
}

interface EditFranchiseProductModalProps {
  productFranchise: ProductFranchise | null;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const EditFranchiseProductModal = ({
  productFranchise,
  open,
  onClose,
  onSuccess,
}: EditFranchiseProductModalProps) => {
  const [size, setSize] = useState("");
  const [price, setPrice] = useState("");
  const [isActive, setIsActive] = useState(true);

  const updateMutation = useUpdateProductFranchiseMutation();

  useEffect(() => {
    if (productFranchise) {
      setSize(productFranchise.size || "");
      setPrice(productFranchise.priceBase.toString());
      setIsActive(productFranchise.isActive);
    }
  }, [productFranchise]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!productFranchise) return;

    const priceValue = parseFloat(price);
    if (isNaN(priceValue) || priceValue <= 0) {
      return;
    }

    try {
      await updateMutation.mutateAsync({
        id: productFranchise.id,
        data: {
          size: size.trim() || undefined,
          price_base: priceValue,
          is_active: isActive,
        },
      });
      onSuccess();
    } catch (error) {
      console.error("Failed to update product franchise:", error);
    }
  };

  const handleClose = () => {
    setSize("");
    setPrice("");
    onClose();
  };

  if (!productFranchise) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-[#4A3B2A]">Edit Product</DialogTitle>
          <DialogDescription>
            Update the product details for this franchise
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label className="text-[#4A3B2A] font-semibold">Product</Label>
              <p className="text-sm text-gray-700">
                {productFranchise.productName || "N/A"}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="size" className="text-[#4A3B2A]">
                Size
              </Label>
              <Input
                id="size"
                value={size}
                onChange={(e) => setSize(e.target.value)}
                placeholder="e.g., M, L, XL"
                className="border-gray-300 focus:border-[#4A3B2A] focus:ring-[#4A3B2A]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price" className="text-[#4A3B2A]">
                Price *
              </Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0"
                required
                className="border-gray-300 focus:border-[#4A3B2A] focus:ring-[#4A3B2A]"
              />
            </div>

            <div className="flex items-center justify-between space-x-2">
              <div className="space-y-0.5">
                <Label htmlFor="status" className="text-[#4A3B2A] font-semibold">
                  Status
                </Label>
                <p className="text-sm text-gray-500">
                  Toggle to activate or deactivate this product
                </p>
              </div>
              <Switch
                id="status"
                checked={isActive}
                onCheckedChange={setIsActive}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="border-gray-300 text-gray-700 hover:bg-gray-100"
              disabled={updateMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[#4A3B2A] hover:bg-[#3A2B1A] text-white"
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending ? "Updating..." : "Update Product"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
