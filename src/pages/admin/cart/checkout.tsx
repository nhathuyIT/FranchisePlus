import { useCallback, useEffect, useMemo, useState } from "react";
import { AlertCircle, ArrowLeft, Loader2, PackageSearch } from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { PageHeader } from "@/components/common/PageHeader";
import { DeleteDialog } from "@/components/form-dialog/DeleteDialog";
import { Button } from "@/components/ui/button";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import {
  useCartDetailQuery,
  useCheckoutCartMutation,
  useDeleteCartItemMutation,
} from "@/hooks/cart/useCart.hook";
import { ROUTER_URL } from "@/router/route.const";
import { useAuthStore } from "@/stores/auth-store";
import type { CartItemResponse, CheckoutCartRequest } from "@/types/cart";
import type {
  AdminCartNavigationState,
  CartLookupUser,
  CustomerStatusFilter,
} from "./types";
import { AdminCartCheckoutForm } from "./components/AdminCartCheckoutForm";
import { AdminCartCheckoutSummary } from "./components/AdminCartCheckoutSummary";
import { AdminCheckoutItemCard } from "./components/AdminCheckoutItemCard";

const resolveCustomerStatus = (status?: string): CustomerStatusFilter => {
  switch (status) {
    case "CHECKED_OUT":
      return "CHECKED_OUT";
    case "CANCELED":
      return "CANCELED";
    case "ACTIVE":
    default:
      return "ACTIVE";
  }
};

const CheckoutCartPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartId = "" } = useParams<{ cartId: string }>();
  const { authUser } = useAuthStore();

  const navigationState =
    (location.state as AdminCartNavigationState | null) ?? null;

  const cartDetailQuery = useCartDetailQuery(cartId, !!cartId);
  const checkoutCartMutation = useCheckoutCartMutation();
  const deleteCartItemMutation = useDeleteCartItemMutation();

  const [formValues, setFormValues] = useState<CheckoutCartRequest>({
    address: "",
    phone: "",
    message: "",
  });
  const [errors, setErrors] = useState<
    Partial<Record<"address" | "phone", string>>
  >({});
  const [hasInitializedForm, setHasInitializedForm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<CartItemResponse | null>(
    null,
  );
  const [deletingItemId, setDeletingItemId] = useState<string | null>(null);

  const cart = cartDetailQuery.data ?? null;
  const currentUserPhone = authUser?.user?.phone ?? "";

  useEffect(() => {
    setFormValues({
      address: "",
      phone: "",
      message: "",
    });
    setErrors({});
    setHasInitializedForm(false);
    setItemToDelete(null);
    setDeletingItemId(null);
  }, [cartId]);

  useEffect(() => {
    if (!cart || hasInitializedForm) return;

    setFormValues({
      address: cart.address?.trim() || "",
      phone: cart.phone?.trim() || currentUserPhone || "",
      message: cart.message || "",
    });
    setHasInitializedForm(true);
  }, [cart, currentUserPhone, hasInitializedForm]);

  const buildSelectedUser = useCallback((): CartLookupUser | null => {
    if (navigationState?.selectedUser) {
      return navigationState.selectedUser;
    }

    if (!cart) return null;

    return {
      id: cart.customerId,
      name: cart.customerName,
      email: "",
      phone: cart.phone || null,
    };
  }, [cart, navigationState?.selectedUser]);

  const buildNavigationState = useCallback(
    (customerStatus: CustomerStatusFilter): AdminCartNavigationState => ({
      selectedUser: buildSelectedUser(),
      selectedCartId: cart?.id ?? cartId ?? null,
      customerStatus,
    }),
    [buildSelectedUser, cart?.id, cartId],
  );

  const handleBackToList = useCallback(
    (customerStatus?: CustomerStatusFilter) => {
      navigate(`/admin/${ROUTER_URL.ADMIN_ROUTER.CART}`, {
        state: buildNavigationState(
          customerStatus ??
            navigationState?.customerStatus ??
            resolveCustomerStatus(cart?.status),
        ),
      });
    },
    [
      buildNavigationState,
      cart?.status,
      navigate,
      navigationState?.customerStatus,
    ],
  );

  const handleFieldChange = (field: keyof CheckoutCartRequest, value: string) => {
    setFormValues((current) => ({
      ...current,
      [field]: value,
    }));

    if (field === "address" || field === "phone") {
      setErrors((current) => ({
        ...current,
        [field]: undefined,
      }));
    }
  };

  const validationErrors = useMemo(() => {
    const nextErrors: Partial<Record<"address" | "phone", string>> = {};

    if (!formValues.phone?.trim()) {
      nextErrors.phone = "Phone number is required to checkout this cart.";
    }

    if (!formValues.address?.trim()) {
      nextErrors.address = "Delivery address is required to checkout this cart.";
    }

    return nextErrors;
  }, [formValues.address, formValues.phone]);

  const disableReason = useMemo(() => {
    if (!cart) return "Cart detail is not available.";
    if (cart.status !== "ACTIVE") {
      return `Only ACTIVE carts can be checked out. Current status: ${cart.status}.`;
    }
    if (cart.cartItems.length === 0) {
      return "This cart does not contain any items yet.";
    }
    return null;
  }, [cart]);

  const canCheckout =
    !!cart &&
    cart.status === "ACTIVE" &&
    cart.cartItems.length > 0 &&
    !checkoutCartMutation.isPending;

  const handleCheckout = async () => {
    if (!cart) return;

    if (disableReason) return;

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const response = await checkoutCartMutation.mutateAsync({
        cartId: cart.id,
        data: {
          address: formValues.address.trim(),
          phone: formValues.phone.trim(),
          message: formValues.message?.trim() || undefined,
        },
      });

      handleBackToList(resolveCustomerStatus(response.status));
    } catch {
      // Error toast is handled in the mutation hook.
    }
  };

  const handleConfirmDeleteItem = async () => {
    if (!itemToDelete) return;

    setDeletingItemId(itemToDelete.cartItemId);

    try {
      await deleteCartItemMutation.mutateAsync(itemToDelete.cartItemId);
      setItemToDelete(null);
    } catch {
      // Error toast is handled in the mutation hook.
    } finally {
      setDeletingItemId(null);
    }
  };

  return (
    <div className="flex h-full flex-col scroll-hide">
      <div className="mx-auto flex min-h-0 w-full max-w-7xl flex-1 flex-col">
        <PageHeader
          title="Checkout Cart"
          description="Finalize one existing cart from the admin workflow."
          action={
            <Button
              type="button"
              variant="outline"
              onClick={() => handleBackToList()}
              className="border-[#D9CBBF] text-[#6D4C41] hover:bg-[#FFF8F1]"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Cart List
            </Button>
          }
        />

        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto rounded-2xl border border-[#E8DFD6] bg-white p-6 shadow-lg">
          {!cartId ? (
            <Alert className="border-[#F2D6C9] bg-[#FFF7F2] text-[#7A271A]">
              <AlertCircle className="h-4 w-4 text-[#C2410C]" />
              <AlertTitle>Missing cart id</AlertTitle>
              <AlertDescription>
                Open checkout from a cart row so the page knows which cart to
                load.
              </AlertDescription>
            </Alert>
          ) : cartDetailQuery.isLoading ? (
            <div className="flex min-h-[320px] items-center justify-center rounded-3xl border border-dashed border-[#D7CCC8] bg-[#FAF8F5] text-[#8D6E63]">
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Loading checkout cart...
            </div>
          ) : cartDetailQuery.error instanceof Error ? (
            <div className="rounded-3xl border border-[#F5C6CB] bg-[#FFF5F5] px-5 py-6 text-sm text-[#9B2C2C]">
              <p className="font-semibold">Failed to load cart detail.</p>
              <p className="mt-2">{cartDetailQuery.error.message}</p>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  void cartDetailQuery.refetch();
                }}
                className="mt-4 border-[#E8DFD6] text-[#6D4C41]"
              >
                Try again
              </Button>
            </div>
          ) : !cart ? (
            <div className="flex min-h-[320px] flex-col items-center justify-center rounded-3xl border border-dashed border-[#D7CCC8] bg-[#FAF8F5] px-6 text-center text-[#8D6E63]">
              <PackageSearch className="h-10 w-10 text-[#BCA08A]" />
              <p className="mt-4 text-lg font-semibold text-[#5D4037]">
                Cart detail is unavailable
              </p>
              <p className="mt-2 max-w-lg text-sm">
                This cart could not be found or is no longer accessible from
                the current admin context.
              </p>
            </div>
          ) : (
            <div className="grid min-h-0 gap-6 xl:grid-cols-[minmax(0,1.3fr)_360px]">
              <div className="min-h-0 space-y-6">
                {(cart.status !== "ACTIVE" || cart.cartItems.length === 0) && (
                  <Alert className="border-[#F2D6C9] bg-[#FFF7F2] text-[#7A271A]">
                    <AlertCircle className="h-4 w-4 text-[#C2410C]" />
                    <AlertTitle>Checkout is unavailable</AlertTitle>
                    <AlertDescription>{disableReason}</AlertDescription>
                  </Alert>
                )}

                <AdminCartCheckoutForm
                  cart={cart}
                  values={formValues}
                  errors={errors}
                  onChange={handleFieldChange}
                />

                <section className="rounded-[28px] border border-[#E8DFD6] bg-[#FFFDFC] p-6 shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#9A7B67]">
                        Cart Items
                      </p>
                      <h2 className="mt-2 text-2xl font-semibold text-[#3E2723]">
                        Review before checkout
                      </h2>
                    </div>

                    <div className="rounded-full bg-[#FAF1E8] px-4 py-2 text-sm font-medium text-[#6D4C41]">
                      {cart.cartItems.length} item(s)
                    </div>
                  </div>

                  {cart.cartItems.length > 0 ? (
                    <div className="mt-5 space-y-4">
                      {cart.cartItems.map((item, index) => (
                        <AdminCheckoutItemCard
                          key={item.cartItemId}
                          item={item}
                          index={index + 1}
                          isDeleting={deletingItemId === item.cartItemId}
                          onDelete={() => setItemToDelete(item)}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="mt-5 rounded-3xl border border-dashed border-[#D7CCC8] bg-[#FAF8F5] px-4 py-10 text-center text-sm text-[#8D6E63]">
                      This cart is empty. Add items from the edit flow before
                      checking out.
                    </div>
                  )}
                </section>
              </div>

              <div className="xl:sticky xl:top-0 xl:self-start">
                <AdminCartCheckoutSummary
                  itemCount={cart.cartItems.length}
                  subtotalAmount={cart.subtotalAmount}
                  promotionDiscount={cart.promotionDiscount}
                  voucherDiscount={cart.voucherDiscount}
                  loyaltyDiscount={cart.loyaltyDiscount}
                  finalAmount={cart.finalAmount}
                  canCheckout={canCheckout}
                  disableReason={disableReason}
                  isSubmitting={checkoutCartMutation.isPending}
                  onBack={() => handleBackToList()}
                  onCheckout={() => {
                    void handleCheckout();
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <DeleteDialog<CartItemResponse>
        open={!!itemToDelete}
        onOpenChange={(open) => {
          if (!open) {
            setItemToDelete(null);
          }
        }}
        entity={itemToDelete}
        entityName="cart item"
        onConfirm={() => {
          void handleConfirmDeleteItem();
        }}
        isDeleting={deleteCartItemMutation.isPending}
        deleteMessage={(item) =>
          `Remove "${item.productName || "this product"}" from the cart before checkout?`
        }
        getDisplayName={(item) => item.productName || "Cart item"}
      />
    </div>
  );
};

export default CheckoutCartPage;
