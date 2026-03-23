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
import type { AdminProductRow } from "./columns/product.columns";
import type { ProductSearchRequest } from "@/api/product/product.api";
import { getProduct, searchProducts } from "@/api/product/product.api";
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
import {
  useAdjustInventory,
  useCreateInventory,
  useInventorySearch,
} from "@/hooks/inventory/useInventory.hooks";
import type { InventorySearchItem } from "@/api/inventory/inventory.type";

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
    quantity: z.number().min(0, "Quantity must be 0 or greater").optional(),
    isHaveTopping: z.boolean().optional(),
    isActive: z.boolean(),
  })
  .refine((data) => data.maxPrice >= data.minPrice, {
    message: "Max price must be greater than or equal to min price",
    path: ["maxPrice"],
  });

type ProductFormData = z.infer<typeof productSchema>;

const toProductFormValues = (
  row: AdminProductRow,
  isManagerView: boolean,
): ProductFormData => ({
  productId: undefined,
  sku: row.sku ?? "",
  name: row.name ?? "",
  size: row.size ?? "",
  description: row.description ?? "",
  content: row.content ?? "",
  imageUrl: row.imageUrl ?? "",
  minPrice: row.minPrice,
  maxPrice: isManagerView ? 999999 : row.maxPrice,
  quantity: row.quantity,
  isHaveTopping: row.isHaveTopping ?? undefined,
  isActive: row.isActive,
});

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
        name: "isHaveTopping",
        type: "switch",
        label: "Has Topping",
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
        name: "quantity",
        type: "number",
        label: "Quantity",
        placeholder: "0",
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
      name: "isHaveTopping",
      type: "switch",
      label: "Has Topping",
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
  const dialog = useFormDialog<AdminProductRow>();
  
  // View modal state (separate from form dialog)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewingProduct, setViewingProduct] = useState<AdminProductRow | null>(null);

  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState<AdminProductRow | null>(null);

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
    data: globalProductsResponse,
    isLoading: isLoadingGlobal,
    error: globalError,
    refetch: refetchGlobal,
  } = useProductsQuery(searchParams);

  const responsePageInfo = globalProductsResponse?.pageInfo;

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

  const { data: inventorySearch, isLoading: isLoadingInventory } = useInventorySearch(
    {
      searchCondition: { franchiseId },
      pageInfo: { pageNum: 1, pageSize: 1000 },
    },
    { enabled: isManagerView && !!franchiseId },
  );

  const inventoryByProductFranchiseId = React.useMemo(() => {
    const map = new Map<string, InventorySearchItem>();
    for (const item of inventorySearch?.pageData ?? []) {
      map.set(String(item.productFranchiseId), item);
    }
    return map;
  }, [inventorySearch?.pageData]);

  // Product Franchise mutations (for managers)
  const createProductFranchiseMutation = useCreateProductFranchiseMutation();
  const updateProductFranchiseMutation = useUpdateProductFranchiseMutation();
  const deleteProductFranchiseMutation = useDeleteProductFranchiseMutation();
  const changeStatusProductFranchiseMutation = useChangeStatusProductFranchiseMutation();

  const adjustInventoryMutation = useAdjustInventory();
  const createInventoryMutation = useCreateInventory();

  // Select appropriate data based on context
  const products: AdminProductRow[] = isManagerView
    ? (franchiseProducts?.map((pf) => ({
        ...(inventoryByProductFranchiseId.get(String(pf.id))
          ? {
              quantity:
                inventoryByProductFranchiseId.get(String(pf.id))?.quantity ?? 0,
              inventoryId: String(
                inventoryByProductFranchiseId.get(String(pf.id))?.id ?? "",
              ),
              alertThreshold:
                inventoryByProductFranchiseId.get(String(pf.id))?.alertThreshold ?? 0,
            }
          : { quantity: 0, inventoryId: undefined, alertThreshold: 0 }),
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
        isHaveTopping: null,
        isActive: pf.isActive,
        isDeleted: pf.isDeleted,
        createdAt: pf.createdAt,
        updatedAt: pf.updatedAt,
      })) as AdminProductRow[] ?? [])
    : (globalProductsResponse?.data ?? []).map((p) => ({ ...p }));

  const isLoading = isManagerView ? (isLoadingFranchise || isLoadingInventory) : isLoadingGlobal;
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

  const handlePageChange = useCallback((pageNum: number) => {
    setSearchParams((prev) => ({
      ...prev,
      pageInfo: { ...prev.pageInfo, pageNum },
    }));
  }, []);

  const handlePageSizeChange = useCallback((pageSize: number) => {
    setSearchParams((prev) => ({
      ...prev,
      pageInfo: { pageNum: 1, pageSize },
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

        // Inventory: set quantity (create if missing, adjust if exists)
        const desiredQuantity = data.quantity;
        if (typeof desiredQuantity === "number" && Number.isFinite(desiredQuantity)) {
          const currentQuantity = (editingProduct.quantity ?? 0) as number;
          if (desiredQuantity !== currentQuantity) {
            const hasInventory = !!editingProduct.inventoryId;
            if (hasInventory) {
              await adjustInventoryMutation.mutateAsync({
                productFranchiseId: String(franchiseProductId),
                change: desiredQuantity - currentQuantity,
                alertThreshold: editingProduct.alertThreshold ?? 0,
                reason: "Manual set quantity",
              });
            } else if (desiredQuantity > 0) {
              await createInventoryMutation.mutateAsync({
                productFranchiseId: String(franchiseProductId),
                quantity: desiredQuantity,
                alertThreshold: 0,
              });
            }
          }
        }

        // Optional: allow managers to update global "has topping" flag
        if (
          typeof data.isHaveTopping === "boolean" &&
          data.isHaveTopping !== (editingProduct.isHaveTopping ?? null)
        ) {
          await updateMutation.mutateAsync({
            id: editingProduct.id,
            data: { is_have_topping: data.isHaveTopping },
          });
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
          is_have_topping: data.isHaveTopping ?? (editingProduct.isHaveTopping ?? false),
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
          is_have_topping: data.isHaveTopping ?? false,
          is_active: data.isActive,
        };
        await createMutation.mutateAsync(payload);
      }
    }
  };

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleEdit = (product: AdminProductRow) => {
    const baseEditData = {
      ...product,
      franchiseProductId: product.franchiseProductId,
      size: product.size || "",
      quantity: product.quantity ?? 0,
      inventoryId: product.inventoryId,
      alertThreshold: product.alertThreshold ?? 0,
    };

    if (isManagerView && baseEditData.isHaveTopping == null) {
      void getProduct(String(baseEditData.id))
        .then((full) => {
          dialog.openEdit({ ...baseEditData, isHaveTopping: full.isHaveTopping ?? null });
        })
        .catch(() => {
          dialog.openEdit(baseEditData);
        });
      return;
    }

    dialog.openEdit(baseEditData);
  };

  const handleView = (product: AdminProductRow) => {
    setViewingProduct(product);
    setIsViewModalOpen(true);
  };

  const handleDelete = (product: AdminProductRow) => {
    setDeletingProduct(product);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!deletingProduct) return;
    
    if (isManagerView && deletingProduct.franchiseProductId) {
      await deleteProductFranchiseMutation.mutateAsync(deletingProduct.franchiseProductId);
    } else {
      await deleteMutation.mutateAsync(deletingProduct.id);
    }
    
    setDeleteDialogOpen(false);
    setDeletingProduct(null);
  };

  const handleBulkDelete = async (selectedProducts: AdminProductRow[]) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${selectedProducts.length} product${selectedProducts.length > 1 ? "s" : ""}? This action cannot be undone.`,
    );
    if (confirmDelete) {
      if (isManagerView) {
        for (const p of selectedProducts) {
          if (p.franchiseProductId) {
            await deleteProductFranchiseMutation.mutateAsync(p.franchiseProductId);
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
  const handleStatusToggle = (product: AdminProductRow, isActive: boolean) => {
    if (isManagerView && product.franchiseProductId) {
      changeStatusProductFranchiseMutation.mutate({
        id: product.franchiseProductId,
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
      const found = products.find((p) => p.franchiseProductId === fpId);
      return found ? String(found.id) : null;
    }
    return null;
  })();

  // Prepare form values - need to set hidden fields for manager create mode validation
  const formValues: ProductFormData | undefined = dialog.data
    ? toProductFormValues(dialog.data, isManagerView)
    : isManagerView
      ? {
          // Manager create defaults (schema requires name/maxPrice even if fields are hidden)
          productId: "",
          sku: "",
          name: "temp",
          size: "",
          description: "",
          content: "",
          imageUrl: "",
          minPrice: 0,
          maxPrice: 999999,
          quantity: 0,
          isHaveTopping: undefined,
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
            pagination={
              !isManagerView
                ? {
                    pageNum: responsePageInfo?.pageNum ?? searchParams.pageInfo.pageNum,
                    pageSize: responsePageInfo?.pageSize ?? searchParams.pageInfo.pageSize,
                    totalItems: responsePageInfo?.totalItems ?? products.length,
                    totalPages: responsePageInfo?.totalPages ?? 1,
                    onPageChange: handlePageChange,
                    onPageSizeChange: handlePageSizeChange,
                  }
                : undefined
            }
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
        values={formValues}
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
