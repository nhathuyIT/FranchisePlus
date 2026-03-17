import { Link } from "react-router-dom";
import { ArrowLeft, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ROUTER_URL } from "@/router/route.const";

interface PageHeaderProps {
  franchiseName: string | undefined;
  productSearch: string;
  onProductSearchChange: (value: string) => void;
}

const PageHeader = ({
  franchiseName,
  productSearch,
  onProductSearchChange,
}: PageHeaderProps) => {
  return (
    <div className="shrink-0 flex items-center gap-3 px-6 py-3 bg-white border-b border-[#E8DFD6]">
      <Link
        to={`${ROUTER_URL.ADMIN}/${ROUTER_URL.ADMIN_ROUTER.FRANCHISES}`}
        className="flex items-center gap-1.5 text-sm font-medium text-[#5D4037] hover:text-[#3E2723] transition-colors px-3 py-1.5 rounded-full border border-[#D7CCC8] hover:border-[#6D4C41] bg-white"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back
      </Link>

      <div className="h-5 w-px bg-[#D7CCC8]" />

      <span className="text-sm font-semibold text-[#3E2723] uppercase tracking-wide">
        {franchiseName ?? "Franchise"}
      </span>

      <div className="flex-1 max-w-sm ml-auto relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#5D4037]/50" />
        <Input
          placeholder="Search menu items..."
          value={productSearch}
          onChange={(e) => onProductSearchChange(e.target.value)}
          className="pl-9 bg-[#F5F0EB] border-[#E8DFD6] focus-visible:ring-[#6D4C41] rounded-full text-sm"
        />
      </div>
    </div>
  );
};

export default PageHeader;
