import { useState, useCallback } from "react";
import * as React from "react";
import { Plus } from "lucide-react";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { FormDialog, useFormDialog } from "@/components/form-dialog";
import { DeleteDialog } from "@/components/form-dialog/DeleteDialog";
import type { FieldConfig } from "@/lib/form/field-config";
import { PageHeader } from "@/components/common/PageHeader";
import { ProductTable } from "./components/ProductTable";
import { ViewProductModal } from "./components/ViewProductModal";
import type { Product } from "@/types/product.type";
import type { ProductSearchRequest } from "@/api/product/product.api";
import { searchProducts } from "@/api/product/product.api";
import {
  useProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useUpdateProductStatusMutation,
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
    productId: z.string().optional(), // For manager create mode
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

// ── Field configurations ────────────────────────────────────────────────────

// Helper to get field configs based on role and mode
const getProductFields = (
  isManagerView: boolean,
  mode: "create" | "edit",
  cachedProducts?: { label: string; value: string }[]
): FieldConfig<ProductFormData>[] => {
  // Manager editing - only size, price, and status
  if (isManagerView && mode === "edit") {
    return [
      {
        name: "name",
        type: "text",
        label: "Product Name",
        disabled: true,
      },
      {
        name: "size",
        type: "text",
        label: "Size",
        placeholder: "e.g., XL, M, L",
        required: true,
      },
      {
        name: "minPrice",
        type: "number",
        label: "Price",
        placeholder: "0.00",
        step: 0.01,
        min: 0,
        required: true,
      },
      {
        name: "isActive",
        type: "switch",
        label: "Active",
      },
    ];
  }


  if (isManagerView && mode === "create") {
    return [
      {
        name: "productId",
        type: "async-select",
        label: "Product",
        placeholder: "Search for a product...",
        required: true,
        asyncOptions: {
          loader: async (searchTerm: string) => {
            try {
              // If there is cached products and no search term, return cache immediately
              if (cachedProducts && cachedProducts.length > 0 && !searchTerm) {
                return cachedProducts;
              }

              // If searching, filter the cache first for instant results
              if (cachedProducts && cachedProducts.length > 0 && searchTerm) {
                const filtered = cachedProducts.filter(p => 
                  p.label.toLowerCase().includes(searchTerm.toLowerCase())
                );
                return filtered;
              }

              const products = await searchProducts({
                searchCondition: {
                  keyword: searchTerm,
                  min_price: "",
                  max_price: "",
                  is_active: true,
                  is_deleted: false,
                },
                pageInfo: {
                  pageNum: 1,
                  pageSize: 50,
                },
              });
              
              return products.map((p) => ({
                label: `${p.name} - ${p.sku} (${p.minPrice.toLocaleString()}₫ - ${p.maxPrice.toLocaleString()}₫)`,
                value: String(p.id),
              }));
            } catch (error) {
              console.error('[Product Dropdown] Error loading products:', error);
              return [];
            }
          },
          debounceMs: 100,
          minChars: 0,
        },
        colSpan: 2,
      },
      {
        name: "size",
        type: "text",
        label: "Size",
        placeholder: "e.g., S, M, L, XL",
        required: false,
      },
      {
        name: "minPrice",
        type: "number",
        label: "Price",
        placeholder: "0",
        step: 0.01,
        min: 0,
        required: true,
      },
    ];
  }

  // Admin - full form fields
  return [
    {
      name: "name",
      type: "text",
      label: "Name",
      placeholder: "e.g., Caramel Macchiato",
      required: true,
      colSpan: 2,
    },
    {
      name: "sku",
      type: "text",
      label: "SKU",
      placeholder: "e.g., ESP-001",
      required: true,
      colSpan: 2,
    },
    {
      name: "imageUrl",
      type: "image-upload",
      label: "Product Image",
      colSpan: 2,
    },
    {
      name: "minPrice",
      type: "number",
      label: "Min Price",
      placeholder: "0.00",
      step: 0.01,
      min: 0,
      required: true,
      colSpan: 1,
    },
    {
      name: "maxPrice",
      type: "number",
      label: "Max Price",
      placeholder: "0.00",
      step: 0.01,
      min: 0,
      required: true,
      colSpan: 1,
    },
    {
      name: "description",
      type: "textarea",
      label: "Description",
      placeholder: "Enter product description...",
      rows: 3,
      colSpan: 2,
    },
    {
      name: "content",
      type: "textarea",
      label: "Content/Ingredients",
      placeholder: "Product ingredients or details...",
      rows: 2,
      colSpan: 2,
    },
    {
      name: "isActive",
      type: "switch",
      label: "Active",
      colSpan: 2,
    },
  ];
};

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
  const isManagerView = !isAdmin() && !!authUser?.currentFranchiseId;
  const franchiseId = authUser?.currentFranchiseId || "";

  // Search & pagination state
  const [searchParams, setSearchParams] =
    useState<ProductSearchRequest>(DEFAULT_SEARCH_PARAMS);

  // Dialog state
  const dialog = useFormDialog<Product & { franchiseProductId?: string; size?: string }>();
  
  // View modal state (separate from form dialog)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);

  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);

  // Product dropdown cache for managers
  const [productDropdownCache, setProductDropdownCache] = useState<{ label: string; value: string }[]>([]);
  const [isLoadingDropdownCache, setIsLoadingDropdownCache] = useState(false);

  React.useEffect(() => {
    if (isManagerView && dialog.isOpen && dialog.mode === "create" && productDropdownCache.length === 0 && !isLoadingDropdownCache) {
      setIsLoadingDropdownCache(true);
      searchProducts({
        searchCondition: {
          keyword: "",
          min_price: "",
          max_price: "",
          is_active: true,
          is_deleted: false,
        },
        pageInfo: {
          pageNum: 1,
          pageSize: 100,
        },
      })
        .then((products) => {
          const options = products.map((p) => ({
            label: `${p.name} - ${p.sku} (${p.minPrice.toLocaleString()}₫ - ${p.maxPrice.toLocaleString()}₫)`,
            value: String(p.id),
          }));
          setProductDropdownCache(options);
        })
        .catch((error) => {
          console.error('[Product Dropdown] Error pre-loading products:', error);
        })
        .finally(() => {
          setIsLoadingDropdownCache(false);
        });
    }
  }, [isManagerView, dialog.isOpen, dialog.mode, productDropdownCache.length, isLoadingDropdownCache]);

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
        description: null, // Not returned by backend for franchise products
        content: null, // Not returned by backend for franchise products
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
  const productStatusMutation = useUpdateProductStatusMutation();

  // ── Search handler ────────────────────────────────────────────────────────

  const handleSearch = useCallback((keyword: string) => {
    setSearchParams((prev) => ({
      ...prev,
      searchCondition: { ...prev.searchCondition, keyword },
      pageInfo: { ...prev.pageInfo, pageNum: 1 },
    }));  
  }, []);

  // ── Form submission handler ──────────────────────────────────────────────

  const handleSubmit = async (data: ProductFormData) => {
    console.log("[Products Page] Form submitted with data:", data);
    console.log("[Products Page] Is manager view:", isManagerView);
    console.log("[Products Page] Dialog mode:", dialog.mode);
    
    // For managers, set maxPrice equal to minPrice since they only edit one price
    if (isManagerView) {
      data.maxPrice = data.minPrice;
    }
    
    if (dialog.mode === "edit" && dialog.data) {
      const editingProduct = dialog.data;
      
      // Manager editing franchise product
      if (isManagerView && editingProduct.franchiseProductId) {
        const franchiseProductId = editingProduct.franchiseProductId;
        
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
        await updateProductFranchiseMutation.mutateAsync(
          { id: franchiseProductId, data: updatePayload }
        );
        
        // If status also changed, call the change status endpoint
        if (statusChanged) {
          await changeStatusProductFranchiseMutation.mutateAsync(
            { id: franchiseProductId, data: { is_active: data.isActive } }
          );
        }
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
        await updateMutation.mutateAsync(
          { id: editingProduct.id, data: payload }
        );
      }
    } else {
      // Creating new product
      if (isManagerView) {
        // Manager creating a product franchise entry
        if (!data.productId) {
          throw new Error("Please select a product.");
        }
        
        const franchisePayload = {
          franchise_id: franchiseId,
          product_id: data.productId,
          size: data.size || "",
          price_base: data.minPrice,
        };
        
        await createProductFranchiseMutation.mutateAsync(franchisePayload);
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
        await createMutation.mutateAsync(payload);
      }
    }
  };

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleEdit = (product: Product) => {
    const editData = {
      ...product,
      franchiseProductId: (product as any).franchiseProductId,
      size: (product as any).size || "",
    };
    dialog.openEdit(editData);
  };

  const handleView = (product: Product) => {
    setViewingProduct(product);
    setIsViewModalOpen(true);
  };

  const handleDelete = (product: Product) => {
    setDeletingProduct(product);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!deletingProduct) return;
    
    if (isManagerView && (deletingProduct as any).franchiseProductId) {
      await deleteProductFranchiseMutation.mutateAsync((deletingProduct as any).franchiseProductId);
    } else {
      await deleteMutation.mutateAsync(deletingProduct.id);
    }
    
    setDeleteDialogOpen(false);
    setDeletingProduct(null);
  };

  const handleBulkDelete = async (selectedProducts: Product[]) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${selectedProducts.length} product${selectedProducts.length > 1 ? "s" : ""}? This action cannot be undone.`,
    );
    if (confirmDelete) {
      if (isManagerView) {
        for (const p of selectedProducts) {
          if ((p as any).franchiseProductId) {
            await deleteProductFranchiseMutation.mutateAsync((p as any).franchiseProductId);
          }
        }
      } else {
        for (const p of selectedProducts) {
          await deleteMutation.mutateAsync(p.id);
        }
      }
    }
  };

  const handleRetry = () => {
    void refetch();
  };

  // Get dynamic field configuration
  const formMode = (dialog.mode === "create" || dialog.mode === "edit") ? dialog.mode : "create";
  const productFields = getProductFields(isManagerView, formMode, productDropdownCache);

  // ── Status toggle handler ───────────────────────────────────────────────
  const handleStatusToggle = (product: Product, isActive: boolean) => {
    if (isManagerView && (product as any).franchiseProductId) {
      changeStatusProductFranchiseMutation.mutate({
        id: (product as any).franchiseProductId,
        data: { is_active: isActive },
      });
    } else {
      productStatusMutation.mutate({ id: product.id, isActive });
    }
  };

  const statusPendingId = (() => {
    if (productStatusMutation.isPending) return String(productStatusMutation.variables?.id);
    if (changeStatusProductFranchiseMutation.isPending) {
      // Find the product id from the franchise product id
      const fpId = String(changeStatusProductFranchiseMutation.variables?.id);
      const found = products.find((p) => (p as any).franchiseProductId === fpId);
      return found ? String(found.id) : null;
    }
    return null;
  })();

  // Prepare form values - need to set hidden fields for manager create mode validation
  const formValues = dialog.data 
    ? {
        ...dialog.data,
        // For manager edit, set maxPrice to pass validation
        maxPrice: isManagerView ? 999999 : dialog.data.maxPrice,
      }
    : isManagerView 
      ? {
          // Manager create defaults
          name: "temp",
          productId: "",
          size: "",
          minPrice: undefined,
          maxPrice: 999999,
          isActive: true,
        }
      : undefined;

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
            <Button
              onClick={dialog.openCreate}
              className="bg-[#6D4C41] hover:bg-[#5D4037] text-white rounded-full shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
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
            onStatusToggle={handleStatusToggle}
            statusPendingId={statusPendingId}
            canEdit={true}
            isManagerView={isManagerView}
          />
        </div>

        <ViewProductModal
          product={viewingProduct}
          isOpen={isViewModalOpen}
          onClose={() => {
            setIsViewModalOpen(false);
            setViewingProduct(null);
          }}
          isManagerView={isManagerView}
        />
      </div>

      <FormDialog<ProductFormData>
        open={dialog.isOpen}
        onOpenChange={(open) => !open && dialog.close()}
        title={dialog.mode === "create" ? "Create New Product" : "Edit Product"}
        description={
          dialog.mode === "create"
            ? "Add a new product to your catalog. Fill in all required fields."
            : "Update the product information below."
        }
        schema={productSchema}
        fields={productFields}
        values={formValues as any}
        mode={dialog.mode}
        onSubmit={handleSubmit}
        onSuccess={dialog.close}
        size="lg"
        columns={1}
      />

      <DeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        entity={deletingProduct}
        entityName="Product"
        onConfirm={confirmDelete}
        isDeleting={deleteMutation.isPending || deleteProductFranchiseMutation.isPending}
        getDisplayName={(product) => product.name}
        deleteMessage={(product) => 
          `Remove the "${product.name}" ${isManagerView ? 'from this franchise' : 'product'}? This action cannot be undone.`
        }
      />
    </div>
  );
};

export default ProductsPage;
