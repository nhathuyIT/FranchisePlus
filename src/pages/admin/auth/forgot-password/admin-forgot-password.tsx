import { Coffee, KeyRound } from "lucide-react";
import { ForgotPasswordForm } from "./components/forgot-password-form";

function AdminForgotPassword() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 dark:from-stone-900 dark:via-amber-950 dark:to-stone-900 p-4">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 text-amber-900 dark:text-amber-100">
          <Coffee size={120} />
        </div>
        <div className="absolute bottom-20 right-20 text-amber-900 dark:text-amber-100">
          <Coffee size={150} />
        </div>
        <div className="absolute top-1/2 left-1/4 text-amber-900 dark:text-amber-100">
          <Coffee size={80} />
        </div>
      </div>

      <div className="w-full max-w-md relative">
        <div className="absolute -top-16 left-1/2 -translate-x-1/2">
          <div className="bg-gradient-to-br from-amber-600 to-amber-800 rounded-full p-6 shadow-2xl">
            <KeyRound size={48} className="text-amber-50" strokeWidth={2.5} />
          </div>
        </div>

        <div className="bg-white dark:bg-stone-800 rounded-2xl shadow-2xl p-8 pt-16 border border-amber-200 dark:border-amber-900">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-amber-900 dark:text-amber-50 mb-2">
              Forgot Password?
            </h1>
            <p className="text-sm text-amber-700 dark:text-amber-300">
              Enter your email and we'll send you a link to reset your password
            </p>
          </div>

          <ForgotPasswordForm />

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-xs text-amber-600 dark:text-amber-400">
              Need help? Contact IT Support
            </p>
          </div>
        </div>

        {/* Bottom Decoration */}
        <div className="mt-8 text-center">
          <p className="text-sm text-amber-700 dark:text-amber-300 flex items-center justify-center gap-2">
            <Coffee size={16} />
            <span>FranchisePlus Coffee Management System</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default AdminForgotPassword;
