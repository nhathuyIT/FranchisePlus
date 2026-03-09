import { useState, useRef, useCallback } from "react";
import {
  Mail,
  Phone,
  UserCircle,
  Shield,
  CheckCircle,
  XCircle,
  Globe,
  Store,
  KeyRound,
  Pencil,
  Camera,
  Save,
  X,
  Loader2,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useAuthStore } from "@/stores/auth-store";
import {
  useAdminProfile,
  useUpdateAdminProfile,
  useUploadAvatar,
} from "@/hooks/admin/useProfileAdmin.hooks";

function InfoRow({
  icon: Icon,
  label,
  children,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 py-3">
      <Icon size={18} className="text-amber-600 shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <p className="text-xs text-amber-500 font-medium uppercase tracking-wide mb-0.5">
          {label}
        </p>
        <div className="text-sm text-gray-800">{children}</div>
      </div>
    </div>
  );
}

function AdminProfile() {
  const { getCurrentRole } = useAuthStore();
  const currentRole = getCurrentRole();

  const { data, isLoading, isError } = useAdminProfile();
  const updateProfile = useUpdateAdminProfile();
  const uploadAvatar = useUploadAvatar();

  const user = data?.user;
  const roles = data?.roles ?? [];
  const activeContext = data?.activeContext;

  // ── Edit state ────────────────────────────────────────────────────────────
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startEditing = useCallback(() => {
    if (!user) return;
    setEditName(user.name ?? "");
    setEditPhone(user.phone ?? "");
    setAvatarPreview(null);
    setAvatarFile(null);
    setIsEditing(true);
  }, [user]);

  const cancelEditing = useCallback(() => {
    setIsEditing(false);
    setAvatarPreview(null);
    setAvatarFile(null);
  }, []);

  const handleAvatarChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onload = () => setAvatarPreview(reader.result as string);
      reader.readAsDataURL(file);
    },
    [],
  );

  const handleSave = useCallback(async () => {
    if (!user) return;

    let avatarUrl: string | undefined;

    // Upload avatar first if changed
    if (avatarFile) {
      try {
        avatarUrl = await uploadAvatar.mutateAsync(avatarFile);
      } catch {
        return; // error toast handled by hook
      }
    }

    updateProfile.mutate(
      {
        userId: user.id,
        data: {
          name: editName.trim() || undefined,
          phone: editPhone.trim() || undefined,
          ...(avatarUrl ? { avatar_url: avatarUrl } : {}),
        },
      },
      { onSuccess: () => setIsEditing(false) },
    );
  }, [user, editName, editPhone, avatarFile, uploadAvatar, updateProfile]);

  const isSaving = updateProfile.isPending || uploadAvatar.isPending;

  // ── Loading / Error ───────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-amber-700 text-sm">Loading profile...</div>
      </div>
    );
  }

  if (isError || !user) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-red-500 text-sm">Failed to load profile.</div>
      </div>
    );
  }

  // ── Render ────────────────────────────────────────────────────────────────
  const displayAvatar = avatarPreview ?? user.avatarUrl ?? undefined;

  return (
    <div className="flex-1 p-6 md:p-10 overflow-y-auto bg-gradient-to-br from-amber-50/30 to-white">
      <div className="max-w-5xl mx-auto">
        {/* Header card */}
        <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-10 bg-white rounded-xl p-6 shadow-sm border border-amber-100">
          {/* Avatar (with upload overlay in edit mode) */}
          <div className="relative group">
            <Avatar className="h-24 w-24 border-4 border-amber-300 shadow-lg">
              <AvatarImage src={displayAvatar} alt={user.name} />
              <AvatarFallback className="bg-gradient-to-br from-amber-500 to-amber-700 text-white text-3xl font-bold">
                {user.name?.charAt(0) ?? "U"}
              </AvatarFallback>
            </Avatar>

            {isEditing && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              >
                <Camera size={22} className="text-white" />
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </div>

          {/* Name / Role / Badges */}
          <div className="flex-1">
            {isEditing ? (
              <div className="space-y-3 max-w-md">
                <div>
                  <Label className="text-xs text-amber-600 uppercase tracking-wide mb-1">
                    Full Name
                  </Label>
                  <Input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="border-amber-200 focus-visible:ring-amber-400"
                    placeholder="Enter your name"
                  />
                </div>
              </div>
            ) : (
              <>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {user.name}
                </h1>
                <p className="text-sm text-amber-600 font-medium mb-3">
                  {currentRole?.name ?? "Admin"}
                </p>
              </>
            )}
            <div className="flex items-center gap-2 mt-2">
              {user.isActive ? (
                <Badge className="bg-green-100 text-green-700 border border-green-300">
                  <CheckCircle size={12} className="mr-1" /> Active
                </Badge>
              ) : (
                <Badge className="bg-red-100 text-red-700 border border-red-300">
                  <XCircle size={12} className="mr-1" /> Inactive
                </Badge>
              )}
              {user.isDeleted && (
                <Badge className="bg-gray-100 text-gray-600 border border-gray-300">
                  Deleted
                </Badge>
              )}
            </div>
          </div>

          {/* Edit / Save / Cancel buttons */}
          <div className="absolute top-5 right-5 flex items-center gap-2">
            {isEditing ? (
              <>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={cancelEditing}
                  disabled={isSaving}
                  className="text-gray-500 hover:text-gray-700 gap-1.5"
                >
                  <X size={15} />
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleSave}
                  disabled={isSaving}
                  className="bg-amber-600 hover:bg-amber-700 text-white gap-1.5"
                >
                  {isSaving ? (
                    <Loader2 size={15} className="animate-spin" />
                  ) : (
                    <Save size={15} />
                  )}
                  {isSaving ? "Saving…" : "Save"}
                </Button>
              </>
            ) : (
              <Button
                size="sm"
                variant="outline"
                onClick={startEditing}
                className="border-amber-300 text-amber-700 hover:bg-amber-50 hover:text-amber-900 gap-1.5"
              >
                <Pencil size={14} />
                Edit Profile
              </Button>
            )}
          </div>
        </div>

        {/* Account Information */}
        <section className="mb-6 bg-white rounded-xl p-6 shadow-sm border border-amber-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <UserCircle size={22} className="text-amber-600" />
            Account Information
          </h2>
          <Separator className="mb-6 bg-amber-200" />

          {isEditing ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-5">
              <div>
                <Label className="text-xs text-amber-600 uppercase tracking-wide mb-1 flex items-center gap-1.5">
                  <Mail size={14} /> Email
                </Label>
                <Input
                  value={user.email}
                  disabled
                  className="border-amber-200 bg-amber-50/50 text-gray-500 cursor-not-allowed"
                />
                <p className="text-[11px] text-gray-400 mt-1">
                  Email cannot be changed
                </p>
              </div>
              <div>
                <Label className="text-xs text-amber-600 uppercase tracking-wide mb-1 flex items-center gap-1.5">
                  <Phone size={14} /> Phone
                </Label>
                <Input
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="border-amber-200 focus-visible:ring-amber-400"
                  placeholder="Enter phone number"
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-1">
              <InfoRow icon={Mail} label="Email">
                <span className="font-medium">{user.email}</span>
              </InfoRow>
              <InfoRow icon={Phone} label="Phone">
                <span className="font-medium">{user.phone ?? "—"}</span>
              </InfoRow>
            </div>
          )}
        </section>

        {/* Active Context */}
        {activeContext && (
          <section className="mb-6 bg-white rounded-xl p-6 shadow-sm border border-amber-100">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Shield size={22} className="text-amber-600" />
              Active Context
            </h2>
            <Separator className="mb-6 bg-amber-200" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-1">
              <InfoRow icon={Shield} label="Current Role">
                <Badge className="bg-amber-100 text-amber-800 border border-amber-300 font-medium">
                  {activeContext.role}
                </Badge>
              </InfoRow>
              <InfoRow icon={Globe} label="Scope">
                <Badge
                  variant="outline"
                  className={
                    activeContext.scope === "GLOBAL"
                      ? "border-blue-300 text-blue-700 font-medium"
                      : "border-green-300 text-green-700 font-medium"
                  }
                >
                  {activeContext.scope}
                </Badge>
              </InfoRow>
              {activeContext.franchiseId && (
                <InfoRow icon={Store} label="Franchise">
                  <span className="font-medium">{activeContext.franchiseId}</span>
                </InfoRow>
              )}
            </div>
          </section>
        )}

        {/* Roles & Franchises */}
        <section className="bg-white rounded-xl p-6 shadow-sm border border-amber-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <KeyRound size={22} className="text-amber-600" />
            Roles & Franchises
          </h2>
          <Separator className="mb-6 bg-amber-200" />

          {roles.length > 0 ? (
            <div className="overflow-x-auto -mx-2">
              <table className="w-full text-sm border border-amber-200 rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-gradient-to-r from-amber-100 to-amber-50 text-amber-900">
                    <th className="text-left px-5 py-3 font-semibold">#</th>
                    <th className="text-left px-5 py-3 font-semibold">Role</th>
                    <th className="text-left px-5 py-3 font-semibold">Scope</th>
                    <th className="text-left px-5 py-3 font-semibold">
                      Franchise
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {roles.map((r, i) => (
                    <tr
                      key={i}
                      className="border-t border-amber-100 hover:bg-amber-50/50 transition-colors"
                    >
                      <td className="px-5 py-3 text-gray-500 font-medium">
                        {i + 1}
                      </td>
                      <td className="px-5 py-3">
                        <Badge className="bg-amber-100 text-amber-800 border border-amber-300 font-medium">
                          {r.role}
                        </Badge>
                      </td>
                      <td className="px-5 py-3">
                        <Badge
                          variant="outline"
                          className={
                            r.scope === "GLOBAL"
                              ? "border-blue-300 text-blue-700 font-medium"
                              : "border-green-300 text-green-700 font-medium"
                          }
                        >
                          {r.scope}
                        </Badge>
                      </td>
                      <td className="px-5 py-3 text-gray-700 font-medium">
                        {r.franchiseName ?? (r.franchiseId ? r.franchiseId : "—")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 bg-amber-50/30 rounded-lg border border-amber-100">
              <Shield size={40} className="mx-auto mb-2 text-amber-300" />
              <p className="text-sm">No roles assigned.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default AdminProfile;
