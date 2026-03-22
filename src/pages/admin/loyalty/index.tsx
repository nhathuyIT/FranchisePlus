import { Loader2, Plus, Search, X } from "lucide-react";
import { useMemo, useState } from "react";
import * as z from "zod";
import type {
  CreateLoyaltyRuleRequest,
  LoyaltyRuleSearchRequest,
  UpdateLoyaltyRuleRequest,
} from "@/api/loyalty-rule/loyalty-rule.api";
import { PageHeader } from "@/components/common/PageHeader";
import { FormDialog, useFormDialog } from "@/components/form-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import type { FieldConfig, SelectOption } from "@/lib/form/field-config";
import { useFranchiseSelect } from "@/hooks/franchise";
import { cn } from "@/lib/utils";
import {
  useCreateLoyaltyRuleMutation,
  useLoyaltyRulesQuery,
  useUpdateLoyaltyRuleMutation,
} from "@/hooks/loyalty-rule/useLoyaltyRuleQuery";
import type {
  LoyaltyRule,
  LoyaltyTierCode,
  LoyaltyTierRule,
} from "@/types/loyalty-rule";
import { LoyaltyRuleTable } from "./components/LoyaltyRuleTable";

type SearchSelectValue = "all";

interface LoyaltyRuleSearchFormState {
  franchiseId: string | SearchSelectValue;
  tier: LoyaltyTierCode | SearchSelectValue;
  isActive: "true" | "false" | SearchSelectValue;
  isDeleted: "true" | "false";
}

const TIER_CODES: LoyaltyTierCode[] = ["BRONZE", "SILVER", "GOLD", "PLATINUM"];

const DEFAULT_TIER_RULES: LoyaltyTierRule[] = [
  {
    tier: "BRONZE",
    minPoints: 0,
    maxPoints: 299,
    benefit: {
      orderDiscountPercent: 0,
      earnMultiplier: 1,
      freeShipping: false,
    },
  },
  {
    tier: "SILVER",
    minPoints: 300,
    maxPoints: 999,
    benefit: {
      orderDiscountPercent: 3,
      earnMultiplier: 1,
      freeShipping: false,
    },
  },
  {
    tier: "GOLD",
    minPoints: 1000,
    maxPoints: 1999,
    benefit: {
      orderDiscountPercent: 5,
      earnMultiplier: 1.25,
      freeShipping: false,
    },
  },
  {
    tier: "PLATINUM",
    minPoints: 2000,
    benefit: {
      orderDiscountPercent: 10,
      earnMultiplier: 1.5,
      freeShipping: true,
    },
  },
];

const DEFAULT_PAGE_INFO = {
  pageNum: 1,
  pageSize: 10,
};

const DEFAULT_SEARCH_FORM: LoyaltyRuleSearchFormState = {
  franchiseId: "all",
  tier: "all",
  isActive: "all",
  isDeleted: "false",
};

const DEFAULT_TIER_RULE_MAP: Record<LoyaltyTierCode, LoyaltyTierRule> = {
  BRONZE: DEFAULT_TIER_RULES[0],
  SILVER: DEFAULT_TIER_RULES[1],
  GOLD: DEFAULT_TIER_RULES[2],
  PLATINUM: DEFAULT_TIER_RULES[3],
};

const cloneTierRule = (rule: LoyaltyTierRule): LoyaltyTierRule => ({
  tier: rule.tier,
  minPoints: rule.minPoints,
  maxPoints: rule.maxPoints,
  benefit: {
    orderDiscountPercent: rule.benefit.orderDiscountPercent,
    earnMultiplier: rule.benefit.earnMultiplier,
    freeShipping: rule.benefit.freeShipping,
  },
});

const cloneTierRules = (rules: LoyaltyTierRule[]): LoyaltyTierRule[] => {
  return rules.map(cloneTierRule);
};

const sortTierRules = (rules: LoyaltyTierRule[]): LoyaltyTierRule[] => {
  return [...rules].sort(
    (a, b) => TIER_CODES.indexOf(a.tier) - TIER_CODES.indexOf(b.tier),
  );
};

const createTierRuleTemplate = (tier: LoyaltyTierCode): LoyaltyTierRule => {
  return cloneTierRule(DEFAULT_TIER_RULE_MAP[tier]);
};

