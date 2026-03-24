export interface DashboardHighlightMetric {
  label: string;
  value: string;
}

interface DashboardHighlightCardProps {
  eyebrow: string;
  headline: string;
  description: string;
  metrics: DashboardHighlightMetric[];
}

export const DashboardHighlightCard = ({
  eyebrow,
  headline,
  description,
  metrics,
}: DashboardHighlightCardProps) => {
  return (
    <section className="relative overflow-hidden rounded-[34px] border border-[#552E1D]/20 bg-[linear-gradient(135deg,#29120E_0%,#5F2416_48%,#A0502E_100%)] p-8 text-white shadow-[0_32px_64px_rgba(62,39,35,0.24)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,213,126,0.28),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(0,0,0,0.4),transparent_36%)]" />
      <div className="absolute right-8 top-8 h-24 w-24 rounded-full border border-white/10" />
      <div className="absolute left-10 top-20 h-10 w-10 rounded-full bg-white/10 blur-sm" />
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-[linear-gradient(180deg,transparent_0%,rgba(0,0,0,0.26)_100%)]" />

      <div className="relative">
        <span className="inline-flex rounded-full bg-[#FFB703] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#4A2C23]">
          {eyebrow}
        </span>

        <h2 className="mt-6 max-w-2xl text-3xl font-semibold leading-tight sm:text-4xl">
          {headline}
        </h2>

        <p className="mt-4 max-w-2xl text-base leading-7 text-white/75">
          {description}
        </p>

        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          {metrics.map((metric) => (
            <div
              key={metric.label}
              className="rounded-[24px] bg-white/10 p-4 backdrop-blur-sm"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/55">
                {metric.label}
              </p>
              <p className="mt-2 text-2xl font-semibold">{metric.value}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
