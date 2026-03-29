import { Coffee } from "lucide-react";

export const EmptyState = ({ message }: { message: string }) => (
  <div className="flex flex-col items-center justify-center rounded-[1.75rem] border border-dashed border-[#D7CCC8] bg-[#FFFDF9] px-6 py-12 text-center text-[#8D6E63] sm:py-16">
    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#FAF8F5]">
      <Coffee className="h-8 w-8 opacity-60" />
    </div>
    <p className="mt-4 font-serif text-lg italic">{message}</p>
  </div>
);
