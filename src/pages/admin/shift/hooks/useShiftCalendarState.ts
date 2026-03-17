import { useState } from "react";
import {
  addDays,
  addMonths,
  buildCalendarDays,
  formatCalendarLabel,
  formatDateKey,
  normalizeDateKey,
  parseDateKey,
  type ShiftCalendarView,
} from "../utils/shiftFormatters";

export function useShiftCalendarState(
  initialDateKey = formatDateKey(new Date()),
) {
  const normalizedInitialDate = normalizeDateKey(initialDateKey);
  const [view, setView] = useState<ShiftCalendarView>("month");
  const [selectedDateKey, setSelectedDateKey] =
    useState<string>(normalizedInitialDate);
  const [cursorDate, setCursorDate] = useState<Date>(
    parseDateKey(normalizedInitialDate),
  );

  const days = buildCalendarDays(view, cursorDate);
  const label = formatCalendarLabel(view, cursorDate);

  function selectDate(dateKey: string) {
    const normalizedDate = normalizeDateKey(dateKey);
    setSelectedDateKey(normalizedDate);
    setCursorDate(parseDateKey(normalizedDate));
  }

  function goToPrevious() {
    setCursorDate((currentDate) =>
      view === "week" ? addDays(currentDate, -7) : addMonths(currentDate, -1),
    );
  }

  function goToNext() {
    setCursorDate((currentDate) =>
      view === "week" ? addDays(currentDate, 7) : addMonths(currentDate, 1),
    );
  }

  function goToToday() {
    selectDate(formatDateKey(new Date()));
  }

  return {
    view,
    setView,
    selectedDateKey,
    cursorDate,
    days,
    label,
    selectDate,
    goToPrevious,
    goToNext,
    goToToday,
  };
}
