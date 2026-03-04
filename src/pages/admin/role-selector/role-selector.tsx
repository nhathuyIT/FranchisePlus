import type { RoleSelectionProps } from "@/config/role-selector";
import { ShieldCheck, Building2, ChevronRight } from "lucide-react";

export const RoleSelector = ({
  availableRoles,
  onSelectRole,
  isLoading = false,
}: RoleSelectionProps) => {
  return (
    <div className="space-y-3">
      {availableRoles.map((context) => (
        <button
          key={context.id}
          onClick={() => !isLoading && onSelectRole(context)}
          disabled={isLoading}
          className="w-full p-4 border-2 border-amber-200 rounded-lg hover:border-amber-500 hover:bg-amber-50 transition-all duration-200 group disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <div className="flex items-center gap-3">
            {context.isGlobal ? (
              <ShieldCheck
                className="text-amber-600 group-hover:text-amber-700"
                size={24}
              />
            ) : (
              <Building2
                className="text-amber-600 group-hover:text-amber-700"
                size={24}
              />
            )}
            <div className="flex-1 text-left">
              <p className="font-semibold text-amber-900">{context.roleName}</p>
              <p className="text-sm text-amber-700">
                {context.isGlobal
                  ? "Global Access"
                  : context.franchiseName ||
                    `Franchise #${context.franchiseId}`}
              </p>
            </div>
            <ChevronRight
              className="text-amber-400 group-hover:text-amber-600 group-hover:translate-x-1 transition-all"
              size={20}
            />
          </div>
        </button>
      ))}
    </div>
  );
};
