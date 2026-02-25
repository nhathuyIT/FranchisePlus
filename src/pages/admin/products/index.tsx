import { useState } from "react";
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PRODUCTS, PRODUCT_CATEGORY_MAP } from "@/const/product.const";
import { CATEGORIES } from "@/const/category.const";
import { PageHeader } from "@/components/common/PageHeader";
import { ProductTable } from "./components/ProductTable";
import { ViewProductModal } from "./components/ViewProductModal";
import type { Product } from "@/types/product.type";

const productSchema = z.object({
  sku: z.string().min(2, "SKU must be at least 2 characters"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().optional(),
  content: z.string().optional(),
  imageUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  categoryId: z.string().min(1, "Category is required"),
  minPrice: z.number().min(0, "Min price must be positive"),
  maxPrice: z.number().min(0, "Max price must be positive"),
  is_active: z.boolean(),
}).refine((data) => data.maxPrice >= data.minPrice, {
  message: "Max price must be greater than or equal to min price",
  path: ["maxPrice"],
});

type ProductFormData = z.infer<typeof productSchema>;

const ProductsPage = () => {
  const [products] = useState<Product[]>(PRODUCTS);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      sku: "",
      name: "",
      description: "",
      content: "",
      imageUrl: "",
      categoryId: "",
      minPrice: 0,
      maxPrice: 0,
      is_active: true,
    },
  });

  const onSubmit = (data: ProductFormData) => {
    if (editingProduct) {
      console.log("Update product:", editingProduct.id, data);
      toast.success("Product updated successfully!");
    } else {
      console.log("Create product:", data);
      toast.success("Product created successfully!");
    }
    setIsDialogOpen(false);
    setEditingProduct(null);
    reset();
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    const categoryId = PRODUCT_CATEGORY_MAP[Number(product.id)];
    setValue("sku", product.sku);
    setValue("name", product.name);
    setValue("description", product.description || "");
    setValue("content", product.content || "");
    setValue("imageUrl", product.imageUrl || "");
    setValue("categoryId", categoryId?.toString() || "");
    setValue("minPrice", product.minPrice);
    setValue("maxPrice", product.maxPrice);
    setValue("is_active", product.is_active);
    setIsDialogOpen(true);
  };

  const handleView = (product: Product) => {
    setViewingProduct(product);
    setIsViewModalOpen(true);
  };

  const handleCreate = () => {
    setEditingProduct(null);
    reset();
    setIsDialogOpen(true);
  };

  const handleDelete = (product: Product) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${product.name}"? This action cannot be undone.`
    );
    if (confirmDelete) {
      console.log("Delete product:", product.id);
      toast.success("Product deleted successfully!");
    }
  };

  const handleBulkDelete = (selectedProducts: Product[]) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${selectedProducts.length} product${selectedProducts.length > 1 ? 's' : ''}? This action cannot be undone.`
    );
    if (confirmDelete) {
      console.log("Bulk delete products:", selectedProducts.map(p => p.id));
      toast.success(`Successfully deleted ${selectedProducts.length} product${selectedProducts.length > 1 ? 's' : ''}`);
    }
  };

  const handleRetry = () => {
    setError(null);
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="p-6 bg-gradient-to-br from-[#FAF8F5] via-[#F5F1EB] to-[#EDE7DD] min-h-screen">
      <div className="max-w-7xl mx-auto">
        <PageHeader
          title="Product Management"
          description="Manage all products and pricing"
          action={
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  onClick={handleCreate}
                  className="bg-[#6D4C41] hover:bg-[#5D4037] text-white rounded-full shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Product
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px] bg-white max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold text-[#3E2723]">
                    {editingProduct ? "Edit Product" : "Create New Product"}
                  </DialogTitle>
                  <DialogDescription className="text-[#5D4037]">
                    {editingProduct 
                      ? "Update the product information below." 
                      : "Add a new product to your catalog. Fill in all required fields."}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name" className="text-[#3E2723] font-medium">
                        Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="name"
                        placeholder="e.g., Caramel Macchiato"
                        {...register("name")}
                        className={errors.name ? "border-red-500" : ""}
                      />
                      {errors.name && (
                        <p className="text-sm text-red-500">{errors.name.message}</p>
                      )}
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="sku" className="text-[#3E2723] font-medium">
                        SKU <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="sku"
                        placeholder="e.g., ESP-001"
                        {...register("sku")}
                        className={errors.sku ? "border-red-500" : ""}
                      />
                      {errors.sku && (
                        <p className="text-sm text-red-500">{errors.sku.message}</p>
                      )}
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="imageUrl" className="text-[#3E2723] font-medium">
                        Image URL
                      </Label>
                      <Input
                        id="imageUrl"
                        type="url"
                        placeholder="https://example.com/image.jpg"
                        {...register("imageUrl")}
                        className={errors.imageUrl ? "border-red-500" : ""}
                      />
                      {errors.imageUrl && (
                        <p className="text-sm text-red-500">{errors.imageUrl.message}</p>
                      )}
                      {watch("imageUrl") && (
                        <div className="mt-2">
                          <img
                            src={watch("imageUrl") || ""}
                            alt="Preview"
                            className="w-32 h-32 object-cover rounded-lg border border-[#E8DFD6]"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        </div>
                      )}
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="categoryId" className="text-[#3E2723] font-medium">
                        Category <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={watch("categoryId")}
                        onValueChange={(value) => setValue("categoryId", value)}
                      >
                        <SelectTrigger className={errors.categoryId ? "border-red-500" : ""}>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {CATEGORIES.filter((cat) => cat.is_active && !cat.is_deleted).map((cat) => (
                            <SelectItem key={cat.id} value={cat.id.toString()}>
                              {cat.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.categoryId && (
                        <p className="text-sm text-red-500">{errors.categoryId.message}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="minPrice" className="text-[#3E2723] font-medium">
                          Min Price <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="minPrice"
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          {...register("minPrice", { valueAsNumber: true })}
                          className={errors.minPrice ? "border-red-500" : ""}
                        />
                        {errors.minPrice && (
                          <p className="text-sm text-red-500">{errors.minPrice.message}</p>
                        )}
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="maxPrice" className="text-[#3E2723] font-medium">
                          Max Price <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="maxPrice"
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          {...register("maxPrice", { valueAsNumber: true })}
                          className={errors.maxPrice ? "border-red-500" : ""}
                        />
                        {errors.maxPrice && (
                          <p className="text-sm text-red-500">{errors.maxPrice.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="description" className="text-[#3E2723] font-medium">
                        Description
                      </Label>
                      <Textarea
                        id="description"
                        placeholder="Enter product description..."
                        rows={3}
                        {...register("description")}
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="content" className="text-[#3E2723] font-medium">
                        Content/Ingredients
                      </Label>
                      <Textarea
                        id="content"
                        placeholder="Product ingredients or details..."
                        rows={2}
                        {...register("content")}
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="is_active"
                        {...register("is_active")}
                        className="w-4 h-4 text-[#6D4C41] border-gray-300 rounded focus:ring-[#6D4C41]"
                      />
                      <Label htmlFor="is_active" className="text-[#3E2723] font-medium cursor-pointer">
                        Active
                      </Label>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsDialogOpen(false);
                        setEditingProduct(null);
                        reset();
                      }}
                      className="border-[#E8DFD6] text-[#5D4037] hover:bg-[#FAF8F5]"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="bg-[#6D4C41] hover:bg-[#5D4037] text-white"
                    >
                      {editingProduct ? "Update Product" : "Create Product"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          }
        />

        <div className="bg-white rounded-2xl shadow-lg border border-[#E8DFD6] p-6">
          <ProductTable
            products={products}
            isLoading={isLoading}
            error={error}
            onRetry={handleRetry}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onBulkDelete={handleBulkDelete}
          />
        </div>

        <ViewProductModal
          product={viewingProduct}
          isOpen={isViewModalOpen}
          onClose={() => {
            setIsViewModalOpen(false);
            setViewingProduct(null);
          }}
        />
      </div>
    </div>
  );
};

export default ProductsPage;
