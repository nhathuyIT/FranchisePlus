import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useUser, useUpdateUser } from "@/hooks/user";
import type { User } from "@/types/user.type";

interface UserFormData {
  name: string;
  phone: string;
  email: string;
  avatarUrl: string;
}

console.log("");
export default function EditCustomer() {
  const { id } = useParams<{ id: string }>();
  const { data: user, isLoading: isLoadingUser } = useUser(id ?? "");

  if (isLoadingUser) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading user...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] p-8 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            User not found
          </h2>
          <Link
            to="/admin/user-control"
            className="px-4 py-2 bg-gray-900 text-white rounded hover:bg-gray-800 transition-colors"
          >
            Back to User List
          </Link>
        </div>
      </div>
    );
  }

  return <EditForm user={user} />;
}

function EditForm({ user }: { user: User }) {
  const navigate = useNavigate();
  const updateUser = useUpdateUser();

  const [formData, setFormData] = useState<UserFormData>({
    name: user.name,
    phone: user.phone ?? "",
    email: user.email ?? "",
    avatarUrl: user.avatarUrl ?? "",
  });
  const [errors, setErrors] = useState<Partial<UserFormData>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<UserFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (
      formData.phone &&
      !/^[0-9]{10,11}$/.test(formData.phone.replace(/\s/g, ""))
    ) {
      newErrors.phone = "Invalid phone number format";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name as keyof UserFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    updateUser.mutate(
      {
        id: user.id,
        data: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone || undefined,
          avatarUrl: formData.avatarUrl || undefined,
        },
      },
      {
        onSuccess: () => {
          navigate("/admin/user-control");
        },
      },
    );
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] p-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link
            to="/admin/user-control"
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
          >
            ← Back
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Edit User</h1>
        </div>

        <div className="bg-white rounded-lg shadow p-8">
          <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
            <img
              src={
                user.avatarUrl ||
                `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`
              }
              alt={user.name}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {user.name}
              </h2>
              <p className="text-gray-600">User ID: {user.id}</p>
              <p className="text-sm text-gray-500">
                Created: {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 ${
                  errors.name ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter user's full name"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="user@example.com"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 ${
                  errors.phone ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="0901234567 (optional)"
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Avatar URL
              </label>
              <input
                type="url"
                name="avatarUrl"
                value={formData.avatarUrl}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                placeholder="https://example.com/avatar.jpg (optional)"
              />
              <p className="text-gray-500 text-sm mt-1">
                Leave empty to keep current avatar
              </p>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={updateUser.isPending}
                className="px-6 py-2 bg-gray-900 text-white rounded hover:bg-gray-800 disabled:bg-gray-400 transition-colors"
              >
                {updateUser.isPending ? "Updating..." : "Update User"}
              </button>
              <Link
                to="/admin/user-control"
                className="px-6 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
