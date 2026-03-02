import type { User } from "@/types/user.type";

interface ProfileHeaderProps {
  user: User;
  primaryRole: string;
}

export const ProfileHeader = ({ user, primaryRole }: ProfileHeaderProps) => {
  return (
    <section className="relative bg-linear-to-br from-[#4E342E] via-[#5D4037] to-[#6D4C41] py-16 overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-white/20" />
        <div className="absolute bottom-5 right-20 w-48 h-48 rounded-full bg-white/10" />
        <div className="absolute top-1/2 left-1/3 w-24 h-24 rounded-full bg-white/15" />
      </div>

      <div className="container mx-auto px-4 text-center relative z-10">
        <p className="text-[#D7CCC8] text-sm uppercase tracking-[0.3em] mb-3 font-medium">
          Account
        </p>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight">
          {user.name || "My Profile"}
        </h1>
        <p className="text-[#BCAAA4] text-lg">
          {primaryRole} &bull; {user.email}
        </p>
      </div>
    </section>
  );
};
