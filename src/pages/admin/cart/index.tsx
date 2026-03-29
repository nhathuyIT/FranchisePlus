import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Plus } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/common/PageHeader";
import { DataTable } from "@/components/common/DataTable";
import { DeleteDialog } from "@/components/form-dialog/DeleteDialog";
import NormalLoadingLayout from "@/layouts/NormalLoadingLayout";
import { Button } from "@/components/ui/button";
import { useFormDialog } from "@/components/form-dialog";
import { useDebounce } from "@/hooks/common/useDebounce";
import {
  useCancelCartMutation,
  useCartsByCustomerQuery,
} from "@/hooks/cart/useCart.hook";
import { useCustomerByKeyword } from "@/hooks/customer";
import { Permission } from "@/config/permission";
import { ROUTER_URL } from "@/router/route.const";
import { useAuthStore } from "@/stores/auth-store";
import type { CartResponse } from "@/types/cart";
import { createCartColumns } from "./columns/CartColumns";
import { AddCartDialog } from "./components/AddCartDialog";
import { CartActionButtons } from "./components/CartActionButtons";
import { CartDetailDialog } from "./components/CartDetailDialog";
import { CartLookupToolbar } from "./components/CartLookupToolbar";
import { CartSelectedUserSummary } from "./components/CartSelectedUserSummary";
import { EditCartDialog } from "./components/EditCartDialog";
import type {
  AdminCartNavigationState,
  CartLookupUser,
  CustomerStatusFilter,
} from "./types";
import { getCartLookupHint, isNoCartError } from "./utils/cartDisplay";

const toUserOptionLabel = (user: CartLookupUser) => (
  <span className="flex min-w-0 items-center gap-2 overflow-hidden whitespace-nowrap">
    <span className="truncate font-medium text-[#3E2723]">{user.name}</span>
    <span className="shrink-0 text-[#C7B8AA]">-</span>
    <span className="truncate text-xs text-[#8D6E63]">
      {user.email}
      {user.phone ? ` - ${user.phone}` : ""}
    </span>
  </span>
);

