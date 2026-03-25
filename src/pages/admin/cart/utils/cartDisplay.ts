import type { CartResponse } from "@/types/cart";

export const formatCartMoney = (value: number) =>
  `${value.toLocaleString("vi-VN")} VND`;

export const formatVoucherValue = (type?: string, value?: number) => {
  if (value === undefined || value === null) {
    return null;
  }

  if (type?.toUpperCase() === "PERCENT") {
    return `${value}%`;
  }

  return formatCartMoney(Number(value));
};

const formatDiscountValue = (
  type?: string,
  value?: number,
  fallbackAmount?: number,
) => {
  if (value !== undefined && value !== null && value > 0) {
    if (type?.toUpperCase() === "PERCENT") {
      return `${value}%`;
    }

    return formatCartMoney(Number(value));
  }

  if ((fallbackAmount ?? 0) > 0) {
    return formatCartMoney(Number(fallbackAmount));
  }

  return null;
};

type CartDiscountSummaryInput = Pick<
  CartResponse,
  | "promotionDiscount"
  | "promotionType"
  | "promotionValue"
  | "voucherDiscount"
  | "voucherType"
  | "voucherValue"
  | "loyaltyDiscount"
>;

export const getCartDiscountLabels = (cart: CartDiscountSummaryInput) => {
  const labels: string[] = [];

  if (cart.promotionDiscount > 0) {
    const promotionValue = formatDiscountValue(
      cart.promotionType,
      cart.promotionValue,
      cart.promotionDiscount,
    );

    if (promotionValue) {
      labels.push(`Sale -${promotionValue}`);
    }
  }

  if (cart.voucherDiscount > 0) {
    const voucherValue = formatDiscountValue(
      cart.voucherType,
      cart.voucherValue,
      cart.voucherDiscount,
    );

    if (voucherValue) {
      labels.push(`Voucher -${voucherValue}`);
    }
  }

  if (cart.loyaltyDiscount > 0) {
    labels.push(`Loyalty -${formatCartMoney(cart.loyaltyDiscount)}`);
  }

  return labels;
};

export const formatCartDateTime = (value?: string) =>
  value ? new Date(value).toLocaleString("vi-VN") : "N/A";

export const getCartLookupHint = (
  searchValue: string,
  selectedUserName?: string,
) => {
  if (selectedUserName) {
    return `Showing carts for ${selectedUserName}. Change the selected user to load a different cart list.`;
  }

  if (!searchValue) {
    return "Open the user search, then type a name, email, or phone number to load matching users.";
  }

  return "Pick one user from the search results to load that user's carts.";
};

export const isNoCartError = (error: Error | null) => {
  if (!error) return false;

  const message = error.message.toLowerCase();
  return (
    message.includes("cart") &&
    (message.includes("no ") ||
      message.includes("not found") ||
      message.includes("doesnt have") ||
      message.includes("doesn't have") ||
      message.includes("empty"))
  );
};

export const getCartStatusClassName = (status: string) => {
  switch (status.toUpperCase()) {
    case "ACTIVE":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
    case "CHECKOUT":
    case "CHECKED_OUT":
    case "COMPLETED":
      return "border-blue-200 bg-blue-50 text-blue-700";
    case "CANCEL":
    case "CANCELED":
    case "CANCELLED":
      return "border-red-200 bg-red-50 text-red-700";
    default:
      return "border-gray-200 bg-gray-50 text-gray-700";
  }
};
