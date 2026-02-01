export type OrderType = "ONLINE" | "IN_STORE";
export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "COMPLETED"
  | "CANCELLED";

export interface Order {
  id: number;
  code: string;
  franchise_id: number;
  customer_id: number;
  type: OrderType;
  status: OrderStatus;
  total_amount: number;
  confirmed_at: string | null;
  completed_at: string | null;
  cancelled_at: string | null;
  created_by: number;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

export const ORDERS: Order[] = [
  {
    id: 1,
    code: "ORD-20250101-001",
    franchise_id: 1,
    customer_id: 101,
    type: "ONLINE",
    status: "COMPLETED",
    total_amount: 138000,
    confirmed_at: "2025-01-01T10:05:00",
    completed_at: "2025-01-01T10:25:00",
    cancelled_at: null,
    created_by: 101,
    is_deleted: false,
    created_at: "2025-01-01T10:00:00",
    updated_at: "2025-01-01T10:25:00",
  },
  {
    id: 2,
    code: "ORD-20250102-002",
    franchise_id: 1,
    customer_id: 101,
    type: "ONLINE",
    status: "PENDING",
    total_amount: 49000,
    confirmed_at: null,
    completed_at: null,
    cancelled_at: null,
    created_by: 101,
    is_deleted: false,
    created_at: "2025-01-02T14:20:00",
    updated_at: "2025-01-02T14:20:00",
  },
];
