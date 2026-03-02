import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Coffee,
  Lock,
  Mail,
  User,
  Phone,
  Eye,
  EyeOff,
  MapPin,
  AlertCircle,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  ClientLoginZod,
  type ClientLoginZodType,
} from "./login/client-zod/client-login-zod";
import {
  ClientRegisterZod,
  type ClientRegisterZodType,
} from "./register/client-register-zod/client-register.zod";
import {
  useClientLogin,
  useRegisterCustomer,
} from "@/hooks/client/useClient.hooks";
import { ROUTER_URL } from "@/router/route.const";

import coffeeImg from "@/assets/mike-kenneally-tNALoIZhqVM-unsplash.jpg";

/* ================================================================
   Shared helpers
   ================================================================ */

const iconBox = (field: string, focusedField: string | null) =>
  `absolute left-4 top-1/2 -translate-y-1/2 rounded-xl p-2.5 transition-colors duration-200 ${
    focusedField === field
      ? "bg-[#6D4C41] text-white"
      : "bg-stone-100 dark:bg-stone-800 text-stone-400"
  }`;

const ringClass = (field: string, focusedField: string | null) =>
  `relative group rounded-2xl transition-all duration-300 ${
    focusedField === field
      ? "ring-2 ring-[#6D4C41]/30 dark:ring-[#6D4C41]/20"
      : ""
  }`;

const inputBase =
  "pl-16 h-[62px] rounded-2xl border-stone-200/80 dark:border-stone-700/80 bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-100 placeholder:text-stone-300 dark:placeholder:text-stone-600 focus:border-[#6D4C41] dark:focus:border-[#8B181B] transition-all duration-200 text-lg";

const ErrorMsg = ({ message }: { message?: string }) =>
  message ? (
    <div className="flex items-center gap-1.5 text-red-500 dark:text-red-400 text-xs pl-1 mt-1">
      <AlertCircle size={12} />
      <span>{message}</span>
    </div>
  ) : null;

/* ================================================================
   Login Form
   ================================================================ */

