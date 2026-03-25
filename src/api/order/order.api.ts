import { httpClient } from "@/api/httpClient.api";

export interface ApiOrderItem {
	id?: string | number;
	productNameSnapshot?: string;
	productName?: string;
	name?: string;
	quantity?: number;
	priceSnapshot?: number;
	price?: number;
	lineTotal?: number;
	variant?: string;
	size?: string;
	imageUrl?: string;
	image?: string;
	productImageUrl?: string;
}

export interface ApiOrder {
	id?: string | number;
	code?: string;
	franchiseId?: string | number;
	franchiseName?: string;
	customerId?: string | number;
	type?: string;
	status?: ApiOrderStatus;
	totalAmount?: number;
	confirmedAt?: string | null;
	completedAt?: string | null;
	cancelledAt?: string | null;
	createdBy?: string | number | null;
	isDeleted?: boolean;
	createdAt?: string;
	updatedAt?: string;
	items?: ApiOrderItem[];
	orderItems?: ApiOrderItem[];
	franchise?: {
		name?: string;
	};
}

export type ApiOrderStatus =
	| "DRAFT"
	| "CONFIRMED"
	| "PREPARING"
	| "READY_FOR_PICKUP"
	| "OUT_FOR_DELIVERY"
	| "COMPLETED"
	| "CANCELED";

type GetOrdersResponse = ApiOrder[] | { orders?: ApiOrder[]; items?: ApiOrder[] };
type GetOrderResponse = ApiOrder | { order?: ApiOrder; item?: ApiOrder };

const normalizeOrderList = (response: GetOrdersResponse | null): ApiOrder[] => {
	if (!response) {
		return [];
	}

	if (Array.isArray(response)) {
		return response;
	}

	if (Array.isArray(response.orders)) {
		return response.orders;
	}

	if (Array.isArray(response.items)) {
		return response.items;
	}

	return [];
};

const normalizeSingleOrder = (response: GetOrderResponse | null): ApiOrder | null => {
	if (!response) {
		return null;
	}

	if ("order" in response && response.order) {
		return response.order;
	}

	if ("item" in response && response.item) {
		return response.item;
	}

	return response as ApiOrder;
};

export const getOrdersByCustomerId = async (
	customerId: string | number,
	status?: ApiOrderStatus,
): Promise<ApiOrder[]> => {
	const response = await httpClient.get<
		GetOrdersResponse,
		{ status?: ApiOrderStatus }
	>({
		url: `/api/orders/customer/${customerId}`,
		params: {
			status,
		},
	});

	return normalizeOrderList(response);
};

export const getOrderByCartId = async (
	cartId: string | number,
): Promise<ApiOrder | null> => {
	const response = await httpClient.get<GetOrderResponse>({
		url: `/api/orders/cart/${cartId}`,
	});

	return normalizeSingleOrder(response);
};

export const getOrderByCode = async (code: string): Promise<ApiOrder | null> => {
	const response = await httpClient.get<GetOrderResponse, { code: string }>({
		url: "/api/orders/code",
		params: {
			code,
		},
	});

	return normalizeSingleOrder(response);
};

export const getOrderById = async (
	orderId: string | number,
): Promise<ApiOrder | null> => {
	const response = await httpClient.get<GetOrderResponse>({
		url: `/api/orders/${orderId}`,
	});

	return normalizeSingleOrder(response);
};

export const getOrdersByFranchiseId = async (
	franchiseId: string | number,
	status?: ApiOrderStatus,
): Promise<ApiOrder[]> => {
	const response = await httpClient.get<
		GetOrdersResponse,
		{ status?: ApiOrderStatus }
	>({
		url: `/api/orders/franchise/${franchiseId}`,
		params: {
			status,
		},
	});

	return normalizeOrderList(response);
};

export const getOrdersForStaffByFranchiseId = async (params: {
	franchiseId: string | number;
	status?: ApiOrderStatus;
}): Promise<ApiOrder[]> => {
	return getOrdersByFranchiseId(params.franchiseId, params.status);
};

export const changeOrderStatusPreparing = async (
	orderId: string | number,
): Promise<ApiOrder | null> => {
	const response = await httpClient.put<ApiOrder, Record<string, never>>({
		url: `/api/orders/${orderId}/preparing`,
		data: {},
	});

	return response;
};

export const changeOrderStatusReadyForPickup = async (
	orderId: string | number,
	data?: { staffId?: string },
): Promise<ApiOrder | null> => {
	const response = await httpClient.put<ApiOrder, { staffId?: string }>({
		url: `/api/orders/${orderId}/ready-for-pickup`,
		data: data ?? {},
	});

	return response;
};
