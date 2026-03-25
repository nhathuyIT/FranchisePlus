import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getOrderByCartId } from "@/pages/admin/orders/services/order.service";
import { ROUTER_URL } from "@/router/route.const";

const ORDER_LOOKUP_MAX_ATTEMPTS = 5;
const ORDER_LOOKUP_RETRY_DELAY_MS = 700;
const DEFAULT_LOOKUP_ERROR =
  "Checkout succeeded, but the new order is not available yet. Retry opening the order detail in a moment.";

const wait = (ms: number) =>
  new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });

const toLookupErrorMessage = (error: unknown) => {
  if (error instanceof Error && error.message.trim()) {
    return error.message.trim();
  }

  return DEFAULT_LOOKUP_ERROR;
};

export const useCartCheckoutOrderFlow = () => {
  const navigate = useNavigate();
  const isMountedRef = useRef(true);
  const [isResolvingOrder, setIsResolvingOrder] = useState(false);
  const [lookupError, setLookupError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const clearLookupError = useCallback(() => {
    if (isMountedRef.current) {
      setLookupError(null);
    }
  }, []);

  const openOrderDetailByCartId = useCallback(
    async (cartId: string) => {
      if (!cartId) {
        if (isMountedRef.current) {
          setLookupError(DEFAULT_LOOKUP_ERROR);
        }
        return false;
      }

      if (isMountedRef.current) {
        setIsResolvingOrder(true);
        setLookupError(null);
      }

      let lastError: unknown = null;

      for (let attempt = 0; attempt < ORDER_LOOKUP_MAX_ATTEMPTS; attempt += 1) {
        try {
          const order = await getOrderByCartId(cartId);

          if (order?.id) {
            if (isMountedRef.current) {
              setIsResolvingOrder(false);
            }

            navigate(
              `/admin/${ROUTER_URL.ADMIN_ROUTER.ORDERS_DETAIL.replace(":orderId", order.id)}`,
            );
            return true;
          }

          lastError = new Error(DEFAULT_LOOKUP_ERROR);
        } catch (error) {
          lastError = error;
        }

        if (attempt < ORDER_LOOKUP_MAX_ATTEMPTS - 1) {
          await wait(ORDER_LOOKUP_RETRY_DELAY_MS);
        }
      }

      if (isMountedRef.current) {
        setIsResolvingOrder(false);
        setLookupError(toLookupErrorMessage(lastError));
      }

      return false;
    },
    [navigate],
  );

  return {
    isResolvingOrder,
    lookupError,
    clearLookupError,
    openOrderDetailByCartId,
  };
};
