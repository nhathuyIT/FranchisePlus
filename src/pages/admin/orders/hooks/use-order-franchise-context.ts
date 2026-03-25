import { useState } from "react";
import { useFranchiseSelect } from "@/hooks/franchise";
import { useAuthStore } from "@/stores/auth-store";

const normalizeRoleCode = (value?: string | null) => {
  const normalized = (value || "")
    .trim()
    .toUpperCase()
    .replace(/[\s-]+/g, "_");

  if (normalized.includes("ADMIN")) return "ADMIN";
  if (normalized.includes("MANAGER")) return "MANAGER";
  if (normalized.includes("STAFF") || normalized.includes("EMPLOYEE")) {
    return "STAFF";
  }

  return normalized;
};

export const useOrderFranchiseContext = () => {
  const { authUser, getCurrentRole, isAdmin } = useAuthStore();
  const currentRole = getCurrentRole();
  const currentRoleCode = normalizeRoleCode(
    currentRole?.code || currentRole?.name,
  );
  const canSelectFranchise = isAdmin();
  const { data: franchiseOptions = [], isLoading: isLoadingFranchises } =
    useFranchiseSelect(canSelectFranchise);
  const isManager = currentRoleCode === "MANAGER";
  const isStaff = !canSelectFranchise && !isManager;
  const currentRoleId = authUser?.currentRoleId;
  const franchiseRoles = authUser?.franchiseRoles ?? [];
  const currentFranchiseId = authUser?.currentFranchiseId
    ? String(authUser.currentFranchiseId)
    : "";
  const currentStaffId = authUser?.user?.id ? String(authUser.user.id) : "";

  const [selectedFranchiseId, setSelectedFranchiseId] =
    useState(currentFranchiseId);

  const activeFranchiseId = canSelectFranchise
    ? selectedFranchiseId
    : currentFranchiseId;

  const fallbackFranchiseName = franchiseRoles.find((assignment) => {
    const franchiseId = assignment.franchiseId
      ? String(assignment.franchiseId)
      : "";

    if (franchiseId !== activeFranchiseId) {
      return false;
    }

    if (!currentRoleId) {
      return true;
    }

    return assignment.roleId === currentRoleId;
  })?.franchiseName;

  const activeFranchise =
    franchiseOptions.find((option) => option.value === activeFranchiseId) ??
    (!activeFranchiseId && !fallbackFranchiseName
      ? undefined
      : {
          value: activeFranchiseId,
          name: fallbackFranchiseName || activeFranchiseId,
          code: "",
        });

  const listScope = canSelectFranchise
    ? "admin"
    : isManager
      ? "manager"
      : "staff";
  const hasListContext =
    listScope === "staff" ? Boolean(currentStaffId) : Boolean(activeFranchiseId);

  return {
    currentRoleCode,
    canSelectFranchise,
    isManager,
    isStaff,
    listScope,
    franchiseOptions,
    isLoadingFranchises,
    selectedFranchiseId,
    setSelectedFranchiseId,
    activeFranchiseId,
    activeFranchise,
    hasFranchiseSelected: Boolean(activeFranchiseId),
    hasListContext,
    currentFranchiseId,
    currentStaffId,
  };
};
