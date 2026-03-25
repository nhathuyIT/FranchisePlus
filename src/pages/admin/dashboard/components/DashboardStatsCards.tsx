import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface DashboardStatCardItem {
  title: string;
  value: string;
  caption: string;
  icon: LucideIcon;
  iconClassName?: string;
}

interface DashboardStatsCardsProps {
  stats: DashboardStatCardItem[];
}

export const DashboardStatsCards = ({ stats }: DashboardStatsCardsProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <article
            key={stat.title}
            className="rounded-[28px] border border-[#EEE2D4] bg-[#F7EFDE] p-5 shadow-[0_16px_36px_rgba(84,54,42,0.06)]"
          >
            <div className="flex items-center gap-4">
              <div
                className={cn(
                  "flex h-14 w-14 items-center justify-center rounded-full bg-white text-[#4A2C23]",
                  stat.iconClassName,
                )}
              >
                <Icon className="h-5 w-5" />
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#8D7564]">
                  {stat.title}
                </p>
                <p className="mt-2 text-3xl font-semibold text-[#261611]">
                  {stat.value}
                </p>
                <p className="mt-1 text-xs text-[#8D7564]">{stat.caption}</p>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
};
