import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Coffee,
  Lock,
  Mail,
  AlertCircle,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ClientLoginZod,
  type ClientLoginZodType,
} from "./client-zod/client-login-zod";
import { useClientLogin } from "@/hooks/client/useClient.hooks";
import { ROUTER_URL } from "@/router/route.const";

import coffeeImg from "@/assets/mike-kenneally-tNALoIZhqVM-unsplash.jpg";

const ClientLogin = () => {
  const loginMutation = useClientLogin();
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ClientLoginZodType>({
    resolver: zodResolver(ClientLoginZod),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: ClientLoginZodType) => {
    loginMutation.mutate({
      email: data.email,
      password: data.password,
    });
  };

  const stagger = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.15,
      },
    },
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 18, filter: "blur(4px)" },
    show: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { type: "spring" as const, stiffness: 300, damping: 30 },
    },
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#faf7f2] dark:bg-stone-950 overflow-hidden">
      {/* Left Side - Image Hero */}
      <motion.div
        initial={{ opacity: 0, x: -40, scale: 0.98 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 180, damping: 28, delay: 0.1 }}
        className="hidden lg:flex lg:w-[55%] relative overflow-hidden rounded-r-3xl">
        {/* Background Image */}
        <img
          src={coffeeImg}
          alt="Coffee ambiance"
          className="absolute inset-0 w-full h-full object-cover scale-105 hover:scale-100 transition-transform duration-[2s]"
        />
        {/* Complex overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-950/70 via-stone-900/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

        {/* Content over image */}
        <div className="relative z-10 flex flex-col justify-between p-10 w-full">
          {/* Top - Logo */}
          <Link to="/">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl  flex items-center justify-center ">
              <img
              className="object-contain group-hover:scale-110 transition-transform"
              src={"/coffee-beans.png"}
              alt="Coffee Franchise"
              
            />
            </div>
            <div>
              <span className="text-white font-bold text-lg tracking-tight">
                FranchisePlus
              </span>
              <span className="text-amber-300/80 text-xs block -mt-0.5">
                Coffee
              </span>
            </div>
          </div>
          </Link>

          {/* Middle - Hero Text */}
          <div className="max-w-md">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-lg border border-white/10 rounded-full px-4 py-1.5 mb-6">
              <Sparkles size={14} className="text-amber-400" />
              <span className="text-amber-200/90 text-xs font-medium">
                Trusted by 10,000+ coffee lovers
              </span>
            </div>
            <h2 className="text-4xl xl:text-5xl font-bold text-white leading-[1.15] mb-4">
              Every sip tells
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-300">
                a story
              </span>
            </h2>
            <p className="text-white/60 text-sm leading-relaxed max-w-xs">
              Join our community and discover handcrafted beverages made with
              passion and the finest ingredients.
            </p>
          </div>

          {/* Bottom - Stats / Social proof */}
          <div className="flex items-end justify-between">
            <div className="flex gap-6">
              {[
                { value: "50+", label: "Locations" },
                { value: "4.9", label: "Rating" },
                { value: "24/7", label: "Support" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-white/40 text-xs mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Floating review card */}
            <div className="bg-white/10 backdrop-blur-xl border border-white/15 rounded-2xl p-4 max-w-[220px]">
              <div className="flex gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-3.5 h-3.5 text-amber-400 fill-amber-400"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-white/80 text-xs leading-relaxed">
                "Best coffee app ever! Love ordering ahead."
              </p>
              <p className="text-white/40 text-[10px] mt-2">
                — Sarah M., loyal customer
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-[45%] flex flex-col min-h-screen relative lg:rounded-l-3xl">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-amber-200/20 dark:bg-amber-900/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-56 h-56 bg-orange-200/20 dark:bg-orange-900/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3 pointer-events-none" />

        {/* Mobile Logo */}
        <div className="lg:hidden flex items-center gap-2 px-6 pt-6">
          <div className="w-1/2 h-full flex items-center justify-end">
            <img
              className="h-15 object-contain group-hover:scale-110 transition-transform"
              src={"/coffee-beans.png"}
              alt="Coffee Franchise"
            />
          </div>
          <span className="font-bold text-amber-900 dark:text-amber-100 text-lg">
            FranchisePlus
          </span>
        </div>

        {/* Form Container */}
        <div className="flex-1 flex flex-col justify-center px-6 sm:px-10 lg:px-16 xl:px-20 relative z-10">
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="show"
            className="max-w-[400px] w-full mx-auto"
          >
            {/* Greeting */}
            <motion.div variants={fadeUp} className="mb-8">
              <p className="text-amber-600 dark:text-amber-400 text-sm font-semibold tracking-wide mb-2 flex items-center gap-2">
                <span className="w-8 h-[2px] bg-amber-500 rounded-full" />
                WELCOME BACK
              </p>
              <h1 className="text-3xl sm:text-[2.5rem] font-extrabold text-stone-900 dark:text-stone-50 tracking-tight leading-tight">
                Sign in to your
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600 dark:from-amber-400 dark:to-orange-400">
                  account
                </span>
              </h1>
              <p className="text-stone-400 dark:text-stone-500 text-sm mt-3">
                Don't have an account?{" "}
                <Link
                  to={ROUTER_URL.CLIENT_ROUTER.REGISTER}
                  className="text-amber-600 dark:text-amber-400 font-semibold hover:underline underline-offset-4"
                >
                  Create one
                </Link>
              </p>
            </motion.div>

            {/* Form */}
            <motion.form variants={fadeUp} onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Email */}
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-stone-500 dark:text-stone-400 text-s font-semibold tracking-widest uppercase"
                >
                  Email address
                </Label>
                <div
                  className={`relative group rounded-2xl transition-all duration-300 ${
                    focusedField === "email"
                      ? "ring-2 ring-amber-500/30 dark:ring-amber-400/20"
                      : ""
                  }`}
                >
                  <div
                    className={`absolute left-4 top-1/2 -translate-y-1/2 rounded-lg p-2.5 transition-colors duration-200 ${
                      focusedField === "email"
                        ? "bg-amber-500 text-white"
                        : "bg-stone-100 dark:bg-stone-800 text-stone-400"
                    }`}
                  >
                    <Mail size={18} />
                  </div>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    className={`pl-16 h-[70px] rounded-2xl border-stone-200/80 dark:border-stone-700/80 bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-100 placeholder:text-stone-300 dark:placeholder:text-stone-600 focus:border-amber-500 dark:focus:border-amber-600 transition-all duration-200 text-lg ${
                      errors.email
                        ? "border-red-400 dark:border-red-500"
                        : ""
                    }`}
                    {...register("email")}
                    onFocus={() => setFocusedField("email")}
                    onBlur={() => setFocusedField(null)}
                  />
                </div>
                {errors.email && (
                  <div className="flex items-center gap-1.5 text-red-500 dark:text-red-400 text-xs pl-1">
                    <AlertCircle size={12} />
                    <span>{errors.email.message}</span>
                  </div>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="password"
                    className="text-stone-500 dark:text-stone-400 text-xs font-semibold tracking-widest uppercase"
                  >
                    Password
                  </Label>
                  <Link
                    to={ROUTER_URL.CLIENT_ROUTER.FORGOT_PASSWORD}
                    className="text-xs text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 transition-colors font-semibold tracking-wide"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div
                  className={`relative group rounded-2xl transition-all duration-300 ${
                    focusedField === "password"
                      ? "ring-2 ring-amber-500/30 dark:ring-amber-400/20"
                      : ""
                  }`}
                >
                  <div
                    className={`absolute left-4 top-1/2 -translate-y-1/2 rounded-lg p-2.5 transition-colors duration-200 ${
                      focusedField === "password"
                        ? "bg-amber-500 text-white"
                        : "bg-stone-100 dark:bg-stone-800 text-stone-400"
                    }`}
                  >
                    <Lock size={18} />
                  </div>
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className={`pl-16 pr-14 h-[70px] rounded-2xl border-stone-200/80 dark:border-stone-700/80 bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-100 placeholder:text-stone-300 dark:placeholder:text-stone-600 focus:border-amber-500 dark:focus:border-amber-600 transition-all duration-200 text-lg ${
                      errors.password
                        ? "border-red-400 dark:border-red-500"
                        : ""
                    }`}
                    {...register("password")}
                    onFocus={() => setFocusedField("password")}
                    onBlur={() => setFocusedField(null)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-300 dark:text-stone-600 hover:text-stone-500 dark:hover:text-stone-400 transition-colors p-1"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.password && (
                  <div className="flex items-center gap-1.5 text-red-500 dark:text-red-400 text-xs pl-1">
                    <AlertCircle size={12} />
                    <span>{errors.password.message}</span>
                  </div>
                )}
              </div>

              {/* Submit */}
              <div className="pt-3 space-y-3">
                <Button
                  type="submit"
                  disabled={loginMutation.isPending}
                  className="w-full h-[70px] bg-gradient-to-r from-amber-600 via-amber-600 to-orange-600 hover:from-amber-700 hover:via-amber-700 hover:to-orange-700 text-white font-bold rounded-2xl shadow-[0_8px_30px_-6px_rgba(217,119,6,0.4)] hover:shadow-[0_12px_40px_-6px_rgba(217,119,6,0.5)] transition-all duration-300 group text-lg tracking-wide"
                >
                  {loginMutation.isPending ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Signing in...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Sign In
                      <ArrowRight
                        size={20}
                        className="group-hover:translate-x-1 transition-transform duration-200"
                      />
                    </span>
                  )}
                </Button>

                <Link
                  to={ROUTER_URL.CLIENT_ROUTER.REGISTER}
                  className="block"
                >
                  <Button
                    type="button"
                    className="w-full h-[70px] bg-transparent border-2 border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 font-semibold rounded-2xl hover:bg-stone-50 dark:hover:bg-stone-800/50 hover:border-stone-300 dark:hover:border-stone-600 transition-all duration-300 text-lg"
                  >
                    Create an Account
                  </Button>
                </Link>
              </div>
            </motion.form>

            {/* Divider with trust badges */}
            <motion.div variants={fadeUp} className="mt-8 pt-6 border-t border-stone-200/60 dark:border-stone-800">
              <div className="flex items-center justify-center gap-6 text-stone-300 dark:text-stone-700">
                <div className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider">
                  <svg
                    className="w-3.5 h-3.5 text-green-500"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                  <span className="text-stone-400 dark:text-stone-500">
                    SSL Secured
                  </span>
                </div>
                <div className="w-px h-3 bg-stone-200 dark:bg-stone-700" />
                <div className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider">
                  <svg
                    className="w-3.5 h-3.5 text-blue-500"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                  <span className="text-stone-400 dark:text-stone-500">
                    Verified
                  </span>
                </div>
                <div className="w-px h-3 bg-stone-200 dark:bg-stone-700" />
                <div className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider">
                  <Lock size={12} className="text-amber-500" />
                  <span className="text-stone-400 dark:text-stone-500">
                    Encrypted
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Footer */}
        <div className="px-6 sm:px-10 lg:px-16 xl:px-20 py-5 relative z-10">
          <div className="max-w-[400px] mx-auto flex items-center justify-between text-[11px] text-stone-350">
            <p className="text-stone-400 dark:text-stone-600 flex items-center gap-1.5">
              <Coffee size={11} />
              FranchisePlus Coffee &copy; 2026
            </p>
            <p className="text-stone-400 dark:text-stone-600">
              Need help?{" "}
              <span className="text-amber-600 dark:text-amber-400 font-medium cursor-pointer hover:underline underline-offset-2">
                Contact Support
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientLogin;
