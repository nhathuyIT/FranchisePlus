import { ClientLayout } from "@/layouts";
import { Route } from "react-router-dom";
import { HomePage, AboutPage, ContactPage, LocationPage } from "@/pages/client";
import { ROUTER_URL } from "../route.const";

export const ClientPublicRoute = (
  <Route element={<ClientLayout />}>
    <Route path="/" element={<HomePage />} />
    <Route path={ROUTER_URL.ABOUT} element={<AboutPage />} />
    <Route path={ROUTER_URL.CONTACT} element={<ContactPage />} />
    <Route path={ROUTER_URL.LOCATIONS} element={<LocationPage />} />
  </Route>
);
