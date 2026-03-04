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
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  ClientRegisterZod,
  type ClientRegisterZodType,
} from "./client-register-zod/client-register.zod";
import { ROUTER_URL } from "@/router/route.const";
import { useRegisterCustomer } from "@/hooks/client/useClient.hooks";

import coffeeImg from "@/assets/sergey-kotenev-NzzYGQSdw9Q-unsplash.jpg";

const ClientRegister = () => {
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

  const inputBaseClass =
    "pl-16 h-[56px] rounded-2xl border-stone-200/80 dark:border-stone-700/80 bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-100 placeholder:text-stone-300 dark:placeholder:text-stone-600 focus:border-amber-500 dark:focus:border-amber-600 transition-all duration-200 text-base";

  const iconBox = (field: string) =>
    `absolute left-4 top-1/2 -translate-y-1/2 rounded-lg p-2 transition-colors duration-200 ${
      focusedField === field
        ? "bg-amber-500 text-white"
        : "bg-stone-100 dark:bg-stone-800 text-stone-400"
    }`;

  const ringClass = (field: string) =>
    `relative group rounded-2xl transition-all duration-300 ${
      focusedField === field
        ? "ring-2 ring-amber-500/30 dark:ring-amber-400/20"
        : ""
    }`;

  const stagger = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.06,
        delayChildren: 0.12,
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
    <div className="h-full flex flex-col lg:flex-row bg-[#faf7f2] dark:bg-stone-950 overflow-hidden">
      {/* Left Side - Register Form */}
      <div className="w-full lg:w-[50%] flex flex-col h-full relative lg:rounded-r-3xl lg:z-10">
        {/* Decorative blurs */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-amber-200/20 dark:bg-amber-900/10 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-56 h-56 bg-orange-200/20 dark:bg-orange-900/10 rounded-full blur-3xl translate-y-1/3 translate-x-1/3 pointer-events-none" />

        {/* Mobile Logo */}
        <div className="lg:hidden flex items-center gap-2 px-6 pt-6">
          <div className="w-9 h-9 flex items-center justify-center">
            <img
              className="h-8 object-contain"
              src="/coffee-beans.png"
              alt="Coffee Franchise"
            />
          </div>
          <span className="font-bold text-amber-900 dark:text-amber-100 text-lg">
            FranchisePlus
          </span>
        </div>

        {/* Form Container - scrollable */}
        <div className="flex-1 flex flex-col justify-center px-6 sm:px-10 lg:px-14 xl:px-18 py-8 relative z-10 overflow-y-auto">
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="show"
            className="max-w-[440px] w-full mx-auto"
          >
            {/* Greeting */}
            <motion.div variants={fadeUp} className="mb-6">
              <p className="text-amber-600 dark:text-amber-400 text-sm font-semibold tracking-wide mb-2 flex items-center gap-2">
                <span className="w-8 h-[2px] bg-amber-500 rounded-full" />
                GET STARTED
              </p>
              <h1 className="text-3xl sm:text-[2.2rem] font-extrabold text-stone-900 dark:text-stone-50 tracking-tight leading-tight">
                Create your
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600 dark:from-amber-400 dark:to-orange-400">
                  account
                </span>
              </h1>
              <p className="text-stone-400 dark:text-stone-500 text-sm mt-2">
                Already have an account?{" "}
                <Link
                  to={ROUTER_URL.CLIENT_ROUTER.LOGIN}
                  className="text-amber-600 dark:text-amber-400 font-semibold hover:underline underline-offset-4"
                >
                  Sign in
                </Link>
              </p>
            </motion.div>

            {/* Form */}
            <motion.form variants={fadeUp} onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Name & Phone - side by side */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Name */}
                <div className="space-y-1.5">
                  <Label
                    htmlFor="name"
                    className="text-stone-500 dark:text-stone-400 text-xs font-semibold tracking-widest uppercase"
                  >
                    Full name
                  </Label>
                  <div className={ringClass("name")}>
                    <div className={iconBox("name")}>
                      <User size={16} />
                    </div>
                    <Input
                      id="name"
                      type="text"
                      placeholder="John Doe"
                      className={`${inputBaseClass} ${
                        errors.name
                          ? "border-red-400 dark:border-red-500"
                          : ""
                      }`}
                      {...register("name")}
                      onFocus={() => setFocusedField("name")}
                      onBlur={() => setFocusedField(null)}
                    />
                  </div>
                  {errors.name && (
                    <div className="flex items-center gap-1.5 text-red-500 dark:text-red-400 text-xs pl-1">
                      <AlertCircle size={12} />
                      <span>{errors.name.message}</span>
                    </div>
                  )}
                </div>

                {/* Phone */}
                <div className="space-y-1.5">
                  <Label
                    htmlFor="phone"
                    className="text-stone-500 dark:text-stone-400 text-xs font-semibold tracking-widest uppercase"
                  >
                    Phone
                  </Label>
                  <div className={ringClass("phone")}>
                    <div className={iconBox("phone")}>
                      <Phone size={16} />
                    </div>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="0938947221"
                      className={`${inputBaseClass} ${
                        errors.phone
                          ? "border-red-400 dark:border-red-500"
                          : ""
                      }`}
                      {...register("phone")}
                      onFocus={() => setFocusedField("phone")}
                      onBlur={() => setFocusedField(null)}
                    />
                  </div>
                  {errors.phone && (
                    <div className="flex items-center gap-1.5 text-red-500 dark:text-red-400 text-xs pl-1">
                      <AlertCircle size={12} />
                      <span>{errors.phone.message}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="email"
                  className="text-stone-500 dark:text-stone-400 text-xs font-semibold tracking-widest uppercase"
                >
                  Email address
                </Label>
                <div className={ringClass("email")}>
                  <div className={iconBox("email")}>
                    <Mail size={16} />
                  </div>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    className={`${inputBaseClass} ${
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

              {/* Address */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="address"
                  className="text-stone-500 dark:text-stone-400 text-xs font-semibold tracking-widest uppercase"
                >
                  Address
                </Label>
                <div
                  className={`relative group rounded-2xl transition-all duration-300 ${
                    focusedField === "address"
                      ? "ring-2 ring-amber-500/30 dark:ring-amber-400/20"
                      : ""
                  }`}
                >
                  <div
                    className={`absolute left-4 top-4 rounded-lg p-2 transition-colors duration-200 ${
                      focusedField === "address"
                        ? "bg-amber-500 text-white"
                        : "bg-stone-100 dark:bg-stone-800 text-stone-400"
                    }`}
                  >
                    <MapPin size={16} />
                  </div>
                  <Textarea
                    id="address"
                    placeholder="FTOWN-1, FPT Software, Ho Chi Minh"
                    className={`pl-16 pt-4 rounded-2xl border-stone-200/80 dark:border-stone-700/80 bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-100 placeholder:text-stone-300 dark:placeholder:text-stone-600 focus:border-amber-500 dark:focus:border-amber-600 transition-all duration-200 text-base min-h-[70px] resize-none ${
                      errors.address
                        ? "border-red-400 dark:border-red-500"
                        : ""
                    }`}
                    {...register("address")}
                    onFocus={() => setFocusedField("address")}
                    onBlur={() => setFocusedField(null)}
                  />
                </div>
                {errors.address && (
                  <div className="flex items-center gap-1.5 text-red-500 dark:text-red-400 text-xs pl-1">
                    <AlertCircle size={12} />
                    <span>{errors.address.message}</span>
                  </div>
                )}
              </div>

              {/* Password & Confirm - side by side */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Password */}
                <div className="space-y-1.5">
                  <Label
                    htmlFor="password"
                    className="text-stone-500 dark:text-stone-400 text-xs font-semibold tracking-widest uppercase"
                  >
                    Password
                  </Label>
                  <div className={ringClass("password")}>
                    <div className={iconBox("password")}>
                      <Lock size={16} />
                    </div>
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create password"
                      className={`${inputBaseClass} pr-12 ${
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
                      {showPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <div className="flex items-center gap-1.5 text-red-500 dark:text-red-400 text-xs pl-1">
                      <AlertCircle size={12} />
                      <span>{errors.password.message}</span>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="space-y-1.5">
                  <Label
                    htmlFor="confirmPassword"
                    className="text-stone-500 dark:text-stone-400 text-xs font-semibold tracking-widest uppercase"
                  >
                    Confirm
                  </Label>
                  <div className={ringClass("confirmPassword")}>
                    <div className={iconBox("confirmPassword")}>
                      <Lock size={16} />
                    </div>
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm password"
                      className={`${inputBaseClass} pr-12 ${
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
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-300 dark:text-stone-600 hover:text-stone-500 dark:hover:text-stone-400 transition-colors p-1"
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <div className="flex items-center gap-1.5 text-red-500 dark:text-red-400 text-xs pl-1">
                      <AlertCircle size={12} />
                      <span>{errors.confirmPassword.message}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Submit */}
              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={registerMutation.isPending}
                  className="w-full h-[56px] bg-gradient-to-r from-amber-600 via-amber-600 to-orange-600 hover:from-amber-700 hover:via-amber-700 hover:to-orange-700 text-white font-bold rounded-2xl shadow-[0_8px_30px_-6px_rgba(217,119,6,0.4)] hover:shadow-[0_12px_40px_-6px_rgba(217,119,6,0.5)] transition-all duration-300 group text-base tracking-wide"
                >
                  {registerMutation.isPending ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
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
            </motion.form>

            {/* Trust badges */}
            <motion.div variants={fadeUp} className="mt-6 pt-4 border-t border-stone-200/60 dark:border-stone-800">
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
        <div className="px-6 sm:px-10 lg:px-14 xl:px-18 py-4 relative z-10">
          <div className="max-w-[440px] mx-auto flex items-center justify-between text-[11px]">
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

      {/* Right Side - Image Hero */}
      <motion.div
        initial={{ opacity: 0, x: 40, scale: 0.98 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 180, damping: 28, delay: 0.1 }}
        className="hidden lg:flex lg:w-[50%] relative overflow-hidden"
      >
        {/* Background Image */}
        <img
          src={coffeeImg}
          alt="Coffee ambiance"
          className="absolute inset-0 w-full h-full object-cover scale-105 hover:scale-100 transition-transform duration-[2s]"
        />
        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-bl from-amber-950/70 via-stone-900/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

        {/* Content over image */}
        <div className="relative z-10 flex flex-col justify-between p-10 w-full">
          {/* Top - Logo */}
          <div className="flex items-center justify-end">
            <Link to="/">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl flex items-center justify-center">
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
          </div>

          {/* Middle - Hero Text */}
          <div className="max-w-md ml-auto text-right">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-lg border border-white/10 rounded-full px-4 py-1.5 mb-6">
              <Sparkles size={14} className="text-amber-400" />
              <span className="text-amber-200/90 text-xs font-medium">
                Join 100K+ happy customers
              </span>
            </div>
            <h2 className="text-4xl xl:text-5xl font-bold text-white leading-[1.15] mb-4">
              Start your
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-300">
                coffee journey
              </span>
            </h2>
            <p className="text-white/60 text-sm leading-relaxed ml-auto max-w-xs">
              Fresh brews, great vibes, and exclusive perks await you. Sign up
              and experience premium coffee.
            </p>
          </div>

          {/* Bottom - Stats */}
          <div className="flex items-end justify-between">
            {/* Floating promo card */}
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
                "Signing up was so easy. Now I never wait in line!"
              </p>
              <p className="text-white/40 text-[10px] mt-2">
                — Mike T., new member
              </p>
            </div>

            <div className="flex gap-6">
              {[
                { value: "50+", label: "Locations" },
                { value: "4.9", label: "Rating" },
                { value: "24/7", label: "Support" },
              ].map((stat) => (
                <div key={stat.label} className="text-right">
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-white/40 text-xs mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ClientRegister;
