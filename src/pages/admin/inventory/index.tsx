import { useState, useMemo, useCallback } from "react";
import { Link } from "react-router";
import { Package, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { ROUTER_URL } from "@/router/route.const";
import { PageHeader } from "@/components/common/PageHeader";
import { InventoryTable } from "./components/InventoryTable";
import {
  FormDialog,
  useFormDialog,
  DeleteDialog,
} from "@/components/form-dialog";
import {
  adjustInventoryFields,
  adjustInventorySchema,
  addInventoryFields,
  addInventorySchema,
} from "./inventory-form.config";
import type { AdjustInventoryFormData } from "@/lib/schemas/inventory.schema";
import type { AddInventoryItemFormData } from "@/lib/schemas/inventory.schema";
import type { SubmitResult } from "@/components/form-dialog/types";
import type { InventorySearchItem } from "@/api/inventory/inventory.type";
import { useInventorySearch, useDeleteInventory } from "@/hooks/inventory";
import { useFranchiseSelect } from "@/hooks/franchise";
import { Permission } from "@/config/permission";
import { useAuthStore } from "@/stores/auth-store";
import * as inventoryApi from "@/api/inventory/inventory.api";
import { useDebounce } from "@/hooks/common/useDebounce";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const InventoryList = () => {
  const { authUser, getCurrentPermissions } = useAuthStore();
  const userPermissions = getCurrentPermissions();

  // Permission checks
  const canViewInventory = userPermissions.includes(Permission.VIEW_INVENTORY);
  const canManageInventory = userPermissions.includes(
    Permission.MANAGE_INVENTORY,
  );

  // ── Search / filter state ─────────────────────────────────────────────────

  /** Server-side filter: franchiseId */
  const [selectedFranchiseId, setSelectedFranchiseId] = useState<string>("");

  /** Client-side filter: product name text search (API has no keyword field) */
  const [productNameQuery, setProductNameQuery] = useState<string>("");
  const debouncedProductName = useDebounce(
    productNameQuery,
    300,
    productNameQuery,
  );

  // ── Cache scope key ────────────────────────────────────────────────────────

  const inventoryScopeKey = authUser
    ? `${authUser.user.id}-${authUser.currentRoleId ?? "none"}-${authUser.currentFranchiseId ?? "global"}`
    : "anonymous";

  // ── Data fetching ──────────────────────────────────────────────────────────

  /**
   * Franchise dropdown options for the server-side filter.
   * Uses FranchiseSelect API (lightweight, no pagination).
   */
  const { data: franchiseOptions = [] } = useFranchiseSelect();

  /**
   * Main inventory search — re-fetches when franchiseId changes.
   * Product name search is client-side (INVENTORY-02 has no keyword field).
   */
  const {
    data: inventorySearchResult,
    isLoading, // true ONLY on first load (no cached data) → page skeleton
    isFetching, // true on any fetch including refetch on filter change
    error,
    refetch,
  } = useInventorySearch(
    {
      searchCondition: {
        isDeleted: false,
        ...(selectedFranchiseId ? { franchiseId: selectedFranchiseId } : {}),
      },
      pageInfo: { pageNum: 1, pageSize: 100 },
    },
    { enabled: canViewInventory, scopeKey: inventoryScopeKey },
  );

  const inventoryItems = inventorySearchResult?.pageData ?? [];

  /**
   * Client-side filter by product name on top of API-filtered data.
   * This is necessary because INVENTORY-02 API doesn't support keyword search.
   */
  const filteredItems = useMemo(() => {
    if (!debouncedProductName.trim()) return inventoryItems;
    const q = debouncedProductName.toLowerCase();
    return inventoryItems.filter(
      (item) =>
        item.productName.toLowerCase().includes(q) ||
        item.franchiseName.toLowerCase().includes(q),
    );
  }, [inventoryItems, debouncedProductName]);

  const deleteMutation = useDeleteInventory({ suppressToast: true });
  const listError = error instanceof Error ? error : null;

  // ── Form dialogs ───────────────────────────────────────────────────────────

  const adjustDialog = useFormDialog<InventorySearchItem>();
  const addDialog = useFormDialog<InventorySearchItem>();
  const [deleteTarget, setDeleteTarget] = useState<InventorySearchItem | null>(
    null,
  );

  const refreshData = () => {
    void refetch();
  };

  // ── Submit handlers ────────────────────────────────────────────────────────

  const handleAdjustSubmit = async (
    data: AdjustInventoryFormData,
  ): Promise<SubmitResult | void> => {
    if (!adjustDialog.data) return;
    await inventoryApi.adjust({
      productFranchiseId: String(adjustDialog.data.productFranchiseId),
      change: data.change,
      alertThreshold: data.alertThreshold,
      reason: data.reason,
    });
    toast.success("Inventory adjusted successfully");
  };

  const handleAddSubmit = async (
    data: AddInventoryItemFormData,
  ): Promise<SubmitResult | void> => {
    const response = await inventoryApi.create({
      productFranchiseId: data.productFranchiseId,
      quantity: data.quantity,
      alertThreshold: data.alertThreshold,
    });
    if (!response) throw new Error("Failed to create inventory item");
    toast.success("Inventory item added successfully");
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteMutation.mutateAsync(String(deleteTarget.id));
      toast.success(
        `Inventory item "${deleteTarget.productName}" deleted successfully`,
      );
      setDeleteTarget(null);
      refreshData();
    } catch {
      toast.error("Failed to delete inventory item");
    }
  };

  const handleEdit = (item: InventorySearchItem) => {
    if (!canManageInventory) {
      toast.error("You do not have permission to edit inventory.");
      return;
    }
    adjustDialog.openEdit(item);
  };

  const handleOpenDelete = (item: InventorySearchItem) => {
    if (!canManageInventory) {
      toast.error("You do not have permission to delete inventory items.");
      return;
    }
    setDeleteTarget(item);
  };

  /**
   * Inline save: calls INVENTORY-06 adjust API for quantity and/or alertThreshold changes.
   * The adjust API accepts { change (delta), alert_threshold (absolute), reason }.
   */
  const handleSaveRow = useCallback(
    async (
      item: InventorySearchItem,
      newQuantity: number,
      newAlertThreshold: number,
    ) => {
      const quantityChanged = newQuantity !== item.quantity;
      const thresholdChanged = newAlertThreshold !== item.alertThreshold;

      if (!quantityChanged && !thresholdChanged) return;

      const delta = newQuantity - item.quantity;
      await inventoryApi.adjust({
        productFranchiseId: String(item.productFranchiseId),
        change: quantityChanged ? delta : 0,
        alertThreshold: newAlertThreshold,
        reason: "Inline table edit",
      });

      const parts: string[] = [];
      if (quantityChanged) {
        parts.push(`quantity ${delta > 0 ? "+" : ""}${delta}`);
      }
      if (thresholdChanged) {
        parts.push(`threshold → ${newAlertThreshold}`);
      }
      toast.success(`Updated "${item.productName}": ${parts.join(", ")}`);

      void refetch();
    },
    [refetch],
  );

  const adjustDialogTitle = useMemo(() => {
    if (!adjustDialog.data) return "Adjust Stock";
    return `Adjust Stock: ${adjustDialog.data.productName}`;
  }, [adjustDialog.data]);

  const adjustDialogDescription = useMemo(() => {
    if (!adjustDialog.data) return "";
    return `Current quantity: ${adjustDialog.data.quantity} | Threshold: ${adjustDialog.data.alertThreshold}`;
  }, [adjustDialog.data]);

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 flex flex-col min-h-0 max-w-7xl mx-auto w-full">
        <PageHeader
          title="Inventory Management"
          description="Track all products across franchises"
          action={
            <div className="flex gap-3">
              {canManageInventory && (
                <Button
                  onClick={addDialog.openCreate}
                  className="bg-[#6D4C41] hover:bg-[#3E2723] text-white rounded-full shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Item
                </Button>
              )}
              <Link
                to={`${ROUTER_URL.ADMIN}/${ROUTER_URL.ADMIN_ROUTER.INVENTORY_LOW_STOCK}`}
              >
                <Button className="bg-[#D97706] hover:bg-[#B45309] text-white rounded-full shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer">
                  <Package className="mr-2 h-4 w-4" />
                  Low Stock Alert
                </Button>
              </Link>
            </div>
          }
        />

        <div className="flex-1 min-h-0 flex flex-col bg-white rounded-2xl shadow-lg border border-[#E8DFD6] p-6">
          {/* ── Search & Filter bar ───────────────────────────────────── */}
          <div className="flex items-center gap-3 mb-4 shrink-0 flex-wrap">
            {/* Product name search (client-side — API has no keyword) */}
            <div className="relative flex-1 min-w-[200px] max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#5D4037]" />
              <Input
                placeholder="Search by product or franchise..."
                value={productNameQuery}
                onChange={(e) => setProductNameQuery(e.target.value)}
                className="pl-10 border-[#E8DFD6] focus:border-[#6D4C41] focus:ring-[#6D4C41]"
              />
            </div>

            {/* Franchise filter (server-side — API supports franchiseId) */}
            <Select
              value={selectedFranchiseId || "all"}
              onValueChange={(v) =>
                setSelectedFranchiseId(v === "all" ? "" : v)
              }
            >
              <SelectTrigger className="w-52 border-[#E8DFD6] focus:border-[#6D4C41]">
                <SelectValue placeholder="All Franchises" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Franchises</SelectItem>
                {franchiseOptions.map((f) => (
                  <SelectItem key={f.value} value={f.value}>
                    {f.name} ({f.code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Result count */}
            {!isFetching && (
              <span className="text-xs text-[#8D6E63] ml-auto">
                {filteredItems.length} item
                {filteredItems.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>

          {/* DataTable handling its own loading state natively via TanStack Table */}
          <InventoryTable
            items={canViewInventory ? filteredItems : []}
            isLoading={isLoading || isFetching || deleteMutation.isPending}
            error={listError}
            onRetry={refetch}
            onEdit={canManageInventory ? handleEdit : undefined}
            onDelete={canManageInventory ? handleOpenDelete : undefined}
            canEdit={canManageInventory}
            onSaveRow={canManageInventory ? handleSaveRow : undefined}
          />
        </div>

        {/* Adjust Stock Dialog (INVENTORY-06) */}
        <FormDialog<AdjustInventoryFormData>
          open={adjustDialog.isOpen}
          onOpenChange={(open) => !open && adjustDialog.close()}
          title={adjustDialogTitle}
          description={adjustDialogDescription}
          size="md"
          schema={adjustInventorySchema}
          fields={adjustInventoryFields}
          defaultValues={{
            alertThreshold: adjustDialog.data?.alertThreshold ?? 0,
          }}
          mode={adjustDialog.mode === "view" ? "view" : "edit"}
          onSubmit={handleAdjustSubmit}
          onSuccess={() => {
            adjustDialog.close();
            refreshData();
          }}
        />

        {/* Add Inventory Item Dialog (INVENTORY-01) */}
        <FormDialog<AddInventoryItemFormData>
          open={addDialog.isOpen}
          onOpenChange={(open) => !open && addDialog.close()}
          title="Add Inventory Item"
          description="Add a new product to the inventory."
          size="md"
          schema={addInventorySchema}
          fields={addInventoryFields}
          mode="create"
          onSubmit={handleAddSubmit}
          onSuccess={() => {
            addDialog.close();
            refreshData();
          }}
        />

        {/* Delete Confirmation Dialog (INVENTORY-04) */}
        <DeleteDialog<InventorySearchItem>
          open={!!deleteTarget}
          onOpenChange={(open) => !open && setDeleteTarget(null)}
          onConfirm={handleDelete}
          entityName="Inventory Item"
          entity={deleteTarget}
          isDeleting={deleteMutation.isPending}
          deleteMessage={(item: InventorySearchItem) =>
            `Are you sure you want to delete the inventory record for "${item.productName}"? This action cannot be undone.`
          }
        />
      </div>
    </div>
  );
};

export default InventoryList;