const parseNumeric = (value: string, fallback = 0): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const tierRuleSchema = z
  .object({
    tier: z.enum(["BRONZE", "SILVER", "GOLD", "PLATINUM"]),
    minPoints: z.number().int().min(0),
    maxPoints: z.number().int().min(0).optional(),
    benefit: z.object({
      orderDiscountPercent: z.number().min(0),
      earnMultiplier: z.number().min(0),
      freeShipping: z.boolean(),
    }),
  })
  .refine(
    (rule) => rule.maxPoints === undefined || rule.maxPoints >= rule.minPoints,
    {
      path: ["maxPoints"],
      message: "Max points must be greater than or equal to min points",
    },
  );

const loyaltyRuleSchema = z
  .object({
    franchiseId: z.string().min(1, "Franchise is required"),
    earnAmountPerPoint: z
      .number()
      .int("Earn amount must be an integer")
      .min(1, "Earn amount must be greater than 0"),
    redeemValuePerPoint: z
      .number()
      .int("Redeem value must be an integer")
      .min(1, "Redeem value must be greater than 0"),
    minRedeemPoints: z
      .number()
      .int("Min redeem points must be an integer")
      .min(0, "Min redeem points must be greater than or equal to 0"),
    maxRedeemPoints: z
      .number()
      .int("Max redeem points must be an integer")
      .min(1, "Max redeem points must be greater than 0"),
    tierRules: z
      .array(tierRuleSchema)
      .min(1, "Please select at least one tier rule"),
    description: z.string().optional(),
    isActive: z.boolean(),
  })
  .refine((data) => data.maxRedeemPoints >= data.minRedeemPoints, {
    path: ["maxRedeemPoints"],
    message:
      "Max redeem points must be greater than or equal to min redeem points",
  });

type LoyaltyRuleFormData = z.infer<typeof loyaltyRuleSchema>;

