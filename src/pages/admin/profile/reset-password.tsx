import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "react-router-dom";
import { resetPasswordSchema } from "./schema";
import type { ResetPasswordValues } from "./schema";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const { register, handleSubmit, formState: { errors } } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = (data: ResetPasswordValues) => {
    console.log("Token:", token, "Mật khẩu mới:", data.password);
    alert("Thành công!");
  };

  return (
    <div className="p-8 max-w-md mx-auto mt-20 bg-white rounded-2xl shadow-lg border border-gray-100">
      <h2 className="text-2xl font-bold text-center mb-6">Đặt lại mật khẩu</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Mật khẩu mới</label>
          <input type="password" {...register("password")} className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-orange-500" />
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Xác nhận mật khẩu</label>
          <input type="password" {...register("confirmPassword")} className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-orange-500" />
          {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
        </div>
        <button type="submit" className="w-full bg-orange-600 text-white font-bold py-3 rounded-xl hover:bg-orange-700 transition-all">
          Cập nhật mật khẩu
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;