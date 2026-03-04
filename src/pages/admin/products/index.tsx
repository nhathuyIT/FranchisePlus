import { useState, useCallback } from "react";
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ImageUpload } from "@/components/ui/image-upload";
import { uploadFileToCloudinary } from "@/config/cloudinary";
import { PageHeader } from "@/components/common/PageHeader";
import { ProductTable } from "./components/ProductTable";
import { ViewProductModal } from "./components/ViewProductModal";
import type { Product } from "@/types/product.type";
import type { ProductSearchRequest } from "@/api/product/product.api";
import {
  useProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} from "@/hooks/product/useProductQuery";

// ── Form schema ─────────────────────────────────────────────────────────────

const productSchema = z
  .object({
    sku: z.string().min(2, "SKU must be at least 2 characters"),
    name: z.string().min(2, "Name must be at least 2 characters"),
    description: z.string().optional(),
    content: z.string().optional(),
    imageUrl: z
      .string()
      .url("Must be a valid URL")
      .optional()
      .or(z.literal("")),
    minPrice: z.number().min(0, "Min price must be positive"),
    maxPrice: z.number().min(0, "Max price must be positive"),
    isActive: z.boolean(),
  })
  .refine((data) => data.maxPrice >= data.minPrice, {
    message: "Max price must be greater than or equal to min price",
    path: ["maxPrice"],
  });

type ProductFormData = z.infer<typeof productSchema>;

// ── Default search params ───────────────────────────────────────────────────

const DEFAULT_SEARCH_PARAMS: ProductSearchRequest = {
  searchCondition: {
    keyword: "",
    min_price: "",
    max_price: "",
    is_active: "",
    is_deleted: false,
  },
  pageInfo: {
    pageNum: 1,
    pageSize: 10,
  },
};

// ── Component ───────────────────────────────────────────────────────────────

