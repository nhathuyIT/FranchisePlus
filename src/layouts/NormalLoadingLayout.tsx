import { useLoadingStore } from "@/stores/loading.store";

type LoadingOverlayProps = {
  forceShow?: boolean;
};

export default function LoadingOverlay({
  forceShow = false,
}: LoadingOverlayProps) {
  const isLoading = useLoadingStore((state) => state.loading);
  const visible = forceShow || isLoading;

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/25 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-3">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-orange-100 border-t-orange-500 border-r-orange-400 shadow-lg" />
      </div>
    </div>
  );
}