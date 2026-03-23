/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useMemo, useState } from "react";
import { Building2, ShoppingBasket, UserRound } from "lucide-react";
import type { MenuProduct, ProductSize } from "@/types/menu.type";
import type { ProductListItem } from "@/types/product.type";
import type { CreateCartByStaffRequest } from "@/types/cart";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useFranchiseSelect } from "@/hooks/franchise";
import {
  useCreateCartByStaffBulkMutation,
} from "@/hooks/cart/useCart.hook";
import {
  useGetMenuByFranchise,
  useGetProductsByFranchiseAndCategory,
} from "@/hooks/product/useMenu.hook";
import type {
  CartLookupUser,
  PosCategoryTab,
  PosDraftCartItem,
  PosDraftCartOption,
} from "../types";
import { formatCartMoney } from "../utils/cartDisplay";
import { PosCategoryTabs } from "./PosCategoryTabs";
import { PosDraftCart } from "./PosDraftCart";
import { PosProductGrid } from "./PosProductGrid";
import { PosToppingPicker } from "./PosToppingPicker";
import { useAuthStore } from "@/stores/auth-store";

interface AddCartDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedUser: CartLookupUser | null;
  onCreated?: (cartId: string) => void;
}

const isToppingCategory = (categoryName: string) =>
  categoryName.trim().toLowerCase() === "topping";

