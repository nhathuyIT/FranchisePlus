import type { CrudConfig } from "@/lib/crud/types";
import { FranchiseSchema, type FranchiseFormData } from "@/lib/schemas/franchise.schema";
import type { Franchise } from "@/types/franchise";
import * as franchiseApi from "@/api/franchise/franchise.api";
import type {
  FranchiseCreateRequest,
  FranchiseUpdateRequest,
} from "@/api/franchise/franchise.type";

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
      name: "hotline",
      type: "text",
      label: "Hotline",
      placeholder: "e.g., 0909123456",
      description: "Contact phone number (10-11 digits)",
    },
    {
      name: "logoUrl",
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
      name: "openedAt",
      type: "time",
      label: "Opening Time",
      placeholder: "e.g., 08:00",
      description: "Daily opening time (HH:mm format)",
    },
    {
      name: "closedAt",
      type: "time",
      label: "Closing Time",
      placeholder: "e.g., 22:00",
      description: "Daily closing time (HH:mm format)",
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

  schema: FranchiseSchema,

  api: {
    create: async (data) => {
      const apiData: FranchiseCreateRequest = {
        code: data.code,
        name: data.name,
        hotline: data.hotline || undefined,
        logoUrl: data.logoUrl || null,
        address: data.address,
        openedAt: data.openedAt || null,
        closedAt: data.closedAt || null,
      };

      const response = await franchiseApi.create(apiData);

      if (!response) {
        throw new Error("Failed to create franchise");
      }

      if (response.isActive === data.isActive) {
        return response;
      }

      await franchiseApi.updateStatus(response.id, { isActive: data.isActive });

      const fresh = await franchiseApi.getById(response.id);

      if (!fresh) {
        throw new Error("Failed to load created franchise");
      }

      return fresh;
    },

    update: async (_id, data) => {
      const apiData: FranchiseUpdateRequest = {
        code: data.code,
        name: data.name,
        hotline: data.hotline || undefined,
        logoUrl: data.logoUrl || null,
        address: data.address,
        openedAt: data.openedAt || null,
        closedAt: data.closedAt || null,
      };

      const response = await franchiseApi.update(String(_id), apiData);

      if (!response) {
        throw new Error("Failed to update franchise");
      }

      if (response.isActive === data.isActive) {
        return response;
      }

      await franchiseApi.updateStatus(String(_id), { isActive: data.isActive });

      const fresh = await franchiseApi.getById(String(_id));

      if (!fresh) {
        throw new Error("Failed to load updated franchise");
      }

      return fresh;
    },

    delete: async (_id) => {
      await franchiseApi.remove(String(_id));
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
      hotline: entity.hotline || "",
      logoUrl: entity.logoUrl || "",
      address: entity.address,
      openedAt: entity.openedAt || "",
      closedAt: entity.closedAt || "",
      isActive: entity.isActive,
    }),
    fromForm: (formData) => ({
      code: formData.code,
      name: formData.name,
      hotline: formData.hotline || undefined,
      logoUrl: formData.logoUrl || undefined,
      address: formData.address,
      openedAt: formData.openedAt || undefined,
      closedAt: formData.closedAt || undefined,
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
