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
import {
  useUpdateProductFranchiseMutation,
  useDeleteProductFranchiseMutation,
  useProductFranchisesQuery,
  useChangeStatusProductFranchiseMutation,
  useCreateProductFranchiseMutation,
} from "@/hooks/product-franchise/useProductFranchiseQuery";
import { useAuthStore } from "@/stores/auth-store";

// ── Form schema ─────────────────────────────────────────────────────────────

const productSchema = z
  .object({
    sku: z.string().min(2, "SKU must be at least 2 characters").optional().or(z.literal("")),
    name: z.string().min(2, "Name must be at least 2 characters"),
    size: z.string().optional(),
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
  // Auth context - check if user is MANAGER with a franchise
  const { authUser, isAdmin } = useAuthStore();
  const isManagerView = !isAdmin() && authUser?.currentFranchiseId;
  const franchiseId = authUser?.currentFranchiseId || "";

  // Search & pagination state
  const [searchParams, setSearchParams] =
    useState<ProductSearchRequest>(DEFAULT_SEARCH_PARAMS);

  // Dialog state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);

  // ── TanStack Query hooks ──────────────────────────────────────────────────
  // Use different queries based on user role
  const {
    data: globalProducts,
    isLoading: isLoadingGlobal,
    error: globalError,
    refetch: refetchGlobal,
  } = useProductsQuery(searchParams);

  const {  data: franchiseProducts,
    isLoading: isLoadingFranchise,
    error: franchiseError,
    refetch: refetchFranchise,
  } = useProductFranchisesQuery({
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
      pageSize: 50,
    },
  });

  // Product Franchise mutations (for managers)
  const createProductFranchiseMutation = useCreateProductFranchiseMutation();
  const updateProductFranchiseMutation = useUpdateProductFranchiseMutation();
  const deleteProductFranchiseMutation = useDeleteProductFranchiseMutation();
  const changeStatusProductFranchiseMutation = useChangeStatusProductFranchiseMutation();

  // Select appropriate data based on context
  const products = isManagerView
    ? (franchiseProducts?.map((pf) => ({
        id: pf.productId,
        franchiseProductId: String(pf.id), // Store ProductFranchise ID for updates/deletes
        size: pf.size || "", // Store size for updates
        sku: pf.productSku || "",
        name: pf.productName || "",
        description: (pf as any).productDescription || null,
        content: (pf as any).productContent || null,
        imageUrl: pf.productImageUrl || null,
        minPrice: pf.priceBase,
        maxPrice: pf.priceBase,
        isActive: pf.isActive,
        isDeleted: pf.isDeleted,
        createdAt: pf.createdAt,
        updatedAt: pf.updatedAt,
      })) as (Product & { franchiseProductId?: string; size?: string })[] ?? [])
    : (globalProducts ?? []);

  const isLoading = isManagerView ? isLoadingFranchise : isLoadingGlobal;
  const error = isManagerView ? franchiseError : globalError;
  const refetch = isManagerView ? refetchFranchise : refetchGlobal;

  const createMutation = useCreateProductMutation();
  const updateMutation = useUpdateProductMutation();
  const deleteMutation = useDeleteProductMutation();

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
      size: "",
      description: "",
      content: "",
      imageUrl: "",
      minPrice: 0,
      maxPrice: 0,
      isActive: true,
    },
  });

  const onSubmit = (data: ProductFormData) => {
    console.log("[Products Page] Form submitted with data:", data);
    console.log("[Products Page] Is manager view:", isManagerView);
    console.log("[Products Page] Editing product:", editingProduct);
    
    // For managers, set maxPrice equal to minPrice since they only edit one price
    if (isManagerView) {
      data.maxPrice = data.minPrice;
    }
    
    if (editingProduct) {
      // Manager editing franchise product
      if (isManagerView && (editingProduct as any).franchiseProductId) {
        const franchiseProductId = (editingProduct as any).franchiseProductId;
        
        console.log("[Products Page] Manager editing franchise product:", franchiseProductId);
        
        // Update size and price_base (required fields)
        const updatePayload = {
          size: data.size || "",
          price_base: data.minPrice,
        };
        
        console.log("[Products Page] Update payload:", updatePayload);
        
        // Check if status changed
        const statusChanged = editingProduct.isActive !== data.isActive;
        
        // Always update size/price, then optionally change status
        updateProductFranchiseMutation.mutate(
          { id: franchiseProductId, data: updatePayload },
          {
            onSuccess: () => {
              // If status also changed, call the change status endpoint
              if (statusChanged) {
                changeStatusProductFranchiseMutation.mutate(
                  { id: franchiseProductId, data: { is_active: data.isActive } },
                  {
                    onSuccess: () => {
                      setIsDialogOpen(false);
                      setEditingProduct(null);
                      reset();
                    },
                  },
                );
              } else {
                setIsDialogOpen(false);
                setEditingProduct(null);
                reset();
              }
            },
          },
        );
      } else {
        // Admin editing global product
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
      }
    } else {
      // Creating new product
      if (isManagerView) {
        // Manager creating a product franchise entry
        // Search global products by SKU
        const searchForProduct = async () => {
          try {
            const searchResult = await refetchGlobal();
            const allGlobalProducts = searchResult.data ?? [];
            const existingProduct = allGlobalProducts.find((p) => p.sku === data.sku);
            
            if (!existingProduct) {
              alert("Product not found. Please select a valid product SKU.");
              return;
            }
            
            const franchisePayload = {
              franchise_id: franchiseId,
              product_id: String(existingProduct.id),
              size: data.size || "",
              price_base: data.minPrice,
            };
            
            createProductFranchiseMutation.mutate(franchisePayload, {
              onSuccess: () => {
                setIsDialogOpen(false);
                reset();
              },
            });
          } catch (error) {
            alert("Failed to search for product. Please try again.");
          }
        };
        
        void searchForProduct();
      } else {
        // Admin creating a global product
        const payload = {
          SKU: data.sku || "",
          name: data.name,
          description: data.description || null,
          content: data.content || null,
          image_url: data.imageUrl || null,
          min_price: data.minPrice,
          max_price: data.maxPrice,
          is_active: data.isActive,
        };
        createMutation.mutate(payload, {
          onSuccess: () => {
            setIsDialogOpen(false);
            reset();
          },
        });
      }
    }
  };

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setValue("sku", product.sku);
    setValue("name", product.name);
    setValue("size", (product as any).size || "");
    setValue("description", product.description || "");
    setValue("content", product.content || "");
    setValue("imageUrl", product.imageUrl || "");
    setValue("minPrice", product.minPrice);
    // For managers, set maxPrice high to avoid validation issues
    setValue("maxPrice", isManagerView ? 999999 : (product.maxPrice || product.minPrice));
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
    // For manager create, set default values for fields not in form
    if (isManagerView) {
      setValue("name", "temp"); // Will be replaced by API lookup
      setValue("maxPrice", 999999); // Set high to pass validation, will be set to minPrice in onSubmit
    }
    setIsDialogOpen(true);
  };

  const handleDelete = (product: Product) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${product.name}"? This action cannot be undone.`,
    );
    if (confirmDelete) {
      if (isManagerView && (product as any).franchiseProductId) {
        deleteProductFranchiseMutation.mutate((product as any).franchiseProductId);
      } else {
        deleteMutation.mutate(product.id);
      }
    }
  };

  const handleBulkDelete = (selectedProducts: Product[]) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${selectedProducts.length} product${selectedProducts.length > 1 ? "s" : ""}? This action cannot be undone.`,
    );
    if (confirmDelete) {
      if (isManagerView) {
        selectedProducts.forEach((p) => {
          if ((p as any).franchiseProductId) {
            deleteProductFranchiseMutation.mutate((p as any).franchiseProductId);
          }
        });
      } else {
        selectedProducts.forEach((p) => deleteMutation.mutate(p.id));
      }
    }
  };

  const handleRetry = () => {
    void refetch();
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 flex flex-col min-h-0 max-w-7xl mx-auto w-full">
        <PageHeader
          title={isManagerView ? "My Products" : "Product Management"}
          description={
            isManagerView
              ? "Manage products available in your franchise"
              : "Manage all products and pricing"
          }
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
                <form onSubmit={handleSubmit(onSubmit, (errors) => {
                  console.log("[Products Page] Form validation errors:", errors);
                })}>
                  <div className="grid gap-4 py-4">
                    {/* Manager View - Only editable fields */}
                    {isManagerView && editingProduct ? (
                      <>
                        <div className="grid gap-2">
                          <Label className="text-[#3E2723] font-medium">
                            Product Name
                          </Label>
                          <Input
                            value={editingProduct.name}
                            disabled
                            className="bg-gray-50"
                          />
                        </div>

                        <div className="grid gap-2">
                          <Label
                            htmlFor="size"
                            className="text-[#3E2723] font-medium"
                          >
                            Size <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="size"
                            placeholder="e.g., XL, M, L"
                            {...register("size")}
                            className={formErrors.size ? "border-red-500" : ""}
                          />
                          {formErrors.size && (
                            <p className="text-sm text-red-500">
                              {formErrors.size.message}
                            </p>
                          )}
                        </div>

                        <div className="grid gap-2">
                          <Label
                            htmlFor="minPrice"
                            className="text-[#3E2723] font-medium"
                          >
                            Price <span className="text-red-500">*</span>
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
                      </>
                    ) : (
                      /* Admin View or Manager Create - All fields */
                      <>
                        {isManagerView ? (
                          /* Manager Create Form - Simplified */
                          <>
                            <div className="grid gap-2">
                              <Label
                                htmlFor="sku"
                                className="text-[#3E2723] font-medium"
                              >
                                SKU <span className="text-red-500">*</span>
                              </Label>
                              <Input
                                id="sku"
                                placeholder="e.g., NH041-001"
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
                                htmlFor="size"
                                className="text-[#3E2723] font-medium"
                              >
                                Size <span className="text-red-500">*</span>
                              </Label>
                              <Input
                                id="size"
                                placeholder="e.g., XL, M, L or DEFAULT"
                                {...register("size")}
                                className={formErrors.size ? "border-red-500" : ""}
                              />
                              {formErrors.size && (
                                <p className="text-sm text-red-500">
                                  {formErrors.size.message}
                                </p>
                              )}
                            </div>

                            <div className="grid gap-2">
                              <Label
                                htmlFor="minPrice"
                                className="text-[#3E2723] font-medium"
                              >
                                Price <span className="text-red-500">*</span>
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
                          </>
                        ) : (
                          /* Admin Create/Edit Form - Full Fields */
                          <>
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
                          </>
                        )}
                      </>
                    )}
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
            onSearch={!isManagerView ? handleSearch : undefined}
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
