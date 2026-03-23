import { z } from "zod";

export const PAYMENT_METHOD_VALUES = [
  "CARD",
  "CASH",
  "COD",
  "QR",
  "BANK_TRANSFER",
] as const;

export const ConfirmPaymentSchema = z.object({
  method: z.enum(PAYMENT_METHOD_VALUES, {
    message: "Payment method is required",
  }),
  providerTxnId: z.string().optional(),
});

export const RefundPaymentSchema = z.object({
  refundReason: z
    .string()
    .trim()
    .min(1, "Refund reason is required")
    .max(500, "Refund reason must be at most 500 characters"),
});

export type ConfirmPaymentFormData = z.infer<typeof ConfirmPaymentSchema>;
export type RefundPaymentFormData = z.infer<typeof RefundPaymentSchema>;
