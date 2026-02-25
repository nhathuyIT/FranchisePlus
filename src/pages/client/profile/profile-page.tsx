import { useAuthStore } from "@/stores/auth-store";
import { ProfileHeader } from "./components/profile-header";
import { ProfileDetails } from "./components/profile-details";
import { ProfileRoles } from "./components/profile-roles";
import { FooterInfo } from "@/components/common/FooterInfo";

const ProfilePage = () => {
  const { authUser } = useAuthStore();
  const user = authUser?.user;
  const roles = authUser?.roles || [];
  const franchiseRoles = authUser?.franchiseRoles || [];

  if (!user) {
    return null;
  }

  return (
    <div className="bg-[#FAF8F5] min-h-screen">
      <ProfileHeader user={user} primaryRole={roles[0]?.name || "User"} />

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left column - Avatar & quick info */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-[#E8E0D8] p-6 text-center">
              <div className="w-28 h-28 mx-auto mb-4 rounded-full overflow-hidden border-4 border-[#D7CCC8] shadow-md">
                {user.avatar_url ? (
                  <img
                    src={user.avatar_url}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-[#EFEBE9] flex items-center justify-center">
                    <span className="text-4xl font-bold text-[#6D4C41]">
                      {user.name?.charAt(0)?.toUpperCase() || "U"}
                    </span>
                  </div>
                )}
              </div>
              <h3 className="text-xl font-bold text-[#3E2723] mb-1">
                {user.name}
              </h3>
              <p className="text-sm text-[#8D6E63] font-medium">
                {roles[0]?.name || "User"}
              </p>
              <div className="mt-4 pt-4 border-t border-[#E8E0D8]">
                <p className="text-xs text-[#A1887F]">
                  Member since{" "}
                  {new Date(user.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Right column - Details */}
          <div className="md:col-span-2 space-y-6">
            <ProfileDetails user={user} />
            <ProfileRoles roles={roles} franchiseRoles={franchiseRoles} />
          </div>
        </div>
      </div>

      <FooterInfo />
    </div>
  );
};

export default ProfilePage;
