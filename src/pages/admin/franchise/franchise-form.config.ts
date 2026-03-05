import {
  FranchiseSchema,
  type FranchiseFormData,
} from "@/lib/schemas/franchise.schema";
import type { FieldConfig } from "@/lib/form/field-config";

/**
 * Franchise form field configurations for FormDialog
 */
export const franchiseFields: FieldConfig<FranchiseFormData>[] = [
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
    type: "switch",
    label: "Active Status",
    defaultValue: true,
    description: "Toggle franchise active/inactive state",
  },
];

/**
 * Re-export schema for convenience
 */
export const franchiseSchema = FranchiseSchema;
export type { FranchiseFormData };
