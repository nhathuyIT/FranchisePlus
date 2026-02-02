import Header from "@/components/common/Header";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div>
      <main>
        <Header />
        <Outlet />
      </main>
    </div>
  );
};
export default AdminLayout;
