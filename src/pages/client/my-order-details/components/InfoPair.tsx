import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface InfoPairProps {
  label: string;
  value?: ReactNode;
  icon?: LucideIcon;
  helperText?: string;
  className?: string;
  valueClassName?: string;
}

export function InfoPair({
  label,
  value,
  icon: Icon,
  helperText,
  className,
  valueClassName,
}: InfoPairProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-[#EDE2D7] bg-[#FFFCF9] p-4",
        className,
      )}
    >
      <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#9A7B67]">
        {Icon ? (
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#F6ECE1] text-[#A05A2C]">
            <Icon className="h-3.5 w-3.5" />
          </span>
        ) : null}
        <span>{label}</span>
      </div>
      <div
        className={cn(
          "mt-3 text-sm leading-6 text-[#3E2723]",
          valueClassName,
        )}
      >
        {value ?? "-"}
      </div>
      {helperText ? (
        <p className="mt-2 text-xs leading-5 text-[#8D6E63]">{helperText}</p>
      ) : null}
    </div>
  );
}
