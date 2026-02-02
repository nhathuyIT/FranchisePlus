import { useState } from "react";
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
import type { InventoryItemView } from "@/types/inventory";

interface UpdateStockModalProps {
  item: InventoryItemView | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (inventoryId: string, newQuantity: number) => void;
}

export const UpdateStockModal = ({
  item,
  isOpen,
  onClose,
  onUpdate,
}: UpdateStockModalProps) => {
  const [quantity, setQuantity] = useState<string>(
    item?.inventory.quantity.toString() || "0"
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (item) {
      const newQuantity = parseFloat(quantity);
      if (!isNaN(newQuantity) && newQuantity >= 0) {
        onUpdate(item.inventory.id.toString(), newQuantity);
        onClose();
      }
    }
  };

  const handleQuantityChange = (value: string) => {
    // Allow numbers and decimal point
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setQuantity(value);
    }
  };

  if (!item) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-[#4A3B2A]">Update Stock Quantity</DialogTitle>
          <DialogDescription>
            Adjust the inventory quantity for this product
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label className="text-[#4A3B2A] font-semibold">Product</Label>
              <p className="text-sm text-gray-700">{item.product.name}</p>
            </div>

            <div className="space-y-2">
              <Label className="text-[#4A3B2A] font-semibold">SKU</Label>
              <p className="text-sm text-gray-700 font-mono">{item.product.SKU}</p>
            </div>

            <div className="space-y-2">
              <Label className="text-[#4A3B2A] font-semibold">Franchise</Label>
              <p className="text-sm text-gray-700">{item.franchiseName}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[#4A3B2A] font-semibold">Current Quantity</Label>
                <p className="text-sm text-gray-700">
                  {item.inventory.quantity} kg
                </p>
              </div>

              <div className="space-y-2">
                <Label className="text-[#4A3B2A] font-semibold">Alert Threshold</Label>
                <p className="text-sm text-gray-700">
                  {item.inventory.alert_threshold} kg
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity" className="text-[#4A3B2A] font-semibold">
                New Quantity *
              </Label>
              <div className="flex gap-2">
                <Input
                  id="quantity"
                  value={quantity}
                  onChange={(e) => handleQuantityChange(e.target.value)}
                  placeholder="Enter new quantity"
                  required
                  className="border-gray-300 focus:border-[#4A3B2A] focus:ring-[#4A3B2A]"
                />
                <span className="flex items-center text-gray-700 font-medium px-3">
                  kg
                </span>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[#4A3B2A] hover:bg-[#3A2B1A] text-white"
            >
              Update Stock
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