const LoyaltyRulesPage = () => {
  const dialog = useFormDialog<LoyaltyRule>();
  const { data: franchiseSelectItems = [] } = useFranchiseSelect();

  const [searchForm, setSearchForm] = useState(DEFAULT_SEARCH_FORM);
  const [appliedSearch, setAppliedSearch] = useState(DEFAULT_SEARCH_FORM);
  const [requestKey, setRequestKey] = useState(0);
  const [pageInfo, setPageInfo] = useState(DEFAULT_PAGE_INFO);

  const franchiseOptions = useMemo<SelectOption[]>(
    () =>
      franchiseSelectItems.map((item) => ({
        label: item.name,
        value: item.value,
      })),
    [franchiseSelectItems],
  );

  const loyaltyRuleFields = useMemo<FieldConfig<LoyaltyRuleFormData>[]>(
    () => [
      {
        name: "franchiseId",
        type: "select",
        label: "Franchise",
        placeholder: "Select franchise",
        required: true,
        disabled: dialog.mode === "edit",
        options: franchiseOptions,
      },
      {
        name: "earnAmountPerPoint",
        type: "number",
        label: "Earn Amount / Point",
        required: true,
        min: 1,
        step: 1,
      },
      {
        name: "redeemValuePerPoint",
        type: "number",
        label: "Redeem Value / Point",
        required: true,
        min: 1,
        step: 1,
      },
      {
        name: "minRedeemPoints",
        type: "number",
        label: "Min Redeem Points",
        required: true,
        min: 0,
        step: 1,
      },
      {
        name: "maxRedeemPoints",
        type: "number",
        label: "Max Redeem Points",
        required: true,
        min: 1,
        step: 1,
      },
      {
        name: "tierRules",
        type: "custom",
        label: "Tier Rules",
        required: true,
        description: "Select tier(s), then edit tier detail fields.",
        render: ({ field, disabled }) => {
          const selectedTierRules = Array.isArray(field.value)
            ? (field.value as LoyaltyTierRule[])
            : [];

          const selectedMap = new Map(
            selectedTierRules.map((rule) => [rule.tier, rule] as const),
          );

          const toggleTier = (tier: LoyaltyTierCode) => {
            if (disabled) return;

            const nextRules = selectedMap.has(tier)
              ? selectedTierRules.filter((rule) => rule.tier !== tier)
              : [...selectedTierRules, createTierRuleTemplate(tier)];

            field.onChange(sortTierRules(nextRules));
          };

          const updateTier = (
            tier: LoyaltyTierCode,
            updater: (rule: LoyaltyTierRule) => LoyaltyTierRule,
          ) => {
            if (disabled) return;

            const nextRules = selectedTierRules.map((rule) =>
              rule.tier === tier ? updater(rule) : rule,
            );

            field.onChange(sortTierRules(nextRules));
          };

          return (
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {TIER_CODES.map((tier) => {
                  const isSelected = selectedMap.has(tier);
                  return (
                    <Button
                      key={tier}
                      type="button"
                      variant="outline"
                      disabled={disabled}
                      onClick={() => toggleTier(tier)}
                      className={cn(
                        "font-semibold",
                        isSelected
                          ? "border-[#6D4C41] bg-[#6D4C41] text-white hover:bg-[#5D4037]"
                          : "border-[#D7CCC8] text-[#5D4037] hover:bg-[#F5F0EA]",
                      )}
                    >
                      {tier}
                    </Button>
                  );
                })}
              </div>

              {TIER_CODES.filter((tier) => selectedMap.has(tier)).map(
                (tier) => {
                  const tierRule = selectedMap.get(tier)!;

                  return (
                    <div
                      key={tier}
                      className="border border-[#E8DFD6] rounded-xl p-3 space-y-3 bg-[#FCFBF9]"
                    >
                      <div className="font-semibold text-[#4E342E]">{tier}</div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <Label className="text-xs text-[#6D4C41]">
                            minPoints
                          </Label>
                          <Input
                            type="number"
                            min={0}
                            step={1}
                            disabled={disabled}
                            value={tierRule.minPoints}
                            onChange={(e) =>
                              updateTier(tier, (current) => ({
                                ...current,
                                minPoints: Math.trunc(
                                  parseNumeric(e.target.value),
                                ),
                              }))
                            }
                          />
                        </div>

                        <div>
                          <Label className="text-xs text-[#6D4C41]">
                            maxPoints
                          </Label>
                          <Input
                            type="number"
                            min={0}
                            step={1}
                            disabled={disabled}
                            value={tierRule.maxPoints ?? ""}
                            onChange={(e) =>
                              updateTier(tier, (current) => ({
                                ...current,
                                maxPoints:
                                  e.target.value.trim() === ""
                                    ? undefined
                                    : Math.trunc(parseNumeric(e.target.value)),
                              }))
                            }
                          />
                        </div>

                        <div>
                          <Label className="text-xs text-[#6D4C41]">
                            orderDiscountPercent
                          </Label>
                          <Input
                            type="number"
                            min={0}
                            step={0.1}
                            disabled={disabled}
                            value={tierRule.benefit.orderDiscountPercent}
                            onChange={(e) =>
                              updateTier(tier, (current) => ({
                                ...current,
                                benefit: {
                                  ...current.benefit,
                                  orderDiscountPercent: parseNumeric(
                                    e.target.value,
                                  ),
                                },
                              }))
                            }
                          />
                        </div>

                        <div>
                          <Label className="text-xs text-[#6D4C41]">
                            earnMultiplier
                          </Label>
                          <Input
                            type="number"
                            min={0}
                            step={0.01}
                            disabled={disabled}
                            value={tierRule.benefit.earnMultiplier}
                            onChange={(e) =>
                              updateTier(tier, (current) => ({
                                ...current,
                                benefit: {
                                  ...current.benefit,
                                  earnMultiplier: parseNumeric(e.target.value),
                                },
                              }))
                            }
                          />
                        </div>

                        <div className="md:col-span-2 flex items-center justify-between rounded-lg border border-[#E8DFD6] px-3 py-2 bg-white">
                          <Label className="text-sm text-[#6D4C41]">
                            freeShipping
                          </Label>
                          <Switch
                            disabled={disabled}
                            checked={tierRule.benefit.freeShipping}
                            onCheckedChange={(checked) =>
                              updateTier(tier, (current) => ({
                                ...current,
                                benefit: {
                                  ...current.benefit,
                                  freeShipping: checked,
                                },
                              }))
                            }
                          />
                        </div>
                      </div>
                    </div>
                  );
                },
              )}

              {selectedTierRules.length === 0 && (
                <div className="text-sm text-[#8D6E63] italic">
                  Select at least one tier to configure tier_rules.
                </div>
              )}
            </div>
          );
        },
      },
      {
        name: "description",
        type: "textarea",
        label: "Description",
        rows: 3,
      },
      {
        name: "isActive",
        type: "switch",
        label: "Active",
        defaultValue: true,
      },
    ],
    [franchiseOptions, dialog.mode],
  );

  const searchParams = useMemo<LoyaltyRuleSearchRequest>(() => {
    return {
      searchCondition: {
        franchise_id:
          appliedSearch.franchiseId === "all"
            ? undefined
            : appliedSearch.franchiseId,
        tier: appliedSearch.tier === "all" ? "" : appliedSearch.tier,
        is_active:
          appliedSearch.isActive === "all"
            ? ""
            : appliedSearch.isActive === "true",
        is_deleted: appliedSearch.isDeleted === "true",
      },
      pageInfo,
    };
  }, [appliedSearch, pageInfo]);

  const {
    data: loyaltyRulesResponse,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useLoyaltyRulesQuery(searchParams, requestKey);

  const createMutation = useCreateLoyaltyRuleMutation();
  const updateMutation = useUpdateLoyaltyRuleMutation();

  const loyaltyRules = loyaltyRulesResponse?.data ?? [];
  const responsePageInfo = loyaltyRulesResponse?.pageInfo;

  const isSearchLoading = isLoading || isFetching;
  const isTableLoading =
    isSearchLoading || createMutation.isPending || updateMutation.isPending;

  const handleSearch = () => {
    setPageInfo((prev) => ({ ...prev, pageNum: 1 }));
    setAppliedSearch(searchForm);
    setRequestKey((prev) => prev + 1);
  };

  const handleReset = () => {
    setSearchForm(DEFAULT_SEARCH_FORM);
    setAppliedSearch(DEFAULT_SEARCH_FORM);
    setPageInfo(DEFAULT_PAGE_INFO);
    setRequestKey((prev) => prev + 1);
  };

  const handlePageChange = (nextPageNum: number) => {
    setPageInfo((prev) => ({ ...prev, pageNum: nextPageNum }));
  };

  const handlePageSizeChange = (nextPageSize: number) => {
    setPageInfo({ pageNum: 1, pageSize: nextPageSize });
  };

  const handleSubmit = async (data: LoyaltyRuleFormData) => {
    if (dialog.mode === "edit" && dialog.data) {
      const payload: UpdateLoyaltyRuleRequest = {
        earn_amount_per_point: Number(data.earnAmountPerPoint),
        redeem_value_per_point: Number(data.redeemValuePerPoint),
        min_redeem_points: Math.trunc(data.minRedeemPoints),
        max_redeem_points: Math.trunc(data.maxRedeemPoints),
        tier_rules: sortTierRules(cloneTierRules(data.tierRules)),
        description: data.description?.trim() || "",
        is_active: data.isActive,
      };

      await updateMutation.mutateAsync({
        id: dialog.data.id,
        data: payload,
      });
      return;
    }

    const payload: CreateLoyaltyRuleRequest = {
      franchise_id: data.franchiseId,
      earn_amount_per_point: Number(data.earnAmountPerPoint),
      redeem_value_per_point: Number(data.redeemValuePerPoint),
      min_redeem_points: Math.trunc(data.minRedeemPoints),
      max_redeem_points: Math.trunc(data.maxRedeemPoints),
      tier_rules: sortTierRules(cloneTierRules(data.tierRules)),
      description: data.description?.trim() || "",
      is_active: data.isActive,
    };

    await createMutation.mutateAsync(payload);
  };

  const handleView = (item: LoyaltyRule) => {
    dialog.openView(item);
  };

  const handleEdit = (item: LoyaltyRule) => {
    dialog.openEdit(item);
  };

  const handleRetry = () => {
    void refetch();
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 flex flex-col min-h-0 max-w-7xl mx-auto w-full">
        <PageHeader
          title="Loyalty Rule Management"
          description="Create, search and update loyalty rules for each franchise"
          action={
            <Button
              onClick={dialog.openCreate}
              className="bg-[#6D4C41] hover:bg-[#5D4037] text-white rounded-full shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Loyalty Rule
            </Button>
          }
        />

        <div className="flex-1 min-h-0 flex flex-col bg-white rounded-2xl shadow-lg border border-[#E8DFD6] p-6 gap-4">
          <LoyaltyRuleTable
            loyaltyRules={loyaltyRules}
            toolbarPrefix={
              <div className="flex flex-wrap items-end gap-3 flex-1">
                <div className="space-y-1 min-w-44">
                  <Label htmlFor="search-franchise">Franchise</Label>
                  <Select
                    value={searchForm.franchiseId}
                    onValueChange={(value) =>
                      setSearchForm((prev) => ({ ...prev, franchiseId: value }))
                    }
                  >
                    <SelectTrigger id="search-franchise">
                      <SelectValue placeholder="All franchises" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All franchises</SelectItem>
                      {franchiseOptions.map((option) => (
                        <SelectItem
                          key={String(option.value)}
                          value={String(option.value)}
                        >
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1 min-w-36">
                  <Label htmlFor="search-tier">Tier</Label>
                  <Select
                    value={searchForm.tier}
                    onValueChange={(value) =>
                      setSearchForm((prev) => ({
                        ...prev,
                        tier: value as LoyaltyRuleSearchFormState["tier"],
                      }))
                    }
                  >
                    <SelectTrigger id="search-tier">
                      <SelectValue placeholder="All tiers" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All tiers</SelectItem>
                      <SelectItem value="BRONZE">BRONZE</SelectItem>
                      <SelectItem value="SILVER">SILVER</SelectItem>
                      <SelectItem value="GOLD">GOLD</SelectItem>
                      <SelectItem value="PLATINUM">PLATINUM</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1 min-w-36">
                  <Label htmlFor="search-active">Is Active</Label>
                  <Select
                    value={searchForm.isActive}
                    onValueChange={(value) =>
                      setSearchForm((prev) => ({
                        ...prev,
                        isActive:
                          value as LoyaltyRuleSearchFormState["isActive"],
                      }))
                    }
                  >
                    <SelectTrigger id="search-active">
                      <SelectValue placeholder="All status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All status</SelectItem>
                      <SelectItem value="true">Active</SelectItem>
                      <SelectItem value="false">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1 min-w-40">
                  <Label htmlFor="search-deleted">Record State</Label>
                  <Select
                    value={searchForm.isDeleted}
                    onValueChange={(value) =>
                      setSearchForm((prev) => ({
                        ...prev,
                        isDeleted:
                          value as LoyaltyRuleSearchFormState["isDeleted"],
                      }))
                    }
                  >
                    <SelectTrigger id="search-deleted">
                      <SelectValue placeholder="Record state" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="false">Active records</SelectItem>
                      <SelectItem value="true">Deleted records</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    onClick={handleSearch}
                    disabled={isSearchLoading}
                    className="bg-[#6D4C41] hover:bg-[#5D4037] text-white"
                  >
                    {isSearchLoading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Search className="mr-2 h-4 w-4" />
                    )}
                    Search
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleReset}
                    disabled={isSearchLoading}
                    className="border-[#6D4C41] text-[#6D4C41]"
                  >
                    <X className="mr-2 h-4 w-4" />
                    Reset
                  </Button>
                </div>
              </div>
            }
            pagination={{
              pageNum: responsePageInfo?.pageNum ?? pageInfo.pageNum,
              pageSize: responsePageInfo?.pageSize ?? pageInfo.pageSize,
              totalItems: responsePageInfo?.totalItems ?? loyaltyRules.length,
              totalPages: responsePageInfo?.totalPages ?? 1,
              onPageChange: handlePageChange,
              onPageSizeChange: handlePageSizeChange,
            }}
            isLoading={isTableLoading}
            error={error as Error | null}
            onRetry={handleRetry}
            onView={handleView}
            onEdit={handleEdit}
          />
        </div>
      </div>

      <FormDialog<LoyaltyRuleFormData>
        open={dialog.isOpen}
        onOpenChange={(open) => !open && dialog.close()}
        title={
          dialog.mode === "create"
            ? "Create Loyalty Rule"
            : "Update Loyalty Rule"
        }
        description={
          dialog.mode === "create"
            ? "Create a new loyalty rule configuration for a franchise."
            : "Update loyalty rule settings."
        }
        schema={loyaltyRuleSchema}
        fields={loyaltyRuleFields}
        values={
          dialog.data
            ? {
                franchiseId: String(dialog.data.franchiseId),
                earnAmountPerPoint: dialog.data.earnAmountPerPoint,
                redeemValuePerPoint: dialog.data.redeemValuePerPoint,
                minRedeemPoints: dialog.data.minRedeemPoints,
                maxRedeemPoints: dialog.data.maxRedeemPoints,
                tierRules: sortTierRules(cloneTierRules(dialog.data.tierRules)),
                description: dialog.data.description,
                isActive: dialog.data.isActive,
              }
            : {
                franchiseId: franchiseOptions[0]?.value
                  ? String(franchiseOptions[0].value)
                  : "",
                earnAmountPerPoint: 0,
                redeemValuePerPoint: 0,
                minRedeemPoints: 0,
                maxRedeemPoints: 0,
                tierRules: sortTierRules(cloneTierRules(DEFAULT_TIER_RULES)),
                description: "Default loyalty rule based on customer points",
                isActive: true,
              }
        }
        mode={dialog.mode}
        onSubmit={handleSubmit}
        onSuccess={dialog.close}
        size="lg"
      />
    </div>
  );
};

export default LoyaltyRulesPage;
