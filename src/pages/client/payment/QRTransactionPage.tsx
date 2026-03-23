import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import secureLockIcon from "@/assets/icons/secure-lock.svg";
import qrPaymentIcon from "@/assets/icons/qr-payment.svg";
import { ROUTER_URL } from "@/router/route.const";
import { useCart } from "@/pages/client/cart/useCart";
import type { ShippingInfo } from "@/types/payment";

type QRPageLocationState = {
  shippingInfo?: ShippingInfo;
  amount?: number;
  itemCount?: number;
};

const QRTransactionPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { totalAmount, itemCount } = useCart();

  const state = (location.state || {}) as QRPageLocationState;

  const shippingInfo = state.shippingInfo;
  const amount = state.amount ?? totalAmount;
  const count = state.itemCount ?? itemCount;

  const canCreateTransaction = useMemo(() => {
    return Boolean(
      shippingInfo?.address?.trim() && shippingInfo?.phone?.trim(),
    );
  }, [shippingInfo?.address, shippingInfo?.phone]);

  const handleCreateTransaction = () => {
    if (!canCreateTransaction) {
      toast.error("Thiếu thông tin giao hàng", {
        description:
          "Vui lòng quay lại trang thanh toán để nhập đầy đủ địa chỉ và số điện thoại.",
      });
      return;
    }

    toast.info("Đã sẵn sàng tích hợp PayOS", {
      description:
        "Bước tiếp theo là gọi API tạo payment link và render QR từ response backend.",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm p-6 md:p-8 border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <img src={qrPaymentIcon} alt="QR Payment" className="w-12 h-12" />
            <div>
              <h1 className="text-2xl font-bold text-[#5B4037]">
                Tạo Giao Dịch QR
              </h1>
              <p className="text-sm text-gray-600">
                Xác nhận thông tin trước khi tạo payment link (PayOS)
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="rounded-lg border border-gray-200 p-4 bg-[#FFFCF5]">
              <p className="text-xs text-gray-500 mb-1">Tổng tiền</p>
              <p className="text-xl font-semibold text-[#B8860B]">
                {amount.toLocaleString("vi-VN")} VND
              </p>
            </div>
            <div className="rounded-lg border border-gray-200 p-4 bg-[#FFFCF5]">
              <p className="text-xs text-gray-500 mb-1">Số lượng sản phẩm</p>
              <p className="text-xl font-semibold text-[#5B4037]">{count}</p>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 p-4 mb-6">
            <p className="text-sm font-semibold text-[#5B4037] mb-3">
              Thông tin giao hàng
            </p>
            <div className="space-y-2 text-sm text-gray-700">
              <p>
                <span className="font-medium">Người nhận:</span>{" "}
                {shippingInfo?.fullName || "Chưa có"}
              </p>
              <p>
                <span className="font-medium">Số điện thoại:</span>{" "}
                {shippingInfo?.phone || "Chưa có"}
              </p>
              <p>
                <span className="font-medium">Địa chỉ:</span>{" "}
                {shippingInfo?.address || "Chưa có"}
              </p>
              <p>
                <span className="font-medium">Ghi chú:</span>{" "}
                {shippingInfo?.notes || "Không có"}
              </p>
            </div>
          </div>

          <div className="rounded-lg border border-dashed border-[#D7B56D] bg-[#FFF8E8] p-4 mb-6">
            <p className="text-sm text-[#7A5A21]">
              Chưa tích hợp endpoint tạo giao dịch PayOS. Khi backend sẵn sàng,
              trang này sẽ gọi API tạo payment link và hiển thị mã QR cho khách
              quét thanh toán.
            </p>
          </div>

          <div className="space-y-3">
            <button
              type="button"
              onClick={handleCreateTransaction}
              className="w-full bg-[#B8860B] text-white font-semibold py-3 rounded-lg hover:bg-amber-700 transition-colors"
            >
              Tạo giao dịch QR (Demo)
            </button>
            <button
              type="button"
              onClick={() => navigate(ROUTER_URL.CLIENT_ROUTER.PAYMENT)}
              className="w-full bg-gray-100 text-gray-700 font-semibold py-3 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Quay lại trang thanh toán
            </button>
          </div>

          <div className="flex items-center justify-center gap-2 text-xs text-gray-500 mt-5">
            <img src={secureLockIcon} alt="Secure" className="w-4 h-4" />
            <span>Thông tin của bạn được bảo mật an toàn</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRTransactionPage;
