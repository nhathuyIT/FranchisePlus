import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface OrderPageStateProps {
  title: string;
  description: string;
  icon: LucideIcon;
  tone?: "default" | "danger";
  primaryActionLabel: string;
  onPrimaryAction: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
}

export function OrderPageState({
  title,
  description,
  icon: Icon,
  tone = "default",
  primaryActionLabel,
  onPrimaryAction,
  secondaryActionLabel,
  onSecondaryAction,
}: OrderPageStateProps) {
  const isDanger = tone === "danger";

  return (
    <section
      className={cn(
        "rounded-[28px] border p-8 text-center shadow-[0_24px_60px_-48px_rgba(117,76,36,0.35)]",
        isDanger
          ? "border-[#F5C6CB] bg-[#FFF5F5]"
          : "border-[#E8DDD2] bg-white",
      )}
    >
      <div
        className={cn(
          "mx-auto flex h-16 w-16 items-center justify-center rounded-full",
          isDanger ? "bg-[#FDE2E4] text-[#C2410C]" : "bg-[#F6ECE1] text-[#A65A00]",
        )}
      >
        <Icon className="h-7 w-7" />
      </div>

      <h1 className="mt-5 text-2xl font-semibold text-[#3E2723]">{title}</h1>
      <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-[#6D4C41]">
        {description}
      </p>

      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Button
          type="button"
          onClick={onPrimaryAction}
          className="bg-[#C97B3D] text-white hover:bg-[#B5692F]"
        >
          {primaryActionLabel}
        </Button>
        {secondaryActionLabel && onSecondaryAction ? (
          <Button
            type="button"
            variant="outline"
            onClick={onSecondaryAction}
            className="border-[#D8C2AF] text-[#6D4C41] hover:bg-[#FFF8F1]"
          >
            {secondaryActionLabel}
          </Button>
        ) : null}
      </div>
    </section>
  );
}
