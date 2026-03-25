import type { ShiftAssignmentStatus } from "@/types/shift-assignment.type";

export type ShiftCalendarView = "month" | "week";
export type ShiftSearchMode = "userName" | "shiftName" | "franchiseName";

export type ShiftCalendarDay = {
  date: Date;
  dateKey: string;
  isCurrentPeriod: boolean;
  isToday: boolean;
};

export const SHIFT_WEEKDAY_LABELS = [
  "Sun",
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
] as const;

export function formatDateKey(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function normalizeDateKey(value?: string) {
  if (!value) {
    return formatDateKey(new Date());
  }

  return value.slice(0, 10);
}

export function parseDateKey(value: string) {
  const normalizedValue = normalizeDateKey(value);
  const [year, month, day] = normalizedValue.split("-").map(Number);

  return new Date(year, month - 1, day);
}

export function addDays(date: Date, amount: number) {
  const nextDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  );
  nextDate.setDate(nextDate.getDate() + amount);
  return nextDate;
}

export function addMonths(date: Date, amount: number) {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1);
}

export function startOfWeek(date: Date) {
  return addDays(date, -date.getDay());
}

export function buildCalendarDays(
  view: ShiftCalendarView,
  cursorDate: Date,
): ShiftCalendarDay[] {
  const todayKey = formatDateKey(new Date());

  if (view === "week") {
    const weekStart = startOfWeek(cursorDate);

    return Array.from({ length: 7 }, (_, index) => {
      const date = addDays(weekStart, index);

      return {
        date,
        dateKey: formatDateKey(date),
        isCurrentPeriod: true,
        isToday: formatDateKey(date) === todayKey,
      };
    });
  }

  const monthStart = new Date(
    cursorDate.getFullYear(),
    cursorDate.getMonth(),
    1,
  );
  const gridStart = addDays(monthStart, -monthStart.getDay());

  return Array.from({ length: 35 }, (_, index) => {
    const date = addDays(gridStart, index);

    return {
      date,
      dateKey: formatDateKey(date),
      isCurrentPeriod: date.getMonth() === cursorDate.getMonth(),
      isToday: formatDateKey(date) === todayKey,
    };
  });
}

export function formatCalendarLabel(view: ShiftCalendarView, cursorDate: Date) {
  if (view === "month") {
    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      year: "numeric",
    }).format(cursorDate);
  }

  const weekStart = startOfWeek(cursorDate);
  const weekEnd = addDays(weekStart, 6);

  return `${new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(weekStart)} - ${new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(weekEnd)}`;
}

export function formatReadableDate(
  value: string,
  options: Intl.DateTimeFormatOptions = {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  },
) {
  return new Intl.DateTimeFormat("en-US", options).format(parseDateKey(value));
}

export function formatTimeLabel(value?: string) {
  if (!value) {
    return "--:--";
  }

  return value.slice(0, 5);
}

export function getDisplayShiftName(value?: string | null) {
  const normalizedValue = value?.trim() ?? "";

  if (!normalizedValue) {
    return "";
  }

  return normalizedValue.toLowerCase() === "unknown shift"
    ? ""
    : normalizedValue;
}

export function hasDisplayShiftName(value?: string | null) {
  return Boolean(getDisplayShiftName(value));
}

export function getShiftStatusLabel(status: ShiftAssignmentStatus) {
  return `${status.charAt(0)}${status.slice(1).toLowerCase()}`;
}

export function getShiftStatusClasses(status: ShiftAssignmentStatus) {
  switch (status) {
    case "COMPLETED":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
    case "ABSENT":
      return "border-amber-200 bg-amber-50 text-amber-700";
    case "CANCELED":
      return "border-rose-200 bg-rose-50 text-rose-700";
    case "ASSIGNED":
    default:
      return "border-sky-200 bg-sky-50 text-sky-700";
  }
}

export function getUserInitials(name: string) {
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  return initials || "NA";
}
