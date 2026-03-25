import type { JSX } from "react";
import React from "react";
import { ROUTER_URL } from "../route.const";

export type ClientMenuItem = {
  label: string;
  path: string;
  component: React.LazyExoticComponent<() => JSX.Element>;
  isEnd?: boolean;
};
export const CLIENT_MENU: ClientMenuItem[] = [
  {
    label: "Cart",
    path: ROUTER_URL.CLIENT_ROUTER.CART,
    component: React.lazy(() => import("@/pages/client/cart")),
    isEnd: true,
  },

  {
    label: "Product Detail",
    path: ROUTER_URL.CLIENT_ROUTER.PRODUCT_DETAIL,
    component: React.lazy(
      () => import("@/pages/client/products/components/ProductDetail"),
    ),
  },
  {
    label: "Checkout",
    path: ROUTER_URL.CLIENT_ROUTER.CHECKOUT,
    component: React.lazy(() => import("@/pages/client/checkout")),
    isEnd: true,
  },
  {
    label: "Payment",
    path: ROUTER_URL.CLIENT_ROUTER.PAYMENT,
    component: React.lazy(() => import("@/pages/client/payment")),
    isEnd: true,
  },
  {
    label: "Payment QR",
    path: ROUTER_URL.CLIENT_ROUTER.PAYMENT_QR,
    component: React.lazy(
      () => import("@/pages/client/payment/QRTransactionPage"),
    ),
    isEnd: true,
  },
  {
    label: "Payment Success",
    path: ROUTER_URL.CLIENT_ROUTER.PAYMENT_SUCCESS,
    component: React.lazy(
      () => import("@/pages/client/payment/PaymentSuccessPage"),
    ),
    isEnd: true,
  },
];
