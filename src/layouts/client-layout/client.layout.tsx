import Header from "@/components/common/Header";
import { Outlet } from "react-router-dom";

function ClientLayout() {
  return (
    <div>
      <main>
        <Header />
        <Outlet />
      </main>
    </div>
  );
}

export default ClientLayout;
