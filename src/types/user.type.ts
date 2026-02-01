import type { ID } from "./common";

export type Role = "admin" | "manager" | "staff" | "customer";

export type Tier = "bronze" | "silver" | "gold" | "platinum";

export interface User {
  id: ID;
  name: string;
  email: string;
  password: string;
  role: Role;
  address?: string;
  loyalPoints: number | null;
  tier: Tier | null;
  avatarUrl?: string;
}
