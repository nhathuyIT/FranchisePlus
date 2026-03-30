/* eslint-disable react-hooks/set-state-in-effect */
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { ConfirmPaymentPayload } from "../models/order-management.type";
import { PAYMENT_METHOD_OPTIONS } from "../utils/order-management.utils";

const QR_AUTO_CONFIRM_DELAY_MS = 5000;
const SUPPORTED_PAYMENT_METHOD_OPTIONS = PAYMENT_METHOD_OPTIONS.filter(
  (option) => option.value === "QR" || option.value === "CASH",
);

const normalizeSupportedMethod = (value?: string | null) => {
  const normalized = (value || "").trim().toUpperCase();

  return normalized === "QR" ? "QR" : "CASH";
};

const getGeneratedProviderTxnId = (method: string, paymentCode?: string) => {
  const normalizedMethod = normalizeSupportedMethod(method);

  switch (normalizedMethod) {
    case "QR":
      return paymentCode ? `QR_SIM_${paymentCode}` : "QR_SIM_PAYMENT";
    case "CASH":
    default:
      return paymentCode ? `CASH_${paymentCode}` : "CASH_PAYMENT";
  }
};

interface ConfirmPaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  paymentCode?: string;
  defaultMethod?: string;
  defaultProviderTxnId?: string;
  isSubmitting: boolean;
  onSubmit: (payload: ConfirmPaymentPayload) => Promise<void>;
}

export function ConfirmPaymentDialog({
  open,
  onOpenChange,
  paymentCode,
  defaultMethod,
  isSubmitting,
  onSubmit,
}: ConfirmPaymentDialogProps) {
  const [method, setMethod] = useState("CASH");
  const [validationError, setValidationError] = useState("");
  const [isQrAutoConfirming, setIsQrAutoConfirming] = useState(false);

  const qrTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const normalizedMethod = normalizeSupportedMethod(method);
  const isQr = normalizedMethod === "QR";

  const clearQrTimer = useCallback(() => {
    if (qrTimeoutRef.current) {
      clearTimeout(qrTimeoutRef.current);
      qrTimeoutRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!open) {
      clearQrTimer();
      setValidationError("");
      setIsQrAutoConfirming(false);
      return;
    }

    setMethod(normalizeSupportedMethod(defaultMethod));
    setValidationError("");
    setIsQrAutoConfirming(false);
  }, [clearQrTimer, defaultMethod, open]);

  const handleSubmit = useCallback(async () => {
    const resolvedMethod = normalizeSupportedMethod(method);
    const resolvedProviderTxnId = getGeneratedProviderTxnId(
      resolvedMethod,
      paymentCode,
    );

    if (!resolvedMethod) {
      setValidationError("Choose a payment method.");
      return;
    }

    if (!resolvedProviderTxnId) {
      setValidationError("Provider transaction ID is required.");
      return;
    }

    setValidationError("");

    try {
      await onSubmit({
        method: resolvedMethod,
        providerTxnId: resolvedProviderTxnId,
      });
      onOpenChange(false);
    } catch {
      setIsQrAutoConfirming(false);
      // Toast is handled by the mutation hook.
    }
  }, [method, onOpenChange, onSubmit, paymentCode]);

  useEffect(() => {
    clearQrTimer();

    if (!open || !isQr || isSubmitting || isQrAutoConfirming) {
      return;
    }

    setValidationError("");
    qrTimeoutRef.current = setTimeout(() => {
      setIsQrAutoConfirming(true);
    }, QR_AUTO_CONFIRM_DELAY_MS);

    return () => {
      clearQrTimer();
    };
  }, [clearQrTimer, isQr, isQrAutoConfirming, isSubmitting, open]);

  useEffect(() => {
    if (!open || !isQr || !isQrAutoConfirming || isSubmitting) {
      return;
    }

    void handleSubmit();
  }, [handleSubmit, isQr, isQrAutoConfirming, isSubmitting, open]);

  useEffect(() => {
    return () => {
      clearQrTimer();
    };
  }, [clearQrTimer]);

  const handleMethodChange = (nextMethod: string) => {
    clearQrTimer();
    setMethod(normalizeSupportedMethod(nextMethod));
    setValidationError("");
    setIsQrAutoConfirming(false);
  };

  const confirmLabel =
    isSubmitting || isQrAutoConfirming
      ? "Submitting..."
      : isQr
        ? "Waiting for QR..."
        : "Confirm Payment";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Confirm Payment</DialogTitle>
          <DialogDescription>
            Finalize the payment after checking the actual payment method and
            transaction reference.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="payment-method">Payment Method</Label>
            <Select
              value={method}
              onValueChange={handleMethodChange}
              disabled={isSubmitting || isQrAutoConfirming}
            >
              <SelectTrigger
                id="payment-method"
                className="border-[#E8DFD6] bg-white"
              >
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                {SUPPORTED_PAYMENT_METHOD_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {isQr ? (
            <div className="rounded-2xl border border-[#E2CCB8] bg-[#FFF8F1] p-4">
              <p className="text-sm font-semibold text-[#3E2723]">
                Scan QR to Pay
              </p>
              <p className="mt-1 text-sm text-[#8D6E63]">
                Use the QR below to simulate payment. The system will confirm it
                automatically after a short delay.
              </p>

              <div className="mt-4 rounded-2xl border border-[#E8DFD6] bg-white p-4">
                <img
                  src="/QRCodes.jpg"
                  alt="QR code payment"
                  className="mx-auto h-56 w-56 max-w-full object-contain"
                />
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-dashed border-[#D7CCC8] bg-white/80 px-4 py-3">
                <div>
                  <p className="text-xs uppercase tracking-wide text-[#8D6E63]">
                    Payment Status
                  </p>
                  <p className="mt-1 text-sm font-medium text-[#5D4037]">
                    {isQrAutoConfirming || isSubmitting
                      ? "Confirming payment..."
                      : "Waiting for QR payment..."}
                  </p>
                </div>

                <div className="rounded-full bg-[#FAF1E8] px-3 py-1.5 text-xs font-medium text-[#6D4C41]">
                  {getGeneratedProviderTxnId(method, paymentCode)}
                </div>
              </div>
            </div>
          ) : null}

          {validationError && (
            <p className="text-sm text-[#9B2C2C]">{validationError}</p>
          )}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-[#E8DFD6] text-[#6D4C41]"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={() => {
              void handleSubmit();
            }}
            disabled={isSubmitting || isQr || isQrAutoConfirming}
            className="bg-[#6D4C41] text-white hover:bg-[#5D4037]"
          >
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
