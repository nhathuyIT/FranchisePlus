import { useCallback, useMemo, useState } from "react";
import { Link } from "react-router";
import { Package, Plus, Search } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHeader } from "@/components/common/PageHeader";
import {
  DeleteDialog,
  FormDialog,
  useFormDialog,
} from "@/components/form-dialog";
import type { SubmitResult } from "@/components/form-dialog/types";
import { Permission } from "@/config/permission";
import * as inventoryApi from "@/api/inventory/inventory.api";
import type { InventorySearchItem } from "@/api/inventory/inventory.type";
import { useDeleteInventory, useInventorySearch } from "@/hooks/inventory";
import { useFranchiseSelect } from "@/hooks/franchise";
import { useDebounce } from "@/hooks/common/useDebounce";
import type {
  AddInventoryItemFormData,
  AdjustInventoryFormData,
} from "@/lib/schemas/inventory.schema";
import { ROUTER_URL } from "@/router/route.const";
import { useAuthStore } from "@/stores/auth-store";
import {
  addInventoryFields,
  addInventorySchema,
  adjustInventoryFields,
  adjustInventorySchema,
} from "./inventory-form.config";
import { InventoryImportPreview } from "./components/InventoryImportPreview";
import { InventoryTable } from "./components/InventoryTable";
import { useUpdateInventoryFromExcel } from "./hooks/useUpdateInventoryFromExcel";

