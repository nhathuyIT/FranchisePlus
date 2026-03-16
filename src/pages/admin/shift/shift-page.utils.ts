import type { ShiftAssignmentStatus } from "@/types/shift-assignment.type";

export type AssignShiftFormState = {
  userId: string;
  workDate: string;
  note: string;
};

export type CalendarCell = {
  date: Date;
  dateKey: string;
  isCurrentMonth: boolean;
};

export const WEEKDAY_LABELS = [
  "Sun",
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
] as const;

export const formatDateKey = (date: Date) => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export const parseDateKey = (dateKey: string) => {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(year, month - 1, day);
};

export const startOfMonth = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), 1);

export const normalizeWorkDate = (workDate: string) => workDate.slice(0, 10);

export const formatMonthLabel = (date: Date) =>
  new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(date);

export const formatReadableDate = (
  dateKey: string,
  options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  },
) => new Intl.DateTimeFormat("en-US", options).format(parseDateKey(dateKey));

export const formatClock = (value?: string) => {
  if (!value) return "--:--";
  return value.slice(0, 5);
};

export const buildCalendarDays = (monthCursor: Date): CalendarCell[] => {
  const monthStart = startOfMonth(monthCursor);
  const gridStart = new Date(
    monthStart.getFullYear(),
    monthStart.getMonth(),
    1 - monthStart.getDay(),
  );

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(
      gridStart.getFullYear(),
      gridStart.getMonth(),
      gridStart.getDate() + index,
    );

    return {
      date,
      dateKey: formatDateKey(date),
      isCurrentMonth: date.getMonth() === monthCursor.getMonth(),
    };
  });
};

export const getStatusStyles = (status: ShiftAssignmentStatus) => {
  switch (status) {
    case "COMPLETED":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
    case "ABSENT":
      return "border-rose-200 bg-rose-50 text-rose-700";
    case "CANCELED":
      return "border-slate-200 bg-slate-100 text-slate-600";
    case "ASSIGNED":
    default:
      return "border-amber-200 bg-amber-50 text-amber-700";
  }
};
