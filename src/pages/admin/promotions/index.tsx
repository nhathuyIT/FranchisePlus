import { Plus } from "lucide-react";
import { useMemo, useState } from "react";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/common/PageHeader";
import { FormDialog, useFormDialog } from "@/components/form-dialog";
import type { FieldConfig } from "@/lib/form/field-config";
import type { SelectOption } from "@/lib/form/field-config";
import type { Promotion } from "@/types/promotion";
import type {
  CreatePromotionRequest,
  PromotionSearchRequest,
  UpdatePromotionRequest,
} from "@/api/promotion/promotion.api";
import { getProductsByFranchise } from "@/api/product-franchise/product-franchise.api";
import { useFranchiseSelect } from "@/hooks/franchise";
import {
  useCreatePromotionMutation,
  useDeletePromotionMutation,
  usePromotionsQuery,
  useRestorePromotionMutation,
  useUpdatePromotionMutation,
} from "@/hooks/promotion/usePromotionQuery";
import { PromotionTable } from "./components/PromotionTable";

const promotionSchema = z
  .object({
    name: z.string().min(1, "Promotion name is required"),
    franchiseId: z.string().min(1, "Franchise ID is required"),
    productFranchiseId: z.string().optional(),
    type: z.enum(["PERCENT", "FIXED"]),
    value: z
      .number()
      .min(0, "Promotion value must be greater than or equal to 0"),
    startTime: z.string().min(1, "Start time is required"),
    endTime: z.string().min(1, "End time is required"),
    isActive: z.boolean(),
  })
  .refine(
    (data) =>
      new Date(data.endTime).getTime() > new Date(data.startTime).getTime(),
    {
      path: ["endTime"],
      message: "End time must be later than start time",
    },
  );

type PromotionFormData = z.infer<typeof promotionSchema>;

const DEFAULT_SEARCH_PARAMS: PromotionSearchRequest = {
  searchCondition: {
    keyword: "",
    is_active: "",
    is_deleted: false,
  },
  pageInfo: {
    pageNum: 1,
    pageSize: 10,
  },
};

const toDateTimeLocal = (value: string): string => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  const adjusted = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return adjusted.toISOString().slice(0, 16);
};

const toApiDateTime = (value: string): string => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toISOString();
};

