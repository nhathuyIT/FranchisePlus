export type OrderType = "ONLINE" | "IN_STORE";
export type OrderStatus = "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";

export interface Order {
  id: number;
  code: string;
  franchiseId: number;
  customerId: number;
  type: OrderType;
  status: OrderStatus;
  totalAmount: number;
  confirmedAt: string | null;
  completedAt: string | null;
  cancelledAt: string | null;
  createdBy: number;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export const ORDERS: Order[] = [
  {
    id: 1,
    code: "ORD-20250101-001",
    franchiseId: 1,
    customerId: 101,
    type: "ONLINE",
    status: "COMPLETED",
    totalAmount: 138000,
    confirmedAt: "2025-01-01T10:05:00",
    completedAt: "2025-01-01T10:25:00",
    cancelledAt: null,
    createdBy: 101,
    isDeleted: false,
    createdAt: "2025-01-01T10:00:00",
    updatedAt: "2025-01-01T10:25:00",
  },
  {
    id: 2,
    code: "ORD-20250102-002",
    franchiseId: 1,
    customerId: 101,
    type: "ONLINE",
    status: "PENDING",
    totalAmount: 49000,
    confirmedAt: null,
    completedAt: null,
    cancelledAt: null,
    createdBy: 101,
    isDeleted: false,
    createdAt: "2025-01-02T14:20:00",
    updatedAt: "2025-01-02T14:20:00",
  },
];
