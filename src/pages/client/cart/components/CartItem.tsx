import React from 'react';
import type { CartItem } from '../useCart';

interface CartItemProps {
  item: CartItem;
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove: () => void;
}

const CartItemComponent: React.FC<CartItemProps> = ({ 
  item, 
  onIncrease, 
  onDecrease, 
  onRemove 
}) => {
  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-200 hover:bg-amber-50 transition-colors">
      {/* Product Info */}
      <div className="flex-1">
        <h3 className="font-semibold text-[#5B4037] text-lg">
          {item.product_name_snapshot}
        </h3>
        <p className="text-gray-600 text-sm">
          {item.price_snapshot.toLocaleString('vi-VN')}₫ × {item.quantity}
        </p>
      </div>

      {/* Quantity Controls */}
      <div className="flex items-center mx-6">
        <button
          onClick={onDecrease}
          className="w-8 h-8 rounded-full border-2 border-[#5B4037] text-[#5B4037] hover:bg-[#5B4037] hover:text-white transition-all flex items-center justify-center"
        >
          −
        </button>
        <span className="mx-4 font-medium text-lg min-w-[2rem] text-center">
          {item.quantity}
        </span>
        <button
          onClick={onIncrease}
          className="w-8 h-8 rounded-full border-2 border-[#5B4037] text-[#5B4037] hover:bg-[#5B4037] hover:text-white transition-all flex items-center justify-center"
        >
          +
        </button>
      </div>

      {/* Price & Remove */}
      <div className="text-right">
        <p className="font-bold text-[#5B4037] text-lg">
          {item.line_total.toLocaleString('vi-VN')}₫
        </p>
        <button
          onClick={onRemove}
          className="text-red-500 hover:text-red-700 text-sm mt-1 underline"
        >
          Remove
        </button>
      </div>
    </div>
  );
};

export default CartItemComponent;