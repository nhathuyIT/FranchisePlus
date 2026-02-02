import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { changePasswordSchema } from "./schema";
import type { ChangePasswordValues } from "./schema";

const ChangePassword = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<ChangePasswordValues>({
    resolver: zodResolver(changePasswordSchema),
  });

  const onSubmit = (data: ChangePasswordValues) => {
    console.log("Đổi mật khẩu:", data);
  };

  return (
    <div className="p-6 max-w-md bg-white rounded-xl shadow border border-gray-100">
      <h1 className="text-2xl font-bold mb-6">Đổi mật khẩu</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Mật khẩu cũ</label>
          <input type="password" {...register("oldPassword")} className="w-full p-2 border rounded outline-none focus:ring-2 focus:ring-orange-500" />
          {errors.oldPassword && <p className="text-red-500 text-xs mt-1">{errors.oldPassword.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Mật khẩu mới</label>
          <input type="password" {...register("newPassword")} className="w-full p-2 border rounded outline-none focus:ring-2 focus:ring-orange-500" />
          {errors.newPassword && <p className="text-red-500 text-xs mt-1">{errors.newPassword.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Xác nhận mật khẩu mới</label>
          <input type="password" {...register("confirmPassword")} className="w-full p-2 border rounded outline-none focus:ring-2 focus:ring-orange-500" />
          {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
        </div>
        <button type="submit" className="w-full bg-black text-white py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors">
          Cập nhật mật khẩu
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;