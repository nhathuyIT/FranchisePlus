import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import * as profileApi from "@/api/admin/profile.api";
import type { UpdateAdminProfileInput } from "@/types/admin-profile.type";
import { useAuthStore } from "@/stores/auth-store";

export const ADMIN_PROFILE_QUERY_KEY = ["admin", "my-profile"] as const;

export const useAdminProfileQuery = () => {
	return useQuery({
		queryKey: ADMIN_PROFILE_QUERY_KEY,
		queryFn: () => profileApi.getProfile(),
	});
};

export const useUpdateAdminProfileMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			userId,
			input,
		}: {
			userId: string;
			input: UpdateAdminProfileInput;
		}) => profileApi.updateProfile(userId, input),
		onSuccess: (updatedProfile) => {
			useAuthStore.getState().updateProfile({
				name: updatedProfile.name ?? "",
				email: updatedProfile.email ?? "",
				phone: updatedProfile.phone ?? "",
				avatarUrl: updatedProfile.avatarUrl ?? "",
			});

			void queryClient.invalidateQueries({ queryKey: ADMIN_PROFILE_QUERY_KEY });
			toast.success("Profile updated successfully");
		},
	});
};

