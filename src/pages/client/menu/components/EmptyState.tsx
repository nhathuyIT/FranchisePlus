import { Coffee } from "lucide-react";

export const EmptyState = ({ message }: { message: string }) => (
  <div className="flex flex-col items-center justify-center py-20 text-stone-400">
    <Coffee className="h-16 w-16 mb-4 opacity-30" />
    <p className="font-serif text-lg italic">{message}</p>
  </div>
);
