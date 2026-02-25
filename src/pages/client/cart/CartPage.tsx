import React from "react";
import { useCart } from "./useCart";
import { Link, useNavigate } from "react-router-dom";
import { PRODUCTS_CLIENT } from "@/const/product-client.const";
import emptyCartIcon from "@/assets/icons/empty-cart.svg";
import coffeeCupIcon from "@/assets/icons/coffee-cup.svg";

const CartPage: React.FC = () => {
  const { cart, updateQuantity, removeItem, subtotal, totalAmount, itemCount } =
    useCart();

  const navigate = useNavigate();

  // Helper function to get product image
  const getProductImage = (productId: number): string => {
    const product = PRODUCTS_CLIENT.find((p) => p.id === productId);
    return product?.imageUrl || "";
  };

  const handleIncrease = (productId: number) => {
    const item = cart.items.find(
      (item) => item.productFranchiseId === productId,
    );
    if (item) {
      updateQuantity(productId, item.quantity + 1);
    }
  };

  const handleDecrease = (productId: number) => {
    const item = cart.items.find(
      (item) => item.productFranchiseId === productId,
    );
    if (item && item.quantity > 1) {
      updateQuantity(productId, item.quantity - 1);
    }
  };

  const handleRemove = (productId: number) => {
    removeItem(productId);
  };

  const handleCheckout = () => {
    navigate("/client/payment");
  };

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
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Bạn chưa thêm sản phẩm nào vào giỏ hàng. Hãy khám phá menu của
              chúng tôi và chọn những ly cà phê yêu thích!
            </p>
            <Link
              to="/client/menu"
              className="inline-block bg-[#5B4037] text-white px-8 py-3 rounded-lg font-semibold hover:bg-amber-800 transition-colors"
            >
              Xem Menu
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#5B4037] mb-2">
            Shopping Cart ({itemCount.toLocaleString("vi-VN")})
          </h1>
        </div>

        {/* Cart Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
          <table className="w-full">
            <thead className="bg-[#B8860B] text-white">
              <tr>
                <th className="px-6 py-4 text-left font-medium">Image</th>
                <th className="px-6 py-4 text-left font-medium">
                  Product Name
                </th>
                <th className="px-6 py-4 text-left font-medium">
                  Product Line
                </th>
                <th className="px-6 py-4 text-center font-medium">Quantity</th>
                <th className="px-6 py-4 text-right font-medium">Unit Price</th>
                <th className="px-6 py-4 text-right font-medium">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {cart.items.map((item) => (
                <tr
                  key={item.productFranchiseId}
                  className="hover:bg-gray-50"
                >
                  {/* Product Image */}
                  <td className="px-6 py-4">
                    <div className="w-20 h-20 bg-amber-50 rounded-lg border border-gray-200 overflow-hidden">
                      <img
                        src={getProductImage(item.productFranchiseId)}
                        alt={item.productNameSnapshot}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = coffeeCupIcon;
                          target.style.objectFit = "contain";
                          target.style.padding = "8px";
                        }}
                      />
                    </div>
                  </td>

                  {/* Product Name */}
                  <td className="px-6 py-4">
                    <div className="font-semibold text-gray-900">
                      {item.productNameSnapshot}
                    </div>
                  </td>

                  {/* Product Line */}
                  <td className="px-6 py-4"></td>

                  {/* Quantity Controls */}
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center">
                      <div className="flex items-center bg-[#B8860B] rounded">
                        <button
                          onClick={() =>
                            handleDecrease(item.productFranchiseId)
                          }
                          className="w-8 h-8 text-white hover:bg-amber-700 transition-colors flex items-center justify-center"
                        >
                          −
                        </button>
                        <span className="w-12 h-8 bg-white text-center leading-8 font-medium text-gray-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            handleIncrease(item.productFranchiseId)
                          }
                          className="w-8 h-8 text-white hover:bg-amber-700 transition-colors flex items-center justify-center"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => handleRemove(item.productFranchiseId)}
                        className="ml-3 w-8 h-8 bg-[#B8860B] text-white rounded hover:bg-red-600 transition-colors flex items-center justify-center"
                        title="Xóa sản phẩm"
                      >
                        ×
                      </button>
                    </div>
                  </td>

                  {/* Unit Price */}
                  <td className="px-8 py-4 text-right font-semibold text-gray-900">
                    {(item.priceSnapshot || 0).toLocaleString("vi-VN")} VND
                  </td>

                  {/* Total Price */}
                  <td className="px-8 py-4 text-right font-bold text-[#B8860B] text-lg">
                    {(item.lineTotal || 0).toLocaleString("vi-VN")} VND
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Total Summary */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex justify-end items-center">
            <div className="space-y-2">
              <div className="flex justify-between min-w-[300px]">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium">
                  {subtotal.toLocaleString("vi-VN")} VND
                </span>
              </div>
              <div className="flex justify-between min-w-[300px] text-lg font-bold">
                <span className="text-gray-900">Total:</span>
                <span className="text-gray-900">
                  {totalAmount.toLocaleString("vi-VN")} VND
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between gap-4">
          <Link
            to="/client/menu"
            className="bg-[#B8860B] text-white px-8 py-3 rounded font-semibold hover:bg-amber-700 transition-colors"
          >
            Continue Shopping
          </Link>
          <button
            onClick={handleCheckout}
            className="bg-[#B8860B] text-white px-8 py-3 rounded font-semibold hover:bg-amber-700 transition-colors"
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
