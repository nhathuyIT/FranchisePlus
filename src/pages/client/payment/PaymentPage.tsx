import { Navigate, useLocation } from "react-router-dom";
import { ROUTER_URL } from "@/router/route.const";

const PaymentPage = () => {
  const location = useLocation();

  return (
    <Navigate
      to={`${ROUTER_URL.CLIENT}/${ROUTER_URL.CLIENT_ROUTER.CHECKOUT}`}
      replace
      state={location.state}
    />
  );
};

export default PaymentPage;
