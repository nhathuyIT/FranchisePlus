import type { CrudConfig } from "@/lib/crud/types";
import { FranchiseSchema, type FranchiseFormData } from "@/lib/schemas/franchise.schema";
import type { Franchise } from "@/types/franchise";

/**
 * Franchise CRUD configuration
 * Defines form fields, validation, and API endpoints
 */
export const franchiseConfig: CrudConfig<Franchise, FranchiseFormData> = {
  entityName: "Franchise",
  entityNamePlural: "Franchises",

  fields: [
    {
      name: "code",
      type: "text",
      label: "Franchise Code",
      placeholder: "e.g., CF-D1-001",
      required: true,
      description: "Unique identifier for the franchise",
    },
    {
      name: "name",
      type: "text",
      label: "Franchise Name",
      placeholder: "Enter franchise name",
      required: true,
    },
    {
      name: "logo_url",
      type: "image-upload",
      label: "Logo",
      placeholder: "Enter logo URL or upload",
      description: "Upload franchise logo (optional)",
    },
    {
      name: "address",
      type: "textarea",
      label: "Address",
      placeholder: "Enter full address",
      required: true,
      rows: 3,
    },
    {
      name: "opened_at",
      type: "date",
      label: "Opening Date",
      description: "Date the franchise started operations",
    },
    {
      name: "closed_at",
      type: "date",
      label: "Closing Date",
      description: "Leave empty if franchise is still active",
      hidden: (form) => form.watch("is_active") === true,
    },
    {
      name: "is_active",
      type: "select",
      label: "Status",
      required: true,
      options: [
        { label: "Active", value: true },
        { label: "Inactive", value: false },
      ],
    },
  ],

  schema: FranchiseSchema,

  api: {
    create: async (data) => {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 800));

      const newFranchise: Franchise = {
        id: Date.now(),
        code: data.code,
        name: data.name,
        logo_url: data.logo_url || null,
        address: data.address,
        opened_at: data.opened_at || null,
        closed_at: data.closed_at || null,
        is_active: data.is_active,
        is_deleted: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      return newFranchise;
    },

    update: async (_id, data) => {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 800));

      return {
        id: Number(_id),
        code: data.code,
        name: data.name,
        logo_url: data.logo_url || null,
        address: data.address,
        opened_at: data.opened_at || null,
        closed_at: data.closed_at || null,
        is_active: data.is_active,
        is_deleted: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      } as Franchise;
    },

    delete: async (_id) => {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 500));
    },
  },

  dialog: {
    size: "lg",
    deleteMessage: (franchise) =>
      `Are you sure you want to delete "${franchise.name}"? This action cannot be undone and will affect all associated data.`,
  },

  transform: {
    toForm: (entity) => ({
      code: entity.code,
      name: entity.name,
      logo_url: entity.logo_url || "",
      address: entity.address,
      opened_at: entity.opened_at || "",
      closed_at: entity.closed_at || "",
      is_active: entity.is_active,
    }),
    fromForm: (formData) => ({
      code: formData.code,
      name: formData.name,
      logo_url: formData.logo_url || null,
      address: formData.address,
      opened_at: formData.opened_at || null,
      closed_at: formData.closed_at || null,
      is_active: formData.is_active,
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
