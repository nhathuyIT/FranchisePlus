import { useState } from "react";
import { useAuthStore } from "@/stores/auth-store";
import { ProfileHeader } from "./components/profile-header";
import { ProfileDetails } from "./components/profile-details";
import { EditProfileDialog } from "./components/edit-profile-dialog";

const ProfilePage = () => {
  const { authUser } = useAuthStore();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const user = authUser?.user;

  if (!user) {
    return null;
  }

  const primaryRole = "Coffee Lover";

  const memberSince = new Date(user.createdAt).getFullYear();

  return (
    <div>
      {/* ═══ Page Title Section ═══ */}
      <section className="mb-6">
        <h1 className="font-coffee text-4xl md:text-5xl italic text-[#3E2723] mb-2">
          My Profile
        </h1>
        <p className="text-[#8D6E63] text-base">
          Manage your personal information and preferences.
        </p>
      </section>

      {/* ═══ Profile Banner Card ═══ */}
      <section className="mb-10">
        <div className="bg-white rounded-2xl shadow-md border border-[#E8E0D8] overflow-hidden">
          {/* Gradient Banner */}
          <div className="relative h-36 bg-linear-to-r from-[#8D6E63] via-[#A1887F] to-[#BCAAA4]">
            <div className="absolute inset-0 opacity-20">
              <img
                src="https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=1200&q=80"
                alt=""
                className="w-full h-full object-cover mix-blend-overlay"
              />
            </div>
          </div>

          {/* Profile Info Row */}
          <div className="relative px-6 md:px-10 pb-8">
            {/* Avatar */}
            <div className="absolute -top-16 left-6 md:left-10">
              <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden bg-[#EFEBE9]">
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-5xl font-bold text-[#6D4C41]">
                      {user.name?.charAt(0)?.toUpperCase() || "U"}
                    </span>
                  </div>
                )}
              </div>
              {/* Camera badge */}
              <div
                onClick={() => setEditDialogOpen(true)}
                className="absolute bottom-1 right-1 w-8 h-8 rounded-full bg-[#C97B3D] flex items-center justify-center shadow-md cursor-pointer hover:bg-[#B5692F] transition-colors"
              >
                <img
                  src="https://cdn-icons-png.flaticon.com/512/685/685655.png"
                  alt="Change avatar"
                  className="w-4 h-4 brightness-0 invert"
                />
              </div>
            </div>

            {/* Name & Role */}
            <div className="pt-20 md:pt-6 md:ml-40 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h2 className="font-coffee text-3xl text-[#3E2723] mb-1">
                  {user.name}
                </h2>
                <div className="flex items-center gap-3 text-sm">
                  <span className="flex items-center gap-1.5 text-[#C97B3D] font-semibold uppercase tracking-wider text-xs">
                    <span className="w-2 h-2 rounded-full bg-[#C97B3D]" />
                    {primaryRole}
                  </span>
                  <span className="text-[#A1887F]">·</span>
                  <span className="text-[#8D6E63]">
                    Member since {memberSince}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setEditDialogOpen(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#C97B3D] hover:bg-[#B5692F] text-white rounded-lg font-medium text-sm shadow-sm transition-all duration-200 hover:shadow-md cursor-pointer"
              >
                <img
                  src="https://cdn-icons-png.flaticon.com/512/1159/1159633.png"
                  alt=""
                  className="w-4 h-4 brightness-0 invert"
                />
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ Contact & Account Details ═══ */}
      <section className="mb-10">
        <ProfileDetails user={user} />
      </section>


      {/* Edit Profile Dialog */}
      <EditProfileDialog
        user={user}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
      />
    </div>
  );
};

export default ProfilePage;
