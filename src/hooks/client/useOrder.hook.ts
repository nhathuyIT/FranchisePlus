import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/auth-store";
import type {
	Order,
	OrderItemData,
	OrderStatus,
	OrderType,
} from "@/const/order.const";
import type { ApiOrder, ApiOrderItem } from "@/api/client/order.api";
import { getOrdersByCustomerId } from "@/api/client/order.api";

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
	if (value.includes("CANCEL")) return "CANCELLED";
	if (value.includes("COMPLETE")) return "COMPLETED";
	if (value.includes("SHIP") || value.includes("DELIVER")) return "SHIPPING";
	if (value.includes("CONFIRM")) return "CONFIRMED";

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

export const useGetMyOrders = () => {
	const customerId = useAuthStore((state) => state.authUser?.user?.id);

	return useQuery({
		queryKey: ["client-my-orders", customerId],
		queryFn: async () => {
			if (!customerId) return [] as Order[];

			const orders = await getOrdersByCustomerId(customerId);
			return orders.map(mapOrder);
		},
		enabled: !!customerId,
	});
};
