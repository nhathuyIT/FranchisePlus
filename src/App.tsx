import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AdminRoutes, ClientPublicRoute, ClientRoute } from "./router";
import NotFoundPage from "./pages/NotFoundPage.page";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {AdminRoutes}
          {ClientRoute}
          {ClientPublicRoute}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
