import type { DashboardInsight } from "../dashboard.utils";

interface DashboardInsightsPanelProps {
  items: DashboardInsight[];
}

export const DashboardInsightsPanel = ({
  items,
}: DashboardInsightsPanelProps) => {
  return (
    <section className="rounded-[32px] border border-[#E9DCCB] bg-[#F6EEDC] p-6 shadow-[0_20px_40px_rgba(84,54,42,0.08)] sm:p-8">
      <h2 className="text-2xl font-semibold text-[#2E1A13]">
        Operational Notes
      </h2>
      <p className="mt-2 text-sm text-[#816755]">
        Actionable cues derived from the current live counts.
      </p>

      <div className="mt-6 space-y-4">
        {items.map((item) => (
          <article
            key={item.title}
            className="flex gap-4 rounded-[24px] bg-white/70 p-4"
          >
            <span
              className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: item.dotColor }}
            />

            <div>
              <p className="text-sm font-semibold text-[#2E1A13]">
                {item.title}
              </p>
              <p className="mt-1 text-base font-semibold text-[#5B2D1F]">
                {item.emphasis}
              </p>
              <p className="mt-2 text-sm leading-6 text-[#6F5646]">
                {item.description}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};
