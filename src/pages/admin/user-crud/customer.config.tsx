import type { CrudConfig } from "@/lib/crud/types";
import {
  CustomerSchema,
  type CustomerFormData,
} from "@/lib/schemas/customer.schema";
import type { Customer } from "@/types/customer";

/**
 * Customer CRUD configuration
 * Defines form fields, validation, and API endpoints
 */
export const customerConfig: CrudConfig<Customer, CustomerFormData> = {
  entityName: "Customer",
  entityNamePlural: "Customers",

  fields: [
    {
      name: "name",
      type: "text",
      label: "Customer Name",
      placeholder: "Enter customer name",
      required: true,
    },
    {
      name: "phone",
      type: "text",
      label: "Phone Number",
      placeholder: "e.g., 0901234567",
      required: true,
      description: "Unique phone number for the customer",
    },
    {
      name: "email",
      type: "text",
      label: "Email Address",
      placeholder: "customer@example.com",
      description: "Customer email (optional)",
    },
    {
      name: "avatarUrl",
      type: "image-upload",
      label: "Avatar",
      placeholder: "Enter avatar URL or upload",
      description: "Upload customer avatar (optional)",
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
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 800));

      const newCustomer: Customer = {
        id: Date.now(),
        name: data.name,
        phone: data.phone,
        email: data.email || null,
        avatarUrl: data.avatarUrl || null,
        isActive: data.isActive,
        isDeleted: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      return newCustomer;
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
      name: entity.name,
      phone: entity.phone,
      email: entity.email || "",
      avatarUrl: entity.avatarUrl || "",
      isActive: entity.isActive,
    }),
    fromForm: (formData) => ({
      name: formData.name,
      phone: formData.phone,
      email: formData.email || null,
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
