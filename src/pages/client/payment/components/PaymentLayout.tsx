import type { ReactNode } from "react";

type PaymentLayoutProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
};

const PaymentLayout = ({ title, subtitle, children }: PaymentLayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto w-full max-w-5xl px-4">
        <div className="rounded-2xl border border-amber-100 bg-white p-6 shadow-sm md:p-8">
          <header className="mb-6 border-b border-amber-100 pb-5">
            <h1 className="text-2xl font-bold text-[#5B4037]">{title}</h1>
            <p className="mt-1 text-sm text-gray-600">{subtitle}</p>
          </header>

          {children}
        </div>
      </div>
    </div>
  );
};

export default PaymentLayout;
