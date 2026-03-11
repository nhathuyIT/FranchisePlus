import { useState, useMemo } from "react";
import { Link } from "react-router";
import { Package, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ROUTER_URL } from "@/router/route.const";
import { PageHeader } from "@/components/common/PageHeader";
import { InventoryTable } from "./components/InventoryTable";
import { InventoryImportPreview } from "./components/InventoryImportPreview";
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
import { useInventories, useDeleteInventory } from "@/hooks/inventory";
import { Permission } from "@/config/permission";
import { useAuthStore } from "@/stores/auth-store";
import * as inventoryApi from "@/api/inventory/inventory.api";
import {
  useExcelImport,
  INVENTORY_HEADER_MAPPING,
  InventoryImportSchema,
  type InventoryImportData,
} from "@/lib/excel";

const InventoryList = () => {
  const { authUser, getCurrentPermissions } = useAuthStore();
  const userPermissions = getCurrentPermissions();

  // Permission checks
  const canViewInventory = userPermissions.includes(Permission.VIEW_INVENTORY);
  const canManageInventory = userPermissions.includes(
    Permission.MANAGE_INVENTORY,
  );

  // Cache scope key for query isolation
  const inventoryScopeKey = authUser
    ? `${authUser.user.id}-${authUser.currentRoleId ?? "none"}-${authUser.currentFranchiseId ?? "global"}`
    : "anonymous";

  // Fetch all inventory items
  const {
    data: inventoryItems = [],
    isLoading,
    error,
    refetch,
  } = useInventories(canViewInventory, inventoryScopeKey);

  const deleteMutation = useDeleteInventory({ suppressToast: true });
  const listError = error instanceof Error ? error : null;

  // ── Import Excel state ────────────────────────────────────────────────────

  const {
    parseFile,
    validateRows,
    isParsing,
    preview,
    reset: resetImport,
  } = useExcelImport<InventoryImportData>({
    schema: InventoryImportSchema,
    headerMapping: INVENTORY_HEADER_MAPPING,
  });

  const [isSavingImport, setIsSavingImport] = useState(false);
  const [importRowErrors, setImportRowErrors] = useState<
    Record<number, string[]>
  >({});

  const handleFileUpload = async (file: File) => {
    try {
      const previewResult = await parseFile(file);

      // Validate once after parse — don't put validateRows in useMemo (it has side effects)
      const result = validateRows(previewResult.rows);
      const errMap: Record<number, string[]> = {};
      for (const e of result.errors) {
        errMap[e.row] = [...(errMap[e.row] ?? []), e.message];
      }
      setImportRowErrors(errMap);
    } catch {
      toast.error("Không thể đọc file. Vui lòng kiểm tra định dạng.");
    }
  };

  const handleImportConfirm = async (data: InventoryImportData[]) => {
    setIsSavingImport(true);
    try {
      // Resolve productFranchiseId from existing items by productName + franchiseName
      const results = await Promise.allSettled(
        data.map((item) => {
          const existing = inventoryItems.find(
            (inv) =>
              inv.productName === item.productName &&
              inv.franchiseName === item.franchiseName,
          );
          if (!existing)
            return Promise.reject(
              new Error(
                `Không tìm thấy: ${item.productName} - ${item.franchiseName}`,
              ),
            );
          return inventoryApi.create({
            productFranchiseId: String(existing.productFranchiseId),
            quantity: item.quantity,
            alertThreshold: item.alertThreshold,
          });
        }),
      );

      const failed = results.filter((r) => r.status === "rejected");
      if (failed.length > 0) {
        toast.error(
          `${failed.length} dòng thất bại (sản phẩm không tìm thấy trên hệ thống)`,
        );
      } else {
        toast.success(`Import thành công ${data.length} dòng!`);
      }
      resetImport();
      setImportRowErrors({});
      refreshData();
    } catch {
      toast.error("Import thất bại. Vui lòng thử lại.");
    } finally {
      setIsSavingImport(false);
    }
  };

  // Form dialog states
  const adjustDialog = useFormDialog<InventorySearchItem>();
  const addDialog = useFormDialog<InventorySearchItem>();

  // Delete confirmation state
  const [deleteTarget, setDeleteTarget] = useState<InventorySearchItem | null>(
    null,
  );

  const refreshData = () => {
    void refetch();
  };

  // ── Adjust Submit Handler (INVENTORY-06) ─────────────────────────────────

  const handleAdjustSubmit = async (
    data: AdjustInventoryFormData,
  ): Promise<SubmitResult | void> => {
    if (!adjustDialog.data) return;

    await inventoryApi.adjust({
      productFranchiseId: String(adjustDialog.data.productFranchiseId),
      change: data.change,
      reason: data.reason,
    });

    toast.success("Inventory adjusted successfully");
  };

  // ── Add Submit Handler (INVENTORY-01) ─────────────────────────────────────

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

  // ── Delete Handler (INVENTORY-04) ─────────────────────────────────────────

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

  const adjustDialogTitle = useMemo(() => {
    if (!adjustDialog.data) return "Adjust Stock";
    return `Adjust Stock: ${adjustDialog.data.productName}`;
  }, [adjustDialog.data]);

  const adjustDialogDescription = useMemo(() => {
    if (!adjustDialog.data) return "";
    return `Current quantity: ${adjustDialog.data.quantity} | Threshold: ${adjustDialog.data.alertThreshold}`;
  }, [adjustDialog.data]);

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
          {preview ? (
            /* ── Import Preview mode ─────────────────────────────────── */
            <InventoryImportPreview
              previewRows={preview.rows}
              existingItems={inventoryItems}
              onCancel={() => {
                resetImport();
                setImportRowErrors({});
              }}
              onConfirm={handleImportConfirm}
              isSaving={isSavingImport}
              rowErrors={importRowErrors}
            />
          ) : (
            /* ── Normal table mode ───────────────────────────────────── */
            <InventoryTable
              items={canViewInventory ? inventoryItems : []}
              isLoading={isLoading || deleteMutation.isPending}
              error={listError}
              onRetry={refetch}
              onEdit={canManageInventory ? handleEdit : undefined}
              onDelete={canManageInventory ? handleOpenDelete : undefined}
              onImport={canManageInventory ? handleFileUpload : undefined}
              isParsing={isParsing}
            />
          )}
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