const PromotionsPage = () => {
  const dialog = useFormDialog<Promotion>();
  const { data: franchiseSelectItems = [] } = useFranchiseSelect();

  const franchiseOptions = useMemo<SelectOption[]>(
    () =>
      franchiseSelectItems.map((item) => ({
        label: item.name,
        value: item.value,
      })),
    [franchiseSelectItems],
  );

  const promotionFields = useMemo<FieldConfig<PromotionFormData>[]>(
    () => [
      {
        name: "name",
        type: "text",
        label: "Promotion Name",
        placeholder: "e.g., Giảm giá tháng 6",
        required: true,
      },
      {
        name: "franchiseId",
        type: "select",
        label: "Franchise",
        placeholder: "Select franchise",
        required: true,
        options: franchiseOptions,
      },
      {
        name: "productFranchiseId",
        type: "async-select",
        label: "Product",
        placeholder: "Optional - select product in franchise",
        description:
          "Leave empty to apply promotion for all products in this franchise.",
        disabled: (form) => !String(form.watch("franchiseId") || "").trim(),
        asyncOptions: {
          minChars: 0,
          debounceMs: 250,
          loader: async (searchTerm, form) => {
            const franchiseId = String(
              form.getValues("franchiseId") || "",
            ).trim();

            if (!franchiseId) {
              return [];
            }

            const products = await getProductsByFranchise(franchiseId, true);
            const keyword = searchTerm.trim().toLowerCase();

            const filtered = keyword
              ? products.filter((item) => {
                  const displayName = item.productName || "";
                  const sku = item.productSku || "";
                  const size = item.size || "";
                  return `${displayName} ${sku} ${size}`
                    .toLowerCase()
                    .includes(keyword);
                })
              : products;

            return filtered.map((item) => ({
              label: `${item.productName || "Product"}${item.size ? ` (${item.size})` : ""}`,
              value: String(item.id),
            }));
          },
        },
      },
      {
        name: "type",
        type: "select",
        label: "Promotion Type",
        required: true,
        options: [
          { label: "Percent", value: "PERCENT" },
          { label: "Fixed Amount", value: "FIXED" },
        ],
      },
      {
        name: "value",
        type: "number",
        label: "Promotion Value",
        placeholder: "e.g., 10 or 5000",
        required: true,
        min: 0,
        step: 0.01,
      },
      {
        name: "startTime",
        type: "datetime",
        label: "Start Time",
        required: true,
      },
      {
        name: "endTime",
        type: "datetime",
        label: "End Time",
        required: true,
      },
      {
        name: "isActive",
        type: "switch",
        label: "Active",
        defaultValue: true,
      },
    ],
    [franchiseOptions],
  );

  const [pageInfo, setPageInfo] = useState(DEFAULT_SEARCH_PARAMS.pageInfo);

  const searchParams = useMemo<PromotionSearchRequest>(
    () => ({
      ...DEFAULT_SEARCH_PARAMS,
      pageInfo,
    }),
    [pageInfo],
  );

  const {
    data: promotionsResponse,
    isLoading,
    error,
    refetch,
  } = usePromotionsQuery(searchParams);

  const createMutation = useCreatePromotionMutation();
  const updateMutation = useUpdatePromotionMutation();
  const deleteMutation = useDeletePromotionMutation();
  const restoreMutation = useRestorePromotionMutation();

  const promotions = promotionsResponse?.data ?? [];
  const responsePageInfo = promotionsResponse?.pageInfo;

  const handlePageChange = (nextPageNum: number) => {
    setPageInfo((prev) => ({ ...prev, pageNum: nextPageNum }));
  };

  const handlePageSizeChange = (nextPageSize: number) => {
    setPageInfo({ pageNum: 1, pageSize: nextPageSize });
  };

  const handleSubmit = async (data: PromotionFormData) => {
    const payload: CreatePromotionRequest | UpdatePromotionRequest = {
      name: data.name,
      franchise_id: data.franchiseId,
      product_franchise_id: data.productFranchiseId?.trim()
        ? data.productFranchiseId.trim()
        : null,
      type: data.type,
      value: Number(data.value),
      start_date: toApiDateTime(data.startTime),
      end_date: toApiDateTime(data.endTime),
      is_active: data.isActive,
    };

    if (dialog.mode === "edit" && dialog.data) {
      await updateMutation.mutateAsync({ id: dialog.data.id, data: payload });
      return;
    }

    await createMutation.mutateAsync(payload as CreatePromotionRequest);
  };

  const handleView = (promotion: Promotion) => {
    dialog.openView(promotion);
  };

  const handleEdit = (promotion: Promotion) => {
    dialog.openEdit(promotion);
  };

  const handleDelete = (promotion: Promotion) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete promotion #${String(promotion.id)}?`,
    );

    if (confirmDelete) {
      deleteMutation.mutate(promotion.id);
    }
  };

  const handleRestore = (promotion: Promotion) => {
    const confirmRestore = window.confirm(
      `Restore promotion #${String(promotion.id)}?`,
    );

    if (confirmRestore) {
      restoreMutation.mutate(promotion.id);
    }
  };

  const handleRetry = () => {
    void refetch();
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 flex flex-col min-h-0 max-w-7xl mx-auto w-full">
        <PageHeader
          title="Promotion Management"
          description="Create and manage discount campaigns"
          action={
            <Button
              onClick={dialog.openCreate}
              className="bg-[#6D4C41] hover:bg-[#5D4037] text-white rounded-full shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Promotion
            </Button>
          }
        />

        <div className="flex-1 min-h-0 flex flex-col bg-white rounded-2xl shadow-lg border border-[#E8DFD6] p-6">
          <PromotionTable
            promotions={promotions}
            pagination={{
              pageNum: responsePageInfo?.pageNum ?? pageInfo.pageNum,
              pageSize: responsePageInfo?.pageSize ?? pageInfo.pageSize,
              totalItems: responsePageInfo?.totalItems ?? promotions.length,
              totalPages: responsePageInfo?.totalPages ?? 1,
              onPageChange: handlePageChange,
              onPageSizeChange: handlePageSizeChange,
            }}
            isLoading={isLoading}
            error={error as Error | null}
            onRetry={handleRetry}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onRestore={handleRestore}
          />
        </div>
      </div>

      <FormDialog<PromotionFormData>
        open={dialog.isOpen}
        onOpenChange={(open) => !open && dialog.close()}
        title={
          dialog.mode === "create" ? "Create New Promotion" : "Edit Promotion"
        }
        description={
          dialog.mode === "create"
            ? "Create a new promotion with timeframe and discount settings."
            : "Update promotion details below."
        }
        schema={promotionSchema}
        fields={promotionFields}
        values={
          dialog.data
            ? {
                name: dialog.data.name,
                franchiseId: String(dialog.data.franchiseId),
                productFranchiseId: dialog.data.productFranchiseId
                  ? String(dialog.data.productFranchiseId)
                  : "",
                type: dialog.data.type,
                value: dialog.data.value,
                startTime: toDateTimeLocal(dialog.data.startTime),
                endTime: toDateTimeLocal(dialog.data.endTime),
                isActive: dialog.data.isActive,
              }
            : undefined
        }
        mode={dialog.mode}
        onSubmit={handleSubmit}
        onSuccess={dialog.close}
        size="lg"
      />
    </div>
  );
};

export default PromotionsPage;
