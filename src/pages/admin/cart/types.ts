import type { CartStatus } from "@/types/cart";

export type CustomerStatusFilter = "all" | CartStatus;

export interface CartLookupUser {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
}
