export interface RoleSelectItem {
  value: string; // MongoDB ObjectId
  name: string;
  code: string;
  scope: "GLOBAL" | "FRANCHISE";
}

export type RoleListResponse = RoleSelectItem[];
