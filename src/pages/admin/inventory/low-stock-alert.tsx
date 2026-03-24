import { useMemo } from "react";
import { AlertTriangle, Package } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/PageHeader";
import { InventoryStatsCards } from "./components/InventoryStatsCards";
import { LowStockTable } from "./components/LowStockTable";
import { FormDialog, useFormDialog } from "@/components/form-dialog";
import {
  adjustInventoryFields,
  adjustInventorySchema,
} from "./inventory-form.config";
import type { AdjustInventoryFormData } from "@/lib/schemas/inventory.schema";
import type { SubmitResult } from "@/components/form-dialog/types";
import type { InventorySearchItem } from "@/api/inventory/inventory.type";
import { useInventories } from "@/hooks/inventory";
import { Permission } from "@/config/permission";
import { useAuthStore } from "@/stores/auth-store";
import * as inventoryApi from "@/api/inventory/inventory.api";

const LowStockAlert = () => {
  const { authUser, getCurrentPermissions } = useAuthStore();
  const userPermissions = getCurrentPermissions();

  const canViewInventory = userPermissions.includes(Permission.VIEW_INVENTORY);
  const canManageInventory = userPermissions.includes(
    Permission.MANAGE_INVENTORY,
  );

  const inventoryScopeKey = authUser
    ? `${authUser.user.id}-${authUser.currentRoleId ?? "none"}-${authUser.currentFranchiseId ?? "global"}`
    : "anonymous";

  const {
    data: allItems = [],
    isLoading,
    error,
    refetch,
  } = useInventories(canViewInventory, inventoryScopeKey);

  const listError = error instanceof Error ? error : null;

  // Client-side filter for low stock items (quantity <= alertThreshold)
  const lowStockItems = useMemo(
    () => allItems.filter((item) => item.quantity <= item.alertThreshold),
    [allItems],
  );

  const criticalItems = useMemo(
    () =>
      lowStockItems.filter(
        (item) => (item.quantity / item.alertThreshold) * 100 <= 50,
      ),
    [lowStockItems],
  );

  // Form dialog state
  const adjustDialog = useFormDialog<InventorySearchItem>();

  const refreshData = () => {
    void refetch();
  };

  const handleUpdateStock = (item: InventorySearchItem) => {
    if (!canManageInventory) {
      toast.error("You do not have permission to update inventory.");
      return;
    }
    adjustDialog.openEdit(item);
  };

  // INVENTORY-06: Adjust quantity via POST /api/inventories/adjust
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

    toast.success("Stock adjusted successfully");
  };

  // Bulk Export Handler
  const handleBulkExport = async (selectedItems: InventorySearchItem[]) => {
    try {
      const headers = [
        "Product",
        "Franchise",
        "Current",
        "Threshold",
        "Shortage",
        "Status",
      ];
      const rows = selectedItems.map((item) => {
        const shortage = item.alertThreshold - item.quantity;
        const status =
          (item.quantity / item.alertThreshold) * 100 <= 50
            ? "Critical"
            : "Warning";
        return [
          item.productName,
          item.franchiseName,
          String(item.quantity),
          String(item.alertThreshold),
          `-${shortage}`,
          status,
        ];
      });

      const csvContent = [
        headers.join(","),
        ...rows.map((row) => row.join(",")),
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `low-stock-alert-${new Date().toISOString().split("T")[0]}.csv`;
      link.click();
      window.URL.revokeObjectURL(url);

      toast.success(`Successfully exported ${selectedItems.length} item(s)`);
    } catch {
      toast.error("Failed to export low stock items. Please try again.");
    }
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
      <div className="flex-1 flex flex-col min-h-0 max-w-screen-2xl mx-auto w-full">
        <PageHeader
          title="Low Stock Alert"
          description="Items that need immediate attention"
          icon={AlertTriangle}
          iconSize="h-8 w-8"
        />

        <div className="mb-6 shrink-0">
          <InventoryStatsCards
            totalLowStock={lowStockItems.length}
            criticalItems={criticalItems.length}
            warningItems={lowStockItems.length - criticalItems.length}
          />
        </div>

        <div className="flex-1 min-h-0 flex flex-col bg-white rounded-2xl shadow-lg border border-[#E8DFD6] p-6">
          {lowStockItems.length > 0 ? (
            <LowStockTable
              items={lowStockItems}
              isLoading={isLoading}
              error={listError}
              onRetry={refetch}
              onUpdateStock={canManageInventory ? handleUpdateStock : undefined}
              onBulkExport={handleBulkExport}
            />
          ) : (
            <div className="text-center py-8">
              <Package className="h-16 w-16 text-[#E8DFD6] mx-auto mb-4" />
              <p className="text-[#5D4037] text-lg font-medium">
                No low stock items found
              </p>
              <p className="text-[#5D4037]/70 text-sm">
                All inventory levels are healthy
              </p>
            </div>
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
      </div>
    </div>
  );
};

export default LowStockAlert;