const CartManagement = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { getCurrentPermissions } = useAuthStore();
  const userPermissions = getCurrentPermissions();
  const canViewCart = userPermissions.includes(Permission.VIEW_CART);
  const canManageCart = userPermissions.includes(Permission.MANAGE_CART);
  const addCartDialog = useFormDialog<void>();
  const cancelCartMutation = useCancelCartMutation();
  const hasAppliedNavigationState = useRef(false);
  const navigationState =
    (location.state as AdminCartNavigationState | null) ?? null;

  const [userSearchOpen, setUserSearchOpen] = useState(false);
  const [userSearchValue, setUserSearchValue] = useState("");
  const [selectedUser, setSelectedUser] = useState<CartLookupUser | null>(null);
  const [customerStatus, setCustomerStatus] =
    useState<CustomerStatusFilter>("ACTIVE");
  const [selectedCartId, setSelectedCartId] = useState<string | null>(null);
  const [shouldRefetchAfterCreate, setShouldRefetchAfterCreate] =
    useState(false);
  const [isRefreshingAfterCreate, setIsRefreshingAfterCreate] = useState(false);
  const [detailCartId, setDetailCartId] = useState<string | null>(null);
  const [editCartId, setEditCartId] = useState<string | null>(null);
  const [cartToCancel, setCartToCancel] = useState<CartResponse | null>(null);
  const normalizedUserSearch = userSearchValue.trim();
  const canSearchUsers = normalizedUserSearch.length >= 3;

  const debouncedUserSearch = useDebounce(
    canSearchUsers ? normalizedUserSearch : "",
    450,
    userSearchValue,
  );

  const userSearchQuery = useCustomerByKeyword(debouncedUserSearch, {
    enabled: canViewCart && userSearchOpen && debouncedUserSearch.length >= 3,
  });

  const customerLookupQuery = useCartsByCustomerQuery(
    {
      customerId: selectedUser?.id ?? "",
      status: customerStatus === "all" ? undefined : customerStatus,
    },
    canViewCart && !!selectedUser?.id,
  );

  const userSearchResults = useMemo(
    () =>
      canSearchUsers && debouncedUserSearch.length >= 3
        ? (userSearchQuery.data ?? [])
        : [],
    [canSearchUsers, debouncedUserSearch, userSearchQuery.data],
  );

  const userOptions = useMemo(
    () =>
      userSearchResults.map((user) => ({
        value: user.id,
        label: toUserOptionLabel(user),
        searchText: `${user.name} ${user.email} ${user.phone ?? ""}`,
      })),
    [userSearchResults],
  );

  const selectedUserOption = useMemo(
    () =>
      selectedUser
        ? {
            value: selectedUser.id,
            label: toUserOptionLabel(selectedUser),
            searchText: `${selectedUser.name} ${selectedUser.email} ${selectedUser.phone ?? ""}`,
          }
        : null,
    [selectedUser],
  );

  const mergedUserOptions = useMemo(() => {
    if (!selectedUserOption) return userOptions;

    return [
      selectedUserOption,
      ...userOptions.filter(
        (option) => option.value !== selectedUserOption.value,
      ),
    ];
  }, [selectedUserOption, userOptions]);

  const handleUserChange = useCallback(
    (userId: string) => {
      if (selectedUser?.id === userId) {
        setUserSearchOpen(false);
        return;
      }

      const matchedUser = userSearchResults.find((user) => user.id === userId);
      if (!matchedUser) return;

      setSelectedUser({
        id: matchedUser.id,
        name: matchedUser.name,
        email: matchedUser.email,
        phone: matchedUser.phone,
      });
      setSelectedCartId(null);
      setShouldRefetchAfterCreate(false);
      setIsRefreshingAfterCreate(false);
      setDetailCartId(null);
      setEditCartId(null);
      setUserSearchOpen(false);
    },
    [selectedUser, userSearchResults],
  );

  const handleClearSelection = useCallback(() => {
    setSelectedUser(null);
    setSelectedCartId(null);
    setShouldRefetchAfterCreate(false);
    setIsRefreshingAfterCreate(false);
    setDetailCartId(null);
    setEditCartId(null);
    setUserSearchValue("");
    setUserSearchOpen(false);
  }, []);

  const handleOpenCartDetail = useCallback((cartId: string) => {
    setSelectedCartId(cartId);
    setDetailCartId(cartId);
  }, []);

  const handleOpenEditCart = useCallback((cartId: string) => {
    setSelectedCartId(cartId);
    setEditCartId(cartId);
  }, []);

  const handleCartCreated = useCallback((cartId: string) => {
    setCustomerStatus("ACTIVE");
    setSelectedCartId(cartId);
    setShouldRefetchAfterCreate(true);
  }, []);

  const handleConfirmCancelCart = useCallback(async () => {
    if (!cartToCancel) return;

    try {
      await cancelCartMutation.mutateAsync(cartToCancel.id);

      if (editCartId === cartToCancel.id) {
        setEditCartId(null);
      }

      setCartToCancel(null);
    } catch {
      // Error toast is handled in the mutation hook.
    }
  }, [cancelCartMutation, cartToCancel, editCartId]);

  const refetchCustomerCarts = customerLookupQuery.refetch;

  useEffect(() => {
    if (hasAppliedNavigationState.current || !navigationState?.selectedUser) {
      return;
    }

    setSelectedUser(navigationState.selectedUser);
    setSelectedCartId(navigationState.selectedCartId ?? null);
    setCustomerStatus(navigationState.customerStatus ?? "ACTIVE");
    setDetailCartId(null);
    setEditCartId(null);
    hasAppliedNavigationState.current = true;
  }, [navigationState]);

  useEffect(() => {
    if (!shouldRefetchAfterCreate || !selectedUser?.id) return;

    let cancelled = false;

    const runRefetch = async () => {
      setIsRefreshingAfterCreate(true);
      try {
        await refetchCustomerCarts();
      } finally {
        if (!cancelled) {
          setIsRefreshingAfterCreate(false);
          setShouldRefetchAfterCreate(false);
        }
      }
    };

    void runRefetch();

    return () => {
      cancelled = true;
    };
  }, [shouldRefetchAfterCreate, selectedUser?.id, refetchCustomerCarts]);

  const customerColumns = useMemo(() => createCartColumns(), []);

  const userCartError =
    customerLookupQuery.error instanceof Error
      ? customerLookupQuery.error
      : null;
  const suppressNoCartError = isNoCartError(userCartError);

  const customerRows = useMemo(
    () => (suppressNoCartError ? [] : (customerLookupQuery.data ?? [])),
    [customerLookupQuery.data, suppressNoCartError],
  );

  const selectedCart = useMemo(() => {
    if (!customerRows.length) return null;
    if (!selectedCartId) return customerRows[0];

    return (
      customerRows.find((cart) => cart.id === selectedCartId) ?? customerRows[0]
    );
  }, [customerRows, selectedCartId]);

  const lookupHint = useMemo(
    () => getCartLookupHint(userSearchValue.trim(), selectedUser?.name),
    [selectedUser?.name, userSearchValue],
  );

  const customerEmptyMessage = !canViewCart
    ? "You do not have permission to view carts."
    : !selectedUser
      ? "Search and select a user to view carts."
      : "This user doesnt have any cart";

  const isCustomerTableLoading =
    !!selectedUser &&
    (customerLookupQuery.isLoading ||
      customerLookupQuery.isFetching ||
      isRefreshingAfterCreate);

  const handleCheckoutCart = useCallback(
    (cartId: string) => {
      setSelectedCartId(cartId);
      navigate(
        `/admin/${ROUTER_URL.ADMIN_ROUTER.CART_CHECKOUT.replace(":cartId", cartId)}`,
        {
          state: {
            selectedUser,
            selectedCartId: cartId,
            customerStatus,
          } satisfies AdminCartNavigationState,
        },
      );
    },
    [customerStatus, navigate, selectedUser],
  );

  return (
    <div className="flex h-full flex-col scroll-hide">
      <NormalLoadingLayout
        forceShow={cancelCartMutation.isPending || isCustomerTableLoading}
      />

      <div className="mx-auto flex min-h-0 w-full max-w-screen-2xl flex-1 flex-col">
        <PageHeader
          title="Cart Management"
          description="Search a user by keyword, then inspect and manage that user's carts."
          action={
            canManageCart ? (
              <Button
                onClick={addCartDialog.openCreate}
                disabled={!selectedUser}
                className="bg-[#6D4C41] text-white hover:bg-[#5D4037]"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Cart
              </Button>
            ) : undefined
          }
        />

        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto rounded-2xl border border-[#E8DFD6] bg-white p-6 shadow-lg">
          <CartLookupToolbar
            selectedUserId={selectedUser?.id}
            userOptions={mergedUserOptions}
            userSearchOpen={userSearchOpen}
            onUserSearchOpenChange={setUserSearchOpen}
            userSearchValue={userSearchValue}
            onUserSearchValueChange={setUserSearchValue}
            onUserChange={handleUserChange}
            isUserSearchLoading={
              canSearchUsers &&
              (userSearchQuery.isLoading || userSearchQuery.isFetching)
            }
            customerStatus={customerStatus}
            onCustomerStatusChange={setCustomerStatus}
            onClear={handleClearSelection}
            isClearDisabled={!selectedUser && !userSearchValue}
          />

          <div className="mb-4 rounded-xl border border-[#E8DFD6] bg-[#FAF8F5] px-4 py-3 text-sm text-[#5D4037]">
            {lookupHint}
          </div>

          {selectedUser && (
            <CartSelectedUserSummary
              selectedUser={selectedUser}
              cartCount={customerRows.length}
            />
          )}

          <div className="min-h-0 flex-1">
            <DataTable
              columns={customerColumns}
              data={canViewCart ? customerRows : []}
              emptyMessage={customerEmptyMessage}
              isLoading={false}
              error={suppressNoCartError ? null : userCartError}
              onRetry={
                selectedUser && !suppressNoCartError
                  ? () => {
                      void customerLookupQuery.refetch();
                    }
                  : undefined
              }
              onRowClick={(cart) => handleOpenCartDetail(cart.id)}
              enableColumnVisibility
              initialPageSize={10}
              renderActions={
                canManageCart
                  ? (cart) => (
                      <div
                        onClick={(event) => {
                          event.stopPropagation();
                        }}
                      >
                        <CartActionButtons
                          compact
                          onEditCart={() => handleOpenEditCart(cart.id)}
                          onCheckoutCart={() => handleCheckoutCart(cart.id)}
                          onCancelCart={() => setCartToCancel(cart)}
                          canEditCart={cart.status?.toUpperCase() === "ACTIVE"}
                          canCheckoutCart={
                            cart.status?.toUpperCase() === "ACTIVE" &&
                            cart.cartItems.length > 0
                          }
                          canCancelCart={
                            cart.status?.toUpperCase() === "ACTIVE"
                          }
                          isCancellingCart={
                            cancelCartMutation.isPending &&
                            cartToCancel?.id === cart.id
                          }
                        />
                      </div>
                    )
                  : undefined
              }
              getRowClassName={(cart) =>
                cart.id === selectedCart?.id
                  ? "bg-[#FFF8F1] hover:bg-[#FFF3E0]"
                  : ""
              }
            />
          </div>
        </div>
      </div>

      <AddCartDialog
        open={addCartDialog.isOpen}
        onOpenChange={(open) => {
          if (!open) {
            addCartDialog.close();
          }
        }}
        selectedUser={selectedUser}
        onCreated={handleCartCreated}
      />

      <CartDetailDialog
        open={!!detailCartId}
        onOpenChange={(open) => {
          if (!open) {
            setDetailCartId(null);
          }
        }}
        cartId={detailCartId}
      />

      <EditCartDialog
        open={!!editCartId}
        onOpenChange={(open) => {
          if (!open) {
            setEditCartId(null);
          }
        }}
        cartId={editCartId}
      />

      <DeleteDialog<CartResponse>
        open={!!cartToCancel}
        onOpenChange={(open) => {
          if (!open) {
            setCartToCancel(null);
          }
        }}
        entity={cartToCancel}
        entityName="cart"
        onConfirm={() => {
          void handleConfirmCancelCart();
        }}
        isDeleting={cancelCartMutation.isPending}
        confirmLabel="Cancel cart"
        pendingLabel="Canceling..."
        deleteMessage={() =>
          `Change cart to CANCELED? This keeps the record, but it will no longer stay in ACTIVE carts.`
        }
        getDisplayName={(cart) => cart.id}
      />
    </div>
  );
};

export default CartManagement;
