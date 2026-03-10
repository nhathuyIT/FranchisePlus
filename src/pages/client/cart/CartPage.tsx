import React from "react";
import { useCart } from "./useCart";
import { Link, useNavigate } from "react-router-dom";
import emptyCartIcon from "@/assets/icons/empty-cart.svg";
import coffeeCupIcon from "@/assets/icons/coffee-cup.svg";
import { ShoppingCart, Star, Trash2, ChevronLeft, CreditCard, Coffee } from "lucide-react";

const CartPage: React.FC = () => {
  const { cart, updateQuantity, removeItem, totalAmount, itemCount } =
    useCart();

  const navigate = useNavigate();

  const handleIncrease = (productId: string | number) => {
    const item = cart.items.find((i) => i.productFranchiseId === productId);
    if (item) updateQuantity(productId, item.quantity + 1);
  };

  const handleDecrease = (productId: string | number) => {
    const item = cart.items.find((i) => i.productFranchiseId === productId);
    if (item && item.quantity > 1) updateQuantity(productId, item.quantity - 1);
  };

  const handleRemove = (productId: string | number) => removeItem(productId);

  const handleCheckout = () => navigate("/client/payment");

  /* ── Decorative SVG pattern (reused from menu/home) ───────────────────── */
  const vintageBgStyle = {
    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
  };

  /* ─────────────────────────── EMPTY STATE ──────────────────────────────── */
  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-[#FAF7F2]">
        {/* Hero banner */}
        <section className="relative bg-linear-to-br from-stone-900 via-stone-800 to-amber-900 pt-28 pb-16">
          <div className="absolute inset-0 opacity-[0.04]" style={vintageBgStyle} />
          <div className="container mx-auto px-4 text-center relative z-10">
            <div className="flex items-center justify-center gap-4 mb-5">
              <div className="h-px w-16 bg-linear-to-r from-transparent to-amber-400/60" />
              <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
              <div className="h-px w-16 bg-linear-to-l from-transparent to-amber-400/60" />
            </div>
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-white tracking-wide drop-shadow-lg">
              Your Cart
            </h1>
            <p className="mt-3 text-amber-200/80 text-base font-light tracking-wider">
              The finest selections, curated just for you
            </p>
          </div>
        </section>

        <div className="container mx-auto px-4 py-24 text-center">
          {/* Decorative corner accents */}
          <div className="relative inline-block">
            <div className="absolute -top-4 -left-4 w-8 h-8 border-l-2 border-t-2 border-[#C4A77D]/50" />
            <div className="absolute -top-4 -right-4 w-8 h-8 border-r-2 border-t-2 border-[#C4A77D]/50" />
            <div className="absolute -bottom-4 -left-4 w-8 h-8 border-l-2 border-b-2 border-[#C4A77D]/50" />
            <div className="absolute -bottom-4 -right-4 w-8 h-8 border-r-2 border-b-2 border-[#C4A77D]/50" />
            <div className="bg-white rounded-sm shadow-lg border border-[#E8DFD6] px-16 py-14">
              <div className="mb-6 flex justify-center">
                <img src={emptyCartIcon} alt="Empty cart" className="w-28 h-28 opacity-60" />
              </div>
              <span className="inline-block text-[#8B7355] tracking-[0.35em] uppercase text-xs font-medium mb-3">
                Nothing Here Yet
              </span>
              <h3 className="font-serif text-3xl font-bold text-[#3E2723] mb-4">
                Giỏ hàng trống
              </h3>
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="w-10 h-px bg-[#C4A77D]/50" />
                <div className="w-1.5 h-1.5 rotate-45 border border-[#C4A77D]/50" />
                <div className="w-10 h-px bg-[#C4A77D]/50" />
              </div>
              <p className="text-[#6D4C41]/70 mb-10 max-w-sm mx-auto leading-relaxed">
                Bạn chưa thêm sản phẩm nào. Hãy khám phá menu và chọn những ly cà phê yêu thích!
              </p>
              <Link
                to="/menu"
                className="inline-flex items-center gap-2 bg-[#3E2723] text-white px-8 py-3 font-serif
                           font-semibold hover:bg-[#6D4C41] transition-colors duration-300 tracking-wide"
              >
                <Coffee className="w-4 h-4" />
                Khám phá Menu
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ─────────────────────────── CART WITH ITEMS ──────────────────────────── */
  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      {/* ── Hero Banner ─────────────────────────────────────────────────── */}
      <section className="relative bg-linear-to-br from-stone-900 via-stone-800 to-amber-900 pt-28 pb-16">
        <div className="absolute inset-0 opacity-[0.04]" style={vintageBgStyle} />
        {/* Corner accents */}
        <div className="absolute top-8 left-8 w-16 h-16 border-l border-t border-amber-400/20" />
        <div className="absolute top-8 right-8 w-16 h-16 border-r border-t border-amber-400/20" />

        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="flex items-center justify-center gap-4 mb-5">
            <div className="h-px w-16 bg-linear-to-r from-transparent to-amber-400/60" />
            <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
            <div className="h-px w-16 bg-linear-to-l from-transparent to-amber-400/60" />
          </div>
          <div className="flex items-center justify-center gap-3 mb-2">
            <ShoppingCart className="w-8 h-8 text-amber-300" />
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-white tracking-wide drop-shadow-lg">
              Your Cart
            </h1>
          </div>
          <p className="mt-3 text-amber-200/80 text-base font-light tracking-wider">
            {itemCount} {itemCount === 1 ? "item" : "items"} selected
          </p>
        </div>
      </section>

      {/* ── Main Content ─────────────────────────────────────────────────── */}
      <div className="container mx-auto px-4 py-14">
        <div className="flex flex-col lg:flex-row gap-10 items-start">

          {/* ── Cart Items Table ────────────────────────────────────────── */}
          <div className="flex-1 min-w-0">
            {/* Section label */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-[#8B7355] tracking-[0.35em] uppercase text-xs font-medium">
                Order Details
              </span>
              <div className="flex-1 h-px bg-[#C4A77D]/30" />
            </div>

            <div className="bg-white border border-[#E8DFD6] shadow-sm overflow-hidden">
              {/* Table header */}
              <div className="hidden md:grid grid-cols-[80px_1fr_140px_120px_40px] gap-4 px-6 py-4
                              bg-[#3E2723] text-amber-100/90 text-xs tracking-[0.2em] uppercase font-medium">
                <div></div>
                <div>Sản phẩm</div>
                <div className="text-center">Số lượng</div>
                <div className="text-right">Thành tiền</div>
                <div></div>
              </div>

              {/* Items */}
              <div className="divide-y divide-[#E8DFD6]">
                {cart.items.map((item) => (
                  <div
                    key={item.id}
                    className="group grid grid-cols-[80px_1fr] md:grid-cols-[80px_1fr_140px_120px_40px]
                               gap-4 px-6 py-5 items-center hover:bg-[#FAF7F2] transition-colors duration-200"
                  >
                    {/* Image */}
                    <div className="w-[72px] h-[72px] bg-amber-50 border border-[#E8DFD6] overflow-hidden flex-shrink-0">
                      <img
                        src={item.imageUrl || coffeeCupIcon}
                        alt={item.productNameSnapshot}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const t = e.target as HTMLImageElement;
                          t.src = coffeeCupIcon;
                          t.style.objectFit = "contain";
                          t.style.padding = "10px";
                        }}
                      />
                    </div>

                    {/* Name + unit price */}
                    <div>
                      <p className="font-serif font-semibold text-[#3E2723] leading-snug">
                        {item.productNameSnapshot}
                      </p>
                      <p className="text-sm text-[#8B7355] mt-1">
                        {(item.priceSnapshot || 0).toLocaleString("vi-VN")}₫ / ly
                      </p>
                    </div>

                    {/* Quantity stepper */}
                    <div className="flex items-center justify-center md:justify-center gap-0">
                      <button
                        onClick={() => handleDecrease(item.productFranchiseId)}
                        className="w-8 h-8 border border-[#C4A77D] text-[#6D4C41] hover:bg-[#3E2723]
                                   hover:text-white hover:border-[#3E2723] transition-colors duration-200
                                   flex items-center justify-center text-lg leading-none"
                      >
                        −
                      </button>
                      <span className="w-10 h-8 border-t border-b border-[#C4A77D] flex items-center
                                       justify-center font-serif font-bold text-[#3E2723] text-sm">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleIncrease(item.productFranchiseId)}
                        className="w-8 h-8 border border-[#C4A77D] text-[#6D4C41] hover:bg-[#3E2723]
                                   hover:text-white hover:border-[#3E2723] transition-colors duration-200
                                   flex items-center justify-center text-lg leading-none"
                      >
                        +
                      </button>
                    </div>

                    {/* Line total */}
                    <div className="text-right font-serif font-bold text-[#3E2723] hidden md:block">
                      {(item.lineTotal || 0).toLocaleString("vi-VN")}₫
                    </div>

                    {/* Remove */}
                    <div className="flex justify-center hidden md:flex">
                      <button
                        onClick={() => handleRemove(item.productFranchiseId)}
                        title="Xóa sản phẩm"
                        className="w-8 h-8 text-[#C4A77D] hover:text-red-600 transition-colors duration-200
                                   flex items-center justify-center"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Mobile: total + remove row */}
                    <div className="col-span-2 flex justify-between items-center md:hidden pt-1">
                      <span className="font-serif font-bold text-[#3E2723]">
                        {(item.lineTotal || 0).toLocaleString("vi-VN")}₫
                      </span>
                      <button
                        onClick={() => handleRemove(item.productFranchiseId)}
                        className="text-[#C4A77D] hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Continue shopping */}
            <div className="mt-6">
              <Link
                to="/menu"
                className="inline-flex items-center gap-2 text-[#6D4C41] hover:text-[#3E2723]
                           text-sm font-medium tracking-wide transition-colors duration-200 group"
              >
                <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
                Tiếp tục mua hàng
              </Link>
            </div>
          </div>

          {/* ── Order Summary Sidebar ───────────────────────────────────── */}
          <div className="w-full lg:w-80 flex-shrink-0">
            <div className="flex items-center gap-4 mb-6">
              <span className="text-[#8B7355] tracking-[0.35em] uppercase text-xs font-medium">
                Summary
              </span>
              <div className="flex-1 h-px bg-[#C4A77D]/30" />
            </div>

            <div className="relative bg-white border border-[#E8DFD6] shadow-sm p-7">
              {/* Corner accents */}
              <div className="absolute top-0 left-0 w-6 h-6 border-l-2 border-t-2 border-[#C4A77D]/60" />
              <div className="absolute top-0 right-0 w-6 h-6 border-r-2 border-t-2 border-[#C4A77D]/60" />
              <div className="absolute bottom-0 left-0 w-6 h-6 border-l-2 border-b-2 border-[#C4A77D]/60" />
              <div className="absolute bottom-0 right-0 w-6 h-6 border-r-2 border-b-2 border-[#C4A77D]/60" />

              {/* Total */}
              <div className="flex justify-between items-center mb-7">
                <span className="font-serif font-bold text-[#3E2723] text-lg">Tổng cộng</span>
                <span className="font-serif font-bold text-[#3E2723] text-xl">
                  {totalAmount.toLocaleString("vi-VN")}₫
                </span>
              </div>

              {/* Checkout button */}
              <button
                onClick={handleCheckout}
                className="w-full flex items-center justify-center gap-2 bg-[#3E2723] text-white
                           py-3.5 font-serif font-semibold tracking-wide hover:bg-[#6D4C41]
                           transition-colors duration-300 text-base"
              >
                <CreditCard className="w-4 h-4" />
                Thanh toán
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
