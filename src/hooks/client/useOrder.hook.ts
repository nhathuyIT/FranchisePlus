import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/auth-store";
import type {
	Order,
	OrderItemData,
	OrderStatus,
	OrderType,
} from "@/const/order.const";
import type {
	ApiOrder,
	ApiOrderItem,
	ApiOrderStatus,
} from "@/api/order/order.api";
import {
	getOrderByCartId,
	getOrderByCode,
	getOrderById,
	getOrdersByCustomerId,
	getOrdersByFranchiseId,
} from "@/api/order/order.api";

const FALLBACK_IMAGE =
	"https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=160&q=80";

const toNumber = (value: string | number | undefined | null): number => {
	if (typeof value === "number" && Number.isFinite(value)) {
		return value;
	}

	const parsed = Number(value);
	return Number.isFinite(parsed) ? parsed : 0;
};

const mapType = (type?: string): OrderType => {
	const value = (type || "").toUpperCase();

	if (value === "IN_STORE") {
		return "IN_STORE";
	}

	// Backend currently uses POS for in-store orders.
	if (value === "POS") {
		return "IN_STORE";
	}

	return "ONLINE";
};

const mapStatus = (status?: string): OrderStatus => {
	const value = (status || "").toUpperCase();

	if (value.includes("REFUND")) return "REFUNDED";
	if (value.includes("CANCELED") || value.includes("CANCELLED") || value.includes("CANCEL")) return "CANCELLED";
	if (value.includes("OUT_FOR_DELIVERY") || value.includes("DELIVER") || value.includes("SHIP")) return "SHIPPING";
	if (value.includes("READY_FOR_PICKUP") || value.includes("PREPARING") || value.includes("CONFIRM")) return "CONFIRMED";
	if (value.includes("COMPLETE")) return "COMPLETED";

	// PREPARING/DRAFT/PENDING -> PENDING tab in UI.
	return "PENDING";
};

const mapOrderItem = (item: ApiOrderItem, index: number): OrderItemData => {
	const quantity = toNumber(item.quantity) || 1;
	const itemPrice = toNumber(item.priceSnapshot ?? item.price);
	const lineTotal = toNumber(item.lineTotal);

	return {
		id: toNumber(item.id) || index + 1,
		name: item.productNameSnapshot || item.productName || item.name || "San pham",
		variant: item.variant || item.size || "Mac dinh",
		quantity,
		price: lineTotal > 0 ? lineTotal : itemPrice,
		imageUrl:
			item.imageUrl || item.productImageUrl || item.image || FALLBACK_IMAGE,
	};
};

const mapOrder = (order: ApiOrder, index: number): Order => {
	const items = (order.items || order.orderItems || []).map(mapOrderItem);
	const totalByItems = items.reduce((sum, item) => sum + item.price, 0);
	const nowIso = new Date().toISOString();

	return {
		id: toNumber(order.id) || index + 1,
		rawId: String((order as any)._id || order.id || ""),
		code: order.code || "N/A",
		franchiseId: toNumber(order.franchiseId),
		franchiseName: order.franchiseName || order.franchise?.name || "Unknown franchise",
		customerId: toNumber(order.customerId),
		type: mapType(order.type),
		status: mapStatus(order.status),
		totalAmount: toNumber(order.totalAmount) || totalByItems,
		confirmedAt: order.confirmedAt ?? null,
		completedAt: order.completedAt ?? null,
		cancelledAt: order.cancelledAt ?? null,
		createdBy: toNumber(order.createdBy),
		isDeleted: Boolean(order.isDeleted),
		createdAt: order.createdAt || nowIso,
		updatedAt: order.updatedAt || order.createdAt || nowIso,
		items,
	};
};

const mapOrders = (orders: ApiOrder[]): Order[] => orders.map(mapOrder);

const mapSingleOrder = (order: ApiOrder | null): Order | null => {
	if (!order) return null;
	return mapOrder(order, 0);
};

export const useGetMyOrders = (status?: ApiOrderStatus) => {
	const customerId = useAuthStore((state) => state.authUser?.user?.id);

	return useQuery({
		queryKey: ["client-my-orders", customerId, status],
		queryFn: async () => {
			if (!customerId) return [] as Order[];

			const orders = await getOrdersByCustomerId(customerId, status);
			return mapOrders(orders);
		},
		enabled: !!customerId,
	});
};

export const useGetOrderByCartId = (cartId?: string | number) => {
	return useQuery({
		queryKey: ["client-order-by-cart", cartId],
		queryFn: async () => {
			if (!cartId) return null;

			const order = await getOrderByCartId(cartId);
			return mapSingleOrder(order);
		},
		enabled: !!cartId,
	});
};

export const useGetOrderByCode = (code?: string) => {
	const normalizedCode = code?.trim();

	return useQuery({
		queryKey: ["client-order-by-code", normalizedCode],
		queryFn: async () => {
			if (!normalizedCode) return null;

			const order = await getOrderByCode(normalizedCode);
			return mapSingleOrder(order);
		},
		enabled: !!normalizedCode,
	});
};

export const useGetOrderById = (orderId?: string | number) => {
	return useQuery({
		queryKey: ["client-order-by-id", orderId],
		queryFn: async () => {
			if (!orderId) return null;

			const order = await getOrderById(orderId);
			return mapSingleOrder(order);
		},
		enabled: !!orderId,
	});
};

export const useGetOrdersByFranchiseId = (
	franchiseId?: string | number,
	status?: ApiOrderStatus,
) => {
	return useQuery({
		queryKey: ["client-orders-by-franchise", franchiseId, status],
		queryFn: async () => {
			if (!franchiseId) return [] as Order[];

			const orders = await getOrdersByFranchiseId(franchiseId, status);
			return mapOrders(orders);
		},
		enabled: !!franchiseId,
	});
};
