import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordSchema } from "./schema";
import type { ForgotPasswordValues } from "./schema";

const ForgotPassword = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = (data: ForgotPasswordValues) => {
    console.log("Gửi yêu cầu khôi phục tới:", data.email);
    alert("Vui lòng check email!");
  };

  return (
    <div className="p-8 max-w-md mx-auto mt-20 bg-white rounded-2xl shadow-lg border border-gray-100">
      <h2 className="text-2xl font-bold text-center mb-6">Quên mật khẩu?</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Email đăng ký</label>
          <input {...register("email")} placeholder="name@example.com" className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-orange-500" />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
        </div>
        <button type="submit" className="w-full bg-orange-600 text-white font-bold py-3 rounded-xl hover:bg-orange-700 transition-all">
          Gửi yêu cầu
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;