import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getAdminProfile,
  updateAdminProfile,
  type UpdateAdminProfileRequest,
} from "@/api/admin/admin.api";
import { uploadFileToCloudinary } from "@/config/cloudinary";

const PROFILE_KEY = ["admin-profile"] as const;

/**
 * Fetch the current admin's profile.
 */
export const useAdminProfile = () => {
  return useQuery({
    queryKey: [...PROFILE_KEY],
    queryFn: getAdminProfile,
  });
};

/**
 * Update admin profile fields (name, phone, avatar_url).
 * Automatically invalidates the profile query on success.
 */
export const useUpdateAdminProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      data,
    }: {
      userId: string;
      data: UpdateAdminProfileRequest;
    }) => {
      await updateAdminProfile(userId, data);
    },
    onSuccess: () => {
      toast.success("Profile updated successfully!");
      queryClient.invalidateQueries({ queryKey: [...PROFILE_KEY] });
    },
    onError: (error: Error) => {
      toast.error("Failed to update profile", {
        description: error.message || "Please try again later.",
      });
    },
  });
};

/**
 * Upload avatar to Cloudinary.
 * Returns the secure URL of the uploaded image.
 */
export const useUploadAvatar = () => {
  return useMutation({
    mutationFn: async (file: File) => {
      const url = await uploadFileToCloudinary(file);
      return url;
    },
    onError: (error: Error) => {
      toast.error("Failed to upload avatar", {
        description: error.message || "Please try again later.",
      });
    },
  });
};
