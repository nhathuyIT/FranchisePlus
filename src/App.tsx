import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ClientPublicRoute, ClientRoute } from "./router";
import NotFoundPage from "./pages/NotFoundPage.page";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {ClientRoute}
          {ClientPublicRoute}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
