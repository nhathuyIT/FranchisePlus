import { Outlet } from "react-router-dom";

function ClientLayout() {
  return (
    <div>
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default ClientLayout;
