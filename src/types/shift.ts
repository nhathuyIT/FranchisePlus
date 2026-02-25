import type { ID, BaseTimestamp, SoftDeletable, Activatable } from "./common";

/**
 * Shift entity - work shifts for franchise
 */
export interface Shift extends BaseTimestamp, SoftDeletable, Activatable {
  id: ID;
  franchiseId: ID;
  name: string; // Morning / Evening
  startTime: string; // time format
  endTime: string; // time format
}

/**
 * Shift assignment status
 */
export type ShiftAssignmentStatus = "ASSIGNED" | "COMPLETED" | "ABSENT";

/**
 * ShiftAssignment - assigns users to shifts
 * UNIQUE (shift_id, user_id, work_date)
 */
export interface ShiftAssignment extends BaseTimestamp, SoftDeletable {
  id: ID;
  shiftId: ID;
  userId: ID;
  workDate: string; // date - Ngày làm việc
  assignedBy: ID; // Manager assign
  status: ShiftAssignmentStatus;
}
