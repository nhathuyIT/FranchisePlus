import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

export interface PageHeaderProps {
  /**
   * Main title of the page
   */
  title: string;

  /**
   * Optional description/subtitle below title
   */
  description?: string;

  /**
   * Optional icon to display inline with title
   */
  icon?: LucideIcon;

  /**
   * Icon size (Tailwind classes)
   * @default "h-8 w-8"
   */
  iconSize?: string;

  /**
   * Optional action button or custom content on the right
   */
  action?: ReactNode;
}

/**
 * Reusable page header component for admin pages
 * Provides consistent title, description, and action layout
 *
 * @example
 * // Basic usage
 * <PageHeader
 *   title="Franchise Management"
 *   description="Manage all your franchise locations"
 * />
 *
 * @example
 * // With action button
 * <PageHeader
 *   title="Product Management"
 *   description="Manage all products and pricing"
 *   action={
 *     <Link to="/admin/products/create">
 *       <Button>
 *         <Plus className="mr-2 h-4 w-4" />
 *         Add Product
 *       </Button>
 *     </Link>
 *   }
 * />
 *
 * @example
 * // With inline icon
 * <PageHeader
 *   title="Low Stock Alert"
 *   description="Items that need immediate attention"
 *   icon={AlertTriangle}
 *   iconSize="h-8 w-8"
 * />
 */
export const PageHeader = ({
  title,
  description,
  icon: Icon,
  iconSize = "h-8 w-8",
  action,
}: PageHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-3xl font-bold text-[#3E2723] flex items-center gap-2">
          {Icon && <Icon className={`${iconSize} text-[#D97706]`} />}
          {title}
        </h1>
        {description && (
          <p className="text-[#5D4037] mt-1">{description}</p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
};