const ProductsPage = () => {
  // Search & pagination state
  const [searchParams, setSearchParams] =
    useState<ProductSearchRequest>(DEFAULT_SEARCH_PARAMS);

  // Dialog state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);

  // ── TanStack Query hooks ──────────────────────────────────────────────────
  const {
    data: searchResponse,
    isLoading,
    error,
    refetch,
  } = useProductsQuery(searchParams);

  const createMutation = useCreateProductMutation();
  const updateMutation = useUpdateProductMutation();
  const deleteMutation = useDeleteProductMutation();

  const products = searchResponse ?? [];
  const isMutating =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending;

  // ── Search handler ────────────────────────────────────────────────────────

  const handleSearch = useCallback((keyword: string) => {
    setSearchParams((prev) => ({
      ...prev,
      searchCondition: { ...prev.searchCondition, keyword },
      pageInfo: { ...prev.pageInfo, pageNum: 1 },
    }));  
  }, []);

  // ── Form ──────────────────────────────────────────────────────────────────

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors: formErrors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      sku: "",
      name: "",
      description: "",
      content: "",
      imageUrl: "",
      minPrice: 0,
      maxPrice: 0,
      isActive: true,
    },
  });

  const onSubmit = (data: ProductFormData) => {
    const payload = {
      SKU: data.sku,
      name: data.name,
      description: data.description || null,
      content: data.content || null,
      image_url: data.imageUrl || null,
      min_price: data.minPrice,
      max_price: data.maxPrice,
      is_active: data.isActive,
    };

    if (editingProduct) {
      updateMutation.mutate(
        { id: editingProduct.id, data: payload },
        {
          onSuccess: () => {
            setIsDialogOpen(false);
            setEditingProduct(null);
            reset();
          },
        },
      );
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => {
          setIsDialogOpen(false);
          reset();
        },
      });
    }
  };

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setValue("sku", product.sku);
    setValue("name", product.name);
    setValue("description", product.description || "");
    setValue("content", product.content || "");
    setValue("imageUrl", product.imageUrl || "");
    setValue("minPrice", product.minPrice);
    setValue("maxPrice", product.maxPrice);
    setValue("isActive", product.isActive);
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
      `Are you sure you want to delete "${product.name}"? This action cannot be undone.`,
    );
    if (confirmDelete) {
      deleteMutation.mutate(product.id);
    }
  };

  const handleBulkDelete = (selectedProducts: Product[]) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${selectedProducts.length} product${selectedProducts.length > 1 ? "s" : ""}? This action cannot be undone.`,
    );
    if (confirmDelete) {
      selectedProducts.forEach((p) => deleteMutation.mutate(p.id));
    }
  };

  const handleRetry = () => {
    void refetch();
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 flex flex-col min-h-0 max-w-7xl mx-auto w-full">
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
                      <Label
                        htmlFor="name"
                        className="text-[#3E2723] font-medium"
                      >
                        Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="name"
                        placeholder="e.g., Caramel Macchiato"
                        {...register("name")}
                        className={formErrors.name ? "border-red-500" : ""}
                      />
                      {formErrors.name && (
                        <p className="text-sm text-red-500">
                          {formErrors.name.message}
                        </p>
                      )}
                    </div>

                    <div className="grid gap-2">
                      <Label
                        htmlFor="sku"
                        className="text-[#3E2723] font-medium"
                      >
                        SKU <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="sku"
                        placeholder="e.g., ESP-001"
                        {...register("sku")}
                        className={formErrors.sku ? "border-red-500" : ""}
                      />
                      {formErrors.sku && (
                        <p className="text-sm text-red-500">
                          {formErrors.sku.message}
                        </p>
                      )}
                    </div>

                    <div className="grid gap-2">
                      <Label
                        htmlFor="imageUrl"
                        className="text-[#3E2723] font-medium"
                      >
                        Product Image
                      </Label>
                      <ImageUpload
                        value={watch("imageUrl") || ""}
                        onChange={(url) => setValue("imageUrl", url)}
                        onUpload={uploadFileToCloudinary}
                        disabled={isMutating}
                      />
                      {formErrors.imageUrl && (
                        <p className="text-sm text-red-500">
                          {formErrors.imageUrl.message}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label
                          htmlFor="minPrice"
                          className="text-[#3E2723] font-medium"
                        >
                          Min Price <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="minPrice"
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          {...register("minPrice", { valueAsNumber: true })}
                          className={
                            formErrors.minPrice ? "border-red-500" : ""
                          }
                        />
                        {formErrors.minPrice && (
                          <p className="text-sm text-red-500">
                            {formErrors.minPrice.message}
                          </p>
                        )}
                      </div>
                      <div className="grid gap-2">
                        <Label
                          htmlFor="maxPrice"
                          className="text-[#3E2723] font-medium"
                        >
                          Max Price <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="maxPrice"
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          {...register("maxPrice", { valueAsNumber: true })}
                          className={
                            formErrors.maxPrice ? "border-red-500" : ""
                          }
                        />
                        {formErrors.maxPrice && (
                          <p className="text-sm text-red-500">
                            {formErrors.maxPrice.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid gap-2">
                      <Label
                        htmlFor="description"
                        className="text-[#3E2723] font-medium"
                      >
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
                      <Label
                        htmlFor="content"
                        className="text-[#3E2723] font-medium"
                      >
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
                        id="isActive"
                        {...register("isActive")}
                        className="w-4 h-4 text-[#6D4C41] border-gray-300 rounded focus:ring-[#6D4C41]"
                      />
                      <Label
                        htmlFor="isActive"
                        className="text-[#3E2723] font-medium cursor-pointer"
                      >
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
                      disabled={isMutating}
                      className="bg-[#6D4C41] hover:bg-[#5D4037] text-white"
                    >
                      {isMutating
                        ? "Saving..."
                        : editingProduct
                          ? "Update Product"
                          : "Create Product"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          }
        />

        <div className="flex-1 min-h-0 flex flex-col bg-white rounded-2xl shadow-lg border border-[#E8DFD6] p-6">
          <ProductTable
            products={products}
            isLoading={isLoading}
            error={error instanceof Error ? error : null}
            onRetry={handleRetry}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onBulkDelete={handleBulkDelete}
            onSearch={handleSearch}
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
