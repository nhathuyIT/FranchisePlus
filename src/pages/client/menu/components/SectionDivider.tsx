export const SectionDivider = ({
  icon: Icon,
  title,
  count,
}: {
  icon: React.ElementType;
  title: string;
  count: number;
}) => (
  <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
    <div className="flex items-center gap-3">
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-amber-100 text-amber-700 shadow-inner">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <h2 className="font-serif text-2xl font-bold text-stone-800">
          {title}
        </h2>
        <p className="text-sm text-stone-400">{count} products</p>
      </div>
    </div>

    <div className="flex items-center gap-3 sm:ml-auto sm:min-w-[12rem] sm:flex-1">
      <span className="inline-flex rounded-full border border-[#E8DFD6] bg-white px-3 py-1 text-xs font-medium text-[#8D6E63]">
        Fresh selection
      </span>
      <div className="h-px flex-1 bg-linear-to-r from-stone-200 to-transparent" />
    </div>
  </div>
);
