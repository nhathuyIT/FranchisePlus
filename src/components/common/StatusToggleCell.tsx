import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

interface StatusToggleCellProps {
  isActive: boolean;
  onToggle: (newValue: boolean) => void;
  isPending?: boolean;
  disabled?: boolean;
}

export const StatusToggleCell = ({
  isActive,
  onToggle,
  isPending = false,
  disabled = false,
}: StatusToggleCellProps) => {
  if (disabled) {
    return (
      <Badge
        variant={isActive ? "default" : "secondary"}
        className={
          isActive
            ? "bg-green-600 hover:bg-green-700 rounded-full text-xs"
            : "bg-gray-500 hover:bg-gray-600 rounded-full text-xs"
        }
      >
        {isActive ? "Active" : "Inactive"}
      </Badge>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <Switch
          checked={isActive}
          onCheckedChange={onToggle}
          disabled={isPending}
          className="data-[state=checked]:bg-green-600"
        />
        {isPending && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="h-3 w-3 animate-spin text-white" />
          </div>
        )}
      </div>
      <span
        className={`text-xs font-medium ${
          isActive ? "text-green-600" : "text-gray-500"
        }`}
      >
        {isActive ? "Active" : "Inactive"}
      </span>
    </div>
  );
};
