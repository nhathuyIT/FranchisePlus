import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import emptyCartIcon from "@/assets/icons/empty-cart.svg";
import secureLockIcon from "@/assets/icons/secure-lock.svg";
import coffeeCupIcon from "@/assets/icons/coffee-cup.svg";
import { PRODUCTS_CLIENT } from "@/const/product-client.const";
import { useCheckoutCartMutation } from "@/hooks/cart/useCart.hook";
import { useCart } from "@/pages/client/cart/useCart";
import { ROUTER_URL } from "@/router/route.const";
import { useAuthStore } from "@/stores/auth-store";
import { useLoadingStore } from "@/stores/loading.store";

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

const CheckoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cart, carts } = useCart();
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
    }, 2000);

    return () => {
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

  const checkoutItems = useMemo(() => {
    if (selectedCartItemIdSet.size === 0) {
      return cart.items;
    }

    return cart.items.filter((item) =>
      selectedCartItemIdSet.has(item.cartItemId),
    );
  }, [cart.items, selectedCartItemIdSet]);

  const checkoutItemCount = useMemo(
    () =>
      checkoutCarts.reduce(
        (sum, singleCart) =>
          sum +
          singleCart.cartItems.reduce(
            (cartSum, item) => cartSum + Number(item.quantity || 0),
            0,
          ),
        0,
      ),
    [checkoutCarts],
  );

  const checkoutSubtotal = useMemo(
    () =>
      checkoutCarts.reduce((sum, singleCart) => {
        if (singleCart.cartItems.length === 0) return sum;

        const originalCart = carts.find(
          (cartItem) => cartItem.id === singleCart.id,
        );
        if (!originalCart) return sum;

        if (singleCart.cartItems.length === originalCart.cartItems.length) {
          return sum + Number(originalCart.subtotalAmount || 0);
        }

        return (
          sum +
          singleCart.cartItems.reduce(
            (cartSum, item) =>
              cartSum + Number(item.lineTotal || item.finalLineTotal || 0),
            0,
          )
        );
      }, 0),
    [carts, checkoutCarts],
  );

  const checkoutTotalAmount = useMemo(
    () =>
      checkoutCarts.reduce((sum, singleCart) => {
        if (singleCart.cartItems.length === 0) return sum;

        const originalCart = carts.find(
          (cartItem) => cartItem.id === singleCart.id,
        );
        if (!originalCart) return sum;

        if (singleCart.cartItems.length === originalCart.cartItems.length) {
          return sum + Number(originalCart.finalAmount || 0);
        }

        return (
          sum +
          singleCart.cartItems.reduce(
            (cartSum, item) => cartSum + Number(item.finalLineTotal || 0),
            0,
          )
        );
      }, 0),
    [carts, checkoutCarts],
  );

  const [formValues, setFormValues] = useState<CheckoutFormValues>({
    phone: authUser?.user?.phone || "",
    address: "",
    note: "",
  });
  const [errors, setErrors] = useState<CheckoutFormErrors>({});

  const validatePhone = (phone: string): string => {
    if (!phone.trim()) {
      return "Vui long nhap so dien thoai.";
    }

    const phoneRegex = /^0(3|5|7|8|9)[0-9]{8}$/;
    if (!phoneRegex.test(phone.trim())) {
      return "So dien thoai phai co 10 chu so va bat dau bang 03, 05, 07, 08 hoac 09.";
    }

    return "";
  };

  const validateAddress = (address: string): string => {
    if (!address.trim()) {
      return "Vui long nhap dia chi giao hang.";
    }

    if (address.trim().length < 10) {
      return "Dia chi can du chi tiet de giao hang.";
    }

    return "";
  };

  const validateNote = (note: string): string => {
    if (note.trim().length > 200) {
      return "Ghi chu khong duoc vuot qua 200 ky tu.";
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

    if (checkoutItems.length === 0) {
      navigate(`${ROUTER_URL.CLIENT}/${ROUTER_URL.CLIENT_ROUTER.CART}`);
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

      navigate(
        `${ROUTER_URL.ACCOUNT}/${ROUTER_URL.ACCOUNT_ROUTER.MY_ORDER}`,
        {
          replace: true,
        },
      );
    } finally {
      setLoading(false);
    }
  };

  if (checkoutItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="mx-auto max-w-6xl px-4">
          <div className="py-16 text-center">
            <div className="mb-6 flex justify-center">
              <img src={emptyCartIcon} alt="Empty cart" className="h-32 w-32" />
            </div>
            <h3 className="mb-4 text-2xl font-bold text-[#5B4037]">
              Gio hang trong
            </h3>
            <p className="mb-8 text-gray-600">
              Vui long them san pham vao gio hang truoc khi checkout.
            </p>
            <button
              onClick={() =>
                navigate(`${ROUTER_URL.CLIENT}/${ROUTER_URL.CLIENT_ROUTER.CART}`)
              }
              className="rounded bg-[#B8860B] px-8 py-3 font-semibold text-white transition-colors hover:bg-amber-700"
            >
              Quay lai gio hang
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-[#5B4037]">Checkout</h1>
          <p className="text-gray-600">
            Vui long nhap so dien thoai, dia chi va ghi chu truoc khi xac nhan don hang.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-bold text-[#5B4037]">
                Thong tin giao hang
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    So dien thoai <span className="text-red-500">*</span>
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
                    Dia chi <span className="text-red-500">*</span>
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
                    placeholder="So nha, duong, phuong xa, quan huyen, tinh thanh"
                  />
                  {errors.address ? (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.address}
                    </p>
                  ) : null}
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Ghi chu
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
                    placeholder="Ghi chu cho don hang"
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
                Don hang cua ban
              </h2>

              <div className="mb-4 max-h-64 space-y-3 overflow-y-auto">
                {checkoutItems.map((item) => (
                  <div
                    key={item.cartItemId}
                    className="flex items-start gap-3 border-b border-gray-100 pb-3"
                  >
                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-amber-50">
                      <img
                        src={
                          item.imageUrl ||
                          getProductImage(Number(item.productFranchiseId))
                        }
                        alt={item.productNameSnapshot}
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
                        {item.productNameSnapshot}
                      </h4>
                      <p className="mt-1 text-xs text-gray-500">
                        {item.priceSnapshot.toLocaleString("vi-VN")} VND x{" "}
                        {item.quantity}
                      </p>
                      <p className="mt-1 text-sm font-semibold text-[#B8860B]">
                        {item.lineTotal.toLocaleString("vi-VN")} VND
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-2 border-t border-gray-200 py-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tong san pham:</span>
                  <span className="font-medium">{checkoutItemCount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tam tinh:</span>
                  <span className="font-medium">
                    {checkoutSubtotal.toLocaleString("vi-VN")} VND
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Phi van chuyen:</span>
                  <span className="font-medium text-green-600">Mien phi</span>
                </div>
                <div className="flex justify-between border-t border-gray-200 pt-2 text-lg font-bold">
                  <span className="text-gray-900">Tong cong:</span>
                  <span className="text-[#B8860B]">
                    {checkoutTotalAmount.toLocaleString("vi-VN")} VND
                  </span>
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
                    ? "Dang xu ly..."
                    : "Xac nhan don hang"}
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
                <span>Thong tin cua ban duoc bao mat an toan.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
