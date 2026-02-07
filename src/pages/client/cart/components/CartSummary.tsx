import React from 'react';

interface CartSummaryProps {
  subtotal: number;
  totalAmount: number;
  onCheckout: () => void;
}

const CartSummary: React.FC<CartSummaryProps> = ({
  subtotal,
  totalAmount,
  onCheckout,
}) => {
  return (
    <div className="bg-[#5B4037] text-white rounded-lg p-6 mt-6 shadow-lg">
      <h3 className="text-xl font-bold mb-4">Order Summary</h3>
      
      {/* Subtotal */}
      <div className="flex justify-between items-center mb-3">
        <span className="text-amber-100">Subtotal:</span>
        <span className="font-medium">
          {subtotal.toLocaleString('vi-VN')}₫
        </span>
      </div>
      
      {/* Total */}
      <div className="flex justify-between items-center mb-6 text-lg font-bold border-t border-amber-200 pt-3">
        <span>Total:</span>
        <span className="text-amber-200">
          {totalAmount.toLocaleString('vi-VN')}₫
        </span>
      </div>
      
      {/* Checkout Button */}
      <button
        onClick={onCheckout}
        className="w-full bg-white text-[#5B4037] font-bold py-3 px-6 rounded-lg hover:bg-amber-50 transition-colors text-lg"
      >
        Checkout
      </button>
      
      <p className="text-amber-100 text-xs text-center mt-2">
        *Safe and secure payment
      </p>
    </div>
  );
};

export default CartSummary;