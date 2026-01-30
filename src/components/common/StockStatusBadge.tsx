import { Badge } from "@/components/ui/badge";

interface StockStatusBadgeProps {
  quantity: number;
  lowStockThreshold: number;
}

export const StockStatusBadge = ({ quantity, lowStockThreshold }: StockStatusBadgeProps) => {
  const percentage = (quantity / lowStockThreshold) * 100;

  let variant: "default" | "secondary" | "destructive" | "outline" = "default";
  let label = "Good Stock";
  let colorClass = "bg-green-600 hover:bg-green-700"; // Coffee theme green

  if (percentage <= 50) {
    variant = "destructive";
    label = "Critical";
    colorClass = "bg-[#EF4444] hover:bg-[#DC2626]"; // Red from design system
  } else if (percentage <= 100) {
    variant = "secondary";
    label = "Low Stock";
    colorClass = "bg-[#D97706] hover:bg-[#B45309]"; // Terracotta/Amber from design system
  }

  return (
    <Badge variant={variant} className={colorClass}>
      {label}
    </Badge>
  );
};
