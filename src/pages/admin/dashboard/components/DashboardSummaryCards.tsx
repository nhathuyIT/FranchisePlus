import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface DashboardSummaryCardItem {
  title: string;
  value: string;
  subtitle: string;
  badge: string;
  icon: LucideIcon;
  iconClassName?: string;
  badgeClassName?: string;
}

interface DashboardSummaryCardsProps {
  cards: DashboardSummaryCardItem[];
}

export const DashboardSummaryCards = ({
  cards,
}: DashboardSummaryCardsProps) => {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <article
            key={card.title}
            className="rounded-[28px] border border-[#EADFD3] bg-white p-6 shadow-[0_18px_40px_rgba(84,54,42,0.08)]"
          >
            <div className="flex items-start justify-between gap-3">
              <div
                className={cn(
                  "flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F4E8DA] text-[#4A2C23]",
                  card.iconClassName,
                )}
              >
                <Icon className="h-5 w-5" />
              </div>

              <span
                className={cn(
                  "rounded-full bg-[#F7E7B6] px-3 py-1 text-xs font-semibold text-[#7A4B00]",
                  card.badgeClassName,
                )}
              >
                {card.badge}
              </span>
            </div>

            <div className="mt-8">
              <p className="text-sm font-medium text-[#7B6252]">{card.title}</p>
              <p className="mt-2 text-3xl font-semibold tracking-tight text-[#261611]">
                {card.value}
              </p>
              <p className="mt-2 text-xs leading-5 text-[#8D7564]">
                {card.subtitle}
              </p>
            </div>
          </article>
        );
      })}
    </div>
  );
};
