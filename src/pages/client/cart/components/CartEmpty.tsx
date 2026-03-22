import React from "react";
import { Link } from "react-router-dom";
import emptyCartIcon from "@/assets/icons/empty-cart.svg";

const CartEmpty: React.FC = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[linear-gradient(180deg,#f8f1e9_0%,#f4ebe2_100%)] px-4 py-16">
      <div className="absolute left-[-4rem] top-16 h-72 w-72 rounded-full bg-[#efd7c2]/55 blur-3xl" />
      <div className="absolute right-[-5rem] top-24 h-80 w-80 rounded-full bg-[#f5e7db]/70 blur-3xl" />

      <div className="relative mx-auto max-w-4xl overflow-hidden rounded-[2rem] border border-[#eadbcd] bg-[rgba(255,252,247,0.88)] px-6 py-14 text-center shadow-[0_28px_70px_rgba(63,41,33,0.1)] backdrop-blur-md">
        <div className="absolute inset-x-0 top-0 h-24 bg-[linear-gradient(180deg,rgba(255,255,255,0.7)_0%,rgba(255,255,255,0)_100%)]" />
        <img
          src={emptyCartIcon}
          alt="Empty cart"
          className="relative mx-auto h-32 w-32 opacity-90"
        />
        <h1 className="mt-6 font-coffee text-4xl text-[#3f2921] sm:text-5xl">
          Your cart is empty
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#7d6458] sm:text-[15px]">
          Add your favorite items to build a cleaner cart, keep track of each
          store, and check out faster.
        </p>
        <Link
          to="/client/menu"
          className="mt-8 inline-flex items-center justify-center rounded-full bg-[linear-gradient(135deg,#b76843_0%,#8f4a2e_100%)] px-8 py-3.5 text-sm font-semibold text-white shadow-[0_18px_30px_rgba(183,104,67,0.28)] transition-all hover:-translate-y-0.5 hover:opacity-95"
        >
          Browse menu
        </Link>
      </div>
    </div>
  );
};

export default CartEmpty;
