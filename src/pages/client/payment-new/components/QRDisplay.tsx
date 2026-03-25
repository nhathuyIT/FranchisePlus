type QRDisplayProps = {
  amount: number;
  transactionCode: string;
  qrDataUrl: string;
};

const QRDisplay = ({ amount, transactionCode, qrDataUrl }: QRDisplayProps) => {
  return (
    <section className="rounded-xl border border-amber-200 bg-[#FFF9ED] p-5">
      <p className="text-sm font-semibold text-[#5B4037]">Scan to pay</p>
      <p className="mt-1 text-xs text-gray-600">
        This QR is mocked for frontend flow while backend QR API is not ready.
      </p>

      <div className="mt-4 flex justify-center">
        <img
          src={qrDataUrl}
          alt="Mock QR code"
          className="h-56 w-56 rounded-xl border border-amber-200 bg-white p-3"
        />
      </div>

      <div className="mt-4 rounded-lg border border-amber-200 bg-white p-3 text-sm">
        <p>
          <span className="font-medium text-gray-700">Transaction:</span>{" "}
          <span className="font-semibold text-[#5B4037]">{transactionCode}</span>
        </p>
        <p className="mt-1">
          <span className="font-medium text-gray-700">Amount:</span>{" "}
          <span className="font-semibold text-[#B8860B]">
            {amount.toLocaleString("vi-VN")} VND
          </span>
        </p>
      </div>
    </section>
  );
};

export default QRDisplay;
