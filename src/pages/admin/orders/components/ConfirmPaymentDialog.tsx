/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  defaultProviderTxnId,
  isSubmitting,
  onSubmit,
}: ConfirmPaymentDialogProps) {
  const [method, setMethod] = useState("CASH");
  const [providerTxnId, setProviderTxnId] = useState("");
  const [validationError, setValidationError] = useState("");

  useEffect(() => {
    if (!open) {
      setValidationError("");
      return;
    }

    setMethod(defaultMethod || "CASH");
    setProviderTxnId(
      defaultProviderTxnId ||
        (paymentCode ? `MANUAL_${paymentCode}` : "MANUAL_PAYMENT"),
    );
    setValidationError("");
  }, [defaultMethod, defaultProviderTxnId, open, paymentCode]);

  const handleSubmit = async () => {
    if (!method.trim()) {
      setValidationError("Choose a payment method.");
      return;
    }

    if (!providerTxnId.trim()) {
      setValidationError("Provider transaction ID is required.");
      return;
    }

    setValidationError("");

    try {
      await onSubmit({
        method: method.trim(),
        providerTxnId: providerTxnId.trim(),
      });
      onOpenChange(false);
    } catch {
      // Toast is handled by the mutation hook.
    }
  };

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
            <Select value={method} onValueChange={setMethod}>
              <SelectTrigger
                id="payment-method"
                className="border-[#E8DFD6] bg-white"
              >
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                {PAYMENT_METHOD_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="payment-provider-txn-id">
              Provider Transaction ID
            </Label>
            <Input
              id="payment-provider-txn-id"
              value={providerTxnId}
              onChange={(event) => setProviderTxnId(event.target.value)}
              placeholder="Enter provider transaction ID"
              className="border-[#E8DFD6] bg-white"
            />
          </div>

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
            disabled={isSubmitting}
            className="bg-[#6D4C41] text-white hover:bg-[#5D4037]"
          >
            {isSubmitting ? "Submitting..." : "Confirm Payment"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
