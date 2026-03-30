import { QRCodeSVG } from "qrcode.react";

type QRDisplayProps = {
  amount: number;
  transactionCode: string;
};

const QRDisplay = ({ amount, transactionCode }: QRDisplayProps) => {
  return (
    <div className="flex flex-col items-center gap-5">
      {/* QR Code box */}
      <div className="relative rounded-2xl border-2 border-[#E8DFD6] bg-white p-4 shadow-inner">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#FFF9F0] to-white opacity-80 pointer-events-none" />
        <div className="relative z-10">
          <QRCodeSVG
            value={transactionCode}
            size={200}
            bgColor="#FFFFFF"
            fgColor="#3E2723"
            level="M"
            includeMargin={false}
          />
        </div>
      </div>

      {/* Amount badge */}
      <div className="flex flex-col items-center gap-1">
        <span className="text-xs font-semibold uppercase tracking-widest text-[#9A7B67]">
          Amount Due
        </span>
        <span className="text-2xl font-bold text-[#C97B3D]">
          {amount.toLocaleString("vi-VN")}
          <span className="ml-1 text-base font-semibold text-[#A06030]">₫</span>
        </span>
      </div>

      {/* Transaction code */}
      <div className="w-full rounded-xl border border-[#EDE0D4] bg-[#FAF6F0] px-4 py-3 text-center">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-[#9A7B67]">
          Transaction ID
        </p>
        <p className="mt-1 break-all font-mono text-xs font-semibold text-[#5B4037]">
          {transactionCode}
        </p>
      </div>
    </div>
  );
};

export default QRDisplay;
