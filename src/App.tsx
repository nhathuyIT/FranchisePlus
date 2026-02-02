import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AdminRoutes, ClientPublicRoute, ClientRoute } from "./router";
import NotFoundPage from "./pages/NotFoundPage.page";
import AdminAuthRoute from "./router/admin/admin.auth.route";
import ClientAuthRoute from "./router/client/client.auth.route";
import { Toaster } from "@/components/ui/sonner";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {AdminAuthRoute}
          {AdminRoutes}
          {ClientAuthRoute}
          {ClientRoute}
          {ClientPublicRoute}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-center" />
    </>
  );
}

export default App;
