import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export type PaymentMockStatus = "PENDING" | "PAID";

type UsePaymentStatusPollerOptions = {
  enabled: boolean;
  intervalMs?: number;
  autoPaidAfterSeconds?: number;
};

type UsePaymentStatusPollerResult = {
  status: PaymentMockStatus;
  elapsedSeconds: number;
  lastUpdatedAt: Date;
  isPolling: boolean;
  retry: () => void;
};

const DEFAULT_INTERVAL_MS = 1000;
const DEFAULT_AUTO_PAID_AFTER_SECONDS = 12;

export const usePaymentStatusPoller = ({
  enabled,
  intervalMs = DEFAULT_INTERVAL_MS,
  autoPaidAfterSeconds = DEFAULT_AUTO_PAID_AFTER_SECONDS,
}: UsePaymentStatusPollerOptions): UsePaymentStatusPollerResult => {
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [lastUpdatedAt, setLastUpdatedAt] = useState<Date>(new Date());
  const [retryVersion, setRetryVersion] = useState<number>(0);

  const clearTimer = useCallback(() => {
    if (!timerRef.current) {
      return;
    }

    clearInterval(timerRef.current);
    timerRef.current = null;
  }, []);

  useEffect(() => {
    if (!enabled) {
      clearTimer();
      return;
    }

    clearTimer();

    timerRef.current = setInterval(() => {
      setElapsedSeconds((prevElapsedSeconds) => {
        const nextElapsedSeconds = prevElapsedSeconds + 1;

        if (nextElapsedSeconds >= autoPaidAfterSeconds) {
          clearTimer();
        }

        return nextElapsedSeconds;
      });

      setLastUpdatedAt(new Date());
    }, intervalMs);

    return () => {
      clearTimer();
    };
  }, [autoPaidAfterSeconds, clearTimer, enabled, intervalMs, retryVersion]);

  const status = useMemo<PaymentMockStatus>(() => {
    return elapsedSeconds >= autoPaidAfterSeconds ? "PAID" : "PENDING";
  }, [autoPaidAfterSeconds, elapsedSeconds]);

  const isPolling = useMemo(
    () => enabled && status === "PENDING",
    [enabled, status],
  );

  const retry = useCallback(() => {
    setElapsedSeconds(0);
    setLastUpdatedAt(new Date());
    setRetryVersion((prevRetryVersion) => prevRetryVersion + 1);
  }, []);

  return {
    status,
    elapsedSeconds,
    lastUpdatedAt,
    isPolling,
    retry,
  };
};
