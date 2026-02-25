import { useState } from "react";
import {
  Mail,
  Phone,
  Calendar,
  Shield,
  User as UserIcon,
  Pencil,
} from "lucide-react";
import type { User } from "@/types/user.type";
import { Button } from "@/components/ui/button";
import { EditProfileDialog } from "./edit-profile-dialog";

interface ProfileDetailsProps {
  user: User;
}

export const ProfileDetails = ({ user }: ProfileDetailsProps) => {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const details = [
    {
      icon: UserIcon,
      label: "Full Name",
      value: user.name,
    },
    {
      icon: Mail,
      label: "Email Address",
      value: user.email,
    },
    {
      icon: Phone,
      label: "Phone Number",
      value: user.phone || "Not provided",
    },
    {
      icon: Shield,
      label: "Account Status",
      value: user.isActive ? "Active" : "Inactive",
      badge: true,
      badgeColor: user.isActive
        ? "bg-green-100 text-green-700"
        : "bg-red-100 text-red-700",
    },
    {
      icon: Calendar,
      label: "Created At",
      value: new Date(user.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
    {
      icon: Calendar,
      label: "Last Updated",
      value: new Date(user.updatedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-[#E8E0D8] overflow-hidden">
      <div className="px-6 py-4 border-b border-[#E8E0D8] bg-[#EFEBE9]/30 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-[#3E2723]">
            Personal Information
          </h2>
          <p className="text-sm text-[#8D6E63]">
            Your account details and contact information
          </p>
        </div>
        <Button
          size="icon"
          variant="ghost"
          className="h-9 w-9 rounded-full text-[#A1887F] hover:text-[#6D4C41] hover:bg-[#EFEBE9]"
          onClick={() => setEditDialogOpen(true)}
        >
          <Pencil className="w-4 h-4" />
        </Button>
      </div>

      <EditProfileDialog
        user={user}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
      />

      <div className="divide-y divide-[#F5F0EB]">
        {details.map((item) => (
          <div
            key={item.label}
            className="flex items-center gap-4 px-6 py-4 hover:bg-[#FAF8F5] transition-colors"
          >
            <div className="shrink-0 w-10 h-10 rounded-xl bg-[#EFEBE9] flex items-center justify-center">
              <item.icon className="w-5 h-5 text-[#6D4C41]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-[#A1887F] font-medium uppercase tracking-wider">
                {item.label}
              </p>
              {item.badge ? (
                <span
                  className={`inline-block mt-1 px-3 py-0.5 rounded-full text-sm font-medium ${item.badgeColor}`}
                >
                  {item.value}
                </span>
              ) : (
                <p className="text-sm font-medium text-[#3E2723] truncate">
                  {item.value}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
