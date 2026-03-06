import { UserSchema, type UserFormData } from "@/lib/schemas/user.schema";
import type { FieldConfig } from "@/lib/form/field-config";

/**
 * User form field configurations for FormDialog
 */
export const userFields: FieldConfig<UserFormData>[] = [
  {
    name: "name",
    type: "text",
    label: "Full Name",
    placeholder: "Enter user's full name",
    required: true,
  },
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
    placeholder: "Minimum 6 characters",
    description: "Leave empty to keep the current password when editing",
  },
  {
    name: "phone",
    type: "text",
    label: "Phone Number",
    placeholder: "e.g., 0901234567",
    description: "Contact phone number (10-11 digits)",
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
    type: "switch",
    label: "Active Status",
    defaultValue: true,
    description: "Toggle user active/inactive state",
  },
];

/**
 * Re-export schema for convenience
 */
export const userSchema = UserSchema;
export type { UserFormData };
