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
    label: "Products",
    path: ROUTER_URL.CLIENT_ROUTER.PRODUCTS,
    component: React.lazy(() => import("@/pages/client/products")),
  },
  {
    label: "Product Detail",
    path: ROUTER_URL.CLIENT_ROUTER.PRODUCT_DETAIL,
    component: React.lazy(() => import("@/pages/client/products/components/ProductDetail")),
  },
];
