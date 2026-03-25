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
	status?: string;
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

type GetOrdersResponse = ApiOrder[] | { orders?: ApiOrder[]; items?: ApiOrder[] };

export const getOrdersByCustomerId = async (
	customerId: string,
): Promise<ApiOrder[]> => {
	const response = await httpClient.get<GetOrdersResponse>({
		url: `/api/orders/customer/${customerId}`,
	});

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
