import { DialogFooter, DialogHeader } from "@/components/ui/dialog";
import type { SearchCategoryFranchise } from "@/types/categoryFranchise.type";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { DetailRow } from "./DetailRow";
import { Button } from "@/components/ui/button";
import { ICONS } from "./franchise-icons";
import { FlatIcon } from "./FlatIcon";

export const ViewModal = ({
  category,
  open,
  onClose,
}: {
  category: SearchCategoryFranchise | null;
  open: boolean;
  onClose: () => void;
}) => (
  <Dialog open={open} onOpenChange={onClose}>
    <DialogContent className="max-w-md">
      <DialogHeader>
        <DialogTitle className="text-[#3E2723] flex items-center gap-2">
          <FlatIcon src={ICONS.category} alt="" className="h-5 w-5" />
          Category Detail
        </DialogTitle>
      </DialogHeader>
      {category && (
        <div className="space-y-0 text-sm max-h-[60vh] overflow-y-auto pr-1">
          <DetailRow label="ID" value={category.id} mono />
          <DetailRow label="Category Name" value={category.categoryName} />
          <DetailRow label="Franchise Name" value={category.franchiseName} />
          <DetailRow
            label="Status"
            value={
              <Badge
                className={
                  category.isActive
                    ? "bg-green-600 text-white"
                    : "bg-gray-400 text-white"
                }
              >
                {category.isActive ? "Active" : "Inactive"}
              </Badge>
            }
          />
          <DetailRow label="Category ID" value={category.categoryId} mono />
          <DetailRow label="Franchise ID" value={category.franchiseId} mono />
          <DetailRow
            label="Created At"
            value={new Date(category.createdAt).toLocaleString("en-US")}
          />
          <DetailRow
            label="Updated At"
            value={new Date(category.updatedAt).toLocaleString("en-US")}
          />
        </div>
      )}
      <DialogFooter>
        <Button
          variant="outline"
          onClick={onClose}
          className="border-[#E8DFD6] text-[#5D4037]"
        >
          Close
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);
