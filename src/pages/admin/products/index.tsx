import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Eye, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PRODUCTS, PRODUCT_CATEGORY_MAP } from "@/const/product.const";
import { CATEGORIES } from "@/const/category.const";
import type { Product } from "@/types/product.type";

const ProductsPage = () => {
  const [products] = useState<Product[]>(PRODUCTS);
  const [searchTerm, setSearchTerm] = useState("");

  const getCategoryName = (productId: string | number) => {
    const categoryId = PRODUCT_CATEGORY_MAP[Number(productId)];
    return CATEGORIES.find((cat) => cat.id === categoryId)?.name || "Uncategorized";
  };

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.SKU.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getCategoryName(product.id).toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 bg-gradient-to-br from-[#FAF8F5] via-[#F5F1EB] to-[#EDE7DD] min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-[#3E2723]">Product Management</h1>
            <p className="text-[#5D4037] mt-1">Manage all products and pricing</p>
          </div>
          <Link to="/admin/products/create">
            <Button className="bg-[#6D4C41] hover:bg-[#5D4037] text-white rounded-full shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer">
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-[#E8DFD6] p-6">
          <div className="mb-4">
            <Input
              placeholder="Search by name, SKU, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
            />
          </div>

          <div className="rounded-2xl overflow-hidden border border-[#E8DFD6]">
            <Table>
              <TableHeader>
                <TableRow className="bg-gradient-to-br from-[#FAF8F5] to-[#F5F1EB] hover:bg-gradient-to-br hover:from-[#FAF8F5] hover:to-[#F5F1EB]">
                  <TableHead className="font-semibold text-[#3E2723] w-16">ID</TableHead>
                  <TableHead className="font-semibold text-[#3E2723]">SKU</TableHead>
                  <TableHead className="font-semibold text-[#3E2723]">Name</TableHead>
                  <TableHead className="font-semibold text-[#3E2723]">Category</TableHead>
                  <TableHead className="font-semibold text-[#3E2723]">Price Range</TableHead>
                  <TableHead className="font-semibold text-[#3E2723]">Status</TableHead>
                  <TableHead className="font-semibold text-[#3E2723] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow
                    key={product.id}
                    className="hover:bg-[#FAF8F5] transition-colors duration-200 border-b border-[#E8DFD6] cursor-pointer"
                  >
                    <TableCell className="font-mono text-sm text-[#5D4037]">
                      {product.id}
                    </TableCell>
                    <TableCell className="font-mono text-sm text-[#5D4037]">
                      {product.SKU}
                    </TableCell>
                    <TableCell className="font-medium text-[#3E2723]">
                      {product.name}
                    </TableCell>
                    <TableCell className="text-[#5D4037]">
                      {getCategoryName(product.id)}
                    </TableCell>
                    <TableCell className="text-[#5D4037]">
                      ${product.min_price.toFixed(2)} - ${product.max_price.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={product.is_active ? "default" : "secondary"}
                        className={
                          product.is_active
                            ? "bg-green-600 hover:bg-green-700 rounded-full"
                            : "bg-gray-500 hover:bg-gray-600 rounded-full"
                        }
                      >
                        {product.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Link to={`/admin/products/${product.id}`}>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-2 border-[#6D4C41] text-[#6D4C41] hover:bg-[#6D4C41] hover:text-white rounded-lg transition-all duration-200 cursor-pointer"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Link to={`/admin/products/${product.id}/edit`}>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-2 border-[#D97706] text-[#D97706] hover:bg-[#D97706] hover:text-white rounded-lg transition-all duration-200 cursor-pointer"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-all duration-200 cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
