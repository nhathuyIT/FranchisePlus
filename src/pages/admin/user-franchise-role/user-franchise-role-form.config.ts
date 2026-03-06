import {
  UserFranchiseRoleSchema,
  type UserFranchiseRoleFormData,
} from "@/lib/schemas/user-franchise-role.schema";
import type { FieldConfig } from "@/lib/form/field-config";
import type { SelectOption } from "@/lib/form/field-config";
import * as userApi from "@/api/user/user.api";

/**
 * Build form fields for user–franchise–role assignment.
 *
 * @param roleOptions   - Pre-loaded roles for the select dropdown
 * @param franchiseOptions - Pre-loaded franchises for the select dropdown
 */
export const buildUserFranchiseRoleFields = (
  roleOptions: SelectOption<string>[],
  franchiseOptions: SelectOption<string>[],
): FieldConfig<UserFranchiseRoleFormData>[] => [
  {
    name: "userId",
    type: "async-select",
    label: "User",
    placeholder: "Search user by name or email...",
    required: true,
    description: "Select an internal user to assign the role to",
    asyncOptions: {
      loader: async (searchTerm) => {
        const result = await userApi.search({
          searchCondition: {
            keyword: searchTerm,
            isActive: true,
            isDeleted: false,
          },
          pageInfo: { pageNum: 1, pageSize: 20 },
        });
        return result.pageData.map((u) => ({
          label: `${u.name} (${u.email})`,
          value: u.id,
        }));
      },
      debounceMs: 300,
      minChars: 0,
    },
  },
  {
    name: "franchiseId",
    type: "select",
    label: "Franchise",
    placeholder: "Select franchise (leave empty for global role)",
    description:
      "Select the franchise this role is scoped to. Leave blank for a global role.",
    options: [
      { label: "— Global (no franchise) —", value: "__global__" },
      ...franchiseOptions,
    ],
  },
  {
    name: "roleId",
    type: "select",
    label: "Role",
    placeholder: "Select role",
    required: true,
    options: roleOptions,
  },
];

export const userFranchiseRoleSchema = UserFranchiseRoleSchema;
export type { UserFranchiseRoleFormData };
