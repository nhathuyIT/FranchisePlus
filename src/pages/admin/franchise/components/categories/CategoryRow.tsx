import { Badge } from "@/components/ui/badge";
import { TableCell, TableRow } from "@/components/ui/table";
import type { SearchCategoryFranchise } from "@/types/categoryFranchise.type";
import { FlatIcon } from "./FlatIcon";
import { ICONS } from "./franchise-icons";
import { Button } from "@/components/ui/button";
import { Eye, Pencil, Trash2 } from "lucide-react";

export const CategoryRow = ({
  category,
  index,
  onView,
  onUpdate,
  onDelete,
}: {
  category: SearchCategoryFranchise;
  index: number;
  onView: (c: SearchCategoryFranchise) => void;
  onUpdate: (c: SearchCategoryFranchise) => void;
  onDelete: (c: SearchCategoryFranchise) => void;
}) => (
  <TableRow className="hover:bg-[#FAF8F5]/50 transition-colors duration-150">
    <TableCell className="text-center text-[#5D4037]/70 font-mono text-sm">
      {index}
    </TableCell>
    <TableCell>
      <span className="font-medium text-[#3E2723]">
        {category.categoryName}
      </span>
    </TableCell>
    <TableCell className="text-center">
      <Badge
        variant="outline"
        className="border-[#6D4C41]/30 text-[#6D4C41] font-mono"
      >
        {category.displayOrder}
      </Badge>
    </TableCell>
    <TableCell className="text-center">
      <Badge
        variant={category.isActive ? "default" : "secondary"}
        className={
          category.isActive
            ? "bg-green-600 hover:bg-green-700 text-white rounded-full px-3"
            : "bg-gray-400 hover:bg-gray-500 text-white rounded-full px-3"
        }
      >
        <FlatIcon
          src={category.isActive ? ICONS.active : ICONS.inactive}
          alt={category.isActive ? "Active" : "Inactive"}
          className="h-4 w-4 inline-block mr-1"
        />
        {category.isActive ? "Active" : "Inactive"}
      </Badge>
    </TableCell>
    {/* Actions */}
    <TableCell className="text-center">
      <div className="flex items-center justify-center gap-1">
        <Button
          size="icon"
          variant="ghost"
          onClick={() => onView(category)}
          className="h-8 w-8 text-[#5D4037] hover:bg-[#FAF8F5] hover:text-[#3E2723]"
          title="View details"
        >
          <Eye className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          onClick={() => onUpdate(category)}
          className="h-8 w-8 text-blue-600 hover:bg-blue-50"
          title="Update"
        >
          <Pencil className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          onClick={() => onDelete(category)}
          className="h-8 w-8 text-red-600 hover:bg-red-50"
          title="Delete"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </TableCell>
    {/* Is Deleted */}
    <TableCell className="text-center">
      <Badge
        variant={category.isDeleted ? "destructive" : "outline"}
        className={
          category.isDeleted
            ? "rounded-full px-3"
            : "border-green-500 text-green-700 rounded-full px-3"
        }
      >
        {category.isDeleted ? "Yes" : "No"}
      </Badge>
    </TableCell>
  </TableRow>
);