const InventoryList = () => {
  const { authUser, getCurrentPermissions } = useAuthStore();
  const userPermissions = getCurrentPermissions();

  const canViewInventory = userPermissions.includes(Permission.VIEW_INVENTORY);
  const canManageInventory = userPermissions.includes(
    Permission.MANAGE_INVENTORY,
  );

  const [selectedFranchiseId, setSelectedFranchiseId] = useState("");
  const [productNameQuery, setProductNameQuery] = useState("");
  const debouncedProductName = useDebounce(
    productNameQuery,
    300,
    productNameQuery,
  );

  const inventoryScopeKey = authUser
    ? `${authUser.user.id}-${authUser.currentRoleId ?? "none"}-${authUser.currentFranchiseId ?? "global"}`
    : "anonymous";

  const { data: franchiseOptions = [] } = useFranchiseSelect();

  const {
    data: inventorySearchResult,
    isLoading,
    isFetching,
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
  const {
    mainTableData,
    baselineTableData,
    previewTableData,
    isImportPreviewMode,
    isImporting,
    importFromExcel,
    acceptImportedRows,
    cancelImportPreview,
    resetMainTableData,
  } = useUpdateInventoryFromExcel(inventoryItems);

  const filteredItems = useMemo(() => {
    if (!debouncedProductName.trim()) return mainTableData;
    const query = debouncedProductName.toLowerCase();

    return mainTableData.filter(
      (item) =>
        item.productName.toLowerCase().includes(query) ||
        item.franchiseName.toLowerCase().includes(query),
    );
  }, [mainTableData, debouncedProductName]);

  const deleteMutation = useDeleteInventory({ suppressToast: true });
  const listError = error instanceof Error ? error : null;

  const adjustDialog = useFormDialog<InventorySearchItem>();
  const addDialog = useFormDialog<InventorySearchItem>();
  const [deleteTarget, setDeleteTarget] = useState<InventorySearchItem | null>(
    null,
  );

  const refreshData = () => {
    void refetch();
  };

  const handleImport = useCallback(
    async (file: File) => {
      const result = await importFromExcel(file);

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
    },
    [importFromExcel],
  );

  const handleAcceptImport = useCallback(
    (selectedRowNumbers: number[]) => {
      const acceptedItems = acceptImportedRows(selectedRowNumbers);

      if (acceptedItems.length === 0) {
        toast.error("Select at least one valid row before accepting changes.");
        return;
      }

      toast.success(
        `Local inventory table overwritten with ${acceptedItems.length} row(s).`,
      );
    },
    [acceptImportedRows],
  );

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

    if (!response) {
      throw new Error("Failed to create inventory item");
    }

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

  const handleSaveBulk = useCallback(
    async (
      changes: Array<{
        item: InventorySearchItem;
        newQuantity: number;
        newAlertThreshold: number;
      }>,
    ) => {
      const items = changes.map(({ item, newQuantity, newAlertThreshold }) => ({
        productFranchiseId: String(item.productFranchiseId),
        change: newQuantity - item.quantity,
        alertThreshold: newAlertThreshold,
        reason: "Inline table edit",
      }));

      await inventoryApi.adjustBulk({ items });

      toast.success(
        `Updated ${changes.length} inventory item(s) successfully`,
      );
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

  return (
    <div className="flex h-full flex-col">
      <div className="mx-auto flex min-h-0 w-full max-w-7xl flex-1 flex-col">
        <PageHeader
          title="Inventory Management"
          description="Track all products across franchises"
          action={
            <div className="flex gap-3">
              {canManageInventory && (
                <Button
                  onClick={addDialog.openCreate}
                  className="cursor-pointer rounded-full bg-[#6D4C41] text-white shadow-md transition-all duration-300 hover:bg-[#3E2723] hover:shadow-lg"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Item
                </Button>
              )}
              <Link
                to={`${ROUTER_URL.ADMIN}/${ROUTER_URL.ADMIN_ROUTER.INVENTORY_LOW_STOCK}`}
              >
                <Button className="cursor-pointer rounded-full bg-[#D97706] text-white shadow-md transition-all duration-300 hover:bg-[#B45309] hover:shadow-lg">
                  <Package className="mr-2 h-4 w-4" />
                  Low Stock Alert
                </Button>
              </Link>
            </div>
          }
        />

        <div className="flex min-h-0 flex-1 flex-col rounded-2xl border border-[#E8DFD6] bg-white p-6 shadow-lg">
          {!isImportPreviewMode && (
            <div className="mb-4 flex shrink-0 flex-wrap items-center gap-3">
              <div className="relative max-w-xs min-w-[200px] flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5D4037]" />
                <Input
                  placeholder="Search by product or franchise..."
                  value={productNameQuery}
                  onChange={(e) => setProductNameQuery(e.target.value)}
                  className="border-[#E8DFD6] pl-10 focus:border-[#6D4C41] focus:ring-[#6D4C41]"
                />
              </div>

              <Select
                value={selectedFranchiseId || "all"}
                onValueChange={(value) =>
                  setSelectedFranchiseId(value === "all" ? "" : value)
                }
              >
                <SelectTrigger className="w-52 border-[#E8DFD6] focus:border-[#6D4C41]">
                  <SelectValue placeholder="All Franchises" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Franchises</SelectItem>
                  {franchiseOptions.map((franchise) => (
                    <SelectItem key={franchise.value} value={franchise.value}>
                      {franchise.name} ({franchise.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {!isFetching && (
                <span className="ml-auto text-xs text-[#8D6E63]">
                  {filteredItems.length} item
                  {filteredItems.length !== 1 ? "s" : ""}
                </span>
              )}
            </div>
          )}

          {isImportPreviewMode ? (
            <InventoryImportPreview
              rows={previewTableData}
              onAccept={handleAcceptImport}
              onCancel={cancelImportPreview}
            />
          ) : (
            <div className="flex-1 flex flex-col min-h-0">
              <InventoryTable
                items={canViewInventory ? filteredItems : []}
                baselineItems={canViewInventory ? baselineTableData : []}
                isLoading={isLoading || isFetching || deleteMutation.isPending}
                isImporting={isImporting}
                error={listError}
                onRetry={refetch}
                onImport={canManageInventory ? handleImport : undefined}
                onDiscardChanges={resetMainTableData}
                onEdit={canManageInventory ? handleEdit : undefined}
                onDelete={canManageInventory ? handleOpenDelete : undefined}
                canEdit={canManageInventory}
                onSaveBulk={canManageInventory ? handleSaveBulk : undefined}
              />
            </div>
          )}
        </div>

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
