import type { PaymentDisplayStatus } from "./PaymentStatusCard";

type PaymentActionsProps = {
  status: PaymentDisplayStatus;
  isMockMode: boolean;
  canConfirmAsPaid: boolean;
  isConfirmingPaid: boolean;
  onCopyPayload: () => void;
  onConfirmAsPaid: () => void;
  onRetry: () => void;
  onBackToOrders: () => void;
};

const PaymentActions = ({
  status,
  isMockMode,
  canConfirmAsPaid,
  isConfirmingPaid,
  onCopyPayload,
  onConfirmAsPaid,
  onRetry,
  onBackToOrders,
}: PaymentActionsProps) => {
  return (
    <section className="space-y-3 rounded-xl border border-gray-200 bg-white p-5">
      <button
        type="button"
        onClick={onCopyPayload}
        className="w-full rounded-lg bg-gray-900 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-black"
      >
        Copy QR payload
      </button>

      {isMockMode ? (
        <button
          type="button"
          onClick={onRetry}
          disabled={status !== "PAID"}
          className="w-full rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800 transition-colors enabled:hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Retry mock payment
        </button>
      ) : (
        <button
          type="button"
          onClick={onConfirmAsPaid}
          disabled={!canConfirmAsPaid || isConfirmingPaid}
          className="w-full rounded-lg border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800 transition-colors enabled:hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isConfirmingPaid ? "Confirming..." : "Confirm payment as PAID"}
        </button>
      )}

      <button
        type="button"
        onClick={onBackToOrders}
        className="w-full rounded-lg bg-[#B8860B] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-amber-700"
      >
        Go to my orders
      </button>
    </section>
  );
};

export default PaymentActions;
