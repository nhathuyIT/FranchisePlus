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
    <div className="fixed inset-0 z-[9999] bg-black/20 backdrop-blur-sm" />
  );
}
