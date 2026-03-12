export type OrderType = "ONLINE" | "IN_STORE";
export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "SHIPPING"
  | "COMPLETED"
  | "CANCELLED"
  | "REFUNDED";

export interface OrderItemData {
  id: number;
  name: string;
  variant: string;
  quantity: number;
  price: number;
  imageUrl: string;
}

export interface Order {
  id: number;
  code: string;
  franchiseId: number;
  franchiseName: string;
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
  items: OrderItemData[];
}

export const ORDER_STATUS_TABS: { key: OrderStatus | "ALL"; label: string }[] =
  [
    { key: "ALL", label: "Tất cả" },
    { key: "PENDING", label: "Chờ thanh toán" },
    { key: "CONFIRMED", label: "Vận chuyển" },
    { key: "SHIPPING", label: "Chờ giao hàng" },
    { key: "COMPLETED", label: "Hoàn thành" },
    { key: "CANCELLED", label: "Đã hủy" },
    { key: "REFUNDED", label: "Trả hàng/Hoàn tiền" },
  ];

export const ORDER_STATUS_STYLES: Record<
  OrderStatus,
  { label: string; color: string }
> = {
  PENDING: { label: "Chờ thanh toán", color: "text-yellow-600" },
  CONFIRMED: { label: "Đã xác nhận", color: "text-blue-600" },
  SHIPPING: { label: "Đang giao hàng", color: "text-orange-500" },
  COMPLETED: { label: "Hoàn thành", color: "text-green-600" },
  CANCELLED: { label: "Đã hủy", color: "text-red-500" },
  REFUNDED: { label: "Trả hàng/Hoàn tiền", color: "text-gray-500" },
};

export const ORDERS: Order[] = [
  {
    id: 1,
    code: "ORD-20250301-001",
    franchiseId: 1,
    franchiseName: "GOAT Coffee - Quận 1",
    customerId: 101,
    type: "ONLINE",
    status: "COMPLETED",
    totalAmount: 138000,
    confirmedAt: "2025-03-01T10:05:00",
    completedAt: "2025-03-01T10:25:00",
    cancelledAt: null,
    createdBy: 101,
    isDeleted: false,
    createdAt: "2025-03-01T10:00:00",
    updatedAt: "2025-03-01T10:25:00",
    items: [
      {
        id: 1,
        name: "Cà Phê Sữa Đá",
        variant: "Size L",
        quantity: 2,
        price: 39000,
        imageUrl:
          "https://images.unsplash.com/photo-1514432324607-a09d9b4aefda?w=100&q=80",
      },
      {
        id: 2,
        name: "Bạc Xỉu",
        variant: "Size M",
        quantity: 1,
        price: 35000,
        imageUrl:
          "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=100&q=80",
      },
      {
        id: 3,
        name: "Croissant Bơ",
        variant: "Hộp 2 cái",
        quantity: 1,
        price: 25000,
        imageUrl:
          "https://images.unsplash.com/photo-1555507036-ab1f4038024a?w=100&q=80",
      },
    ],
  },
  {
    id: 2,
    code: "ORD-20250305-002",
    franchiseId: 1,
    franchiseName: "GOAT Coffee - Quận 1",
    customerId: 101,
    type: "ONLINE",
    status: "PENDING",
    totalAmount: 49000,
    confirmedAt: null,
    completedAt: null,
    cancelledAt: null,
    createdBy: 101,
    isDeleted: false,
    createdAt: "2025-03-05T14:20:00",
    updatedAt: "2025-03-05T14:20:00",
    items: [
      {
        id: 4,
        name: "Latte Caramel",
        variant: "Size L, Ít đường",
        quantity: 1,
        price: 49000,
        imageUrl:
          "https://images.unsplash.com/photo-1485808191679-5f86510681a2?w=100&q=80",
      },
    ],
  },
  {
    id: 3,
    code: "ORD-20250308-003",
    franchiseId: 2,
    franchiseName: "GOAT Coffee - Quận 3",
    customerId: 101,
    type: "ONLINE",
    status: "SHIPPING",
    totalAmount: 176000,
    confirmedAt: "2025-03-08T09:10:00",
    completedAt: null,
    cancelledAt: null,
    createdBy: 101,
    isDeleted: false,
    createdAt: "2025-03-08T09:00:00",
    updatedAt: "2025-03-08T09:10:00",
    items: [
      {
        id: 5,
        name: "Cappuccino",
        variant: "Size M",
        quantity: 2,
        price: 45000,
        imageUrl:
          "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=100&q=80",
      },
      {
        id: 6,
        name: "Bánh Mì Chả Lụa",
        variant: "Đặc biệt",
        quantity: 2,
        price: 43000,
        imageUrl:
          "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=100&q=80",
      },
    ],
  },
  {
    id: 4,
    code: "ORD-20250310-004",
    franchiseId: 1,
    franchiseName: "GOAT Coffee - Quận 1",
    customerId: 101,
    type: "ONLINE",
    status: "CANCELLED",
    totalAmount: 89000,
    confirmedAt: null,
    completedAt: null,
    cancelledAt: "2025-03-10T16:00:00",
    createdBy: 101,
    isDeleted: false,
    createdAt: "2025-03-10T15:30:00",
    updatedAt: "2025-03-10T16:00:00",
    items: [
      {
        id: 7,
        name: "Espresso Double Shot",
        variant: "Nóng",
        quantity: 1,
        price: 45000,
        imageUrl:
          "https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=100&q=80",
      },
      {
        id: 8,
        name: "Cookie Chocolate",
        variant: "Hộp 3 cái",
        quantity: 1,
        price: 44000,
        imageUrl:
          "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=100&q=80",
      },
    ],
  },
  {
    id: 5,
    code: "ORD-20250311-005",
    franchiseId: 2,
    franchiseName: "GOAT Coffee - Quận 3",
    customerId: 101,
    type: "ONLINE",
    status: "CONFIRMED",
    totalAmount: 125000,
    confirmedAt: "2025-03-11T08:15:00",
    completedAt: null,
    cancelledAt: null,
    createdBy: 101,
    isDeleted: false,
    createdAt: "2025-03-11T08:00:00",
    updatedAt: "2025-03-11T08:15:00",
    items: [
      {
        id: 9,
        name: "Mocha Hazelnut",
        variant: "Size L, Thêm shot",
        quantity: 1,
        price: 55000,
        imageUrl:
          "https://images.unsplash.com/photo-1578314675249-a6910f80cc39?w=100&q=80",
      },
      {
        id: 10,
        name: "Matcha Latte",
        variant: "Size M",
        quantity: 1,
        price: 45000,
        imageUrl:
          "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=100&q=80",
      },
      {
        id: 11,
        name: "Tiramisu Slice",
        variant: "1 miếng",
        quantity: 1,
        price: 25000,
        imageUrl:
          "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=100&q=80",
      },
    ],
  },
  {
    id: 6,
    code: "ORD-20250228-006",
    franchiseId: 1,
    franchiseName: "GOAT Coffee - Quận 1",
    customerId: 101,
    type: "ONLINE",
    status: "REFUNDED",
    totalAmount: 95000,
    confirmedAt: "2025-02-28T11:00:00",
    completedAt: null,
    cancelledAt: null,
    createdBy: 101,
    isDeleted: false,
    createdAt: "2025-02-28T10:45:00",
    updatedAt: "2025-03-02T14:00:00",
    items: [
      {
        id: 12,
        name: "Cold Brew Original",
        variant: "Size L",
        quantity: 2,
        price: 47500,
        imageUrl:
          "https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=100&q=80",
      },
    ],
  },
];
