import { useLoadingStore } from "@/stores/loading.store";

type LoadingLayoutProps = {
  forceVisible?: boolean;
  message?: string;
  mode?: "fullscreen" | "inline";
};

const steamDelays = ["0s", "0.4s", "0.8s"];
const dotDelays = ["0s", "0.18s", "0.36s"];

export default function LoadingLayout({
  forceVisible = false,
  message = "Loading",
  mode = "fullscreen",
}: LoadingLayoutProps) {
  const loading = useLoadingStore((state) => state.loading);
  const isVisible = forceVisible || loading;
  const isInline = mode === "inline";

  if (!isVisible) {
    return null;
  }

  return (
    <>
      <style>{`
        @keyframes loading-cup-float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }

        @keyframes loading-steam-rise {
          0% {
            opacity: 0;
            transform: translateY(18px) scaleX(0.9);
          }
          20% {
            opacity: 0.7;
          }
          100% {
            opacity: 0;
            transform: translateY(-28px) scaleX(1.2);
          }
        }

        @keyframes loading-liquid-sway {
          0%, 100% {
            transform: translateX(-2%) translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateX(2%) translateY(-2px) rotate(-1deg);
          }
        }

        @keyframes loading-liquid-sway-alt {
          0%, 100% {
            transform: translateX(2%) translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateX(-2%) translateY(2px) rotate(1deg);
          }
        }

        @keyframes loading-shadow-breathe {
          0%, 100% {
            opacity: 0.28;
            transform: translateX(-50%) scaleX(0.92);
          }
          50% {
            opacity: 0.42;
            transform: translateX(-50%) scaleX(1);
          }
        }

        @keyframes loading-dot-pop {
          0%, 80%, 100% {
            opacity: 0.22;
            transform: translateY(0px) scale(0.8);
          }
          40% {
            opacity: 1;
            transform: translateY(-3px) scale(1);
          }
        }
      `}</style>

      <div
        className={
          isInline
            ? "relative isolate overflow-hidden rounded-[1.5rem] bg-transparent backdrop-blur-md"
            : "fixed inset-0 z-[80] overflow-hidden bg-transparent backdrop-blur-md"
        }
      >
        <div
          className={
            isInline
              ? "relative flex min-h-[22rem] items-center justify-center px-6 py-8"
              : "relative flex min-h-screen items-center justify-center px-6"
          }
        >
          <div
            className="relative flex flex-col items-center"
            role="status"
            aria-live="polite"
          >
            <div
              className={
                isInline
                  ? "relative mb-5 h-36 w-36"
                  : "relative mb-6 h-44 w-44"
              }
              style={{ animation: "loading-cup-float 4s ease-in-out infinite" }}
            >
              {steamDelays.map((delay, index) => (
                <span
                  key={delay}
                  className={
                    isInline
                      ? "absolute top-2 h-12 w-3 rounded-full bg-linear-to-t from-transparent via-[#8f5a2b]/35 to-transparent blur-[1px]"
                      : "absolute top-2 h-14 w-3.5 rounded-full bg-linear-to-t from-transparent via-[#8f5a2b]/35 to-transparent blur-[1px]"
                  }
                  style={{
                    left: `${34 + index * 18}%`,
                    animation: `loading-steam-rise 2.8s ease-out ${delay} infinite`,
                  }}
                />
              ))}

              <div
                className={
                  isInline
                    ? "absolute bottom-8 left-1/2 h-24 w-28 -translate-x-1/2 overflow-hidden rounded-t-[1.4rem] rounded-b-[2.4rem] border-[3px] border-[#4b2409] bg-white/20 shadow-[0_14px_32px_rgba(83,46,18,0.14)]"
                    : "absolute bottom-8 left-1/2 h-28 w-32 -translate-x-1/2 overflow-hidden rounded-t-[1.6rem] rounded-b-[2.8rem] border-[4px] border-[#4b2409] bg-white/20 shadow-[0_16px_34px_rgba(83,46,18,0.16)]"
                }
              >
                <div className="absolute inset-x-[-10%] bottom-0 h-[48%] rounded-t-[45%] bg-[#6b3a12]" />
                <div
                  className="absolute inset-x-[-8%] bottom-[38%] h-6 rounded-[48%] bg-[#9e6337]/90"
                  style={{
                    animation:
                      "loading-liquid-sway 2.7s ease-in-out infinite",
                  }}
                />
                <div
                  className="absolute inset-x-[-12%] bottom-[44%] h-4 rounded-[50%] bg-[#edd7b2]/90"
                  style={{
                    animation:
                      "loading-liquid-sway-alt 3.4s ease-in-out infinite",
                  }}
                />
                <div className="absolute inset-x-0 top-0 h-16 bg-linear-to-b from-white/25 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 h-10 bg-linear-to-t from-[#4e280b]/30 to-transparent" />
              </div>

              <div
                className={
                  isInline
                    ? "absolute bottom-7 left-1/2 h-[4px] w-[9.5rem] -translate-x-1/2 rounded-full bg-[#4b2409]"
                    : "absolute bottom-7 left-1/2 h-[5px] w-[11rem] -translate-x-1/2 rounded-full bg-[#4b2409]"
                }
              />
              <div
                className={
                  isInline
                    ? "absolute bottom-1 left-1/2 h-3 w-24 rounded-full bg-[#77461d]/22 blur-md"
                    : "absolute bottom-1 left-1/2 h-4 w-28 rounded-full bg-[#77461d]/22 blur-md"
                }
                style={{
                  animation:
                    "loading-shadow-breathe 3.4s ease-in-out infinite",
                }}
              />
            </div>

            <div className="flex items-end gap-3 text-[#4b2409]">
              <h1
                className={
                  isInline
                    ? "font-coffee text-3xl font-semibold tracking-tight sm:text-4xl"
                    : "font-coffee text-4xl font-semibold tracking-tight sm:text-5xl"
                }
              >
                {message}
              </h1>
              <div className="mb-1.5 flex items-center gap-2">
                {dotDelays.map((delay) => (
                  <span
                    key={delay}
                    className={isInline ? "h-3 w-3 rounded-full bg-[#4b2409]" : "h-3.5 w-3.5 rounded-full bg-[#4b2409]"}
                    style={{
                      animation: `loading-dot-pop 1s ease-in-out ${delay} infinite`,
                    }}
                  />
                ))}
              </div>
            </div>

            <p
              className={
                isInline
                  ? "mt-3 text-center text-[10px] font-medium uppercase tracking-[0.34em] text-[#7b5c32]/80 sm:text-[11px]"
                  : "mt-3 text-center text-[11px] font-medium uppercase tracking-[0.38em] text-[#7b5c32]/80 sm:text-xs"
              }
            >
              Brewing your workspace
            </p>

            <span className="sr-only">{message}</span>
          </div>
        </div>
      </div>
    </>
  );
}
