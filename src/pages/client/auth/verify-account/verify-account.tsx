import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Coffee, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ROUTER_URL } from "@/router/route.const";
import { useVerifyClientToken } from "@/hooks/client/useClient.hooks";

const VerifyAccount = () => {
  const { id: token } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const verifyMutation = useVerifyClientToken();
  const [verificationStatus, setVerificationStatus] = useState<
    "verifying" | "success" | "error"
  >("verifying");

  useEffect(() => {
    if (token) {
      // Automatically verify when component mounts
      verifyMutation.mutate(
        { token },
        {
          onSuccess: (data) => {
            if (data.success) {
              setVerificationStatus("success");
              setTimeout(() => {
                navigate("/");
              }, 3000);
            } else {
              setVerificationStatus("error");
            }
          },
          onError: () => {
            setVerificationStatus("error");
          },
        },
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100 p-4">
      {/* Background Decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 text-orange-900">
          <Coffee size={120} />
        </div>
        <div className="absolute bottom-20 right-20 text-orange-900">
          <Coffee size={150} />
        </div>
        <div className="absolute top-1/2 left-1/4 text-orange-900">
          <Coffee size={80} />
        </div>
      </div>

      <div className="w-full max-w-md relative">
        {/* Logo */}
        <div className="absolute -top-16 left-1/2 -translate-x-1/2">
          <div className="bg-gradient-to-br from-orange-600 to-orange-800 rounded-full p-6 shadow-2xl">
            <Coffee size={48} className="text-orange-50" strokeWidth={2.5} />
          </div>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 pt-16 border border-orange-200">
          <div className="text-center">
            {/* Verifying State */}
            {verificationStatus === "verifying" && (
              <>
                <div className="mb-6 flex justify-center">
                  <Loader2 className="text-orange-600 animate-spin" size={64} />
                </div>
                <h1 className="text-3xl font-bold text-orange-900 mb-4">
                  Verifying Your Account
                </h1>
                <p className="text-orange-700">
                  Please wait while we verify your email address...
                </p>
              </>
            )}

            {/* Success State */}
            {verificationStatus === "success" && (
              <>
                <div className="mb-6 flex justify-center">
                  <div className="bg-green-100 rounded-full p-4">
                    <CheckCircle className="text-green-600" size={64} />
                  </div>
                </div>
                <h1 className="text-3xl font-bold text-green-900 mb-4">
                  Account Verified!
                </h1>
                <p className="text-green-700 mb-6">
                  Your email has been successfully verified. You can now login
                  to your account.
                </p>
                <p className="text-sm text-orange-600 mb-6">
                  Redirecting to home page in 3 seconds...
                </p>
                <Button
                  onClick={() => navigate("/")}
                  className="w-full bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white font-semibold py-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  Go to Home
                </Button>
              </>
            )}

            {/* Error State */}
            {verificationStatus === "error" && (
              <>
                <div className="mb-6 flex justify-center">
                  <div className="bg-red-100 rounded-full p-4">
                    <XCircle className="text-red-600" size={64} />
                  </div>
                </div>
                <h1 className="text-3xl font-bold text-red-900 mb-4">
                  Verification Failed
                </h1>
                <p className="text-red-700 mb-6">
                  We couldn't verify your email. The link may be invalid or
                  expired.
                </p>
                <div className="space-y-3">
                  <Button
                    onClick={() => navigate(ROUTER_URL.CLIENT_ROUTER.REGISTER)}
                    className="w-full bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white font-semibold py-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    Register Again
                  </Button>
                  <Button
                    onClick={() => navigate(ROUTER_URL.CLIENT_ROUTER.LOGIN)}
                    variant="outline"
                    className="w-full border-orange-600 text-orange-600 hover:bg-orange-50 font-semibold py-6 rounded-lg"
                  >
                    Back to Login
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Bottom Decoration */}
        <div className="mt-8 text-center">
          <p className="text-sm text-orange-700 flex items-center justify-center gap-2">
            <Coffee size={16} />
            <span>FranchisePlus Coffee - Your Coffee, Your Way</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyAccount;
