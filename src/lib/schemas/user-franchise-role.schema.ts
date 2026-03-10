import { z } from "zod";

/**
 * User–Franchise–Role assignment form schema
 */
export const UserFranchiseRoleSchema = z.object({
  userId: z.string().min(1, "Please select a user"),

  franchiseId: z.string().nullable().optional(),

  roleId: z.string("Please select a role").min(1, "Please select a role"),
});

export type UserFranchiseRoleFormData = z.infer<typeof UserFranchiseRoleSchema>;
