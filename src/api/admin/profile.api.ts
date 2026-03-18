import type { GetProfileResponse } from "@/types/auth.type";
import type {
	AdminProfile,
	UpdateAdminProfileInput,
} from "@/types/admin-profile.type";
import type { User } from "@/types/user.type";
import { httpClient } from "../httpClient.api";

const toAdminProfile = (
	user: Partial<User> & { id?: string },
): AdminProfile => ({
	id: user.id ?? "",
	name: user.name ?? "",
	email: user.email ?? "",
	phone: user.phone ?? "",
	avatarUrl: user.avatarUrl ?? "",
	address: user.address ?? "",
	createdAt: user.createdAt ?? "",
	updatedAt: user.updatedAt ?? "",
});

export const getProfile = async (): Promise<AdminProfile> => {
	const response = await httpClient.get<GetProfileResponse>({
		url: "/api/auth",
	});

	if (!response?.user) {
		throw new Error("Failed to get admin profile");
	}

	return toAdminProfile(response.user);
};

export const updateProfile = async (
	userId: string,
	input: UpdateAdminProfileInput,
): Promise<AdminProfile> => {
	const response = await httpClient.put<User, UpdateAdminProfileInput>({
		url: `/api/users/${encodeURIComponent(userId)}`,
		data: input,
	});

	if (!response) {
		throw new Error("Failed to update admin profile");
	}

	return toAdminProfile(response);
};

