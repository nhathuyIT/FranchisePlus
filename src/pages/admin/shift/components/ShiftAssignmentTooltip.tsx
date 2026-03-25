import { useEffect, useRef, useState } from "react";
import { Clock, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import type { ShiftCalendarEvent } from "../hooks/useShiftPageData";
import {
  formatTimeLabel,
  getDisplayShiftName,
  getShiftStatusClasses,
  getShiftStatusLabel,
  getUserInitials,
} from "../utils/shiftFormatters";

type ShiftAssignmentTooltipProps = {
  event: ShiftCalendarEvent;
  label?: string;
  isActive?: boolean;
  franchiseName?: string;
  onSelect: () => void;
};

export function ShiftAssignmentTooltip({
  event,
  label,
  isActive = false,
  franchiseName,
  onSelect,
}: ShiftAssignmentTooltipProps) {
  const [open, setOpen] = useState(false);
  const openTimeoutRef = useRef<number | null>(null);
  const closeTimeoutRef = useRef<number | null>(null);
  const displayLabel = getDisplayShiftName(
    label ?? event.shiftName ?? event.taskName,
  );
  const displayShiftName = getDisplayShiftName(event.shiftName);

  const clearTimeoutRef = (timeoutRef: { current: number | null }) => {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const openPreview = () => {
    clearTimeoutRef(closeTimeoutRef);

    if (open || openTimeoutRef.current !== null) {
      return;
    }

    openTimeoutRef.current = window.setTimeout(() => {
      setOpen(true);
      openTimeoutRef.current = null;
    }, 110);
  };

  const closePreview = () => {
    clearTimeoutRef(openTimeoutRef);

    if (!open && closeTimeoutRef.current !== null) {
      return;
    }

    closeTimeoutRef.current = window.setTimeout(() => {
      setOpen(false);
      closeTimeoutRef.current = null;
    }, 140);
  };

  const closePreviewImmediately = () => {
    clearTimeoutRef(openTimeoutRef);
    clearTimeoutRef(closeTimeoutRef);
    setOpen(false);
  };

  useEffect(() => {
    return () => {
      clearTimeoutRef(openTimeoutRef);
      clearTimeoutRef(closeTimeoutRef);
    };
  }, []);

  if (!displayLabel) {
    return null;
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          onPointerEnter={openPreview}
          onPointerLeave={closePreview}
          onFocus={() => {
            clearTimeoutRef(closeTimeoutRef);
            clearTimeoutRef(openTimeoutRef);
            setOpen(true);
          }}
          onBlur={closePreviewImmediately}
          onClick={() => {
            closePreviewImmediately();
            onSelect();
          }}
          className={cn(
            "w-full rounded-xl border px-3 py-2 text-left text-xs transition hover:-translate-y-0.5 hover:shadow-sm",
            getShiftStatusClasses(event.status),
            isActive && "ring-2 ring-[#6D4C41]/20",
          )}
        >
          <span className="block truncate font-semibold">{displayLabel}</span>
          <div className="mt-1 flex items-center gap-1 opacity-75">
            <Clock className="h-3 w-3 shrink-0" />
            <span className="truncate">
              {formatTimeLabel(event.startTime)} -{" "}
              {formatTimeLabel(event.endTime)}
            </span>
          </div>
          <div className="mt-0.5 flex items-center gap-1 opacity-75">
            <User className="h-3 w-3 shrink-0" />
            <span className="truncate">{event.employeeName}</span>
          </div>
        </button>
      </PopoverTrigger>

      <PopoverContent
        side="top"
        align="start"
        sideOffset={10}
        onOpenAutoFocus={(previewEvent) => previewEvent.preventDefault()}
        onCloseAutoFocus={(previewEvent) => previewEvent.preventDefault()}
        onPointerEnter={openPreview}
        onPointerLeave={closePreview}
        className="w-72 rounded-2xl border border-[#E8DFD6] bg-white/95 p-4 shadow-[0_20px_50px_rgba(93,64,55,0.18)]"
      >
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 space-y-2">
              {displayShiftName ? (
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#A1887F]">
                    Shift
                  </p>
                  <p className="mt-1 truncate text-sm font-semibold text-[#3E2723]">
                    {displayShiftName}
                  </p>
                </div>
              ) : null}

              {franchiseName ? (
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#A1887F]">
                    Franchise
                  </p>
                  <p className="mt-1 truncate text-sm font-semibold text-[#3E2723]">
                    {franchiseName}
                  </p>
                </div>
              ) : null}
            </div>

            <Badge
              variant="outline"
              className={cn(
                "border px-2.5 py-1 text-[11px] font-semibold",
                getShiftStatusClasses(event.status),
              )}
            >
              {getShiftStatusLabel(event.status)}
            </Badge>
          </div>

          <div className="rounded-2xl border border-[#F0E5DA] bg-[#FCF8F5] p-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#A1887F]">
              Employee
            </p>

            <div className="mt-3 flex items-center gap-3">
              <Avatar size="lg" className="border border-[#E8DFD6]">
                {event.employeeAvatarUrl ? (
                  <AvatarImage
                    src={event.employeeAvatarUrl}
                    alt={event.employeeName}
                  />
                ) : null}
                <AvatarFallback className="bg-[#F3E7DB] font-semibold text-[#6D4C41]">
                  {getUserInitials(event.employeeName)}
                </AvatarFallback>
              </Avatar>

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-[#3E2723]">
                  {event.employeeName}
                </p>
              </div>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
