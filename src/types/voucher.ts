import type { ID, BaseTimestamp, SoftDeletable, Activatable } from "./common";

export type VoucherType = "PERCENT" | "FIXED";

export interface Voucher extends BaseTimestamp, SoftDeletable, Activatable {
  id: ID;
  code: string;
  name: string;
  franchiseId: ID;
  franchiseName: string; // Tên franchise
  productFranchiseId: ID | null;
  productId: ID | null; // ID của product
  productName: string; // Tên product
  type: VoucherType;
  value: number;
  quotaTotal: number;
  quotaUsed: number;
  startTime: string;
  endTime: string;
}
