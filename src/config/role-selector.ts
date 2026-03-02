import type { AvailableContext } from "./permission";

export interface RoleSelectionProps {
  availableRoles: AvailableContext[];
  onSelectRole: (roleContext: AvailableContext) => void;
}
