export const SectionDivider = ({
  icon: Icon,
  title,
  count,
}: {
  icon: React.ElementType;
  title: string;
  count: number;
}) => (
  <div className="flex items-center gap-3 mb-6">
    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-amber-100 text-amber-700 shadow-inner">
      <Icon className="h-5 w-5" />
    </div>
    <div>
      <h2 className="font-serif text-2xl font-bold text-stone-800">{title}</h2>
      <p className="text-sm text-stone-400">{count} sản phẩm</p>
    </div>
    <div className="flex-1 h-px bg-linear-to-r from-stone-200 to-transparent ml-4" />
  </div>
);
