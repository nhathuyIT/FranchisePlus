import type { CrudConfig } from "@/lib/crud/types";
import {
  CustomerSchema,
  type CustomerFormData,
} from "@/lib/schemas/customer.schema";
import type { Customer } from "@/types/customer";
import { create as createUser } from "@/api/user/user.api";

/**
 * Customer CRUD configuration
 * Defines form fields, validation, and API endpoints
 */
export const customerConfig: CrudConfig<Customer, CustomerFormData> = {
  entityName: "Customer",
  entityNamePlural: "Customers",

  fields: [
    {
      name: "email",
      type: "text",
      label: "Email Address",
      placeholder: "user@example.com",
      required: true,
    },
    {
      name: "password",
      type: "text",
      label: "Password",
      placeholder: "Enter password (min 6 characters)",
      required: true,
      description: "Default password for the new user",
    },
    {
      name: "name",
      type: "text",
      label: "Full Name",
      placeholder: "Enter user name",
    },
    {
      name: "phone",
      type: "text",
      label: "Phone Number",
      placeholder: "e.g., 0901234567",
    },
    {
      name: "avatarUrl",
      type: "image-upload",
      label: "Avatar",
      placeholder: "Enter avatar URL or upload",
      description: "Upload user avatar (optional)",
    },
    {
      name: "isActive",
      type: "select",
      label: "Status",
      required: true,
      options: [
        { label: "Active", value: true },
        { label: "Inactive", value: false },
      ],
    },
  ],

  schema: CustomerSchema,

  api: {
    create: async (data) => {
      const response = await createUser({
        email: data.email || "",
        password: data.password || "12345678",
        name: data.name || "",
        phone: data.phone || "",
        avatar_url: data.avatarUrl || "",
      });

      // Map API response (snake_case) → Customer (camelCase)
      return {
        id: response?.id as unknown as Customer["id"],
        name: response?.name,
        phone: response.phone,
        email: response.email || null,
        avatarUrl: response.avatar_url || null,
        isActive: response.is_active,
        isDeleted: response.is_deleted,
        createdAt: response.created_at,
        updatedAt: response.updated_at,
      } as Customer;
    },

    update: async (_id, data) => {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 800));

      return {
        id: Number(_id),
        name: data.name,
        phone: data.phone,
        email: data.email || null,
        avatarUrl: data.avatarUrl || null,
        isActive: data.isActive,
        isDeleted: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as Customer;
    },

    delete: async (_id) => {
      // TODO: Replace with actual API call
      console.log(_id);
      await new Promise((resolve) => setTimeout(resolve, 500));
    },
  },

  dialog: {
    size: "lg",
    deleteMessage: (customer) =>
      `Are you sure you want to delete "${customer.name}"? This action cannot be undone and will affect all associated data.`,
  },

  transform: {
    toForm: (entity) => ({
      email: entity.email || "",
      password: "",
      name: entity.name,
      phone: entity.phone,
      avatarUrl: entity.avatarUrl || "",
      isActive: entity.isActive,
    }),
    fromForm: (formData) => ({
      email: formData.email || null,
      name: formData.name,
      phone: formData.phone,
      avatarUrl: formData.avatarUrl || null,
      isActive: formData.isActive,
    }),
  },

  features: {
    create: true,
    update: true,
    delete: true,
    view: true,
    bulkDelete: false,
  },
};
