import type { User } from "@/types/user.type";

interface ProfileDetailsProps {
  user: User;
}

export const ProfileDetails = ({ user }: ProfileDetailsProps) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg shadow-[#D7CCC8]/40 border border-[#E8E0D8] overflow-hidden">
      {/* Divider line */}
      <div className="h-px bg-linear-to-r from-transparent via-[#D7CCC8] to-transparent mx-8 mt-6" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-0 divide-y md:divide-y-0 md:divide-x divide-[#E8E0D8]">
        {/* ─── Contact Information ─── */}
        <div className="p-8">
          <h3 className="font-coffee text-xl text-[#3E2723] mb-6">
            Contact Information
          </h3>

          <div className="space-y-6">
            {/* Phone */}
            <div className="flex items-start gap-4">
              <div className="shrink-0 w-11 h-11 rounded-2xl bg-[#FFF3E0] flex items-center justify-center shadow-md">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/3059/3059457.png"
                  alt="Phone"
                  className="w-6 h-6"
                />
              </div>
              <div>
                <p className="text-xs font-semibold text-[#C97B3D] uppercase tracking-wider mb-1">
                  Phone Number
                </p>
                <p className="text-sm font-medium text-[#3E2723]">
                  {user.phone || "Not provided"}
                </p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start gap-4">
              <div className="shrink-0 w-11 h-11 rounded-2xl bg-[#FFF3E0] flex items-center justify-center shadow-md">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/2549/2549872.png"
                  alt="Email"
                  className="w-6 h-6"
                />
              </div>
              <div>
                <p className="text-xs font-semibold text-[#C97B3D] uppercase tracking-wider mb-1">
                  Email Address
                </p>
                <p className="text-sm font-medium text-[#3E2723]">
                  {user.email}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ─── Shipping Address ─── */}
        <div className="p-8">
          <h3 className="font-coffee text-xl text-[#3E2723] mb-6">
            Shipping Address
          </h3>

          <div className="space-y-6">
            {/* Primary Residence */}
            <div className="flex items-start gap-4">
              <div className="shrink-0 w-11 h-11 rounded-2xl bg-[#FFF3E0] flex items-center justify-center shadow-md">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/684/684908.png"
                  alt="Location"
                  className="w-6 h-6"
                />
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold text-[#C97B3D] uppercase tracking-wider mb-1">
                  Primary Residence
                </p>
                {user.address ? (
                  <p className="text-sm font-medium text-[#3E2723] leading-relaxed whitespace-pre-line">
                    {user.address}
                  </p>
                ) : (
                  <p className="text-sm text-[#A1887F] italic">
                    No address provided
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
