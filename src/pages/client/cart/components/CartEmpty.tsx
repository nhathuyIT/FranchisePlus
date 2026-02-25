import React from 'react';
import { Link } from 'react-router-dom';

const CartEmpty: React.FC = () => {
  return (
    <div className="text-center py-16">
      <div className="text-8xl mb-6">☕</div>
      <h3 className="text-2xl font-bold text-[#5B4037] mb-4">
        Giỏ hàng trống
      </h3>
      <p className="text-gray-600 mb-8 max-w-md mx-auto">
        Bạn chưa thêm sản phẩm nào vào giỏ hàng. 
        Hãy khám phá menu của chúng tôi và chọn những ly cà phê yêu thích!
      </p>
      <Link
        to="/client/menu"
        className="inline-block bg-[#5B4037] text-white px-8 py-3 rounded-lg font-semibold hover:bg-amber-800 transition-colors"
      >
        Xem Menu
      </Link>
    </div>
  );
};

export default CartEmpty;