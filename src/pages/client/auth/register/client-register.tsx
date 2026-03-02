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
} from "lucide-react";
import { Link } from "react-router-dom";

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

const ClientRegister = () => {
  const registerMutation = useRegisterCustomer();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
    <div className="min-h-screen flex">
      {/* Left Side - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-900/90 to-amber-900/90 z-10" />
        <img
          src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=2070&auto=format&fit=crop"
          alt="Coffee Shop"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-20 flex flex-col justify-center items-center text-white p-12">
          <Coffee size={80} className="mb-6 animate-pulse" />
          <h1 className="text-5xl font-bold mb-4 text-center">
            Join FranchisePlus
          </h1>
          <p className="text-xl text-center text-orange-100 max-w-md">
            Start your coffee journey with us. Fresh brews, great vibes, and
            exclusive perks await you.
          </p>
          <div className="mt-8 flex gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold">50+</div>
              <div className="text-sm text-orange-200">Locations</div>
            </div>
            <div className="h-12 w-px bg-orange-300/50" />
            <div className="text-center">
              <div className="text-3xl font-bold">100K+</div>
              <div className="text-sm text-orange-200">Happy Customers</div>
            </div>
            <div className="h-12 w-px bg-orange-300/50" />
            <div className="text-center">
              <div className="text-3xl font-bold">4.9★</div>
              <div className="text-sm text-orange-200">Rating</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100 overflow-y-auto">
        <div className="w-full max-w-md py-8">
          {/* Logo for Mobile */}
          <div className="flex lg:hidden justify-center mb-6">
            <div className="bg-gradient-to-br from-orange-600 to-orange-800 rounded-full p-4 shadow-xl">
              <Coffee size={32} className="text-white" />
            </div>
          </div>

          {/* Card */}
          <div className="bg-white rounded-2xl shadow-2xl p-8 border border-orange-200">
            {/* Header */}
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-orange-900 mb-2">
                Create Account
              </h2>
              <p className="text-orange-700 text-sm">
                Sign up to start ordering your favorite coffee
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Name Field */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="name"
                  className="text-orange-900 font-medium text-sm"
                >
                  Full Name
                </Label>
                <div className="relative">
                  <User
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-600"
                    size={18}
                  />
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    className={`pl-10 border-orange-200 focus:border-orange-500 h-11 ${
                      errors.name ? "border-red-500" : ""
                    }`}
                    {...register("name")}
                  />
                </div>
                {errors.name && (
                  <p className="text-red-600 text-xs">{errors.name.message}</p>
                )}
              </div>

              {/* Email Field */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="email"
                  className="text-orange-900 font-medium text-sm"
                >
                  Email Address
                </Label>
                <div className="relative">
                  <Mail
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-600"
                    size={18}
                  />
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    className={`pl-10 border-orange-200 focus:border-orange-500 h-11 ${
                      errors.email ? "border-red-500" : ""
                    }`}
                    {...register("email")}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-600 text-xs">{errors.email.message}</p>
                )}
              </div>

              {/* Phone Field */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="phone"
                  className="text-orange-900 font-medium text-sm"
                >
                  Phone Number
                </Label>
                <div className="relative">
                  <Phone
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-600"
                    size={18}
                  />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="0938947221"
                    className={`pl-10 border-orange-200 focus:border-orange-500 h-11 ${
                      errors.phone ? "border-red-500" : ""
                    }`}
                    {...register("phone")}
                  />
                </div>
                {errors.phone && (
                  <p className="text-red-600 text-xs">{errors.phone.message}</p>
                )}
              </div>

              {/* Address Field */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="address"
                  className="text-orange-900 font-medium text-sm"
                >
                  Address
                </Label>
                <div className="relative">
                  <MapPin
                    className="absolute left-3 top-3 text-orange-600"
                    size={18}
                  />
                  <Textarea
                    id="address"
                    placeholder="FTOWN-1, FPT Software, Ho Chi Minh"
                    className={`pl-10 border-orange-200 focus:border-orange-500 min-h-[60px] ${
                      errors.address ? "border-red-500" : ""
                    }`}
                    {...register("address")}
                  />
                </div>
                {errors.address && (
                  <p className="text-red-600 text-xs">
                    {errors.address.message}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="password"
                  className="text-orange-900 font-medium text-sm"
                >
                  Password
                </Label>
                <div className="relative">
                  <Lock
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-600"
                    size={18}
                  />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className={`pl-10 pr-10 border-orange-200 focus:border-orange-500 h-11 ${
                      errors.password ? "border-red-500" : ""
                    }`}
                    {...register("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-orange-600 hover:text-orange-700 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-600 text-xs">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="confirmPassword"
                  className="text-orange-900 font-medium text-sm"
                >
                  Confirm Password
                </Label>
                <div className="relative">
                  <Lock
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-600"
                    size={18}
                  />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    className={`pl-10 pr-10 border-orange-200 focus:border-orange-500 h-11 ${
                      errors.confirmPassword ? "border-red-500" : ""
                    }`}
                    {...register("confirmPassword")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-orange-600 hover:text-orange-700 transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-600 text-xs">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={registerMutation.isPending}
                className="w-full bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white font-semibold py-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 mt-6"
              >
                {registerMutation.isPending ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Creating Account...
                  </span>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>

            {/* Footer */}
            <div className="mt-6 text-center">
              <p className="text-sm text-orange-700">
                Already have an account?{" "}
                <Link
                  to={ROUTER_URL.CLIENT_ROUTER.LOGIN}
                  className="font-semibold text-orange-600 hover:text-orange-700 transition-colors"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </div>

          {/* Bottom Text */}
          <div className="mt-6 text-center">
            <p className="text-xs text-orange-600 flex items-center justify-center gap-2">
              <Coffee size={14} />
              <span>FranchisePlus Coffee - Premium Coffee Experience</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientRegister;