const LoginForm = ({ onToggle }: { onToggle: () => void }) => {
  const loginMutation = useClientLogin();
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ClientLoginZodType>({
    resolver: zodResolver(ClientLoginZod),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = (data: ClientLoginZodType) => {
    loginMutation.mutate({ email: data.email, password: data.password });
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-10">
        <p className="text-[#8B181B] text-base font-semibold tracking-wide mb-2 flex items-center gap-2">
          <span className="w-10 h-[2px] bg-[#8B181B] rounded-full" />
          WELCOME BACK
        </p>
        <h1 className="text-4xl font-extrabold text-stone-900 dark:text-stone-50 tracking-tight leading-tight">
          Sign in to your
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6D4C41] to-[#8B181B]">
            account
          </span>
        </h1>
        <p className="text-stone-400 dark:text-stone-500 text-base mt-3">
          Don&apos;t have an account?{" "}
          <button
            type="button"
            onClick={onToggle}
            className="text-[#8B181B] font-semibold hover:underline underline-offset-4 transition-colors"
          >
            Create one
          </button>
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Email */}
        <div className="space-y-2">
          <Label
            htmlFor="login-email"
            className="text-stone-500 dark:text-stone-400 text-sm font-semibold tracking-widest uppercase"
          >
            Email address
          </Label>
          <div className={ringClass("email", focusedField)}>
            <div className={iconBox("email", focusedField)}>
              <Mail size={18} />
            </div>
            <Input
              id="login-email"
              type="email"
              placeholder="your.email@example.com"
              className={`${inputBase} h-[70px] ${
                errors.email ? "border-red-400 dark:border-red-500" : ""
              }`}
              {...register("email")}
              onFocus={() => setFocusedField("email")}
              onBlur={() => setFocusedField(null)}
            />
          </div>
          <ErrorMsg message={errors.email?.message} />
        </div>

        {/* Password */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label
              htmlFor="login-password"
              className="text-stone-500 dark:text-stone-400 text-sm font-semibold tracking-widest uppercase"
            >
              Password
            </Label>
            <Link
              to={ROUTER_URL.CLIENT_ROUTER.FORGOT_PASSWORD}
              className="text-xs text-[#8B181B] hover:text-[#6D4C41] transition-colors font-semibold tracking-wide"
            >
              Forgot password?
            </Link>
          </div>
          <div className={ringClass("password", focusedField)}>
            <div className={iconBox("password", focusedField)}>
              <Lock size={18} />
            </div>
            <Input
              id="login-password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              className={`${inputBase} h-[70px] pr-14 ${
                errors.password ? "border-red-400 dark:border-red-500" : ""
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
          <ErrorMsg message={errors.password?.message} />
        </div>

        {/* Actions */}
        <div className="pt-2 space-y-3">
          <Button
            type="submit"
            disabled={loginMutation.isPending}
            className="w-full h-[68px] bg-gradient-to-r from-[#6D4C41] to-[#8B181B] hover:from-[#5D3C31] hover:to-[#7B0811] text-white font-bold rounded-2xl shadow-[0_8px_30px_-6px_rgba(109,76,65,0.4)] hover:shadow-[0_12px_40px_-6px_rgba(139,24,27,0.5)] transition-all duration-300 group text-lg tracking-wide"
          >
            {loginMutation.isPending ? (
              <span className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
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

          <Button
            type="button"
            onClick={onToggle}
            className="w-full h-[68px] bg-transparent border-2 border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 font-semibold rounded-2xl hover:bg-stone-50 dark:hover:bg-stone-800/50 hover:border-[#6D4C41]/30 transition-all duration-300 text-lg"
          >
            Create an Account
          </Button>
        </div>
      </form>
    </div>
  );
};

/* ================================================================
   Register Form
   ================================================================ */

const RegisterForm = ({ onToggle }: { onToggle: () => void }) => {
  const registerMutation = useRegisterCustomer();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ClientRegisterZodType>({
    resolver: zodResolver(ClientRegisterZod),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      name: "",
      phone: "",
      address: "",
    },
  });

  const onSubmit = (data: ClientRegisterZodType) => {
    registerMutation.mutate({
      email: data.email,
      password: data.password,
      name: data.name,
      phone: data.phone,
      address: data.address,
    });
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <p className="text-[#8B181B] text-base font-semibold tracking-wide mb-2 flex items-center gap-2">
          <span className="w-10 h-[2px] bg-[#8B181B] rounded-full" />
          GET STARTED
        </p>
        <h1 className="text-4xl font-extrabold text-stone-900 dark:text-stone-50 tracking-tight leading-tight">
          Create your
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6D4C41] to-[#8B181B]">
            account
          </span>
        </h1>
        <p className="text-stone-400 dark:text-stone-500 text-base mt-2">
          Already have an account?{" "}
          <button
            type="button"
            onClick={onToggle}
            className="text-[#8B181B] font-semibold hover:underline underline-offset-4 transition-colors"
          >
            Sign in
          </button>
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Name & Phone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Name */}
          <div className="space-y-1.5">
            <Label
              htmlFor="reg-name"
              className="text-stone-500 dark:text-stone-400 text-sm font-semibold tracking-widest uppercase"
            >
              Full name
            </Label>
            <div className={ringClass("name", focusedField)}>
              <div className={iconBox("name", focusedField)}>
                <User size={16} />
              </div>
              <Input
                id="reg-name"
                type="text"
                placeholder="John Doe"
                className={`${inputBase} ${
                  errors.name ? "border-red-400 dark:border-red-500" : ""
                }`}
                {...register("name")}
                onFocus={() => setFocusedField("name")}
                onBlur={() => setFocusedField(null)}
              />
            </div>
            <ErrorMsg message={errors.name?.message} />
          </div>

          {/* Phone */}
          <div className="space-y-1.5">
            <Label
              htmlFor="reg-phone"
              className="text-stone-500 dark:text-stone-400 text-sm font-semibold tracking-widest uppercase"
            >
              Phone
            </Label>
            <div className={ringClass("phone", focusedField)}>
              <div className={iconBox("phone", focusedField)}>
                <Phone size={16} />
              </div>
              <Input
                id="reg-phone"
                type="tel"
                placeholder="0938947221"
                className={`${inputBase} ${
                  errors.phone ? "border-red-400 dark:border-red-500" : ""
                }`}
                {...register("phone")}
                onFocus={() => setFocusedField("phone")}
                onBlur={() => setFocusedField(null)}
              />
            </div>
            <ErrorMsg message={errors.phone?.message} />
          </div>
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <Label
            htmlFor="reg-email"
            className="text-stone-500 dark:text-stone-400 text-sm font-semibold tracking-widest uppercase"
          >
            Email address
          </Label>
          <div className={ringClass("email", focusedField)}>
            <div className={iconBox("email", focusedField)}>
              <Mail size={16} />
            </div>
            <Input
              id="reg-email"
              type="email"
              placeholder="your.email@example.com"
              className={`${inputBase} ${
                errors.email ? "border-red-400 dark:border-red-500" : ""
              }`}
              {...register("email")}
              onFocus={() => setFocusedField("email")}
              onBlur={() => setFocusedField(null)}
            />
          </div>
          <ErrorMsg message={errors.email?.message} />
        </div>

        {/* Address */}
        <div className="space-y-1.5">
          <Label
            htmlFor="reg-address"
            className="text-stone-500 dark:text-stone-400 text-sm font-semibold tracking-widest uppercase"
          >
            Address
          </Label>
          <div
            className={`relative group rounded-2xl transition-all duration-300 ${
              focusedField === "address"
                ? "ring-2 ring-[#6D4C41]/30 dark:ring-[#6D4C41]/20"
                : ""
            }`}
          >
            <div
              className={`absolute left-4 top-4 rounded-xl p-2.5 transition-colors duration-200 ${
                focusedField === "address"
                  ? "bg-[#6D4C41] text-white"
                  : "bg-stone-100 dark:bg-stone-800 text-stone-400"
              }`}
            >
              <MapPin size={16} />
            </div>
            <Textarea
              id="reg-address"
              placeholder="FTOWN-1, FPT Software, Ho Chi Minh"
              className={`pl-16 pt-4 rounded-2xl border-stone-200/80 dark:border-stone-700/80 bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-100 placeholder:text-stone-300 dark:placeholder:text-stone-600 focus:border-[#6D4C41] dark:focus:border-[#8B181B] transition-all duration-200 text-base min-h-[70px] resize-none ${
                errors.address ? "border-red-400 dark:border-red-500" : ""
              }`}
              {...register("address")}
              onFocus={() => setFocusedField("address")}
              onBlur={() => setFocusedField(null)}
            />
          </div>
          <ErrorMsg message={errors.address?.message} />
        </div>

        {/* Password & Confirm */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Password */}
          <div className="space-y-1.5">
            <Label
              htmlFor="reg-password"
              className="text-stone-500 dark:text-stone-400 text-sm font-semibold tracking-widest uppercase"
            >
              Password
            </Label>
            <div className={ringClass("password", focusedField)}>
              <div className={iconBox("password", focusedField)}>
                <Lock size={16} />
              </div>
              <Input
                id="reg-password"
                type={showPassword ? "text" : "password"}
                placeholder="Create password"
                className={`${inputBase} pr-12 ${
                  errors.password ? "border-red-400 dark:border-red-500" : ""
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
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <ErrorMsg message={errors.password?.message} />
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <Label
              htmlFor="reg-confirm"
              className="text-stone-500 dark:text-stone-400 text-sm font-semibold tracking-widest uppercase"
            >
              Confirm
            </Label>
            <div className={ringClass("confirmPassword", focusedField)}>
              <div className={iconBox("confirmPassword", focusedField)}>
                <Lock size={16} />
              </div>
              <Input
                id="reg-confirm"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm password"
                className={`${inputBase} pr-12 ${
                  errors.confirmPassword
                    ? "border-red-400 dark:border-red-500"
                    : ""
                }`}
                {...register("confirmPassword")}
                onFocus={() => setFocusedField("confirmPassword")}
                onBlur={() => setFocusedField(null)}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-300 dark:text-stone-600 hover:text-stone-500 dark:hover:text-stone-400 transition-colors p-1"
              >
                {showConfirmPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>
            <ErrorMsg message={errors.confirmPassword?.message} />
          </div>
        </div>

        {/* Submit */}
        <div className="pt-1">
          <Button
            type="submit"
            disabled={registerMutation.isPending}
            className="w-full h-[66px] bg-gradient-to-r from-[#6D4C41] to-[#8B181B] hover:from-[#5D3C31] hover:to-[#7B0811] text-white font-bold rounded-2xl shadow-[0_8px_30px_-6px_rgba(109,76,65,0.4)] hover:shadow-[0_12px_40px_-6px_rgba(139,24,27,0.5)] transition-all duration-300 group text-lg tracking-wide"
          >
            {registerMutation.isPending ? (
              <span className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Creating Account...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Create Account
                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-1 transition-transform duration-200"
                />
              </span>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

/* ================================================================
   Slide & fade variants
   ================================================================ */

const formVariants = {
  initial: (dir: number) => ({
    opacity: 0,
    x: dir > 0 ? 30 : -30,
    filter: "blur(4px)",
  }),
  animate: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 30,
    },
  },
  exit: (dir: number) => ({
    opacity: 0,
    x: dir > 0 ? -30 : 30,
    filter: "blur(4px)",
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 30,
    },
  }),
};

/* ================================================================
   Auth Container  â€“  unified login / register
   ================================================================ */

const AuthContainer = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(
    location.pathname !== ROUTER_URL.CLIENT_ROUTER.REGISTER,
  );
  const [direction, setDirection] = useState(0);

  const toggleMode = () => {
    const toLogin = !isLogin;
    setDirection(toLogin ? -1 : 1);
    setIsLogin(toLogin);
    navigate(
      toLogin
        ? ROUTER_URL.CLIENT_ROUTER.LOGIN
        : ROUTER_URL.CLIENT_ROUTER.REGISTER,
      { replace: true },
    );
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] dark:bg-stone-950 flex items-center justify-center p-4 lg:p-6">
      {/* Subtle background decorations */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-[#6D4C41]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-[#8B181B]/5 rounded-full blur-3xl" />
      </div>

      {/* Card */}
      <motion.div
        layout
        transition={{
          layout: {
            type: "spring" as const,
            stiffness: 200,
            damping: 30,
            mass: 0.8,
          },
        }}
        className="relative z-10 w-[90vw] min-h-[90vh] bg-white dark:bg-stone-900 rounded-[2rem] shadow-[0_25px_80px_-12px_rgba(0,0,0,0.15)] dark:shadow-[0_25px_80px_-12px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col lg:flex-row"
      >
        {/* â”€â”€ Left â€” Image Panel â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        <div className="hidden lg:flex lg:w-[42%] relative overflow-hidden">
          <img
            src={coffeeImg}
            alt="Coffee ambiance"
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Overlays */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#6D4C41]/80 via-stone-900/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Content */}
          <div className="relative z-10 flex flex-col justify-between p-10 w-full">
            {/* Logo */}
            <Link to="/">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center">
                  <img
                    className="object-contain"
                    src="/coffee-beans.png"
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

            {/* Hero text */}
            <div className="max-w-sm">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-lg border border-white/10 rounded-full px-4 py-1.5 mb-5">
                <Sparkles size={14} className="text-amber-300" />
                <span className="text-amber-200/90 text-sm font-medium">
                  Trusted by 10,000+ coffee lovers
                </span>
              </div>
              <h2 className="text-4xl xl:text-5xl font-bold text-white leading-[1.15] mb-4">
                Every sip tells
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-orange-200">
                  a story
                </span>
              </h2>
              <p className="text-white/60 text-base leading-relaxed">
                Join our community and discover handcrafted beverages made with
                passion and the finest ingredients.
              </p>
            </div>

            {/* Stats */}
            <div className="flex gap-6">
              {[
                { value: "50+", label: "Locations" },
                { value: "4.9", label: "Rating" },
                { value: "24/7", label: "Support" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-white/40 text-sm mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* â”€â”€ Right â€” Form Panel â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        <motion.div layout className="w-full lg:w-[58%] flex flex-col">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-2 px-6 pt-6">
            <img
              className="h-10 object-contain"
              src="/coffee-beans.png"
              alt="Coffee Franchise"
            />
            <span className="font-bold text-[#6D4C41] text-xl">
              FranchisePlus
            </span>
          </div>

          {/* Scrollable form area */}
          <div className="flex-1 flex flex-col justify-center px-6 sm:px-10 lg:px-14 xl:px-20 py-8 lg:py-10 overflow-y-auto">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={isLogin ? "login" : "register"}
                custom={direction}
                variants={formVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="max-w-[520px] w-full mx-auto"
              >
                {isLogin ? (
                  <LoginForm onToggle={toggleMode} />
                ) : (
                  <RegisterForm onToggle={toggleMode} />
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Trust badges */}
          <div className="px-6 sm:px-10 lg:px-14 xl:px-20 pb-4">
            <div className="max-w-[520px] mx-auto pt-4 border-t border-stone-200/60 dark:border-stone-800">
              <div className="flex items-center justify-center gap-5 text-stone-300 dark:text-stone-700">
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
                  <Lock size={12} className="text-[#6D4C41]" />
                  <span className="text-stone-400 dark:text-stone-500">
                    Encrypted
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 sm:px-10 lg:px-14 xl:px-20 pb-5">
            <div className="max-w-[520px] mx-auto flex items-center justify-between text-xs">
              <p className="text-stone-400 dark:text-stone-600 flex items-center gap-1.5">
                <Coffee size={11} />
                FranchisePlus Coffee &copy; 2026
              </p>
              <p className="text-stone-400 dark:text-stone-600">
                Need help?{" "}
                <span className="text-[#8B181B] font-medium cursor-pointer hover:underline underline-offset-2">
                  Contact Support
                </span>
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AuthContainer;
