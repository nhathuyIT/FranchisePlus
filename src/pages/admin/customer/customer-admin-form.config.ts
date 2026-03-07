import {
  CustomerAdminSchema,
  type CustomerAdminFormData,
} from "@/lib/schemas/customer-admin.schema";
import type { FieldConfig } from "@/lib/form/field-config";

/**
 * Customer admin form field configurations for FormDialog
 *
 * Admin can EDIT customers but not CREATE them (customers self-register).
 * isVerified is read-only — displayed as a badge in the table, not in the form.
 */
export const customerAdminFields: FieldConfig<CustomerAdminFormData>[] = [
  {
    name: "name",
    type: "text",
    label: "Full Name",
    placeholder: "Enter customer's full name",
    required: true,
  },
  {
    name: "email",
    type: "text",
    label: "Email",
    placeholder: "e.g., customer@email.com",
    description: "Customer's registered email address",
  },
  {
    name: "phone",
    type: "text",
    label: "Phone Number",
    placeholder: "e.g., 0909123456",
    description: "10-11 digit phone number",
  },
  {
    name: "address",
    type: "textarea",
    label: "Address",
    placeholder: "Enter customer's full address",
    rows: 3,
  },
  {
    name: "avatarUrl",
    type: "image-upload",
    label: "Avatar",
    placeholder: "Upload or enter avatar URL",
    description: "Customer profile picture",
  },
  {
    name: "isActive",
    type: "switch",
    label: "Active Status",
    defaultValue: true,
    description: "Toggle customer account active/inactive state",
  },
];

export const customerAdminSchema = CustomerAdminSchema;
export type { CustomerAdminFormData };
