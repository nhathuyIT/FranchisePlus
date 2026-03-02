import { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useUpdateClientProfile } from "@/hooks/client/useClient.hooks";
import { uploadFileToCloudinary } from "@/stores/cloudinary";
import type { EditProfileDialogProps, FormData } from "@/types/customer";

export const EditProfileDialog = ({
  user,
  open,
  onOpenChange,
}: EditProfileDialogProps) => {
  const updateProfileMutation = useUpdateClientProfile();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<FormData>({
    name: user.name || "",
    email: user.email || "",
    phone: user.phone || "",
    address: user.address || "",
  });

  const [avatarUrl, setAvatarUrl] = useState<string>(user.avatarUrl || "");
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  // Reset form when dialog opens
  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
      });
      setAvatarUrl(user.avatarUrl || "");
    }
    onOpenChange(isOpen);
  };

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    setIsUploadingAvatar(true);
    try {
      const url = await uploadFileToCloudinary(file);
      setAvatarUrl(url);
      toast.success("Image uploaded successfully");
    } catch (error) {
      toast.error("Failed to upload image", {
        description:
          error instanceof Error ? error.message : "Please try again",
      });
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedName = formData.name.trim();
    const trimmedEmail = formData.email.trim();

    // Validation
    if (!trimmedName) {
      toast.error("Name cannot be empty");
      return;
    }
    if (!trimmedEmail) {
      toast.error("Email cannot be empty");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      toast.error("Please enter a valid email address");
      return;
    }

    // Prepare API data
    const profileData = {
      name: trimmedName,
      email: trimmedEmail,
      phone: formData.phone.trim(),
      address: formData.address.trim(),
      avatar_url: avatarUrl || user.avatarUrl || "",
    };

    updateProfileMutation.mutate(profileData, {
      onSuccess: () => {
        onOpenChange(false);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className="sm:max-w-lg p-0 overflow-hidden rounded-2xl border-[#E8E0D8] shadow-xl"
        onOpenAutoFocus={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle className="font-coffee text-xl text-[#3E2723]">
            Edit Personal Information
          </DialogTitle>
          <DialogDescription className="text-sm text-[#8D6E63]">
            Update your profile information below
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 space-y-5">
            {/* Avatar Upload */}
            <div>
              <label className="flex items-center gap-2 text-xs font-semibold text-[#C97B3D] uppercase tracking-wider mb-2">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/685/685655.png"
                  alt=""
                  className="w-4 h-4"
                />
                Profile Picture
              </label>
              <div className="flex items-center gap-4">
                {/* Avatar Preview */}
                <div className="relative w-20 h-20 rounded-full border-2 border-[#D7CCC8] overflow-hidden bg-[#EFEBE9] shrink-0">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt="Avatar preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-3xl font-bold text-[#6D4C41]">
                        {user.name?.charAt(0)?.toUpperCase() || "U"}
                      </span>
                    </div>
                  )}
                  {isUploadingAvatar && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                </div>

                {/* Upload Button */}
                <div className="flex-1">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                    disabled={
                      isUploadingAvatar || updateProfileMutation.isPending
                    }
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={
                      isUploadingAvatar || updateProfileMutation.isPending
                    }
                    className="border-[#D7CCC8] text-[#6D4C41] hover:bg-[#FAF8F5]"
                  >
                    {isUploadingAvatar ? "Uploading..." : "Choose Image"}
                  </Button>
                  <p className="text-xs text-[#8D6E63] mt-1">
                    JPG, PNG or GIF (max 5MB)
                  </p>
                </div>
              </div>
            </div>

            {/* Full Name */}
            <div>
              <label className="flex items-center gap-2 text-xs font-semibold text-[#C97B3D] uppercase tracking-wider mb-2">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/1077/1077114.png"
                  alt=""
                  className="w-4 h-4"
                />
                Full Name
              </label>
              <Input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="Enter your full name"
                className="border-[#D7CCC8] focus-visible:border-[#6D4C41] focus-visible:ring-[#6D4C41]/20"
                disabled={updateProfileMutation.isPending}
              />
            </div>

            {/* Email */}
            <div>
              <label className="flex items-center gap-2 text-xs font-semibold text-[#C97B3D] uppercase tracking-wider mb-2">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/2549/2549872.png"
                  alt=""
                  className="w-4 h-4"
                />
                Email Address
              </label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="Enter your email"
                className="border-[#D7CCC8] focus-visible:border-[#6D4C41] focus-visible:ring-[#6D4C41]/20"
                disabled={updateProfileMutation.isPending}
              />
            </div>

            {/* Phone */}
            <div>
              <label className="flex items-center gap-2 text-xs font-semibold text-[#C97B3D] uppercase tracking-wider mb-2">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/3059/3059457.png"
                  alt=""
                  className="w-4 h-4"
                />
                Phone Number
              </label>
              <Input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                placeholder="Enter your phone number"
                className="border-[#D7CCC8] focus-visible:border-[#6D4C41] focus-visible:ring-[#6D4C41]/20"
                disabled={updateProfileMutation.isPending}
              />
            </div>

            {/* Address */}
            <div>
              <label className="flex items-center gap-2 text-xs font-semibold text-[#C97B3D] uppercase tracking-wider mb-2">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/684/684908.png"
                  alt=""
                  className="w-4 h-4"
                />
                Address
              </label>
              <Textarea
                value={formData.address}
                onChange={(e) => handleChange("address", e.target.value)}
                placeholder="Enter your address"
                className="border-[#D7CCC8] focus-visible:border-[#6D4C41] focus-visible:ring-[#6D4C41]/20 min-h-20 resize-none"
                disabled={updateProfileMutation.isPending}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="px-6 pb-6 pt-2 flex gap-3 justify-end border-t border-[#E8E0D8]">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={updateProfileMutation.isPending}
              className="border-[#D7CCC8] text-[#6D4C41] hover:bg-[#FAF8F5]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={updateProfileMutation.isPending}
              className="bg-[#C97B3D] hover:bg-[#B5692F] text-white"
            >
              {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
