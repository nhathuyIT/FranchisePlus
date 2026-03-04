import { useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/auth-store";
import { Building2, ChevronDown, CheckCircle2, Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSwitchContext } from "@/hooks/auth/useAuth.hooks";
import type { AvailableContext } from "@/config/permission";

export const RoleSwitcher = () => {
<<<<<<< HEAD
  const queryClient = useQueryClient();
  const { authUser, getAvailableContexts, switchRole } = useAuthStore();
=======
  const { authUser, getAvailableContexts } = useAuthStore();
>>>>>>> 1306d5f (Fix switch context)
  const switchContextMutation = useSwitchContext();
  const isPending = switchContextMutation.isPending;

  if (!authUser) return null;

  const availableContexts = getAvailableContexts();

  const currentContext = availableContexts.find(
    (ctx) =>
      ctx.roleId === authUser.currentRoleId &&
      ctx.franchiseId === authUser.currentFranchiseId,
  );

  if (availableContexts.length <= 1) return null;

  const handleSwitchRole = async (ctx: AvailableContext) => {
    try {
<<<<<<< HEAD
<<<<<<< HEAD
      await switchContextMutation.mutateAsync({
        role_id: ctx.roleId,
        franchise_id: ctx.franchiseId ?? null,
      });

      await queryClient.invalidateQueries({ queryKey: ["auth", "profile"] });
      await queryClient.invalidateQueries({ queryKey: ["franchise"] });

      switchRole(ctx);
=======
      // Always call switchContext — useSwitchContext will also call getProfile
      // and update the store with fresh context while preserving all roles/franchiseRoles
=======
>>>>>>> e1bb0d7 (Fix switch context)
      await switchContextMutation.mutateAsync({
        franchiseId: ctx.franchiseId,
      });
>>>>>>> 1306d5f (Fix switch context)
    } catch (error) {
      console.error("Failed to switch role:", error);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          disabled={isPending}
          className="flex items-center gap-2 w-full px-3 py-2 rounded-lg bg-amber-800/30 hover:bg-amber-800/50 transition-colors text-left disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isPending ? (
            <Loader2 className="w-4 h-4 text-amber-300 shrink-0 animate-spin" />
          ) : (
            <Building2 className="w-4 h-4 text-amber-300 shrink-0" />
          )}
          <div className="flex-1 min-w-0">
            <p className="font-medium text-xs text-amber-100 truncate">
              {isPending
                ? "Switching role..."
                : currentContext?.roleName || "Select Role"}
            </p>
            {!isPending && !currentContext?.isGlobal && (
              <p className="text-[10px] text-amber-300 truncate">
                {currentContext?.franchiseName ||
                  `Franchise #${currentContext?.franchiseId}`}
              </p>
            )}
          </div>
          {isPending ? (
            <div className="w-3 h-3 shrink-0" />
          ) : (
            <ChevronDown className="w-3 h-3 text-amber-300 shrink-0" />
          )}
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
              onClick={() => handleSwitchRole(ctx)}
              disabled={isPending}
              className={`flex items-start gap-3 py-2.5 cursor-pointer ${
                isActive ? "bg-amber-50" : ""
              }`}
            >
              {isPending ? (
                <Loader2 className="w-4 h-4 mt-0.5 text-amber-400 animate-spin" />
              ) : (
                <Building2
                  className="w-4 h-4 mt-0.5 text-amber-600"
                  strokeWidth={isActive ? 2.5 : 2}
                />
              )}
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
              {isActive && !isPending && (
                <CheckCircle2 className="w-4 h-4 text-amber-600" />
              )}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
