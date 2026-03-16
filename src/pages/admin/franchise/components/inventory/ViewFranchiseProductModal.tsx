import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

interface ProductFranchise {
  id: number | string;
  productName?: string;
  size?: string;
  priceBase: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ViewFranchiseProductModalProps {
  productFranchise: ProductFranchise | null;
  open: boolean;
  onClose: () => void;
}

export const ViewFranchiseProductModal = ({
  productFranchise,
  open,
  onClose,
}: ViewFranchiseProductModalProps) => {
  if (!productFranchise) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-[#4A3B2A]">Product Details</DialogTitle>
          <DialogDescription>
            View detailed information about this product
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label className="text-[#4A3B2A] font-semibold">Product Name</Label>
            <p className="text-sm text-gray-700">
              {productFranchise.productName || "N/A"}
            </p>
          </div>

          <div className="space-y-2">
            <Label className="text-[#4A3B2A] font-semibold">Size</Label>
            <p className="text-sm text-gray-700">
              {productFranchise.size || "DEFAULT"}
            </p>
          </div>

          <div className="space-y-2">
            <Label className="text-[#4A3B2A] font-semibold">Price</Label>
            <p className="text-sm text-gray-700 font-semibold">
              ${productFranchise.priceBase.toFixed(2)}
            </p>
          </div>

          <div className="space-y-2">
            <Label className="text-[#4A3B2A] font-semibold">Status</Label>
            <div>
              <Badge
                variant={productFranchise.isActive ? "default" : "secondary"}
                className={
                  productFranchise.isActive
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-gray-500 hover:bg-gray-600"
                }
              >
                {productFranchise.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-[#4A3B2A] font-semibold">Created At</Label>
              <p className="text-sm text-gray-700">
                {new Date(productFranchise.createdAt).toLocaleString()}
              </p>
            </div>

            <div className="space-y-2">
              <Label className="text-[#4A3B2A] font-semibold">Last Updated</Label>
              <p className="text-sm text-gray-700">
                {new Date(productFranchise.updatedAt).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
