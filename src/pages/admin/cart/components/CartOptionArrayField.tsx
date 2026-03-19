import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Minus, Plus } from "lucide-react";
import { PopoverSearchSelect } from "@/components/form-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/common/useDebounce";
import * as productFranchiseApi from "@/api/product-franchise/product-franchise.api";
import type { CartItemOptionRequest } from "@/types/cart";

interface CartOptionArrayFieldProps {
  value: CartItemOptionRequest[];
  onChange: (value: CartItemOptionRequest[]) => void;
  franchiseId?: string;
  disabled?: boolean;
}

interface CartOptionEditorRowProps {
  option: CartItemOptionRequest;
  franchiseId: string;
  disabled: boolean;
  onChange: (next: CartItemOptionRequest) => void;
  onRemove: () => void;
}

const searchProductFranchiseOptions = async (
  franchiseId: string,
  keyword: string,
) => {
  const result = await productFranchiseApi.searchProductFranchises({
    searchCondition: {
      keyword,
      franchise_id: franchiseId,
      product_id: "",
      min_price: "",
      max_price: "",
      is_active: true,
      is_deleted: false,
    },
    pageInfo: {
      pageNum: 1,
      pageSize: 20,
    },
  });

  return result.map((item) => ({
    value: String(item.id),
    label: `${item.productName ?? "Unknown Product"}${item.size ? ` (${item.size})` : ""}`,
    searchText: `${item.productName ?? ""} ${item.productSku ?? ""} ${item.size ?? ""}`,
  }));
};

const CartOptionEditorRow = ({
  option,
  franchiseId,
  disabled,
  onChange,
  onRemove,
}: CartOptionEditorRowProps) => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const debouncedSearch = useDebounce(searchValue.trim(), 300, searchValue);

  const productQuery = useQuery({
    queryKey: [
      "cart-option-product-franchise",
      franchiseId,
      debouncedSearch || "",
    ],
    queryFn: () =>
      searchProductFranchiseOptions(franchiseId, debouncedSearch || ""),
    enabled: !!franchiseId && searchOpen,
    staleTime: 30 * 1000,
  });

  const mergedOptions = useMemo(() => {
    const options = productQuery.data ?? [];

    if (
      option.productFranchiseId &&
      !options.some((item) => item.value === option.productFranchiseId)
    ) {
      return [
        {
          value: option.productFranchiseId,
          label: option.productFranchiseId,
          searchText: option.productFranchiseId,
        },
        ...options,
      ];
    }

    return options;
  }, [option.productFranchiseId, productQuery.data]);

  return (
    <div className="rounded-xl border border-[#E8DFD6] bg-white p-3">
      <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_120px_auto]">
        <PopoverSearchSelect
          value={option.productFranchiseId}
          onValueChange={(value) =>
            onChange({
              ...option,
              productFranchiseId: value,
            })
          }
          options={mergedOptions}
          open={searchOpen}
          onOpenChange={setSearchOpen}
          searchValue={searchValue}
          onSearchValueChange={setSearchValue}
          placeholder="Select option product"
          searchPlaceholder="Search option product..."
          emptyText="No product found"
          loadingText="Searching products..."
          isLoading={productQuery.isLoading || productQuery.isFetching}
          disabled={disabled}
          minChars={0}
          resetSearchOnClose
          triggerClassName="border-[#E8DFD6] bg-white"
        />

        <Input
          type="number"
          min={1}
          value={option.quantity}
          disabled={disabled}
          onChange={(e) =>
            onChange({
              ...option,
              quantity: Number(e.target.value) || 1,
            })
          }
          className="border-[#E8DFD6]"
        />

        <Button
          type="button"
          variant="outline"
          onClick={onRemove}
          disabled={disabled}
          className="gap-2 border-[#E8DFD6] text-[#6D4C41] hover:bg-[#FAF8F5]"
        >
          <Minus className="h-4 w-4" />
          Remove
        </Button>
      </div>
    </div>
  );
};

export const CartOptionArrayField = ({
  value,
  onChange,
  franchiseId,
  disabled = false,
}: CartOptionArrayFieldProps) => {
  const options = value ?? [];
  const canEdit = !disabled && !!franchiseId;

  const handleAdd = () => {
    onChange([
      ...options,
      {
        productFranchiseId: "",
        quantity: 1,
      },
    ]);
  };

  const handleUpdate = (index: number, next: CartItemOptionRequest) => {
    const nextOptions = [...options];
    nextOptions[index] = next;
    onChange(nextOptions);
  };

  const handleRemove = (index: number) => {
    onChange(options.filter((_, optionIndex) => optionIndex !== index));
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-[#5D4037]">
          Add optional topping or option products for this cart item.
        </p>
        <Button
          type="button"
          variant="outline"
          onClick={handleAdd}
          disabled={!canEdit}
          className="gap-2 border-[#E8DFD6] text-[#6D4C41] hover:bg-[#FAF8F5]"
        >
          <Plus className="h-4 w-4" />
          Add Option
        </Button>
      </div>

      {!franchiseId ? (
        <div className="rounded-xl border border-dashed border-[#D7CCC8] bg-[#FAF8F5] px-4 py-3 text-sm text-[#8D6E63]">
          Select a franchise first to load option products.
        </div>
      ) : options.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[#D7CCC8] bg-[#FAF8F5] px-4 py-3 text-sm text-[#8D6E63]">
          No option items yet. Add one if this cart item needs toppings or
          extras.
        </div>
      ) : (
        <div className="space-y-3">
          {options.map((option, index) => (
            <CartOptionEditorRow
              key={`${option.productFranchiseId || "option"}-${index}`}
              option={option}
              franchiseId={franchiseId}
              disabled={disabled}
              onChange={(next) => handleUpdate(index, next)}
              onRemove={() => handleRemove(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
