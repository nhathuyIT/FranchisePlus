import type { CartStatus } from "@/types/cart";

export type CustomerStatusFilter = "all" | CartStatus;

export interface CartLookupUser {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
}

export interface AdminCartNavigationState {
  selectedUser?: CartLookupUser | null;
  selectedCartId?: string | null;
  customerStatus?: CustomerStatusFilter;
}

export interface PosCategoryTab {
  id: string;
  name: string;
  count: number;
}

export interface PosDraftCartOption {
  id: string;
  productId: string;
  productFranchiseId: string;
  productName: string;
  sizeLabel: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

export interface PosDraftCartItem {
  id: string;
  productId: string;
  productFranchiseId: string;
  productName: string;
  sizeLabel: string;
  price: number;
  quantity: number;
  note: string;
  imageUrl?: string;
  isHaveTopping: boolean;
  options: PosDraftCartOption[];
}
