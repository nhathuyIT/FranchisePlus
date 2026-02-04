import Header from "@/components/common/Header";
import { Outlet } from "react-router-dom";
import { FooterInfo } from "@/components/common/FooterInfo";

function ClientLayout() {
  return (
    <div>
      <main>
        <Header />
        <Outlet />
        <FooterInfo />
      </main>
    </div>
  );
}

export default ClientLayout;
 