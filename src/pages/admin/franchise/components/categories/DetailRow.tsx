import type { ReactNode } from "react";

export const DetailRow = ({
  label,
  value,
  mono,
}: {
  label: string;
  value: ReactNode;
  mono?: boolean;
}) => (
  <div className="flex justify-between items-start py-2 border-b border-[#E8DFD6]/50 last:border-0">
    <span className="text-[#5D4037]/70 font-medium w-36 shrink-0">{label}</span>
    <span
      className={`text-[#3E2723] text-right ${mono ? "font-mono text-xs break-all" : ""}`}
    >
      {value}
    </span>
  </div>
);
