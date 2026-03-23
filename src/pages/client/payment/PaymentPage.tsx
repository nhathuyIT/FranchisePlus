import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTER_URL } from "@/router/route.const";
import { useCart } from "@/pages/client/cart/useCart";
import { useCheckoutCartMutation } from "@/hooks/cart/useCart.hook";
import { PRODUCTS_CLIENT } from "@/const/product-client.const";
import { useAuthStore } from "@/stores/auth-store";
import cashPaymentIcon from "@/assets/icons/cash-payment.svg";
import qrPaymentIcon from "@/assets/icons/qr-payment.svg";
import emptyCartIcon from "@/assets/icons/empty-cart.svg";
import secureLockIcon from "@/assets/icons/secure-lock.svg";
import coffeeCupIcon from "@/assets/icons/coffee-cup.svg";
import type { PaymentMethod, ShippingInfo } from "@/types/payment";

const PaymentPage = () => {
  const navigate = useNavigate();
  const { cart, carts, subtotal, totalAmount, itemCount } = useCart();
  const checkoutCartMutation = useCheckoutCartMutation();
  const { authUser } = useAuthStore();

  const getUserEmail = (): string => {
    return authUser?.user?.email || "";
  };

  const getUserName = (): string => {
    return authUser?.user?.name || "";
  };

  const getUserPhone = (): string => {
    return authUser?.user?.phone || "";
  };

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("COD");
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    fullName: getUserName(),
    phone: getUserPhone(),
    email: getUserEmail(),
    address: "",
    notes: "",
  });

  // Error state for form validation
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Validation functions
  const validateFullName = (name: string): string => {
    if (!name.trim()) {
      return "Vui lòng nhập họ và tên.";
    }

    // Check if name contains only letters and spaces
    const nameRegex = /^[a-zA-ZÀ-ỹ\s]+$/;
    if (!nameRegex.test(name)) {
      return "Vui lòng nhập họ và tên hợp lệ (chỉ bao gồm chữ cái).";
    }

    // Check minimum 2 words
    const words = name.trim().split(/\s+/);
    if (words.length < 2) {
      return "Họ và tên phải có ít nhất 2 từ.";
    }

    // Check length
    if (name.length < 2 || name.length > 50) {
      return "Họ và tên phải từ 2 đến 50 ký tự.";
    }

    return "";
  };

  const validatePhone = (phone: string): string => {
    if (!phone.trim()) {
      return "Vui lòng nhập số điện thoại.";
    }

    // Vietnamese phone number format
    const phoneRegex = /^0[3|5|7|8|9][0-9]{8}$/;
    if (!phoneRegex.test(phone)) {
      return "Số điện thoại không đúng định dạng (phải có 10 chữ số và bắt đầu bằng 03, 05, 07, 08, 09).";
    }

    return "";
  };

  const validateAddress = (address: string): string => {
    if (!address.trim()) {
      return "Vui lòng nhập địa chỉ giao hàng.";
    }

    if (address.trim().length < 10) {
      return "Vui lòng nhập địa chỉ giao hàng chi tiết để chúng tôi có thể giao hàng chính xác.";
    }

    return "";
  };

  const validateNotes = (notes: string): string => {
    if (notes.length > 200) {
      return "Ghi chú không được vượt quá 200 ký tự.";
    }
    return "";
  };

  // Helper function to get product image
  const getProductImage = (productId: number): string => {
    const product = PRODUCTS_CLIENT.find((p) => p.id === productId);
    return product?.imageUrl || "";
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setShippingInfo((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Validate on blur (when user leaves the input)
  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    let error = "";

    switch (name) {
      case "fullName":
        error = validateFullName(value);
        break;
      case "phone":
        error = validatePhone(value);
        break;
      case "address":
        error = validateAddress(value);
        break;
      case "notes":
        error = validateNotes(value);
        break;
    }

    if (error) {
      setErrors((prev) => ({
        ...prev,
        [name]: error,
      }));
    }
  };

  const handleSubmitOrder = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    // Validate all fields
    const newErrors: { [key: string]: string } = {};

    const fullNameError = validateFullName(shippingInfo.fullName);
    if (fullNameError) newErrors.fullName = fullNameError;

    const phoneError = validatePhone(shippingInfo.phone);
    if (phoneError) newErrors.phone = phoneError;

    const addressError = validateAddress(shippingInfo.address);
    if (addressError) newErrors.address = addressError;

    const notesError = validateNotes(shippingInfo.notes);
    if (notesError) newErrors.notes = notesError;

    // If there are errors, set them and stop submission
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // Scroll to first error
      const firstErrorField = Object.keys(newErrors)[0];
      const element = document.getElementsByName(firstErrorField)[0];
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
        element.focus();
      }
      return;
    }

    if (cart.items.length === 0) {
      alert("Giỏ hàng trống!");
      navigate("/client/cart");
      return;
    }

    if (paymentMethod === "QR") {
      navigate(ROUTER_URL.CLIENT_ROUTER.PAYMENT_QR, {
        state: {
          shippingInfo,
          amount: totalAmount,
          itemCount,
        },
      });
      return;
    }

    const checkoutPayload = {
      address: shippingInfo.address.trim(),
      phone: shippingInfo.phone.trim(),
      message: shippingInfo.notes.trim(),
    };

    const targetCartIds = Array.from(
      new Set(carts.map((singleCart) => singleCart.id).filter(Boolean)),
    );

    try {
      for (const cartId of targetCartIds) {
        await checkoutCartMutation.mutateAsync({
          cartId,
          data: checkoutPayload,
        });
      }

      if (paymentMethod === "COD") {
        alert(
          `Đơn hàng của bạn đã được xác nhận!\n\n` +
            `Phương thức thanh toán: Thanh toán khi nhận hàng\n` +
            `Tổng tiền: ${totalAmount.toLocaleString("vi-VN")} VND\n\n` +
            `Chúng tôi sẽ liên hệ với bạn sớm nhất!`,
        );
        navigate("/menu");
      }
    } catch {
      // Error toast is handled in the mutation hook
    }
  };

  // Redirect if cart is empty
  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center py-16">
            <div className="mb-6 flex justify-center">
              <img src={emptyCartIcon} alt="Empty cart" className="w-32 h-32" />
            </div>
            <h3 className="text-2xl font-bold text-[#5B4037] mb-4">
              Giỏ hàng trống
            </h3>
            <p className="text-gray-600 mb-8">
              Vui lòng thêm sản phẩm vào giỏ hàng trước khi thanh toán.
            </p>
            <button
              onClick={() => navigate("/menu")}
              className="bg-[#B8860B] text-white px-8 py-3 rounded font-semibold hover:bg-amber-700 transition-colors"
            >
              Xem Menu
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#5B4037] mb-2">Thanh toán</h1>
          <p className="text-gray-600">
            Vui lòng điền thông tin giao hàng và chọn phương thức thanh toán
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left side - Shipping Info & Payment Method */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-[#5B4037] mb-4">
                Thông tin giao hàng
              </h2>
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Số điện thoại <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={shippingInfo.phone}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition-all ${
                        errors.phone
                          ? "border-red-500 focus:ring-red-200"
                          : "border-gray-300 focus:ring-[#B8860B]"
                      }`}
                      placeholder="0123456789"
                      required
                    />
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.phone}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={shippingInfo.email}
                      readOnly={!!authUser?.user?.email}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition-all ${
                        authUser?.user?.email
                          ? "bg-gray-100 cursor-not-allowed text-gray-600"
                          : errors.email
                            ? "border-red-500 focus:ring-red-200"
                            : "border-gray-300 focus:ring-[#B8860B]"
                      }`}
                      placeholder="email@example.com"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.email}
                      </p>
                    )}
                    {authUser?.user?.email && (
                      <p className="mt-1 text-xs text-gray-500">
                        Email này được lấy từ tài khoản đăng nhập của bạn
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Địa chỉ giao hàng <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={shippingInfo.address}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition-all ${
                      errors.address
                        ? "border-red-500 focus:ring-red-200"
                        : "border-gray-300 focus:ring-[#B8860B]"
                    }`}
                    placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố"
                    required
                  />
                  {errors.address && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.address}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ghi chú đơn hàng
                    <span className="text-gray-500 text-xs ml-2">
                      ({shippingInfo.notes.length}/200 ký tự)
                    </span>
                  </label>
                  <textarea
                    name="notes"
                    value={shippingInfo.notes}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    rows={3}
                    maxLength={200}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition-all resize-none ${
                      errors.notes
                        ? "border-red-500 focus:ring-red-200"
                        : "border-gray-300 focus:ring-[#B8860B]"
                    }`}
                    placeholder="Ghi chú về đơn hàng, ví dụ: thời gian hay chỉ dẫn địa điểm giao hàng chi tiết hơn"
                  />
                  {errors.notes && (
                    <p className="mt-1 text-sm text-red-600">{errors.notes}</p>
                  )}
                </div>
              </form>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-[#5B4037] mb-4">
                Phương thức thanh toán
              </h2>

              <div className="space-y-3">
                {/* COD Payment */}
                <label
                  className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    paymentMethod === "COD"
                      ? "border-[#B8860B] bg-amber-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="COD"
                    checked={paymentMethod === "COD"}
                    onChange={(e) =>
                      setPaymentMethod(e.target.value as PaymentMethod)
                    }
                    className="mt-1 w-5 h-5 text-[#B8860B] focus:ring-[#B8860B]"
                  />
                  <div className="ml-3 flex-1">
                    <div className="flex items-center gap-3">
                      <img
                        src={cashPaymentIcon}
                        alt="COD"
                        className="w-10 h-10"
                      />
                      <span className="font-semibold text-gray-900">
                        Thanh toán khi nhận hàng (COD)
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Thanh toán bằng tiền mặt khi nhận hàng
                    </p>
                  </div>
                </label>

                {/* QR Payment */}
                <label
                  className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    paymentMethod === "QR"
                      ? "border-[#B8860B] bg-amber-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="QR"
                    checked={paymentMethod === "QR"}
                    onChange={(e) =>
                      setPaymentMethod(e.target.value as PaymentMethod)
                    }
                    className="mt-1 w-5 h-5 text-[#B8860B] focus:ring-[#B8860B]"
                  />
                  <div className="ml-3 flex-1">
                    <div className="flex items-center gap-3">
                      <img
                        src={qrPaymentIcon}
                        alt="QR Payment"
                        className="w-10 h-10"
                      />
                      <span className="font-semibold text-gray-900">
                        Thanh toán qua QR Code
                      </span>
                      <span className="text-xs bg-[#B8860B] text-white px-2 py-1 rounded">
                        PayOS
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Quét mã QR để thanh toán qua ví điện tử
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Right side - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <h2 className="text-xl font-bold text-[#5B4037] mb-4">
                Đơn hàng của bạn
              </h2>

              {/* Order Items */}
              <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                {cart.items.map((item) => (
                  <div
                    key={item.productFranchiseId}
                    className="flex items-start gap-3 pb-3 border-b border-gray-100"
                  >
                    <div className="w-16 h-16 bg-amber-50 rounded-lg border border-gray-200 overflow-hidden shrink-0">
                      <img
                        src={
                          item.imageUrl ||
                          getProductImage(Number(item.productFranchiseId))
                        }
                        alt="coffee"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = coffeeCupIcon;
                          target.style.objectFit = "contain";
                          target.style.padding = "8px";
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 text-sm truncate">
                        {item.productNameSnapshot}
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">
                        {item.priceSnapshot.toLocaleString("vi-VN")} VND ×{" "}
                        {item.quantity}
                      </p>
                      <p className="text-sm font-semibold text-[#B8860B] mt-1">
                        {item.lineTotal.toLocaleString("vi-VN")} VND
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div className="space-y-2 py-4 border-t border-gray-200">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tổng sản phẩm:</span>
                  <span className="font-medium">{itemCount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tạm tính:</span>
                  <span className="font-medium">
                    {subtotal.toLocaleString("vi-VN")} VND
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Phí vận chuyển:</span>
                  <span className="font-medium text-green-600">Miễn phí</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200">
                  <span className="text-gray-900">Tổng cộng:</span>
                  <span className="text-[#B8860B]">
                    {totalAmount.toLocaleString("vi-VN")} VND
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-4 border-t border-gray-200">
                <button
                  onClick={handleSubmitOrder}
                  disabled={checkoutCartMutation.isPending}
                  className="w-full bg-[#B8860B] text-white font-bold py-3 px-6 rounded-lg hover:bg-amber-700 transition-colors"
                >
                  {checkoutCartMutation.isPending
                    ? "Đang xử lý..."
                    : paymentMethod === "COD"
                      ? "Đặt hàng"
                      : "Thanh toán ngay"}
                </button>
                <button
                  onClick={() => navigate("/client/cart")}
                  className="w-full bg-gray-100 text-gray-700 font-semibold py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Quay lại giỏ hàng
                </button>
              </div>

              <div className="flex items-center justify-center gap-2 text-xs text-gray-500 mt-4">
                <img src={secureLockIcon} alt="Secure" className="w-4 h-4" />
                <span>Thông tin của bạn được bảo mật an toàn</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
