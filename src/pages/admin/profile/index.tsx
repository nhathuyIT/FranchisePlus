import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore } from "@/stores/auth-store";
import { profileSchema } from "./schema";
import type { ProfileFormValues } from "./schema"; // Fix verbatimModuleSyntax

const AdminProfile = () => {
  const { user } = useAuthStore();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      address: user?.address || "",
    },
  });

  // Đồng bộ form khi store thay đổi
  useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        email: user.email,
        address: user.address || "",
      });
    }
  }, [user, reset]);

  const onSubmit = (data: ProfileFormValues) => {
    console.log("Cập nhật Profile thành công:", data);
  };

  return (
    <div className="p-6 max-w-2xl bg-white rounded-xl shadow border border-amber-100">
      <h1 className="text-2xl font-bold mb-6 text-amber-950 font-sans">Hồ sơ cá nhân</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold mb-1 text-amber-900">Họ và tên</label>
          <input 
            {...register("name")} 
            className="w-full p-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none" 
          />
          {errors.name && <p className="text-red-500 text-xs mt-1 font-medium">{errors.name.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1 text-amber-900 font-sans">Email</label>
          <input 
            {...register("email")} 
            disabled 
            className="w-full p-2 border bg-amber-50/50 text-amber-600 rounded-lg cursor-not-allowed font-mono" 
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1 text-amber-900">Địa chỉ</label>
          <input 
            {...register("address")} 
            className="w-full p-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none" 
          />
        </div>
        <button 
          type="submit" 
          disabled={!isDirty} 
          className="bg-amber-600 text-white px-6 py-2 rounded-lg font-bold disabled:bg-gray-300 transition-all hover:bg-amber-700 active:scale-95"
        >
          Lưu thay đổi
        </button>
      </form>
    </div>
  );
};

export default AdminProfile;