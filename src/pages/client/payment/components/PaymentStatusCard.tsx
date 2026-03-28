export type PaymentDisplayStatus = "PENDING" | "PAID" | "REFUNDED";

type PaymentStatusCardProps = {
  status: PaymentDisplayStatus;
  elapsedSeconds: number;
  lastUpdatedAt: Date;
  isPolling: boolean;
};

const getStatusLabel = (status: PaymentDisplayStatus) => {
  if (status === "PAID") {
    return "Paid";
  }

  if (status === "REFUNDED") {
    return "Refunded";
  }

  return "Pending";
};

const getStatusClasses = (status: PaymentDisplayStatus) => {
  if (status === "PAID") {
    return "border-green-200 bg-green-50 text-green-700";
  }

  if (status === "REFUNDED") {
    return "border-rose-200 bg-rose-50 text-rose-700";
  }

  return "border-amber-200 bg-amber-50 text-amber-700";
};

const PaymentStatusCard = ({
  status,
  elapsedSeconds,
  lastUpdatedAt,
  isPolling,
}: PaymentStatusCardProps) => {
  return (
    <section className="rounded-xl border border-gray-200 bg-white p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-[#5B4037]">Payment status</p>
        <span
          className={`rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClasses(status)}`}
        >
          {getStatusLabel(status)}
        </span>
      </div>

      <div className="mt-4 space-y-2 text-sm text-gray-700">
        <p>
          <span className="font-medium">Polling:</span>{" "}
          {isPolling ? "Active" : "Stopped"}
        </p>
        <p>
          <span className="font-medium">Elapsed:</span> {elapsedSeconds}s
        </p>
        <p>
          <span className="font-medium">Last update:</span>{" "}
          {lastUpdatedAt.toLocaleTimeString("vi-VN")}
        </p>
      </div>
    </section>
  );
};

export default PaymentStatusCard;
