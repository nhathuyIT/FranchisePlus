import { ClientLayout } from "@/layouts";
import { Route } from "react-router-dom";
import { HomePage, AboutPage, ContactPage } from "@/pages/client";
import { ROUTER_URL } from "../route.const";
import ProductsPage from "@/pages/client/products";
import ProductDetailPage from "@/pages/client/products/components/ProductDetail";

export const ClientPublicRoute = (
  <Route element={<ClientLayout />}>
    <Route path="/" element={<HomePage />} />
    <Route path={ROUTER_URL.ABOUT} element={<AboutPage />} />
    <Route path={ROUTER_URL.CONTACT} element={<ContactPage />} />
    <Route path={ROUTER_URL.PRODUCTS} element={<ProductsPage />} />
    <Route path={ROUTER_URL.PRODUCT_DETAIL} element={<ProductDetailPage />} />
  </Route>
);
