import { Coffee, KeyRound } from "lucide-react";
import { ForgotPasswordForm } from "./components/forgot-password-form";

function ClientForgotPassword() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100 dark:from-stone-900 dark:via-orange-950 dark:to-stone-900 p-4">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 text-orange-900 dark:text-orange-100">
          <Coffee size={120} />
        </div>
        <div className="absolute bottom-20 right-20 text-orange-900 dark:text-orange-100">
          <Coffee size={150} />
        </div>
        <div className="absolute top-1/2 left-1/4 text-orange-900 dark:text-orange-100">
          <Coffee size={80} />
        </div>
      </div>

      <div className="w-full max-w-md relative">
        <div className="absolute -top-16 left-1/2 -translate-x-1/2">
          <div className="bg-gradient-to-br from-orange-600 to-orange-800 rounded-full p-6 shadow-2xl">
            <KeyRound size={48} className="text-orange-50" strokeWidth={2.5} />
          </div>
        </div>

        <div className="bg-white dark:bg-stone-800 rounded-2xl shadow-2xl p-8 pt-16 border border-orange-200 dark:border-orange-900">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-orange-900 dark:text-orange-50 mb-2">
              Forgot Password?
            </h1>
            <p className="text-sm text-orange-700 dark:text-orange-300">
              Enter your email and we'll send you a link to reset your password
            </p>
          </div>

          <ForgotPasswordForm />

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-xs text-orange-600 dark:text-orange-400">
              Need help? Contact Customer Support
            </p>
          </div>
        </div>

        {/* Bottom Decoration */}
        <div className="mt-8 text-center">
          <p className="text-sm text-orange-700 dark:text-orange-300 flex items-center justify-center gap-2">
            <Coffee size={16} />
            <span>FranchisePlus Coffee - Your Coffee, Your Way</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default ClientForgotPassword;
