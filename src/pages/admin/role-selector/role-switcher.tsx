import { useAuthStore } from "@/stores/auth-store";
import { Building2, ChevronDown, CheckCircle2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const RoleSwitcher = () => {
  const { authUser, getAvailableContexts, switchRole } = useAuthStore();

  if (!authUser) return null;

  const availableContexts = getAvailableContexts();

  const currentContext = availableContexts.find(
    (ctx) =>
      ctx.roleId === authUser.currentRoleId &&
      ctx.franchiseId === authUser.currentFranchiseId,
  );

  if (availableContexts.length <= 1) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 w-full px-3 py-2 rounded-lg bg-amber-800/30 hover:bg-amber-800/50 transition-colors text-left">
          <Building2 className="w-4 h-4 text-amber-300 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="font-medium text-xs text-amber-100 truncate">
              {currentContext?.roleName || "Select Role"}
            </p>
            {!currentContext?.isGlobal && (
              <p className="text-[10px] text-amber-300 truncate">
                {currentContext?.franchiseName ||
                  `Franchise #${currentContext?.franchiseId}`}
              </p>
            )}
          </div>
          <ChevronDown className="w-3 h-3 text-amber-300 shrink-0" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64">
        {availableContexts.map((ctx) => {
          const isActive =
            ctx.roleId === authUser.currentRoleId &&
            ctx.franchiseId === authUser.currentFranchiseId;

          return (
            <DropdownMenuItem
              key={ctx.id}
              onClick={() => switchRole(ctx)}
              className={`flex items-start gap-3 py-2.5 cursor-pointer ${
                isActive ? "bg-amber-50" : ""
              }`}
            >
              <Building2
                className="w-4 h-4 mt-0.5 text-amber-600"
                strokeWidth={isActive ? 2.5 : 2}
              />
              <div className="flex-1">
                <p
                  className={`text-sm ${
                    isActive ? "font-semibold text-amber-900" : "text-gray-700"
                  }`}
                >
                  {ctx.roleName}
                </p>
                <p className="text-xs text-gray-500">
                  {ctx.isGlobal
                    ? "Global Access"
                    : ctx.franchiseName || `Franchise #${ctx.franchiseId}`}
                </p>
              </div>
              {isActive && <CheckCircle2 className="w-4 h-4 text-amber-600" />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
