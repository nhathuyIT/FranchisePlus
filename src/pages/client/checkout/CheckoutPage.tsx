import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import secureLockIcon from "@/assets/icons/secure-lock.svg";
import coffeeCupIcon from "@/assets/icons/coffee-cup.svg";
import { PRODUCTS_CLIENT } from "@/const/product-client.const";
import { useCheckoutCartMutation } from "@/hooks/cart/useCart.hook";
import { useCart } from "@/pages/client/cart/useCart";
import { ROUTER_URL } from "@/router/route.const";
import { useAuthStore } from "@/stores/auth-store";
import { useLoadingStore } from "@/stores/loading.store";
import type { CartResponse } from "@/types/cart";

type CheckoutPageLocationState = {
  selectedCartItemIds?: string[];
  showCheckoutLoading?: boolean;
};

type CheckoutFormValues = {
  phone: string;
  address: string;
  note: string;
};

type CheckoutFormErrors = Partial<Record<keyof CheckoutFormValues, string>>;

type CheckoutDisplayItem = {
  cartItemId: string;
  productFranchiseId: string;
  productName: string;
  productImageUrl?: string;
  productCartPrice: number;
  quantity: number;
  originalLineTotal: number;
  finalLineTotal: number;
  promotionDiscount: number;
  voucherDiscount: number;
};

type CheckoutCartGroup = {
  cartId: string;
  franchiseName: string;
  itemCount: number;
  subtotal: number;
  promotionDiscount: number;
  voucherDiscount: number;
  finalAmount: number;
  items: CheckoutDisplayItem[];
};

const toCurrencyAmount = (value?: number | string | null) => Number(value || 0);

const formatCurrency = (value: number) =>
  `${Math.max(0, Math.round(value)).toLocaleString("vi-VN")} VND`;

const getCartItemsSubtotal = (cart: Pick<CartResponse, "cartItems">) =>
  (cart.cartItems ?? []).reduce(
    (sum, item) =>
      sum + toCurrencyAmount(item.lineTotal || item.finalLineTotal),
    0,
  );

const getCartSelectionDiscounts = (
  selectedCart: CartResponse,
  originalCart: CartResponse,
) => {
  const selectedSubtotal = getCartItemsSubtotal(selectedCart);
  const originalSubtotal =
    toCurrencyAmount(originalCart.subtotalAmount) ||
    getCartItemsSubtotal(originalCart);

  if (selectedCart.cartItems.length === originalCart.cartItems.length) {
    return {
      selectedSubtotal,
      promotionDiscount: toCurrencyAmount(originalCart.promotionDiscount),
      voucherDiscount: toCurrencyAmount(originalCart.voucherDiscount),
    };
  }

  const selectionRatio =
    originalSubtotal > 0 ? Math.min(selectedSubtotal / originalSubtotal, 1) : 0;

  return {
    selectedSubtotal,
    promotionDiscount:
      toCurrencyAmount(originalCart.promotionDiscount) * selectionRatio,
    voucherDiscount:
      toCurrencyAmount(originalCart.voucherDiscount) * selectionRatio,
  };
};

const CheckoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { carts } = useCart();
  const checkoutCartMutation = useCheckoutCartMutation();
  const { authUser } = useAuthStore();
  const setLoading = useLoadingStore((state) => state.setLoading);
  const locationState = location.state as CheckoutPageLocationState | null;

  useEffect(() => {
    if (!locationState?.showCheckoutLoading) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setLoading(false);
    }, 800);

    return () => {
      setLoading(false);
      window.clearTimeout(timeoutId);
    };
  }, [locationState?.showCheckoutLoading, setLoading]);

  const selectedCartItemIds = useMemo(() => {
    const state = locationState;

    if (!Array.isArray(state?.selectedCartItemIds)) {
      return [];
    }

    return state.selectedCartItemIds.filter(
      (cartItemId): cartItemId is string =>
        typeof cartItemId === "string" && cartItemId.length > 0,
    );
  }, [locationState]);

  const selectedCartItemIdSet = useMemo(
    () => new Set(selectedCartItemIds),
    [selectedCartItemIds],
  );

  const checkoutCarts = useMemo(() => {
    if (selectedCartItemIdSet.size === 0) {
      return carts;
    }

    return carts
      .map((singleCart) => ({
        ...singleCart,
        cartItems: singleCart.cartItems.filter((item) =>
          selectedCartItemIdSet.has(item.cartItemId),
        ),
      }))
      .filter((singleCart) => singleCart.cartItems.length > 0);
  }, [carts, selectedCartItemIdSet]);

  const checkoutCartGroups = useMemo<CheckoutCartGroup[]>(
    () =>
      checkoutCarts.flatMap((singleCart) => {
        const originalCart = carts.find(
          (cartItem) => cartItem.id === singleCart.id,
        );
        if (!originalCart) return [];

        const { selectedSubtotal, promotionDiscount, voucherDiscount } =
          getCartSelectionDiscounts(singleCart, originalCart);
        const isFullCartSelection =
          singleCart.cartItems.length === originalCart.cartItems.length;
        const subtotal = isFullCartSelection
          ? toCurrencyAmount(originalCart.subtotalAmount)
          : selectedSubtotal;

        const items = singleCart.cartItems.map((item): CheckoutDisplayItem => {
          const originalLineTotal = toCurrencyAmount(
            item.lineTotal || item.finalLineTotal,
          );
          const finalLineTotal = toCurrencyAmount(
            item.finalLineTotal || item.lineTotal,
          );
          const itemShare =
            selectedSubtotal > 0 ? originalLineTotal / selectedSubtotal : 0;
          const rawPromotionDiscount = promotionDiscount * itemShare;
          const rawVoucherDiscount = voucherDiscount * itemShare;
          const maxDiscount = Math.max(
            toCurrencyAmount(item.discountAmount),
            originalLineTotal - finalLineTotal,
            0,
          );
          const allocatedDiscount = rawPromotionDiscount + rawVoucherDiscount;
          const allocationRatio =
            allocatedDiscount > maxDiscount && allocatedDiscount > 0
              ? maxDiscount / allocatedDiscount
              : 1;

          return {
            cartItemId: item.cartItemId,
            productFranchiseId: item.productFranchiseId,
            productName: item.productName || item.productFranchiseId,
            productImageUrl: item.productImageUrl || undefined,
            productCartPrice: toCurrencyAmount(item.productCartPrice),
            quantity: Math.max(1, toCurrencyAmount(item.quantity || 1)),
            originalLineTotal,
            finalLineTotal,
            promotionDiscount: rawPromotionDiscount * allocationRatio,
            voucherDiscount: rawVoucherDiscount * allocationRatio,
          };
        });

        const finalAmount = isFullCartSelection
          ? toCurrencyAmount(originalCart.finalAmount)
          : items.reduce((sum, item) => sum + item.finalLineTotal, 0);

        return [
          {
            cartId: singleCart.id,
            franchiseName: originalCart.franchiseName || "Store cart",
            itemCount: singleCart.cartItems.reduce(
              (sum, item) => sum + toCurrencyAmount(item.quantity || 0),
              0,
            ),
            subtotal,
            promotionDiscount,
            voucherDiscount,
            finalAmount,
            items,
          },
        ];
      }),
    [carts, checkoutCarts],
  );

  const checkoutItemCount = useMemo(
    () =>
      checkoutCartGroups.reduce(
        (sum, cartGroup) => sum + cartGroup.itemCount,
        0,
      ),
    [checkoutCartGroups],
  );

  const checkoutSubtotal = useMemo(
    () =>
      checkoutCartGroups.reduce((sum, cartGroup) => sum + cartGroup.subtotal, 0),
    [checkoutCartGroups],
  );

  const checkoutTotalAmount = useMemo(
    () =>
      checkoutCartGroups.reduce(
        (sum, cartGroup) => sum + cartGroup.finalAmount,
        0,
      ),
    [checkoutCartGroups],
  );

  const checkoutPromotionAmount = useMemo(
    () =>
      checkoutCartGroups.reduce(
        (sum, cartGroup) => sum + cartGroup.promotionDiscount,
        0,
      ),
    [checkoutCartGroups],
  );

  const checkoutVoucherAmount = useMemo(
    () =>
      checkoutCartGroups.reduce(
        (sum, cartGroup) => sum + cartGroup.voucherDiscount,
        0,
      ),
    [checkoutCartGroups],
  );

  const checkoutDiscountAmount = useMemo(
    () => Math.max(checkoutSubtotal - checkoutTotalAmount, 0),
    [checkoutSubtotal, checkoutTotalAmount],
  );

  const [formValues, setFormValues] = useState<CheckoutFormValues>({
    phone: authUser?.user?.phone || "",
    address: "",
    note: "",
  });
  const [errors, setErrors] = useState<CheckoutFormErrors>({});

  const validatePhone = (phone: string): string => {
    if (!phone.trim()) {
      return "Please enter your phone number.";
    }

    const phoneRegex = /^0(3|5|7|8|9)[0-9]{8}$/;
    if (!phoneRegex.test(phone.trim())) {
      return "Phone number must be 10 digits and start with 03, 05, 07, 08, or 09.";
    }

    return "";
  };

  const validateAddress = (address: string): string => {
    if (!address.trim()) {
      return "Please enter your delivery address.";
    }

    if (address.trim().length < 10) {
      return "Please provide a more detailed delivery address.";
    }

    return "";
  };

  const validateNote = (note: string): string => {
    if (note.trim().length > 200) {
      return "Note cannot exceed 200 characters.";
    }

    return "";
  };

  const getProductImage = (productId: number): string => {
    const product = PRODUCTS_CLIENT.find((item) => item.id === productId);
    return product?.imageUrl || "";
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;

    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name as keyof CheckoutFormValues]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleBlur = (
    event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    let error = "";

    if (name === "phone") error = validatePhone(value);
    if (name === "address") error = validateAddress(value);
    if (name === "note") error = validateNote(value);

    if (error) {
      setErrors((prev) => ({
        ...prev,
        [name]: error,
      }));
    }
  };

  const handleConfirmOrder = async () => {
    const nextErrors: CheckoutFormErrors = {};

    nextErrors.phone = validatePhone(formValues.phone);
    nextErrors.address = validateAddress(formValues.address);
    nextErrors.note = validateNote(formValues.note);

    const filteredErrors = Object.fromEntries(
      Object.entries(nextErrors).filter(([, value]) => Boolean(value)),
    ) as CheckoutFormErrors;

    if (Object.keys(filteredErrors).length > 0) {
      setErrors(filteredErrors);
      const firstErrorField = Object.keys(filteredErrors)[0];
      const element = document.getElementsByName(firstErrorField)[0];
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
        (element as HTMLElement).focus();
      }
      return;
    }

    const checkoutPayload = {
      address: formValues.address.trim(),
      phone: formValues.phone.trim(),
      message: formValues.note.trim(),
    };

    const targetCartIds = Array.from(
      new Set(checkoutCarts.map((singleCart) => singleCart.id).filter(Boolean)),
    );

    try {
      setLoading(true);

      for (const cartId of targetCartIds) {
        await checkoutCartMutation.mutateAsync({
          cartId,
          data: checkoutPayload,
        });
      }

      navigate(`${ROUTER_URL.CLIENT}/${ROUTER_URL.CLIENT_ROUTER.PAYMENT}`, {
        replace: true,
        state: {
          cartId: targetCartIds[0],
          amount: checkoutTotalAmount,
          itemCount: checkoutItemCount,
          shippingInfo: {
            address: formValues.address.trim(),
            phone: formValues.phone.trim(),
            note: formValues.note.trim(),
          },
        },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-[#5B4037]">Checkout</h1>
          <p className="text-gray-600">
            Please enter your phone number, address, and note before confirming
            your order.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-bold text-[#5B4037]">
                Delivery information
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Phone number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formValues.phone}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={`w-full rounded-lg border px-4 py-2 outline-none transition-all focus:border-transparent focus:ring-2 ${
                      errors.phone
                        ? "border-red-500 focus:ring-red-200"
                        : "border-gray-300 focus:ring-[#B8860B]"
                    }`}
                    placeholder="0123456789"
                  />
                  {errors.phone ? (
                    <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                  ) : null}
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formValues.address}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={`w-full rounded-lg border px-4 py-2 outline-none transition-all focus:border-transparent focus:ring-2 ${
                      errors.address
                        ? "border-red-500 focus:ring-red-200"
                        : "border-gray-300 focus:ring-[#B8860B]"
                    }`}
                    placeholder="House number, street, ward, district, city"
                  />
                  {errors.address ? (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.address}
                    </p>
                  ) : null}
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Note
                    <span className="ml-2 text-xs text-gray-500">
                      ({formValues.note.length}/200)
                    </span>
                  </label>
                  <textarea
                    name="note"
                    value={formValues.note}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    rows={4}
                    maxLength={200}
                    className={`w-full resize-none rounded-lg border px-4 py-2 outline-none transition-all focus:border-transparent focus:ring-2 ${
                      errors.note
                        ? "border-red-500 focus:ring-red-200"
                        : "border-gray-300 focus:ring-[#B8860B]"
                    }`}
                    placeholder="Add a note for your order"
                  />
                  {errors.note ? (
                    <p className="mt-1 text-sm text-red-600">{errors.note}</p>
                  ) : null}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-8 rounded-lg bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-bold text-[#5B4037]">
                Your order
              </h2>

              <div className="mb-4 max-h-96 space-y-4 overflow-y-auto">
                {checkoutCartGroups.map((cartGroup, index) => (
                  <div
                    key={cartGroup.cartId}
                    className="rounded-xl border border-gray-200 bg-gray-50 p-4"
                  >
                    <div className="flex items-start justify-between gap-3 border-b border-gray-200 pb-3">
                      <div className="min-w-0">
                        <h3 className="truncate text-sm font-semibold text-[#5B4037]">
                          {cartGroup.franchiseName || `Cart ${index + 1}`}
                        </h3>
                        <p className="mt-1 text-xs text-gray-500">
                          {cartGroup.itemCount} item(s)
                        </p>
                      </div>
                      <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-[#B8860B]">
                        {formatCurrency(cartGroup.finalAmount)}
                      </span>
                    </div>

                    <div className="mt-3 space-y-3">
                      {cartGroup.items.map((item) => (
                        <div
                          key={item.cartItemId}
                          className="flex items-start gap-3 border-b border-gray-100 pb-3 last:border-b-0 last:pb-0"
                        >
                          <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-amber-50">
                            <img
                              src={
                                item.productImageUrl ||
                                getProductImage(Number(item.productFranchiseId))
                              }
                              alt={item.productName}
                              className="h-full w-full object-cover"
                              onError={(event) => {
                                const target = event.target as HTMLImageElement;
                                target.src = coffeeCupIcon;
                                target.style.objectFit = "contain";
                                target.style.padding = "8px";
                              }}
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className="truncate text-sm font-medium text-gray-900">
                              {item.productName}
                            </h4>
                            <p className="mt-1 text-xs text-gray-500">
                              {formatCurrency(item.productCartPrice)} x{" "}
                              {item.quantity}
                            </p>

                            {item.promotionDiscount > 0 ? (
                              <p className="mt-2 text-xs text-[#B8860B]">
                                Promotion: -{formatCurrency(item.promotionDiscount)}
                              </p>
                            ) : null}

                            {item.voucherDiscount > 0 ? (
                              <p className="mt-1 text-xs text-green-600">
                                Voucher: -{formatCurrency(item.voucherDiscount)}
                              </p>
                            ) : null}

                            {item.originalLineTotal > item.finalLineTotal ? (
                              <p className="mt-2 text-xs text-gray-400 line-through">
                                {formatCurrency(item.originalLineTotal)}
                              </p>
                            ) : null}

                            <p className="mt-1 text-sm font-semibold text-[#B8860B]">
                              After discount: {formatCurrency(item.finalLineTotal)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-2 border-t border-gray-200 py-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total items:</span>
                  <span className="font-medium">{checkoutItemCount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium">
                    {formatCurrency(checkoutSubtotal)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Promotion:</span>
                  <span className="font-medium text-[#B8860B]">
                    -{formatCurrency(checkoutPromotionAmount)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Voucher:</span>
                  <span className="font-medium text-green-600">
                    -{formatCurrency(checkoutVoucherAmount)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total discount:</span>
                  <span className="font-medium text-[#B8860B]">
                    -{formatCurrency(checkoutDiscountAmount)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping fee:</span>
                  <span className="font-medium text-green-600">Free</span>
                </div>
                <div className="flex justify-between border-t border-gray-200 pt-2 text-lg font-bold">
                  <span className="text-gray-900">Total after discount:</span>
                  <div className="text-right">
                    {checkoutDiscountAmount > 0 ? (
                      <p className="text-xs font-medium text-gray-400 line-through">
                        {formatCurrency(checkoutSubtotal)}
                      </p>
                    ) : null}
                    <span className="text-[#B8860B]">
                      {formatCurrency(checkoutTotalAmount)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 border-t border-gray-200 pt-4">
                <button
                  onClick={() => {
                    void handleConfirmOrder();
                  }}
                  disabled={checkoutCartMutation.isPending}
                  className="w-full rounded-lg bg-[#B8860B] px-6 py-3 font-bold text-white transition-colors hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {checkoutCartMutation.isPending
                    ? "Processing..."
                    : "Confirm order"}
                </button>
                <button
                  onClick={() =>
                    navigate(
                      `${ROUTER_URL.ACCOUNT}/${ROUTER_URL.ACCOUNT_ROUTER.MY_ORDER}`,
                    )
                  }
                  className="w-full rounded-lg bg-gray-100 px-6 py-3 font-semibold text-gray-700 transition-colors hover:bg-gray-200"
                >
                  My Order
                </button>
              </div>

              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
                <img src={secureLockIcon} alt="Secure" className="h-4 w-4" />
                <span>Your information is securely protected.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
