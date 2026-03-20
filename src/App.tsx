import { BrowserRouter, Route, Routes } from "react-router-dom";
import {
  AdminRoutes,
  ClientPublicRoute,
  ClientRoute,
  AccountRoute,
} from "./router";
import NotFoundPage from "./pages/NotFoundPage.page";
import UnauthorizedPage from "./pages/UnauthorizedPage.page";
import AdminAuthRoute from "./router/admin/admin.auth.route";
import ClientAuthRoute from "./router/client/client.auth.route";
import { Toaster } from "@/components/ui/sonner";
import { useAuthStore } from "./stores/auth-store";
import { useEffect } from "react";
import LoadingLayout from "./layouts/loading-layout";
import ScrollToTop from "./components/ui/scroll-top";
function App() {
  const { hydrate, isInitialized } = useAuthStore();

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  if (!isInitialized) {
    return <LoadingLayout forceVisible />;
  }

  return (
    <>
      <LoadingLayout />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          {AdminAuthRoute}
          {AdminRoutes}
          {ClientAuthRoute}
          {ClientRoute}
          {AccountRoute}
          {ClientPublicRoute}
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
      <Toaster
        position="top-center"
        toastOptions={{
          classNames: {
            toast: "bg-white text-[#3E2723] shadow-xl",
            title: "text-sm font-semibold text-[#2F221E]",
            description: "text-sm text-[#6B4F45] !opacity-100",
          },
        }}
      />
    </>
  );
}

export default App;
