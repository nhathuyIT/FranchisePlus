import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useProductFranchisesQuery } from "@/hooks/product-franchise/useProductFranchiseQuery";

interface FranchiseInventoryTabProps {
  franchiseId: string;
}

export const FranchiseInventoryTab = ({ franchiseId }: FranchiseInventoryTabProps) => {
  const { data: productFranchises, isLoading, error } = useProductFranchisesQuery({
    searchCondition: {
      keyword: "",
      product_id: "",
      franchise_id: franchiseId,
      min_price: "",
      max_price: "",
      is_active: "",
      is_deleted: false,
    },
    pageInfo: {
      pageNum: 1,
      pageSize: 100,
    },
  });

  return (
    <div className="h-full flex flex-col bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-[#4A3B2A] mb-4 shrink-0">
        Inventory Stock
      </h2>

      <div className="flex-1 min-h-0 overflow-auto">
        {isLoading ? (
          <div className="text-center py-8 text-gray-500">
            Loading inventory...
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">
            Failed to load inventory. Please try again.
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow className="bg-[#FAF9F6]">
                  <TableHead className="font-semibold text-[#4A3B2A]">Product</TableHead>
                  <TableHead className="font-semibold text-[#4A3B2A]">SKU</TableHead>
                  <TableHead className="font-semibold text-[#4A3B2A]">Size</TableHead>
                  <TableHead className="font-semibold text-[#4A3B2A]">Price</TableHead>
                  <TableHead className="font-semibold text-[#4A3B2A]">Status</TableHead>
                  <TableHead className="font-semibold text-[#4A3B2A]">Last Updated</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {productFranchises?.map((pf) => (
                  <TableRow key={pf.id} className="hover:bg-[#FAF9F6]">
                    <TableCell className="font-medium text-[#4A3B2A]">
                      {pf.productName || "N/A"}
                    </TableCell>
                    <TableCell className="text-gray-700 font-mono text-sm">
                      {pf.productSku || "N/A"}
                    </TableCell>
                    <TableCell className="text-gray-700">
                      {pf.size || "DEFAULT"}
                    </TableCell>
                    <TableCell className="text-gray-700 font-semibold">
                      ${pf.priceBase.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={pf.isActive ? "default" : "secondary"}
                        className={
                          pf.isActive
                            ? "bg-green-600 hover:bg-green-700"
                            : "bg-gray-500 hover:bg-gray-600"
                        }
                      >
                        {pf.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-700">
                      {new Date(pf.updatedAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {(!productFranchises || productFranchises.length === 0) && (
              <div className="text-center py-8 text-gray-500">
                No inventory items found for this franchise.
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