const createDraftId = () =>
  `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

const getSizeLabel = (size?: string | null) => {
  const normalizedSize = size?.trim();

  if (!normalizedSize) {
    return "Default";
  }

  switch (normalizedSize.toUpperCase()) {
    case "DEFAULT":
      return "Default";
    case "SMALL":
      return "Small";
    case "MEDIUM":
      return "Medium";
    case "LARGE":
      return "Large";
    default:
      return normalizedSize;
  }
};

const getPreferredToppingSize = (
  sizes: ProductListItem["sizes"],
) => sizes.find((size) => size.isAvailable) ?? sizes[0];

export const AddCartDialog = ({
  open,
  onOpenChange,
  selectedUser,
  onCreated,
}: AddCartDialogProps) => {
  const { authUser, getCurrentRole } = useAuthStore();
  const { data: franchiseSelectItems = [] } = useFranchiseSelect();
  const createCartMutation = useCreateCartByStaffBulkMutation();

  const [selectedFranchiseId, setSelectedFranchiseId] = useState("");
  const [activeCategoryId, setActiveCategoryId] = useState("");
  const [draftItems, setDraftItems] = useState<PosDraftCartItem[]>([]);
  const [selectedDraftItemId, setSelectedDraftItemId] = useState<string | null>(
    null,
  );

  const franchiseOptions = useMemo(
    () =>
      franchiseSelectItems.map((item) => ({
        label: item.name,
        value: item.value,
      })),
    [franchiseSelectItems],
  );

  const currentRole = getCurrentRole();
  const currentRoleCode =
    currentRole?.code ||
    (currentRole as unknown as { role?: string })?.role ||
    "";
  const isStaffContext = currentRoleCode === "STAFF";
  const scopedFranchiseId = authUser?.currentFranchiseId
    ? String(authUser.currentFranchiseId)
    : "";
  const scopedFranchiseName = useMemo(() => {
    if (!scopedFranchiseId) {
      return "";
    }

    return (
      franchiseOptions.find((option) => option.value === scopedFranchiseId)
        ?.label ||
      authUser?.franchiseRoles?.find(
        (franchiseRole) => franchiseRole.franchiseId === scopedFranchiseId,
      )?.franchiseName ||
      "Scoped Franchise"
    );
  }, [authUser?.franchiseRoles, franchiseOptions, scopedFranchiseId]);

  const { data: menuData = [], isLoading: isMenuLoading } =
    useGetMenuByFranchise(selectedFranchiseId);

  const toppingCategoryId = useMemo(
    () =>
      String(
        menuData.find((category) => isToppingCategory(category.categoryName))
          ?.categoryId ?? "",
      ),
    [menuData],
  );

  const { data: toppingProducts = [], isLoading: isToppingLoading } =
    useGetProductsByFranchiseAndCategory(
      selectedFranchiseId,
      toppingCategoryId,
    );

  const categoryTabs = useMemo<PosCategoryTab[]>(() => {
    return menuData.reduce<PosCategoryTab[]>((tabs, category) => {
      if (isToppingCategory(category.categoryName)) {
        return tabs;
      }

      const count =
        category.products.filter((product) =>
          product.sizes.some((size) => size.isAvailable),
        ).length ?? 0;

      if (count > 0) {
        tabs.push({
          id: String(category.categoryId),
          name: category.categoryName,
          count,
        });
      }

      return tabs;
    }, []);
  }, [menuData]);

  const activeProducts = useMemo(() => {
    if (!activeCategoryId) return [];

    const matchedCategory = menuData.find(
      (menuCategory) => String(menuCategory.categoryId) === activeCategoryId,
    );

    return (matchedCategory?.products ?? []).filter((product) =>
      product.sizes.some((size) => size.isAvailable),
    );
  }, [activeCategoryId, menuData]);

  const selectedDraftItem = useMemo(
    () => draftItems.find((item) => item.id === selectedDraftItemId) ?? null,
    [draftItems, selectedDraftItemId],
  );

  const draftSubtotal = useMemo(
    () =>
      draftItems.reduce((total, item) => {
        const optionTotal = item.options.reduce(
          (optionSum, option) => optionSum + option.price * option.quantity,
          0,
        );

        return total + (item.price + optionTotal) * item.quantity;
      }, 0),
    [draftItems],
  );

  useEffect(() => {
    if (!open) return;

    setSelectedFranchiseId(isStaffContext ? scopedFranchiseId : "");
    setActiveCategoryId("");
    setDraftItems([]);
    setSelectedDraftItemId(null);
  }, [isStaffContext, open, scopedFranchiseId, selectedUser?.id]);

  useEffect(() => {
    if (!open || !isStaffContext || !scopedFranchiseId) return;

    setSelectedFranchiseId((current) =>
      current === scopedFranchiseId ? current : scopedFranchiseId,
    );
  }, [isStaffContext, open, scopedFranchiseId]);

  useEffect(() => {
    if (!selectedFranchiseId) {
      setActiveCategoryId("");
      return;
    }

    if (!categoryTabs.length) {
      setActiveCategoryId("");
      return;
    }

    if (!categoryTabs.some((category) => category.id === activeCategoryId)) {
      setActiveCategoryId(categoryTabs[0].id);
    }
  }, [activeCategoryId, categoryTabs, selectedFranchiseId]);

  const handleFranchiseChange = (nextFranchiseId: string) => {
    if (isStaffContext) {
      return;
    }

    if (nextFranchiseId === selectedFranchiseId) {
      return;
    }

    if (draftItems.length > 0) {
      toast.info("Changing franchise cleared the draft cart.");
    }

    setSelectedFranchiseId(nextFranchiseId);
    setActiveCategoryId("");
    setDraftItems([]);
    setSelectedDraftItemId(null);
  };

  const handleAddProduct = (product: MenuProduct, size: ProductSize) => {
    const nextItem: PosDraftCartItem = {
      id: createDraftId(),
      productId: String(product.productId),
      productFranchiseId: String(size.productFranchiseId),
      productName: product.name,
      sizeLabel: getSizeLabel(size.size),
      price: size.price,
      quantity: 1,
      note: "",
      imageUrl: product.imageUrl || undefined,
      isHaveTopping: Boolean(product.isHaveTopping),
      options: [],
    };

    setDraftItems((current) => [...current, nextItem]);
    setSelectedDraftItemId(nextItem.id);
  };

  const handleIncrementItem = (itemId: string) => {
    setDraftItems((current) =>
      current.map((item) =>
        item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item,
      ),
    );
  };

  const handleDecrementItem = (itemId: string) => {
    setDraftItems((current) =>
      current.map((item) =>
        item.id === itemId
          ? { ...item, quantity: Math.max(1, item.quantity - 1) }
          : item,
      ),
    );
  };

  const handleRemoveItem = (itemId: string) => {
    const nextItems = draftItems.filter((item) => item.id !== itemId);
    setDraftItems(nextItems);

    if (selectedDraftItemId === itemId) {
      setSelectedDraftItemId(nextItems[0]?.id ?? null);
    }
  };

  const handleNoteChange = (itemId: string, note: string) => {
    setDraftItems((current) =>
      current.map((item) => (item.id === itemId ? { ...item, note } : item)),
    );
  };

  const handleIncrementTopping = (itemId: string, topping: ProductListItem) => {
    const preferredSize = getPreferredToppingSize(topping.sizes);
    if (!preferredSize) {
      return;
    }

    setDraftItems((current) =>
      current.map((item) => {
        if (item.id !== itemId) return item;
        if (!item.isHaveTopping) return item;

        const existingOptionIndex = item.options.findIndex(
          (option) => option.productId === String(topping.productId),
        );

        if (existingOptionIndex === -1) {
          const nextOption: PosDraftCartOption = {
            id: createDraftId(),
            productId: String(topping.productId),
            productFranchiseId: String(preferredSize.productFranchiseId),
            productName: topping.name,
            sizeLabel: getSizeLabel(preferredSize.size),
            price: preferredSize.price,
            quantity: 1,
            imageUrl: topping.imageUrl || undefined,
          };

          return {
            ...item,
            options: [...item.options, nextOption],
          };
        }

        const nextOptions = [...item.options];
        nextOptions[existingOptionIndex] = {
          ...nextOptions[existingOptionIndex],
          quantity: nextOptions[existingOptionIndex].quantity + 1,
        };

        return {
          ...item,
          options: nextOptions,
        };
      }),
    );
  };

  const handleDecrementTopping = (itemId: string, toppingProductId: string) => {
    setDraftItems((current) =>
      current.map((item) => {
        if (item.id !== itemId) return item;

        const nextOptions = item.options
          .map((option) =>
            option.productId === toppingProductId
              ? { ...option, quantity: option.quantity - 1 }
              : option,
          )
          .filter((option) => option.quantity > 0);

        return {
          ...item,
          options: nextOptions,
        };
      }),
    );
  };

  const handleSubmit = async () => {
    if (!selectedUser?.id) {
      toast.error("Select a user before creating a cart.");
      return;
    }

    if (!selectedFranchiseId) {
      toast.error("Select a franchise before adding products.");
      return;
    }

    if (!draftItems.length) {
      toast.error("Add at least one product to the draft cart.");
      return;
    }

    const payload: CreateCartByStaffRequest = {
      customerId: selectedUser.id,
      franchiseId: selectedFranchiseId,
      items: draftItems.map((item) => ({
        productFranchiseId: item.productFranchiseId,
        quantity: item.quantity,
        note: item.note.trim() || undefined,
        options:
          item.options.length > 0
            ? item.options.map((option) => ({
                productFranchiseId: option.productFranchiseId,
                quantity: option.quantity,
              }))
            : undefined,
      })),
    };

    try {
      const response = await createCartMutation.mutateAsync(payload);
      onCreated?.(response.id);
      onOpenChange(false);
    } catch {
      // Error toast is handled in the mutation hook.
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[calc(100vw-2rem)] overflow-hidden p-0 sm:max-w-[1400px]">
        <div className="flex max-h-[90vh] flex-col">
          <DialogHeader className="border-b border-[#E8DFD6] px-6 py-5">
            <DialogTitle className="text-[#3E2723]">Add Cart</DialogTitle>
            <DialogDescription className="text-[#8D6E63]">
              {selectedUser
                ? `Build a draft cart for ${selectedUser.name}, then submit everything in one request.`
                : "Select a user first before creating a cart."}
            </DialogDescription>
          </DialogHeader>

          <div className="border-b border-[#E8DFD6] bg-[#FFFDFC] px-6 py-4">
            <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                <div className="rounded-2xl border border-[#E8DFD6] bg-white px-4 py-3">
                  <p className="flex items-center gap-2 text-xs uppercase tracking-wide text-[#8D6E63]">
                    <UserRound className="h-4 w-4" />
                    Customer
                  </p>
                  <p className="mt-2 font-semibold text-[#3E2723]">
                    {selectedUser?.name ?? "No customer selected"}
                  </p>
                  <p className="text-sm text-[#8D6E63]">
                    {selectedUser?.email ?? ""}
                  </p>
                </div>

                <div className="rounded-2xl border border-[#E8DFD6] bg-white px-4 py-3">
                  <p className="text-xs uppercase tracking-wide text-[#8D6E63]">
                    Phone
                  </p>
                  <p className="mt-2 font-semibold text-[#3E2723]">
                    {selectedUser?.phone || "N/A"}
                  </p>
                </div>

                <div className="rounded-2xl border border-[#E8DFD6] bg-white px-4 py-3">
                  <p className="flex items-center gap-2 text-xs uppercase tracking-wide text-[#8D6E63]">
                    <ShoppingBasket className="h-4 w-4" />
                    Draft subtotal
                  </p>
                  <p className="mt-2 font-semibold text-[#3E2723]">
                    {formatCartMoney(draftSubtotal)}
                  </p>
                  <p className="text-sm text-[#8D6E63]">
                    {draftItems.length} line item(s)
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-[#E8DFD6] bg-white p-4">
                <label className="mb-2 flex items-center gap-2 text-sm font-medium text-[#5D4037]">
                  <Building2 className="h-4 w-4" />
                  Franchise
                </label>
                {isStaffContext ? (
                  <div className="rounded-xl border border-[#E8DFD6] bg-[#FAF8F5] px-3 py-2.5">
                    <p className="text-sm font-medium text-[#3E2723]">
                      {scopedFranchiseName || "Scoped Franchise"}
                    </p>
                  </div>
                ) : (
                  <Select
                    value={selectedFranchiseId || undefined}
                    onValueChange={handleFranchiseChange}
                  >
                    <SelectTrigger className="border-[#E8DFD6] focus:border-[#6D4C41]">
                      <SelectValue placeholder="Select franchise" />
                    </SelectTrigger>
                    <SelectContent>
                      {franchiseOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                <p className="mt-2 text-xs text-[#8D6E63]">
                  {isStaffContext
                    ? "Franchise is locked to your current staff context."
                    : "Switching franchise clears the current draft cart."}
                </p>
              </div>
            </div>
          </div>

          <div className="grid min-h-0 flex-1 lg:grid-cols-[minmax(0,1.6fr)_420px]">
            <div className="flex min-h-0 flex-col border-b border-[#E8DFD6] lg:border-b-0 lg:border-r">
              <div className="border-b border-[#E8DFD6] px-6 py-4">
                {selectedFranchiseId ? (
                  <PosCategoryTabs
                    categories={categoryTabs}
                    activeCategoryId={activeCategoryId}
                    onChange={setActiveCategoryId}
                  />
                ) : (
                  <div className="rounded-2xl border border-dashed border-[#D7CCC8] bg-[#FAF8F5] px-4 py-6 text-sm text-[#8D6E63]">
                    Select a franchise first to load categories and products.
                  </div>
                )}
              </div>

              <div className="min-h-0 overflow-y-auto px-6 py-5">
                <PosProductGrid
                  products={activeProducts}
                  isLoading={Boolean(selectedFranchiseId) && isMenuLoading}
                  onAddProduct={handleAddProduct}
                />
              </div>
            </div>

            <div className="flex min-h-0 flex-col bg-[#FFFDFC]">
              <div className="min-h-0 flex-1 overflow-y-auto">
                <div className="border-b border-[#E8DFD6] px-5 py-5">
                  <PosToppingPicker
                    selectedItem={selectedDraftItem}
                    toppings={toppingProducts}
                    isLoading={Boolean(selectedFranchiseId) && isToppingLoading}
                    onNoteChange={handleNoteChange}
                    onIncrementTopping={handleIncrementTopping}
                    onDecrementTopping={handleDecrementTopping}
                  />
                </div>

                <div className="px-5 py-5">
                  <PosDraftCart
                    items={draftItems}
                    selectedItemId={selectedDraftItemId}
                    onSelectItem={setSelectedDraftItemId}
                    onIncrementItem={handleIncrementItem}
                    onDecrementItem={handleDecrementItem}
                    onRemoveItem={handleRemoveItem}
                  />
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="border-t border-[#E8DFD6] px-6 py-4">
            <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-[#3E2723]">
                  Ready to submit
                </p>
                <p className="text-sm text-[#8D6E63]">
                  {draftItems.length} line item(s) -{" "}
                  {formatCartMoney(draftSubtotal)}
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={createCartMutation.isPending}
                  className="border-[#E8DFD6] text-[#6D4C41]"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleSubmit}
                  disabled={
                    createCartMutation.isPending ||
                    !selectedUser?.id ||
                    !selectedFranchiseId ||
                    draftItems.length === 0
                  }
                  className="bg-[#6D4C41] text-white hover:bg-[#5D4037]"
                >
                  {createCartMutation.isPending ? "Creating..." : "Create Cart"}
                </Button>
              </div>
            </div>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};
