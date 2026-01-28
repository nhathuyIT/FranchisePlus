import { ClientLayout } from "@/layouts";
import { Route } from "react-router-dom";
import { ROUTER_URL } from "../route.const";
import { AboutPage, ContactPage, HomePage } from "@/pages/client";

export const ClientPublicRoute = (
  <Route element={<ClientLayout />}>
    <Route path="/" element={<HomePage />} />
    <Route path={ROUTER_URL.ABOUT} element={<AboutPage />} />
    <Route path={ROUTER_URL.CONTACT} element={<ContactPage />} />
  </Route>
);
