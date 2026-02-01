import type { ID } from "./common";

export type Role = {
  ADMIN: "admin";
  MANAGER: "manager";
  STAFF: "staff";
  CUSTOMER: "customer";
};
export type Tier = {
  BRONZE: "bronze";
  SILVER: "silver";
  GOLD: "gold";
  PLATINUM: "platinum";
};
export interface User {
  id: ID;
  name: string;
  email: string;
  password: string;
  role: Role;
  address?: string;
  loyalPoints: number;
  tier: Tier;
  avatarUrl?: string;
}
