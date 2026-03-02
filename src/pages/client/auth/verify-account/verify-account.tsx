import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Loader2,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  MailCheck,
} from "lucide-react";
import { ROUTER_URL } from "@/router/route.const";
import { useVerifyClientToken } from "@/hooks/client/useClient.hooks";

const VerifyAccount = () => {
  const { id: token } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const verifyMutation = useVerifyClientToken();

  // Trigger on mount
  useEffect(() => {
    if (token) {
      verifyMutation.mutate({ token });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  // Redirect to login after success
  useEffect(() => {
    if (!verifyMutation.isSuccess) return;
    const timer = setTimeout(() => {
      navigate(ROUTER_URL.CLIENT_ROUTER.LOGIN);
    }, 3000);
    return () => clearTimeout(timer);
  }, [verifyMutation.isSuccess, navigate]);

  const errorMessage =
    verifyMutation.error instanceof Error
      ? verifyMutation.error.message
      : "Token xác thực không hợp lệ hoặc đã hết hạn.";

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "var(--cf-primary)" }}
    >
      {/* Ambient glow */}
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 30%, rgba(221,184,146,0.12) 0%, transparent 70%)",
        }}
      />

      {/* Card */}
      <div
        className="relative w-full animate-[fadeInUp_0.5s_ease-out_both]"
        style={{ maxWidth: 460 }}
      >
        <div
          className="rounded-4xl p-10"
          style={{
            background: "rgba(255,255,255,0.08)",
            backdropFilter: "blur(32px)",
            WebkitBackdropFilter: "blur(32px)",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 8px 40px rgba(0,0,0,0.25)",
          }}
        >
          {/* Content — fixed min-height to prevent layout shift */}
          <div
            className="flex flex-col items-center justify-center gap-6"
            style={{ minHeight: 240 }}
          >
            {/* ── Loading ── */}
            {verifyMutation.isPending && (
              <div className="flex flex-col items-center gap-5 animate-[fadeIn_0.4s_ease-out_both]">
                <Loader2
                  className="w-16 h-16 animate-spin"
                  style={{ color: "var(--cf-accent-light)" }}
                  strokeWidth={1.5}
                />
                <div className="text-center space-y-2">
                  <h2 className="text-xl font-semibold text-white/90">
                    Đang xác thực
                  </h2>
                  <p className="text-sm text-white/50 leading-relaxed">
                    Vui lòng chờ trong giây lát…
                  </p>
                </div>
              </div>
            )}

            {/* ── Success ── */}
            {verifyMutation.isSuccess && (
              <div className="flex flex-col items-center gap-5 animate-[fadeIn_0.4s_ease-out_both]">
                <CheckCircle2
                  className="w-16 h-16 animate-[scaleIn_0.4s_ease-out_both]"
                  style={{ color: "#6BBF7B" }}
                  strokeWidth={1.5}
                />
                <div className="text-center space-y-2">
                  <h2 className="text-xl font-semibold text-white/90">
                    Xác thực thành công!
                  </h2>
                  <p className="text-sm text-white/50 leading-relaxed">
                    Email của bạn đã được xác thực.
                    <br />
                    Đang chuyển hướng đến trang đăng nhập…
                  </p>
                </div>
                {/* Progress bar */}
                <div
                  className="w-full max-w-50 h-1 rounded-full overflow-hidden"
                  style={{ background: "rgba(255,255,255,0.06)" }}
                >
                  <div
                    className="h-full rounded-full animate-[progressShrink_3s_linear_forwards]"
                    style={{ background: "var(--cf-accent-light)" }}
                  />
                </div>
              </div>
            )}

            {/* ── Error ── */}
            {(verifyMutation.isError || !token) &&
              !verifyMutation.isPending && (
                <div className="flex flex-col items-center gap-5 animate-[fadeIn_0.4s_ease-out_both]">
                  <XCircle
                    className="w-16 h-16 animate-[scaleIn_0.4s_ease-out_both]"
                    style={{ color: "#E06C6C" }}
                    strokeWidth={1.5}
                  />
                  <div className="text-center space-y-2">
                    <h2 className="text-xl font-semibold text-white/90">
                      Xác thực thất bại
                    </h2>
                    <p className="text-sm text-white/50 leading-relaxed">
                      {verifyMutation.isError
                        ? errorMessage
                        : "Token xác thực không hợp lệ."}
                    </p>
                  </div>
                  <button
                    onClick={() => navigate(ROUTER_URL.CLIENT_ROUTER.LOGIN)}
                    className="cursor-pointer mt-1 px-8 py-2.5 rounded-xl text-sm font-medium text-white transition-all duration-300 flex items-center gap-2"
                    style={{
                      background: "var(--cf-secondary)",
                      boxShadow: "0 0 0 0 rgba(176,137,104,0)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background =
                        "var(--cf-accent-light)";
                      e.currentTarget.style.boxShadow =
                        "0 0 20px rgba(176,137,104,0.3)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "var(--cf-secondary)";
                      e.currentTarget.style.boxShadow =
                        "0 0 0 0 rgba(176,137,104,0)";
                    }}
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Quay lại đăng nhập
                  </button>
                </div>
              )}
          </div>

          {/* Divider + Footer */}
          <div
            className="mt-8 pt-5"
            style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
          >
            <p className="text-center text-xs text-white/35 flex items-center justify-center gap-1.5">
              <MailCheck className="w-3.5 h-3.5" />
              Boutique Brews · Xác thực tài khoản
            </p>
          </div>
        </div>
      </div>

      {/* Keyframe animations */}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.6); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes progressShrink {
          from { width: 100%; }
          to   { width: 0%; }
        }
      `}</style>
    </div>
  );
};

export default VerifyAccount;
