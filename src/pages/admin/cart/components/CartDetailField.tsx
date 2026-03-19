interface CartDetailFieldProps {
  label: string;
  value: string;
}

export const CartDetailField = ({ label, value }: CartDetailFieldProps) => (
  <div className="rounded-xl border border-[#E8DFD6] bg-white p-4">
    <p className="text-xs uppercase tracking-wide text-[#8D6E63]">{label}</p>
    <p className="mt-2 text-sm font-medium text-[#3E2723]">{value}</p>
  </div>
);
