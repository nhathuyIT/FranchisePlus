import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import type { Customer } from "@/types/customer";
import { CustomerDataMock } from "@/const/customer.const";

interface CustomerFormData {
  name: string;
  phone: string;
  email: string;
  avatar_url: string;
}

export default function EditCustomer() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [formData, setFormData] = useState<CustomerFormData>({
    name: "",
    phone: "",
    email: "",
    avatar_url: "",
  });
  const [errors, setErrors] = useState<Partial<CustomerFormData>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingCustomer, setIsLoadingCustomer] = useState(true);

  useEffect(() => {
    const loadCustomer = async () => {
      try {
        // In real app, this would be an API call
        const foundCustomer = CustomerDataMock.find(
          (c) => c.id.toString() === id,
        );

        if (foundCustomer) {
          setCustomer(foundCustomer);
          setFormData({
            name: foundCustomer.name,
            phone: foundCustomer.phone,
            email: foundCustomer.email || "",
            avatar_url: foundCustomer.avatar_url || "",
          });
        } else {
          // Customer not found, redirect to list
          navigate("/admin/user-control");
        }
      } catch (error) {
        console.error("Error loading customer:", error);
        navigate("/admin/user-control");
      } finally {
        setIsLoadingCustomer(false);
      }
    };

    if (id) {
      loadCustomer();
    }
  }, [id, navigate]);

  const validateForm = (): boolean => {
    const newErrors: Partial<CustomerFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[0-9]{10,11}$/.test(formData.phone.replace(/\s/g, ""))) {
      newErrors.phone = "Invalid phone number format";
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name as keyof CustomerFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !customer) {
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // In real app, this would be an API call
      const updatedCustomer: Customer = {
        ...customer,
        name: formData.name,
        phone: formData.phone,
        email: formData.email || null,
        avatar_url: formData.avatar_url || customer.avatar_url,
        updated_at: new Date().toISOString(),
      };

      console.log("Updating customer:", updatedCustomer);

      // Navigate back to list
      navigate("/admin/user-control");
    } catch (error) {
      console.error("Error updating customer:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingCustomer) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading customer...</p>
        </div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] p-8 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Customer not found
          </h2>
          <Link
            to="/admin/user-control"
            className="px-4 py-2 bg-gray-900 text-white rounded hover:bg-gray-800 transition-colors"
          >
            Back to Customer List
          </Link>
        </div>
      </div>
    );
  }

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
          <h1 className="text-3xl font-bold text-gray-900">Edit Customer</h1>
        </div>

        <div className="bg-white rounded-lg shadow p-8">
          <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
            <img
              src={
                customer.avatar_url ||
                `https://api.dicebear.com/7.x/avataaars/svg?seed=${customer.name}`
              }
              alt={customer.name}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {customer.name}
              </h2>
              <p className="text-gray-600">Customer ID: {customer.id}</p>
              <p className="text-sm text-gray-500">
                Created: {new Date(customer.created_at).toLocaleDateString()}
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
                placeholder="Enter customer's full name"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number *
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 ${
                  errors.phone ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="0901234567"
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="customer@example.com (optional)"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Avatar URL
              </label>
              <input
                type="url"
                name="avatar_url"
                value={formData.avatar_url}
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
                disabled={isLoading}
                className="px-6 py-2 bg-gray-900 text-white rounded hover:bg-gray-800 disabled:bg-gray-400 transition-colors"
              >
                {isLoading ? "Updating..." : "Update Customer"}
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
